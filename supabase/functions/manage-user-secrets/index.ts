import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import sodium from 'https://esm.sh/libsodium-wrappers@0.7.13';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const encryptionKeyBase64 = Deno.env.get('USER_SECRETS_ENCRYPTION_KEY') ?? '';

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  throw new Error('Supabase environment variables are not fully configured for manage-user-secrets');
}

if (!encryptionKeyBase64) {
  throw new Error('USER_SECRETS_ENCRYPTION_KEY is not configured');
}

await sodium.ready;
const encryptionKey = sodium.from_base64(encryptionKeyBase64, sodium.base64_variants.ORIGINAL);
if (encryptionKey.length !== sodium.crypto_secretbox_KEYBYTES) {
  throw new Error('USER_SECRETS_ENCRYPTION_KEY must be a 32-byte key encoded in base64');
}

const encryptSecret = (value: string) => {
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const ciphertext = sodium.crypto_secretbox_easy(value, nonce, encryptionKey);
  return {
    ciphertext: sodium.to_base64(ciphertext, sodium.base64_variants.ORIGINAL),
    nonce: sodium.to_base64(nonce, sodium.base64_variants.ORIGINAL),
  };
};

const decryptSecret = (ciphertextBase64: string, nonceBase64: string) => {
  const ciphertext = sodium.from_base64(ciphertextBase64, sodium.base64_variants.ORIGINAL);
  const nonce = sodium.from_base64(nonceBase64, sodium.base64_variants.ORIGINAL);
  const decrypted = sodium.crypto_secretbox_open_easy(ciphertext, nonce, encryptionKey);
  return sodium.to_string(decrypted);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '').trim();

    const serviceClient = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { data: { user }, error: authError } = await serviceClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { method } = req;
    const body = method !== 'GET' ? await req.json() : null;

    switch (method) {
      case 'GET': {
        const { data, error } = await serviceClient
          .from('user_secrets')
          .select('secret_type, created_at, updated_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'POST': {
        const action = body?.action as 'store' | 'retrieve';

        if (action === 'store') {
          const secretType = body?.secret_type;
          const secretValue = body?.secret_value;

          if (!secretType || typeof secretValue !== 'string') {
            return new Response(JSON.stringify({ error: 'secret_type and secret_value are required' }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }

          const { ciphertext, nonce } = encryptSecret(secretValue);

          const { error } = await serviceClient
            .from('user_secrets')
            .upsert({
              user_id: user.id,
              secret_type: secretType,
              encrypted_value: ciphertext,
              nonce,
            }, {
              onConflict: 'user_id,secret_type'
            });

          if (error) {
            return new Response(JSON.stringify({ error: error.message }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }

          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        if (action === 'retrieve') {
          const secretType = body?.secret_type;

          if (!secretType) {
            return new Response(JSON.stringify({ error: 'secret_type is required' }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }

          const { data: record, error } = await serviceClient
            .from('user_secrets')
            .select('encrypted_value, nonce')
            .eq('user_id', user.id)
            .eq('secret_type', secretType)
            .maybeSingle();

          if (error) {
            return new Response(JSON.stringify({ error: error.message }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }

          if (!record) {
            return new Response(JSON.stringify({ secret: null }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }

          if (!record.nonce) {
            // Legacy plaintext entry – treat encrypted_value as plaintext and re-encrypt
            const { ciphertext, nonce } = encryptSecret(record.encrypted_value);
            await serviceClient
              .from('user_secrets')
              .update({ encrypted_value: ciphertext, nonce })
              .eq('user_id', user.id)
              .eq('secret_type', secretType);

            return new Response(JSON.stringify({ secret: record.encrypted_value }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }

          const decrypted = decryptSecret(record.encrypted_value, record.nonce);

          return new Response(JSON.stringify({ secret: decrypted }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify({ error: 'Unsupported action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'DELETE': {
        const secretType = body?.secret_type;

        if (!secretType) {
          return new Response(JSON.stringify({ error: 'secret_type is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const { error } = await serviceClient
          .from('user_secrets')
          .delete()
          .eq('user_id', user.id)
          .eq('secret_type', secretType);

        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
