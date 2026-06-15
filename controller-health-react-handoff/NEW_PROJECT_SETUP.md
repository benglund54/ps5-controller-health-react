# New Project Setup

## 1) Create new React app

Recommended:

```bash
npm create vite@latest ps5-controller-health -- --template react
cd ps5-controller-health
npm install
```

## 2) Copy handoff package

Copy `controller-health-react-handoff` from this repo into the new project root.

## 3) Bring in references

- Copy `controller-health-react-handoff/reference-styles/ps5-theme-reference.css` into your app styles.
- Use `reference-components/*.jsx` as build references (not final production components).
- Use `reference-data/*` for deterministic local mock logic.

## 4) Build feature slices

- `HomeDashboard`
- `ProactiveHealthToast`
- `ControllerHealthCard`
- `QuickTestModal`
- `PersonaSwitcher`

## 5) Mock API contract

Implement a local `controllerHealthService` returning the shape from `RESPONSE_CONTRACT.md`.

## 6) Future backend boundary

- Keep all future Salesforce/Data Cloud/Agentforce integration server-side only.
- Frontend consumes a normalized JSON contract only.

## 7) Manual test checklist

- Persona switching updates recommendation path correctly.
- Toast can open details card.
- Quick test updates/retains deterministic recommendation.
- Request review CTA stays non-executing (review-only).
- No copy implies fulfillment completed.

