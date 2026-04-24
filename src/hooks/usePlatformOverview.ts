import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PlatformOverview {
  content?: Record<string, any>;
  marketing?: Record<string, any>;
  finance?: Record<string, any>;
  bridge?: Record<string, any>;
  agents?: Record<string, any>;
}

export function usePlatformOverview() {
  return useQuery({
    queryKey: ["platform-overview"],
    queryFn: async (): Promise<PlatformOverview> => {
      const { data, error } = await supabase.rpc("get_platform_overview");
      if (error) {
        throw error;
      }
      return (data ?? {}) as PlatformOverview;
    },
  });
}
