# PS5 Controller Health Demo Runbook

## 1) Demo objective
This demo shows a proactive PlayStation controller health experience where the player is guided to a recommendation-only, preview-only outcome. The experience uses Salesforce-backed context through safe middleware orchestration, while preserving deterministic local fallback so the demo stays reliable in live presentation conditions.

## 2) Architecture summary in plain English
- React PS5 app: the player-facing experience.
- Middleware: a safe server-side translator between frontend and backend sources.
- Salesforce Core: player, controller, entitlement, firmware, product, and case context.
- Data Cloud: future behavioral and telemetry unification layer.
- Agentforce: future safe player-facing message generation layer.
- Frontend never authenticates directly to Salesforce.

## 3) Recommended demo mode
- Recommended: React + middleware with Salesforce-backed middleware mode.
- Backup: mock-only mode.

## 4) How to run mock-only mode
```bash
npm install
npm run dev
```

Open the Vite URL shown in terminal, usually [http://localhost:5173](http://localhost:5173).

## 5) How to run React + middleware in mock mode
Terminal 1:
```bash
MIDDLEWARE_DATA_SOURCE=mock npm run server:start
```

Terminal 2:
```bash
VITE_CONTROLLER_HEALTH_SOURCE=middleware VITE_CONTROLLER_HEALTH_API_BASE=http://localhost:4010 npm run dev
```

## 6) How to run React + middleware in Salesforce mode
Terminal 1:
```bash
MIDDLEWARE_DATA_SOURCE=salesforce MIDDLEWARE_SF_ALIAS=ps5-controller-demo npm run server:start
```

Terminal 2:
```bash
VITE_CONTROLLER_HEALTH_SOURCE=middleware VITE_CONTROLLER_HEALTH_API_BASE=http://localhost:4010 npm run dev
```

Salesforce access is server-side only through middleware.

## 7) Smoke test commands
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

## 8) Persona-by-persona demo flow

### PLAYER001 Sarah Jeffries
- Expected outcome: `INCLUDED_REPLACEMENT`
- Story: in warranty, high right-stick drift, included DualSense replacement with optional upgrade choices.
- Steps:
  1. Select Sarah.
  2. Navigate tiles five times with ArrowLeft and ArrowRight.
  3. Open Controller Health alert.
  4. Show included replacement path.

### PLAYER002 Marcus Chen
- Expected outcome: `PERSONALIZED_UPGRADE`
- Story: out of warranty, high engagement, personalized paid upgrade or replacement options.
- Steps:
  1. Select Marcus.
  2. Trigger alert after five tile moves.
  3. Open Controller Health alert.
  4. Show personalized upgrade options.
- Reminder: do not expose internal scores or decision logic.

### PLAYER003 Nina Patel
- Expected outcome: `FIRMWARE_TROUBLESHOOTING`
- Story: firmware-related disconnect issue, troubleshooting-first path, no replacement offer.
- Steps:
  1. Select Nina.
  2. Trigger alert after five tile moves.
  3. Open Controller Health alert.
  4. Show firmware update and troubleshooting path.

### PLAYER004 Alex Rivera
- Expected outcome: `STICK_MODULE_PATH`
- Story: DualSense Edge owner, stick drift handled with modular stick replacement path instead of full controller replacement.
- Steps:
  1. Select Alex.
  2. Trigger alert after five tile moves.
  3. Open Controller Health alert.
  4. Show stick module path.

## 9) Presenter talk track

### Opening
"This is a proactive Controller Health experience inside a PS5-style interface. The app surfaces a recommendation-only outcome using safe middleware orchestration and Salesforce-backed context when available."

### Sarah
"Sarah is in warranty with high right-stick drift, so the recommended path is an included replacement, with optional upgrade choices shown as preview-only."

### Marcus
"Marcus is out of warranty and highly engaged, so he receives personalized upgrade options. The experience is recommendation-only, and no fulfillment action is executed."

### Nina
"Nina shows firmware-related disconnect behavior, so the system prioritizes troubleshooting first and avoids unnecessary replacement."

### Alex
"Alex uses a DualSense Edge, so the path is modular stick replacement rather than full controller replacement."

### Closing
"The demo remains resilient across modes. If live data is unavailable, deterministic mock fallback keeps the same persona narratives available for presentation."

## 10) Keyboard and controller controls
- ArrowLeft and ArrowRight: navigate tiles
- Enter: select
- Escape: close overlay
- R: reset current persona session
- P: return to profile picker

## 11) Fallback plan if Salesforce mode fails
1. Stop both servers.
2. Restart in mock-only mode:
   ```bash
   npm run dev
   ```
3. Explain that the demo is designed to remain available through local deterministic fallback.
4. Optional fallback verification:
   ```bash
   npm run test:middleware:fallback
   npm run test:frontend:fallback
   ```

## 12) Troubleshooting
- Vite port is different than 5173
  - Use the URL printed by `npm run dev`.
- Middleware port 4010 is already in use
  - Stop the conflicting process or use another port and update `VITE_CONTROLLER_HEALTH_API_BASE`.
- Salesforce alias not found
  - Verify alias with `sf org list` and use the correct alias in `MIDDLEWARE_SF_ALIAS`.
- Middleware unavailable
  - Confirm middleware is running and API base URL matches the middleware port.
- Frontend still showing mock mode
  - Confirm `VITE_CONTROLLER_HEALTH_SOURCE=middleware` is set in the same terminal session running Vite.
- Smoke test failure
  - Re-run failing command, verify ports and alias, then run full smoke matrix again.
- Browser cache or stale app state
  - Hard refresh browser tab and restart Vite if needed.
- Need to reset persona session
  - Use `R` to reset current session or `P` to return to profile picker.

## 13) Guardrails and prohibited language

Do not claim:
- Salesforce creates a real order
- Salesforce creates a real warranty claim
- A shipment is triggered
- A refund is issued
- A coupon is issued
- A credit or compensation is applied
- A Case is written back or updated
- The frontend authenticates directly to Salesforce

Recommended language:
- Recommendation-only
- Preview-only
- Safe middleware orchestration
- Salesforce-backed context
- Mock fallback for demo resilience

## 14) Final pre-demo checklist
- [ ] Working tree clean
- [ ] `npm run lint` passed
- [ ] `npm run build` passed
- [ ] Middleware smoke tests passed
- [ ] Frontend smoke tests passed
- [ ] Correct mode selected
- [ ] Correct Vite URL open
- [ ] Four persona stories reviewed
- [ ] Fallback plan ready
