# Middleware Integration Plan (Scaffold-Only)

## Scope

This phase creates a local server scaffold only. It is mock-backed and does not call Salesforce, Data Cloud, or Agentforce.

## Architecture

- **Entry point:** `server/index.js`
- **Express app:** `server/app.js`
- **Routes:** `server/routes/apiRoutes.js`
- **Services**
  - `server/services/mockFallbackService.js` (active)
  - `server/services/contractNormalizer.js` (active)
  - `server/services/crmReadService.js` (placeholder, disabled)
  - `server/services/dataCloudReadService.js` (placeholder, disabled)
  - `server/services/agentforceMessageService.js` (placeholder, disabled)
- **Env config:** `server/config/env.js`

## Route Contract

- `GET /api/players/:playerId`
  - Returns mock player profile + device context.
- `GET /api/players/:playerId/controller-health`
  - Returns mock device + health signal context.
- `POST /api/controller-health/recommendation`
  - Returns canonical response contract shape from `docs/RESPONSE_CONTRACT.md`.
- `POST /api/controller-health/resolve-preview`
  - Returns preview-only success.
  - No writeback to Salesforce or any other system.

## Error Handling

- Unknown player IDs return `404 PLAYER_NOT_FOUND`.
- Unexpected errors return `500 INTERNAL_ERROR`.
- All responses include preview-safe semantics and avoid operational side effects.

## Environment Strategy

These env vars are scaffolded for future phases:

- `MIDDLEWARE_PORT` (default `4010`)
- `MIDDLEWARE_SOURCE_MODE` (default `MOCK_ONLY`)
- `MIDDLEWARE_DATA_SOURCE` (`mock|salesforce`, default `mock`)
- `MIDDLEWARE_SF_ALIAS` (default `ps5-controller-demo`)
- `MIDDLEWARE_ENABLE_CRM_READS` (`true|false`, currently false)
- `MIDDLEWARE_ENABLE_DATACLOUD_READS` (`true|false`, currently false)
- `MIDDLEWARE_ENABLE_AGENTFORCE` (`true|false`, currently false)

## Salesforce Read-Service Phase

- When `MIDDLEWARE_DATA_SOURCE=salesforce`, middleware attempts read-only CRM queries via `sf data query` against `MIDDLEWARE_SF_ALIAS`.
- If CRM reads fail for any reason, middleware falls back to mock context and returns `meta.source="PARTIAL_FALLBACK"` with `fallbackUsed=true`.
- Telemetry remains mock-backed until Data Cloud integration phase.
- No write operations are allowed in this phase.

## Guardrails Enforced

- Frontend does not authenticate to Salesforce.
- No credentials in frontend.
- No Salesforce/Data Cloud/Agentforce calls in this phase.
- No Case writes, no order/claim/shipment/refund/coupon/credit creation.
- No `Recommendation_Outcome__c` creation in this phase.
- `resolve-preview` is middleware-only preview behavior.

