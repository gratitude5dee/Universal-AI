import { Config, ToolContext, ToolDefinition } from "../types";
import { assertSchema } from "../utils/schema";
import { invokeEdgeFunction, invokeRpcFunction } from "./domain_action_utils";

const inputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "agent_workflow.input",
  type: "object",
  required: ["action", "payload"],
  properties: {
    action: {
      type: "string",
      enum: ["run_agent", "install_agent", "oauth_start", "oauth_callback", "sync_ens", "dispatch_message", "get_summary"],
    },
    payload: { type: "object", additionalProperties: true },
    idempotencyKey: { type: "string", minLength: 16 },
  },
  additionalProperties: false,
} as const;

const outputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "agent_workflow.output",
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
    | "run_agent"
    | "install_agent"
    | "oauth_start"
    | "oauth_callback"
    | "sync_ens"
    | "dispatch_message"
    | "get_summary";
  payload: Record<string, unknown>;
  idempotencyKey?: string;
};

export function createAgentWorkflowTool(_config: Config): ToolDefinition<Input, { action: string; result: unknown }> {
  return {
    name: "agent_workflow",
    description: "Safe agent operations for runs, installs, integrations, ENS, and messaging.",
    inputSchema,
    outputSchema,
    idempotent: false,
    async handler(context: ToolContext, rawInput: Input) {
      assertSchema(inputSchema, rawInput, "agent_workflow.input");

      const edgeMap = {
        run_agent: "agent-runner",
        install_agent: "agent-marketplace-install",
        oauth_start: "integration-oauth-start",
        oauth_callback: "integration-oauth-callback",
        sync_ens: "ens-profile-sync",
        dispatch_message: "botchan-message-dispatch",
      } as const;

      if (rawInput.action === "get_summary") {
        return {
          action: rawInput.action,
          result: await invokeRpcFunction(context, "get_agent_install_run_summary", rawInput.payload),
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
