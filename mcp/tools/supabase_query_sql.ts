import { Config, ToolContext, ToolDefinition } from "../types";
import { assertSchema } from "../utils/schema";

const inputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "supabase_query_sql.input",
  type: "object",
  required: ["statementId"],
  properties: {
    statementId: {
      type: "string",
      description: "Allowlisted SQL statement identifier"
    },
    parameters: {
      type: "object",
      description: "Named parameters for the SQL statement",
      additionalProperties: {
        type: ["string", "number", "integer", "boolean", "null"]
      }
    },
    rowLimit: {
      type: "integer",
      minimum: 1,
      maximum: 500
    }
  },
  additionalProperties: false
} as const;

const outputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "supabase_query_sql.output",
  type: "object",
  required: ["statementId", "rows"],
  properties: {
    statementId: { type: "string" },
    rows: { type: "array", items: { type: "object" } },
    cached: { type: "boolean" },
    rowLimit: { type: "integer" }
  },
  additionalProperties: false
} as const;

type Input = {
  statementId: string;
  parameters?: Record<string, string | number | boolean | null>;
  rowLimit?: number;
};

type Output = {
  statementId: string;
  rows: Record<string, unknown>[];
  cached: boolean;
  rowLimit: number;
};

export function createSupabaseQuerySqlTool(
  config: Config
): ToolDefinition<Input, Output> {
  return {
    name: "supabase_query_sql",
    description: "Execute an allowlisted parameterized SELECT statement via Supabase RPC",
    inputSchema,
    outputSchema,
    idempotent: true,
    async handler(context: ToolContext, rawInput: Input): Promise<Output> {
      assertSchema(inputSchema, rawInput, "supabase_query_sql.input");
      const statement = config.allowlistedSql[rawInput.statementId];
      if (!statement) {
        throw new Error(`Statement ${rawInput.statementId} is not allowlisted`);
      }

      if (config.mode === "mock") {
        context.logger.debug("Returning mocked SQL rows", { statementId: rawInput.statementId });
        return {
          statementId: rawInput.statementId,
          rows: [
            {
              id: "mock",
              note: "mocked result (MCP_MODE=mock)"
            }
          ],
          cached: false,
          rowLimit: rawInput.rowLimit ?? config.sqlDefaultLimit
        };
      }

      const parameters = rawInput.parameters ?? {};
      const rowLimit = rawInput.rowLimit ?? config.sqlDefaultLimit;

      const { data, error } = await context.supabase.rpc<{
        rows: Record<string, unknown>[];
      }>(config.sqlRunnerRpc, {
        statement_id: rawInput.statementId,
        sql_text: statement,
        parameters,
        row_limit: rowLimit
      });

      if (error) {
        context.logger.error(error.message, { fn: config.sqlRunnerRpc, statementId: rawInput.statementId });
        throw new Error(`Supabase RPC ${config.sqlRunnerRpc} failed: ${error.message}`);
      }

      const rows = Array.isArray(data?.rows) ? data!.rows : ((data ?? []) as Record<string, unknown>[]);

      return {
        statementId: rawInput.statementId,
        rows,
        cached: false,
        rowLimit
      };
    }
  };
}
