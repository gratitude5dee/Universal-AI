import { Config, ToolContext, ToolDefinition } from "../types";
import { assertSchema } from "../utils/schema";
import { assertEvmChainAllowed, requestEngine } from "../utils/engine";

const inputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "defi_token_balance.input",
  type: "object",
  required: ["chain", "tokenAddress", "ownerAddress"],
  properties: {
    chain: { type: "string" },
    tokenAddress: { type: "string" },
    ownerAddress: { type: "string" }
  },
  additionalProperties: false
} as const;

const outputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "defi_token_balance.output",
  type: "object",
  required: ["tokenAddress", "ownerAddress", "balance"],
  properties: {
    tokenAddress: { type: "string" },
    ownerAddress: { type: "string" },
    balance: { type: "string" },
    raw: { type: "object", additionalProperties: true }
  },
  additionalProperties: false
} as const;

type Input = {
  chain: string;
  tokenAddress: string;
  ownerAddress: string;
};

type Output = {
  tokenAddress: string;
  ownerAddress: string;
  balance: string;
  raw: Record<string, unknown>;
};

export function createDefiTokenBalanceTool(
  config: Config
): ToolDefinition<Input, Output> {
  return {
    name: "defi_token_balance",
    description: "Read ERC20 token balance via Engine contract read-batch",
    inputSchema,
    outputSchema,
    idempotent: true,
    async handler(context: ToolContext, rawInput: Input): Promise<Output> {
      assertSchema(inputSchema, rawInput, "defi_token_balance.input");
      if (!config.features.defi) {
        throw new Error("DeFi tooling is disabled (MCP_FEATURE_DEFI=false)");
      }
      assertEvmChainAllowed(config, rawInput.chain);

      if (config.mode === "mock") {
        return {
          tokenAddress: rawInput.tokenAddress,
          ownerAddress: rawInput.ownerAddress,
          balance: "0",
          raw: { mocked: true }
        };
      }

      const data = await requestEngine<{
        results?: Array<{ success: boolean; result: unknown }>;
      }>(context, {
        method: "POST",
        path: `/contract/${encodeURIComponent(rawInput.chain)}/read-batch`,
        body: {
          calls: [
            {
              contractAddress: rawInput.tokenAddress,
              functionName: "function balanceOf(address owner) view returns (uint256)",
              args: [rawInput.ownerAddress]
            }
          ]
        }
      });

      const first = data?.results?.[0];
      if (!first || !first.success) {
        throw new Error("Token balance read failed");
      }

      const rawResult = first.result as unknown;
      const balanceValue = Array.isArray(rawResult)
        ? rawResult[0]
        : rawResult;

      return {
        tokenAddress: rawInput.tokenAddress,
        ownerAddress: rawInput.ownerAddress,
        balance: String(balanceValue ?? "0"),
        raw: { result: rawResult }
      };
    }
  };
}
