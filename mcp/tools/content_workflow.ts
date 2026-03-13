import { Config, ToolContext, ToolDefinition } from "../types";
import { assertSchema } from "../utils/schema";
import { invokeEdgeFunction, invokeRpcFunction } from "./domain_action_utils";

const inputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "content_workflow.input",
  type: "object",
  required: ["action", "payload"],
  properties: {
    action: {
      type: "string",
      enum: ["search_assets", "ingest_asset", "publish_asset"],
    },
    payload: { type: "object", additionalProperties: true },
    idempotencyKey: { type: "string", minLength: 16 },
  },
  additionalProperties: false,
} as const;

const outputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "content_workflow.output",
  type: "object",
  required: ["action", "result"],
  properties: {
    action: { type: "string" },
    result: { type: ["object", "array", "string", "number", "boolean", "null"] },
  },
  additionalProperties: false,
} as const;

type Input = {
  action: "search_assets" | "ingest_asset" | "publish_asset";
  payload: Record<string, unknown>;
  idempotencyKey?: string;
};

type Output = {
  action: Input["action"];
  result: unknown;
};

export function createContentWorkflowTool(_config: Config): ToolDefinition<Input, Output> {
  return {
    name: "content_workflow",
    description: "Safe content operations for asset search, ingest, and marketplace publishing.",
    inputSchema,
    outputSchema,
    idempotent: false,
    async handler(context: ToolContext, rawInput: Input): Promise<Output> {
      assertSchema(inputSchema, rawInput, "content_workflow.input");

      switch (rawInput.action) {
        case "search_assets":
          return {
            action: rawInput.action,
            result: await invokeRpcFunction(context, "search_content_library", rawInput.payload),
          };
        case "ingest_asset":
          return {
            action: rawInput.action,
            result: await invokeEdgeFunction(context, "content-ingest", rawInput.payload, rawInput.idempotencyKey),
          };
        case "publish_asset":
          return {
            action: rawInput.action,
            result: await invokeEdgeFunction(context, "marketplace-publish", rawInput.payload, rawInput.idempotencyKey),
          };
      }
    },
  };
}
