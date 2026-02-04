import { describe, expect, test } from "vitest";
import { evaluateGate } from "./gating";

describe("evaluateGate", () => {
  test("denies when not connected", () => {
    expect(
      evaluateGate({ tokenType: "WZRD", amount: 1, condition: "holds" }, { addressConnected: false, wzrdBalance: 999 }),
    ).toBe(false);
  });

  test("allows WZRD balance threshold", () => {
    expect(
      evaluateGate({ tokenType: "WZRD", amount: 100, condition: "holds" }, { addressConnected: true, wzrdBalance: 100 }),
    ).toBe(true);
    expect(
      evaluateGate({ tokenType: "WZRD", amount: 100, condition: "holds" }, { addressConnected: true, wzrdBalance: 99.9 }),
    ).toBe(false);
  });

  test("allows USDC balance threshold", () => {
    expect(
      evaluateGate({ tokenType: "USDC", amount: 10, condition: "holds" }, { addressConnected: true, usdcBalance: 10 }),
    ).toBe(true);
    expect(
      evaluateGate({ tokenType: "USDC", amount: 10, condition: "holds" }, { addressConnected: true, usdcBalance: 0 }),
    ).toBe(false);
  });

  test("allows NFT ownership when hasAnyNft is true", () => {
    expect(
      evaluateGate(
        { tokenType: "WZRD NFT", amount: 1, condition: "owns" },
        { addressConnected: true, hasAnyNft: true },
      ),
    ).toBe(true);
    expect(
      evaluateGate(
        { tokenType: "WZRD NFT", amount: 1, condition: "owns" },
        { addressConnected: true, hasAnyNft: false },
      ),
    ).toBe(false);
  });
});

