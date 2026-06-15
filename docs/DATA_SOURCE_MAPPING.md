# Data Source Mapping

## Purpose
Map Salesforce CRM, Data Cloud, and CSV/Snowflake sources to the frontend response contract used by the React app.

## Frontend Contract (Target)
Top-level:
- `source`
- `decisionTime`
- `ownerId`
- `serial`
- `decision`
- `ui`

Decision fields:
- `inWarranty`
- `telemetrySeverity`
- `engagementScore`
- `riskScore`
- `issueType`
- `issueConfidence`
- `batteryWearOnly`
- `recommendedOffer`
- `discountPercent`
- `requiresHumanReview`
- `reviewLevel`
- `customerFacingLabel`
- `customerFacingMessage`

## Source Inventory
### Salesforce CRM
- `Contact`
- `Asset`
- `Product2`
- `Case` (read-only context)
- `Order` / `OrderItem` (read-only if available)

### Data Cloud / CSV / Snowflake
- Controller Asset Registry
- Controller Telemetry Rollups
- Controller Telemetry Events
- Gameplay Engagement Rollups
- Subscription Entitlements
- Warranty Policy Rules
- Controller Health Decisions
- Controller UI Events

## Mapping Table
- `ownerId`
  - CRM: `Contact.External_Player_Id__c` (or mapped identity key)
  - Data Cloud/CSV: `player_id`
- `serial`
  - CRM: `Asset.SerialNumber`
  - Data Cloud/CSV: `controller_serial`
- `controllerModel` (internal model input)
  - CRM: `Product2.Name` via `Asset.Product2Id`
  - Data Cloud/CSV: `controller_model`
- `inWarranty`
  - CRM: derived from `Asset.PurchaseDate` + policy lookup, or entitlement record
  - Data Cloud/CSV: `warranty_active`
- `telemetrySeverity`
  - Data Cloud/CSV: aggregate telemetry severity score
- `engagementScore`
  - Data Cloud/CSV: gameplay engagement rollup metric
- `riskScore`
  - Server-calculated from telemetry + engagement + policy rules
- `issueType`
  - Data Cloud/CSV: dominant issue classification (`stick_drift`, `disconnects_firmware`, etc.)
- `issueConfidence`
  - Data Cloud/CSV: model confidence or heuristic confidence
- `batteryWearOnly`
  - Data Cloud/CSV: battery degradation flag
- `recommendedOffer`
  - Server recommendation engine or curated decision table
- `discountPercent`
  - Server decision output (never implies fulfillment)
- `requiresHumanReview`
  - Server policy default true for non-`NO_ACTION`
- `reviewLevel`
  - Server policy output (`tier2`, `none`)
- `customerFacingLabel`
  - Server safe-copy mapper
- `customerFacingMessage`
  - Server safe-copy mapper or Agentforce draft filtered by guardrails
- `ui.title`
  - Static copy: `Controller health check`
- `ui.subtitle`
  - Derived safe summary from `issueType`
- `ui.actions`
  - Static safe action set:
    - `view_details`
    - `run_quick_test`
    - `request_review`
    - `dismiss`

## Data Priority and Merge Order
1. Deterministic local mock (always available baseline)
2. CSV/Snowflake extracts (if configured)
3. Data Cloud rollups/events
4. Salesforce CRM context enrichment
5. Agentforce message generation (copy only)

If any tier fails, continue with lower tiers without UI outage.

## Fallback Behavior
- If CRM unavailable: keep telemetry-driven recommendation with mock profile.
- If Data Cloud unavailable: use deterministic mock decision.
- If Agentforce unavailable: use static safe customer message templates.
- Always return valid normalized contract.

## Guardrail Filters (Server)
- Strip internal logic fields from player-facing payload:
  - fraud checks
  - scoring thresholds
  - internal reason codes
  - LTV internals
- Enforce recommendation-only language in final `customerFacingMessage`.
