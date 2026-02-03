import { Config, ToolContext, ToolDefinition } from "../types";
import { assertSchema } from "../utils/schema";
import { assertEvmChainAllowed, requestEngine } from "../utils/engine";

const inputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "evm_wallet_simulate.input",
  type: "object",
  required: ["chain", "walletAddress", "toAddress"],
  properties: {
    chain: { type: "string" },
    walletAddress: { type: "string" },
    toAddress: { type: "string" },
    value: { type: "string" },
    functionName: { type: "string" },
    args: { type: "array", items: {} },
    data: { type: "string" },
    accountAddress: { type: "string" },
    accountFactoryAddress: { type: "string" },
    accountSalt: { type: "string" },
    transactionMode: { type: "string" }
  },
  additionalProperties: false
} as const;

const outputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "evm_wallet_simulate.output",
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
  value?: string;
  functionName?: string;
  args?: unknown[];
  data?: string;
  accountAddress?: string;
  accountFactoryAddress?: string;
  accountSalt?: string;
  transactionMode?: string;
};

type Output = {
  success: boolean;
};

export function createEvmWalletSimulateTool(
  config: Config
): ToolDefinition<Input, Output> {
  return {
    name: "evm_wallet_simulate",
    description: "Simulate an EVM transaction via Engine",
    inputSchema,
    outputSchema,
    idempotent: true,
    async handler(context: ToolContext, rawInput: Input): Promise<Output> {
      assertSchema(inputSchema, rawInput, "evm_wallet_simulate.input");
      if (!config.features.web3) {
        throw new Error("EVM tooling is disabled (MCP_FEATURE_WEB3=false)");
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

      const data = await requestEngine<{
        result?: { success?: boolean };
      }>(context, {
        method: "POST",
        path: `/backend-wallet/${encodeURIComponent(rawInput.chain)}/simulate-transaction`,
        headers,
        body: {
          toAddress: rawInput.toAddress,
          value: rawInput.value,
          functionName: rawInput.functionName,
          args: rawInput.args,
          data: rawInput.data
        }
      });

      return { success: data?.result?.success ?? false };
    }
  };
}
