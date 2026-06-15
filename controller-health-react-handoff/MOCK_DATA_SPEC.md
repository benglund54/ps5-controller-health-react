# Mock Data Spec

Use deterministic mock personas so UI behavior and recommendation paths are repeatable.

## Personas and expected outcomes

### PLAYER001
- In warranty: true
- Issue: severe right-stick drift
- Engagement: high
- Expected recommendation: **free replacement review**

### PLAYER002
- In warranty: false
- Issue: severe stick drift
- Value: Gold/high LTV
- Expected recommendation: **40% discounted replacement review**

### PLAYER003
- In warranty: mixed/unknown
- Issue: medium disconnects + outdated firmware
- Expected recommendation: **troubleshooting first**

### PLAYER004
- Device type: DualSense Edge
- Issue: severe stick drift
- Expected recommendation: **stick module / repair review**

### PLAYER005
- In warranty: false
- Issue: battery wear only, high cycle count
- Expected recommendation: **20% discounted replacement review**

### PLAYER006
- Issue: minor telemetry noise only
- Expected recommendation: **no action**

## Required fields per mock record

- `ownerId`
- `serial`
- `controllerModel`
- `inWarranty`
- `warrantyEndDate`
- `telemetrySeverity`
- `engagementScore`
- `riskScore`
- `issueType`
- `issueConfidence`
- `batteryWearOnly`
- `firmwareVersion`
- `firmwareLatest`
- `recommendedOffer`
- `discountPercent`
- `requiresHumanReview`
- `reviewLevel`
- `customerFacingLabel`
- `customerFacingMessage`

## Deterministic decision rule guidance

- Prefer explicit `recommendedOffer` per persona for demos.
- Allow computed fallback rule when persona override is absent.
- Always return `requiresHumanReview: true` for non-`NO_ACTION` recommendations.

