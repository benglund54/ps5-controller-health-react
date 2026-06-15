# 04 DMO and Relationship Model

## Recommended DMOs

| DMO | Core keys | Primary source(s) | Notes |
|---|---|---|---|
| Unified Individual / Individual | `player_id` | `Contact`, file player IDs | Canonical player entity |
| Controller Device | `external_controller_id`, `controller_serial` | `Asset` | One active controller per demo player |
| Controller Health Signal | `telemetry_event_id` | `controller_telemetry_events.csv`, optional Snowflake telemetry | Time-series drift and disconnect events |
| Player Entitlement | `external_entitlement_id` | `Player_Entitlement__c` | Offer eligibility and promo price context |
| Firmware Status | `external_controller_id` | `Device_Firmware_Status__c` | Current and latest firmware comparison |
| Notification History | `notification_id` | `notification_history.csv` | Suppression and communication context |
| Engagement Profile | `engagement_id` | `gameplay_engagement.csv` or Snowflake rollups | Behavioral intensity context |
| Product Affinity | `affinity_id` | `player_product_affinity.csv` | Upgrade and product preference context |
| Product / Price Context | `product_code` | `Product2`, `PricebookEntry` | Base and promo price anchoring |

## Relationship cardinality (target model)

| From | To | Cardinality | Demo expectation |
|---|---|---|---|
| Individual | Controller Device | 1-to-many (platform), 1-to-1 (demo) | One controller per demo player |
| Controller Device | Controller Health Signal | 1-to-many | Multiple telemetry events per controller |
| Individual | Player Entitlement | 1-to-many | PLAYER002 has multiple active entitlement rows |
| Individual | Notification History | 1-to-many | Notification history per player |
| Individual | Engagement Profile | 1-to-many (time windows) | Weekly/period rollups per player |
| Individual | Product Affinity | 1-to-many | Multiple category affinity rows |
| Controller Device | Firmware Status | 1-to-one | One current firmware snapshot per controller |
| Product / Price Context | Player Entitlement | 1-to-many via product code | Promo and list pricing alignment |

## Relationship key map

| Relationship | Join key |
|---|---|
| Individual <-> Controller Device | `player_id` / `Player_ID__c` |
| Controller Device <-> Health Signal | `controller_serial` and/or `external_controller_id` |
| Individual <-> Entitlement | `player_id` |
| Individual <-> Notification History | `player_id` |
| Individual <-> Engagement Profile | `player_id` |
| Individual <-> Product Affinity | `player_id` |
| Controller Device <-> Firmware Status | `external_controller_id` and `controller_serial` |
| Entitlement <-> Product/Price | `product_code` |

## Practical implementation notes
- Build Individual and Controller Device first. Most downstream joins depend on these.
- Keep both `controller_serial` and `external_controller_id` where possible to simplify reconciliation.
- Keep entitlement and price context mapped together so recommendation previews can align to expected prices.
