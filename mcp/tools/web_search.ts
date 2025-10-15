import { Config, ToolContext, ToolDefinition } from "../types";
import { assertSchema } from "../utils/schema";

const inputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "web_search.input",
  type: "object",
  required: ["query"],
  properties: {
    query: { type: "string", minLength: 3 },
    maxResults: { type: "integer", minimum: 1, maximum: 10 },
    region: { type: "string" }
  },
  additionalProperties: false
} as const;

const outputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "web_search.output",
  type: "object",
  required: ["query", "results"],
  properties: {
    query: { type: "string" },
    results: {
      type: "array",
      items: {
        type: "object",
        required: ["title", "url", "snippet"],
        properties: {
          title: { type: "string" },
          url: { type: "string" },
          snippet: { type: "string" },
          source: { type: "string" },
          publishedAt: { type: ["string", "null"], format: "date-time" }
        },
        additionalProperties: false
      }
    }
  },
  additionalProperties: false
} as const;

type Input = {
  query: string;
  maxResults?: number;
  region?: string;
};

type Result = {
  title: string;
  url: string;
  snippet: string;
  source?: string;
  publishedAt?: string | null;
};

type Output = {
  query: string;
  results: Result[];
};

export function createWebSearchTool(
  config: Config
): ToolDefinition<Input, Output> {
  return {
    name: "web_search",
    description: "Safe external web search for citations and market intelligence",
    inputSchema,
    outputSchema,
    idempotent: true,
    async handler(context: ToolContext, rawInput: Input): Promise<Output> {
      assertSchema(inputSchema, rawInput, "web_search.input");

      if (config.mode === "mock") {
        return {
          query: rawInput.query,
          results: [
            {
              title: "Mock search result",
              url: "https://example.com/mock",
              snippet: "Mocked search result because MCP_MODE=mock",
              source: "mock",
              publishedAt: null
            }
          ]
        };
      }

      const maxResults = rawInput.maxResults ?? config.webSearch.maxResultsDefault;
      if (!config.webSearch.apiKey) {
        throw new Error("Web search API key is not configured");
      }

      if (config.webSearch.provider === "tavily") {
        const response = await context.fetch(
          config.webSearch.endpoint ?? "https://api.tavily.com/search",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": config.webSearch.apiKey
            },
            body: JSON.stringify({
              query: rawInput.query,
              max_results: maxResults,
              search_depth: config.webSearch.safe ? "basic" : "advanced",
              include_answer: false,
              include_images: false,
              include_raw_content: false,
              location: rawInput.region
            })
          }
        );

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Web search failed: ${response.status} ${text}`);
        }

        const data = await response.json();
        const results: Result[] = (data?.results ?? []).map((item: any) => ({
          title: item.title,
          url: item.url,
          snippet: item.content ?? item.snippet ?? "",
          source: item.source,
          publishedAt: item.published_date ?? null
        }));
        return { query: rawInput.query, results };
      }

      const response = await context.fetch(config.webSearch.endpoint!, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${config.webSearch.apiKey}`,
          "X-Correlation-Id": context.correlationId
        }
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Web search failed: ${response.status} ${text}`);
      }
      const data = await response.json();
      const results: Result[] = (data?.results ?? []).slice(0, maxResults);
      return { query: rawInput.query, results };
    }
  };
}
