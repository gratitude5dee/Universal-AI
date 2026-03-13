import { serveDomainAction } from "../_shared/domain-workflows.ts";

serveDomainAction({
  providerEnvNames: ["BRIDGE_PROVIDER_API_KEY"],
  handle: async ({ body, adminClient, user, mode }) => {
    if (!user) throw new Error("Authentication is required");

    const payload = body as Record<string, unknown>;
    const sourceChain = String(payload.sourceChain ?? "").trim();
    const destinationChain = String(payload.destinationChain ?? "").trim();
    const destinationWallet = String(payload.destinationWallet ?? "").trim();
    const sourceAssetType = String(payload.sourceAssetType ?? "").trim();

    if (!sourceChain || !destinationChain || !destinationWallet || !sourceAssetType) {
      throw new Error("sourceChain, destinationChain, destinationWallet, and sourceAssetType are required");
    }

    const bridgeProvider = String(payload.bridgeProvider ?? "wormhole");
    const { data: route, error: routeError } = await adminClient
      .from("bridge_routes")
      .upsert({
        source_chain: sourceChain,
        destination_chain: destinationChain,
        bridge_provider: bridgeProvider,
        status: "active",
        metadata: { mode },
      }, {
        onConflict: "source_chain,destination_chain,bridge_provider",
      })
      .select("id")
      .single();

    if (routeError || !route) {
      throw new Error(`Failed to resolve bridge route: ${routeError?.message ?? "Unknown error"}`);
    }

    const { data, error } = await adminClient
      .from("bridge_jobs")
      .insert({
        creator_id: user.id,
        bridge_route_id: route.id,
        content_item_id: payload.contentItemId ?? null,
        asset_mint_id: payload.assetMintId ?? null,
        source_asset_type: sourceAssetType,
        source_identifier: payload.sourceIdentifier ?? null,
        source_chain: sourceChain,
        destination_chain: destinationChain,
        destination_wallet: destinationWallet,
        status: "queued",
        estimated_fee_usd: payload.estimatedFeeUsd ?? 0,
        metadata: payload.metadata ?? {},
      })
      .select("id")
      .single();

    if (error || !data) {
      throw new Error(`Failed to queue bridge job: ${error?.message ?? "Unknown error"}`);
    }

    return {
      creatorId: user.id,
      subjectType: "bridge_job",
      subjectId: data.id as string,
      jobType: "bridge_execute",
      jobStatus: "queued",
      eventDomain: "launch",
      eventType: "bridge_execute_requested",
      payload: {
        sourceChain,
        destinationChain,
        bridgeProvider,
      },
      response: {
        bridgeJobId: data.id,
        routeId: route.id,
      },
    };
  },
});
