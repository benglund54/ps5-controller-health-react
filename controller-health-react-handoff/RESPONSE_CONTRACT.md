# Response Contract

Use this normalized frontend contract as the single rendering source for the new React app.

```json
{
  "source": "controller-health-demo",
  "decisionTime": "2026-06-11T19:12:45Z",
  "ownerId": "PLAYER001",
  "serial": "ZCT1W-0A1B2C3D",
  "decision": {
    "inWarranty": true,
    "telemetrySeverity": 92,
    "engagementScore": 87,
    "riskScore": 82,
    "issueType": "stick_drift",
    "issueConfidence": 0.94,
    "batteryWearOnly": false,
    "recommendedOffer": "FREE_REPLACEMENT",
    "discountPercent": null,
    "requiresHumanReview": true,
    "reviewLevel": "tier2",
    "customerFacingLabel": "free replacement review",
    "customerFacingMessage": "You may be eligible for a free replacement controller, pending support review."
  },
  "ui": {
    "title": "Controller health check",
    "subtitle": "Your right stick may not be centering correctly.",
    "actions": [
      { "id": "view_details", "label": "View details" },
      { "id": "run_quick_test", "label": "Run quick test" },
      { "id": "request_review", "label": "Request review" },
      { "id": "dismiss", "label": "Later" }
    ]
  }
}
```

## Notes

- `recommendedOffer` enum values:
  - `FREE_REPLACEMENT`
  - `DISCOUNT_REPLACEMENT`
  - `REPAIR_REVIEW`
  - `TROUBLESHOOTING`
  - `NO_ACTION`
- Non-`NO_ACTION` paths should generally remain review-only (`requiresHumanReview: true`).

# Response Contract

Use this normalized frontend contract as the single rendering source for the new React app.

```json
{
  "source": "controller-health-demo",
  "decisionTime": "2026-06-11T19:12:45Z",
  "ownerId": "PLAYER001",
  "serial": "ZCT1W-0A1B2C3D",
  "decision": {
    "inWarranty": true,
    "telemetrySeverity": 92,
    "engagementScore": 87,
    "riskScore": 82,
    "issueType": "stick_drift",
    "issueConfidence": 0.94,
    "batteryWearOnly": false,
    "recommendedOffer": "FREE_REPLACEMENT",
    "discountPercent": null,
    "requiresHumanReview": true,
    "reviewLevel": "tier2",
    "customerFacingLabel": "free replacement review",
    "customerFacingMessage": "You may be eligible for a free replacement controller, pending support review."
  },
  "ui": {
    "title": "Controller health check",
    "subtitle": "Your right stick may not be centering correctly.",
    "actions": [
      { "id": "view_details", "label": "View details" },
      { "id": "run_quick_test", "label": "Run quick test" },
      { "id": "request_review", "label": "Request review" },
      { "id": "dismiss", "label": "Later" }
    ]
  }
}
```

## Notes

- `recommendedOffer` should be enum-like:
  - `FREE_REPLACEMENT`
  - `DISCOUNT_REPLACEMENT`
  - `REPAIR_REVIEW`
  - `TROUBLESHOOTING`
  - `NO_ACTION`
- For `NO_ACTION`, keep `requiresHumanReview` false if desired.
- Do not expose backend/internal policy details directly unless needed for explainability UI.

