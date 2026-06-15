# Data Cloud Setup Plan: PS5 Controller Health Demo

## 1) Objective
Add Salesforce Data Cloud to enrich the demo with unified telemetry and engagement context while keeping the current recommendation-only, preview-only experience stable. Data Cloud is introduced to improve audience targeting and behavioral context for middleware and future Agentforce usage, without changing operational behavior or frontend credential boundaries.

## 2) Recommended setup approach
- Use **Salesforce CRM connector** for CRM-owned records already in Salesforce.
- Use **File Upload data streams** for smaller external demo datasets.
- Use an **optional Snowflake connection** for realistic high-volume telemetry and engagement simulation.

This keeps setup practical and demo-focused, while allowing phased expansion later.

## 3) Data source inventory

### Salesforce CRM (connector)
| Source object | Purpose in demo |
|---|---|
| `Contact` | Player identity and profile context |
| `Asset` | Registered controller and warranty context |
| `Product2` | Controller and module product catalog |
| `PricebookEntry` | Base and promotional price context |
| `Case` | Historical support context (read-only narrative input) |
| `Player_Entitlement__c` | Eligibility and promotional recommendation context |
| `Device_Firmware_Status__c` | Firmware state and update availability |

### File upload (external demo datasets)
| File | Purpose in demo |
|---|---|
| `controller_telemetry_events.csv` | Drift and controller health event-level signals |
| `device_session_events.csv` | Session-level disconnect and usage events |
| `notification_history.csv` | Prior outreach and suppression context |
| `player_product_affinity.csv` | Product preference and affinity inputs |

### Optional Snowflake
| File-equivalent dataset | Purpose in demo |
|---|---|
| `controller_telemetry_events_snowflake.csv` | High-volume telemetry simulation |
| `gameplay_engagement_snowflake.csv` | High-volume engagement and play pattern simulation |

## 4) Data stream setup steps

### A) Salesforce CRM data stream setup (manual UI)
1. Open Data Cloud Setup and go to **Data Streams**.
2. Create a new stream using **Salesforce CRM connector**.
3. Select the target data space for this demo.
4. Add streams for:
   - `Contact`
   - `Asset`
   - `Product2`
   - `PricebookEntry`
   - `Case`
   - `Player_Entitlement__c`
   - `Device_Firmware_Status__c`
5. Run each stream and confirm successful ingestion.

### B) File upload data stream setup (manual UI)
1. In Data Streams, choose **File Upload**.
2. Upload one file at a time:
   - `controller_telemetry_events.csv`
   - `device_session_events.csv`
   - `notification_history.csv`
   - `player_product_affinity.csv`
3. Define schema and keys during upload.
4. Save and run each stream.
5. Confirm record counts and sample rows.

### C) Optional Snowflake connection (high level)
1. Configure Snowflake connection in Data Cloud connectors.
2. Authorize connection and test access.
3. Select telemetry and engagement datasets.
4. Create streams and schedule refresh cadence suitable for demo.
5. Validate sample rows and key fields before mapping.

## 5) Recommended DMO mapping
| DMO (recommended) | Typical source(s) | Notes |
|---|---|---|
| Unified Individual / Individual | `Contact`, file IDs | Core player profile |
| Controller Device | `Asset`, firmware files | Device registration and model linkage |
| Controller Health Signal | telemetry files, optional Snowflake | Drift and disconnect context |
| Player Entitlement | `Player_Entitlement__c` | Promo and eligibility context |
| Firmware Status | `Device_Firmware_Status__c` | Current vs latest firmware state |
| Notification History | `notification_history.csv` | Recency and suppression |
| Engagement Profile | session/events, optional Snowflake | Behavior and intensity context |
| Product Affinity | `player_product_affinity.csv` | Controller preference signals |

## 6) Identity resolution strategy
- Primary key: `player_id` / `Player_ID__c`
- Secondary keys: email, PSN handle
- Device linkage: `controller_serial` or `External_Controller_ID__c`
- Target outcome: one unified profile per demo player (`PLAYER001` through `PLAYER004`)

## 7) Relationships
- Unified Individual -> Controller Device
- Controller Device -> Controller Health Signal
- Unified Individual -> Player Entitlement
- Unified Individual -> Engagement Profile
- Unified Individual -> Notification History
- Unified Individual -> Product Affinity

This relationship model supports a single "controller health context" view per player.

## 8) Calculated insights or segments
Create practical segments and insights that align to demo narratives:
- High drift confidence players
- Firmware update needed players
- Out-of-warranty high engagement players
- DualSense Edge owners with module path
- Recently notified suppression segment

## 9) Data Graph recommendation
Define a **Controller Health Context** data graph for future middleware and Agentforce reads.

Recommended graph nodes:
- Player (Unified Individual)
- Controller Device
- Firmware Status
- Player Entitlement
- Controller Health Signal
- Engagement Profile
- Notification History
- Product Affinity

Recommended graph purpose:
- Support low-latency retrieval of persona-level context for recommendation generation.
- Preserve separation of concerns: Salesforce Core for entitlement/profile truth, Data Cloud for behavior and telemetry context.

## 10) Validation checklist
- [ ] Four unified profiles exist
- [ ] Each profile has one registered controller
- [ ] Nina has firmware update available
- [ ] Sarah and Nina are in warranty
- [ ] Marcus and Alex are out of warranty
- [ ] Marcus has product affinity and engagement context
- [ ] Notification suppression data is present

## 11) What stays out of Data Cloud
- No operational orders
- No claims
- No refunds
- No shipments
- No case writeback
- No frontend credentials

## 12) Future middleware integration
When middleware integrates Data Cloud later:
- Keep Salesforce Core as source of truth for profile and entitlement context.
- Read Data Cloud for telemetry, engagement, affinity, and notification suppression context.
- Continue returning the same canonical response contract to frontend.
- Preserve mock fallback when Data Cloud is unavailable.
- Keep frontend isolated from Salesforce and Data Cloud credentials.

## Implementation notes
- This plan assumes mostly manual setup in Salesforce Data Cloud UI.
- Keep configuration demo-scoped and simple.
- Avoid enterprise-scale complexity until post-demo hardening.
