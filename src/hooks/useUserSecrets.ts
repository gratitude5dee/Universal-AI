import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserSecretMetadata {
  secret_type: string;
  created_at: string;
  updated_at: string;
}

export const useUserSecrets = () => {
  const [secrets, setSecrets] = useState<UserSecretMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAccessToken = useCallback(async () => {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.access_token) {
      throw new Error('User not authenticated');
    }
    return session.access_token;
  }, []);

  const fetchSecrets = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getAccessToken();
      const response = await fetch(`${supabase.functions.url}/manage-user-secrets`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || 'Unable to load secrets');
      }

      const data = await response.json();
      setSecrets(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  const getSecret = async (secretType: string): Promise<string | null> => {
    try {
      const token = await getAccessToken();
      const response = await fetch(`${supabase.functions.url}/manage-user-secrets?secretType=${encodeURIComponent(secretType)}&decrypt=true`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || 'Failed to retrieve secret');
      }

      const data = await response.json();
      return data?.value ?? null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const upsertSecret = async (secretType: string, value: string) => {
    try {
      const token = await getAccessToken();
      const response = await fetch(`${supabase.functions.url}/manage-user-secrets`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secret_type: secretType, value }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || 'Failed to save secret');
      }

      await fetchSecrets(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const deleteSecret = async (secretType: string) => {
    try {
      const token = await getAccessToken();
      const response = await fetch(`${supabase.functions.url}/manage-user-secrets`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secret_type: secretType }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || 'Failed to delete secret');
      }

      await fetchSecrets(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  useEffect(() => {
    fetchSecrets();
  }, [fetchSecrets]);

  return {
    secrets,
    loading,
    error,
    getSecret,
    upsertSecret,
    deleteSecret,
    refetch: fetchSecrets,
  };
};

