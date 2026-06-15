# Data Cloud Execution Checklist: PS5 Controller Health Demo

Use this checklist during day-of setup. Keep updates in real time.

## Status legend
- `Not started`
- `In progress`
- `Blocked`
- `Done`
- `N/A`

## 1) Pre-setup readiness

| Step # | Area | Task | Owner | Status | Start time | Complete time | Validation result | Notes / blocker |
|---|---|---|---|---|---|---|---|---|
| 1.1 | Pre-setup | Confirm target Salesforce org and Data Cloud data space |  | Not started |  |  | Correct org alias and data space confirmed |  |
| 1.2 | Pre-setup | Confirm user has required Data Cloud permissions |  | Not started |  |  | User can access Data Streams, DMOs, Identity Resolution, Segments, Data Graphs |  |
| 1.3 | Pre-setup | Confirm Salesforce CRM connector is available |  | Not started |  |  | Connector visible and selectable |  |
| 1.4 | Pre-setup | Confirm source CSV files exist for upload |  | Not started |  |  | All required CSV files located and readable |  |
| 1.5 | Pre-setup | Confirm optional Snowflake decision is in scope or out of scope |  | Not started |  |  | Decision recorded |  |
| 1.6 | Pre-setup | Confirm fallback demo mode is available |  | Not started |  |  | Mock fallback startup tested |  |

## 2) Salesforce CRM data streams

| Step # | Area | Task | Owner | Status | Start time | Complete time | Validation result | Notes / blocker |
|---|---|---|---|---|---|---|---|---|
| 2.1 | CRM stream | `Contact` stream setup and run |  | Not started |  |  | Stream created, run completed, sample records visible, key field identified (`Player_ID__c`) |  |
| 2.2 | CRM stream | `Asset` stream setup and run |  | Not started |  |  | Stream created, run completed, sample records visible, key field identified (`External_Controller_ID__c`) |  |
| 2.3 | CRM stream | `Product2` stream setup and run |  | Not started |  |  | Stream created, run completed, sample records visible, key field identified (`ProductCode`) |  |
| 2.4 | CRM stream | `PricebookEntry` stream setup and run |  | Not started |  |  | Stream created, run completed, sample records visible, key field identified (Product + Pricebook link) |  |
| 2.5 | CRM stream | `Case` stream setup and run |  | Not started |  |  | Stream created, run completed, sample records visible, key field identified (`External_Case_ID__c`) |  |
| 2.6 | CRM stream | `Player_Entitlement__c` stream setup and run |  | Not started |  |  | Stream created, run completed, sample records visible, key field identified (`External_Entitlement_ID__c`) |  |
| 2.7 | CRM stream | `Device_Firmware_Status__c` stream setup and run |  | Not started |  |  | Stream created, run completed, sample records visible, key field identified (`External_Controller_ID__c`) |  |

## 3) File upload data streams

| Step # | Area | Task | Owner | Status | Start time | Complete time | Validation result | Notes / blocker |
|---|---|---|---|---|---|---|---|---|
| 3.1 | File stream | Upload and run `controller_telemetry_events.csv` |  | Not started |  |  | File uploaded, schema reviewed, key fields identified, stream completed, sample rows visible |  |
| 3.2 | File stream | Upload and run `device_session_events.csv` |  | Not started |  |  | File uploaded, schema reviewed, key fields identified, stream completed, sample rows visible |  |
| 3.3 | File stream | Upload and run `notification_history.csv` |  | Not started |  |  | File uploaded, schema reviewed, key fields identified, stream completed, sample rows visible |  |
| 3.4 | File stream | Upload and run `player_product_affinity.csv` |  | Not started |  |  | File uploaded, schema reviewed, key fields identified, stream completed, sample rows visible |  |

## 4) Optional Snowflake setup

| Step # | Area | Task | Owner | Status | Start time | Complete time | Validation result | Notes / blocker |
|---|---|---|---|---|---|---|---|---|
| 4.1 | Snowflake | Confirm Snowflake is in scope for this run |  | Not started |  |  | In-scope or out-of-scope decision recorded |  |
| 4.2 | Snowflake | Confirm connector access |  | Not started |  |  | Connector available with required permissions |  |
| 4.3 | Snowflake | Test connection |  | Not started |  |  | Connection test successful |  |
| 4.4 | Snowflake | Select telemetry dataset |  | Not started |  |  | Telemetry dataset selected and readable |  |
| 4.5 | Snowflake | Select engagement dataset |  | Not started |  |  | Engagement dataset selected and readable |  |
| 4.6 | Snowflake | Validate sample rows |  | Not started |  |  | Sample rows visible with expected fields |  |
| 4.7 | Snowflake | Decide whether Snowflake is used live or architecture-story only |  | Not started |  |  | Demo decision recorded |  |

## 5) DMO mapping

| Step # | Area | Task | Owner | Status | Start time | Complete time | Validation result | Notes / blocker |
|---|---|---|---|---|---|---|---|---|
| 5.1 | DMO | Map Unified Individual / Individual |  | Not started |  |  | Profile fields mapped and validated |  |
| 5.2 | DMO | Map Controller Device |  | Not started |  |  | Device identifiers and model fields mapped |  |
| 5.3 | DMO | Map Controller Health Signal |  | Not started |  |  | Drift and disconnect fields mapped |  |
| 5.4 | DMO | Map Player Entitlement |  | Not started |  |  | Eligibility and promo fields mapped |  |
| 5.5 | DMO | Map Firmware Status |  | Not started |  |  | Current and latest firmware fields mapped |  |
| 5.6 | DMO | Map Notification History |  | Not started |  |  | Notification date and channel fields mapped |  |
| 5.7 | DMO | Map Engagement Profile |  | Not started |  |  | Session and engagement fields mapped |  |
| 5.8 | DMO | Map Product Affinity |  | Not started |  |  | Product preference and affinity fields mapped |  |

## 6) Identity resolution

| Step # | Area | Task | Owner | Status | Start time | Complete time | Validation result | Notes / blocker |
|---|---|---|---|---|---|---|---|---|
| 6.1 | Identity | Configure primary match on `player_id` / `Player_ID__c` |  | Not started |  |  | Primary identity match active |  |
| 6.2 | Identity | Confirm secondary keys: email and PSN handle |  | Not started |  |  | Secondary rules configured and validated |  |
| 6.3 | Identity | Confirm controller linkage via `controller_serial` or `External_Controller_ID__c` |  | Not started |  |  | Device linkage valid for all demo players |  |
| 6.4 | Identity | Confirm one unified profile per demo player |  | Not started |  |  | Exactly four unified demo profiles |  |

## 7) Relationships

| Step # | Area | Task | Owner | Status | Start time | Complete time | Validation result | Notes / blocker |
|---|---|---|---|---|---|---|---|---|
| 7.1 | Relationship | Unified Individual -> Controller Device |  | Not started |  |  | Relationship active and queryable |  |
| 7.2 | Relationship | Controller Device -> Controller Health Signal |  | Not started |  |  | Relationship active and queryable |  |
| 7.3 | Relationship | Unified Individual -> Player Entitlement |  | Not started |  |  | Relationship active and queryable |  |
| 7.4 | Relationship | Unified Individual -> Engagement Profile |  | Not started |  |  | Relationship active and queryable |  |
| 7.5 | Relationship | Unified Individual -> Notification History |  | Not started |  |  | Relationship active and queryable |  |
| 7.6 | Relationship | Unified Individual -> Product Affinity |  | Not started |  |  | Relationship active and queryable |  |

## 8) Segments and calculated insights

| Step # | Area | Task | Owner | Status | Start time | Complete time | Validation result | Notes / blocker |
|---|---|---|---|---|---|---|---|---|
| 8.1 | Segment/Insight | High drift confidence players |  | Not started |  |  | Segment returns expected players |  |
| 8.2 | Segment/Insight | Firmware update needed players |  | Not started |  |  | Segment includes Nina scenario |  |
| 8.3 | Segment/Insight | Out-of-warranty high engagement players |  | Not started |  |  | Segment includes Marcus and Alex scenario logic |  |
| 8.4 | Segment/Insight | DualSense Edge owners with module path |  | Not started |  |  | Segment includes Alex scenario |  |
| 8.5 | Segment/Insight | Recently notified suppression segment |  | Not started |  |  | Suppression logic active and testable |  |

## 9) Data Graph

| Step # | Area | Task | Owner | Status | Start time | Complete time | Validation result | Notes / blocker |
|---|---|---|---|---|---|---|---|---|
| 9.1 | Data Graph | Create `Controller Health Context` Data Graph |  | Not started |  |  | Graph exists and is accessible |  |
| 9.2 | Data Graph | Add player node |  | Not started |  |  | Node mapped and returning fields |  |
| 9.3 | Data Graph | Add controller device node |  | Not started |  |  | Node mapped and returning fields |  |
| 9.4 | Data Graph | Add firmware status node |  | Not started |  |  | Node mapped and returning fields |  |
| 9.5 | Data Graph | Add entitlement node |  | Not started |  |  | Node mapped and returning fields |  |
| 9.6 | Data Graph | Add controller health signal node |  | Not started |  |  | Node mapped and returning fields |  |
| 9.7 | Data Graph | Add engagement profile node |  | Not started |  |  | Node mapped and returning fields |  |
| 9.8 | Data Graph | Add notification history node |  | Not started |  |  | Node mapped and returning fields |  |
| 9.9 | Data Graph | Add product affinity node |  | Not started |  |  | Node mapped and returning fields |  |
| 9.10 | Data Graph | Validate one graph response per demo player if possible |  | Not started |  |  | Valid response for PLAYER001-PLAYER004 |  |

## 10) Validation checklist

| Step # | Area | Task | Owner | Status | Start time | Complete time | Validation result | Notes / blocker |
|---|---|---|---|---|---|---|---|---|
| 10.1 | Validation | Four unified profiles exist |  | Not started |  |  | Count = 4 |  |
| 10.2 | Validation | Each profile has one registered controller |  | Not started |  |  | Device linkage valid for all profiles |  |
| 10.3 | Validation | Sarah and Nina are in warranty |  | Not started |  |  | Warranty statuses validated |  |
| 10.4 | Validation | Marcus and Alex are out of warranty |  | Not started |  |  | Warranty statuses validated |  |
| 10.5 | Validation | Nina has firmware update available |  | Not started |  |  | Firmware status validated |  |
| 10.6 | Validation | Marcus has product affinity and engagement context |  | Not started |  |  | Affinity and engagement present |  |
| 10.7 | Validation | Notification suppression data is present |  | Not started |  |  | Notification history and suppression fields present |  |
| 10.8 | Validation | No operational orders, claims, shipments, refunds, credits, coupons, or Case writeback configured |  | Not started |  |  | Guardrails verified |  |

## 11) Demo readiness decision

| Step # | Area | Task | Owner | Status | Start time | Complete time | Validation result | Notes / blocker |
|---|---|---|---|---|---|---|---|---|
| 11.1 | Decision | Ready for live demo |  | Not started |  |  | Yes/No |  |
| 11.2 | Decision | Ready with mock fallback only |  | Not started |  |  | Yes/No |  |
| 11.3 | Decision | Not ready |  | Not started |  |  | Yes/No |  |
| 11.4 | Decision | Blockers documented |  | Not started |  |  | Blockers listed with owners |  |
| 11.5 | Decision | Owner assigned for final go/no-go |  | Not started |  |  | Final owner confirmed |  |
| 11.6 | Decision | Next action defined |  | Not started |  |  | Next action and ETA recorded |  |

## Quick handoff notes
- If blocked, switch demo to approved fallback path immediately.
- Keep the recommendation-only and preview-only guardrail language.
- Do not add operational promises during live presentation.
