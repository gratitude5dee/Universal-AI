import { serveDomainAction } from "../_shared/domain-workflows.ts";

serveDomainAction({
  providerEnvNames: ["SOCIAL_API_KEY", "FARCASTER_API_KEY"],
  handle: async ({ body, adminClient, user, mode }) => {
    if (!user) throw new Error("Authentication is required");

    const payload = body as Record<string, unknown>;
    const providerId = String(payload.providerId ?? "").trim();
    const targetType = String(payload.targetType ?? "").trim();

    if (!providerId || !targetType) {
      throw new Error("providerId and targetType are required");
    }

    let campaignId = payload.campaignId ? String(payload.campaignId) : null;
    if (!campaignId) {
      const campaignName = String(payload.name ?? "").trim();
      if (!campaignName) {
        throw new Error("name is required when campaignId is not provided");
      }

      const { data: campaign, error: campaignError } = await adminClient
        .from("marketing_campaigns")
        .insert({
          creator_id: user.id,
          name: campaignName,
          objective: payload.objective ?? null,
          status: "scheduled",
          campaign_metadata: payload.metadata ?? {},
        })
        .select("id")
        .single();

      if (campaignError || !campaign) {
        throw new Error(`Failed to create campaign: ${campaignError?.message ?? "Unknown error"}`);
      }

      campaignId = campaign.id as string;
    }

    const { data: target, error: targetError } = await adminClient
      .from("distribution_targets")
      .insert({
        creator_id: user.id,
        campaign_id: campaignId,
        provider_id: providerId,
        target_type: targetType,
        destination_id: payload.destinationId ?? null,
        status: "active",
        metadata: payload.metadata ?? {},
      })
      .select("id")
      .single();

    if (targetError || !target) {
      throw new Error(`Failed to create distribution target: ${targetError?.message ?? "Unknown error"}`);
    }

    const scheduledFor = payload.scheduledFor
      ? String(payload.scheduledFor)
      : new Date().toISOString();

    const { data: scheduledPost, error: scheduledError } = await adminClient
      .from("scheduled_posts")
      .insert({
        creator_id: user.id,
        campaign_id: campaignId,
        distribution_target_id: target.id,
        content_item_id: payload.contentItemId ?? null,
        copy: payload.copy ?? null,
        scheduled_for: scheduledFor,
        status: "scheduled",
        metadata: {
          ...(payload.metadata as Record<string, unknown> | undefined),
          mode,
        },
      })
      .select("id")
      .single();

    if (scheduledError || !scheduledPost) {
      throw new Error(`Failed to create scheduled post: ${scheduledError?.message ?? "Unknown error"}`);
    }

    if (new Date(scheduledFor).getTime() <= Date.now()) {
      await adminClient.from("published_posts").insert({
        creator_id: user.id,
        scheduled_post_id: scheduledPost.id,
        provider_id: providerId,
        external_post_id: payload.externalPostId ?? null,
        post_url: payload.postUrl ?? null,
        metrics: payload.metrics ?? {},
      });
    }

    return {
      creatorId: user.id,
      subjectType: "marketing_campaign",
      subjectId: campaignId,
      jobType: "campaign_dispatch",
      jobStatus: "queued",
      eventDomain: "marketing",
      eventType: "campaign_dispatch_requested",
      payload: {
        campaignId,
        providerId,
      },
      response: {
        campaignId,
        distributionTargetId: target.id,
        scheduledPostId: scheduledPost.id,
      },
    };
  },
});
