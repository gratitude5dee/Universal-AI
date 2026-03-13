import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PlatformOverview {
  content?: Record<string, unknown>;
  marketing?: Record<string, unknown>;
  finance?: Record<string, unknown>;
  bridge?: Record<string, unknown>;
  agents?: Record<string, unknown>;
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
