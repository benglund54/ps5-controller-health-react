import crypto from "node:crypto";

export function buildCanonicalResponse(playerId, mockContext) {
  const generatedAt = new Date().toISOString();

  return {
    playerId,
    sessionId: crypto.randomUUID(),
    generatedAt,
    player: {
      displayName: mockContext.player.displayName,
      psnAccount: mockContext.player.psnAccount,
      loyaltyTier: mockContext.player.loyaltyTier,
      psPlusTier: mockContext.player.psPlusTier,
      mailingCity: mockContext.player.mailingCity,
      mailingState: mockContext.player.mailingState
    },
    device: {
      controllerModel: mockContext.device.controllerModel,
      serialNumber: mockContext.device.serialNumber,
      warrantyStatus: mockContext.device.warrantyStatus,
      firmwareVersion: mockContext.device.firmwareVersion,
      firmwareLatest: mockContext.device.firmwareLatest,
      firmwareUpdateAvailable: mockContext.device.firmwareUpdateAvailable
    },
    healthSignal: {
      primaryIssue: mockContext.healthSignal.primaryIssue,
      issueConfidence: mockContext.healthSignal.issueConfidence,
      rightStickDriftScore: mockContext.healthSignal.rightStickDriftScore,
      leftStickDriftScore: mockContext.healthSignal.leftStickDriftScore,
      disconnectFrequencyScore: mockContext.healthSignal.disconnectFrequencyScore,
      batteryHealthPercent: mockContext.healthSignal.batteryHealthPercent,
      sessionHoursL30d: mockContext.healthSignal.sessionHoursL30d
    },
    recommendation: {
      type: mockContext.recommendation.type,
      statusChip: mockContext.recommendation.statusChip,
      toast: mockContext.recommendation.toast,
      customerFacingExplanation: mockContext.recommendation.customerFacingExplanation,
      requiresPayment: mockContext.recommendation.requiresPayment,
      requiresShipping: mockContext.recommendation.requiresShipping,
      shippingAddress: mockContext.player.shippingAddress ?? null,
      estimatedDeliveryDays: mockContext.recommendation.estimatedDeliveryDays,
      eligibleOptions: mockContext.recommendation.eligibleOptions,
      confirmationCopy: mockContext.recommendation.confirmationCopy
    },
    meta: {
      source: "MOCK",
      agentforceSessionId: null,
      fallbackUsed: false,
      previewOnly: true,
      generatedAt
    }
  };
}

