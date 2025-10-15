import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase credentials are not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const accessToken = authHeader.replace('Bearer ', '').trim();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authorization token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(req.url);
    const sessionIdentifier = url.searchParams.get('session_identifier');
    const includeMessages = url.searchParams.get('include_messages') === 'true';

    if (sessionIdentifier) {
      const { data: session, error: sessionError } = await supabase
        .from('research_sessions')
        .select('id, session_identifier, title, created_at, updated_at, last_message_at')
        .eq('session_identifier', sessionIdentifier)
        .eq('user_id', user.id)
        .maybeSingle();

      if (sessionError) {
        throw sessionError;
      }

      if (!session) {
        return new Response(JSON.stringify({ error: 'Session not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      let messages: Array<Record<string, unknown>> = [];
      if (includeMessages) {
        const { data: messageData, error: messagesError } = await supabase
          .from('research_messages')
          .select('id, role, content, sources, tokens_used, model, created_at')
          .eq('session_id', session.id)
          .order('created_at', { ascending: true });

        if (messagesError) {
          throw messagesError;
        }
        messages = messageData ?? [];
      }

      return new Response(JSON.stringify({ session, messages }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: sessions, error: sessionsError } = await supabase
      .from('research_sessions')
      .select('id, session_identifier, title, created_at, updated_at, last_message_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(50);

    if (sessionsError) {
      throw sessionsError;
    }

    return new Response(JSON.stringify({ sessions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[research-sessions] Error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
