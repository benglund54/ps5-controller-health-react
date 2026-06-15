import { promisify } from "node:util";
import { execFile } from "node:child_process";

const execFileAsync = promisify(execFile);

const ALLOWED_PLAYER_IDS = ["PLAYER001", "PLAYER002", "PLAYER003", "PLAYER004"];

function assertAllowedPlayer(playerId) {
  if (!ALLOWED_PLAYER_IDS.includes(playerId)) {
    throw new Error(`Player ${playerId} is outside demo-owned Salesforce scope.`);
  }
}

async function sfQuery(soql, targetOrg) {
  const { stdout } = await execFileAsync(
    "sf",
    ["data", "query", "--target-org", targetOrg, "--query", soql, "--json"],
    { maxBuffer: 1024 * 1024 * 10 }
  );
  const parsed = JSON.parse(stdout);
  if (parsed.status !== 0) {
    throw new Error("Salesforce query returned non-zero status.");
  }
  return parsed.result.records ?? [];
}

function pricebookNameFromFinalPriceContext(playerId, entitlementType) {
  if (entitlementType === "FREE_REPLACEMENT") return "Warranty Replacement Pricebook";
  if (entitlementType === "DISCOUNTED_UPGRADE") return "Demo Promotional Pricebook";
  if (playerId === "PLAYER004") return "Warranty Replacement Pricebook";
  return "Standard Price Book";
}

function buildOptions({
  recommendationType,
  mockEligibleOptions,
  entitlements,
  standardPriceByProduct,
  promotionalPriceByProduct
}) {
  if (recommendationType === "FIRMWARE_TROUBLESHOOTING") {
    return [];
  }

  if (recommendationType === "PERSONALIZED_UPGRADE") {
    return entitlements
      .filter((e) => e.Entitlement_Type__c === "DISCOUNTED_UPGRADE")
      .map((e, index) => {
        const code = e.Eligible_Product__r?.ProductCode;
        const template =
          mockEligibleOptions.find((opt) => opt.productCode === code) ??
          mockEligibleOptions[index] ??
          {
            id: code?.toLowerCase() ?? `option-${index + 1}`,
            title: code ?? "Controller option",
            description: "Personalized controller option"
          };
        return {
          ...template,
          productCode: code,
          basePrice: standardPriceByProduct[code] ?? template.basePrice ?? null,
          finalPrice: e.Promotional_Price__c ?? promotionalPriceByProduct[code] ?? null,
          priceNote: "Promotional price",
          isDefault: index === 0
        };
      });
  }

  if (recommendationType === "STICK_MODULE_PATH") {
    const moduleEntitlement = entitlements.find(
      (e) => e.Entitlement_Type__c === "MODULE_REPLACEMENT"
    );
    const code = moduleEntitlement?.Eligible_Product__r?.ProductCode ?? "DS-EDGE-MODULE";
    const template =
      mockEligibleOptions.find((opt) => opt.productCode === code) ?? mockEligibleOptions[0];
    return [
      {
        ...template,
        productCode: code,
        basePrice: standardPriceByProduct[code] ?? template?.basePrice ?? null,
        finalPrice:
          moduleEntitlement?.Promotional_Price__c ?? promotionalPriceByProduct[code] ?? null,
        priceNote: "Module replacement",
        isDefault: true
      }
    ];
  }

  // INCLUDED_REPLACEMENT (Sarah path)
  const freeEntitlement = entitlements.find(
    (e) => e.Entitlement_Type__c === "FREE_REPLACEMENT"
  );
  return mockEligibleOptions.map((opt, index) => ({
    ...opt,
    basePrice: standardPriceByProduct[opt.productCode] ?? opt.basePrice ?? null,
    finalPrice:
      opt.productCode === freeEntitlement?.Eligible_Product__r?.ProductCode
        ? (freeEntitlement?.Promotional_Price__c ?? 0)
        : opt.finalPrice,
    isDefault: index === 0
  }));
}

export async function getCrmPlayerContext({
  playerId,
  mockContext,
  targetOrg = "ps5-controller-demo"
}) {
  assertAllowedPlayer(playerId);

  const [contact] = await sfQuery(
    `SELECT Id, FirstName, LastName, PSN_Account_ID__c, PlayStation_Loyalty_Tier__c, PS_Plus_Tier__c, MailingStreet, MailingCity, MailingState, MailingPostalCode, MailingCountry
     FROM Contact
     WHERE Player_ID__c = '${playerId}'
     LIMIT 1`,
    targetOrg
  );
  if (!contact) {
    throw new Error(`No Contact found for ${playerId}.`);
  }

  const [asset] = await sfQuery(
    `SELECT External_Controller_ID__c, Name, SerialNumber, Warranty_Status__c, Warranty_Expiry_Date__c, Product2.ProductCode
     FROM Asset
     WHERE Contact.Player_ID__c = '${playerId}'
     ORDER BY External_Controller_ID__c
     LIMIT 1`,
    targetOrg
  );
  if (!asset) {
    throw new Error(`No Asset found for ${playerId}.`);
  }

  const [firmware] = await sfQuery(
    `SELECT External_Controller_ID__c, Player_ID__c, Current_Firmware_Version__c, Latest_Firmware_Version__c, Update_Available__c
     FROM Device_Firmware_Status__c
     WHERE Player_ID__c = '${playerId}'
     LIMIT 1`,
    targetOrg
  );

  const entitlements = await sfQuery(
    `SELECT External_Entitlement_ID__c, Player_ID__c, Entitlement_Type__c, Eligible_Product__r.ProductCode, Promotional_Price__c, Entitlement_Source__c, Is_Active__c
     FROM Player_Entitlement__c
     WHERE Player_ID__c = '${playerId}' AND Is_Active__c = true
     ORDER BY External_Entitlement_ID__c`,
    targetOrg
  );

  const hasFirmwareOnly = entitlements.some(
    (e) => e.Entitlement_Type__c === "FIRMWARE_ONLY"
  );
  const hasModule = entitlements.some((e) => e.Entitlement_Type__c === "MODULE_REPLACEMENT");
  const hasFreeReplacement = entitlements.some(
    (e) => e.Entitlement_Type__c === "FREE_REPLACEMENT"
  );
  const hasDiscount = entitlements.some(
    (e) => e.Entitlement_Type__c === "DISCOUNTED_UPGRADE"
  );

  let recommendationType = mockContext.recommendation.type;
  if (hasFirmwareOnly || firmware?.Update_Available__c) {
    recommendationType = "FIRMWARE_TROUBLESHOOTING";
  } else if (hasModule) {
    recommendationType = "STICK_MODULE_PATH";
  } else if (hasFreeReplacement) {
    recommendationType = "INCLUDED_REPLACEMENT";
  } else if (hasDiscount) {
    recommendationType = "PERSONALIZED_UPGRADE";
  }

  const productCodes = [
    ...new Set(
      entitlements
        .map((e) => e.Eligible_Product__r?.ProductCode)
        .filter(Boolean)
        .concat(mockContext.recommendation.eligibleOptions.map((o) => o.productCode))
    )
  ];

  const standardPriceByProduct = {};
  const promotionalPriceByProduct = {};
  if (productCodes.length > 0) {
    const pricebookRows = await sfQuery(
      `SELECT Pricebook2.Name, Product2.ProductCode, UnitPrice
       FROM PricebookEntry
       WHERE Product2.ProductCode IN ('${productCodes.join("','")}')
         AND Pricebook2.Name IN ('Standard Price Book','Demo Promotional Pricebook','Warranty Replacement Pricebook')`,
      targetOrg
    );

    for (const row of pricebookRows) {
      const code = row.Product2?.ProductCode;
      const pbName = row.Pricebook2?.Name;
      if (!code || !pbName) continue;
      if (pbName === "Standard Price Book") {
        standardPriceByProduct[code] = row.UnitPrice;
      } else {
        promotionalPriceByProduct[code] = row.UnitPrice;
      }
    }
  }

  for (const entitlement of entitlements) {
    const code = entitlement.Eligible_Product__r?.ProductCode;
    if (!code) continue;
    const pbName = pricebookNameFromFinalPriceContext(
      playerId,
      entitlement.Entitlement_Type__c
    );
    // Keep entitlement price authoritative; fallback only if null.
    if (entitlement.Promotional_Price__c == null) {
      const candidate = promotionalPriceByProduct[code];
      if (candidate != null) entitlement.Promotional_Price__c = candidate;
    }
    entitlement.__pricebookName = pbName;
  }

  const eligibleOptions = buildOptions({
    recommendationType,
    mockEligibleOptions: mockContext.recommendation.eligibleOptions,
    entitlements,
    standardPriceByProduct,
    promotionalPriceByProduct
  });

  return {
    player: {
      ...mockContext.player,
      displayName: `${contact.FirstName ?? ""} ${contact.LastName ?? ""}`.trim(),
      psnAccount: contact.PSN_Account_ID__c ?? mockContext.player.psnAccount,
      loyaltyTier:
        contact.PlayStation_Loyalty_Tier__c ?? mockContext.player.loyaltyTier,
      psPlusTier: contact.PS_Plus_Tier__c ?? mockContext.player.psPlusTier,
      mailingCity: contact.MailingCity ?? mockContext.player.mailingCity,
      mailingState: contact.MailingState ?? mockContext.player.mailingState,
      shippingAddress: {
        name: `${contact.FirstName ?? ""} ${contact.LastName ?? ""}`.trim(),
        line1: contact.MailingStreet ?? "",
        city: contact.MailingCity ?? "",
        state: contact.MailingState ?? "",
        zip: contact.MailingPostalCode ?? "",
        country: contact.MailingCountry ?? "US"
      }
    },
    device: {
      ...mockContext.device,
      controllerModel: asset.Name ?? mockContext.device.controllerModel,
      serialNumber: asset.SerialNumber ?? mockContext.device.serialNumber,
      warrantyStatus: asset.Warranty_Status__c ?? mockContext.device.warrantyStatus,
      firmwareVersion:
        firmware?.Current_Firmware_Version__c ?? mockContext.device.firmwareVersion,
      firmwareLatest:
        firmware?.Latest_Firmware_Version__c ?? mockContext.device.firmwareLatest,
      firmwareUpdateAvailable:
        firmware?.Update_Available__c ?? mockContext.device.firmwareUpdateAvailable
    },
    healthSignal: { ...mockContext.healthSignal },
    recommendation: {
      ...mockContext.recommendation,
      type: recommendationType,
      eligibleOptions,
      requiresPayment:
        recommendationType === "PERSONALIZED_UPGRADE" ||
        recommendationType === "STICK_MODULE_PATH",
      requiresShipping:
        recommendationType === "INCLUDED_REPLACEMENT" ||
        recommendationType === "PERSONALIZED_UPGRADE"
    },
    _crmContext: {
      hasCaseForPlayer: (
        await sfQuery(
          `SELECT External_Case_ID__c FROM Case WHERE Contact.Player_ID__c = '${playerId}' LIMIT 1`,
          targetOrg
        )
      ).length > 0
    }
  };
}

