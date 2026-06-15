# Reusable Files Manifest

## Copied into this package

| New path | Original source | Why included | Use mode |
|---|---|---|---|
| `assets/PS5_Welcome_background-c2fb8859-4d49-4f6e-9620-7868bb34da1a.png` | `assets/PS5_Welcome_background-c2fb8859-4d49-4f6e-9620-7868bb34da1a.png` | PS5-style background aesthetic | Direct |
| `assets/Background_image-ee73d65f-96bd-4296-ada4-8270e78c5c26.png` | `assets/Background_image-ee73d65f-96bd-4296-ada4-8270e78c5c26.png` | Alternate background layer | Direct |
| `assets/welcome-widgets-overlay.png` | `assets/welcome-widgets-overlay.png` | UI overlay texture/polish | Direct |
| `assets/astro_bot-788ff256-67f0-461a-b09e-981f24683a15.png` | `assets/astro_bot-788ff256-67f0-461a-b09e-981f24683a15.png` | Placeholder tile art for dashboard | Direct |
| `reference-styles/ps5-theme-reference.css` | Derived from `ps5-controller-health-demo.html` | PS5 visual tokens + panel/button styling patterns | Reference |
| `reference-components/Ps5ShellLayout.jsx` | Derived from `ps5-controller-health-demo.html` layout structure | Reusable shell scaffolding for React | Reference |
| `reference-components/ProactiveHealthToast.jsx` | Pattern from proactive recommendation card in existing demo | Proactive alert pattern for controller-health use case | Reference |
| `reference-components/ControllerHealthCard.jsx` | Pattern from response card/details sections | Main recommendation/details card skeleton | Reference |
| `reference-components/QuickTestModal.jsx` | Pattern from modal/flow transitions | Quick test modal skeleton | Reference |
| `reference-components/PersonaSwitcher.jsx` | Pattern from profile/persona selector | Persona switching UX model | Reference |
| `reference-data/controllerHealthPersonas.js` | Inspired by `src/data/prontoPersonas.js` | Deterministic persona fixtures for new use case | Direct |
| `reference-data/controllerHealthDecisionEngine.js` | Inspired by fallback decision patterns in `server/prontoDataProvider.js` and `server/prontoCsvService.js` | Deterministic mock decision logic + normalized contract | Direct |

## Intentionally excluded

- `.env`, `.env.example`, credentials, tokens.
- `node_modules`, build outputs, generated deploy artifacts.
- Pronto-specific API/business files for direct reuse:
  - `server/prontoCsvService.js`
  - `server/prontoDataProvider.js`
  - `server/routes/pronto.js`
  - `src/data/pronto*`
- Salesforce metadata under `force-app/**` (domain-specific and not needed to start the new React app).
- Pronto logos and food-delivery-branded assets.

