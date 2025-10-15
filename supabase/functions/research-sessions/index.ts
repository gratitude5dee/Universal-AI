import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "GET") {
      return new Response("Method not allowed", {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase environment not configured");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid authorization token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const sessionIdentifier = url.searchParams.get("sessionId");
    const limit = Number(url.searchParams.get("limit") ?? "10");
    const includeMessages = url.searchParams.get("includeMessages") !== "false";

    if (sessionIdentifier) {
      const { data, error } = await supabase
        .from("research_sessions")
        .select(
          includeMessages
            ? "id, session_identifier, title, updated_at, last_message_at, research_messages(id, role, content, created_at, sources, tokens_used, model)"
            : "id, session_identifier, title, updated_at, last_message_at",
        )
        .eq("session_identifier", sessionIdentifier)
        .eq("user_id", user.id)
        .order("created_at", { foreignTable: "research_messages", ascending: true })
        .maybeSingle();

      if (error) {
        throw error;
      }

      return new Response(JSON.stringify({ session: data ?? null }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: sessions, error: sessionsError } = await supabase
      .from("research_sessions")
      .select("id, session_identifier, title, updated_at, last_message_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(Math.max(1, Math.min(50, limit)));

    if (sessionsError) {
      throw sessionsError;
    }

    return new Response(JSON.stringify({ sessions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("research-sessions error", error);
    const message = error instanceof Error ? error.message : "Unexpected error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

