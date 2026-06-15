# 02 CRM Data Stream Mapping

## CRM streams in scope

| Source object | Purpose | Required fields | Target DMO | Key field | Relationship field(s) | Validation expectation |
|---|---|---|---|---|---|---|
| `Contact` | Player identity and profile | `Player_ID__c`, `FirstName`, `LastName`, `Email`, `PSN_Account_ID__c`, `PlayStation_Loyalty_Tier__c`, `PS_Plus_Tier__c`, `MailingCity`, `MailingState` | Unified Individual / Individual | `Player_ID__c` | `Email`, `PSN_Account_ID__c` | 4 records, one per demo player |
| `Asset` | Controller ownership and warranty | `External_Controller_ID__c`, `SerialNumber`, `ContactId` or `Contact.Player_ID__c`, `Product2Id`, `Warranty_Status__c`, `Warranty_Expiry_Date__c` | Controller Device | `External_Controller_ID__c` | `Contact.Player_ID__c`, `SerialNumber`, `Product2.ProductCode` | 4 records, each linked to one player |
| `Product2` | Product catalog context | `ProductCode`, `Name`, `Family`, `IsActive` | Product / Price Context | `ProductCode` | `Family` | 4 records (`DS-STANDARD`, `DS-EDGE`, `DS-LIMITED`, `DS-EDGE-MODULE`) |
| `PricebookEntry` | Base and promotional pricing | `Pricebook2Id`, `Product2Id`, `UnitPrice`, `IsActive` | Product / Price Context | Composite (`Pricebook2Id`,`Product2Id`) | `Product2.ProductCode`, `Pricebook2.Name` | 9 records with expected pricebook coverage |
| `Case` | Historical support context (read-only narrative) | `External_Case_ID__c`, `ContactId`, `Controller_Serial__c`, `Subject`, `Status`, `Type` | Support Interaction Context (optional) | `External_Case_ID__c` | `Contact.Player_ID__c`, `Controller_Serial__c` | 3 records (none for PLAYER004) |
| `Player_Entitlement__c` | Eligibility and promo path | `External_Entitlement_ID__c`, `Player_ID__c`, `Entitlement_Type__c`, `Eligible_Product__c`, `Promotional_Price__c`, `Is_Active__c` | Player Entitlement | `External_Entitlement_ID__c` | `Player_ID__c`, `Eligible_Product__r.ProductCode` | 6 records, active entitlements per player |
| `Device_Firmware_Status__c` | Firmware current/latest state | `External_Controller_ID__c`, `Player_ID__c`, `Controller_Serial_Number__c`, `Current_Firmware_Version__c`, `Latest_Firmware_Version__c`, `Update_Available__c` | Firmware Status | `External_Controller_ID__c` | `Player_ID__c`, `Controller_Serial_Number__c` | 4 records, only PLAYER003 update available |

## Setup notes
- Create CRM streams first before file streams.
- Ensure key fields are marked and available for downstream DMO joins.
- `Case` can be kept optional in first pass if stream setup is constrained.

## Data quality checks

| Check | Expected result |
|---|---|
| Distinct players in `Contact` | 4 (`PLAYER001` to `PLAYER004`) |
| Distinct controllers in `Asset` | 4 (`CTRL-001` to `CTRL-004`) |
| Product codes in `Product2` | 4 required values |
| Entitlement rows in `Player_Entitlement__c` | 6 total, with active coverage for all players |
| Firmware update flag | `true` only for `PLAYER003` |
