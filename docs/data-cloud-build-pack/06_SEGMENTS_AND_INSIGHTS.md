# 06 Segments and Insights

## Segment setup priorities
Build these in order. Stop after #3 if time is constrained.

| Priority | Segment / Insight | Core logic | Expected persona match |
|---|---|---|---|
| 1 | High drift confidence players | `right_stick_drift_score >= 0.80` AND `issue_confidence IN ('HIGH','MEDIUM')` | PLAYER001, PLAYER002 |
| 2 | Firmware update needed players | `update_available = true` OR `current_firmware_version < latest_firmware_version` | PLAYER003 |
| 3 | Out-of-warranty high engagement players | `warranty_status = 'OUT_OF_WARRANTY'` AND engagement threshold met (`total_hours_played` or `session_hours_l30d`) | PLAYER002, PLAYER004 |
| 4 | DualSense Edge owners with module path | `controller_model` contains `Edge` AND module/product signal present | PLAYER004 |
| 5 | Recently notified suppression | recent notification window (example last 14 days) with dismissal/open behavior | Usually PLAYER001, PLAYER003, PLAYER004 depending date window |

## Suggested implementation details

### 1) High drift confidence players
- Sources: Controller Health Signal DMO
- Fields: `player_id`, `right_stick_drift_score`, `issue_confidence`
- Validation: segment contains PLAYER001 and PLAYER002

### 2) Firmware update needed players
- Sources: Firmware Status DMO
- Fields: `player_id`, `update_available`, `current_firmware_version`, `latest_firmware_version`
- Validation: segment contains PLAYER003 only

### 3) Out-of-warranty high engagement players
- Sources: Controller Device + Engagement Profile
- Fields: `player_id`, `warranty_status`, engagement metric (`total_hours_played` or equivalent)
- Validation: includes PLAYER002 and PLAYER004

### 4) DualSense Edge owners with module path
- Sources: Controller Device + Entitlement/Product context
- Fields: `player_id`, `controller_model`, entitlement/product code (`DS-EDGE-MODULE`)
- Validation: contains PLAYER004

### 5) Recently notified suppression
- Sources: Notification History
- Fields: `player_id`, `notification_date`, `was_dismissed`, `response_action`
- Validation: segment produced and usable as exclusion input

## Demo-safe output usage
- Use segments for recommendation context, not fulfillment.
- Keep messaging recommendation-only and preview-only.
- Do not expose internal scoring logic in player-facing UI copy.
