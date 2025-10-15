import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const authHeader = req.headers.get('Authorization');

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase environment not configured');
    }
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'GET') {
      const url = new URL(req.url);
      const sessionIdentifier = url.searchParams.get('sessionIdentifier');

      const { data: sessions, error: sessionsError } = await supabase
        .from('research_sessions')
        .select('id, session_identifier, title, updated_at, last_message_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(50);

      if (sessionsError) {
        throw sessionsError;
      }

      let activeSession: Record<string, unknown> | null = null;
      let messages: Array<Record<string, unknown>> = [];

      if (sessionIdentifier) {
        const { data: sessionRecord, error: sessionError } = await supabase
          .from('research_sessions')
          .select('id, session_identifier, title, updated_at, last_message_at')
          .eq('session_identifier', sessionIdentifier)
          .eq('user_id', user.id)
          .maybeSingle();

        if (sessionError) {
          throw sessionError;
        }

        if (!sessionRecord) {
          return new Response(
            JSON.stringify({ sessions: sessions ?? [], activeSession: null, messages: [] }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
          );
        }

        activeSession = sessionRecord;

        const { data: sessionMessages, error: messagesError } = await supabase
          .from('research_messages')
          .select('id, role, content, sources, tokens_used, model, created_at')
          .eq('session_id', sessionRecord.id)
          .order('created_at', { ascending: true });

        if (messagesError) {
          throw messagesError;
        }

        messages = sessionMessages ?? [];
      }

      return new Response(
        JSON.stringify({
          sessions: sessions ?? [],
          activeSession,
          messages,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
