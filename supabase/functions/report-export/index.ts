import { serveDomainAction } from "../_shared/domain-workflows.ts";

serveDomainAction({
  handle: async ({ body, adminClient, user }) => {
    if (!user) throw new Error("Authentication is required");

    const payload = body as Record<string, unknown>;
    const reportType = String(payload.reportType ?? "").trim();
    if (!reportType) {
      throw new Error("reportType is required");
    }

    const [platformOverview, rightsRollup, campaignRollup, touringStats, agentSummary] = await Promise.all([
      adminClient.rpc("get_platform_overview"),
      adminClient.rpc("get_rights_rollup"),
      adminClient.rpc("get_campaign_rollup"),
      adminClient.rpc("get_touring_stats_v2"),
      adminClient.rpc("get_agent_install_run_summary"),
    ]);

    const reportPayload = {
      generatedAt: new Date().toISOString(),
      reportType,
      platformOverview: platformOverview.data ?? {},
      rights: rightsRollup.data ?? {},
      marketing: campaignRollup.data ?? {},
      touring: touringStats.data ?? {},
      agents: agentSummary.data ?? {},
    };

    const { data: reportExport, error } = await adminClient
      .from("report_exports")
      .insert({
        creator_id: user.id,
        report_type: reportType,
        status: "generated",
        report_payload: reportPayload,
      })
      .select("id")
      .single();

    if (error || !reportExport) {
      throw new Error(`Failed to create report export: ${error?.message ?? "Unknown error"}`);
    }

    return {
      creatorId: user.id,
      subjectType: "report_export",
      subjectId: reportExport.id as string,
      jobType: "report_export",
      jobStatus: "succeeded",
      eventDomain: "analytics",
      eventType: "report_export_generated",
      response: {
        reportExportId: reportExport.id,
        reportPayload,
      },
    };
  },
});
