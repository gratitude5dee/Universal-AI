import { serveDomainAction } from "../_shared/domain-workflows.ts";

serveDomainAction({
  providerEnvNames: ["HYDREX_API_KEY"],
  handle: async ({ body, adminClient, user, mode }) => {
    if (!user) throw new Error("Authentication is required");

    const payload = body as Record<string, unknown>;
    const positions = Array.isArray(payload.positions) ? payload.positions as Record<string, unknown>[] : [];
    const rewards = Array.isArray(payload.rewards) ? payload.rewards as Record<string, unknown>[] : [];
    const votes = Array.isArray(payload.votes) ? payload.votes as Record<string, unknown>[] : [];

    if (positions.length) {
      await adminClient.from("defi_positions").insert(
        positions.map((position) => ({
          creator_id: user.id,
          provider_id: "hydrex",
          chain: position.chain ?? payload.chain ?? "base",
          position_type: position.positionType ?? "liquidity",
          asset_symbol: position.assetSymbol ?? "HYDX",
          quantity: position.quantity ?? 0,
          usd_value: position.usdValue ?? 0,
          metadata: { ...(position.metadata as Record<string, unknown> | undefined), mode },
          synced_at: new Date().toISOString(),
        })),
      );

      await adminClient.from("multichain_positions").insert(
        positions.map((position) => ({
          creator_id: user.id,
          provider_id: "hydrex",
          chain: position.chain ?? payload.chain ?? "base",
          asset_symbol: position.assetSymbol ?? "HYDX",
          wallet_address: position.walletAddress ?? null,
          balance: position.quantity ?? 0,
          usd_value: position.usdValue ?? 0,
          change_24h: position.change24h ?? null,
          status: "connected",
          metadata: { ...(position.metadata as Record<string, unknown> | undefined), mode },
          synced_at: new Date().toISOString(),
        })),
      );
    }

    if (rewards.length) {
      await adminClient.from("defi_rewards").insert(
        rewards.map((reward) => ({
          creator_id: user.id,
          provider_id: "hydrex",
          reward_symbol: reward.rewardSymbol ?? "oHYDX",
          amount: reward.amount ?? 0,
          usd_value: reward.usdValue ?? 0,
          claimed_at: reward.claimedAt ?? null,
          metadata: reward.metadata ?? {},
        })),
      );
    }

    if (votes.length) {
      await adminClient.from("governance_votes").insert(
        votes.map((vote) => ({
          creator_id: user.id,
          provider_id: "hydrex",
          chain: vote.chain ?? payload.chain ?? "base",
          proposal_id: vote.proposalId ?? crypto.randomUUID(),
          vote_choice: vote.voteChoice ?? "for",
          voting_power: vote.votingPower ?? 0,
          cast_at: vote.castAt ?? new Date().toISOString(),
          metadata: vote.metadata ?? {},
        })),
      );
    }

    return {
      creatorId: user.id,
      subjectType: "defi_position",
      subjectId: null,
      jobType: "hydrex_sync",
      jobStatus: "succeeded",
      eventDomain: "finance",
      eventType: "hydrex_sync_completed",
      response: {
        positionCount: positions.length,
        rewardCount: rewards.length,
        voteCount: votes.length,
      },
    };
  },
});
