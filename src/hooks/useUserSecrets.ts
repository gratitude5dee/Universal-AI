import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserSecret {
  secret_type: string;
  value: string;
  created_at: string;
  updated_at: string;
}

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ??
  'https://ixkkrousepsiorwlaycp.supabase.co';

export const useUserSecrets = () => {
  const [secrets, setSecrets] = useState<UserSecret[]>([]);
  const [secretValues, setSecretValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const withAuthHeaders = useCallback(async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    const accessToken = sessionData.session?.access_token;
    if (!accessToken) {
      throw new Error('No active session found. Please sign in again.');
    }

    return {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    } as Record<string, string>;
  }, []);

  const fetchSecrets = useCallback(async () => {
    try {
      setLoading(true);
      const headers = await withAuthHeaders();

      const response = await fetch(`${SUPABASE_URL}/functions/v1/manage-user-secrets`, {
        method: 'GET',
        headers: { Authorization: headers.Authorization }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to load secrets');
      }

      const data: UserSecret[] = await response.json();
      setSecrets(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [withAuthHeaders]);

  const getSecret = (secretType: string): string | null => {
    const secret = secrets.find(s => s.secret_type === secretType);
    return secret?.value || null;
  };

  const upsertSecret = async (secretType: string, value: string) => {
    try {
      const headers = await withAuthHeaders();

      const response = await fetch(`${SUPABASE_URL}/functions/v1/manage-user-secrets`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          secret_type: secretType,
          value
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to save secret');
      }

      await fetchSecrets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const deleteSecret = async (secretType: string) => {
    try {
      const headers = await withAuthHeaders();

      const response = await fetch(`${SUPABASE_URL}/functions/v1/manage-user-secrets`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ secret_type: secretType })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to delete secret');
      }

      await fetchSecrets();
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
