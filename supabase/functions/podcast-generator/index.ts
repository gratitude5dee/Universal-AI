import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PodcastRequest {
  title: string;
  description: string;
  script: string;
  voiceId: string;
  duration?: number;
  style?: 'conversational' | 'news' | 'storytelling' | 'educational';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const elevenlabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    const cerebrasApiKey = Deno.env.get('CEREBRAS_API_KEY');
    
    if (!elevenlabsApiKey || !cerebrasApiKey) {
      throw new Error('API keys not configured');
    }

    const { title, description, script, voiceId, style = 'conversational' }: PodcastRequest = await req.json();

    if (!title || !script || !voiceId) {
      throw new Error('Title, script, and voice ID are required');
    }

    console.log(`Generating podcast: ${title} with voice ${voiceId}`);

    // Enhance script with AI if needed
    let enhancedScript = script;
    
    if (script.length < 200) {
      console.log('Enhancing short script with AI...');
      
      const scriptResponse = await fetch('https://api.cerebras.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cerebrasApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3.1-70b',
          messages: [
            {
              role: 'system',
              content: `You are a professional podcast script writer. Create engaging, natural-sounding podcast content in a ${style} style. Make it sound conversational and authentic.`
            },
            {
              role: 'user',
              content: `Expand this podcast script about "${title}": ${script}\n\nDescription: ${description}\n\nMake it a comprehensive 3-5 minute podcast episode with natural speech patterns, appropriate pauses, and engaging content.`
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (scriptResponse.ok) {
        const scriptData = await scriptResponse.json();
        enhancedScript = scriptData.choices[0].message.content;
        console.log('Script enhanced successfully');
      }
    }

    // Generate audio with ElevenLabs
    console.log('Generating audio with ElevenLabs...');
    
    const audioResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': elevenlabsApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: enhancedScript,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true,
        },
      }),
    });

    if (!audioResponse.ok) {
      const errorText = await audioResponse.text();
      throw new Error(`Audio generation failed: ${errorText}`);
    }

    // Convert audio to base64
    const audioBuffer = await audioResponse.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

    console.log('Podcast generated successfully');

    const podcastData = {
      id: `podcast_${Date.now()}`,
      title,
      description,
      script: enhancedScript,
      audioContent: base64Audio,
      voiceId,
      style,
      duration: Math.ceil(enhancedScript.length / 150), // Rough estimate: 150 chars per minute
      generatedAt: new Date().toISOString(),
      size: audioBuffer.byteLength,
    };

    return new Response(JSON.stringify(podcastData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in podcast-generator function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});