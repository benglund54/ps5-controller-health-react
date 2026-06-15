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
- Frontend: React + Vite single-page app.
- State approach: lightweight component state/hooks for persona, toast lifecycle, right-panel visibility, and persona-session navigation counters.
- Data source sequence:
  1. Deterministic local persona fixtures and decision engine.
  2. Optional mock/CSV fallback adapter for demo resilience.
  3. Future server API boundary for Salesforce/Data Cloud/Agentforce (server-side only).
- Service boundary: frontend consumes a normalized response contract only.

## Data model summary
Primary model blocks:
- Persona profile: `ownerId`, `displayName`, `serial`, telemetry and issue fields.
- Decision payload: recommendation enum, confidence/severity, review requirement.
- UI payload: title, subtitle, actions (`view_details`, `later`, plus persona-specific simulated next-step actions).

Reference sources:
- `controller-health-react-handoff/reference-data/controllerHealthPersonas.js`
- `controller-health-react-handoff/reference-data/controllerHealthDecisionEngine.js`
- `controller-health-react-handoff/RESPONSE_CONTRACT.md`

## Response contract summary
The normalized response includes:
- top-level metadata (`source`, `decisionTime`, `ownerId`, `serial`)
- `decision` object (warranty, telemetry/risk, issue details, recommendation, human-review flags, customer-facing copy)
- `ui` object (title/subtitle and allowed action labels)

Recommendation enum:
- `FREE_REPLACEMENT`
- `DISCOUNT_REPLACEMENT`
- `REPAIR_REVIEW`
- `TROUBLESHOOTING`
- `NO_ACTION`

## Demo guardrails
- Recommendation-only behavior everywhere.
- Human review required for all non-`NO_ACTION` outcomes.
- No operational side effects.
- No client-side Salesforce authentication.
- Preserve mock/CSV fallback so demo remains stable offline.

## Acceptance criteria
- PS5-style home shell and visual polish are established using copied assets where available and handoff style references.
- Persona switching drives deterministic recommendation paths.
- Proactive toast appears only after exactly 5 valid left/right tile navigation events on home screen.
- Proactive toast does not appear on picker or immediately on home load.
- Later/dismiss prevents retrigger for the current persona session.
- Switching persona resets navigation count and proactive state for the new persona session.
- Right-side detail/action panel supports persona-specific simulated flows without leaving console UI.
- No quick-test modal/CTA/path exists.
- All user-facing copy follows recommendation-only language constraints.
- App runs with local deterministic data and fallback pattern; no backend dependency required.
- No Pronto-domain logic appears in UI, data, or terminology.
- Integration boundaries are documented as server-side only for future phases.
