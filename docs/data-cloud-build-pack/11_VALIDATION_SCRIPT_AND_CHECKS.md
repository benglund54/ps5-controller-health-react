# 11 Validation Script and Checks

## Manual UI checks (required)

| Check area | What to verify | Expected |
|---|---|---|
| CRM streams | All configured CRM streams show successful run | 7 successful runs |
| File streams | Required uploaded files run successfully | 4 successful runs |
| Identity resolution | Unified profile output | Exactly 4 unified demo profiles |
| Relationships | Joins return linked records | Player, device, telemetry, entitlement links valid |
| Segments | Core segments built and populated | Persona-aligned segment membership |
| Data Graph | Controller Health Context graph returns expected nodes | One coherent context per player |

## Expected record counts (where known)

| Source | Expected rows |
|---|---|
| `contacts.csv` | 4 |
| `assets.csv` | 4 |
| `products.csv` | 4 |
| `pricebook_entries.csv` | 9 |
| `cases.csv` | 3 |
| `player_entitlements.csv` | 6 |
| `device_firmware_status.csv` | 4 |
| `controller_telemetry_events.csv` | 16 |
| `device_session_events.csv` | 12 |
| `notification_history.csv` | 10 |
| `player_product_affinity.csv` | 12 |
| Optional `gameplay_engagement.csv` | 8 |
| Optional `controller_telemetry_events_snowflake.csv` | 41 |
| Optional `gameplay_engagement_snowflake.csv` | 46 |

## Persona outcome validation checks

| Persona | Expected context outcome | Validation cue |
|---|---|---|
| PLAYER001 Sarah | Included replacement path | In warranty + high drift + active replacement entitlement |
| PLAYER002 Marcus | Personalized upgrade path | Out of warranty + high engagement + discounted entitlements |
| PLAYER003 Nina | Firmware troubleshooting path | Firmware update available + disconnect pattern |
| PLAYER004 Alex | Stick module path | DualSense Edge + module replacement entitlement |

## Quick validation query checklist (Data Cloud query UI)
Use equivalent query tooling available in your org.

```sql
-- unified profile count
SELECT COUNT(DISTINCT player_id) AS players FROM unified_individual;

-- warranty distribution
SELECT player_id, warranty_status FROM controller_device ORDER BY player_id;

-- firmware updates
SELECT player_id, update_available FROM firmware_status ORDER BY player_id;

-- highest drift snapshot by player
SELECT player_id, MAX(right_stick_drift_score) AS max_drift
FROM controller_health_signal
GROUP BY player_id
ORDER BY player_id;
```

## Live-demo-ready vs architecture-only decision

| Decision | Criteria |
|---|---|
| Live-demo-ready | Required streams, identity, relationships, and persona outcomes validated |
| Architecture-story-only | Any core stream/identity/segment dependency incomplete, but mock fallback path stable |

## Final readiness rule
If unresolved blockers remain for more than 10 minutes before demo time, mark Data Cloud as architecture-story-only and proceed with approved fallback path.
