# PS5 Controller Health — Response Contract v2

This is the canonical JSON contract that the React frontend consumes.
The middleware must return this exact shape regardless of whether the
underlying data comes from mock files, Salesforce, Data Cloud, or Agentforce.

---

## Contract structure

```json
{
  "playerId": "PLAYER001",
  "sessionId": "uuid-v4",
  "generatedAt": "2024-06-10T14:22:00Z",

  "player": {
    "displayName": "Sarah Jeffries",
    "psnAccount": "sarahj_plays",
    "loyaltyTier": "Gold",
    "psPlusTier": "Premium",
    "mailingCity": "San Mateo",
    "mailingState": "CA"
  },

  "device": {
    "controllerModel": "DualSense Wireless Controller",
    "serialNumber": "ZCT1W-0A1B2C3D",
    "warrantyStatus": "IN_WARRANTY",
    "firmwareVersion": "3.02",
    "firmwareLatest": "3.02",
    "firmwareUpdateAvailable": false
  },

  "healthSignal": {
    "primaryIssue": "RIGHT_STICK_DRIFT",
    "issueConfidence": "HIGH",
    "rightStickDriftScore": 0.91,
    "leftStickDriftScore": 0.12,
    "disconnectFrequencyScore": 0.08,
    "batteryHealthPercent": 88,
    "sessionHoursL30d": 64
  },

  "recommendation": {
    "type": "INCLUDED_REPLACEMENT",
    "statusChip": "SELF-SERVICE",
    "toast": {
      "title": "Controller health check",
      "message": "Your right stick may not be centering correctly."
    },
    "customerFacingExplanation": "Eligible options are ready based on your controller status.",
    "requiresPayment": false,
    "requiresShipping": true,
    "shippingAddress": {
      "name": "Sarah Jeffries",
      "line1": "1234 PlayStation Way",
      "city": "San Mateo",
      "state": "CA",
      "zip": "94402",
      "country": "US"
    },
    "estimatedDeliveryDays": "2–3 business days",
    "eligibleOptions": [
      {
        "id": "dualsense",
        "productCode": "DS-STANDARD",
        "title": "DualSense Wireless Controller",
        "description": "Included replacement · No payment needed",
        "chip": "Recommended",
        "basePrice": 69.99,
        "finalPrice": 0.00,
        "priceNote": "Included replacement",
        "isDefault": true
      },
      {
        "id": "edge",
        "productCode": "DS-EDGE",
        "title": "DualSense Edge Wireless Controller",
        "description": "Premium upgrade · Replaceable stick modules",
        "chip": "Premium upgrade",
        "basePrice": 169.99,
        "finalPrice": 100.00,
        "priceNote": "Upgrade price"
      },
      {
        "id": "limited",
        "productCode": "DS-LIMITED",
        "title": "Limited Edition Controller",
        "description": "Personalized style option · Availability varies",
        "chip": "Limited edition",
        "basePrice": 139.99,
        "finalPrice": 70.00,
        "priceNote": "Upgrade price"
      }
    ],
    "confirmationCopy": {
      "title": "Replacement confirmed",
      "body": "Your replacement details are ready.",
      "previewOnly": true
    }
  },

  "meta": {
    "source": "MOCK",
    "agentforceSessionId": null,
    "fallbackUsed": false,
    "previewOnly": true,
    "generatedAt": "2024-06-10T14:22:00Z"
  }
}
```

---

## Recommendation types

| `recommendation.type` | Player | Trigger condition |
|---|---|---|
| `INCLUDED_REPLACEMENT` | PLAYER001 / Sarah | In-warranty + high drift confidence |
| `PERSONALIZED_UPGRADE` | PLAYER002 / Marcus | Out-of-warranty + high drift + Platinum loyalty |
| `FIRMWARE_TROUBLESHOOTING` | PLAYER003 / Nina | In-warranty + high disconnect score + firmware outdated |
| `STICK_MODULE_PATH` | PLAYER004 / Alex | DualSense Edge + moderate drift + out-of-warranty |

---

## Per-persona variations

### PLAYER001 — Sarah (INCLUDED_REPLACEMENT)
- `requiresPayment: false`
- `requiresShipping: true`
- `eligibleOptions`: 3 (dualsense free, edge/limited at upgrade delta)
- `firmwareUpdateAvailable: false`
- `statusChip: "SELF-SERVICE"`

### PLAYER002 — Marcus (PERSONALIZED_UPGRADE)
- `requiresPayment: true` (preview checkout only; no real payment processed)
- `requiresShipping: true`
- `eligibleOptions`: 3 (edge/dualsense/limited at promotional price)
- Promotional prices sourced from `Player_Entitlement__c` / Demo Promotional Pricebook
- `statusChip: "PERSONALIZED"`

### PLAYER003 — Nina (FIRMWARE_TROUBLESHOOTING)
- `requiresPayment: false`
- `requiresShipping: false`
- `eligibleOptions`: [] (empty — no replacement offered)
- `firmwareUpdateAvailable: true`
- `statusChip: "TROUBLESHOOTING"`

### PLAYER004 — Alex (STICK_MODULE_PATH)
- `requiresPayment: false` (TBD — module may have a cost)
- `requiresShipping: false` (TBD)
- `eligibleOptions`: 1 (stick module only)
- `firmwareUpdateAvailable: false`
- `statusChip: "MODULE PATH"`

---

## Fields never exposed to the frontend

The middleware must strip these before returning the contract:

| Internal field | Why excluded |
|---|---|
| LTV (lifetime value) | Competitive / privacy sensitive |
| Churn risk score | Internal policy logic |
| Profitability signal | Internal |
| Internal reason codes | Not player-safe |
| Fraud / risk flags | Never exposed |
| `engagementScore` (raw) | Internal routing only |
| `riskScore` (raw) | Internal routing only |
| `discountPercent` (internal) | Use `finalPrice` and `priceNote` instead |
| `requiresHumanReview` (internal) | Demo uses `previewOnly: true` universally |

---

## Data lineage — where each field comes from

| Contract field | Salesforce source | Data Cloud source | Mock source |
|---|---|---|---|
| `playerId` | `Contact.Player_ID__c` | `player_id` | `playerPersonas.ownerId` |
| `player.displayName` | `Contact.FirstName + LastName` | — | `playerPersonas.displayName` |
| `player.psnAccount` | `Contact.PSN_Account__c` | `psn_handle` | `playerPersonas.psnAccount` |
| `player.loyaltyTier` | `Contact.Loyalty_Tier__c` | — | `playerPersonas.loyaltyTier` |
| `player.psPlusTier` | `Contact.PS_Plus_Tier__c` | `ps_plus_tier` | `playerPersonas.psPlusTier` |
| `player.mailingCity/State` | `Contact.MailingCity/State` | — | hardcoded |
| `device.controllerModel` | `Asset.Name` via `Product2.Name` | `controller_model` | `playerPersonas.controllerModel` |
| `device.serialNumber` | `Asset.SerialNumber` | `controller_serial` | `playerPersonas.serial` |
| `device.warrantyStatus` | `Asset.Warranty_Status__c` | `warranty_status` | `mockTelemetry.warrantyStatus` |
| `device.firmwareVersion` | `Device_Firmware_Status__c.Current_Version__c` | `firmware_version` | `mockTelemetry.firmwareVersion` |
| `device.firmwareLatest` | `Device_Firmware_Status__c.Latest_Version__c` | `firmware_latest` | `mockTelemetry.firmwareLatest` |
| `device.firmwareUpdateAvailable` | `Device_Firmware_Status__c.Update_Available__c` | `update_available` | derived |
| `healthSignal.rightStickDriftScore` | — | `right_stick_drift_score` (DMO) | `mockTelemetry.rightStickDriftScore` |
| `healthSignal.disconnectFrequencyScore` | — | `disconnect_frequency_score` (DMO) | `mockTelemetry.disconnectFrequencyScore` |
| `healthSignal.batteryHealthPercent` | — | `battery_health_pct` (DMO) | `mockTelemetry.batteryHealthPercent` |
| `healthSignal.sessionHoursL30d` | — | `session_hours_l30d` (DMO) | `mockTelemetry.sessionHoursL30d` |
| `healthSignal.issueConfidence` | — | `issue_confidence` (DMO) | `mockTelemetry.issueConfidence` |
| `recommendation.type` | derived (middleware) | derived (middleware) | `controllerHealthJourneys.recommendationType` |
| `recommendation.eligibleOptions[].basePrice` | `PricebookEntry.UnitPrice` | — | hardcoded |
| `recommendation.eligibleOptions[].finalPrice` | `Player_Entitlement__c.Promotional_Price__c` | — | hardcoded |
| `recommendation.shippingAddress` | `Contact.MailingAddress` | — | hardcoded |
| `meta.source` | — | — | `"MOCK"` → `"SALESFORCE"` / `"AGENTFORCE"` |
| `meta.previewOnly` | enforced by middleware | enforced by middleware | always `true` |

---

## Middleware behavior

### Source priority (fallback chain)
```
1. Agentforce (recommendation copy + type)    ← future
2. Data Cloud (telemetry + engagement)         ← future
3. Salesforce Core (profile + entitlement)     ← future
4. Mock data (always available baseline)       ← current
```

If any tier fails, the next tier is used without UI outage.

### `meta.source` values
| Value | Meaning |
|---|---|
| `"MOCK"` | All data from local mock files |
| `"SALESFORCE"` | Profile + entitlement from Salesforce; telemetry from mock |
| `"DATACLOUD"` | Telemetry + engagement from Data Cloud; profile from Salesforce |
| `"AGENTFORCE"` | Full Agentforce recommendation; all sources live |
| `"PARTIAL_FALLBACK"` | Mix of live and mock; `fallbackUsed: true` |

---

## Guardrails enforced by middleware

- `previewOnly: true` always set
- No order ID, case ID, claim ID, shipment tracking in response
- No payment processing; `requiresPayment: true` is display-only for checkout preview
- No internal scoring fields forwarded
- `confirmationCopy` is static safe copy; Agentforce may personalize later behind guardrail filter
