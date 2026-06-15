# Agentforce Integration Plan (Recommendation Messaging Only)

## Goal
Use Agentforce to help compose player-facing recommendation language while preserving strict safety and human-review requirements.

## Non-Goals
- No autonomous fulfillment actions.
- No claim/order/case/refund/coupon/shipment operations.
- No direct frontend calls to Agentforce.

## Server-Side Pattern
1. Frontend calls local endpoint:
   - `POST /api/agentforce/controller-message`
2. Backend builds constrained prompt payload from normalized decision context.
3. Backend invokes Agentforce using server credentials/session.
4. Backend applies policy guardrails before returning text to frontend.

## Suggested Request Shape (Server Internal)
- `ownerId`
- `serial`
- `recommendedOffer`
- `issueType`
- `issueConfidence`
- `warrantyStatus`
- `requiresHumanReview`
- `allowedLanguagePolicy` (recommendation-only)

## Suggested Response Shape to Frontend
- `title`
- `subtitle`
- `customerFacingLabel`
- `customerFacingMessage`
- `requiresHumanReview`
- `source` (`agentforce` or fallback source)

## Prompt/Policy Constraints
Agentforce output must:
- Use plain-language PlayStation-native tone.
- Include review-only phrasing:
  - "may be eligible"
  - "pending support review"
  - "recommended next step"
- Avoid prohibited words:
  - "approved", "issued", "ordered", "shipped", "on the way", "completed"
- Avoid revealing internal policy/scoring logic.

## Runtime Safeguards
- Post-generation validation:
  - reject/replace unsafe terms
  - ensure required review disclaimer exists
- If validation fails, return static safe template copy.
- Log policy failures server-side for debugging, not frontend display.

## Failure Handling
- Agentforce timeout/error => fallback to deterministic static copy.
- Frontend still receives complete normalized contract and remains interactive.

## Deployment Stages
### Stage 1
- Keep mock/static copy as default.
- Implement endpoint contract only (no live call).

### Stage 2
- Add live Agentforce call behind env feature flag.
- Run in observe mode; compare output with static templates.

### Stage 3
- Enable Agentforce messaging for demo paths after validation confidence.
- Keep fallback toggle available for every demo run.

## Explicit Prohibited Actions
- No warranty claim creation.
- No replacement order creation.
- No coupon issuance.
- No refund/credit/compensation execution.
- No shipment/fulfillment operations.
- No Case writeback unless explicitly approved later.
