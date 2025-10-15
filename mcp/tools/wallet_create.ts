import { Config, ToolContext, ToolDefinition } from "../types";
import { assertSchema } from "../utils/schema";

const inputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "wallet_create.input",
  type: "object",
  required: ["creatorId", "email"],
  properties: {
    creatorId: { type: "string" },
    email: { type: "string", format: "email" },
    chain: { type: "string", enum: ["solana"], default: "solana" }
  },
  additionalProperties: false
} as const;

const outputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "wallet_create.output",
  type: "object",
  required: ["walletId", "walletAddress", "chain", "status"],
  properties: {
    walletId: { type: "string" },
    walletAddress: { type: "string" },
    chain: { type: "string" },
    status: { type: "string" }
  },
  additionalProperties: false
} as const;

type Input = {
  creatorId: string;
  email: string;
  chain?: "solana";
};

type Output = {
  walletId: string;
  walletAddress: string;
  chain: string;
  status: string;
};

export function createWalletCreateTool(
  config: Config
): ToolDefinition<Input, Output> {
  return {
    name: "wallet_create",
    description: "Create a Crossmint wallet for a creator",
    inputSchema,
    outputSchema,
    idempotent: false,
    async handler(context: ToolContext, rawInput: Input): Promise<Output> {
      assertSchema(inputSchema, rawInput, "wallet_create.input");
      const chain = rawInput.chain ?? "solana";

      if (config.mode === "mock" || config.crossmint.dryRun) {
        return {
          walletId: `mock-${rawInput.creatorId}`,
          walletAddress: "MockWallet111111111111111111111111111111",
          chain,
          status: "mocked"
        };
      }

      if (!config.crossmint.apiKey || !config.crossmint.projectId) {
        throw new Error("Crossmint API credentials must be configured");
      }

      const response = await context.fetch(
        `${config.crossmint.baseUrl}/api/v1-alpha1/wallets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-client-secret": config.crossmint.apiKey,
            "x-project-id": config.crossmint.projectId,
            "X-Correlation-Id": context.correlationId
          },
          body: JSON.stringify({
            chain,
            email: rawInput.email,
            metadata: { creatorId: rawInput.creatorId }
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Crossmint wallet creation failed: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();
      return {
        walletId: data.id ?? data.walletId ?? "unknown",
        walletAddress: data.publicKey ?? data.walletAddress ?? "",
        chain: data.chain ?? chain,
        status: data.status ?? "pending"
      };
    }
  };
}
