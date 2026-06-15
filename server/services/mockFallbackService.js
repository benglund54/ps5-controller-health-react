const baseOptions = {
  dualsense: {
    id: "dualsense",
    productCode: "DS-STANDARD",
    title: "DualSense Wireless Controller",
    description: "Standard wireless controller",
    basePrice: 69.99
  },
  edge: {
    id: "edge",
    productCode: "DS-EDGE",
    title: "DualSense Edge Wireless Controller",
    description: "Premium controller with replaceable modules",
    basePrice: 169.99
  },
  limited: {
    id: "limited",
    productCode: "DS-LIMITED",
    title: "Limited Edition Controller",
    description: "Personalized style option",
    basePrice: 139.99
  },
  module: {
    id: "module",
    productCode: "DS-EDGE-MODULE",
    title: "DualSense Edge Stick Module",
    description: "Replacement stick module",
    basePrice: 59.99
  }
};

const mockPlayers = {
  PLAYER001: {
    player: {
      displayName: "Sarah Jeffries",
      psnAccount: "sarahj_plays",
      loyaltyTier: "Gold",
      psPlusTier: "Premium",
      mailingCity: "San Mateo",
      mailingState: "CA",
      shippingAddress: {
        name: "Sarah Jeffries",
        line1: "1234 PlayStation Way",
        city: "San Mateo",
        state: "CA",
        zip: "94402",
        country: "US"
      }
    },
    device: {
      controllerModel: "DualSense Wireless Controller",
      serialNumber: "ZCT1W-0A1B2C3D",
      warrantyStatus: "IN_WARRANTY",
      firmwareVersion: "3.02",
      firmwareLatest: "3.02",
      firmwareUpdateAvailable: false
    },
    healthSignal: {
      primaryIssue: "RIGHT_STICK_DRIFT",
      issueConfidence: "HIGH",
      rightStickDriftScore: 0.91,
      leftStickDriftScore: 0.12,
      disconnectFrequencyScore: 0.08,
      batteryHealthPercent: 88,
      sessionHoursL30d: 64
    },
    recommendation: {
      type: "INCLUDED_REPLACEMENT",
      statusChip: "SELF-SERVICE",
      toast: {
        title: "Controller health check",
        message: "Your right stick may not be centering correctly."
      },
      customerFacingExplanation:
        "Eligible options are ready based on your controller status.",
      requiresPayment: false,
      requiresShipping: true,
      estimatedDeliveryDays: "2-3 business days",
      eligibleOptions: [
        {
          ...baseOptions.dualsense,
          chip: "Recommended",
          finalPrice: 0,
          priceNote: "Included replacement",
          isDefault: true
        },
        {
          ...baseOptions.edge,
          chip: "Premium upgrade",
          finalPrice: 100,
          priceNote: "Upgrade price"
        },
        {
          ...baseOptions.limited,
          chip: "Limited edition",
          finalPrice: 70,
          priceNote: "Upgrade price"
        }
      ],
      confirmationCopy: {
        title: "Replacement confirmed",
        body: "Your replacement details are ready.",
        previewOnly: true
      }
    }
  },
  PLAYER002: {
    player: {
      displayName: "Marcus Chen",
      psnAccount: "marcus_chen84",
      loyaltyTier: "Platinum",
      psPlusTier: "Premium",
      mailingCity: "San Francisco",
      mailingState: "CA",
      shippingAddress: {
        name: "Marcus Chen",
        line1: "5678 Console Avenue",
        city: "San Francisco",
        state: "CA",
        zip: "94102",
        country: "US"
      }
    },
    device: {
      controllerModel: "DualSense Wireless Controller",
      serialNumber: "ZCT1W-4E5F6G7H",
      warrantyStatus: "OUT_OF_WARRANTY",
      firmwareVersion: "3.02",
      firmwareLatest: "3.02",
      firmwareUpdateAvailable: false
    },
    healthSignal: {
      primaryIssue: "RIGHT_STICK_DRIFT",
      issueConfidence: "HIGH",
      rightStickDriftScore: 0.87,
      leftStickDriftScore: 0.14,
      disconnectFrequencyScore: 0.06,
      batteryHealthPercent: 72,
      sessionHoursL30d: 98
    },
    recommendation: {
      type: "PERSONALIZED_UPGRADE",
      statusChip: "PERSONALIZED",
      toast: {
        title: "Controller health check",
        message: "Your controller may be showing signs of stick drift."
      },
      customerFacingExplanation:
        "Based on your controller status and PlayStation activity, personalized options are available.",
      requiresPayment: true,
      requiresShipping: true,
      estimatedDeliveryDays: "2-3 business days",
      eligibleOptions: [
        {
          ...baseOptions.edge,
          chip: "Recommended",
          finalPrice: 129.99,
          priceNote: "Promotional price",
          isDefault: true
        },
        {
          ...baseOptions.dualsense,
          chip: "Discount option",
          finalPrice: 49.99,
          priceNote: "Promotional price"
        },
        {
          ...baseOptions.limited,
          chip: "Limited edition",
          finalPrice: 109.99,
          priceNote: "Promotional price"
        }
      ],
      confirmationCopy: {
        title: "Checkout confirmed",
        body: "Your controller selection is saved for preview.",
        previewOnly: true
      }
    }
  },
  PLAYER003: {
    player: {
      displayName: "Nina Patel",
      psnAccount: "nina_streams",
      loyaltyTier: "Silver",
      psPlusTier: "Extra",
      mailingCity: "San Jose",
      mailingState: "CA"
    },
    device: {
      controllerModel: "DualSense Wireless Controller",
      serialNumber: "ZCT1W-8I9J0K1L",
      warrantyStatus: "IN_WARRANTY",
      firmwareVersion: "2.98",
      firmwareLatest: "3.02",
      firmwareUpdateAvailable: true
    },
    healthSignal: {
      primaryIssue: "DISCONNECT_FIRMWARE",
      issueConfidence: "MEDIUM",
      rightStickDriftScore: 0.18,
      leftStickDriftScore: 0.11,
      disconnectFrequencyScore: 0.76,
      batteryHealthPercent: 91,
      sessionHoursL30d: 31
    },
    recommendation: {
      type: "FIRMWARE_TROUBLESHOOTING",
      statusChip: "TROUBLESHOOTING",
      toast: {
        title: "Controller health check",
        message: "Your controller has disconnected more than expected."
      },
      customerFacingExplanation:
        "A firmware update is recommended first before replacement options.",
      requiresPayment: false,
      requiresShipping: false,
      estimatedDeliveryDays: null,
      eligibleOptions: [],
      confirmationCopy: {
        title: "Update guidance ready",
        body: "Firmware troubleshooting steps are ready.",
        previewOnly: true
      }
    }
  },
  PLAYER004: {
    player: {
      displayName: "Alex Rivera",
      psnAccount: "alex_edge",
      loyaltyTier: "Gold",
      psPlusTier: "Extra",
      mailingCity: "Palo Alto",
      mailingState: "CA"
    },
    device: {
      controllerModel: "DualSense Edge Wireless Controller",
      serialNumber: "ZCT2E-2M3N4O5P",
      warrantyStatus: "OUT_OF_WARRANTY",
      firmwareVersion: "3.02",
      firmwareLatest: "3.02",
      firmwareUpdateAvailable: false
    },
    healthSignal: {
      primaryIssue: "RIGHT_STICK_MODULE",
      issueConfidence: "MEDIUM",
      rightStickDriftScore: 0.62,
      leftStickDriftScore: 0.09,
      disconnectFrequencyScore: 0.11,
      batteryHealthPercent: 80,
      sessionHoursL30d: 47
    },
    recommendation: {
      type: "STICK_MODULE_PATH",
      statusChip: "MODULE PATH",
      toast: {
        title: "Controller health check",
        message: "Your right stick module may need attention."
      },
      customerFacingExplanation:
        "A stick module replacement path is available for your controller model.",
      requiresPayment: true,
      requiresShipping: false,
      estimatedDeliveryDays: null,
      eligibleOptions: [
        {
          ...baseOptions.module,
          chip: "Recommended",
          finalPrice: 59.99,
          priceNote: "Module replacement",
          isDefault: true
        }
      ],
      confirmationCopy: {
        title: "Module path confirmed",
        body: "Your module replacement path is saved for preview.",
        previewOnly: true
      }
    }
  }
};

export function getPlayerIds() {
  return Object.keys(mockPlayers);
}

export function getMockPlayerById(playerId) {
  if (!playerId) return null;
  return mockPlayers[playerId.toUpperCase()] ?? null;
}

