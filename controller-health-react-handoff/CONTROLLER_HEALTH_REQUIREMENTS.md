# Controller Health Requirements

## Experience goals

- PS5-style home/dashboard experience.
- Proactive console health message when telemetry risk is detected.
- Fast, controller-friendly action flow.
- Recommendation-only language and outcomes.

## Core user flow

1. **Home/dashboard**
   - Hero tile + persona selector.
   - Subtle status area for controller health state.

2. **Proactive toast/alert**
   - Triggered by deterministic mock telemetry.
   - Message example: "Controller health check available."

3. **Details card**
   - Issue summary (stick drift/input lag/disconnect/battery/firmware).
   - Confidence + severity explanation.
   - Recommendation text in customer-facing language.

4. **Quick test flow**
   - Launch from action button.
   - Simulate stick calibration/input response checks.
   - Return updated recommendation state.

5. **Request review CTA**
   - CTA is review-only; no fulfillment.
   - Example label: "Request review".

6. **Dismiss/later CTA**
   - Non-blocking closure path.
   - Preserve alert history state for future reminder.

## Recommendation paths (allowed)

1. Free replacement review
2. Discounted replacement review
3. Repair / stick-module review
4. Troubleshooting
5. No action

## Prohibited behavior

- No real replacement orders, warranty claims, cases, coupons, refunds, shipments, or fulfillment actions.
- No customer-facing language implying action already executed ("issued", "applied", "shipped", "completed").
- No client-side auth to Salesforce.

## UX copy guardrails

- Always use review language: "pending support review", "may be eligible", "recommended next step".
- Keep outcome confidence clear but non-final.

