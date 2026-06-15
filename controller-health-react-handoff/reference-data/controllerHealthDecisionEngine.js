import { controllerHealthPersonas } from "./controllerHealthPersonas";

function toDecisionRecord(persona) {
  const requiresHumanReview = persona.recommendedOffer !== "NO_ACTION";
  return {
    source: "controller-health-demo",
    decisionTime: new Date().toISOString(),
    ownerId: persona.ownerId,
    serial: persona.serial,
    decision: {
      inWarranty: persona.inWarranty,
      telemetrySeverity: persona.telemetrySeverity,
      engagementScore: persona.engagementScore,
      riskScore: persona.riskScore,
      issueType: persona.issueType,
      issueConfidence: persona.issueConfidence,
      batteryWearOnly: persona.batteryWearOnly,
      recommendedOffer: persona.recommendedOffer,
      discountPercent: persona.discountPercent,
      requiresHumanReview,
      reviewLevel: requiresHumanReview ? "tier2" : "none",
      customerFacingLabel: persona.customerFacingLabel,
      customerFacingMessage: persona.customerFacingMessage
    },
    ui: {
      title: "Controller health check",
      subtitle: buildSubtitle(persona),
      actions: [
        { id: "view_details", label: "View details" },
        { id: "run_quick_test", label: "Run quick test" },
        { id: "request_review", label: "Request review" },
        { id: "dismiss", label: "Later" }
      ]
    }
  };
}

function buildSubtitle(persona) {
  switch (persona.issueType) {
    case "stick_drift":
      return "Your right stick may not be centering correctly.";
    case "disconnects_firmware":
      return "We detected disconnect patterns and firmware mismatch.";
    case "edge_stick_drift":
      return "Your DualSense Edge stick module may need review.";
    case "battery_degradation":
      return "Battery health appears degraded based on charge cycles.";
    default:
      return "No significant controller issue detected.";
  }
}

export function getControllerHealthDecision(ownerId) {
  const persona =
    controllerHealthPersonas.find((p) => p.ownerId === ownerId) ||
    controllerHealthPersonas[0];
  return toDecisionRecord(persona);
}

