import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export class HttpError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError;
}

export function providerMode(envNames: string[]): "mock" | "configured" {
  return envNames.some((name) => Boolean(Deno.env.get(name))) ? "configured" : "mock";
}

export async function createAuthedClient(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    throw new HttpError("Missing authorization header", 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new HttpError("Supabase credentials are not configured", 500);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const accessToken = authHeader.replace("Bearer ", "").trim();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(accessToken);

  if (error || !user) {
    throw new HttpError("Invalid authorization token", 401);
  }

  return { supabase, user };
}

export async function upsertProviderConnection(
  supabase: any,
  params: {
    userId: string;
    providerId: string;
    status: string;
    connectionMetadata?: Record<string, unknown>;
    secretType?: string | null;
  },
) {
  const { error } = await supabase.from("provider_connections").upsert(
    {
      user_id: params.userId,
      provider_id: params.providerId,
      status: params.status,
      secret_type: params.secretType ?? null,
      connection_metadata: params.connectionMetadata ?? {},
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,provider_id" },
  );

  if (error) {
    throw new HttpError(`Failed to persist provider connection: ${error.message}`, 500);
  }
}

export async function insertLaunchJob(
  supabase: any,
  params: {
    creatorId: string;
    launchProvider: "clanker" | "bags" | "bankr";
    walletProvider: "thirdweb_evm" | "solana_wallet_standard" | "crossmint_custodial";
    executionProvider: "thirdweb_engine" | "crossmint" | "bags" | "clanker" | "bankr";
    custodyMode: "external_user" | "delegated_server" | "custodial_agent";
    chain: string;
    walletAddress?: string | null;
    requestPayload?: Record<string, unknown>;
    responsePayload?: Record<string, unknown>;
    status?: string;
  },
) {
  const { data, error } = await supabase
    .from("token_launch_jobs")
    .insert({
      creator_id: params.creatorId,
      launch_provider: params.launchProvider,
      wallet_provider: params.walletProvider,
      execution_provider: params.executionProvider,
      custody_mode: params.custodyMode,
      chain: params.chain,
      wallet_address: params.walletAddress ?? null,
      request_payload: params.requestPayload ?? {},
      response_payload: params.responsePayload ?? {},
      status: params.status ?? "pending",
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new HttpError(`Failed to create launch job: ${error?.message ?? "Unknown error"}`, 500);
  }

  return data.id as string;
}

export async function insertLaunchStep(
  supabase: any,
  params: {
    jobId: string;
    stepKey: string;
    stepOrder: number;
    provider: "thirdweb_engine" | "crossmint" | "bags" | "clanker" | "bankr";
    status?: string;
    metadata?: Record<string, unknown>;
  },
) {
  const { error } = await supabase.from("token_launch_steps").insert({
    job_id: params.jobId,
    step_key: params.stepKey,
    step_order: params.stepOrder,
    provider: params.provider,
    status: params.status ?? "pending",
    metadata: params.metadata ?? {},
  });

  if (error) {
    throw new HttpError(`Failed to create launch step: ${error.message}`, 500);
  }
}
