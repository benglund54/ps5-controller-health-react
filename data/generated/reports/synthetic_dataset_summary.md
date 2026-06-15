# Synthetic Dataset Summary (1000-player)

## Row counts by file

| File | Rows |
|---|---:|
| `data-cloud-1000/players.csv` | 1000 |
| `data-cloud-1000/controllers.csv` | 1150 |
| `data-cloud-1000/controller_telemetry_events.csv` | 10000 |
| `data-cloud-1000/device_session_events.csv` | 30000 |
| `data-cloud-1000/gameplay_engagement.csv` | 10000 |
| `data-cloud-1000/notification_history.csv` | 3000 |
| `data-cloud-1000/player_product_affinity.csv` | 4000 |
| `salesforce-core-1000/contacts_1000.csv` | 1000 |
| `salesforce-core-1000/assets_1000.csv` | 1150 |
| `salesforce-core-1000/player_entitlements_1000.csv` | 1500 |
| `salesforce-core-1000/device_firmware_status_1000.csv` | 1150 |
| `salesforce-core-1000/cases_1000.csv` | 600 |

## Segment distribution

| Segment | Players |
|---|---:|
| `BATTERY_DEGRADATION` | 70 |
| `DRIFT_RISK` | 201 |
| `EDGE_MODULE_PATH` | 101 |
| `FIRMWARE_DISCONNECT_RISK` | 150 |
| `HEALTHY` | 478 |

## Hero persona summary

| Player | Segment | Warranty | Expected recommendation |
|---|---|---|---|
| PLAYER001 | DRIFT_RISK | IN_WARRANTY | INCLUDED_REPLACEMENT |
| PLAYER002 | DRIFT_RISK | OUT_OF_WARRANTY | PERSONALIZED_UPGRADE |
| PLAYER003 | FIRMWARE_DISCONNECT_RISK | IN_WARRANTY | FIRMWARE_TROUBLESHOOTING |
| PLAYER004 | EDGE_MODULE_PATH | OUT_OF_WARRANTY | STICK_MODULE_PATH |

## Join-key validation results

- `orphan_controller_player`: 0
- `orphan_telemetry_player`: 0
- `orphan_telemetry_controller`: 0
- `orphan_sessions_player`: 0
- `orphan_sessions_controller`: 0
- `orphan_notif_player`: 0
- `orphan_aff_player`: 0
- `unknown_product_code`: 0

## Duplicate-key validation results

- `dup_players`: 0
- `dup_controllers`: 0
- `dup_telemetry`: 0
- `dup_sessions`: 0
- `dup_engagement`: 0
- `dup_notifications`: 0
- `dup_affinity`: 0

## Value-range validation results

- `range_drift`: 0
- `range_disconnect`: 0
- `range_battery`: 0
- `range_affinity`: 0

## Recommended upload order to Data Cloud

1. players.csv
2. controllers.csv
3. controller_telemetry_events.csv
4. device_session_events.csv
5. gameplay_engagement.csv
6. notification_history.csv
7. player_product_affinity.csv

## Dataset readiness

Dataset ready for Data Cloud upload: **Yes**
