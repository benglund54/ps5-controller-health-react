import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const targetAlias = process.env.SF_ORG_ALIAS || "ps5-controller-demo";

async function runSf(args) {
  const { stdout } = await execFileAsync("sf", args, { maxBuffer: 1024 * 1024 });
  return JSON.parse(stdout);
}

function fail(message, details) {
  console.error(`ERROR: ${message}`);
  if (details) {
    console.error(details);
  }
  process.exit(1);
}

async function main() {
  try {
    const orgInfo = await runSf(["org", "display", "--target-org", targetAlias, "--json"]);
    if (orgInfo.status !== 0 || !orgInfo.result) {
      fail(`Unable to read org details for alias "${targetAlias}".`);
    }

    const queryInfo = await runSf([
      "data",
      "query",
      "--target-org",
      targetAlias,
      "--json",
      "--query",
      "SELECT Id, Name FROM Organization LIMIT 1"
    ]);

    if (queryInfo.status !== 0 || !queryInfo.result) {
      fail(`Read-only query failed for alias "${targetAlias}".`);
    }

    const orgRow = queryInfo.result.records?.[0] ?? {};
    const summary = {
      alias: targetAlias,
      username: orgInfo.result.username || "unknown",
      instanceUrl: orgInfo.result.instanceUrl || "unknown",
      orgId: orgInfo.result.id || "unknown",
      connectedStatus: "Connected",
      readOnlyQuery: {
        object: "Organization",
        rowCount: queryInfo.result.totalSize ?? 0,
        organizationName: orgRow.Name || "unknown"
      }
    };

    console.log(JSON.stringify(summary, null, 2));
  } catch (error) {
    fail(
      `Connectivity check failed for alias "${targetAlias}". Ensure CLI auth exists and alias is correct.`,
      error instanceof Error ? error.message : String(error)
    );
  }
}

main();
