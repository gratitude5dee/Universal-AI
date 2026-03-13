import { ToolContext } from "../types";

export async function invokeEdgeFunction(
  context: ToolContext,
  functionName: string,
  payload: Record<string, unknown>,
  idempotencyKey?: string,
) {
  if (context.config.mode === "mock") {
    return {
      mocked: true,
      functionName,
      payload,
    };
  }

  const headers: Record<string, string> = {
    "X-Correlation-Id": context.correlationId,
  };

  if (context.config.supabase.functionJwt) {
    headers.Authorization = `Bearer ${context.config.supabase.functionJwt}`;
  } else if (context.config.supabase.serviceRoleKey) {
    headers.apikey = context.config.supabase.serviceRoleKey;
  } else if (context.config.supabase.anonKey) {
    headers.apikey = context.config.supabase.anonKey;
  }

  if (idempotencyKey) {
    headers["Idempotency-Key"] = idempotencyKey;
  }

  const { data, error } = await context.supabase.functions.invoke(functionName, {
    body: payload,
    headers,
  });

  if (error) {
    throw new Error(`Supabase function ${functionName} failed: ${error.message}`);
  }

  return data;
}

export async function invokeRpcFunction(
  context: ToolContext,
  rpcName: string,
  payload: Record<string, unknown>,
) {
  if (context.config.mode === "mock") {
    return {
      mocked: true,
      rpcName,
      payload,
    };
  }

  const { data, error } = await context.supabase.rpc(rpcName, payload);
  if (error) {
    throw new Error(`Supabase RPC ${rpcName} failed: ${error.message}`);
  }
  return data;
}
