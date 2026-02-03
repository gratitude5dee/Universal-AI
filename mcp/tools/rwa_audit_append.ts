import { Config, ToolContext, ToolDefinition } from "../types";
import { assertSchema } from "../utils/schema";

const inputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "rwa_audit_append.input",
  type: "object",
  required: ["eventType", "subjectType", "subjectId"],
  properties: {
    eventType: { type: "string" },
    subjectType: { type: "string" },
    subjectId: { type: "string" },
    correlationId: { type: "string" },
    metadata: { type: "object", additionalProperties: true }
  },
  additionalProperties: false
} as const;

const outputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "rwa_audit_append.output",
  type: "object",
  required: ["auditId", "createdAt"],
  properties: {
    auditId: { type: "string" },
    createdAt: { type: "string", format: "date-time" }
  },
  additionalProperties: false
} as const;

type Input = {
  eventType: string;
  subjectType: string;
  subjectId: string;
  correlationId?: string;
  metadata?: Record<string, unknown>;
};

type Output = {
  auditId: string;
  createdAt: string;
};

export function createRwaAuditAppendTool(
  config: Config
): ToolDefinition<Input, Output> {
  return {
    name: "rwa_audit_append",
    description: "Append an immutable RWA audit log entry",
    inputSchema,
    outputSchema,
    idempotent: false,
    async handler(context: ToolContext, rawInput: Input): Promise<Output> {
      assertSchema(inputSchema, rawInput, "rwa_audit_append.input");
      if (!config.features.rwa) {
        throw new Error("RWA tooling is disabled (MCP_FEATURE_RWA=false)");
      }

      if (config.mode === "mock") {
        return {
          auditId: `mock-audit-${Date.now()}`,
          createdAt: context.now().toISOString()
        };
      }

      const { data, error } = await context.supabase.rpc<{
        id: string;
        created_at: string;
      }>(config.rwa.auditRpc, {
        event_type: rawInput.eventType,
        subject_type: rawInput.subjectType,
        subject_id: rawInput.subjectId,
        correlation_id: rawInput.correlationId ?? context.correlationId,
        metadata: rawInput.metadata ?? {}
      });

      if (error || !data) {
        throw new Error(`Audit RPC failed: ${error?.message ?? "no data"}`);
      }

      return {
        auditId: data.id,
        createdAt: data.created_at
      };
    }
  };
}
