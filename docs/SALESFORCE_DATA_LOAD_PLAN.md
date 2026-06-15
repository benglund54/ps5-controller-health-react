# Salesforce Data Load Plan

## Overview

This document defines the exact sequence and strategy for loading the four-player demo seed data into a Salesforce org after the metadata has been deployed.

**Target org alias:** `ps5-controller-demo`  
**API version:** 67.0  
**Source CSV location:** `data/salesforce/`  
**Demo date (for warranty validation):** June 2024  

---

## Column name mapping: CSV → Salesforce field

Some CSV column names differ from their Salesforce API names due to existing field reconciliation.

| CSV column | Salesforce object | Salesforce field | Notes |
|---|---|---|---|
| `externalPlayerId` | Contact | `Player_ID__c` | New External ID field |
| `firstName` | Contact | `FirstName` | Standard |
| `lastName` | Contact | `LastName` | Standard |
| `email` | Contact | `Email` | Standard |
| `phone` | Contact | `Phone` | Standard |
| `psnHandle` | Contact | `PSN_Account_ID__c` | **Existing field** — not renamed |
| `loyaltyTier__c` | Contact | `PlayStation_Loyalty_Tier__c` | **Existing field** — not renamed; values Gold/Platinum/Silver match picklist |
| `psPlusTier__c` | Contact | `PS_Plus_Tier__c` | **Existing field** — values match |
| `accountCreatedDate` | Contact | `Account_Created_Date__c` | New custom Date field |
| `mailingStreet` | Contact | `MailingStreet` | Standard |
| `mailingCity` | Contact | `MailingCity` | Standard |
| `mailingState` | Contact | `MailingState` | Standard |
| `mailingPostalCode` | Contact | `MailingPostalCode` | Standard |
| `mailingCountry` | Contact | `MailingCountry` | Standard |
| `externalControllerId` | Asset | `External_Controller_ID__c` | New External ID field |
| `controllerSerialNumber` | Asset | `SerialNumber` | Standard |
| `productCode` | Asset | via `Product2Id` lookup | Resolve Product2 by `ProductCode` before load |
| `controllerModel` | Asset | `Name` | Use `productName` from products.csv |
| `purchaseDate` | Asset | `PurchaseDate` | Standard |
| `registrationDate` | Asset | `InstallDate` | Standard (closest standard field) |
| `warrantyMonths` | Asset | `Warranty_Months__c` | New custom Number field |
| `warrantyExpiryDate` | Asset | `Warranty_Expiry_Date__c` | New custom Date field |
| `warrantyStatus` | Asset | `Warranty_Status__c` | New custom Picklist field |
| `assetStatus` | Asset | `Status` | Standard picklist — "Purchased" is valid |
| `externalPlayerId` | Asset | via `ContactId` lookup | Resolve Contact by `Player_ID__c` |
| `caseId` | Case | `External_Case_ID__c` | New External ID field |
| `externalPlayerId` | Case | via `ContactId` lookup | Resolve Contact by `Player_ID__c` |
| `controllerSerialNumber` | Case | `Controller_Serial__c` | New custom Text field |
| `openedDate` | Case | `CreatedDate` | Read-only on Case; use `SuppliedEmail` alternative or load via API with suppressTriggers if needed |
| `subject` | Case | `Subject` | Standard |
| `description` | Case | `Description` | Standard |
| `caseStatus` | Case | `Status` | Standard |
| `caseType` | Case | `Type` | Standard |
| `entitlementId` | Player_Entitlement__c | `External_Entitlement_ID__c` | New External ID |
| `externalPlayerId` | Player_Entitlement__c | `Player_ID__c` | Cross-reference text field |
| `entitlementType` | Player_Entitlement__c | `Entitlement_Type__c` | Picklist |
| `eligibleProductCode` | Player_Entitlement__c | `Eligible_Product__c` | Lookup — resolve by Product2.ProductCode |
| `promotionalPrice` | Player_Entitlement__c | `Promotional_Price__c` | Currency — blank rows load as null |
| `entitlementSource` | Player_Entitlement__c | `Entitlement_Source__c` | Picklist |
| `validFrom` | Player_Entitlement__c | `Valid_From__c` | Date |
| `validTo` | Player_Entitlement__c | `Valid_To__c` | Date |
| `isActive` | Player_Entitlement__c | `Is_Active__c` | Checkbox |
| `externalControllerId` | Device_Firmware_Status__c | `External_Controller_ID__c` | External ID |
| `controllerSerialNumber` | Device_Firmware_Status__c | `Controller_Serial_Number__c` | Text |
| `externalPlayerId` | Device_Firmware_Status__c | `Player_ID__c` | Text |
| `currentFirmwareVersion` | Device_Firmware_Status__c | `Current_Firmware_Version__c` | Text |
| `latestFirmwareVersion` | Device_Firmware_Status__c | `Latest_Firmware_Version__c` | Text |
| `updateAvailable` | Device_Firmware_Status__c | `Update_Available__c` | Checkbox |
| `lastCheckedAt` | Device_Firmware_Status__c | `Last_Checked_At__c` | DateTime |
| `updateChannel` | Device_Firmware_Status__c | `Update_Channel__c` | Picklist |

---

## Columns to drop before load

These CSV columns have no Salesforce target and must be excluded from the load file:

| CSV file | Column | Reason |
|---|---|---|
| `data/salesforce/cases.csv` | `closedDate` | `Case.ClosedDate` is a system-managed, read-only field. It is auto-populated by Salesforce when `Status = Closed`. Cannot be set via API. Preserve value in CSV for documentation purposes only. |
| `data/salesforce/cases.csv` | `resolution` | No standard `Case.Resolution` field exists in Salesforce. The narrative is contextually available in the `description` column already. Drop this column; `Case.Status = Closed` conveys resolution state. |
| `data/salesforce/pricebook_entries.csv` | `notes` | No standard or custom `Notes` field exists on `PricebookEntry`. Column is for human-readable documentation in the CSV only. Drop before load. |

---

## Load order

Dependencies must be respected. Load in this exact sequence.

### Step 1 — Product2

**CSV:** `data/salesforce/products.csv`  
**Upsert key:** `ProductCode` (standard field — always set as external ID for upsert)  
**Records:** 4  
**Prerequisites:** `force-app/main/default/objects/Product2/fields/Family.field-meta.xml` deployed. This metadata file defines the required `Product2.Family` picklist values (`Controller-Standard`, `Controller-Premium`, `Controller-Limited`, `Controller-Accessory`). Without deployment of this file first, the upsert will fail with `INVALID_OR_NULL_FOR_RESTRICTED_PICKLIST`.  

```bash
sf data upsert bulk \
  --sobject Product2 \
  --file data/salesforce/products.csv \
  --external-id ProductCode \
  --target-org ps5-controller-demo \
  --wait 10
```

**Column mapping notes:**
- `productCode` → `ProductCode`
- `productName` → `Name`
- `productFamily` → `Family`
- `description` → `Description`
- `isActive` → `IsActive`

---

### Step 2 — Pricebook2 + PricebookEntry

**CSV:** `data/salesforce/pricebook_entries.csv`  
**Records:** 9 entries across 3 pricebooks  

**Manual step required.** Pricebook2 records cannot be created via standard `sf data upsert bulk` in the same pass as PricebookEntry because PricebookEntry requires the Pricebook2 Id and the Product2 Id resolved first.

**Recommended approach:**

1. Verify or create Pricebook2 records in the org via UI or SOQL:
   - "Standard Price Book" (system-created, always exists)
   - "Demo Promotional Pricebook" (create manually or via API)
   - "Warranty Replacement Pricebook" (create manually or via API)

2. Query their IDs:
   ```sql
   SELECT Id, Name FROM Pricebook2
   ```

3. Query Product2 IDs:
   ```sql
   SELECT Id, ProductCode FROM Product2
   ```

4. Build a resolved `pricebook_entries_resolved.csv` with `Pricebook2Id` and `Product2Id` columns substituted.

5. Upsert PricebookEntry (no standard External ID; use composite key or insert):
   ```bash
   sf data import bulk \
     --sobject PricebookEntry \
     --file data/salesforce/pricebook_entries_resolved.csv \
     --target-org ps5-controller-demo \
     --wait 10
   ```

---

### Step 3 — Contact

**CSV:** `data/salesforce/contacts.csv`  
**Upsert key:** `Player_ID__c` (new External ID field)  
**Records:** 4  
**Prerequisites:** Metadata for `Player_ID__c`, `PSN_Account_ID__c`, `PlayStation_Loyalty_Tier__c`, `PS_Plus_Tier__c`, `Account_Created_Date__c` deployed  

```bash
sf data upsert bulk \
  --sobject Contact \
  --file data/salesforce/contacts.csv \
  --external-id Player_ID__c \
  --target-org ps5-controller-demo \
  --wait 10
```

**Column rename required before load:**
| CSV column | Rename to |
|---|---|
| `externalPlayerId` | `Player_ID__c` |
| `psnHandle` | `PSN_Account_ID__c` |
| `loyaltyTier__c` | `PlayStation_Loyalty_Tier__c` |
| `psPlusTier__c` | `PS_Plus_Tier__c` |
| `accountCreatedDate` | `Account_Created_Date__c` |
| `mailingStreet` | `MailingStreet` |
| `mailingCity` | `MailingCity` |
| `mailingState` | `MailingState` |
| `mailingPostalCode` | `MailingPostalCode` |
| `mailingCountry` | `MailingCountry` |

---

### Step 4 — Asset

**CSV:** `data/salesforce/assets.csv`  
**Upsert key:** `External_Controller_ID__c`  
**Records:** 4  
**Prerequisites:** Contact records loaded (Step 3), Product2 records loaded (Step 1), all Asset custom fields deployed  

**Lookup resolution required before load:**
- `externalPlayerId` → resolve to `ContactId` via SOQL on `Contact.Player_ID__c`
- `productCode` → resolve to `Product2Id` via SOQL on `Product2.ProductCode`

**Column rename and resolution:**
| CSV column | Target field | Resolution |
|---|---|---|
| `externalControllerId` | `External_Controller_ID__c` | Direct |
| `controllerModel` | `Name` | Use `productName` value from products.csv |
| `registrationDate` | `InstallDate` | Rename |
| `assetStatus` | `Status` | Rename |
| (resolved) | `ContactId` | SOQL lookup |
| (resolved) | `Product2Id` | SOQL lookup |

```bash
sf data upsert bulk \
  --sobject Asset \
  --file data/salesforce/assets_resolved.csv \
  --external-id External_Controller_ID__c \
  --target-org ps5-controller-demo \
  --wait 10
```

---

### Step 5 — Case

**CSV:** `data/salesforce/cases.csv`  
**Upsert key:** `External_Case_ID__c`  
**Records:** 3 (PLAYER001, PLAYER002, PLAYER003; PLAYER004 has no case by design)  
**Prerequisites:** Contact records loaded (Step 3)  

**Lookup resolution required:**
- `externalPlayerId` → resolve to `ContactId`
- Set `Status = Closed`, `Origin = Web` or `Phone` (required standard fields)

**Note on `openedDate`:** Case `CreatedDate` is read-only in Salesforce. The demo uses `External_Case_ID__c` as the key; historical dates can be stored in a custom `Case_Opened_Date__c` field if needed in a future enhancement. For now, load without date override.

```bash
sf data upsert bulk \
  --sobject Case \
  --file data/salesforce/cases_resolved.csv \
  --external-id External_Case_ID__c \
  --target-org ps5-controller-demo \
  --wait 10
```

---

### Step 6 — Player_Entitlement__c

**CSV:** `data/salesforce/player_entitlements.csv`  
**Upsert key:** `External_Entitlement_ID__c`  
**Records:** 6  
**Prerequisites:** Contact and Product2 records loaded, custom object and fields deployed  

**Lookup resolution required:**
- `eligibleProductCode` → resolve to `Eligible_Product__c` (Product2 lookup) via `Product2.ProductCode`
- FIRMWARE_ONLY row (ENT-003) has blank `eligibleProductCode` → leave `Eligible_Product__c` null

```bash
sf data upsert bulk \
  --sobject Player_Entitlement__c \
  --file data/salesforce/player_entitlements_resolved.csv \
  --external-id External_Entitlement_ID__c \
  --target-org ps5-controller-demo \
  --wait 10
```

---

### Step 7 — Device_Firmware_Status__c

**CSV:** `data/salesforce/device_firmware_status.csv`  
**Upsert key:** `External_Controller_ID__c`  
**Records:** 4  
**Prerequisites:** Custom object and fields deployed  

**No lookup resolution required** — all join fields are text cross-references, not Salesforce lookups.

```bash
sf data upsert bulk \
  --sobject Device_Firmware_Status__c \
  --file data/salesforce/device_firmware_status.csv \
  --external-id External_Controller_ID__c \
  --target-org ps5-controller-demo \
  --wait 10
```

**Column rename required:**
| CSV column | Target field |
|---|---|
| `externalControllerId` | `External_Controller_ID__c` |
| `externalPlayerId` | `Player_ID__c` |
| `currentFirmwareVersion` | `Current_Firmware_Version__c` |
| `latestFirmwareVersion` | `Latest_Firmware_Version__c` |
| `updateAvailable` | `Update_Available__c` |
| `lastCheckedAt` | `Last_Checked_At__c` |
| `updateChannel` | `Update_Channel__c` |

---

### Step 8 — Recommendation_Outcome__c (optional seed)

**CSV:** `data/salesforce/recommendation_outcomes_preview.csv`  
**Note:** The CSV contains one example row only (labeled as such). Do **not** load this record unless write-back is explicitly approved. This object is populated at runtime by middleware, not from seed CSV.

---

## External ID strategy summary

| Object | External ID field | CSV column | Unique? |
|---|---|---|---|
| Contact | `Player_ID__c` | `externalPlayerId` | Yes |
| Asset | `External_Controller_ID__c` | `externalControllerId` | Yes |
| Product2 | `ProductCode` (standard) | `productCode` | Yes |
| Case | `External_Case_ID__c` | `caseId` | No (unique per org, not globally) |
| Player_Entitlement__c | `External_Entitlement_ID__c` | `entitlementId` | Yes |
| Device_Firmware_Status__c | `External_Controller_ID__c` | `externalControllerId` | No (one record per device) |
| Recommendation_Outcome__c | `External_Outcome_ID__c` | `outcomeId` | Yes |

---

## Pricebook2 manual steps

Pricebook2 records cannot be upserted from standard CSV in the same way as other objects. Required manual or scripted steps:

1. **Standard Price Book** — always exists in every Salesforce org. Query its Id before loading PricebookEntry.
2. **Demo Promotional Pricebook** — create via Setup UI or Apex:
   ```apex
   insert new Pricebook2(Name='Demo Promotional Pricebook', IsActive=true);
   ```
3. **Warranty Replacement Pricebook** — create similarly:
   ```apex
   insert new Pricebook2(Name='Warranty Replacement Pricebook', IsActive=true);
   ```
4. Query all three Pricebook2 Ids and add them to the PricebookEntry load CSV.

---

## SOQL validation queries

Run these queries after each load step to verify record counts and data integrity.

### After Step 1 — Product2
```sql
SELECT ProductCode, Name, Family, IsActive
FROM Product2
WHERE ProductCode IN ('DS-STANDARD','DS-EDGE','DS-LIMITED','DS-EDGE-MODULE')
ORDER BY ProductCode
```
Expected: 4 rows

### After Step 2 — PricebookEntry
```sql
SELECT Pricebook2.Name, Product2.ProductCode, UnitPrice, IsActive
FROM PricebookEntry
WHERE Product2.ProductCode IN ('DS-STANDARD','DS-EDGE','DS-LIMITED','DS-EDGE-MODULE')
ORDER BY Pricebook2.Name, Product2.ProductCode
```
Expected: 9 rows (4 MSRP + 3 promo + 1 warranty-free Sarah + 1 warranty module Alex)

### After Step 3 — Contact
```sql
SELECT Player_ID__c, FirstName, LastName, PSN_Account_ID__c,
       PlayStation_Loyalty_Tier__c, PS_Plus_Tier__c, Account_Created_Date__c
FROM Contact
WHERE Player_ID__c IN ('PLAYER001','PLAYER002','PLAYER003','PLAYER004')
ORDER BY Player_ID__c
```
Expected: 4 rows

### After Step 4 — Asset
```sql
SELECT External_Controller_ID__c, Name, SerialNumber,
       Warranty_Status__c, Warranty_Expiry_Date__c, Warranty_Months__c,
       Contact.Player_ID__c, Product2.ProductCode
FROM Asset
WHERE External_Controller_ID__c IN ('CTRL-001','CTRL-002','CTRL-003','CTRL-004')
ORDER BY External_Controller_ID__c
```
Expected: 4 rows

#### Cross-check warranty status
```sql
SELECT External_Controller_ID__c, SerialNumber, Warranty_Status__c, Warranty_Expiry_Date__c,
       CASE WHEN Warranty_Expiry_Date__c >= TODAY THEN 'IN_WARRANTY' ELSE 'OUT_OF_WARRANTY' END
FROM Asset
WHERE External_Controller_ID__c IN ('CTRL-001','CTRL-002','CTRL-003','CTRL-004')
```
Expected: CTRL-001 and CTRL-003 → IN_WARRANTY; CTRL-002 and CTRL-004 → OUT_OF_WARRANTY

### After Step 5 — Case
```sql
SELECT External_Case_ID__c, Subject, Status, Contact.Player_ID__c, Controller_Serial__c
FROM Case
WHERE External_Case_ID__c IN ('CASE-001','CASE-002','CASE-003')
ORDER BY External_Case_ID__c
```
Expected: 3 rows (no PLAYER004 case)

### After Step 6 — Player_Entitlement__c
```sql
SELECT External_Entitlement_ID__c, Player_ID__c, Entitlement_Type__c,
       Eligible_Product__r.ProductCode, Promotional_Price__c, Entitlement_Source__c,
       Is_Active__c
FROM Player_Entitlement__c
ORDER BY External_Entitlement_ID__c
```
Expected: 6 rows

#### Validate each player has at least one active entitlement
```sql
SELECT Player_ID__c, COUNT(Id) entitlementCount
FROM Player_Entitlement__c
WHERE Is_Active__c = true
GROUP BY Player_ID__c
ORDER BY Player_ID__c
```
Expected: PLAYER001=1, PLAYER002=3, PLAYER003=1, PLAYER004=1

### After Step 7 — Device_Firmware_Status__c
```sql
SELECT External_Controller_ID__c, Controller_Serial_Number__c, Player_ID__c,
       Current_Firmware_Version__c, Latest_Firmware_Version__c, Update_Available__c
FROM Device_Firmware_Status__c
ORDER BY Player_ID__c
```
Expected: 4 rows. Only PLAYER003 (Nina) should have `Update_Available__c = true`.

---

## Rollback / cleanup approach

If a load step fails or produces bad data, run these in reverse load order:

```bash
# Delete all demo seed records (safe for demo org only)
sf data delete bulk --sobject Device_Firmware_Status__c \
  --where "Player_ID__c IN ('PLAYER001','PLAYER002','PLAYER003','PLAYER004')" \
  --target-org ps5-controller-demo

sf data delete bulk --sobject Player_Entitlement__c \
  --where "Player_ID__c IN ('PLAYER001','PLAYER002','PLAYER003','PLAYER004')" \
  --target-org ps5-controller-demo

sf data delete bulk --sobject Recommendation_Outcome__c \
  --where "Player_ID__c IN ('PLAYER001','PLAYER002','PLAYER003','PLAYER004')" \
  --target-org ps5-controller-demo

sf data delete bulk --sobject Case \
  --where "External_Case_ID__c IN ('CASE-001','CASE-002','CASE-003')" \
  --target-org ps5-controller-demo

sf data delete bulk --sobject Asset \
  --where "External_Controller_ID__c IN ('CTRL-001','CTRL-002','CTRL-003','CTRL-004')" \
  --target-org ps5-controller-demo

sf data delete bulk --sobject Contact \
  --where "Player_ID__c IN ('PLAYER001','PLAYER002','PLAYER003','PLAYER004')" \
  --target-org ps5-controller-demo
```

**Do not delete Product2 or PricebookEntry records without explicit approval** — these are shared catalog objects that may be referenced by other features in the org.

---

## Pre-load checklist

Before running any load commands, confirm:

- [ ] `sf org login web -a ps5-controller-demo` completed (with explicit approval)
- [ ] `sf project deploy start --target-org ps5-controller-demo` completed for all new metadata
- [ ] `PS5_Controller_Health_Demo_Access` permission set assigned to demo user
- [ ] Product2 load (Step 1) succeeded before any subsequent step
- [ ] Pricebook2 records created manually for "Demo Promotional Pricebook" and "Warranty Replacement Pricebook"
- [ ] Contact load (Step 3) succeeded before Asset, Case, Player_Entitlement__c loads
- [ ] All SOQL validation queries return expected record counts
