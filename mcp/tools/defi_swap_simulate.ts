import { Config, ToolContext, ToolDefinition } from "../types";
import { assertSchema } from "../utils/schema";
import { assertEvmChainAllowed, requestEngine } from "../utils/engine";

const inputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "defi_swap_simulate.input",
  type: "object",
  required: ["chain", "walletAddress", "toAddress", "data"],
  properties: {
    chain: { type: "string" },
    walletAddress: { type: "string" },
    toAddress: { type: "string" },
    data: { type: "string" },
    value: { type: "string" },
    accountAddress: { type: "string" },
    accountFactoryAddress: { type: "string" },
    accountSalt: { type: "string" },
    transactionMode: { type: "string" }
  },
  additionalProperties: false
} as const;

const outputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "defi_swap_simulate.output",
  type: "object",
  required: ["success"],
  properties: {
    success: { type: "boolean" }
  },
  additionalProperties: false
} as const;

type Input = {
  chain: string;
  walletAddress: string;
  toAddress: string;
  data: string;
  value?: string;
  accountAddress?: string;
  accountFactoryAddress?: string;
  accountSalt?: string;
  transactionMode?: string;
};

type Output = {
  success: boolean;
};

export function createDefiSwapSimulateTool(
  config: Config
): ToolDefinition<Input, Output> {
  return {
    name: "defi_swap_simulate",
    description: "Simulate a swap transaction via Engine",
    inputSchema,
    outputSchema,
    idempotent: true,
    async handler(context: ToolContext, rawInput: Input): Promise<Output> {
      assertSchema(inputSchema, rawInput, "defi_swap_simulate.input");
      if (!config.features.defi) {
        throw new Error("DeFi tooling is disabled (MCP_FEATURE_DEFI=false)");
      }
      assertEvmChainAllowed(config, rawInput.chain);

      if (config.mode === "mock") {
        return { success: true };
      }

      const headers: Record<string, string> = {
        "x-backend-wallet-address": rawInput.walletAddress
      };
      if (rawInput.accountAddress) headers["x-account-address"] = rawInput.accountAddress;
      if (rawInput.accountFactoryAddress) {
        headers["x-account-factory-address"] = rawInput.accountFactoryAddress;
      }
      if (rawInput.accountSalt) headers["x-account-salt"] = rawInput.accountSalt;
      if (rawInput.transactionMode) headers["x-transaction-mode"] = rawInput.transactionMode;

      const data = await requestEngine<{ result?: { success?: boolean } }>(context, {
        method: "POST",
        path: `/backend-wallet/${encodeURIComponent(rawInput.chain)}/simulate-transaction`,
        headers,
        body: {
          toAddress: rawInput.toAddress,
          data: rawInput.data,
          value: rawInput.value
        }
      });

      return { success: data?.result?.success ?? false };
    }
  };
}
