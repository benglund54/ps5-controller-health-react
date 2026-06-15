import express from "express";
import { getMockPlayerById } from "../services/mockFallbackService.js";
import { buildCanonicalResponse } from "../services/contractNormalizer.js";
import { getCrmPlayerContext } from "../services/crmReadService.js";
import { env } from "../config/env.js";

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

async function resolvePlayerContext(playerId, mockPlayer) {
  if (env.dataSource !== "salesforce") {
    return { context: mockPlayer, source: "MOCK", fallbackUsed: false };
  }

  try {
    const crmContext = await getCrmPlayerContext({
      playerId,
      mockContext: mockPlayer,
      targetOrg: env.sfAlias
    });
    return { context: crmContext, source: "SALESFORCE", fallbackUsed: false };
  } catch {
    return { context: mockPlayer, source: "PARTIAL_FALLBACK", fallbackUsed: true };
  }
}

router.get("/players/:playerId", async (req, res) => {
  const lookup = getPlayerOr404(req, res);
  if (!lookup) return;
  const resolved = await resolvePlayerContext(lookup.playerId, lookup.player);

  res.json({
    playerId: lookup.playerId,
    source: resolved.source,
    previewOnly: true,
    player: resolved.context.player,
    device: resolved.context.device
  });
});

router.get("/players/:playerId/controller-health", async (req, res) => {
  const lookup = getPlayerOr404(req, res);
  if (!lookup) return;
  const resolved = await resolvePlayerContext(lookup.playerId, lookup.player);

  res.json({
    playerId: lookup.playerId,
    source: resolved.source,
    previewOnly: true,
    device: resolved.context.device,
    healthSignal: resolved.context.healthSignal,
    recommendationType: resolved.context.recommendation.type
  });
});

router.post("/controller-health/recommendation", async (req, res) => {
  const lookup = getPlayerOr404(req, res);
  if (!lookup) return;
  const resolved = await resolvePlayerContext(lookup.playerId, lookup.player);

  res.json(
    buildCanonicalResponse(lookup.playerId, resolved.context, {
      source: resolved.source,
      fallbackUsed: resolved.fallbackUsed
    })
  );
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

