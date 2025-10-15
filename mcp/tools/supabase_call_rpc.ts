import { Config, ToolContext, ToolDefinition } from "../types";
import { assertSchema } from "../utils/schema";

const inputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "supabase_call_rpc.input",
  type: "object",
  required: ["functionId", "payload"],
  properties: {
    functionId: { type: "string" },
    payload: { type: "object", additionalProperties: true },
    idempotencyKey: { type: "string", minLength: 16 }
  },
  additionalProperties: false
} as const;

const outputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "supabase_call_rpc.output",
  type: "object",
  required: ["functionId", "result"],
  properties: {
    functionId: { type: "string" },
    result: { type: ["object", "array", "string", "number", "boolean", "null"] }
  },
  additionalProperties: false
} as const;

type Input = {
  functionId: string;
  payload: Record<string, unknown>;
  idempotencyKey?: string;
};

type Output = {
  functionId: string;
  result: unknown;
};

export function createSupabaseCallRpcTool(
  config: Config
): ToolDefinition<Input, Output> {
  return {
    name: "supabase_call_rpc",
    description: "Invoke allowlisted Supabase RPC or Edge Function with optional idempotency",
    inputSchema,
    outputSchema,
    idempotent: false,
    async handler(context: ToolContext, rawInput: Input): Promise<Output> {
      assertSchema(inputSchema, rawInput, "supabase_call_rpc.input");
      const entry = config.allowlistedRpcs[rawInput.functionId];
      if (!entry) {
        throw new Error(`Function ${rawInput.functionId} is not allowlisted`);
      }

      if (config.mode === "mock") {
        context.logger.debug("Mocking supabase_call_rpc", { functionId: rawInput.functionId });
        return { functionId: rawInput.functionId, result: { mocked: true } };
      }

      if (entry.type === "edge") {
        const headers: Record<string, string> = {
          "X-Correlation-Id": context.correlationId
        };
        if (config.supabase.functionJwt) {
          headers.Authorization = `Bearer ${config.supabase.functionJwt}`;
        } else if (config.supabase.serviceRoleKey) {
          headers.apikey = config.supabase.serviceRoleKey;
        } else if (config.supabase.anonKey) {
          headers.apikey = config.supabase.anonKey;
        }
        if (rawInput.idempotencyKey) {
          headers["Idempotency-Key"] = rawInput.idempotencyKey;
        }
        const { data, error } = await context.supabase.functions.invoke(entry.name, {
          body: rawInput.payload,
          headers
        });
        if (error) {
          context.logger.error(error.message, { functionId: rawInput.functionId });
          throw new Error(`Supabase function ${entry.name} failed: ${error.message}`);
        }
        return { functionId: rawInput.functionId, result: data };
      }

      const { data, error } = await context.supabase.rpc(entry.name, rawInput.payload);
      if (error) {
        context.logger.error(error.message, { functionId: rawInput.functionId });
        throw new Error(`Supabase RPC ${entry.name} failed: ${error.message}`);
      }

      return { functionId: rawInput.functionId, result: data };
    }
  };
}
