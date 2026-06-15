# PS5 Controller Health Demo PRD

## Product overview
Build a polished React/Vite demo for a PlayStation-native controller health experience. The app simulates proactive detection of controller issues and presents recommendation-only next steps with strict human-review guardrails.

This phase is planning-only. No live Salesforce, Data Cloud, or Agentforce integration is included.

## Demo story
A player lands on a PS5-style home screen after selecting a persona. After five tile-navigation moves (ArrowLeft/ArrowRight), they receive a proactive controller health alert. They can open details in a right-side panel or dismiss for later. Recommendations are presented as eligibility/review outcomes only.

## Target users / personas
- Primary: PlayStation player receiving proactive health guidance.
- Secondary: Demo operator switching personas to show all recommendation paths.
- Data source in phase 1 implementation: deterministic persona fixtures from `controller-health-react-handoff/reference-data/controllerHealthPersonas.js`.

## Core user flow
1. User arrives at PS5-style home shell.
2. User selects persona (or default persona loads).
3. User navigates home tiles naturally; each valid left/right move increments navigation count.
4. At the 5th valid navigation move, app shows proactive health toast.
5. User opens controller health right-side detail/action panel or chooses later.
6. User completes persona-specific simulated next steps inside console UI.
7. UI keeps recommendation-only language and does not execute operational actions.

## Screens and components
- Home shell (PS5-styled background, header, hero/status area).
- Persona switcher.
- Proactive health toast/alert.
- Controller health right-side detail/action panel.
- Persona-specific action steps (simulated).
- Dismiss/later state and reminder visibility state.

## Recommendation paths
The UI must support these paths:
1. Free replacement review
2. Discounted replacement review
3. Repair / stick-module review
4. Troubleshooting
5. No action

All non-`NO_ACTION` outcomes remain pending human review.

## Customer-facing language rules
- Use plain-language, PlayStation-native tone.
- Use recommendation-only wording such as:
  - "may be eligible"
  - "recommended next step"
  - "pending support review"
- Never use execution/finalization language:
  - "approved", "issued", "ordered", "shipped", "on the way", "completed"
- Never expose internal decision rationale like LTV, fraud signals, thresholds, or internal reason codes.

## Out of scope
- Creating warranty claims, replacement orders, service cases, refunds, credits, coupons, shipments, or fulfillment actions.
- Frontend-authenticated Salesforce calls.
- Any direct Salesforce/Data Cloud/Agentforce connection in this phase.
- Carryover of Pronto food-delivery entities, refunds, recovery language, or order workflows.

## Technical architecture

### Frontend (Phase 1 — complete)
- React + Vite single-page app.
- Lightweight component state/hooks for persona, toast lifecycle, overlay visibility, and navigation counters.
- Mock async service layer (`src/services/controllerHealthService.js`) with identical function signatures to future real calls.
- Frontend never authenticates to Salesforce. No credentials in the browser.

### Full target architecture (Phase 2+)

```
PS5 / React Frontend (browser)
        │  fetch() — no SF credentials
        ▼
Node.js / Express Middleware (server)
        ├── GET  /api/players/:playerId
        ├── GET  /api/players/:playerId/controller-health
        ├── POST /api/controller-health/recommendation
        └── POST /api/controller-health/resolve-preview
                │
        ┌───────┴────────────────────────────────────┐
        │                                            │
Salesforce Core                              Data Cloud
(customer / business / service records)     (behavioral / telemetry / unified profile)
        │                                            │
        ├── Contact (Player profile)                 ├── Controller Health Profile DMO
        ├── Asset (Registered controller)            ├── Engagement Profile DMO
        ├── Product2 + Pricebook                     ├── Player Entitlement DMO
        ├── Player_Entitlement__c                    ├── Firmware Status DMO
        ├── Device_Firmware_Status__c                └── Unified Individual
        ├── Case (read-only history)                          │
        └── Recommendation_Outcome__c                         │
            (preview log only;                       Snowflake (zero-copy connector)
             no real actions ever created)           ├── PS5_TELEMETRY.CONTROLLER.HEALTH_SIGNALS
                                                     └── PS5_ENGAGEMENT.PLAYER.WEEKLY_ROLLUPS
```

### Data ownership model

| Data type | Lives in | Rationale |
|---|---|---|
| Player profile (name, address, PSN handle) | Salesforce Contact | CRM is authoritative for customer identity |
| Registered controller | Salesforce Asset | Business record of device ownership |
| Products and pricing | Salesforce Product2 + Pricebook | Standard CRM product catalog |
| Historical support cases | Salesforce Case | Read-only CRM history |
| Warranty / replacement eligibility | Salesforce Player_Entitlement__c | Business eligibility rule output |
| Firmware state | Salesforce Device_Firmware_Status__c | Synced from external system |
| Controller telemetry signals | Snowflake → Data Cloud | High-volume time-series; not appropriate for CRM |
| Device session events | Snowflake → Data Cloud | Billions of rows at scale; zero-copy ingestion |
| Gameplay engagement | Snowflake → Data Cloud | Behavioral data; used for personalization only |
| Notification history | External → Data Cloud | Prevents duplicate outreach |
| Player product affinity | External → Data Cloud | Drives Marcus upgrade recommendation language |
| Recommendation outcome (preview log) | Salesforce Recommendation_Outcome__c | Analytics only; `previewOnly: true` enforced |

### Data Cloud identity resolution
- Primary match key: `player_id` (exact; stable across all systems)
- Secondary match keys: `psn_handle`, `email`
- `controller_serial` links to Device DMO, not Individual
- One Unified Individual per player (PLAYER001–PLAYER004)

### Agentforce integration
- Agentforce receives a unified player context from middleware
- Returns only player-safe recommendation copy
- Internal fields (LTV, churn, scoring) are never forwarded to the frontend
- Middleware strips internal fields before returning the response contract

## Data model summary

### Salesforce seed files (`data/salesforce/`)
| File | Object | Purpose |
|---|---|---|
| `contacts.csv` | Contact | Player profiles; upsert on `externalPlayerId` |
| `assets.csv` | Asset | Registered controllers; upsert on `controllerSerialNumber` |
| `products.csv` | Product2 | Controller product catalog; `productFamily` maps to `Product2.Family` (values: Controller-Standard, Controller-Premium, Controller-Limited, Controller-Accessory) |
| `pricebook_entries.csv` | PricebookEntry | MSRP + promotional + warranty/service pricing (3 pricebooks, 9 entries total) |
| `cases.csv` | Case | Historical support cases (read-only context; PLAYER004 has no case by design) |
| `player_entitlements.csv` | Player_Entitlement__c | Replacement / discount / firmware-only / module eligibility; all 4 players have explicit `entitlementSource` |
| `device_firmware_status.csv` | Device_Firmware_Status__c | Current vs latest firmware per device |
| `recommendation_outcomes_preview.csv` | Recommendation_Outcome__c | Preview log (example row only; write-back not enabled yet) |

### External / Data Cloud seed files (`data/external/`)
| File | Data Cloud DMO | Purpose |
|---|---|---|
| `controller_telemetry_events.csv` | Controller Health Profile | Weekly aggregated drift + disconnect signals |
| `device_session_events.csv` | Controller Health Profile | Per-session input/disconnect event counts |
| `gameplay_engagement.csv` | Engagement Profile | Monthly engagement rollups per player |
| `notification_history.csv` | Notification History | Prior outreach; prevents duplicate alerts |
| `player_product_affinity.csv` | Engagement Profile | Product interest signals for upgrade recommendations |

### Snowflake candidates (`data/snowflake/`)
| File | Snowflake table | Purpose |
|---|---|---|
| `controller_telemetry_events_snowflake.csv` | PS5_TELEMETRY.CONTROLLER.HEALTH_SIGNALS | Full 8-week signal history; daily partition |
| `gameplay_engagement_snowflake.csv` | PS5_ENGAGEMENT.PLAYER.WEEKLY_ROLLUPS | Full 9-week engagement history; weekly partition |

Snowflake files include richer column sets (cumulative hours, platform version, ingested_at) representing the realistic production schema. Data Cloud ingests these via zero-copy connector or external table, not file upload.

## Response contract summary

See `docs/RESPONSE_CONTRACT.md` for the full v2 contract.

Recommendation types:
- `INCLUDED_REPLACEMENT` — Sarah: in-warranty, free replacement
- `PERSONALIZED_UPGRADE` — Marcus: out-of-warranty, loyalty promo checkout
- `FIRMWARE_TROUBLESHOOTING` — Nina: firmware update, no replacement offer
- `STICK_MODULE_PATH` — Alex: DualSense Edge stick module replacement

## Demo guardrails
- Recommendation-only behavior everywhere.
- `previewOnly: true` enforced by middleware on all resolve calls.
- No real orders, payments, claims, cases, shipments, refunds, or credits.
- No client-side Salesforce authentication.
- Mock fallback always available; demo runs offline.
- Internal fields (LTV, churn risk, scoring thresholds) never exposed to frontend.

## Acceptance criteria
- PS5-style home shell and visual polish established.
- Persona switching drives deterministic recommendation paths.
- Proactive toast appears after exactly 5 valid tile navigation events.
- Toast does not appear on picker or immediately on home load.
- Later/dismiss prevents retrigger for the current session.
- Switching persona resets navigation count and proactive state.
- Overlay supports persona-specific simulated flows without leaving console UI.
- All user-facing copy follows recommendation-only language constraints.
- App runs with local deterministic data and fallback pattern; no backend dependency required.
- Integration boundaries are documented as server-side only for future phases.
- No Pronto-domain logic appears in UI, data, or terminology.
