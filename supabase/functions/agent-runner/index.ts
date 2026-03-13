import { serveDomainAction } from "../_shared/domain-workflows.ts";

serveDomainAction({
  handle: async ({ body, adminClient, user }) => {
    if (!user) throw new Error("Authentication is required");

    const payload = body as Record<string, unknown>;
    const agentId = String(payload.agentId ?? "").trim();
    if (!agentId) {
      throw new Error("agentId is required");
    }

    const { data: run, error: runError } = await adminClient
      .from("agent_runs")
      .insert({
        creator_id: user.id,
        agent_id: agentId,
        run_status: "running",
        intent: payload.intent ?? null,
        input_payload: payload.inputPayload ?? {},
        started_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (runError || !run) {
      throw new Error(`Failed to create agent run: ${runError?.message ?? "Unknown error"}`);
    }

    const steps = Array.isArray(payload.steps) ? payload.steps as Record<string, unknown>[] : [];
    if (steps.length) {
      await adminClient.from("agent_run_steps").insert(
        steps.map((step, index) => ({
          creator_id: user.id,
          agent_run_id: run.id,
          step_key: step.stepKey ?? `step_${index + 1}`,
          step_order: index,
          status: "succeeded",
          tool_name: step.toolName ?? null,
          metadata: step.metadata ?? {},
        })),
      );
    }

    await adminClient
      .from("agent_runs")
      .update({
        run_status: "succeeded",
        output_payload: payload.outputPayload ?? {},
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", run.id)
      .eq("creator_id", user.id);

    await adminClient.from("agent_activity_log").insert({
      user_id: user.id,
      agent_id: agentId,
      activity_type: "run_completed",
      description: payload.intent ?? "Agent run completed",
      tool_status: "succeeded",
      metadata: payload.outputPayload ?? {},
      completed_at: new Date().toISOString(),
    });

    return {
      creatorId: user.id,
      subjectType: "agent_run",
      subjectId: run.id as string,
      jobType: "agent_runner",
      jobStatus: "succeeded",
      eventDomain: "agents",
      eventType: "agent_run_completed",
      response: {
        agentRunId: run.id,
        stepCount: steps.length,
      },
    };
  },
});
