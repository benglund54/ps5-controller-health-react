# Optional Salesforce Core 1000-Record Load Plan

These files are optional and **must not** be loaded unless explicitly approved.

Loading these files will modify Salesforce org data.

## Recommended review before load
- Confirm sandbox/demo org target
- Confirm rollback owner
- Confirm duplicate rule impacts
- Confirm lookup resolution scripts are ready

## Load order
1. Contacts
2. Assets (after resolving ContactId and Product2Id)
3. Cases (after resolving ContactId)
4. Player_Entitlement__c (after resolving Product2 lookup)
5. Device_Firmware_Status__c

## Suggested external IDs
- Contact: `Player_ID__c`
- Asset: `External_Controller_ID__c`
- Player_Entitlement__c: `External_Entitlement_ID__c`
- Device_Firmware_Status__c: `External_Controller_ID__c`
- Case: `External_Case_ID__c`

## Lookup resolution requirements
- `assets_1000.csv`: resolve `Player_ID__c` -> `ContactId`, `ProductCode` -> `Product2Id`
- `cases_1000.csv`: resolve `Player_ID__c` -> `ContactId`
- `player_entitlements_1000.csv`: resolve `Eligible_Product_ProductCode` -> `Eligible_Product__c`

## Optional products/pricebook files
Existing 4 demo products and current pricebook logic are sufficient. `products_optional.csv` and `pricebook_entries_optional.csv` are not required.

## Rollback considerations
- Bulk delete by external IDs in reverse load order
- Validate record counts after each step

## Guardrails
- no real orders
- no claims
- no shipments
- no refunds
- no coupons
- no credits or compensation
- no Case writeback beyond synthetic case creation if explicitly approved
