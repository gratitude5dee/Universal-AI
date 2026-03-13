import { Config, ToolContext, ToolDefinition } from "../types";
import { assertSchema } from "../utils/schema";
import { invokeEdgeFunction, invokeRpcFunction } from "./domain_action_utils";

const inputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "rights_workflow.input",
  type: "object",
  required: ["action", "payload"],
  properties: {
    action: {
      type: "string",
      enum: ["register_asset", "sync_lineage", "create_agreement", "mint_license", "revoke_license", "transfer_rights", "get_rollup"],
    },
    payload: { type: "object", additionalProperties: true },
    idempotencyKey: { type: "string", minLength: 16 },
  },
  additionalProperties: false,
} as const;

const outputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "rights_workflow.output",
  type: "object",
  required: ["action", "result"],
  properties: {
    action: { type: "string" },
    result: { type: ["object", "array", "string", "number", "boolean", "null"] },
  },
  additionalProperties: false,
} as const;

type Input = {
  action:
    | "register_asset"
    | "sync_lineage"
    | "create_agreement"
    | "mint_license"
    | "revoke_license"
    | "transfer_rights"
    | "get_rollup";
  payload: Record<string, unknown>;
  idempotencyKey?: string;
};

export function createRightsWorkflowTool(_config: Config): ToolDefinition<Input, { action: string; result: unknown }> {
  return {
    name: "rights_workflow",
    description: "Safe rights operations for IP registration, lineage, agreements, and licensing.",
    inputSchema,
    outputSchema,
    idempotent: false,
    async handler(context: ToolContext, rawInput: Input) {
      assertSchema(inputSchema, rawInput, "rights_workflow.input");

      const edgeMap = {
        register_asset: "story-register-asset",
        sync_lineage: "story-sync-lineage",
        create_agreement: "agreement-create",
        mint_license: "license-mint",
        revoke_license: "license-revoke",
        transfer_rights: "rights-transfer",
      } as const;

      if (rawInput.action === "get_rollup") {
        return {
          action: rawInput.action,
          result: await invokeRpcFunction(context, "get_rights_rollup", rawInput.payload),
        };
      }

      return {
        action: rawInput.action,
        result: await invokeEdgeFunction(
          context,
          edgeMap[rawInput.action],
          rawInput.payload,
          rawInput.idempotencyKey,
        ),
      };
    },
  };
}
