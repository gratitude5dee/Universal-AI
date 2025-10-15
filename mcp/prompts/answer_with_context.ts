import { JSONSchema, PromptDefinition } from "../types";

interface Params {
  question: string;
  context: string;
  citations?: Array<{ id: string; uri: string; title?: string }>;
  expectedFormat?: string;
}

const parametersSchema: JSONSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "answer_with_context.params",
  type: "object",
  required: ["question", "context"],
  properties: {
    question: { type: "string" },
    context: { type: "string" },
    expectedFormat: { type: "string" },
    citations: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "uri"],
        properties: {
          id: { type: "string" },
          uri: { type: "string" },
          title: { type: "string" }
        },
        additionalProperties: false
      }
    }
  },
  additionalProperties: false
};

export const answerWithContextPrompt: PromptDefinition<Params> = {
  name: "answer_with_context",
  description: "Answer a question grounded on supplied context with inline citations",
  parametersSchema,
  render(params: Params): string {
    const citationLines =
      params.citations?.map(
        (c) => `- [${c.id}](${c.uri}) ${c.title ?? ""}`.trim()
      ) ?? [];
    return [
      "You are UniversalAI's Analytics Agent.",
      "Respond accurately using only the provided context. Do not fabricate data.",
      "",
      `Question: ${params.question}`,
      "",
      "Context:",
      params.context,
      "",
      params.expectedFormat
        ? `Expected format: ${params.expectedFormat}`
        : "Format: bullet summary with final paragraph.",
      "",
      citationLines.length
        ? `Use the following citations when referencing facts:\n${citationLines.join("\n")}`
        : "No citations provided; cite KB URIs from context when possible.",
      "",
      "If uncertain, state the uncertainty explicitly."
    ].join("\n");
  }
};
