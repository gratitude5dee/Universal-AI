import { Config, ToolContext, ToolDefinition } from "../types";
import { assertSchema } from "../utils/schema";
import { assertEvmChainAllowed, requestEngine } from "../utils/engine";

const inputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "defi_allowance.input",
  type: "object",
  required: ["chain", "tokenAddress", "ownerAddress", "spenderAddress"],
  properties: {
    chain: { type: "string" },
    tokenAddress: { type: "string" },
    ownerAddress: { type: "string" },
    spenderAddress: { type: "string" }
  },
  additionalProperties: false
} as const;

const outputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "defi_allowance.output",
  type: "object",
  required: ["tokenAddress", "ownerAddress", "spenderAddress", "allowance"],
  properties: {
    tokenAddress: { type: "string" },
    ownerAddress: { type: "string" },
    spenderAddress: { type: "string" },
    allowance: { type: "string" },
    raw: { type: "object", additionalProperties: true }
  },
  additionalProperties: false
} as const;

type Input = {
  chain: string;
  tokenAddress: string;
  ownerAddress: string;
  spenderAddress: string;
};

type Output = {
  tokenAddress: string;
  ownerAddress: string;
  spenderAddress: string;
  allowance: string;
  raw: Record<string, unknown>;
};

export function createDefiAllowanceTool(
  config: Config
): ToolDefinition<Input, Output> {
  return {
    name: "defi_allowance",
    description: "Read ERC20 allowance via Engine contract read-batch",
    inputSchema,
    outputSchema,
    idempotent: true,
    async handler(context: ToolContext, rawInput: Input): Promise<Output> {
      assertSchema(inputSchema, rawInput, "defi_allowance.input");
      if (!config.features.defi) {
        throw new Error("DeFi tooling is disabled (MCP_FEATURE_DEFI=false)");
      }
      assertEvmChainAllowed(config, rawInput.chain);

      if (config.mode === "mock") {
        return {
          tokenAddress: rawInput.tokenAddress,
          ownerAddress: rawInput.ownerAddress,
          spenderAddress: rawInput.spenderAddress,
          allowance: "0",
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
              functionName:
                "function allowance(address owner, address spender) view returns (uint256)",
              args: [rawInput.ownerAddress, rawInput.spenderAddress]
            }
          ]
        }
      });

      const first = data?.results?.[0];
      if (!first || !first.success) {
        throw new Error("Allowance read failed");
      }

      const rawResult = first.result as unknown;
      const allowanceValue = Array.isArray(rawResult)
        ? rawResult[0]
        : rawResult;

      return {
        tokenAddress: rawInput.tokenAddress,
        ownerAddress: rawInput.ownerAddress,
        spenderAddress: rawInput.spenderAddress,
        allowance: String(allowanceValue ?? "0"),
        raw: { result: rawResult }
      };
    }
  };
}
