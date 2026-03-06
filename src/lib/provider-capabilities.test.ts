import { describe, expect, test } from "vitest";
import {
  getProviderBoundary,
  getPreferredProviderForFeature,
  supportsProviderFeature,
} from "@/lib/provider-capabilities";

describe("provider capabilities", () => {
  test("keeps thirdweb as the only primary EVM wallet provider", () => {
    expect(getPreferredProviderForFeature("evm_wallet_connect").id).toBe("thirdweb");
    expect(supportsProviderFeature("crossmint", "evm_wallet_connect")).toBe(false);
  });

  test("routes Base launches through Clanker", () => {
    const boundary = getProviderBoundary("base_creator_launch");
    expect(boundary.primary.id).toBe("clanker");
    expect(boundary.secondary.map((provider) => provider.id)).toContain("bankr");
  });

  test("routes Solana launch through Bags only", () => {
    const boundary = getProviderBoundary("solana_creator_launch");
    expect(boundary.primary.id).toBe("bags");
    expect(boundary.forbidden).toContain("thirdweb as Solana launch provider");
  });
});
