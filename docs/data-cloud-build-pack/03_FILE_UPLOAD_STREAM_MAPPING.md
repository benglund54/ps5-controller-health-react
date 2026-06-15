# 03 File Upload Stream Mapping

## Required file streams

### `controller_telemetry_events.csv`
- **Rows:** 16
- **Purpose:** drift, disconnect, battery, confidence signals
- **Primary key:** `telemetryEventId`
- **Player key:** `externalPlayerId`
- **Controller key:** `controllerSerialNumber`

| Source column | Proposed DMO field | Type |
|---|---|---|
| `telemetryEventId` | `telemetry_event_id` | Text |
| `externalPlayerId` | `player_id` | Text |
| `controllerSerialNumber` | `controller_serial` | Text |
| `signalDate` | `signal_date` | Date |
| `rightStickDriftScore` | `right_stick_drift_score` | Decimal(5,2) |
| `leftStickDriftScore` | `left_stick_drift_score` | Decimal(5,2) |
| `disconnectFrequencyScore` | `disconnect_frequency_score` | Decimal(5,2) |
| `batteryHealthPercent` | `battery_health_pct` | Integer |
| `sessionHoursL30d` | `session_hours_l30d` | Decimal(6,2) |
| `issueConfidence` | `issue_confidence` | Text |
| `firmwareVersion` | `firmware_version` | Text |
| `source` | `signal_source` | Text |

**Validation expectation:** 16 rows loaded, player and controller keys non-null, latest records align with persona outcomes.

---

### `device_session_events.csv`
- **Rows:** 12
- **Purpose:** session-level play behavior and controller event intensity
- **Primary key:** `sessionEventId`
- **Player key:** `externalPlayerId`
- **Controller key:** `controllerSerialNumber`

| Source column | Proposed DMO field | Type |
|---|---|---|
| `sessionEventId` | `session_event_id` | Text |
| `externalPlayerId` | `player_id` | Text |
| `controllerSerialNumber` | `controller_serial` | Text |
| `sessionStart` | `session_start_ts` | Timestamp |
| `sessionEnd` | `session_end_ts` | Timestamp |
| `sessionDurationMinutes` | `session_duration_minutes` | Integer |
| `disconnectCount` | `disconnect_count` | Integer |
| `analogDriftEvents` | `analog_drift_events` | Integer |
| `buttonInputCount` | `button_input_count` | Integer |
| `hapticEventCount` | `haptic_event_count` | Integer |
| `triggerEventCount` | `trigger_event_count` | Integer |
| `wiredSession` | `wired_session` | Boolean |

**Validation expectation:** 12 rows loaded, all players represented, disconnect spikes visible for PLAYER003.

---

### `notification_history.csv`
- **Rows:** 10
- **Purpose:** suppression and message fatigue context
- **Primary key:** `notificationId`
- **Player key:** `externalPlayerId`
- **Controller key:** none

| Source column | Proposed DMO field | Type |
|---|---|---|
| `notificationId` | `notification_id` | Text |
| `externalPlayerId` | `player_id` | Text |
| `notificationDate` | `notification_date` | Date |
| `channel` | `channel` | Text |
| `notificationType` | `notification_type` | Text |
| `messagePreview` | `message_preview` | Text |
| `wasOpened` | `was_opened` | Boolean |
| `wasDismissed` | `was_dismissed` | Boolean |
| `responseAction` | `response_action` | Text |
| `deliveryStatus` | `delivery_status` | Text |

**Validation expectation:** 10 rows loaded, recent notification suppression logic can be built.

---

### `player_product_affinity.csv`
- **Rows:** 12
- **Purpose:** product preference and likely upgrade intent
- **Primary key:** `affinityId`
- **Player key:** `externalPlayerId`
- **Controller key:** none

| Source column | Proposed DMO field | Type |
|---|---|---|
| `affinityId` | `affinity_id` | Text |
| `externalPlayerId` | `player_id` | Text |
| `productCategory` | `product_category` | Text |
| `affinityScore` | `affinity_score` | Decimal(5,2) |
| `recentPurchaseCount` | `recent_purchase_count` | Integer |
| `wishlistCount` | `wishlist_count` | Integer |
| `psStoreProductViews` | `ps_store_product_views` | Integer |
| `lastInteractionDate` | `last_interaction_date` | Date |
| `inferredUpgradeInterest` | `inferred_upgrade_interest` | Text |

**Validation expectation:** 12 rows loaded, high premium affinity visible for PLAYER002 and PLAYER004.

## Optional additional file stream

### `gameplay_engagement.csv` (optional but recommended)
- **Rows:** 8
- **Purpose:** compact engagement rollups if Snowflake is out of scope
- **Primary key:** `engagementId`
- **Player key:** `externalPlayerId`
- **Controller key:** none

| Source column | Proposed DMO field |
|---|---|
| `engagementId` | `engagement_id` |
| `externalPlayerId` | `player_id` |
| `periodStart`, `periodEnd` | `period_start`, `period_end` |
| `sessionCount`, `totalHoursPlayed`, `avgSessionMinutes` | `session_count`, `total_hours_played`, `avg_session_minutes` |
| `topGenre`, `topTitleCategory` | `top_genre`, `top_title_category` |
| `psStoreVisits`, `trophiesEarned`, `friendActivityCount`, `shareCount` | aligned numeric metrics |

**Validation expectation:** 8 rows loaded; PLAYER002 shows highest engagement.

## Cleanup needed before upload
- Confirm boolean fields are true/false, not text variants.
- Confirm IDs are unique per file primary key.
- Confirm date and timestamp formats are ISO-compatible.
- Keep column names stable through setup to reduce manual remapping errors.

## Complete CSV catalog (all available source files)

| Filename | Purpose | Primary key | Foreign/relationship keys | Important columns | Target Data Cloud object | Validation expectation | Cleanup before upload |
|---|---|---|---|---|---|---|---|
| `data/salesforce/contacts.csv` | Player profile master | `externalPlayerId` | `email`, `psnHandle` | name, loyalty tier, PS Plus tier, mailing fields | Unified Individual | 4 players loaded | None |
| `data/salesforce/assets.csv` | Registered controllers and warranty | `externalControllerId` | `externalPlayerId`, `controllerSerialNumber`, `productCode` | warranty status/expiry, model | Controller Device | 4 controllers linked to 4 players | None |
| `data/salesforce/products.csv` | Product catalog | `productCode` | `productFamily` | productName, isActive | Product / Price Context | 4 products loaded | None |
| `data/salesforce/pricebook_entries.csv` | List/promo pricing | Composite (`productCode`,`pricebookName`) | `productCode`, `pricebookName` | `unitPrice`, `currencyCode` | Product / Price Context | 9 entries across standard/promo/warranty pricebooks | Drop `notes` if schema does not need it |
| `data/salesforce/cases.csv` | Historical support context | `caseId` | `externalPlayerId`, `controllerSerialNumber` | subject, status, type, openedDate | Support Interaction Context (optional) | 3 cases loaded (none for PLAYER004) | Exclude `closedDate` and `resolution` in strict schema |
| `data/salesforce/player_entitlements.csv` | Offer eligibility and promo prices | `entitlementId` | `externalPlayerId`, `eligibleProductCode` | entitlement type, active flag, promo price | Player Entitlement | 6 rows loaded; active entitlement per player | None |
| `data/salesforce/device_firmware_status.csv` | Current vs latest firmware state | `externalControllerId` | `externalPlayerId`, `controllerSerialNumber` | versions, updateAvailable | Firmware Status | 4 rows loaded; update true for PLAYER003 | None |
| `data/salesforce/recommendation_outcomes_preview.csv` | Preview-only sample outcome | `outcomeId` | `externalPlayerId`, `sessionId` | recommendationType, selectedOption | Not required for Data Cloud setup | Optional only | Exclude unless explicitly needed |
| `data/external/controller_telemetry_events.csv` | Telemetry-level health signals | `telemetryEventId` | `externalPlayerId`, `controllerSerialNumber` | drift/disconnect/battery/confidence | Controller Health Signal | 16 rows loaded | None |
| `data/external/device_session_events.csv` | Session behavior metrics | `sessionEventId` | `externalPlayerId`, `controllerSerialNumber` | duration, disconnect count, input activity | Engagement Profile (session-level) | 12 rows loaded | None |
| `data/external/notification_history.csv` | Outreach and suppression signals | `notificationId` | `externalPlayerId` | channel, type, opened/dismissed, responseAction | Notification History | 10 rows loaded | None |
| `data/external/player_product_affinity.csv` | Product interest scoring | `affinityId` | `externalPlayerId` | affinity score, category, upgrade interest | Product Affinity | 12 rows loaded | None |
| `data/external/gameplay_engagement.csv` | Compact engagement rollups | `engagementId` | `externalPlayerId` | sessions, hours, genre, store visits | Engagement Profile (rollup) | 8 rows loaded | Optional if Snowflake engagement used |
| `data/snowflake/controller_telemetry_events_snowflake.csv` | High-volume telemetry sample | `telemetry_event_id` | `player_id`, `controller_serial` | drift/disconnect/battery, firmware fields | Controller Health Signal (Snowflake path) | 41 rows loaded in Snowflake table | Strip leading comment lines before COPY if needed |
| `data/snowflake/gameplay_engagement_snowflake.csv` | High-volume engagement sample | `engagement_id` | `player_id` | hours, sessions, genre, social/store signals | Engagement Profile (Snowflake path) | 46 rows loaded in Snowflake table | Strip leading comment lines before COPY if needed |
