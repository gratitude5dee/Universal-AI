import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Node {
  id: string;
  data: {
    text: string;
    nodeType: 'system' | 'user' | 'ai';
  };
}

interface RequestBody {
  boardId: string;
  lineage: Node[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('Invalid authorization token');
    }

    // Parse request body
    const { boardId, lineage, model = "llama3.1-8b", temperature = 0.8, maxTokens = 500 }: RequestBody = await req.json();

    // Verify user has access to the board
    const { data: board, error: boardError } = await supabase
      .from('boards')
      .select('id, user_id')
      .eq('id', boardId)
      .maybeSingle();

    if (boardError || !board) {
      throw new Error('Board not found or access denied');
    }

    // Check if user is owner or collaborator
    const { data: collaborator } = await supabase
      .from('board_collaborators')
      .select('id')
      .eq('board_id', boardId)
      .eq('user_id', user.id)
      .eq('status', 'accepted')
      .maybeSingle();

    const hasAccess = board.user_id === user.id || Boolean(collaborator);

    if (!hasAccess) {
      throw new Error('Access denied to this board');
    }

    // Create AI run record
    const { data: aiRun, error: runError } = await supabase
      .from('ai_runs')
      .insert({
        board_id: boardId,
        user_id: user.id,
        prompt: lineage.map(node => `${node.data.nodeType}: ${node.data.text}`).join('\n\n'),
        model: model,
        provider: 'cerebras',
        status: 'running'
      })
      .select()
      .single();

    if (runError) {
      console.error('Error creating AI run:', runError);
      throw new Error('Failed to create AI run record');
    }

    // Build prompt from lineage
    let promptText = "";
    for (const node of lineage) {
      const role = node.data.nodeType === "user" ? "Human" : 
                   node.data.nodeType === "system" ? "System" : "Assistant";
      promptText += `${role}: ${node.data.text}\n\n`;
    }
    promptText += "Assistant: ";

    // Get Cerebras API key
    const CEREBRAS_API_KEY = Deno.env.get('CEREBRAS_API_KEY');
    if (!CEREBRAS_API_KEY) {
      throw new Error('Cerebras API key not configured');
    }

    console.log('Making request to Cerebras API with prompt:', promptText.substring(0, 200) + '...');

    // Make request to Cerebras API
    const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CEREBRAS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: "You are a helpful AI assistant that provides thoughtful, creative responses." },
          { role: "user", content: promptText }
        ],
        max_tokens: maxTokens,
        temperature: temperature,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cerebras API error:', response.status, errorText);
      
      // Update AI run with error
      await supabase
        .from('ai_runs')
        .update({
          status: 'failed',
          error_message: `Cerebras API error: ${response.status} ${errorText}`
        })
        .eq('id', aiRun.id);

      throw new Error(`Cerebras API error: ${response.status}`);
    }

    // Create a transform stream to handle the response
    let hasStartedStreaming = false;

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        let fullResponse = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  // Update AI run as completed
                  await supabase
                    .from('ai_runs')
                    .update({
                      status: 'completed',
                      response: fullResponse,
                      completed_at: new Date().toISOString()
                    })
                    .eq('id', aiRun.id);

                  controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
                  controller.close();
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  if (parsed.choices && parsed.choices[0]?.delta?.content) {
                    const content = parsed.choices[0].delta.content;
                    fullResponse += content;

                    if (!hasStartedStreaming) {
                      hasStartedStreaming = true;
                      await supabase
                        .from('ai_runs')
                        .update({ status: 'streaming' })
                        .eq('id', aiRun.id);
                    }

                    // Forward the chunk to the client
                    controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
                  }
                } catch (e) {
                  console.error('Error parsing chunk:', e);
                }
              }
            }
          }
        } catch (error) {
          console.error('Stream processing error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Stream processing failed';
          
          // Update AI run with error
          await supabase
            .from('ai_runs')
            .update({
              status: 'failed',
              error_message: errorMessage
            })
            .eq('id', aiRun.id);

          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in cerebras-stream function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});