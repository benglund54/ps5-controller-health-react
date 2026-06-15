import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const EXPECTED_TYPES = {
  PLAYER001: "INCLUDED_REPLACEMENT",
  PLAYER002: "PERSONALIZED_UPGRADE",
  PLAYER003: "FIRMWARE_TROUBLESHOOTING",
  PLAYER004: "STICK_MODULE_PATH"
};

const FORBIDDEN_KEY_FRAGMENTS = [
  "orderid",
  "claimid",
  "shipmenttracking",
  "trackingnumber",
  "refund",
  "credit",
  "coupon",
  "fulfillment",
  "writeback"
];

function getModeConfig(mode) {
  if (mode === "salesforce") {
    return { dataSource: "salesforce", sfAlias: "ps5-controller-demo", port: 4022 };
  }
  if (mode === "fallback") {
    return { dataSource: "salesforce", sfAlias: "invalid-demo-alias", port: 4023 };
  }
  return { dataSource: "mock", sfAlias: "ps5-controller-demo", port: 4021 };
}

function findForbiddenKeys(value, path = "", hits = []) {
  if (!value || typeof value !== "object") {
    return hits;
  }
  for (const [key, nested] of Object.entries(value)) {
    const lower = key.toLowerCase();
    if (FORBIDDEN_KEY_FRAGMENTS.some((fragment) => lower.includes(fragment))) {
      hits.push(path ? `${path}.${key}` : key);
    }
    findForbiddenKeys(nested, path ? `${path}.${key}` : key, hits);
  }
  return hits;
}

async function waitForServer(port) {
  const healthUrl = `http://localhost:${port}/health`;
  for (let i = 0; i < 60; i += 1) {
    try {
      const res = await fetch(healthUrl);
      if (res.ok) return;
    } catch {
      // Ignore and retry while server starts.
    }
    await sleep(200);
  }
  throw new Error(`Server did not become healthy on port ${port}.`);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function run() {
  const mode = (process.argv[2] ?? "mock").toLowerCase();
  const { dataSource, sfAlias, port } = getModeConfig(mode);

  const child = spawn("node", ["server/index.js"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      MIDDLEWARE_PORT: String(port),
      MIDDLEWARE_DATA_SOURCE: dataSource,
      MIDDLEWARE_SF_ALIAS: sfAlias
    },
    stdio: ["ignore", "pipe", "pipe"]
  });

  child.stdout.on("data", (chunk) => {
    process.stdout.write(String(chunk));
  });
  child.stderr.on("data", (chunk) => {
    process.stderr.write(String(chunk));
  });

  try {
    await waitForServer(port);
    for (const [playerId, expectedType] of Object.entries(EXPECTED_TYPES)) {
      const res = await fetch(
        `http://localhost:${port}/api/controller-health/recommendation`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ playerId })
        }
      );
      assert(res.ok, `${mode}:${playerId} returned HTTP ${res.status}`);
      const payload = await res.json();

      assert(
        payload?.recommendation?.type === expectedType,
        `${mode}:${playerId} expected ${expectedType}, got ${payload?.recommendation?.type}`
      );
      assert(
        payload?.meta?.previewOnly === true,
        `${mode}:${playerId} expected meta.previewOnly=true`
      );

      const forbiddenHits = findForbiddenKeys(payload);
      assert(
        forbiddenHits.length === 0,
        `${mode}:${playerId} found forbidden fields: ${forbiddenHits.join(", ")}`
      );

      if (mode === "fallback") {
        assert(
          payload?.meta?.fallbackUsed === true,
          `${mode}:${playerId} expected meta.fallbackUsed=true`
        );
        assert(
          payload?.meta?.source === "PARTIAL_FALLBACK",
          `${mode}:${playerId} expected meta.source=PARTIAL_FALLBACK, got ${payload?.meta?.source}`
        );
      }
    }

    console.log(`smoke-middleware:${mode} passed`);
  } finally {
    child.kill("SIGTERM");
    await sleep(200);
    if (!child.killed) {
      child.kill("SIGKILL");
    }
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
