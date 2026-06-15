import express from "express";
import { getMockPlayerById } from "../services/mockFallbackService.js";
import { buildCanonicalResponse } from "../services/contractNormalizer.js";

const router = express.Router();

function getPlayerOr404(req, res) {
  const playerId = req.params.playerId ?? req.body?.playerId;
  const player = getMockPlayerById(playerId);
  if (!player) {
    res.status(404).json({
      error: "PLAYER_NOT_FOUND",
      message: "Player was not found in mock fallback provider.",
      previewOnly: true
    });
    return null;
  }
  return { playerId: playerId.toUpperCase(), player };
}

router.get("/players/:playerId", (req, res) => {
  const lookup = getPlayerOr404(req, res);
  if (!lookup) return;

  res.json({
    playerId: lookup.playerId,
    source: "MOCK",
    previewOnly: true,
    player: lookup.player.player,
    device: lookup.player.device
  });
});

router.get("/players/:playerId/controller-health", (req, res) => {
  const lookup = getPlayerOr404(req, res);
  if (!lookup) return;

  res.json({
    playerId: lookup.playerId,
    source: "MOCK",
    previewOnly: true,
    device: lookup.player.device,
    healthSignal: lookup.player.healthSignal,
    recommendationType: lookup.player.recommendation.type
  });
});

router.post("/controller-health/recommendation", (req, res) => {
  const lookup = getPlayerOr404(req, res);
  if (!lookup) return;

  res.json(buildCanonicalResponse(lookup.playerId, lookup.player));
});

router.post("/controller-health/resolve-preview", (req, res) => {
  const { playerId, selectedOption } = req.body ?? {};
  const player = getMockPlayerById(playerId);
  if (!player) {
    return res.status(404).json({
      error: "PLAYER_NOT_FOUND",
      message: "Player was not found in mock fallback provider.",
      previewOnly: true
    });
  }

  return res.json({
    status: "preview_success",
    previewOnly: true,
    playerId: playerId.toUpperCase(),
    recommendationType: player.recommendation.type,
    selectedOption: selectedOption ?? null,
    message:
      "Preview resolution recorded in middleware only. No Salesforce/Data Cloud/Agentforce call was made and no operational record was created."
  });
});

export { router as apiRoutes };

