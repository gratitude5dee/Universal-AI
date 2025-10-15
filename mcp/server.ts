import http from "node:http";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import {
  ToolContext,
  ToolDefinition,
  PromptDefinition,
  ResourceDefinition,
  Config,
  SupabaseClientLike
} from "./types";
import { loadConfig } from "./utils/config";
import { createLogger } from "./utils/logger";
import { assertSchema } from "./utils/schema";
import { createSupabaseQuerySqlTool } from "./tools/supabase_query_sql";
import { createSupabaseCallRpcTool } from "./tools/supabase_call_rpc";
import { createStorageGetTool } from "./tools/storage_get";
import { createStoragePutTool } from "./tools/storage_put";
import { createWalletCreateTool } from "./tools/wallet_create";
import { createWalletTransferTool } from "./tools/wallet_transfer";
import { createKbSearchTool } from "./tools/kb_search";
import { createWebSearchTool } from "./tools/web_search";
import { createKnowledgeResource } from "./resources/kb";
import { answerWithContextPrompt } from "./prompts/answer_with_context";
import { summarizeAndCitePrompt } from "./prompts/summarize_and_cite";
import { mintTransactionPlanPrompt } from "./prompts/mint_transaction_plan";

interface InvokeRequest {
  tool: string;
  input: unknown;
}

interface PromptRequest {
  prompt: string;
  params: unknown;
}

const config: Config = loadConfig();

const supabaseClient: SupabaseClientLike | null =
  config.supabase.url && (config.supabase.serviceRoleKey || config.supabase.anonKey)
    ? createClient(config.supabase.url, config.supabase.serviceRoleKey ?? config.supabase.anonKey!, {
        auth: { persistSession: false },
        global: {
          headers: {
            apikey: config.supabase.serviceRoleKey ?? config.supabase.anonKey ?? ""
          }
        }
      })
    : null;

const fallbackSupabase: SupabaseClientLike = {
  async rpc() {
    return { data: null, error: { message: "Supabase not configured" } };
  },
  functions: {
    async invoke() {
      return { data: null, error: { message: "Supabase not configured" } };
    }
  },
  storage: {
    from() {
      return {
        async createSignedUrl() {
          return { data: null, error: { message: "Supabase not configured" } };
        },
        async upload() {
          return { data: null, error: { message: "Supabase not configured" } };
        }
      };
    }
  }
};

const tools: ToolDefinition[] = [
  createSupabaseQuerySqlTool(config),
  createSupabaseCallRpcTool(config),
  createStorageGetTool(config),
  createStoragePutTool(config),
  createWalletCreateTool(config),
  createWalletTransferTool(config),
  createKbSearchTool(config),
  createWebSearchTool(config)
];

const toolMap = new Map(tools.map((tool) => [tool.name, tool]));

const resources: ResourceDefinition[] = [createKnowledgeResource(config)];
const resourceMap = new Map(resources.map((resource) => [resource.uri, resource]));

const prompts: PromptDefinition[] = [
  answerWithContextPrompt,
  summarizeAndCitePrompt,
  mintTransactionPlanPrompt
];
const promptMap = new Map(prompts.map((prompt) => [prompt.name, prompt]));

function createToolContext(correlationId: string): ToolContext {
  const logger = createLogger(correlationId);
  return {
    config,
    supabase: supabaseClient ?? fallbackSupabase,
    fetch: globalThis.fetch.bind(globalThis),
    logger,
    correlationId,
    now: () => new Date()
  };
}

async function readJson<T>(req: http.IncomingMessage): Promise<T> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf-8");
  if (!raw) return {} as T;
  return JSON.parse(raw) as T;
}

function sendJson(res: http.ServerResponse, status: number, payload: unknown) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function authenticate(req: http.IncomingMessage): boolean {
  if (req.url === "/health") return true;
  const auth = req.headers.authorization;
  if (!auth) return false;
  const [scheme, token] = auth.split(" ");
  if (scheme !== "Bearer") return false;
  return token === config.bearerToken;
}

const server = http.createServer(async (req, res) => {
  try {
    if (!authenticate(req)) {
      sendJson(res, 401, { error: "Unauthorized" });
      return;
    }

    if (req.method === "GET" && req.url === "/health") {
      sendJson(res, 200, { status: "ok", mode: config.mode });
      return;
    }

    const correlationId =
      (req.headers["x-correlation-id"] as string) ?? randomUUID();
    const context = createToolContext(correlationId);

    if (req.method === "POST" && req.url === "/invoke") {
      const body = await readJson<InvokeRequest>(req);
      const tool = toolMap.get(body.tool);
      if (!tool) {
        sendJson(res, 404, { error: `Unknown tool ${body.tool}` });
        return;
      }
      context.logger.info("Tool invocation", { tool: tool.name });
      const result = await tool.handler(context, body.input as never);
      sendJson(res, 200, { ok: true, result });
      return;
    }

    if (req.method === "GET" && req.url?.startsWith("/resources")) {
      const url = new URL(req.url, "http://localhost");
      const uri = url.searchParams.get("uri");
      const id = url.searchParams.get("id");
      if (!uri) {
        sendJson(res, 200, { resources: Array.from(resourceMap.keys()) });
        return;
      }
      const resource = Array.from(resourceMap.entries()).find(([key]) =>
        uri.startsWith(key.replace("*", ""))
      );
      if (!resource) {
        sendJson(res, 404, { error: `Unknown resource uri ${uri}` });
        return;
      }
      if (!id) {
        const list = await resource[1].list(
          context,
          Object.fromEntries(url.searchParams)
        );
        sendJson(res, 200, list);
        return;
      }
      const data = await resource[1].get(context, id);
      sendJson(res, 200, data);
      return;
    }

    if (req.method === "GET" && req.url === "/prompts") {
      sendJson(res, 200, { prompts: Array.from(promptMap.keys()) });
      return;
    }

    if (req.method === "POST" && req.url === "/prompt") {
      const body = await readJson<PromptRequest>(req);
      const prompt = promptMap.get(body.prompt);
      if (!prompt) {
        sendJson(res, 404, { error: `Unknown prompt ${body.prompt}` });
        return;
      }
      assertSchema(prompt.parametersSchema, body.params, `${prompt.name}.params`);
      const rendered = await prompt.render(body.params as never);
      sendJson(res, 200, { prompt: prompt.name, rendered });
      return;
    }

    sendJson(res, 404, { error: "Not Found" });
  } catch (error) {
    console.error("Unhandled MCP error", error);
    sendJson(res, 500, { error: (error as Error).message ?? "Internal error" });
  }
});

if (process.env.MCP_DISABLE_LISTEN !== "true") {
  server.listen(config.port, () => {
    console.info(`UniversalAI MCP server listening on :${config.port}`);
  });
}

export { server };
