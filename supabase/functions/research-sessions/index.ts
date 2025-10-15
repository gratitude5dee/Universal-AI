import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are not configured for research-sessions');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '').trim();

    const supabaseAdmin = supabaseServiceRoleKey
      ? createClient(supabaseUrl, supabaseServiceRoleKey)
      : null;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = supabaseAdmin
      ? await supabaseAdmin.auth.getUser(token)
      : await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(req.url);
    const sessionIdentifier = url.searchParams.get('sessionId');

    if (!sessionIdentifier) {
      const { data: sessions, error: sessionsError } = await supabase
        .from('research_sessions')
        .select('id, session_identifier, updated_at, last_message_at')
        .order('updated_at', { ascending: false });

      if (sessionsError) {
        console.error('[research-sessions] Failed to load sessions', sessionsError);
        throw new Error('Failed to load research sessions');
      }

      return new Response(JSON.stringify({ sessions }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: session, error: sessionError } = await supabase
      .from('research_sessions')
      .select('id, session_identifier, updated_at, last_message_at')
      .eq('session_identifier', sessionIdentifier)
      .maybeSingle();

    if (sessionError) {
      console.error('[research-sessions] Failed to load session', sessionError);
      throw new Error('Failed to load research session');
    }

    if (!session) {
      return new Response(JSON.stringify({ session: null, messages: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: messages, error: messagesError } = await supabase
      .from('research_messages')
      .select('id, role, content, sources, tokens_used, model, created_at')
      .eq('session_id', session.id)
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error('[research-sessions] Failed to load messages', messagesError);
      throw new Error('Failed to load research messages');
    }

    return new Response(JSON.stringify({ session, messages }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[research-sessions] Error', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
