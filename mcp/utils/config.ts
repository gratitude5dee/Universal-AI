import { Config } from "../types";

function parseJsonEnv<T>(name: string, fallback: T): T {
  const value = process.env[name];
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn(`Failed to parse ${name}: ${(error as Error).message}`);
    return fallback;
  }
}

function parseNumberEnv(name: string, fallback: number): number {
  const value = process.env[name];
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseBooleanEnv(name: string, fallback: boolean): boolean {
  const value = process.env[name];
  if (!value) return fallback;
  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes", "y", "on"].includes(normalized)) return true;
  if (["false", "0", "no", "n", "off"].includes(normalized)) return false;
  return fallback;
}

function parseStringListEnv(name: string, fallback: string[]): string[] {
  const value = process.env[name];
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map((entry) => String(entry).trim()).filter(Boolean);
    }
  } catch {
    // fall through to csv parsing
  }
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function loadConfig(): Config {
  const mode = (process.env.MCP_MODE ?? "mock").toLowerCase() === "live" ? "live" : "mock";

  const allowlistedSql = parseJsonEnv<Record<string, string>>("MCP_ALLOWLISTED_SQL", {
    list_creator_assets: "select * from creator_assets where creator_id = :creator_id limit :limit",
    treasury_balances: "select symbol, balance from treasury_balances where creator_id = :creator_id",
    content_dashboard_summary: "select * from content_dashboard_overview_v1 where creator_id = :creator_id",
    marketing_dashboard_summary: "select * from marketing_dashboard_overview_v1 where creator_id = :creator_id",
    finance_dashboard_summary: "select * from finance_dashboard_overview_v1 where creator_id = :creator_id",
    bridge_dashboard_summary: "select * from bridge_dashboard_overview_v1 where creator_id = :creator_id",
    agents_dashboard_summary: "select * from agents_dashboard_overview_v1 where creator_id = :creator_id"
  });

  const allowlistedRpcs = parseJsonEnv<Config["allowlistedRpcs"]>("MCP_ALLOWLISTED_RPCS", {
    "create-wallet": { type: "edge", name: "create-wallet" },
    "transfer-sol": { type: "edge", name: "transfer-sol" },
    log_agent_activity: { type: "postgres", name: "log_agent_activity" },
    "content-ingest": { type: "edge", name: "content-ingest" },
    "story-register-asset": { type: "edge", name: "story-register-asset" },
    "story-sync-lineage": { type: "edge", name: "story-sync-lineage" },
    "agreement-create": { type: "edge", name: "agreement-create" },
    "license-mint": { type: "edge", name: "license-mint" },
    "license-revoke": { type: "edge", name: "license-revoke" },
    "rights-transfer": { type: "edge", name: "rights-transfer" },
    "bridge-execute": { type: "edge", name: "bridge-execute" },
    "marketplace-publish": { type: "edge", name: "marketplace-publish" },
    "campaign-dispatch": { type: "edge", name: "campaign-dispatch" },
    "campaign-webhook": { type: "edge", name: "campaign-webhook" },
    "invoice-pdf": { type: "edge", name: "invoice-pdf" },
    "invoice-reminder": { type: "edge", name: "invoice-reminder" },
    "royalty-ingest": { type: "edge", name: "royalty-ingest" },
    "forecast-refresh": { type: "edge", name: "forecast-refresh" },
    "report-export": { type: "edge", name: "report-export" },
    "agent-runner": { type: "edge", name: "agent-runner" },
    "agent-marketplace-install": { type: "edge", name: "agent-marketplace-install" },
    "integration-oauth-start": { type: "edge", name: "integration-oauth-start" },
    "integration-oauth-callback": { type: "edge", name: "integration-oauth-callback" },
    "ens-profile-sync": { type: "edge", name: "ens-profile-sync" },
    "botchan-message-dispatch": { type: "edge", name: "botchan-message-dispatch" },
    "hydrex-sync": { type: "edge", name: "hydrex-sync" },
    search_content_library: { type: "postgres", name: "search_content_library" },
    get_rights_rollup: { type: "postgres", name: "get_rights_rollup" },
    get_campaign_rollup: { type: "postgres", name: "get_campaign_rollup" },
    get_touring_stats_v2: { type: "postgres", name: "get_touring_stats_v2" },
    detect_royalty_discrepancies: { type: "postgres", name: "detect_royalty_discrepancies" },
    preview_split_sheet_allocations: { type: "postgres", name: "preview_split_sheet_allocations" },
    request_treasury_transfer: { type: "postgres", name: "request_treasury_transfer" },
    approve_treasury_transfer_request: { type: "postgres", name: "approve_treasury_transfer_request" },
    get_agent_install_run_summary: { type: "postgres", name: "get_agent_install_run_summary" },
    get_platform_overview: { type: "postgres", name: "get_platform_overview" }
  });

  const storageBuckets = parseJsonEnv<string[]>("MCP_STORAGE_BUCKETS", [
    "agent-artifacts",
    "wzrd-renders",
    "analytics-exports"
  ]);

  const config: Config = {
    mode,
    port: parseNumberEnv("MCP_PORT", 8974),
    bearerToken: process.env.MCP_BEARER_TOKEN ?? "dev-secret",
    supabase: {
      url: process.env.MCP_SUPABASE_URL,
      anonKey: process.env.MCP_SUPABASE_ANON_KEY,
      serviceRoleKey: process.env.MCP_SUPABASE_SERVICE_ROLE_KEY,
      functionJwt: process.env.MCP_SUPABASE_FUNCTION_JWT,
      schema: process.env.MCP_SUPABASE_SCHEMA ?? "public"
    },
    allowlistedSql,
    sqlRunnerRpc: process.env.MCP_SQL_RUNNER_RPC ?? "run_allowlisted_sql",
    sqlDefaultLimit: parseNumberEnv("MCP_SQL_DEFAULT_LIMIT", 50),
    allowlistedRpcs,
    storageBuckets,
    storageDefaultExpirySeconds: parseNumberEnv("MCP_STORAGE_DEFAULT_EXPIRY", 300),
    crossmint: {
      apiKey: process.env.MCP_CROSSMINT_API_KEY,
      projectId: process.env.MCP_CROSSMINT_PROJECT_ID,
      baseUrl: process.env.MCP_CROSSMINT_BASE_URL ?? "https://staging.crossmint.com",
      dryRun: mode === "mock" || process.env.MCP_CROSSMINT_DRY_RUN === "true"
    },
    wallet: {
      maxSol: Number.parseFloat(process.env.MCP_WALLET_MAX_SOL ?? "10"),
      confirmationSecret: process.env.MCP_WALLET_CONFIRMATION_SECRET,
      confirmationTtlSeconds: parseNumberEnv("MCP_WALLET_CONFIRMATION_TTL", 600),
      transferFunctionName: process.env.MCP_WALLET_TRANSFER_FUNCTION ?? "transfer-sol",
      defaultMemoPrefix: process.env.MCP_WALLET_MEMO_PREFIX ?? "UNIVAI"
    },
    kb: {
      matchRpc: process.env.MCP_KB_MATCH_RPC ?? "match_kb_chunks",
      listRpc: process.env.MCP_KB_LIST_RPC ?? "list_kb_items",
      getRpc: process.env.MCP_KB_GET_RPC ?? "get_kb_item",
      table: process.env.MCP_KB_TABLE ?? "agent_memory_chunks",
      embeddingModel: process.env.MCP_KB_EMBEDDING_MODEL ?? "text-embedding-3-small",
      embeddingEndpoint: process.env.MCP_EMBEDDING_ENDPOINT,
      embeddingApiKey: process.env.MCP_EMBEDDING_API_KEY,
      defaultTopK: parseNumberEnv("MCP_KB_DEFAULT_TOPK", 5),
      defaultThreshold: Number.parseFloat(process.env.MCP_KB_DEFAULT_THRESHOLD ?? "0.25")
    },
    webSearch: {
      provider: (process.env.MCP_WEB_SEARCH_PROVIDER as "tavily" | "custom" | undefined) ?? "tavily",
      endpoint: process.env.MCP_WEB_SEARCH_ENDPOINT,
      apiKey: process.env.MCP_WEB_SEARCH_API_KEY,
      safe: process.env.MCP_WEB_SEARCH_SAFE !== "false",
      maxResultsDefault: parseNumberEnv("MCP_WEB_SEARCH_MAX_RESULTS", 5)
    },
    features: {
      web3: parseBooleanEnv("MCP_FEATURE_WEB3", false),
      defi: parseBooleanEnv("MCP_FEATURE_DEFI", false),
      rwa: parseBooleanEnv("MCP_FEATURE_RWA", false),
      x402: parseBooleanEnv("MCP_FEATURE_X402", false)
    },
    engine: {
      baseUrl: process.env.MCP_ENGINE_BASE_URL,
      apiKey: process.env.MCP_ENGINE_API_KEY,
      timeoutMs: parseNumberEnv("MCP_ENGINE_TIMEOUT_MS", 12_000),
      chainAllowlist: parseStringListEnv("MCP_ENGINE_CHAIN_ALLOWLIST", [])
    },
    rwa: {
      requireCompliance: parseBooleanEnv("MCP_RWA_REQUIRE_COMPLIANCE", false),
      complianceRpc: process.env.MCP_RWA_COMPLIANCE_RPC ?? "rwa_get_compliance_status",
      auditRpc: process.env.MCP_RWA_AUDIT_RPC ?? "rwa_audit_append"
    },
    x402: {
      endpoint: process.env.MCP_X402_ENDPOINT,
      timeoutMs: parseNumberEnv("MCP_X402_TIMEOUT_MS", 20_000)
    },
    idempotency: {
      rpcName: process.env.MCP_IDEMPOTENCY_RPC ?? "ensure_idempotency_key",
      ttlSeconds: parseNumberEnv("MCP_IDEMPOTENCY_TTL", 86_400)
    }
  };

  return config;
}
