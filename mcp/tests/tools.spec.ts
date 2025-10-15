import { describe, it, expect } from "bun:test";
import { createSupabaseQuerySqlTool } from "../tools/supabase_query_sql";
import { createSupabaseCallRpcTool } from "../tools/supabase_call_rpc";
import { createStorageGetTool } from "../tools/storage_get";
import { createKbSearchTool } from "../tools/kb_search";
import { createMockContext, createMockConfig } from "./helpers";

describe("supabase_query_sql", () => {
  it("rejects non-allowlisted statements", async () => {
    const tool = createSupabaseQuerySqlTool(createMockConfig());
    const context = createMockContext();
    await expect(
      tool.handler(context, { statementId: "unknown" } as any)
    ).rejects.toThrow("not allowlisted");
  });

  it("returns mocked rows in mock mode", async () => {
    const tool = createSupabaseQuerySqlTool(createMockConfig());
    const context = createMockContext();
    const result = await tool.handler(context, { statementId: "list_creator_assets" });
    expect(result.rows.length).toBeGreaterThan(0);
    expect(result.statementId).toBe("list_creator_assets");
  });
});

describe("supabase_call_rpc", () => {
  it("rejects unknown RPCs", async () => {
    const tool = createSupabaseCallRpcTool(createMockConfig());
    const context = createMockContext();
    await expect(
      tool.handler(context, { functionId: "not-allowed", payload: {} })
    ).rejects.toThrow("not allowlisted");
  });

  it("returns mocked response", async () => {
    const tool = createSupabaseCallRpcTool(createMockConfig());
    const context = createMockContext();
    const result = await tool.handler(context, {
      functionId: "create-wallet",
      payload: { test: true }
    });
    expect(result.result).toEqual({ mocked: true });
  });
});

describe("storage_get", () => {
  it("rejects disallowed bucket", async () => {
    const tool = createStorageGetTool(createMockConfig());
    const context = createMockContext();
    await expect(
      tool.handler(context, { bucket: "not-allowed", path: "foo" } as any)
    ).rejects.toThrow("not allowlisted");
  });

  it("returns signed URL in mock mode", async () => {
    const tool = createStorageGetTool(createMockConfig());
    const context = createMockContext();
    const result = await tool.handler(context, {
      bucket: "agent-artifacts",
      path: "foo.txt"
    });
    expect(result.signedUrl).toContain("mock");
  });
});

describe("kb_search", () => {
  it("returns mocked matches", async () => {
    const tool = createKbSearchTool(createMockConfig());
    const context = createMockContext();
    const result = await tool.handler(context, { query: "test query" });
    expect(result.matches.length).toBeGreaterThan(0);
  });
});
