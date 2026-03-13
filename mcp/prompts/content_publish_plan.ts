export const contentPublishPlanPrompt = {
  name: "content_publish_plan",
  description: "Produce a concise launch checklist and publish plan for a content asset.",
  parametersSchema: {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    title: "content_publish_plan.params",
    type: "object",
    required: ["title", "marketplace"],
    properties: {
      title: { type: "string" },
      marketplace: { type: "string" },
      chain: { type: "string" },
      rightsStatus: { type: "string" },
      audience: { type: "string" },
    },
    additionalProperties: false,
  } as const,
  render(params: { title: string; marketplace: string; chain?: string; rightsStatus?: string; audience?: string }) {
    return [
      `Create a publish plan for "${params.title}".`,
      `Marketplace: ${params.marketplace}.`,
      `Chain: ${params.chain ?? "not specified"}.`,
      `Rights status: ${params.rightsStatus ?? "unknown"}.`,
      `Audience: ${params.audience ?? "general"}.`,
      "Return a short checklist, launch risks, recommended sequencing, and success metrics.",
    ].join("\n");
  },
};
