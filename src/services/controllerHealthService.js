/**
 * controllerHealthService.js
 *
 * Frontend mock service layer for the PS5 Controller Health demo.
 *
 * All functions return Promises so they can be swapped for real
 * Salesforce / Data Cloud / Agentforce API calls in a later phase
 * without changing call sites.
 *
 * NO backend calls are made here. All data is read from local mock files.
 * Replace the import and the data lookups inside each function when
 * integrating with a real backend.
 *
 * Integration readiness:
 *   - Replace mock data lookups with fetch() / axios / Apex REST calls
 *   - Add auth headers (e.g. Connected App OAuth token) at that point
 *   - Keep the same function signatures so React components need no changes
 */

import { playerPersonas } from "../data/playerPersonas";
import { controllerHealthJourneys } from "../data/controllerHealthJourneys";

// ── Simulated network latency (ms) ──────────────────────────────────────────
const MOCK_DELAY_MS = 180;

function delay(ms = MOCK_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
  await delay();
  const profile = playerPersonas.find(
    (p) => p.ownerId.toUpperCase() === playerId.toUpperCase()
  );
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
  await delay();
  const telemetry = mockTelemetry[playerId.toUpperCase()];
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
  await delay();
  const journey =
    controllerHealthJourneys[playerId.toUpperCase()] ??
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
  await delay(280);
  console.info("[controllerHealthService] submitDemoResolution — preview mode", {
    playerId,
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
  await delay(120);
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;
  return (
    playerPersonas.find(
      (p) =>
        p.ownerId.toLowerCase() === normalized ||
        p.psnAccount.toLowerCase() === normalized ||
        p.displayName.toLowerCase() === normalized
    ) ?? null
  );
}
