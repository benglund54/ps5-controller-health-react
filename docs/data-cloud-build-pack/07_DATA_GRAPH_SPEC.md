# 07 Data Graph Spec

## Graph name
`Controller Health Context`

## Root object
Unified Individual / Individual (`player_id`)

## Nodes and fields

| Node | Required fields | Join key |
|---|---|---|
| Player (root) | `player_id`, `display_name`, `psn_handle`, `loyalty_tier`, `ps_plus_tier`, `mailing_city`, `mailing_state` | `player_id` |
| Controller Device | `external_controller_id`, `controller_serial`, `controller_model`, `warranty_status`, `warranty_expiry_date` | `player_id`, `controller_serial` |
| Firmware Status | `current_firmware_version`, `latest_firmware_version`, `update_available`, `last_checked_at` | `external_controller_id` or `controller_serial` |
| Player Entitlement | `entitlement_type`, `eligible_product_code`, `promotional_price`, `is_active` | `player_id` |
| Controller Health Signal | `right_stick_drift_score`, `disconnect_frequency_score`, `battery_health_pct`, `issue_confidence`, `session_hours_l30d`, `signal_date` | `player_id`, `controller_serial` |
| Engagement Profile | `session_count`, `total_hours_played`, `avg_session_minutes`, `top_genre` | `player_id` |
| Notification History | `notification_date`, `notification_type`, `channel`, `was_opened`, `was_dismissed`, `response_action` | `player_id` |
| Product Affinity | `product_category`, `affinity_score`, `inferred_upgrade_interest` | `player_id` |

## Relationship map

| From | To | Cardinality |
|---|---|---|
| Player | Controller Device | 1-to-1 in demo |
| Controller Device | Firmware Status | 1-to-1 |
| Controller Device | Controller Health Signal | 1-to-many |
| Player | Player Entitlement | 1-to-many |
| Player | Engagement Profile | 1-to-many by time period |
| Player | Notification History | 1-to-many |
| Player | Product Affinity | 1-to-many |

## Expected output per player

| Player | Expected highlights |
|---|---|
| PLAYER001 | In warranty, high drift, free replacement entitlement |
| PLAYER002 | Out of warranty, high drift + high engagement, discounted upgrade context |
| PLAYER003 | In warranty, firmware outdated, troubleshooting-first path |
| PLAYER004 | DualSense Edge, module replacement path |

## Middleware usage later
- Middleware can read one graph response per `player_id`.
- Salesforce Core remains source for profile and entitlement truth.
- Data Cloud contributes telemetry, engagement, affinity, and suppression context.
- If graph read fails, middleware continues with mock fallback.
