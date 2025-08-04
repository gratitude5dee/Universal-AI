import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const cerebrasApiKey = Deno.env.get('CEREBRAS_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { boardId, prompt, aiProvider = 'openai', model = 'gpt-4o-mini' } = await req.json();

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid token');
    }

    // Verify user has access to board
    const { data: boardAccess, error: accessError } = await supabase
      .from('boards')
      .select('id, user_id')
      .eq('id', boardId)
      .single();

    if (accessError || !boardAccess) {
      throw new Error('Board not found');
    }

    // Check if user owns board or is a collaborator
    if (boardAccess.user_id !== user.id) {
      const { data: collaborator } = await supabase
        .from('board_collaborators')
        .select('id')
        .eq('board_id', boardId)
        .eq('user_id', user.id)
        .eq('status', 'accepted')
        .single();

      if (!collaborator) {
        throw new Error('Access denied');
      }
    }

    // Create AI run record
    const { data: aiRun, error: runError } = await supabase
      .from('ai_runs')
      .insert({
        board_id: boardId,
        user_id: user.id,
        prompt,
        provider: aiProvider,
        model,
        status: 'running'
      })
      .select()
      .single();

    if (runError) {
      throw new Error('Failed to create AI run');
    }

    let apiKey, apiUrl, requestBody;

    if (aiProvider === 'openai') {
      if (!openAIApiKey) {
        throw new Error('OpenAI API key not configured');
      }
      apiKey = openAIApiKey;
      apiUrl = 'https://api.openai.com/v1/chat/completions';
      requestBody = {
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a creative AI assistant helping with canvas-based creative projects. Provide creative, actionable, and inspiring responses.'
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.7
      };
    } else if (aiProvider === 'cerebras') {
      if (!cerebrasApiKey) {
        throw new Error('Cerebras API key not configured');
      }
      apiKey = cerebrasApiKey;
      apiUrl = 'https://api.cerebras.ai/v1/chat/completions';
      requestBody = {
        model: 'llama3.1-70b',
        messages: [
          {
            role: 'system',
            content: 'You are a creative AI assistant helping with canvas-based creative projects. Provide creative, actionable, and inspiring responses.'
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.7
      };
    } else {
      throw new Error('Unsupported AI provider');
    }

    // Make API request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`AI API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    // Update AI run with results
    const { error: updateError } = await supabase
      .from('ai_runs')
      .update({
        response: generatedContent,
        status: 'completed',
        tokens_used: data.usage?.total_tokens || 0,
        completed_at: new Date().toISOString()
      })
      .eq('id', aiRun.id);

    if (updateError) {
      console.error('Failed to update AI run:', updateError);
    }

    return new Response(JSON.stringify({
      success: true,
      runId: aiRun.id,
      response: generatedContent,
      tokensUsed: data.usage?.total_tokens || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in canvas-ai-integration:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});