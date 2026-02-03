import { Config, ToolContext } from "../types";

type EngineRequestParams = {
  method: "GET" | "POST";
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  body?: unknown;
};

function normalizeAllowlist(list: string[]): string[] {
  return list.map((entry) => entry.trim().toLowerCase()).filter(Boolean);
}

export function assertEvmChainAllowed(config: Config, chain: string) {
  const allowlist = normalizeAllowlist(config.engine.chainAllowlist);
  if (allowlist.length === 0) {
    throw new Error("No EVM chains are allowlisted (MCP_ENGINE_CHAIN_ALLOWLIST)");
  }
  const normalized = chain.trim().toLowerCase();
  if (!allowlist.includes(normalized)) {
    throw new Error(`Chain ${chain} is not allowlisted`);
  }
}

export function ensureEngineEnabled(config: Config) {
  if (!config.features.web3) {
    throw new Error("EVM tooling is disabled (MCP_FEATURE_WEB3=false)");
  }
  if (!config.engine.baseUrl) {
    throw new Error("Engine base URL is not configured");
  }
  if (!config.engine.apiKey) {
    throw new Error("Engine API key is not configured");
  }
}

export async function requestEngine<T>(
  context: ToolContext,
  params: EngineRequestParams
): Promise<T> {
  ensureEngineEnabled(context.config);
  const url = new URL(params.path, context.config.engine.baseUrl);
  if (params.query) {
    for (const [key, value] of Object.entries(params.query)) {
      if (value === undefined) continue;
      url.searchParams.set(key, String(value));
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), context.config.engine.timeoutMs);
  try {
    const response = await context.fetch(url.toString(), {
      method: params.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${context.config.engine.apiKey}`,
        "X-Correlation-Id": context.correlationId,
        ...(params.headers ?? {})
      },
      body: params.body ? JSON.stringify(params.body) : undefined,
      signal: controller.signal
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Engine request failed (${response.status}): ${errorText}`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}
