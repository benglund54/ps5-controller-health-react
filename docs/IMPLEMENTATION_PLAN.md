# Implementation Plan

## Recommended app structure
- `src/app/`
  - App shell composition and top-level orchestration.
- `src/components/`
  - `Ps5HomeShell.jsx`
  - `PersonaSelector.jsx`
  - `ProactiveHealthToast.jsx`
  - `ControllerHealthActionPanel.jsx`
- `src/services/`
  - `controllerHealthService.js` (normalized contract provider)
  - `controllerHealthFallbackService.js` (mock/CSV fallback layer)
- `src/data/`
  - `controllerHealthPersonas.js` (adapted from handoff reference)
- `src/logic/`
  - `controllerHealthDecisionEngine.js` (deterministic decision mapping)
- `src/styles/`
  - `ps5-theme.css` (adapted from handoff reference styles)

Note: naming can be adjusted, but keep clear separation between UI, service contract, and deterministic decision logic.

## Implementation phases
### Phase 0: Planning and alignment (current)
- Confirm handoff scope, asset inventory, and guardrails.
- Finalize PRD and implementation plan.

### Phase 1: PS5 shell and static UI slice
- Build PS5 shell/home screen.
- Add persona selector.
- Render static proactive toast and right-side panel shell from fixed mock payload.
- Include request review and later/dismiss controls as non-executing UI actions.

### Phase 2: Deterministic persona-driven behavior
- Wire persona switcher to deterministic response generation.
- Connect to normalized response contract.
- Add recommendation path rendering for all 5 allowed outcomes.
- Add per-persona-session state lifecycle reset on persona switch.

### Phase 3: Navigation-triggered proactive behavior and panel actions
- Track valid home tile navigation events (`ArrowLeft`/`ArrowRight`) only when tile index changes.
- Trigger proactive toast exactly at count `=== 5`, once per persona session.
- Add dismiss/later behavior and reminder state handling for current persona session.
- Implement persona-specific right-side action-panel step flows (simulated only).

### Phase 4: Resilience and polish
- Add mock/CSV fallback service path for demo stability.
- Refine copy for recommendation-only language compliance.
- Add keyboard/controller-friendly interaction polish.

### Phase 5: Future integration prep (no live integration)
- Add server-boundary interface stubs/TODOs only.
- Document expected API shape and secure server-side integration points.
- Keep frontend free of Salesforce credentials/auth logic.

## Files to create (next implementation phase, not now)
- `src/components/Ps5HomeShell.jsx`
- `src/components/PersonaSelector.jsx`
- `src/components/ProactiveHealthToast.jsx`
- `src/components/ControllerHealthActionPanel.jsx`
- `src/services/controllerHealthService.js`
- `src/services/controllerHealthFallbackService.js`
- `src/data/controllerHealthPersonas.js`
- `src/logic/controllerHealthDecisionEngine.js`
- `src/styles/ps5-theme.css`
- `src/constants/controllerHealthCopy.js` (optional centralized copy rules)

## Files to modify (next implementation phase, not now)
- `src/App.jsx` (replace starter screen with feature shell orchestration)
- `src/main.jsx` (only if provider/app wiring changes are needed)
- `src/index.css` (minimize changes; keep global reset sane)
- `README.md` (manual demo test instructions and guardrails)

## Files not to touch
- `controller-health-react-handoff/**` as source reference (do not mutate).
- `package.json` and dependency graph for this planning phase.
- Any backend/Salesforce integration files (none should be introduced yet).

## Test plan
- Persona matrix validation:
  - Each persona maps to expected recommendation path.
  - `NO_ACTION` persona suppresses proactive urgency UX.
- Interaction checks:
  - Toast shows only at the 5th valid left/right tile move.
  - View details opens right-side action panel.
  - Persona switch resets nav counter and proactive state.
  - Request review remains recommendation-only (no side effects).
  - Later/dismiss preserves intended UI state for current persona session.
- Copy compliance checks:
  - No prohibited execution words.
  - No internal policy/scoring details exposed.
- Resilience checks:
  - App works from deterministic local data.
  - Fallback mode remains available when primary mock source is unavailable.

## Risks and safeguards
- Missing copied PS5 asset pack risk:
  - Safeguard: proceed with handoff style tokens and fallback placeholders until assets are restored.
- Drift into Pronto-domain language risk:
  - Safeguard: centralize approved copy and add a prohibited-term review checklist.
- Accidental fulfillment implication risk:
  - Safeguard: enforce "request review" semantics in all CTA labels and states.
- Future integration security risk:
  - Safeguard: maintain strict frontend/server boundary; never embed Salesforce auth in client.
- Contract drift risk:
  - Safeguard: keep a single normalized response contract and validate mock service output against it.
- Trigger counting drift risk:
  - Safeguard: increment only when selected tile index changes.
