import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VoiceClone {
  voice_id: string;
  name: string;
  description?: string;
  category: string;
  labels: Record<string, string>;
  samples: Array<{
    sample_id: string;
    file_name: string;
    mime_type: string;
    size_bytes: number;
    hash: string;
  }>;
  settings?: {
    stability: number;
    similarity_boost: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
}

interface StoredVoiceClone {
  voice_id: string;
  metadata: Record<string, unknown> | null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({
        error: 'Unauthorized',
        success: false,
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase environment variables are not configured');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({
        error: 'Unauthorized',
        success: false,
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const elevenlabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!elevenlabsApiKey) {
      throw new Error('ELEVENLABS_API_KEY is not configured');
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'list';

    switch (action) {
      case 'list': {
        const { data: storedVoices, error: storageError } = await supabaseClient
          .from('voice_clones')
          .select('voice_id, metadata')
          .eq('user_id', user.id);

        if (storageError) {
          throw new Error(`Failed to load stored voices: ${storageError.message}`);
        }

        const ownedVoices = (storedVoices ?? []) as StoredVoiceClone[];

        if (ownedVoices.length === 0) {
          return new Response(JSON.stringify({
            voices: [],
            success: true,
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const voiceIds = new Set(ownedVoices.map((record) => record.voice_id));
        const fallbackMetadata = new Map<string, Record<string, unknown>>(
          ownedVoices.map((record) => [record.voice_id, (record.metadata ?? {}) as Record<string, unknown>]),
        );

        let elevenLabsVoices: VoiceClone[] = [];
        try {
          const response = await fetch('https://api.elevenlabs.io/v1/voices', {
            headers: {
              'xi-api-key': elevenlabsApiKey,
            },
          });

          if (response.ok) {
            const data = await response.json();
            const availableVoices = Array.isArray(data.voices) ? data.voices : [];
            elevenLabsVoices = availableVoices.filter((voice: VoiceClone) =>
              voiceIds.has(voice.voice_id)
            );
          } else {
            console.warn('Failed to fetch voices from ElevenLabs:', response.status);
          }
        } catch (voiceError) {
          console.warn('Error retrieving ElevenLabs voices:', voiceError);
        }

        const voices = Array.from(voiceIds).map((voiceId) => {
          const match = elevenLabsVoices.find((voice) => voice.voice_id === voiceId);
          if (match) {
            return match;
          }

          const metadata = fallbackMetadata.get(voiceId);
          const labelsValue = metadata?.labels;
          const labels =
            labelsValue && typeof labelsValue === 'object' && !Array.isArray(labelsValue)
              ? labelsValue as Record<string, string>
              : {};

          return {
            voice_id: voiceId,
            name: typeof metadata?.name === 'string' ? metadata.name : 'Custom Voice',
            description: typeof metadata?.description === 'string' ? metadata.description : undefined,
            category: typeof metadata?.category === 'string' ? metadata.category : 'cloned',
            labels,
            samples: [],
            settings: undefined,
          } as VoiceClone;
        });

        return new Response(JSON.stringify({
          voices,
          success: true,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'clone': {
        // Clone a voice from audio samples
        const formData = await req.formData();
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const files = formData.getAll('files') as File[];

        if (!name || files.length === 0) {
          throw new Error('Name and at least one audio file are required');
        }

        const cloneFormData = new FormData();
        cloneFormData.append('name', name);
        if (description) cloneFormData.append('description', description);
        
        files.forEach((file, index) => {
          cloneFormData.append('files', file, `sample_${index}.mp3`);
        });

        const cloneResponse = await fetch('https://api.elevenlabs.io/v1/voices/add', {
          method: 'POST',
          headers: {
            'xi-api-key': elevenlabsApiKey,
          },
          body: cloneFormData,
        });

        if (!cloneResponse.ok) {
          const errorText = await cloneResponse.text();
          throw new Error(`Voice cloning failed: ${errorText}`);
        }

        const cloneResult = await cloneResponse.json();
        console.log('Voice cloned successfully:', cloneResult.voice_id);

        const metadata = {
          name,
          description,
          cloneResult,
        };

        const { error: insertError } = await supabaseClient
          .from('voice_clones')
          .insert({
            user_id: user.id,
            voice_id: cloneResult.voice_id,
            metadata,
          });

        if (insertError) {
          console.error('Failed to store voice clone metadata:', insertError.message);

          try {
            await fetch(`https://api.elevenlabs.io/v1/voices/${cloneResult.voice_id}`, {
              method: 'DELETE',
              headers: {
                'xi-api-key': elevenlabsApiKey,
              },
            });
          } catch (cleanupError) {
            console.error('Failed to clean up ElevenLabs voice after insert error:', cleanupError);
          }

          throw new Error('Failed to store voice metadata for cloned voice');
        }

        return new Response(JSON.stringify({
          voice_id: cloneResult.voice_id,
          success: true,
          message: 'Voice cloned successfully',
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'delete': {
        // Delete a voice
        const { voice_id } = await req.json();

        if (!voice_id) {
          throw new Error('Voice ID is required');
        }

        const { data: existingVoice, error: voiceLookupError } = await supabaseClient
          .from('voice_clones')
          .select('id')
          .eq('voice_id', voice_id)
          .eq('user_id', user.id)
          .maybeSingle();

        if (voiceLookupError) {
          throw new Error(`Failed to verify voice ownership: ${voiceLookupError.message}`);
        }

        if (!existingVoice) {
          return new Response(JSON.stringify({
            error: 'Voice not found or not owned by user',
            success: false,
          }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const deleteResponse = await fetch(`https://api.elevenlabs.io/v1/voices/${voice_id}`, {
          method: 'DELETE',
          headers: {
            'xi-api-key': elevenlabsApiKey,
          },
        });

        if (!deleteResponse.ok) {
          throw new Error(`Failed to delete voice: ${deleteResponse.status}`);
        }

        console.log('Voice deleted successfully:', voice_id);

        const { error: removeError } = await supabaseClient
          .from('voice_clones')
          .delete()
          .eq('voice_id', voice_id)
          .eq('user_id', user.id);

        if (removeError) {
          console.error('Failed to remove stored voice metadata:', removeError.message);
        }

        return new Response(JSON.stringify({
          success: true,
          message: 'Voice deleted successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in voice-management function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});