import { Config, ToolContext, ToolDefinition } from "../types";
import { assertSchema } from "../utils/schema";
import { assertEvmChainAllowed, requestEngine } from "../utils/engine";

const inputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "evm_wallet_send.input",
  type: "object",
  required: ["chain", "walletAddress", "data", "value"],
  properties: {
    chain: { type: "string" },
    walletAddress: { type: "string" },
    toAddress: { type: "string" },
    data: { type: "string" },
    value: { type: "string" },
    simulate: { type: "boolean" },
    idempotencyKey: { type: "string" },
    accountAddress: { type: "string" },
    accountFactoryAddress: { type: "string" },
    accountSalt: { type: "string" },
    transactionMode: { type: "string" },
    txOverrides: { type: "object", additionalProperties: true },
    authorizationList: { type: "array", items: { type: "object" } }
  },
  additionalProperties: false
} as const;

const outputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "evm_wallet_send.output",
  type: "object",
  required: ["queueId"],
  properties: {
    queueId: { type: "string" }
  },
  additionalProperties: false
} as const;

type Input = {
  chain: string;
  walletAddress: string;
  toAddress?: string;
  data: string;
  value: string;
  simulate?: boolean;
  idempotencyKey?: string;
  accountAddress?: string;
  accountFactoryAddress?: string;
  accountSalt?: string;
  transactionMode?: string;
  txOverrides?: Record<string, unknown>;
  authorizationList?: Array<Record<string, unknown>>;
};

type Output = {
  queueId: string;
};

export function createEvmWalletSendTool(
  config: Config
): ToolDefinition<Input, Output> {
  return {
    name: "evm_wallet_send",
    description: "Send an EVM transaction via Engine backend wallet",
    inputSchema,
    outputSchema,
    idempotent: false,
    async handler(context: ToolContext, rawInput: Input): Promise<Output> {
      assertSchema(inputSchema, rawInput, "evm_wallet_send.input");
      if (!config.features.web3) {
        throw new Error("EVM tooling is disabled (MCP_FEATURE_WEB3=false)");
      }
      assertEvmChainAllowed(config, rawInput.chain);

      if (config.mode === "mock") {
        return { queueId: `mock-queue-${Date.now()}` };
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
        path: `/backend-wallet/${encodeURIComponent(rawInput.chain)}/send-transaction`,
        query: { simulateTx: rawInput.simulate ?? false },
        headers,
        body: {
          toAddress: rawInput.toAddress,
          data: rawInput.data,
          value: rawInput.value,
          txOverrides: rawInput.txOverrides,
          authorizationList: rawInput.authorizationList
        }
      });

      if (!data?.result?.queueId) {
        throw new Error("Engine did not return a queueId");
      }

      return { queueId: data.result.queueId };
    }
  };
}
