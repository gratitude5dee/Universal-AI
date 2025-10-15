import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    console.log('[venue-ai-search] Processing query:', query);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are a venue search AI that generates UI components in real-time with enhanced details.

For each query, analyze and extract:
1. Location (city, neighborhood, region)
2. Capacity range (min-max people)
3. Event type/genre (jazz, rock, comedy, etc.)
4. Date requirements
5. Amenities needed
6. Budget constraints

Return a stream of JSON objects, one per line, in this format:

For filters extracted:
{"type":"filter","filter":"location","value":"San Francisco, CA","confidence":0.95}
{"type":"filter","filter":"capacity","value":{"min":200,"max":500},"confidence":0.9}
{"type":"filter","filter":"genre","value":"Jazz","confidence":0.88}

For venue matches with FULL DETAILS:
{"type":"venue","props":{"id":"1","venueName":"Blue Note Jazz Club","matchScore":95,"reasoning":"Perfect intimate jazz venue with excellent acoustics and professional sound system. Capacity fits your requirement. Located in the heart of SF's music district with easy public transit access.","capacity":300,"price":2500,"amenities":["Sound System","Lighting","Bar","Stage"],"location":"San Francisco, CA","address":"131 W 3rd St","image":"/placeholder.svg","keyFeatures":[{"label":"Professional Acoustics","icon":"music"},{"label":"In-House Sound Tech","icon":"users"},{"label":"Green Room","icon":"star"}],"setupSuggestions":["Stage positioned for optimal sightlines from all seats","Wireless mic system included for crowd interaction","Lighting rig can accommodate custom presets"],"cateringSuggestions":["Full bar service with craft cocktails","Light appetizers and small plates available","Vegan and gluten-free options for backstage"],"costBreakdown":[{"label":"Venue Rental","amount":2500},{"label":"Sound & Lighting","amount":500},{"label":"Staff (4 hours)","amount":800},{"label":"Catering (50 guests)","amount":1200}]},"delay":200}

For suggestions:
{"type":"suggestion","content":"Consider booking on weeknights for 20% lower rates","category":"pricing"}
{"type":"suggestion","content":"SFJAZZ Center also available nearby with 700 capacity","category":"alternative"}

CRITICAL: For each venue, ALWAYS include:
- keyFeatures (3-5 unique selling points)
- setupSuggestions (2-3 practical setup tips)
- cateringSuggestions (2-3 food/beverage options)
- costBreakdown (itemized costs with realistic amounts)

Generate 3-5 venue matches maximum. Make reasoning detailed and specific.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        stream: true,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[venue-ai-search] AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  
                  if (content) {
                    // Send the AI content as SSE
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                  }
                } catch (e) {
                  console.error('[venue-ai-search] Parse error:', e);
                }
              }
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('[venue-ai-search] Stream error:', error);
          controller.error(error);
        }
      },
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
    console.error('[venue-ai-search] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
