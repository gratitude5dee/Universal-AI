import { serveDomainAction } from "../_shared/domain-workflows.ts";

serveDomainAction({
  handle: async ({ body, adminClient, user }) => {
    if (!user) throw new Error("Authentication is required");

    const payload = body as Record<string, unknown>;
    const periodStart = String(payload.periodStart ?? new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10));
    const periodEnd = String(payload.periodEnd ?? new Date().toISOString().slice(0, 10));

    const { data: run, error: runError } = await adminClient
      .from("forecast_runs")
      .insert({
        creator_id: user.id,
        run_type: payload.runType ?? "revenue",
        period_start: periodStart,
        period_end: periodEnd,
        status: "processing",
      })
      .select("id")
      .single();

    if (runError || !run) {
      throw new Error(`Failed to create forecast run: ${runError?.message ?? "Unknown error"}`);
    }

    const { data: revenueRows } = await adminClient
      .from("revenue_sources")
      .select("amount, source_type, source_id")
      .eq("creator_id", user.id)
      .gte("occurred_at", periodStart)
      .lte("occurred_at", `${periodEnd}T23:59:59.999Z`);

    const totalRevenue = (revenueRows ?? []).reduce((sum: number, row: { amount?: number }) => {
      return sum + Number(row.amount ?? 0);
    }, 0);
    const monthlyAverage = totalRevenue / 3 || 0;
    const forecastAmount = Number((monthlyAverage * 1.1).toFixed(2));

    if (revenueRows?.length) {
      await adminClient.from("forecast_inputs").insert(
        revenueRows.map((row: { source_type?: string; source_id?: string; amount?: number }) => ({
          creator_id: user.id,
          forecast_run_id: run.id,
          input_type: row.source_type ?? "revenue_source",
          reference_id: row.source_id ?? null,
          amount: row.amount ?? 0,
          metadata: {},
        })),
      );
    }

    await adminClient
      .from("forecast_runs")
      .update({
        status: "completed",
        summary: {
          totalRevenue,
          monthlyAverage,
          forecastAmount,
          sampleCount: revenueRows?.length ?? 0,
        },
        updated_at: new Date().toISOString(),
      })
      .eq("id", run.id)
      .eq("creator_id", user.id);

    return {
      creatorId: user.id,
      subjectType: "forecast_run",
      subjectId: run.id as string,
      jobType: "forecast_refresh",
      jobStatus: "succeeded",
      eventDomain: "finance",
      eventType: "forecast_completed",
      response: {
        forecastRunId: run.id,
        forecastAmount,
        totalRevenue,
      },
    };
  },
});
