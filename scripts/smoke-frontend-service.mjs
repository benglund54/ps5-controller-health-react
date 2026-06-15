import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const EXPECTED_TYPES = {
  PLAYER001: "INCLUDED_REPLACEMENT",
  PLAYER002: "PERSONALIZED_UPGRADE",
  PLAYER003: "FIRMWARE_TROUBLESHOOTING",
  PLAYER004: "STICK_MODULE_PATH"
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForServer(port) {
  const healthUrl = `http://localhost:${port}/health`;
  for (let i = 0; i < 60; i += 1) {
    try {
      const response = await fetch(healthUrl);
      if (response.ok) return;
    } catch {
      // retry
    }
    await sleep(200);
  }
  throw new Error(`Server did not become healthy on port ${port}`);
}

async function importServiceFresh() {
  const bust = `${Date.now()}-${Math.random()}`;
  return import(`../src/services/controllerHealthService.js?bust=${bust}`);
}

async function assertPersonaMatrix(modeLabel) {
  const service = await importServiceFresh();

  for (const [playerId, expectedType] of Object.entries(EXPECTED_TYPES)) {
    const profile = await service.getPlayerProfile(playerId);
    assert(profile && profile.ownerId === playerId, `${modeLabel}:${playerId} missing profile`);

    const recommendation = await service.getControllerRecommendation(playerId);
    assert(
      recommendation?.recommendationType === expectedType,
      `${modeLabel}:${playerId} expected ${expectedType}, got ${recommendation?.recommendationType}`
    );
  }
}

async function runMockMode() {
  process.env.VITE_CONTROLLER_HEALTH_SOURCE = "mock";
  process.env.VITE_CONTROLLER_HEALTH_API_BASE = "http://localhost:4998";
  await assertPersonaMatrix("frontend-mock");
  console.log("smoke-frontend:mock passed");
}

async function runMiddlewareMode() {
  const port = 4121;
  const child = spawn("node", ["server/index.js"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      MIDDLEWARE_PORT: String(port),
      MIDDLEWARE_DATA_SOURCE: "mock",
      MIDDLEWARE_SF_ALIAS: "ps5-controller-demo"
    },
    stdio: ["ignore", "pipe", "pipe"]
  });

  child.stdout.on("data", (chunk) => process.stdout.write(String(chunk)));
  child.stderr.on("data", (chunk) => process.stderr.write(String(chunk)));

  try {
    await waitForServer(port);
    process.env.VITE_CONTROLLER_HEALTH_SOURCE = "middleware";
    process.env.VITE_CONTROLLER_HEALTH_API_BASE = `http://localhost:${port}`;
    await assertPersonaMatrix("frontend-middleware");
    console.log("smoke-frontend:middleware passed");
  } finally {
    child.kill("SIGTERM");
    await sleep(200);
    if (!child.killed) child.kill("SIGKILL");
  }
}

async function runFallbackMode() {
  process.env.VITE_CONTROLLER_HEALTH_SOURCE = "middleware";
  process.env.VITE_CONTROLLER_HEALTH_API_BASE = "http://localhost:4999";
  await assertPersonaMatrix("frontend-fallback");
  console.log("smoke-frontend:fallback passed");
}

async function run() {
  const mode = (process.argv[2] ?? "mock").toLowerCase();
  if (mode === "middleware") {
    await runMiddlewareMode();
    return;
  }
  if (mode === "fallback") {
    await runFallbackMode();
    return;
  }
  await runMockMode();
}

run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
