# Controller Health React Handoff

This package is a reusable starter handoff from the existing PS5-style demo so you can bootstrap a **new clean React app** for the **PlayStation Controller Health / Proactive Console Message** use case without rebuilding visual foundations from scratch.

It contains:
- curated visual assets (`assets/`)
- reference UI/component patterns (`reference-components/`)
- reusable style foundations (`reference-styles/`)
- controller-health-specific mock personas and deterministic decision logic (`reference-data/`)
- implementation docs and a copy/paste Cursor build prompt

## Intended usage

1. Create a new React project in a separate repo/folder.
2. Copy this entire `controller-health-react-handoff` folder into that new project.
3. Follow `NEW_PROJECT_SETUP.md`.
4. Use `CURSOR_BUILD_PROMPT_FOR_NEW_PROJECT.md` as the initial build prompt.

## Guardrails baked into this package

- Recommendation-only flows.
- No real replacement orders, claims, refunds, shipping, fulfillment, or compensation execution.
- Mock/CSV-first resilience.
- Frontend never authenticates directly to Salesforce.
- Any future Salesforce/Data Cloud/Agentforce integration remains server-side only.

## What this package is not

- Not a refactor of the current app.
- Not a production-ready implementation.
- Not a direct copy/paste of Pronto business logic.

Use this package as a clean starting accelerator for the new controller-health app.

