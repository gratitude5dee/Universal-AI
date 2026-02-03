import { Config, ToolContext, ToolDefinition } from "../types";
import { assertSchema } from "../utils/schema";
import { assertEvmChainAllowed, requestEngine } from "../utils/engine";

const inputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "defi_approve.input",
  type: "object",
  required: ["chain", "tokenAddress", "walletAddress", "spenderAddress", "amount"],
  properties: {
    chain: { type: "string" },
    tokenAddress: { type: "string" },
    walletAddress: { type: "string" },
    spenderAddress: { type: "string" },
    amount: { type: "string" },
    simulate: { type: "boolean" },
    idempotencyKey: { type: "string" },
    accountAddress: { type: "string" },
    accountFactoryAddress: { type: "string" },
    accountSalt: { type: "string" },
    transactionMode: { type: "string" },
    txOverrides: { type: "object", additionalProperties: true }
  },
  additionalProperties: false
} as const;

const outputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "defi_approve.output",
  type: "object",
  required: ["queueId"],
  properties: {
    queueId: { type: "string" }
  },
  additionalProperties: false
} as const;

type Input = {
  chain: string;
  tokenAddress: string;
  walletAddress: string;
  spenderAddress: string;
  amount: string;
  simulate?: boolean;
  idempotencyKey?: string;
  accountAddress?: string;
  accountFactoryAddress?: string;
  accountSalt?: string;
  transactionMode?: string;
  txOverrides?: Record<string, unknown>;
};

type Output = {
  queueId: string;
};

export function createDefiApproveTool(
  config: Config
): ToolDefinition<Input, Output> {
  return {
    name: "defi_approve",
    description: "Send an ERC20 approve transaction via Engine",
    inputSchema,
    outputSchema,
    idempotent: false,
    async handler(context: ToolContext, rawInput: Input): Promise<Output> {
      assertSchema(inputSchema, rawInput, "defi_approve.input");
      if (!config.features.defi) {
        throw new Error("DeFi tooling is disabled (MCP_FEATURE_DEFI=false)");
      }
      assertEvmChainAllowed(config, rawInput.chain);

      if (config.mode === "mock") {
        return { queueId: `mock-approve-${Date.now()}` };
      }

      const headers: Record<string, string> = {
        "x-backend-wallet-address": rawInput.walletAddress
      };
      if (rawInput.idempotencyKey) headers["x-idempotency-key"] = rawInput.idempotencyKey;
      if (rawInput.accountAddress) headers["x-account-address"] = rawInput.accountAddress;
      if (rawInput.accountFactoryAddress) {
        headers["x-account-factory-address"] = rawInput.accountFactoryAddress;
      }
      if (rawInput.accountSalt) headers["x-account-salt"] = rawInput.accountSalt;
      if (rawInput.transactionMode) headers["x-transaction-mode"] = rawInput.transactionMode;

      const data = await requestEngine<{
        result?: { queueId?: string };
      }>(context, {
        method: "POST",
        path: `/contract/${encodeURIComponent(rawInput.chain)}/${encodeURIComponent(
          rawInput.tokenAddress
        )}/write`,
        query: { simulateTx: rawInput.simulate ?? false },
        headers,
        body: {
          functionName: "function approve(address spender, uint256 amount)",
          args: [rawInput.spenderAddress, rawInput.amount],
          txOverrides: rawInput.txOverrides
        }
      });

      if (!data?.result?.queueId) {
        throw new Error("Engine did not return a queueId");
      }

      return { queueId: data.result.queueId };
    }
  };
}
