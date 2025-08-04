import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserSecret {
  id: string;
  secret_type: string;
  encrypted_value: string;
  created_at: string;
  updated_at: string;
}

export const useUserSecrets = () => {
  const [secrets, setSecrets] = useState<UserSecret[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSecrets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_secrets')
        .select('*');
      
      if (error) throw error;
      setSecrets(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getSecret = (secretType: string): string | null => {
    const secret = secrets.find(s => s.secret_type === secretType);
    return secret?.encrypted_value || null;
  };

  const upsertSecret = async (secretType: string, value: string) => {
    try {
      const { error } = await supabase
        .from('user_secrets')
        .upsert({
          secret_type: secretType,
          encrypted_value: value,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }, {
          onConflict: 'user_id,secret_type'
        });
      
      if (error) throw error;
      await fetchSecrets(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const deleteSecret = async (secretType: string) => {
    try {
      const { error } = await supabase
        .from('user_secrets')
        .delete()
        .eq('secret_type', secretType);
      
      if (error) throw error;
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