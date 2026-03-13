import { serveDomainAction } from "../_shared/domain-workflows.ts";

serveDomainAction({
  handle: async ({ body, adminClient, user }) => {
    if (!user) throw new Error("Authentication is required");

    const payload = body as Record<string, unknown>;
    const { data, error } = await adminClient
      .from("agent_installs")
      .insert({
        creator_id: user.id,
        agent_id: payload.agentId ?? null,
        agent_template_id: payload.agentTemplateId ?? null,
        marketplace_listing_id: payload.marketplaceListingId ?? null,
        install_status: "installed",
        metadata: payload.metadata ?? {},
      })
      .select("id")
      .single();

    if (error || !data) {
      throw new Error(`Failed to install marketplace agent: ${error?.message ?? "Unknown error"}`);
    }

    return {
      creatorId: user.id,
      subjectType: "agent_install",
      subjectId: data.id as string,
      jobType: "agent_marketplace_install",
      jobStatus: "succeeded",
      eventDomain: "agents",
      eventType: "agent_marketplace_installed",
      response: {
        agentInstallId: data.id,
      },
    };
  },
});
