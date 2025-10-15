import { Config, ToolContext, ToolDefinition } from "../types";
import { assertSchema } from "../utils/schema";

const inputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "storage_put.input",
  type: "object",
  required: ["bucket", "path", "contentType", "contentBase64"],
  properties: {
    bucket: { type: "string" },
    path: { type: "string" },
    contentType: { type: "string" },
    contentBase64: { type: "string" },
    metadata: {
      type: "object",
      additionalProperties: { type: "string" }
    },
    upsert: { type: "boolean", default: false }
  },
  additionalProperties: false
} as const;

const outputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "storage_put.output",
  type: "object",
  required: ["bucket", "path", "etag"],
  properties: {
    bucket: { type: "string" },
    path: { type: "string" },
    etag: { type: "string" },
    bytes: { type: "integer" }
  },
  additionalProperties: false
} as const;

type Input = {
  bucket: string;
  path: string;
  contentType: string;
  contentBase64: string;
  metadata?: Record<string, string>;
  upsert?: boolean;
};

type Output = {
  bucket: string;
  path: string;
  etag: string;
  bytes: number;
};

export function createStoragePutTool(
  config: Config
): ToolDefinition<Input, Output> {
  return {
    name: "storage_put",
    description: "Upload an object to Supabase Storage with metadata",
    inputSchema,
    outputSchema,
    idempotent: false,
    async handler(context: ToolContext, rawInput: Input): Promise<Output> {
      assertSchema(inputSchema, rawInput, "storage_put.input");
      if (!config.storageBuckets.includes(rawInput.bucket)) {
        throw new Error(`Bucket ${rawInput.bucket} is not allowlisted`);
      }

      const buffer = Buffer.from(rawInput.contentBase64, "base64");
      if (config.mode === "mock") {
        return {
          bucket: rawInput.bucket,
          path: rawInput.path,
          etag: `mock-${Date.now()}`,
          bytes: buffer.byteLength
        };
      }

      const { data, error } = await context.supabase
        .storage
        .from(rawInput.bucket)
        .upload(rawInput.path, buffer, {
          contentType: rawInput.contentType,
          metadata: rawInput.metadata,
          upsert: rawInput.upsert ?? false
        });

      if (error || !data) {
        throw new Error(`Failed to upload object: ${error?.message ?? "unknown error"}`);
      }

      return {
        bucket: rawInput.bucket,
        path: data.path ?? rawInput.path,
        etag: data.id ?? `hash-${Date.now()}`,
        bytes: buffer.byteLength
      };
    }
  };
}
