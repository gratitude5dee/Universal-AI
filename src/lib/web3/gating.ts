export type GateCondition = "owns" | "holds" | "staked";

export interface GateRequirement {
  tokenType: string;
  amount: number;
  condition: GateCondition;
}

export interface GateContext {
  addressConnected: boolean;
  wzrdBalance?: number;
  usdcBalance?: number;
  hasAnyNft?: boolean | null;
}

export function evaluateGate(requirement: GateRequirement, ctx: GateContext): boolean {
  if (!ctx.addressConnected) return false;

  const tokenType = String(requirement.tokenType ?? "").toLowerCase();

  if (tokenType === "wzrd") {
    return (ctx.wzrdBalance ?? 0) >= requirement.amount;
  }

  if (tokenType === "usdc") {
    return (ctx.usdcBalance ?? 0) >= requirement.amount;
  }

  if (tokenType.includes("nft")) {
    return ctx.hasAnyNft === true;
  }

  // Unknown token type: default deny.
  return false;
}

