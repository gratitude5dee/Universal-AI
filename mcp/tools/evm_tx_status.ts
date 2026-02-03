import { Config, ToolContext, ToolDefinition } from "../types";
import { assertSchema } from "../utils/schema";
import { requestEngine } from "../utils/engine";

const inputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "evm_tx_status.input",
  type: "object",
  required: ["queueId"],
  properties: {
    queueId: { type: "string" }
  },
  additionalProperties: false
} as const;

const outputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "evm_tx_status.output",
  type: "object",
  required: ["queueId", "status", "transaction"],
  properties: {
    queueId: { type: "string" },
    status: { type: ["string", "null"] },
    transaction: { type: "object" }
  },
  additionalProperties: false
} as const;

type Input = {
  queueId: string;
};

type Output = {
  queueId: string;
  status: string | null;
  transaction: Record<string, unknown>;
};

export function createEvmTxStatusTool(
  config: Config
): ToolDefinition<Input, Output> {
  return {
    name: "evm_tx_status",
    description: "Fetch EVM transaction status via Engine",
    inputSchema,
    outputSchema,
    idempotent: true,
    async handler(context: ToolContext, rawInput: Input): Promise<Output> {
      assertSchema(inputSchema, rawInput, "evm_tx_status.input");
      if (!config.features.web3) {
        throw new Error("EVM tooling is disabled (MCP_FEATURE_WEB3=false)");
      }

      if (config.mode === "mock") {
        return {
          queueId: rawInput.queueId,
          status: "mocked",
          transaction: { queueId: rawInput.queueId, status: "mocked" }
        };
      }

      const data = await requestEngine<{ result?: Record<string, unknown> }>(context, {
        method: "GET",
        path: `/transaction/status/${encodeURIComponent(rawInput.queueId)}`
      });

      const result = data?.result ?? {};
      const status = typeof result.status === "string" ? result.status : null;

      return {
        queueId: rawInput.queueId,
        status,
        transaction: result
      };
    }
  };
}
