import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserSecret {
  secret_type: string;
  value: string | null;
  hasValue: boolean;
  created_at: string;
  updated_at: string;
}

export const useUserSecrets = () => {
  const [secrets, setSecrets] = useState<UserSecret[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getSupabaseUrl = () => {
    const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
    if (!url) {
      throw new Error('Missing VITE_SUPABASE_URL environment variable');
    }
    return url;
  };

  const authenticatedFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    if (!token) {
      throw new Error('Not authenticated');
    }

    return fetch(input, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(init?.headers || {}),
      },
    });
  };

  const fetchSecrets = async () => {
    try {
      setLoading(true);

      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) {
        setSecrets([]);
        return;
      }

      const supabaseUrl = getSupabaseUrl();
      const response = await authenticatedFetch(`${supabaseUrl}/functions/v1/manage-user-secrets`);
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error((payload as { error?: string } | null)?.error || 'Failed to load secrets');
      }

      const data = Array.isArray(payload) ? (payload as UserSecret[]) : [];
      setSecrets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getSecret = (secretType: string): string | null => {
    const secret = secrets.find((s) => s.secret_type === secretType);
    return secret?.value ?? null;
  };

  const upsertSecret = async (secretType: string, value: string) => {
    try {
      const supabaseUrl = getSupabaseUrl();
      const response = await authenticatedFetch(`${supabaseUrl}/functions/v1/manage-user-secrets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secret_type: secretType, value }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to store secret');
      }

      await fetchSecrets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const deleteSecret = async (secretType: string) => {
    try {
      const supabaseUrl = getSupabaseUrl();
      const response = await authenticatedFetch(`${supabaseUrl}/functions/v1/manage-user-secrets`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secret_type: secretType }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to delete secret');
      }

      await fetchSecrets();
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
    refetch: fetchSecrets,
  };
};

