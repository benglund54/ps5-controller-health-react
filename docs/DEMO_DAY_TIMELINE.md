# PS5 Controller Health Demo Day Timeline

## 1) Purpose
This timeline helps the team run a predictable rehearsal and demo-readiness check in 30-45 minutes, with clear owner assignments, fallback checkpoints, and a final go/no-go decision.

## 2) Roles and owners

| Role | Suggested owner | Primary responsibility |
|---|---|---|
| Demo presenter |  | Narration, story flow, guardrail-safe language |
| Demo operator |  | Runs commands, drives app interactions live |
| Salesforce/Core validation owner |  | Confirms Salesforce-backed mode and persona outcomes |
| Data Cloud validation owner |  | Confirms Data Cloud readiness or architecture-only fallback |
| Fallback owner |  | Triggers fallback path quickly if issues occur |
| Notes/blocker owner |  | Tracks blockers, decisions, and next actions |

## 3) 30-45 minute rehearsal timeline

| Timebox | Owner | Activity | Success criteria | Fallback decision |
|---|---|---|---|---|
| 0-5 min | Demo operator | Confirm repo clean, terminals ready, browser ready | Working tree clean, browser open, commands ready | If setup is unstable, pause and reset environment before continuing |
| 5-10 min | Demo operator + fallback owner | Run smoke tests | Smoke matrix passes or known issue is isolated | If smoke tests fail and cannot be fixed in 10 minutes, switch to fallback mode |
| 10-15 min | Salesforce/Core validation owner | Start Salesforce-backed middleware mode | Middleware + frontend running with middleware feature flag | If Salesforce alias fails, switch to middleware mock or mock-only mode |
| 15-25 min | Presenter + demo operator | Run four-persona demo path | Sarah, Marcus, Nina, Alex outcomes are correct | If one persona fails, continue with valid personas and call out controlled fallback |
| 25-30 min | Fallback owner | Validate fallback mode path | Mock fallback starts and produces expected outcomes | If fallback fails, reduce scope to walkthrough/screenshots |
| 30-35 min | Presenter + notes owner | Review talk track and guardrails | Messaging is concise, recommendation-only and preview-only language confirmed | Remove risky phrasing before final run |
| 35-45 min | All owners | Final go/no-go decision and assign blockers | Final status recorded with owner and next action | If no-go, assign action owner and next checkpoint time |

## 4) Command blocks

### Smoke tests
```bash
npm run lint
npm run build
npm run test:middleware:mock
npm run test:middleware:salesforce
npm run test:middleware:fallback
npm run test:frontend:mock
npm run test:frontend:middleware
npm run test:frontend:fallback
```

### Salesforce-backed middleware mode
Terminal 1:
```bash
MIDDLEWARE_DATA_SOURCE=salesforce MIDDLEWARE_SF_ALIAS=ps5-controller-demo npm run server:start
```

Terminal 2:
```bash
VITE_CONTROLLER_HEALTH_SOURCE=middleware VITE_CONTROLLER_HEALTH_API_BASE=http://localhost:4010 npm run dev
```

### Mock-only fallback mode
```bash
npm run dev
```

## 5) Fallback decision checkpoints
- If Salesforce alias fails, switch to mock fallback immediately.
- If middleware fails, switch to mock-only React mode.
- If Data Cloud is incomplete, present Data Cloud as architecture and future layer only.
- If frontend has a UI issue, use runbook screenshots or switch persona/story order.
- If smoke tests fail and cannot be fixed in 10 minutes, use fallback mode.

## 6) Demo-ready criteria
- App loads successfully.
- Four personas run successfully.
- Outcomes are correct:
  - Sarah -> `INCLUDED_REPLACEMENT`
  - Marcus -> `PERSONALIZED_UPGRADE`
  - Nina -> `FIRMWARE_TROUBLESHOOTING`
  - Alex -> `STICK_MODULE_PATH`
- Salesforce-backed mode works or fallback mode is approved.
- Presenter can explain recommendation-only and preview-only guardrails.
- No operational writeback claims are made.

## 7) Final go/no-go table

| Decision | Owner | Status | Blocker | Next action |
|---|---|---|---|---|
| Ready for live demo |  |  |  |  |
| Ready with approved fallback |  |  |  |  |
| Not ready |  |  |  |  |

## 8) Guardrail reminder
Do not claim:
- No real order
- No claim
- No shipment
- No refund
- No coupon
- No credit or compensation
- No Case writeback
- No frontend Salesforce authentication
