export const financeReconcilePlanPrompt = {
  name: "finance_reconcile_plan",
  description: "Produce a reconciliation plan for royalties, treasury, and reporting.",
  parametersSchema: {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    title: "finance_reconcile_plan.params",
    type: "object",
    required: ["periodLabel"],
    properties: {
      periodLabel: { type: "string" },
      revenueSources: { type: "string" },
      discrepancyCount: { type: "number" },
      transferRequests: { type: "number" },
    },
    additionalProperties: false,
  } as const,
  render(params: { periodLabel: string; revenueSources?: string; discrepancyCount?: number; transferRequests?: number }) {
    return [
      `Prepare a finance reconciliation plan for ${params.periodLabel}.`,
      `Revenue sources: ${params.revenueSources ?? "mixed"}.`,
      `Open discrepancies: ${params.discrepancyCount ?? 0}.`,
      `Pending transfer requests: ${params.transferRequests ?? 0}.`,
      "Return the order of operations, validation checks, and audit notes required before closing the period.",
    ].join("\n");
  },
};
