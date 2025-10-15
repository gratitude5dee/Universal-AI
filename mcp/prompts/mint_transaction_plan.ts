import { JSONSchema, PromptDefinition } from "../types";

interface Params {
  assetName: string;
  chain: "solana";
  priceSol: number;
  distributionTargets: string[];
  licensingNotes?: string;
}

const parametersSchema: JSONSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "mint_transaction_plan.params",
  type: "object",
  required: ["assetName", "chain", "priceSol", "distributionTargets"],
  properties: {
    assetName: { type: "string" },
    chain: { type: "string", enum: ["solana"] },
    priceSol: { type: "number", exclusiveMinimum: 0 },
    distributionTargets: {
      type: "array",
      minItems: 1,
      items: { type: "string" }
    },
    licensingNotes: { type: "string" }
  },
  additionalProperties: false
};

export const mintTransactionPlanPrompt: PromptDefinition<Params> = {
  name: "mint_transaction_plan",
  description: "Create a Solana mint/transfer execution plan with guardrails",
  parametersSchema,
  render(params: Params): string {
    return [
      "You are UniversalAI's TreasuryAgent orchestrating a Solana mint.",
      "Produce a JSON plan with steps: preflight_checks, mint, distribution, postflight.",
      "Each step must include: description, required_tools, inputs, expected_outputs, rollback.",
      "Respect the following inputs:",
      JSON.stringify(params, null, 2),
      "Ensure compliance with creator rights and treasury limits."
    ].join("\n");
  }
};
