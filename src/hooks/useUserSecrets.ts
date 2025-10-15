import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserSecretMeta {
  secret_type: string;
  created_at: string;
  updated_at: string;
}

export const useUserSecrets = () => {
  const [secrets, setSecrets] = useState<UserSecretMeta[]>([]);
  const [secretValues, setSecretValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const callSecretsFunction = async <T>(method: 'GET' | 'POST' | 'DELETE', body?: Record<string, unknown>): Promise<T> => {
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    if (!accessToken) {
      throw new Error('User session not found');
    }

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-user-secrets`, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: method === 'GET' ? undefined : JSON.stringify(body ?? {}),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to interact with secrets API');
    }

    return (await response.json()) as T;
  };

  const fetchSecrets = async () => {
    try {
      setLoading(true);
      const data = await callSecretsFunction<UserSecretMeta[]>('GET');
      setSecrets(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getSecret = async (secretType: string): Promise<string | null> => {
    if (secretValues[secretType]) {
      return secretValues[secretType];
    }

    try {
      const result = await callSecretsFunction<{ secret: string | null }>('POST', {
        action: 'retrieve',
        secret_type: secretType
      });

      if (result.secret) {
        setSecretValues(prev => ({ ...prev, [secretType]: result.secret! }));
      }

      return result.secret;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const upsertSecret = async (secretType: string, value: string) => {
    try {
      await callSecretsFunction('POST', {
        action: 'store',
        secret_type: secretType,
        secret_value: value
      });
      setSecretValues(prev => ({ ...prev, [secretType]: value }));
      await fetchSecrets(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const deleteSecret = async (secretType: string) => {
    try {
      await callSecretsFunction('DELETE', { secret_type: secretType });
      setSecretValues(prev => {
        const { [secretType]: _, ...rest } = prev;
        return rest;
      });
      await fetchSecrets(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  useEffect(() => {
    fetchSecrets();
  }, []);

  return {
    secrets,
    loading,
    error,
    getSecret,
    upsertSecret,
    deleteSecret,
    refetch: fetchSecrets
  };
};