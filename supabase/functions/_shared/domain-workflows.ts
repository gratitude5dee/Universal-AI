import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-signature",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

export type ProviderMode = "mock" | "configured";

export interface DomainActionContext<TBody = Record<string, unknown>> {
  req: Request;
  body: TBody;
  adminClient: any;
  authClient: any;
  user: { id: string } | null;
  mode: ProviderMode;
  correlationId: string;
}

export interface DomainActionResult {
  creatorId?: string | null;
  subjectType?: string;
  subjectId?: string | null;
  jobType?: string | null;
  jobStatus?: "queued" | "processing" | "succeeded" | "failed" | "cancelled" | "needs_review";
  eventDomain?: string;
  eventType?: string;
  payload?: Record<string, unknown>;
  response?: Record<string, unknown>;
}

interface HandlerConfig<TBody> {
  allowUnauthenticated?: boolean;
  providerEnvNames?: string[];
  handle: (context: DomainActionContext<TBody>) => Promise<DomainActionResult>;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function providerMode(envNames: string[] = []): ProviderMode {
  return envNames.some((name) => Boolean(Deno.env.get(name))) ? "configured" : "mock";
}

async function createClients(req: Request, allowUnauthenticated = false) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
    throw new Error("Supabase credentials are not fully configured");
  }

  const authHeader = req.headers.get("Authorization");
  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: authHeader ? { headers: { Authorization: authHeader } } : undefined,
    auth: { persistSession: false },
  });

  const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
    global: {
      headers: {
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        apikey: supabaseServiceRoleKey,
      },
    },
  });

  if (!authHeader) {
    if (allowUnauthenticated) {
      return { authClient, adminClient, user: null };
    }
    throw new Error("Missing authorization header");
  }

  const accessToken = authHeader.replace("Bearer ", "").trim();
  const { data: { user }, error } = await authClient.auth.getUser(accessToken);

  if (error || !user) {
    if (allowUnauthenticated) {
      return { authClient, adminClient, user: null };
    }
    throw new Error("Invalid authorization token");
  }

  return { authClient, adminClient, user };
}

async function insertJob(
  adminClient: any,
  params: {
    creatorId: string;
    jobType: string;
    subjectType: string;
    subjectId?: string | null;
    payload?: Record<string, unknown>;
    status?: DomainActionResult["jobStatus"];
    correlationId: string;
  },
) {
  const { data, error } = await adminClient
    .from("job_queue")
    .insert({
      creator_id: params.creatorId,
      job_type: params.jobType,
      subject_type: params.subjectType,
      subject_id: params.subjectId ?? null,
      payload: params.payload ?? {},
      status: params.status ?? "queued",
      correlation_id: params.correlationId,
    })
    .select("id, status")
    .single();

  if (error) {
    throw new Error(`Failed to insert job_queue row: ${error.message}`);
  }

  return data as { id: string; status: string };
}

async function insertDomainEvent(
  adminClient: any,
  params: {
    creatorId: string;
    domain: string;
    eventType: string;
    subjectType: string;
    subjectId?: string | null;
    jobId?: string | null;
    metadata?: Record<string, unknown>;
  },
) {
  const { error } = await adminClient.from("domain_events").insert({
    creator_id: params.creatorId,
    domain: params.domain,
    event_type: params.eventType,
    subject_type: params.subjectType,
    subject_id: params.subjectId ?? null,
    job_id: params.jobId ?? null,
    metadata: params.metadata ?? {},
  });

  if (error) {
    throw new Error(`Failed to insert domain event: ${error.message}`);
  }
}

async function insertWorkflowFailure(
  adminClient: any,
  params: {
    creatorId?: string | null;
    workflowType: string;
    subjectType: string;
    subjectId?: string | null;
    failureStage: string;
    failureReason: string;
    metadata?: Record<string, unknown>;
  },
) {
  if (!params.creatorId) return;

  await adminClient.from("workflow_failures").insert({
    creator_id: params.creatorId,
    workflow_type: params.workflowType,
    subject_type: params.subjectType,
    subject_id: params.subjectId ?? null,
    failure_stage: params.failureStage,
    failure_reason: params.failureReason,
    metadata: params.metadata ?? {},
  });
}

export function serveDomainAction<TBody = Record<string, unknown>>(
  config: HandlerConfig<TBody>,
) {
  serve(async (req) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    const correlationId =
      req.headers.get("X-Correlation-Id") ??
      crypto.randomUUID().replaceAll("-", "");

    let creatorIdForFailure: string | null | undefined = null;

    try {
      const { authClient, adminClient, user } = await createClients(
        req,
        config.allowUnauthenticated,
      );
      const body =
        req.method === "GET"
          ? Object.fromEntries(new URL(req.url).searchParams.entries())
          : ((await req.json()) as TBody);
      const mode = providerMode(config.providerEnvNames);

      const result = await config.handle({
        req,
        body,
        adminClient,
        authClient,
        user,
        mode,
        correlationId,
      });

      const creatorId = result.creatorId ?? user?.id ?? null;
      creatorIdForFailure = creatorId;

      let jobId: string | null = null;
      if (creatorId && result.jobType && result.subjectType) {
        const job = await insertJob(adminClient, {
          creatorId,
          jobType: result.jobType,
          subjectType: result.subjectType,
          subjectId: result.subjectId ?? null,
          payload: result.payload,
          status: result.jobStatus,
          correlationId,
        });
        jobId = job.id;
      }

      if (creatorId && result.eventDomain && result.eventType && result.subjectType) {
        await insertDomainEvent(adminClient, {
          creatorId,
          domain: result.eventDomain,
          eventType: result.eventType,
          subjectType: result.subjectType,
          subjectId: result.subjectId ?? null,
          jobId,
          metadata: {
            mode,
            ...(result.payload ?? {}),
          },
        });
      }

      return jsonResponse({
        ok: true,
        mode,
        correlationId,
        jobId,
        ...(result.response ?? {}),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      try {
        const { adminClient } = await createClients(req, true);
        await insertWorkflowFailure(adminClient, {
          creatorId: creatorIdForFailure,
          workflowType: "edge_function",
          subjectType: "edge_function",
          subjectId: null,
          failureStage: "request",
          failureReason: message,
          metadata: { correlationId },
        });
      } catch {
        // swallow secondary failure logging
      }

      return jsonResponse(
        { ok: false, error: message, correlationId },
        message.toLowerCase().includes("auth") || message.toLowerCase().includes("authorization")
          ? 401
          : 400,
      );
    }
  });
}

export async function upsertMarketplaceLaunch(
  adminClient: any,
  params: {
    creatorId: string;
    contentItemId?: string | null;
    launchProvider: string;
    chain?: string | null;
    venue?: string | null;
    launchMode?: string | null;
    status?: string | null;
    metadata?: Record<string, unknown>;
  },
) {
  const { data, error } = await adminClient
    .from("asset_launches")
    .insert({
      creator_id: params.creatorId,
      content_item_id: params.contentItemId ?? null,
      launch_provider: params.launchProvider,
      chain: params.chain ?? null,
      venue: params.venue ?? null,
      launch_mode: params.launchMode ?? "marketplace",
      status: params.status ?? "draft",
      metadata: params.metadata ?? {},
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to create asset launch: ${error.message}`);
  }

  return data as { id: string };
}
