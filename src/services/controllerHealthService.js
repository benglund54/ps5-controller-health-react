/**
 * controllerHealthService.js
 *
 * Frontend service layer for PS5 Controller Health demo.
 * - Default source: local mock data
 * - Optional source: local middleware API (`/api/*`)
 * - Never authenticates to Salesforce directly from React
 */

import { playerPersonas } from "../data/playerPersonas.js";
import { controllerHealthJourneys } from "../data/controllerHealthJourneys.js";

// ── Simulated network latency (ms) ──────────────────────────────────────────
const MOCK_DELAY_MS = 180;
const API_TIMEOUT_MS = 2500;
const PLAYER_ID_PATTERN = /^PLAYER00[1-4]$/i;

function delay(ms = MOCK_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getEnv() {
  const viteEnv = import.meta?.env ?? {};
  const processEnv = globalThis.process?.env ?? {};
  return {
    source: String(
      viteEnv.VITE_CONTROLLER_HEALTH_SOURCE ??
        processEnv.VITE_CONTROLLER_HEALTH_SOURCE ??
        "mock"
    )
      .toLowerCase()
      .trim(),
    apiBase:
      viteEnv.VITE_CONTROLLER_HEALTH_API_BASE ??
      processEnv.VITE_CONTROLLER_HEALTH_API_BASE ??
      "http://localhost:4010"
  };
}

export function isMiddlewareSourceEnabled() {
  return getEnv().source === "middleware";
}

function sanitizePlayerId(playerId) {
  return String(playerId ?? "").trim().toUpperCase();
}

function getBasePersona(playerId) {
  return (
    playerPersonas.find((p) => p.ownerId.toUpperCase() === playerId.toUpperCase()) ?? null
  );
}

function mapProfileToPersona(playerId, profileResponse) {
  const base = getBasePersona(playerId);
  if (!base || !profileResponse?.player || !profileResponse?.device) {
    return base;
  }
  const player = profileResponse.player;
  const device = profileResponse.device;
  return {
    ...base,
    ownerId: playerId,
    displayName: player.displayName ?? base.displayName,
    psnAccount: player.psnAccount ?? base.psnAccount,
    loyaltyTier: player.loyaltyTier ?? base.loyaltyTier,
    psPlusTier: player.psPlusTier ?? base.psPlusTier,
    controllerModel: device.controllerModel ?? base.controllerModel,
    serial: device.serialNumber ?? base.serial
  };
}

async function fetchWithTimeout(path, options = {}) {
  const { apiBase } = getEnv();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    const response = await fetch(`${apiBase}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        ...(options.headers ?? {})
      }
    });
    if (!response.ok) {
      throw new Error(`Middleware request failed: ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

// ── Telemetry mock data ──────────────────────────────────────────────────────
const mockTelemetry = {
  PLAYER001: {
    rightStickDriftScore: 0.91,
    leftStickDriftScore: 0.12,
    disconnectFrequencyScore: 0.08,
    firmwareVersion: "3.02",
    firmwareLatest: "3.02",
    batteryHealthPercent: 88,
    sessionHoursLast30Days: 64,
    issueConfidence: "HIGH",
    warrantyStatus: "IN_WARRANTY"
  },
  PLAYER002: {
    rightStickDriftScore: 0.87,
    leftStickDriftScore: 0.14,
    disconnectFrequencyScore: 0.06,
    firmwareVersion: "3.02",
    firmwareLatest: "3.02",
    batteryHealthPercent: 72,
    sessionHoursLast30Days: 98,
    issueConfidence: "HIGH",
    warrantyStatus: "OUT_OF_WARRANTY"
  },
  PLAYER003: {
    rightStickDriftScore: 0.18,
    leftStickDriftScore: 0.11,
    disconnectFrequencyScore: 0.76,
    firmwareVersion: "2.98",
    firmwareLatest: "3.02",
    batteryHealthPercent: 91,
    sessionHoursLast30Days: 31,
    issueConfidence: "MEDIUM",
    warrantyStatus: "IN_WARRANTY"
  },
  PLAYER004: {
    rightStickDriftScore: 0.62,
    leftStickDriftScore: 0.09,
    disconnectFrequencyScore: 0.11,
    firmwareVersion: "3.02",
    firmwareLatest: "3.02",
    batteryHealthPercent: 80,
    sessionHoursLast30Days: 47,
    issueConfidence: "MEDIUM",
    warrantyStatus: "OUT_OF_WARRANTY"
  }
};

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch player profile from mock data.
 * @param {string} playerId  e.g. "PLAYER001"
 * @returns {Promise<object|null>}
 */
export async function getPlayerProfile(playerId) {
  const normalizedId = sanitizePlayerId(playerId);
  if (isMiddlewareSourceEnabled()) {
    try {
      const payload = await fetchWithTimeout(`/api/players/${normalizedId}`);
      const persona = mapProfileToPersona(normalizedId, payload);
      if (persona) return persona;
    } catch {
      // fallback to local mock below
    }
  }

  await delay();
  const profile = getBasePersona(normalizedId);
  if (!profile) return null;
  return { ...profile };
}

/**
 * Fetch simulated controller telemetry for a player.
 * In a real integration this would call Data Cloud or a telemetry API.
 * @param {string} playerId
 * @returns {Promise<object>}
 */
export async function getControllerTelemetry(playerId) {
  const normalizedId = sanitizePlayerId(playerId);
  if (isMiddlewareSourceEnabled()) {
    try {
      const payload = await fetchWithTimeout(
        `/api/players/${normalizedId}/controller-health`
      );
      if (payload?.healthSignal && payload?.device) {
        return {
          rightStickDriftScore: payload.healthSignal.rightStickDriftScore ?? 0,
          leftStickDriftScore: payload.healthSignal.leftStickDriftScore ?? 0,
          disconnectFrequencyScore: payload.healthSignal.disconnectFrequencyScore ?? 0,
          firmwareVersion: payload.device.firmwareVersion ?? "unknown",
          firmwareLatest: payload.device.firmwareLatest ?? "unknown",
          batteryHealthPercent: payload.healthSignal.batteryHealthPercent ?? 0,
          sessionHoursLast30Days: payload.healthSignal.sessionHoursL30d ?? 0,
          issueConfidence: payload.healthSignal.issueConfidence ?? "UNKNOWN",
          warrantyStatus: payload.device.warrantyStatus ?? "UNKNOWN"
        };
      }
    } catch {
      // fallback to local mock below
    }
  }

  await delay();
  const telemetry = mockTelemetry[normalizedId];
  if (!telemetry) {
    return {
      rightStickDriftScore: 0,
      disconnectFrequencyScore: 0,
      firmwareVersion: "unknown",
      firmwareLatest: "unknown",
      issueConfidence: "UNKNOWN",
      warrantyStatus: "UNKNOWN"
    };
  }
  return { ...telemetry };
}

/**
 * Fetch the controller health recommendation for a player.
 * In a real integration this would call Agentforce or a recommendation API.
 * @param {string} playerId
 * @returns {Promise<{journey: object, recommendationType: string}>}
 */
export async function getControllerRecommendation(playerId) {
  const normalizedId = sanitizePlayerId(playerId);
  if (isMiddlewareSourceEnabled()) {
    try {
      const payload = await fetchWithTimeout("/api/controller-health/recommendation", {
        method: "POST",
        body: JSON.stringify({ playerId: normalizedId })
      });
      const fallbackJourney =
        controllerHealthJourneys[normalizedId] ?? controllerHealthJourneys.PLAYER003;
      if (payload?.recommendation?.type) {
        return {
          recommendationType: payload.recommendation.type,
          journey: fallbackJourney,
          meta: payload.meta ?? null
        };
      }
    } catch {
      // fallback to local mock below
    }
  }

  await delay();
  const journey =
    controllerHealthJourneys[normalizedId] ??
    controllerHealthJourneys.PLAYER003;
  return {
    recommendationType: journey.recommendationType,
    journey
  };
}

/**
 * Submit the player's selected resolution option.
 * In a real integration this would call a Salesforce Apex action or Flow.
 * For now this is a no-op that logs to console and resolves.
 *
 * @param {string} playerId
 * @param {string} selectedOption  e.g. "dualsense" | "edge" | "limited"
 * @param {object} [meta]          Optional metadata (payment method, etc.)
 * @returns {Promise<{status: "demo_only", message: string}>}
 */
export async function submitDemoResolution(playerId, selectedOption, meta = {}) {
  const normalizedId = sanitizePlayerId(playerId);
  if (isMiddlewareSourceEnabled()) {
    try {
      const payload = await fetchWithTimeout("/api/controller-health/resolve-preview", {
        method: "POST",
        body: JSON.stringify({
          playerId: normalizedId,
          selectedOption,
          meta
        })
      });
      if (payload?.previewOnly === true) {
        return {
          status: "demo_only",
          message: payload.message ?? "Demo resolution recorded. No real action was taken."
        };
      }
    } catch {
      // fallback to local mock below
    }
  }

  await delay(280);
  console.info("[controllerHealthService] submitDemoResolution — preview mode", {
    playerId: normalizedId,
    selectedOption,
    meta,
    note: "No real order, payment, or case was created."
  });
  return {
    status: "demo_only",
    message: "Demo resolution recorded. No real action was taken."
  };
}

/**
 * Validate a player lookup query (Player ID, PSN handle, or display name).
 * Used by the Add User / manual Player ID lookup flow.
 * @param {string} query
 * @returns {Promise<object|null>}  Returns the matching persona or null.
 */
export async function lookupPlayer(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;
  if (isMiddlewareSourceEnabled() && PLAYER_ID_PATTERN.test(normalized)) {
    const profile = await getPlayerProfile(normalized.toUpperCase());
    if (profile) return profile;
  }
  await delay(120);
  return (
    playerPersonas.find(
      (p) =>
        p.ownerId.toLowerCase() === normalized ||
        p.psnAccount.toLowerCase() === normalized ||
        p.displayName.toLowerCase() === normalized
    ) ?? null
  );
}
