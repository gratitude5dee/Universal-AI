import { Config, ToolContext, ToolDefinition } from "../types";
import { assertSchema } from "../utils/schema";

const inputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "storage_get.input",
  type: "object",
  required: ["bucket", "path"],
  properties: {
    bucket: { type: "string" },
    path: { type: "string" },
    expiresIn: { type: "integer", minimum: 60, maximum: 86400 },
    download: { type: "boolean" }
  },
  additionalProperties: false
} as const;

const outputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "storage_get.output",
  type: "object",
  required: ["bucket", "path", "signedUrl", "expiresAt"],
  properties: {
    bucket: { type: "string" },
    path: { type: "string" },
    signedUrl: { type: "string" },
    expiresAt: { type: "string", format: "date-time" }
  },
  additionalProperties: false
} as const;

type Input = {
  bucket: string;
  path: string;
  expiresIn?: number;
  download?: boolean;
};

type Output = {
  bucket: string;
  path: string;
  signedUrl: string;
  expiresAt: string;
};

export function createStorageGetTool(
  config: Config
): ToolDefinition<Input, Output> {
  return {
    name: "storage_get",
    description: "Generate a signed URL for a Supabase Storage object",
    inputSchema,
    outputSchema,
    idempotent: true,
    async handler(context: ToolContext, rawInput: Input): Promise<Output> {
      assertSchema(inputSchema, rawInput, "storage_get.input");
      if (!config.storageBuckets.includes(rawInput.bucket)) {
        throw new Error(`Bucket ${rawInput.bucket} is not allowlisted`);
      }

      if (config.mode === "mock") {
        const expiresAt = new Date(Date.now() + 300_000).toISOString();
        return {
          bucket: rawInput.bucket,
          path: rawInput.path,
          signedUrl: `https://example.com/${rawInput.bucket}/${rawInput.path}?mock=true`,
          expiresAt
        };
      }

      const expiresIn = rawInput.expiresIn ?? config.storageDefaultExpirySeconds;
      const { data, error } = await context.supabase
        .storage
        .from(rawInput.bucket)
        .createSignedUrl(rawInput.path, expiresIn, { download: rawInput.download });

      if (error || !data) {
        throw new Error(`Failed to create signed URL: ${error?.message ?? "unknown error"}`);
      }

      const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();
      return {
        bucket: rawInput.bucket,
        path: rawInput.path,
        signedUrl: data.signedUrl,
        expiresAt
      };
    }
  };
}
