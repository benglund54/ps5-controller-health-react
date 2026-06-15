export const env = {
  port: Number(
    globalThis.process?.env?.MIDDLEWARE_PORT ?? globalThis.process?.env?.PORT ?? 4010
  ),
  nodeEnv: globalThis.process?.env?.NODE_ENV ?? "development",
  sourceMode: globalThis.process?.env?.MIDDLEWARE_SOURCE_MODE ?? "MOCK_ONLY",
  dataSource: (globalThis.process?.env?.MIDDLEWARE_DATA_SOURCE ?? "mock")
    .toLowerCase()
    .trim(),
  sfAlias: globalThis.process?.env?.MIDDLEWARE_SF_ALIAS ?? "ps5-controller-demo",
  enableCrmReads: globalThis.process?.env?.MIDDLEWARE_ENABLE_CRM_READS === "true",
  enableDataCloudReads:
    globalThis.process?.env?.MIDDLEWARE_ENABLE_DATACLOUD_READS === "true",
  enableAgentforce:
    globalThis.process?.env?.MIDDLEWARE_ENABLE_AGENTFORCE === "true"
};

