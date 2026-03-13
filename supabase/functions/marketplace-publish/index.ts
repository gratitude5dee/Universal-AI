import { serveDomainAction, upsertMarketplaceLaunch } from "../_shared/domain-workflows.ts";

serveDomainAction({
  providerEnvNames: ["MARKETPLACE_API_KEY"],
  handle: async ({ body, adminClient, user, mode }) => {
    if (!user) throw new Error("Authentication is required");

    const payload = body as Record<string, unknown>;
    const marketplace = String(payload.marketplace ?? "").trim();
    if (!marketplace) {
      throw new Error("marketplace is required");
    }

    let launchId = payload.launchId ? String(payload.launchId) : null;
    if (!launchId) {
      const launch = await upsertMarketplaceLaunch(adminClient, {
        creatorId: user.id,
        contentItemId: payload.contentItemId ? String(payload.contentItemId) : null,
        launchProvider: marketplace,
        chain: payload.chain ? String(payload.chain) : null,
        venue: payload.venue ? String(payload.venue) : null,
        launchMode: "marketplace",
        status: "published",
        metadata: payload.metadata as Record<string, unknown> | undefined,
      });
      launchId = launch.id;
    } else {
      const { error: launchError } = await adminClient
        .from("asset_launches")
        .update({
          status: "published",
          venue: payload.venue ?? null,
          launched_at: new Date().toISOString(),
          metadata: payload.metadata ?? {},
        })
        .eq("id", launchId)
        .eq("creator_id", user.id);

      if (launchError) {
        throw new Error(`Failed to update asset launch: ${launchError.message}`);
      }
    }

    const { data: listing, error: listingError } = await adminClient
      .from("marketplace_listings")
      .insert({
        creator_id: user.id,
        content_item_id: payload.contentItemId ?? null,
        asset_launch_id: launchId,
        marketplace,
        listing_status: "live",
        price_amount: payload.priceAmount ?? 0,
        currency: payload.currency ?? "USD",
        visibility: payload.visibility ?? "global",
        metadata: {
          ...(payload.metadata as Record<string, unknown> | undefined),
          mode,
        },
      })
      .select("id")
      .single();

    if (listingError || !listing) {
      throw new Error(`Failed to create marketplace listing: ${listingError?.message ?? "Unknown error"}`);
    }

    const { data: publication, error: publicationError } = await adminClient
      .from("marketplace_publications")
      .insert({
        creator_id: user.id,
        marketplace_listing_id: listing.id,
        publication_status: "published",
        url: payload.url ?? null,
        external_id: payload.externalId ?? null,
        published_at: new Date().toISOString(),
        metadata: payload.metadata ?? {},
      })
      .select("id")
      .single();

    if (publicationError || !publication) {
      throw new Error(`Failed to create marketplace publication: ${publicationError?.message ?? "Unknown error"}`);
    }

    await adminClient.from("launch_engagement_snapshots").upsert({
      creator_id: user.id,
      asset_launch_id: launchId,
      metric_date: new Date().toISOString().slice(0, 10),
      views: payload.views ?? 0,
      likes: payload.likes ?? 0,
      comments: payload.comments ?? 0,
      shares: payload.shares ?? 0,
      revenue_amount: payload.revenueAmount ?? 0,
      metadata: payload.metadata ?? {},
    }, {
      onConflict: "asset_launch_id,metric_date",
    });

    return {
      creatorId: user.id,
      subjectType: "asset_launch",
      subjectId: launchId,
      jobType: "marketplace_publish",
      jobStatus: "queued",
      eventDomain: "launch",
      eventType: "marketplace_publish_requested",
      payload: {
        launchId,
        marketplace,
      },
      response: {
        launchId,
        listingId: listing.id,
        publicationId: publication.id,
      },
    };
  },
});
