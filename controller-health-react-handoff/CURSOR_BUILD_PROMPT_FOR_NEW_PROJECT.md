# Cursor Build Prompt (Copy/Paste)

Use this prompt in a **brand-new React project**:

---

Build a polished PS5-style React app for a **PlayStation Controller Health / Proactive Console Message** use case.

Context:
- I copied in a handoff folder named `controller-health-react-handoff`.
- Use it as source-of-truth reference for visuals, patterns, and requirements.
- Do not pull in old Pronto delivery business wording.

Requirements:
1. Create a clean React app structure with reusable components.
2. Implement PS5-style home/dashboard visual design using:
   - `controller-health-react-handoff/reference-styles/ps5-theme-reference.css`
   - `controller-health-react-handoff/assets/*`
3. Build these UI pieces:
   - Home dashboard shell
   - Proactive controller health toast
   - Controller health details card
   - Quick test modal/flow
   - Persona switcher
4. Add deterministic mock decision logic using:
   - `controller-health-react-handoff/reference-data/controllerHealthPersonas.js`
   - `controller-health-react-handoff/reference-data/controllerHealthDecisionEngine.js`
5. Use normalized response shape from:
   - `controller-health-react-handoff/RESPONSE_CONTRACT.md`
6. Implement recommendation paths:
   - free replacement review
   - discounted replacement review
   - repair/stick-module review
   - troubleshooting
   - no action
7. Keep all actions recommendation-only:
   - no real order/case/refund/replacement creation
   - copy must say pending review / may be eligible
8. Preserve mock/CSV fallback design:
   - app should work fully with local deterministic data
   - structure service layer so server API can be plugged in later
9. Keep future integration boundaries clear:
   - Salesforce/Agentforce/Data Cloud must be server-side only in future phases
   - frontend never directly authenticates to Salesforce
10. Add manual test instructions in project README:
   - test each persona and verify expected recommendation path
   - verify quick-test flow
   - verify dismiss/later behavior
   - verify no execution language appears

Implementation preferences:
- Use functional components and simple local state (or lightweight hooks).
- Keep code modular and readable.
- Create a small service layer (`services/controllerHealthService.js`) returning normalized contract.
- Include clear TODO comments where future server integration will connect.

Deliverables:
- Working React UI with PS5-like look and feel.
- Deterministic persona switching + recommendation rendering.
- Quick test modal flow.
- README with setup + test steps.
- No backend dependency required for initial run.

---

