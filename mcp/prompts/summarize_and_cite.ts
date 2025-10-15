import { JSONSchema, PromptDefinition } from "../types";

interface Params {
  items: Array<{ title: string; body: string; uri: string }>;
  audience?: "creator" | "team" | "executive";
}

const parametersSchema: JSONSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "summarize_and_cite.params",
  type: "object",
  required: ["items"],
  properties: {
    audience: {
      type: "string",
      enum: ["creator", "team", "executive"],
      default: "creator"
    },
    items: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["title", "body", "uri"],
        properties: {
          title: { type: "string" },
          body: { type: "string" },
          uri: { type: "string" }
        },
        additionalProperties: false
      }
    }
  },
  additionalProperties: false
};

export const summarizeAndCitePrompt: PromptDefinition<Params> = {
  name: "summarize_and_cite",
  description: "Summarize multiple KB items and cite each source",
  parametersSchema,
  render(params: Params): string {
    const tone =
      params.audience === "executive"
        ? "C-suite ready, highlight revenue impact."
        : params.audience === "team"
        ? "Cross-functional tone with action items."
        : "Creator-friendly tone with tactical guidance.";
    const bullets = params.items
      .map(
        (item) =>
          `Title: ${item.title}\nBody:\n${item.body}\nSource: ${item.uri}`
      )
      .join("\n---\n");
    return [
      `Audience: ${params.audience ?? "creator"}`,
      tone,
      "",
      "Summarize the following documents. Provide:",
      "1. 3 bullet insights (each with inline citation).",
      "2. One risks/opportunities section.",
      "3. Recommended next action.",
      "",
      bullets
    ].join("\n");
  }
};
