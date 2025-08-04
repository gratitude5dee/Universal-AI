import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    if (!cerebrasApiKey) {
      throw new Error('CEREBRAS_API_KEY is not configured');
    }

    const { query, context, sources = [], sessionId }: ResearchRequest = await req.json();
    
    console.log(`Research request - Session: ${sessionId}, Query: ${query.substring(0, 100)}...`);

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

    const researchResult = {
      content: data.choices[0].message.content,
      sources: sources,
      sessionId: sessionId,
      timestamp: new Date().toISOString(),
      model: 'llama3.1-70b',
      tokensUsed: data.usage?.total_tokens || 0
    };

    return new Response(JSON.stringify(researchResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in cerebras-research function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});