import { describe, it, expect } from "bun:test";
import { createSupabaseQuerySqlTool } from "../tools/supabase_query_sql";
import { createSupabaseCallRpcTool } from "../tools/supabase_call_rpc";
import { createStorageGetTool } from "../tools/storage_get";
import { createKbSearchTool } from "../tools/kb_search";
import { createEvmWalletCreateTool } from "../tools/evm_wallet_create";
import { createDefiTokenBalanceTool } from "../tools/defi_token_balance";
import { createRwaComplianceCheckTool } from "../tools/rwa_compliance_check";
import { createX402InferenceTool } from "../tools/x402_inference";
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

describe("evm_wallet_create", () => {
  it("returns mocked wallet in mock mode", async () => {
    const tool = createEvmWalletCreateTool(createMockConfig());
    const context = createMockContext();
    const result = await tool.handler(context, {});
    expect(result.walletAddress).toContain("0xMock");
  });
});

describe("defi_token_balance", () => {
  it("returns mocked balance in mock mode", async () => {
    const tool = createDefiTokenBalanceTool(createMockConfig());
    const context = createMockContext();
    const result = await tool.handler(context, {
      chain: "sepolia",
      tokenAddress: "0xToken",
      ownerAddress: "0xOwner"
    });
    expect(result.balance).toBe("0");
  });
});

describe("rwa_compliance_check", () => {
  it("returns mocked compliance result in mock mode", async () => {
    const tool = createRwaComplianceCheckTool(createMockConfig());
    const context = createMockContext();
    const result = await tool.handler(context, {
      subjectType: "wallet",
      subjectId: "wallet-1",
      status: "approved"
    });
    expect(result.checkId).toContain("mock");
  });
});

describe("x402_inference", () => {
  it("returns mocked response in mock mode", async () => {
    const tool = createX402InferenceTool(createMockConfig());
    const context = createMockContext();
    const result = await tool.handler(context, {
      payment: "mock",
      selectedModelId: "mock-model",
      messages: []
    });
    expect(result.status).toBe(200);
  });
});
