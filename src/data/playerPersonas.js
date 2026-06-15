import heroSofia from "../../assets/hero-sofia.png";
import heroIsabella from "../../assets/hero-isabella.png";
import heroChloe from "../../assets/hero-chloe.png";
import heroPronto from "../../assets/pronto-hero-new.png";

export const playerPersonas = [
  {
    ownerId: "PLAYER001",
    displayName: "Sarah Jeffries",
    psnAccount: "sarahj_plays",
    loyaltyTier: "Gold",
    psPlusTier: "Premium",
    controllerModel: "DualSense Wireless Controller",
    serial: "ZCT1W-0A1B2C3D",
    scenarioText: "Right-stick drift detected",
    statusText: "In warranty · severe drift · high engagement",
    recommendationPath: "Included replacement",
    customerFacingMessage:
      "Eligible options are ready based on your controller status.",
    issueTitle: "Your right stick may not be centering correctly.",
    accent: "sarah",
    avatarImage: heroSofia,
    avatarPosition: "50% 28%"
  },
  {
    ownerId: "PLAYER002",
    displayName: "Marcus Chen",
    psnAccount: "marcus_chen84",
    loyaltyTier: "Platinum",
    psPlusTier: "Premium",
    controllerModel: "DualSense Wireless Controller",
    serial: "ZCT1W-4E5F6G7H",
    scenarioText: "Out-of-warranty drift",
    statusText: "Out of warranty · severe drift · high engagement",
    recommendationPath: "Personalized upgrade options",
    customerFacingMessage:
      "Based on your controller status and PlayStation activity, these upgrade options are available.",
    issueTitle: "Your controller may be showing severe drift outside the warranty period.",
    accent: "marcus",
    avatarImage: heroIsabella,
    avatarPosition: "50% 24%"
  },
  {
    ownerId: "PLAYER003",
    displayName: "Nina Patel",
    psnAccount: "nina_streams",
    loyaltyTier: "Silver",
    psPlusTier: "Extra",
    controllerModel: "DualSense Wireless Controller",
    serial: "ZCT1W-8I9J0K1L",
    scenarioText: "Disconnects + firmware update",
    statusText: "Medium disconnects · firmware outdated",
    recommendationPath: "Troubleshooting first",
    customerFacingMessage: "Let's try a firmware update first.",
    issueTitle: "Your controller has recent disconnects and may need a firmware update.",
    accent: "nina",
    avatarImage: heroChloe,
    avatarPosition: "50% 35%"
  },
  {
    ownerId: "PLAYER004",
    displayName: "Alex Rivera",
    psnAccount: "alex_edge",
    loyaltyTier: "Gold",
    psPlusTier: "Extra",
    controllerModel: "DualSense Edge",
    serial: "ZCT2E-2M3N4O5P",
    scenarioText: "Stick module attention needed",
    statusText: "DualSense Edge · stick module · mid engagement",
    recommendationPath: "Stick module path",
    customerFacingMessage:
      "Your right stick module may need attention. Options are available.",
    issueTitle: "Your right stick module may need attention.",
    accent: "sarah",
    avatarImage: heroPronto,
    avatarPosition: "50% 22%"
  }
];
