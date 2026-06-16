#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const SCHEMA_PLACEHOLDERS = new Set([
  "<TEXT>",
  "<NUMBER>",
  "<BOOLEAN>",
  "<DATE>",
  "<DATE_ONLY>",
  "<CURRENCY>"
]);

const AREA_RULES = {
  "Player Entitlement": {
    keyPatterns: ["entitlement", "player_entitlement"],
    valuePatterns: ["free_replacement", "warranty", "ent-", "module_replacement"],
    required: true,
    fix: "Verify Player Entitlement DMO mapping and Individual -> Entitlement relationship."
  },
  "Controller Device": {
    keyPatterns: ["controller", "device", "external_controller_id", "controller_serial"],
    valuePatterns: ["dualsense", "zct", "ctrl-"],
    required: true,
    fix: "Verify PS5 Controller Device stream mapping and Individual -> Controller relationship."
  },
  "Controller Telemetry Event": {
    keyPatterns: ["telemetry", "drift", "disconnect", "right_stick", "left_stick"],
    valuePatterns: ["right_stick_drift", "disconnect_firmware", "issue_confidence"],
    required: true,
    fix: "Verify telemetry DMO mapping and Controller Device -> Telemetry relationship."
  },
  "Device Session Event": {
    keyPatterns: ["session", "session_minutes", "session_start", "session_end"],
    valuePatterns: ["sess-"],
    required: true,
    fix: "Verify session DMO mapping and Controller Device -> Session relationship."
  },
  "Gameplay Engagement": {
    keyPatterns: ["engagement", "play_hours", "favorite_genre", "engagement_band"],
    valuePatterns: ["high", "medium", "low"],
    required: true,
    fix: "Verify gameplay engagement stream mapping and Individual -> Engagement relationship."
  },
  "Notification History": {
    keyPatterns: ["notification", "campaign", "suppressed", "opened", "clicked"],
    valuePatterns: ["notif-", "recently_notified"],
    required: true,
    fix: "Verify notification stream mapping and Individual -> Notification relationship."
  },
  "Product Affinity": {
    keyPatterns: ["affinity", "product_code", "inferred_upgrade_interest", "product_category"],
    valuePatterns: ["ds-edge", "ds-standard", "ds-limited", "ds-edge-module"],
    required: true,
    fix: "Verify product affinity stream mapping and Individual -> Product Affinity relationship."
  },
  "Device Firmware Status": {
    keyPatterns: ["firmware", "update_available", "latest_firmware", "current_firmware"],
    valuePatterns: ["3.02", "2.98", "true", "false"],
    required: true,
    fix: "Verify firmware status stream mapping and Controller Device -> Firmware relationship."
  },
  Case: {
    keyPatterns: ["case", "external_case_id", "controller_serial_number"],
    valuePatterns: ["case-"],
    required: false,
    fix: "Optional: verify Case relationship key mapping from controller_serial."
  }
};

const SCHEMA_REQUIRED_ROOT_FIELDS = [
  "ssot__Id__c",
  "ssot__FirstName__c",
  "ssot__LastName__c",
  "ssot__PreferredName__c"
];

const SCHEMA_REQUIRED_OBJECTS = [
  "PS5_Controller_Device__dlm",
  "PS5_Controller_Telemetry_Event__dlm",
  "PS5_Device_Session_Event__dlm",
  "PS5_Gameplay_Engagement__dlm",
  "PS5_Notification_History__dlm",
  "PS5_Player_Product_Affinity__dlm",
  "PS5_Player_Entitlement__dlm",
  "PS5_Device_Firmware_Status__dlm"
];

const SCHEMA_OPTIONAL_OBJECTS = [
  "ssot__Case__dlm",
  "ssot__Product__dlm",
  "PS5_Pricebook_Entry__dlm"
];

const ROOT_PATTERNS = {
  id: ["player_id", "ssot__id__c", "individual id", "individual_id", "playerid", "id"],
  firstName: ["first_name", "firstname", "givenname", "given_name"],
  lastName: ["last_name", "lastname", "surname", "family_name"],
  preferredName: ["preferred_name", "display_name", "name", "fullname", "full_name"]
};

function usage() {
  console.error("Usage:");
  console.error(
    "  node scripts/data-cloud/validate-data-graph-preview.js <path-to-data-graph-preview.json>"
  );
}

function normalize(value) {
  return String(value ?? "").toLowerCase();
}

function keyMatches(key, patterns) {
  const k = normalize(key);
  return patterns.some((p) => k.includes(normalize(p)));
}

function valueMatches(value, patterns) {
  const v = normalize(value);
  return patterns.some((p) => v.includes(normalize(p)));
}

function walk(node, currentPath = "$", out = []) {
  if (Array.isArray(node)) {
    node.forEach((item, i) => walk(item, `${currentPath}[${i}]`, out));
    return out;
  }
  if (node && typeof node === "object") {
    Object.entries(node).forEach(([k, v]) => {
      const p = `${currentPath}.${k}`;
      out.push({ path: p, key: k, value: v });
      walk(v, p, out);
    });
  }
  return out;
}

function isSchemaPlaceholder(value) {
  if (typeof value !== "string") return false;
  return SCHEMA_PLACEHOLDERS.has(value.trim().toUpperCase());
}

function detectSchemaMode(entries) {
  let placeholderCount = 0;
  for (const entry of entries) {
    if (isSchemaPlaceholder(entry.value)) placeholderCount += 1;
  }
  return placeholderCount > 0;
}

function detectRoot(entries) {
  const found = {
    id: [],
    firstName: [],
    lastName: [],
    preferredName: []
  };

  for (const entry of entries) {
    if (keyMatches(entry.key, ROOT_PATTERNS.id)) {
      found.id.push(entry.path);
    }
    if (keyMatches(entry.key, ROOT_PATTERNS.firstName)) {
      found.firstName.push(entry.path);
    }
    if (keyMatches(entry.key, ROOT_PATTERNS.lastName)) {
      found.lastName.push(entry.path);
    }
    if (keyMatches(entry.key, ROOT_PATTERNS.preferredName)) {
      found.preferredName.push(entry.path);
    }
  }
  return found;
}

function hasExactKey(entries, keyName) {
  const target = normalize(keyName);
  return entries.filter((e) => normalize(e.key) === target).map((e) => e.path);
}

function evaluateArea(entries, rule) {
  const keyHits = [];
  const valueHits = [];

  for (const entry of entries) {
    if (keyMatches(entry.key, rule.keyPatterns)) {
      keyHits.push(entry.path);
    }

    const raw = entry.value;
    if (
      raw !== null &&
      raw !== undefined &&
      (typeof raw === "string" || typeof raw === "number" || typeof raw === "boolean")
    ) {
      if (valueMatches(raw, rule.valuePatterns)) {
        valueHits.push(`${entry.path}=${raw}`);
      }
    }
  }

  const matched = keyHits.length > 0 || valueHits.length > 0;
  return { matched, keyHits, valueHits };
}

function evaluateSchemaObject(entries, objectName) {
  const keyHits = [];
  const valueHits = [];
  const n = normalize(objectName);

  for (const entry of entries) {
    if (normalize(entry.key) === n || normalize(entry.key).includes(n)) {
      keyHits.push(entry.path);
    }
    if (typeof entry.value === "string" && normalize(entry.value).includes(n)) {
      valueHits.push(`${entry.path}=${entry.value}`);
    }
  }
  return { matched: keyHits.length > 0 || valueHits.length > 0, keyHits, valueHits };
}

function printAreaResult(areaName, result, required, fix) {
  const status = matchedStatus(result.matched, required);
  console.log(`- ${status} ${areaName}`);
  if (result.keyHits.length > 0) {
    console.log(`  key matches (${result.keyHits.length}):`);
    result.keyHits.slice(0, 6).forEach((m) => console.log(`    - ${m}`));
  }
  if (result.valueHits.length > 0) {
    console.log(`  value matches (${result.valueHits.length}):`);
    result.valueHits.slice(0, 6).forEach((m) => console.log(`    - ${m}`));
  }
  if (!result.matched) {
    console.log(`  recommended fix: ${fix}`);
  }
}

function matchedStatus(matched, required) {
  if (matched) return "PASS";
  return required ? "FAIL" : "WARN";
}

function deriveRootPlayerId(entries) {
  const candidates = entries.filter(
    (e) =>
      keyMatches(e.key, ROOT_PATTERNS.id) &&
      (typeof e.value === "string" || typeof e.value === "number")
  );
  for (const c of candidates) {
    const text = String(c.value);
    const m = text.match(/PLAYER\d{3,}/i);
    if (m) return m[0].toUpperCase();
  }
  return null;
}

function runSchemaValidation(entries, resolved) {
  console.log("PS5 Data Graph Preview Validation");
  console.log(`File: ${resolved}`);
  console.log("Mode: SCHEMA PREVIEW");
  console.log("");

  console.log("Root field checks:");
  const rootFailures = [];
  for (const field of SCHEMA_REQUIRED_ROOT_FIELDS) {
    const hits = hasExactKey(entries, field);
    const ok = hits.length > 0;
    console.log(`- ${ok ? "PASS" : "FAIL"} ${field}`);
    if (ok) {
      hits.slice(0, 3).forEach((h) => console.log(`    - ${h}`));
    } else {
      rootFailures.push(field);
      console.log("    - recommended fix: add this root field to Data Graph node selection.");
    }
  }

  console.log("");
  console.log("Required context object checks:");
  let requiredMatches = 0;
  for (const objectName of SCHEMA_REQUIRED_OBJECTS) {
    const result = evaluateSchemaObject(entries, objectName);
    const ok = result.matched;
    if (ok) requiredMatches += 1;
    printAreaResult(
      objectName,
      result,
      true,
      "Add object to Data Graph and verify relationship is available/published."
    );
  }

  console.log("");
  console.log("Optional context object checks:");
  for (const objectName of SCHEMA_OPTIONAL_OBJECTS) {
    const result = evaluateSchemaObject(entries, objectName);
    printAreaResult(
      objectName,
      result,
      false,
      "Optional object can be skipped unless required for your story."
    );
  }

  const pass = rootFailures.length === 0 && requiredMatches === SCHEMA_REQUIRED_OBJECTS.length;
  console.log("");
  console.log("Summary:");
  console.log(`- Required root fields present: ${SCHEMA_REQUIRED_ROOT_FIELDS.length - rootFailures.length}/${SCHEMA_REQUIRED_ROOT_FIELDS.length}`);
  console.log(`- Required context objects present: ${requiredMatches}/${SCHEMA_REQUIRED_OBJECTS.length}`);
  console.log(
    "- Note: Schema mode validates graph structure only, not actual player-specific values."
  );

  if (!pass) {
    console.error("Validation failed: schema structure is incomplete.");
    process.exit(1);
  }

  console.log("Validation passed.");
}

function runRecordValidation(entries, resolved) {
  const root = detectRoot(entries);
  const rootPlayerId = deriveRootPlayerId(entries);

  console.log("PS5 Data Graph Preview Validation");
  console.log(`File: ${resolved}`);
  console.log("Mode: RECORD PREVIEW");
  console.log("");
  console.log("Root field detection:");
  console.log(`- ${root.id.length ? "PASS" : "FAIL"} root id-like field(s): ${root.id.length}`);
  console.log(
    `- ${root.firstName.length ? "PASS" : "FAIL"} first-name-like field(s): ${root.firstName.length}`
  );
  console.log(
    `- ${root.lastName.length ? "PASS" : "FAIL"} last-name-like field(s): ${root.lastName.length}`
  );
  console.log(
    `- ${root.preferredName.length ? "PASS" : "FAIL"} preferred/display-name-like field(s): ${root.preferredName.length}`
  );
  console.log(`- INFO detected root player id: ${rootPlayerId ?? "not detected"}`);
  console.log("");

  let coreMatches = 0;

  console.log("Context area checks:");
  for (const [areaName, rule] of Object.entries(AREA_RULES)) {
    const result = evaluateArea(entries, rule);
    printAreaResult(areaName, result, rule.required, rule.fix);
    if (rule.required && result.matched) {
      coreMatches += 1;
    }
  }

  const rootMissing =
    root.id.length === 0 ||
    root.firstName.length === 0 ||
    root.lastName.length === 0 ||
    root.preferredName.length === 0;

  console.log("");
  console.log("Summary:");
  console.log(`- Core context areas matched: ${coreMatches}/7`);
  console.log(`- Root completeness: ${rootMissing ? "FAIL" : "PASS"}`);

  if (rootMissing) {
    console.error(
      "Validation failed: root Individual fields are incomplete. Verify root mapping and preview payload depth."
    );
    process.exit(1);
  }

  if (coreMatches < 4) {
    console.error(
      "Validation failed: fewer than 4 core context areas were detected. Verify relationships and graph nodes."
    );
    process.exit(1);
  }

  console.log("Validation passed.");
}

function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    usage();
    process.exit(2);
  }

  const resolved = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(resolved)) {
    console.error(`Error: file not found: ${resolved}`);
    usage();
    process.exit(2);
  }

  let json;
  try {
    json = JSON.parse(fs.readFileSync(resolved, "utf8"));
  } catch (error) {
    console.error(`Error: invalid JSON in ${resolved}`);
    console.error(error.message);
    process.exit(2);
  }

  const entries = walk(json);
  const schemaMode = detectSchemaMode(entries);
  if (schemaMode) {
    runSchemaValidation(entries, resolved);
  } else {
    runRecordValidation(entries, resolved);
  }
}

main();
