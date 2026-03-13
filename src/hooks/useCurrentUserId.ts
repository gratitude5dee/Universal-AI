import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCurrentUserId = () =>
  useQuery({
    queryKey: ["current-user-id"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        throw error;
      }
      return data.user?.id ?? null;
    },
    staleTime: 60_000,
  });
