# 05 Identity Resolution Plan

## Goal
Create exactly four unified demo player profiles with deterministic joins to device, firmware, entitlement, telemetry, and engagement context.

## Match strategy

| Priority | Match key | Source field(s) | Rule type | Notes |
|---|---|---|---|---|
| 1 | Primary player key | `player_id` / `Player_ID__c` | Exact | Required key for all demo entities |
| 2 | Email | `Contact.Email` and any mirrored file field | Exact (normalized) | Secondary confidence key |
| 3 | PSN handle | `Contact.PSN_Account_ID__c` and file `psn_handle` | Exact (case-insensitive) | Secondary confidence key |

## Device linkage strategy

| Link type | Key | Source(s) | Purpose |
|---|---|---|---|
| Player to device | `player_id` | `Contact`, `Asset`, `Device_Firmware_Status__c`, external files | Anchor device ownership |
| Device to telemetry | `controller_serial` | `Asset.SerialNumber`, telemetry/session files | Join event-level health signals |
| Device to firmware | `external_controller_id` + `controller_serial` | `Asset`, `Device_Firmware_Status__c` | Stable one-to-one firmware status |

## Execution steps
1. Define identity rules with primary exact match on `player_id`.
2. Add secondary exact match keys for email and PSN handle.
3. Run identity resolution.
4. Verify unified profile count equals 4.
5. Validate each profile resolves to one controller in demo data.

## Expected result

| Player | Expected unified profile |
|---|---|
| `PLAYER001` | 1 unified profile |
| `PLAYER002` | 1 unified profile |
| `PLAYER003` | 1 unified profile |
| `PLAYER004` | 1 unified profile |

Total expected unified profiles: **4**

## Failure handling

| Symptom | Likely cause | Fix |
|---|---|---|
| More than 4 unified profiles | Missing primary key map or inconsistent key formatting | Normalize IDs and enforce primary match |
| Fewer than 4 unified profiles | Missing source stream or failed ingestion | Re-run stream and re-run identity resolution |
| Controller not linked | Serial/external controller mismatch | Validate `controller_serial` and `external_controller_id` alignment |
