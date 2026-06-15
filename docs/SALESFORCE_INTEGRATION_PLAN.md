# Salesforce Integration Plan (Server-Side Only)

## Scope
This document defines a secure path to add Salesforce-backed data to the PS5 Controller Health demo while keeping the current mock-first UI resilient and runnable.

## Security Principles
- Frontend never authenticates directly to Salesforce.
- Salesforce CLI auth is local-dev only and used by backend/server tools.
- No secrets in frontend bundles.
- No real write operations (Case/order/claim/refund/coupon/shipping) in this phase.
- Read-only/recommendation-only behavior by default.

## Local Authentication Approach (CLI Alias)
- Target alias for this demo org: `ps5-controller-demo`.
- Use CLI browser auth when approved:
  - `sf org login web -a ps5-controller-demo`
- Verify active orgs safely:
  - `sf org list`
  - `sf org list --json`

## Safe Org Audit Checklist
Run and review:
1. `sf --version`
2. `sf org list --json`
3. Confirm:
   - alias
   - username
   - instance URL
   - connected status
4. Do not copy/store token fields from command output.

## Safe Disconnect/Logout Pattern
Only run with explicit approval.

Per-org logout command:
- `sf org logout --target-org <alias> --no-prompt`

Examples:
- `sf org logout --target-org agentforcedx --no-prompt`
- `sf org logout --target-org coral-cloud --no-prompt`

Bulk logout (use with caution and explicit approval):
- `sf org logout --all --no-prompt`

## Proposed Runtime Architecture
1. **React app (current)** calls local endpoints only.
2. **Local backend/API proxy** handles all Salesforce/Data Cloud/Agentforce communication.
3. **Service adapters** on server:
   - `crmReadService`
   - `dataCloudReadService`
   - `agentforceMessageService`
   - `mockFallbackService`
4. **Contract normalizer** returns one frontend-safe response shape.

## Proposed Local API Boundary
- `GET /api/player/:ownerId/context`
  - Returns player profile, asset pointers, and engagement summary.
- `GET /api/controller/:serial/health`
  - Returns normalized controller health payload.
- `POST /api/controller/decision/evaluate`
  - Evaluates recommendation from known context (no writeback).
- `POST /api/agentforce/controller-message`
  - Returns recommendation copy/message payload (no fulfillment action).

## Salesforce CRM Read Targets
- `Contact` (player identity linkage and profile metadata)
- `Asset` (controller ownership and serial mapping)
- `Product2` (controller product/model metadata)
- `Case` (historical support context, read-only unless later approved)
- `Order` and `OrderItem` (historical purchase context if available; read-only)

## Integration Phasing
### Phase A (Current/Next)
- Keep mock fallback as default.
- Add server boundary and normalized response contract handler.

### Phase B
- Add CRM read service behind feature flag.
- Merge CRM context with mock/CSV telemetry.

### Phase C
- Add Data Cloud retrieval for telemetry rollups and events.
- Keep deterministic fallback path available.

### Phase D
- Add Agentforce message recommendation endpoint for narrative text generation.
- Keep human-review language constraints enforced server-side.

## Fallback and Resilience Requirements
- If Salesforce/Data Cloud/Agentforce is unavailable:
  - return deterministic mock response from local fallback provider.
- Include source metadata in response (`mock`, `crm`, `dataCloud`, `agentforce-hybrid`).
- Never block rendering if an upstream source fails.

## Explicit Prohibited Actions
- No warranty claim creation.
- No replacement order creation.
- No coupon issuance.
- No refund/credit/compensation execution.
- No shipment/fulfillment operations.
- No Case writeback unless explicitly approved in a future phase.
