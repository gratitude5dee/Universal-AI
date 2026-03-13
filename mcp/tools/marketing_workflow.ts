import { Config, ToolContext, ToolDefinition } from "../types";
import { assertSchema } from "../utils/schema";
import { invokeEdgeFunction, invokeRpcFunction } from "./domain_action_utils";

const inputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "marketing_workflow.input",
  type: "object",
  required: ["action", "payload"],
  properties: {
    action: {
      type: "string",
      enum: ["dispatch_campaign", "process_webhook", "get_rollup", "sync_hydrex"],
    },
    payload: { type: "object", additionalProperties: true },
    idempotencyKey: { type: "string", minLength: 16 },
  },
  additionalProperties: false,
} as const;

const outputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "marketing_workflow.output",
  type: "object",
  required: ["action", "result"],
  properties: {
    action: { type: "string" },
    result: { type: ["object", "array", "string", "number", "boolean", "null"] },
  },
  additionalProperties: false,
} as const;

type Input = {
  action: "dispatch_campaign" | "process_webhook" | "get_rollup" | "sync_hydrex";
  payload: Record<string, unknown>;
  idempotencyKey?: string;
};

export function createMarketingWorkflowTool(_config: Config): ToolDefinition<Input, { action: string; result: unknown }> {
  return {
    name: "marketing_workflow",
    description: "Safe marketing and distribution operations for campaigns, webhooks, and Hydrex sync.",
    inputSchema,
    outputSchema,
    idempotent: false,
    async handler(context: ToolContext, rawInput: Input) {
      assertSchema(inputSchema, rawInput, "marketing_workflow.input");

      switch (rawInput.action) {
        case "dispatch_campaign":
          return {
            action: rawInput.action,
            result: await invokeEdgeFunction(context, "campaign-dispatch", rawInput.payload, rawInput.idempotencyKey),
          };
        case "process_webhook":
          return {
            action: rawInput.action,
            result: await invokeEdgeFunction(context, "campaign-webhook", rawInput.payload, rawInput.idempotencyKey),
          };
        case "sync_hydrex":
          return {
            action: rawInput.action,
            result: await invokeEdgeFunction(context, "hydrex-sync", rawInput.payload, rawInput.idempotencyKey),
          };
        case "get_rollup":
          return {
            action: rawInput.action,
            result: await invokeRpcFunction(context, "get_campaign_rollup", rawInput.payload),
          };
      }
    },
  };
}
