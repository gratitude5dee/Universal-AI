import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ResearchRequest {
  query: string;
  context?: string;
  sources?: string[];
  sessionId?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const cerebrasApiKey = Deno.env.get('CEREBRAS_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    if (!cerebrasApiKey) {
      throw new Error('CEREBRAS_API_KEY is not configured');
    }
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase credentials are not configured');
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      throw new Error('Invalid authorization token');
    }

    const { query, context, sources = [], sessionId }: ResearchRequest = await req.json();

    console.log(`Research request - Session: ${sessionId}, Query: ${query.substring(0, 100)}...`);

    const sessionIdentifier = sessionId || `research_${crypto.randomUUID()}`;
    let sessionRecordId: string | null = null;

    const sessionTimestamp = new Date().toISOString();

    const { data: existingSession, error: existingSessionError } = await supabase
      .from('research_sessions')
      .select('id')
      .eq('session_identifier', sessionIdentifier)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingSessionError) {
      console.error('Error loading research session:', existingSessionError);
      throw new Error('Failed to load research session');
    }

    if (existingSession) {
      sessionRecordId = existingSession.id;
    } else {
      const { data: createdSession, error: createSessionError } = await supabase
        .from('research_sessions')
        .insert({
          session_identifier: sessionIdentifier,
          user_id: user.id,
          updated_at: sessionTimestamp,
          last_message_at: sessionTimestamp
        })
        .select('id')
        .single();

      if (createSessionError || !createdSession) {
        console.error('Error creating research session:', createSessionError);
        throw new Error('Failed to create research session');
      }

      sessionRecordId = createdSession.id;
    }

    // Build system prompt for research
    const systemPrompt = `You are an advanced AI research assistant with access to deep knowledge across multiple domains. You excel at:

1. **Comprehensive Analysis**: Providing thorough, well-structured research responses
2. **Source Integration**: Synthesizing information from multiple sources when available
3. **Critical Thinking**: Analyzing information objectively and highlighting key insights
4. **Contextualization**: Connecting findings to broader themes and implications

When responding:
- Provide detailed, research-quality answers
- Structure information clearly with headings and bullet points
- Cite sources when available: ${sources.length > 0 ? sources.join(', ') : 'general knowledge'}
- Highlight key insights and implications
- Suggest related research directions when relevant

Current research context: ${context || 'General research query'}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: query }
    ];

    console.log('Sending request to Cerebras API...');

    const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cerebrasApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.1-70b',
        messages,
        temperature: 0.3,
        max_tokens: 4000,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cerebras API error:', response.status, errorText);
      throw new Error(`Cerebras API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Cerebras API response received successfully');

    const responseTimestamp = new Date().toISOString();

    if (sessionRecordId) {
      const { error: userMessageError } = await supabase
        .from('research_messages')
        .insert({
          session_id: sessionRecordId,
          role: 'user',
          content: query,
          sources: sources.length ? sources : null,
          created_by: user.id,
          created_at: sessionTimestamp
        });

      if (userMessageError) {
        console.error('Error storing user research message:', userMessageError);
        throw new Error('Failed to store research message');
      }

      const { error: assistantMessageError } = await supabase
        .from('research_messages')
        .insert({
          session_id: sessionRecordId,
          role: 'assistant',
          content: data.choices[0].message.content,
          sources: sources.length ? sources : null,
          tokens_used: data.usage?.total_tokens || 0,
          model: 'llama3.1-70b',
          created_by: user.id,
          created_at: responseTimestamp
        });

      if (assistantMessageError) {
        console.error('Error storing assistant research message:', assistantMessageError);
        throw new Error('Failed to store research response');
      }

      const { error: updateSessionError } = await supabase
        .from('research_sessions')
        .update({
          updated_at: responseTimestamp,
          last_message_at: responseTimestamp
        })
        .eq('id', sessionRecordId);

      if (updateSessionError) {
        console.error('Error updating research session timestamps:', updateSessionError);
        throw new Error('Failed to update research session');
      }
    }

    const researchResult = {
      content: data.choices[0].message.content,
      sources: sources,
      sessionId: sessionIdentifier,
      timestamp: responseTimestamp,
      model: 'llama3.1-70b',
      tokensUsed: data.usage?.total_tokens || 0
    };

    return new Response(JSON.stringify(researchResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in cerebras-research function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ 
      error: errorMessage,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});