# PS5 Data Graph Verification Checklist

## 1) Expected data streams and row counts

### File upload streams
| Stream | Expected rows | Status |
|---|---:|---|
| `PS5_Players` | 1,000 | ☐ |
| `PS5_Controllers` | 1,150 | ☐ |
| `PS5_Controller_Telemetry_Events` | 10,000 | ☐ |
| `PS5_Device_Session_Events` | 30,000 | ☐ |
| `PS5_Gameplay_Engagement` | 10,000 | ☐ |
| `PS5_Notification_History` | 3,000 | ☐ |
| `PS5_Player_Product_Affinity` | 4,000 | ☐ |

### CRM streams (as available)
| Stream | Status |
|---|---|
| `Contact_Home` | ☐ |
| `Asset_Home` | ☐ |
| `Case_Home` | ☐ |
| `Product2_Home` | ☐ |
| `PricebookEntry_Home` | ☐ |
| `Player_Entitlement__c_Home` | ☐ |
| `Device_Firmware_Status__c_Home` | ☐ |

## 2) Expected DMO mappings
| Source stream | Expected target DMO | Verified |
|---|---|---|
| `PS5_Players` | `Individual` | ☐ |
| `PS5_Controllers` | `PS5 Controller Device` | ☐ |
| `PS5_Controller_Telemetry_Events` | `PS5 Controller Telemetry Event` | ☐ |
| `PS5_Device_Session_Events` | `PS5 Device Session Event` | ☐ |
| `PS5_Gameplay_Engagement` | `PS5 Gameplay Engagement` | ☐ |
| `PS5_Notification_History` | `PS5 Notification History` | ☐ |
| `PS5_Player_Product_Affinity` | `PS5 Player Product Affinity` | ☐ |
| `Player_Entitlement__c_Home` | `PS5 Player Entitlement` | ☐ |
| `Device_Firmware_Status__c_Home` | `PS5 Device Firmware Status` | ☐ |

## 3) Expected Data Graph structure
Graph: `PS5 Controller Health Context`  
Root object: `Individual`

Expected hierarchy:
- `Individual`
  - `PS5 Controller Device`
    - `PS5 Controller Telemetry Event`
    - `PS5 Device Session Event`
    - `PS5 Device Firmware Status`
    - `Case` (optional)
  - `PS5 Gameplay Engagement`
  - `PS5 Notification History`
  - `PS5 Player Product Affinity`
  - `PS5 Player Entitlement`

## 4) Expected relationship keys
| Relationship | Key expectation | Verified |
|---|---|---|
| Individual to child player entities | `Individual.Individual Id` -> child `player_id` / `Player Id` | ☐ |
| Controller Device to telemetry/session | `controller_id` -> telemetry/session `controller_id` | ☐ |
| Controller Device to Case (optional) | `controller_serial` -> Case `controller_serial_number` (or equivalent) | ☐ |

## 5) Hero-player validation
| Player | Expected context | Verified |
|---|---|---|
| `PLAYER001` Sarah | In warranty, free replacement/warranty entitlement, right-stick drift | ☐ |
| `PLAYER002` Marcus | Out of warranty, high engagement, upgrade path | ☐ |
| `PLAYER003` Nina | Firmware update and disconnect troubleshooting path | ☐ |
| `PLAYER004` Alex | DualSense Edge, stick module path | ☐ |

## 6) Manual UI validation flow

### A. Data Streams
1. Open each stream and verify status = successful.
2. Compare row counts to expected values above.
3. Confirm recent run timestamps.

### B. Data Lake Objects
1. Confirm each DLO has rows and expected key fields.
2. Spot-check `player_id`, `controller_id`, `controller_serial`, `product_code`.

### C. Data Model graph
1. Verify all expected DMOs exist.
2. Verify relationships are active and directionally correct.

### D. Data Graph preview
1. Use builder Copy output first (often schema preview JSON).
2. Validate schema includes required root fields and required context objects.
3. If record preview values are available, verify root + entitlement + controller + telemetry.
4. Repeat for `PLAYER002`, `PLAYER003`, `PLAYER004` when record previews are available.

### E. Data Explorer / Profile Explorer
1. Confirm each hero has a unified profile.
2. Confirm child objects appear with expected row patterns.

## 7) Troubleshooting guide
| Symptom | Likely cause | Fix |
|---|---|---|
| Entitlement appears but telemetry missing | Telemetry stream not mapped/related to controller | Re-check telemetry DMO mapping and controller relationship key |
| Controller missing | Controller stream failed or bad key mapping | Validate `PS5_Controllers` row count and `player_id` mapping |
| Graph preview returns only Individual | Child relationships not added to graph or relationship inactive | Add missing graph nodes and verify relationship publish status |
| Case disconnected | Case relationship key mismatch (`controller_serial`) | Align Case serial field mapping and relationship join key |
| Product code appears as Salesforce ID | Lookup field exposed as ID only | Add mapped helper field for product code or enrich in DMO mapping |
| Relationships not appearing in builder | Relationship not published or object not in same data space context | Publish relationship, refresh builder, verify data space |
| Daily refresh delays | Stream cadence not near real-time | Set expectation as scheduled refresh and validate latest run time |

## 8) Local JSON preview validator
Use the repo-local validator after copying Data Graph preview JSON:

```bash
node scripts/data-cloud/validate-data-graph-preview.js data/generated/reports/player001-data-graph-preview.json
```

Use WARN for missing Case. Treat missing root/context as blocking.

## 9) Schema Preview Validation
Data Cloud builder Copy can return a schema preview with placeholders such as `<TEXT>`, `<NUMBER>`, and `<BOOLEAN>`.

In schema-preview mode, the validator checks:
- Required root fields:
  - `ssot__Id__c`
  - `ssot__FirstName__c`
  - `ssot__LastName__c`
  - `ssot__PreferredName__c`
- Required context objects:
  - `PS5_Controller_Device__dlm`
  - `PS5_Controller_Telemetry_Event__dlm`
  - `PS5_Device_Session_Event__dlm`
  - `PS5_Gameplay_Engagement__dlm`
  - `PS5_Notification_History__dlm`
  - `PS5_Player_Product_Affinity__dlm`
  - `PS5_Player_Entitlement__dlm`
  - `PS5_Device_Firmware_Status__dlm`
- Optional objects (WARN only if missing):
  - `ssot__Case__dlm`
  - `ssot__Product__dlm`
  - `PS5_Pricebook_Entry__dlm`

Schema preview validates included objects and fields only.  
Record preview validates actual player-specific values.
