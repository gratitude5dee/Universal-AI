import { beforeEach, describe, expect, it, vi } from "vitest";

const { invokeMock } = vi.hoisted(() => ({
  invokeMock: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: {
      invoke: invokeMock,
    },
  },
}));

import {
  createBagsLaunchSession,
  createBankrAutomationSession,
  createClankerPreflight,
  createEngineAdminAction,
} from "@/lib/provider-actions";

describe("provider-actions", () => {
  beforeEach(() => {
    invokeMock.mockReset();
  });

  it("invokes the Clanker preflight function", async () => {
    const response = {
      launchProvider: "clanker",
      executionProvider: "clanker",
      walletProvider: "thirdweb_evm",
      custodyMode: "external_user",
      mode: "mock",
      preflightId: "job-1",
      chainId: 8453,
      warnings: [],
      nextAction: "continue",
    };
    invokeMock.mockResolvedValueOnce({ data: response, error: null });

    await expect(
      createClankerPreflight({
        name: "Universal Creator",
        symbol: "UAI",
        description: "Test launch",
        walletAddress: "0x123",
        chainId: 8453,
      }),
    ).resolves.toEqual(response);

    expect(invokeMock).toHaveBeenCalledWith("launch-clanker-preflight", {
      body: {
        name: "Universal Creator",
        symbol: "UAI",
        description: "Test launch",
        walletAddress: "0x123",
        chainId: 8453,
      },
    });
  });

  it("invokes the Bags launch session function", async () => {
    const response = {
      launchProvider: "bags",
      executionProvider: "bags",
      walletProvider: "solana_wallet_standard",
      custodyMode: "external_user",
      mode: "mock",
      sessionId: "session-1",
      warnings: [],
      adapterMode: "route_scoped",
      nextAction: "continue",
    };
    invokeMock.mockResolvedValueOnce({ data: response, error: null });

    await expect(
      createBagsLaunchSession({
        name: "Universal Sol",
        symbol: "USOL",
        description: "Solana launch",
        launchWallet: "So1anaWallet",
      }),
    ).resolves.toEqual(response);

    expect(invokeMock).toHaveBeenCalledWith("launch-bags-session", {
      body: {
        name: "Universal Sol",
        symbol: "USOL",
        description: "Solana launch",
        launchWallet: "So1anaWallet",
      },
    });
  });

  it("invokes the Bankr automation session function", async () => {
    const response = {
      executionProvider: "bankr",
      launchProvider: "bankr",
      mode: "mock",
      guidance: "Optional only",
      nextAction: "continue",
    };
    invokeMock.mockResolvedValueOnce({ data: response, error: null });

    await expect(
      createBankrAutomationSession({
        prompt: "Draft a launch playbook",
        chain: "base",
        objective: "automation",
      }),
    ).resolves.toEqual(response);

    expect(invokeMock).toHaveBeenCalledWith("bankr-automation-session", {
      body: {
        prompt: "Draft a launch playbook",
        chain: "base",
        objective: "automation",
      },
    });
  });

  it("invokes the Engine admin execution function", async () => {
    const response = {
      executionProvider: "thirdweb_engine",
      mode: "mock",
      requestId: "request-1",
      status: "ready",
      nextAction: "continue",
    };
    invokeMock.mockResolvedValueOnce({ data: response, error: null });

    await expect(
      createEngineAdminAction({
        action: "sync_contract",
        chainId: 8453,
        contractAddress: "0xabc",
        method: "setBaseURI",
        params: ["ipfs://metadata"],
      }),
    ).resolves.toEqual(response);

    expect(invokeMock).toHaveBeenCalledWith("engine-admin-execute", {
      body: {
        action: "sync_contract",
        chainId: 8453,
        contractAddress: "0xabc",
        method: "setBaseURI",
        params: ["ipfs://metadata"],
      },
    });
  });
});
