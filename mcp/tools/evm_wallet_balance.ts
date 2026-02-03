import { Config, ToolContext, ToolDefinition } from "../types";
import { assertSchema } from "../utils/schema";
import { assertEvmChainAllowed, requestEngine } from "../utils/engine";

const inputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "evm_wallet_balance.input",
  type: "object",
  required: ["chain", "walletAddress"],
  properties: {
    chain: { type: "string" },
    walletAddress: { type: "string" }
  },
  additionalProperties: false
} as const;

const outputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "evm_wallet_balance.output",
  type: "object",
  required: ["walletAddress", "value", "displayValue"],
  properties: {
    walletAddress: { type: "string" },
    name: { type: ["string", "null"] },
    symbol: { type: ["string", "null"] },
    decimals: { type: ["string", "number", "null"] },
    value: { type: "string" },
    displayValue: { type: "string" }
  },
  additionalProperties: false
} as const;

type Input = {
  chain: string;
  walletAddress: string;
};

type Output = {
  walletAddress: string;
  name: string | null;
  symbol: string | null;
  decimals: string | number | null;
  value: string;
  displayValue: string;
};

export function createEvmWalletBalanceTool(
  config: Config
): ToolDefinition<Input, Output> {
  return {
    name: "evm_wallet_balance",
    description: "Fetch native balance for an EVM backend wallet via Engine",
    inputSchema,
    outputSchema,
    idempotent: true,
    async handler(context: ToolContext, rawInput: Input): Promise<Output> {
      assertSchema(inputSchema, rawInput, "evm_wallet_balance.input");
      if (!config.features.web3) {
        throw new Error("EVM tooling is disabled (MCP_FEATURE_WEB3=false)");
      }
      assertEvmChainAllowed(config, rawInput.chain);

      if (config.mode === "mock") {
        return {
          walletAddress: rawInput.walletAddress,
          name: "Ether",
          symbol: "ETH",
          decimals: "18",
          value: "0",
          displayValue: "0.0"
        };
      }

      const data = await requestEngine<{
        result?: {
          walletAddress?: string;
          name?: string;
          symbol?: string;
          decimals?: string | number;
          value?: string | number;
          displayValue?: string;
        };
      }>(context, {
        method: "GET",
        path: `/backend-wallet/${encodeURIComponent(rawInput.chain)}/${encodeURIComponent(
          rawInput.walletAddress
        )}/get-balance`
      });

      if (!data?.result) {
        throw new Error("Engine balance lookup failed");
      }

      return {
        walletAddress: data.result.walletAddress ?? rawInput.walletAddress,
        name: data.result.name ?? null,
        symbol: data.result.symbol ?? null,
        decimals: data.result.decimals ?? null,
        value: String(data.result.value ?? "0"),
        displayValue: data.result.displayValue ?? "0"
      };
    }
  };
}
