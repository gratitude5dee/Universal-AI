import {
  Config,
  ResourceDefinition,
  ResourceGetResponse,
  ResourceItem,
  ResourceListResponse,
  ToolContext
} from "../types";

export function createKnowledgeResource(config: Config): ResourceDefinition {
  return {
    uri: "kb://universalai/*",
    async list(
      context: ToolContext,
      params?: Record<string, string | string[] | undefined>
    ): Promise<ResourceListResponse> {
      if (config.mode === "mock") {
        return {
          items: [
            {
              id: "mock",
              uri: "kb://universalai/mock",
              title: "Mock Knowledge Item",
              summary: "This is a mocked knowledge resource.",
              metadata: { mocked: true }
            }
          ],
          nextCursor: null
        };
      }

      const limit = Number.parseInt(String(params?.limit ?? "20"), 10);
      const cursor = params?.cursor ? String(params.cursor) : null;

      const { data, error } = await context.supabase.rpc<
        Array<{
          id: string;
          uri: string;
          title: string;
          summary: string | null;
          metadata: Record<string, unknown>;
        }>
      >(config.kb.listRpc, {
        limit,
        cursor
      });

      if (error) {
        throw new Error(`Knowledge resource list failed: ${error.message}`);
      }

      const items: ResourceItem[] = (data ?? []).map((row) => ({
        id: row.id,
        uri: row.uri,
        title: row.title,
        summary: row.summary ?? undefined,
        metadata: row.metadata
      }));

      return {
        items,
        nextCursor: items.length === limit ? items[items.length - 1]?.id ?? null : null
      };
    },
    async get(context: ToolContext, id: string): Promise<ResourceGetResponse> {
      if (config.mode === "mock") {
        return {
          id,
          uri: `kb://universalai/${id}`,
          title: "Mock KB Item",
          body: "Mock body content (MCP_MODE=mock).",
          contentType: "text/markdown",
          summary: "Mock summary",
          metadata: { mocked: true }
        };
      }

      const { data, error } = await context.supabase.rpc<{
        id: string;
        uri: string;
        title: string;
        body: string;
        content_type: string;
        summary: string | null;
        metadata: Record<string, unknown>;
        embedding?: number[];
      }>(config.kb.getRpc, { id });

      if (error || !data) {
        throw new Error(`Knowledge resource get failed: ${error?.message ?? "not found"}`);
      }

      return {
        id: data.id,
        uri: data.uri,
        title: data.title,
        body: data.body,
        contentType: data.content_type,
        summary: data.summary ?? undefined,
        metadata: data.metadata,
        embedding: data.embedding
      };
    }
  };
}
