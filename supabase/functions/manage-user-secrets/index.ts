import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const encryptionKeyBase64 = Deno.env.get('USER_SECRETS_ENCRYPTION_KEY');
let cryptoKeyPromise: Promise<CryptoKey> | null = null;

const base64ToArrayBuffer = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
};

const getCryptoKey = () => {
  if (!encryptionKeyBase64) {
    throw new Error('USER_SECRETS_ENCRYPTION_KEY is not configured');
  }
  if (!cryptoKeyPromise) {
    const rawKey = base64ToArrayBuffer(encryptionKeyBase64);
    cryptoKeyPromise = crypto.subtle.importKey(
      'raw',
      rawKey,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt'],
    );
  }
  return cryptoKeyPromise;
};

const encryptSecret = async (value: string) => {
  const key = await getCryptoKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(value);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  return `${arrayBufferToBase64(iv.buffer)}:${arrayBufferToBase64(ciphertext)}`;
};

const decryptSecret = async (payload: string) => {
  const [ivPart, cipherPart] = payload.split(':');
  if (!ivPart || !cipherPart) {
    throw new Error('Invalid secret payload');
  }
  const key = await getCryptoKey();
  const ivBuffer = base64ToArrayBuffer(ivPart);
  const cipherBuffer = base64ToArrayBuffer(cipherPart);
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(ivBuffer) },
    key,
    cipherBuffer,
  );
  return new TextDecoder().decode(plaintext);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    const supabaseClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { method } = req;
    const body = method !== 'GET' && method !== 'DELETE' ? await req.json() : null;

    switch (method) {
      case 'GET': {
        const url = new URL(req.url);
        const secretType = url.searchParams.get('secretType');
        const decrypt = url.searchParams.get('decrypt') === 'true';

        if (secretType && decrypt) {
          const { data, error } = await serviceClient
            .from('user_secrets')
            .select('secret_type, encrypted_value, created_at, updated_at')
            .eq('user_id', user.id)
            .eq('secret_type', secretType)
            .maybeSingle();

          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              }
            );
          }

          if (!data) {
            return new Response(
              JSON.stringify({ secret_type: secretType, value: null }),
              {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              }
            );
          }

          const value = await decryptSecret(data.encrypted_value);
          return new Response(
            JSON.stringify({
              secret_type: data.secret_type,
              value,
              created_at: data.created_at,
              updated_at: data.updated_at,
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // Retrieve user secrets metadata only
        const { data, error } = await serviceClient
          .from('user_secrets')
          .select('secret_type, created_at, updated_at')
          .eq('user_id', user.id);

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        const secrets = await Promise.all(
          (data ?? []).map(async (item) => ({
            secret_type: item.secret_type,
            created_at: item.created_at,
            updated_at: item.updated_at,
            value: await decryptValue(item.ciphertext, item.nonce),
            hasValue: Boolean(item.ciphertext && item.nonce),
          }))
        )

        return new Response(
          JSON.stringify(data),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      case 'POST': {
        // Create or update a secret
        const { secret_type, value } = body ?? {};

        if (!secret_type || !value) {
          return new Response(
            JSON.stringify({ error: 'secret_type and value are required' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        const encrypted_value = await encryptSecret(value);

        const { error } = await serviceClient
          .from('user_secrets')
          .upsert({
            user_id: user.id,
            secret_type,
            ciphertext,
            nonce
          }, {
            onConflict: 'user_id,secret_type'
          });

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        return new Response(
          JSON.stringify({ success: true }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      case 'DELETE': {
        const requestBody = method === 'DELETE' ? await req.json().catch(() => null) : null;
        const secret_type = requestBody?.secret_type;

        if (!secret_type) {
          return new Response(
            JSON.stringify({ error: 'secret_type is required' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        const { error } = await serviceClient
          .from('user_secrets')
          .delete()
          .eq('user_id', user.id)
          .eq('secret_type', secret_type);

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        return new Response(
          JSON.stringify({ success: true }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
