import { Config, ResourceDefinition, ToolContext } from "../types";

async function runOverviewSql(
  context: ToolContext,
  statementId: string,
  sqlText: string,
  creatorId: string,
) {
  if (context.config.mode === "mock") {
    return [];
  }

  const { data, error } = await context.supabase.rpc(context.config.sqlRunnerRpc, {
    statement_id: statementId,
    sql_text: sqlText,
    parameters: { creator_id: creatorId },
    row_limit: 25,
  });

  if (error) {
    throw new Error(`Overview query failed: ${error.message}`);
  }

  return ((data as { rows?: unknown[] } | null)?.rows ?? []) as Record<string, unknown>[];
}

export function createDashboardSummaryResource(_config: Config): ResourceDefinition {
  return {
    uri: "dashboard://creator/*",
    async list(_context, params) {
      const creatorId = typeof params?.creator_id === "string" ? params.creator_id : null;
      if (!creatorId) {
        return { items: [], nextCursor: null };
      }

      return {
        items: [
          {
            id: creatorId,
            uri: `dashboard://creator/${creatorId}`,
            title: `Creator Dashboard ${creatorId}`,
            summary: "Platform overview across content, marketing, finance, bridge, and agents.",
          },
        ],
        nextCursor: null,
      };
    },
    async get(context: ToolContext, id: string) {
      const [content, marketing, finance, bridge, agents] = await Promise.all([
        runOverviewSql(
          context,
          "content_dashboard_summary",
          "select * from content_dashboard_overview_v1 where creator_id = :creator_id",
          id,
        ),
        runOverviewSql(
          context,
          "marketing_dashboard_summary",
          "select * from marketing_dashboard_overview_v1 where creator_id = :creator_id",
          id,
        ),
        runOverviewSql(
          context,
          "finance_dashboard_summary",
          "select * from finance_dashboard_overview_v1 where creator_id = :creator_id",
          id,
        ),
        runOverviewSql(
          context,
          "bridge_dashboard_summary",
          "select * from bridge_dashboard_overview_v1 where creator_id = :creator_id",
          id,
        ),
        runOverviewSql(
          context,
          "agents_dashboard_summary",
          "select * from agents_dashboard_overview_v1 where creator_id = :creator_id",
          id,
        ),
      ]);

      return {
        id,
        uri: `dashboard://creator/${id}`,
        title: `Creator Dashboard ${id}`,
        contentType: "application/json",
        body: JSON.stringify({ content, marketing, finance, bridge, agents }, null, 2),
        summary: "Creator dashboard summary assembled from platform overview views.",
        metadata: { creatorId: id },
      };
    },
  };
}
