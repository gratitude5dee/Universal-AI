import { Config, ToolContext, ToolDefinition } from "../types";
import { assertSchema } from "../utils/schema";
import { invokeEdgeFunction, invokeRpcFunction } from "./domain_action_utils";

const inputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "finance_workflow.input",
  type: "object",
  required: ["action", "payload"],
  properties: {
    action: {
      type: "string",
      enum: ["ingest_royalty", "refresh_forecast", "export_report", "preview_split", "request_transfer", "approve_transfer"],
    },
    payload: { type: "object", additionalProperties: true },
    idempotencyKey: { type: "string", minLength: 16 },
  },
  additionalProperties: false,
} as const;

const outputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "finance_workflow.output",
  type: "object",
  required: ["action", "result"],
  properties: {
    action: { type: "string" },
    result: { type: ["object", "array", "string", "number", "boolean", "null"] },
  },
  additionalProperties: false,
} as const;

type Input = {
  action: "ingest_royalty" | "refresh_forecast" | "export_report" | "preview_split" | "request_transfer" | "approve_transfer";
  payload: Record<string, unknown>;
  idempotencyKey?: string;
};

export function createFinanceWorkflowTool(_config: Config): ToolDefinition<Input, { action: string; result: unknown }> {
  return {
    name: "finance_workflow",
    description: "Safe finance operations for royalties, forecasting, reporting, and treasury controls.",
    inputSchema,
    outputSchema,
    idempotent: false,
    async handler(context: ToolContext, rawInput: Input) {
      assertSchema(inputSchema, rawInput, "finance_workflow.input");

      switch (rawInput.action) {
        case "ingest_royalty":
          return {
            action: rawInput.action,
            result: await invokeEdgeFunction(context, "royalty-ingest", rawInput.payload, rawInput.idempotencyKey),
          };
        case "refresh_forecast":
          return {
            action: rawInput.action,
            result: await invokeEdgeFunction(context, "forecast-refresh", rawInput.payload, rawInput.idempotencyKey),
          };
        case "export_report":
          return {
            action: rawInput.action,
            result: await invokeEdgeFunction(context, "report-export", rawInput.payload, rawInput.idempotencyKey),
          };
        case "preview_split":
          return {
            action: rawInput.action,
            result: await invokeRpcFunction(context, "preview_split_sheet_allocations", rawInput.payload),
          };
        case "request_transfer":
          return {
            action: rawInput.action,
            result: await invokeRpcFunction(context, "request_treasury_transfer", rawInput.payload),
          };
        case "approve_transfer":
          return {
            action: rawInput.action,
            result: await invokeRpcFunction(context, "approve_treasury_transfer_request", rawInput.payload),
          };
      }
    },
  };
}
