import { Config, ToolContext, ToolDefinition } from "../types";
import { assertSchema } from "../utils/schema";

const inputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "rwa_compliance_check.input",
  type: "object",
  required: ["subjectType", "subjectId", "status"],
  properties: {
    subjectType: { type: "string" },
    subjectId: { type: "string" },
    status: { type: "string", enum: ["approved", "rejected", "pending"] },
    ruleSet: { type: "string" },
    reason: { type: "string" },
    expiresAt: { type: "string", format: "date-time" },
    metadata: { type: "object", additionalProperties: true }
  },
  additionalProperties: false
} as const;

const outputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "rwa_compliance_check.output",
  type: "object",
  required: ["checkId", "status", "createdAt"],
  properties: {
    checkId: { type: "string" },
    status: { type: "string" },
    createdAt: { type: "string", format: "date-time" }
  },
  additionalProperties: false
} as const;

type Input = {
  subjectType: string;
  subjectId: string;
  status: "approved" | "rejected" | "pending";
  ruleSet?: string;
  reason?: string;
  expiresAt?: string;
  metadata?: Record<string, unknown>;
};

type Output = {
  checkId: string;
  status: string;
  createdAt: string;
};

export function createRwaComplianceCheckTool(
  config: Config
): ToolDefinition<Input, Output> {
  return {
    name: "rwa_compliance_check",
    description: "Record a compliance decision for an RWA subject",
    inputSchema,
    outputSchema,
    idempotent: false,
    async handler(context: ToolContext, rawInput: Input): Promise<Output> {
      assertSchema(inputSchema, rawInput, "rwa_compliance_check.input");
      if (!config.features.rwa) {
        throw new Error("RWA tooling is disabled (MCP_FEATURE_RWA=false)");
      }

      if (config.mode === "mock") {
        return {
          checkId: `mock-check-${Date.now()}`,
          status: rawInput.status,
          createdAt: context.now().toISOString()
        };
      }

      const { data, error } = await context.supabase.rpc<{
        id: string;
        status: string;
        created_at: string;
      }>("rwa_create_compliance_check", {
        subject_type: rawInput.subjectType,
        subject_id: rawInput.subjectId,
        rule_set: rawInput.ruleSet ?? null,
        status: rawInput.status,
        reason: rawInput.reason ?? null,
        expires_at: rawInput.expiresAt ?? null,
        metadata: rawInput.metadata ?? {}
      });

      if (error || !data) {
        throw new Error(`Compliance check RPC failed: ${error?.message ?? "no data"}`);
      }

      return {
        checkId: data.id,
        status: data.status,
        createdAt: data.created_at
      };
    }
  };
}
