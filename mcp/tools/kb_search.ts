import { Config, ToolContext, ToolDefinition } from "../types";
import { assertSchema } from "../utils/schema";

const inputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "kb_search.input",
  type: "object",
  required: ["query"],
  properties: {
    query: { type: "string", minLength: 4 },
    topK: { type: "integer", minimum: 1, maximum: 20 },
    similarityThreshold: { type: "number", minimum: 0, maximum: 1 },
    filters: {
      type: "object",
      additionalProperties: {
        type: ["string", "number", "boolean"]
      }
    }
  },
  additionalProperties: false
} as const;

const outputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "kb_search.output",
  type: "object",
  required: ["query", "matches"],
  properties: {
    query: { type: "string" },
    matches: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "score", "chunk"],
        properties: {
          id: { type: "string" },
          score: { type: "number" },
          chunk: { type: "string" },
          source: { type: "string" },
          metadata: { type: "object", additionalProperties: true }
        },
        additionalProperties: false
      }
    }
  },
  additionalProperties: false
} as const;

type Input = {
  query: string;
  topK?: number;
  similarityThreshold?: number;
  filters?: Record<string, string | number | boolean>;
};

type Match = {
  id: string;
  score: number;
  chunk: string;
  source: string;
  metadata?: Record<string, unknown>;
};

type Output = {
  query: string;
  matches: Match[];
};

async function embedQuery(config: Config, context: ToolContext, query: string): Promise<number[]> {
  if (!config.kb.embeddingEndpoint) {
    throw new Error("Embedding endpoint is not configured");
  }
  if (!config.kb.embeddingApiKey) {
    throw new Error("Embedding API key is not configured");
  }

  const response = await context.fetch(config.kb.embeddingEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.kb.embeddingApiKey}`
    },
    body: JSON.stringify({
      model: config.kb.embeddingModel,
      input: query
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Embedding API failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const embedding: number[] | undefined =
    data?.data?.[0]?.embedding ?? data?.embedding;
  if (!embedding) {
    throw new Error("Embedding API did not return an embedding");
  }
  return embedding;
}

export function createKbSearchTool(
  config: Config
): ToolDefinition<Input, Output> {
  return {
    name: "kb_search",
    description: "Vector search across UniversalAI knowledge base with pgvector",
    inputSchema,
    outputSchema,
    idempotent: true,
    async handler(context: ToolContext, rawInput: Input): Promise<Output> {
      assertSchema(inputSchema, rawInput, "kb_search.input");

      if (config.mode === "mock") {
        return {
          query: rawInput.query,
          matches: [
            {
              id: "kb-mock",
              score: 0.9,
              chunk: "Mocked knowledge base snippet.",
              source: "kb://universalai/mock",
              metadata: { mocked: true }
            }
          ]
        };
      }

      const topK = rawInput.topK ?? config.kb.defaultTopK;
      const threshold =
        rawInput.similarityThreshold ?? config.kb.defaultThreshold;
      const embedding = await embedQuery(config, context, rawInput.query);

      const { data, error } = await context.supabase.rpc<
        Array<{
          id: string;
          similarity: number;
          chunk: string;
          source_uri: string;
          metadata: Record<string, unknown>;
        }>
      >(config.kb.matchRpc, {
        query_embedding: embedding,
        match_count: topK,
        match_threshold: threshold,
        filter_metadata: rawInput.filters ?? null
      });

      if (error) {
        throw new Error(`kb_search failed: ${error.message}`);
      }

      const matches: Match[] = (data ?? []).map((row) => ({
        id: row.id,
        score: row.similarity,
        chunk: row.chunk,
        source: row.source_uri,
        metadata: row.metadata
      }));

      return { query: rawInput.query, matches };
    }
  };
}
