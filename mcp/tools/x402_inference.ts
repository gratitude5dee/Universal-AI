import { Config, ToolContext, ToolDefinition } from "../types";
import { assertSchema } from "../utils/schema";

const inputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "x402_inference.input",
  type: "object",
  required: ["payment", "messages", "selectedModelId"],
  properties: {
    payment: { type: "string" },
    selectedModelId: { type: "string" },
    messages: { type: "array", items: { type: "object" } }
  },
  additionalProperties: false
} as const;

const outputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "x402_inference.output",
  type: "object",
  required: ["status", "contentType", "body"],
  properties: {
    status: { type: "integer" },
    contentType: { type: ["string", "null"] },
    body: { type: "string" }
  },
  additionalProperties: false
} as const;

type Input = {
  payment: string;
  selectedModelId: string;
  messages: Array<Record<string, unknown>>;
};

type Output = {
  status: number;
  contentType: string | null;
  body: string;
};

export function createX402InferenceTool(
  config: Config
): ToolDefinition<Input, Output> {
  return {
    name: "x402_inference",
    description: "Call the x402 paid inference endpoint",
    inputSchema,
    outputSchema,
    idempotent: false,
    async handler(context: ToolContext, rawInput: Input): Promise<Output> {
      assertSchema(inputSchema, rawInput, "x402_inference.input");
      if (!config.features.x402) {
        throw new Error("x402 tooling is disabled (MCP_FEATURE_X402=false)");
      }
      if (!config.x402.endpoint) {
        throw new Error("x402 endpoint is not configured");
      }

      if (config.mode === "mock") {
        return {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ mocked: true })
        };
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), config.x402.timeoutMs);
      try {
        const response = await context.fetch(config.x402.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-payment": rawInput.payment,
            "X-Correlation-Id": context.correlationId
          },
          body: JSON.stringify({
            messages: rawInput.messages,
            selectedModelId: rawInput.selectedModelId
          }),
          signal: controller.signal
        });

        const contentType = response.headers.get("content-type");
        const body = await response.text();

        return {
          status: response.status,
          contentType,
          body
        };
      } finally {
        clearTimeout(timeout);
      }
    }
  };
}
