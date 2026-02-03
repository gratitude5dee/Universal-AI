import { Config, ToolContext, ToolDefinition } from "../types";
import { assertSchema } from "../utils/schema";
import { requestEngine } from "../utils/engine";

const inputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "evm_wallet_create.input",
  type: "object",
  properties: {
    label: { type: "string" },
    type: { type: "string" },
    credentialId: { type: "string" },
    walletSetId: { type: "string" },
    isTestnet: { type: "boolean" }
  },
  additionalProperties: false
} as const;

const outputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "evm_wallet_create.output",
  type: "object",
  required: ["walletAddress", "status", "type"],
  properties: {
    walletAddress: { type: "string" },
    status: { type: "string" },
    type: { type: "string" }
  },
  additionalProperties: false
} as const;

type Input = {
  label?: string;
  type?: string;
  credentialId?: string;
  walletSetId?: string;
  isTestnet?: boolean;
};

type Output = {
  walletAddress: string;
  status: string;
  type: string;
};

export function createEvmWalletCreateTool(
  config: Config
): ToolDefinition<Input, Output> {
  return {
    name: "evm_wallet_create",
    description: "Create an EVM backend wallet via Engine",
    inputSchema,
    outputSchema,
    idempotent: false,
    async handler(context: ToolContext, rawInput: Input): Promise<Output> {
      assertSchema(inputSchema, rawInput, "evm_wallet_create.input");
      if (!config.features.web3) {
        throw new Error("EVM tooling is disabled (MCP_FEATURE_WEB3=false)");
      }

      if (config.mode === "mock") {
        return {
          walletAddress: "0xMockBackendWallet00000000000000000000000000000001",
          status: "mocked",
          type: rawInput.type ?? "local"
        };
      }

      const payload: Record<string, unknown> = {};
      if (rawInput.label) payload.label = rawInput.label;
      if (rawInput.type) payload.type = rawInput.type;
      if (rawInput.credentialId) payload.credentialId = rawInput.credentialId;
      if (rawInput.walletSetId) payload.walletSetId = rawInput.walletSetId;
      if (rawInput.isTestnet !== undefined) payload.isTestnet = rawInput.isTestnet;

      const data = await requestEngine<{
        result?: { walletAddress?: string; status?: string; type?: string };
      }>(context, {
        method: "POST",
        path: "/backend-wallet/create",
        body: payload
      });

      if (!data?.result?.walletAddress) {
        throw new Error("Engine wallet creation returned no wallet address");
      }

      return {
        walletAddress: data.result.walletAddress,
        status: data.result.status ?? "unknown",
        type: data.result.type ?? rawInput.type ?? "unknown"
      };
    }
  };
}
