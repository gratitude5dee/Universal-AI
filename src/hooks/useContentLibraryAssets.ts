import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import universalAiLogo from "@/assets/universal-ai-logo.png";

export interface ContentLibraryAsset {
  creatorId: string;
  id: string;
  title: string;
  artist: string;
  image: string;
  description: string | null;
  fileType: string;
  storagePath: string | null;
  signedUrl: string | null;
  tags: string[];
  publicationCount: number;
  linkCount: number;
  createdAt: string;
  updatedAt: string;
}

async function createSignedUrlMap(storagePaths: string[]) {
  if (!storagePaths.length) {
    return new Map<string, string | null>();
  }

  const { data, error } = await supabase.storage
    .from("content-library")
    .createSignedUrls(storagePaths, 60 * 60);

  if (error) {
    throw error;
  }

  return new Map<string, string | null>(
    (data ?? []).map((entry) => [entry.path, entry.signedUrl ?? null]),
  );
}

interface UseContentLibraryAssetsOptions {
  enabled?: boolean;
}

export function useContentLibraryAssets(options: UseContentLibraryAssetsOptions = {}) {
  const { enabled = true } = options;

  return useQuery({
    queryKey: ["content-library-assets"],
    enabled,
    queryFn: async (): Promise<ContentLibraryAsset[]> => {
      const { data, error } = await supabase
        .from("content_library_assets_v1")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) {
        throw error;
      }

      const rows = (data ?? []) as Array<Record<string, unknown>>;
      const storagePaths = rows
        .map((row) => row.storage_path)
        .filter((value): value is string => typeof value === "string" && value.length > 0);
      const signedUrlMap = await createSignedUrlMap(storagePaths);

      return rows.map((row) => {
        const storagePath = typeof row.storage_path === "string" ? row.storage_path : null;
        const signedUrl = storagePath ? signedUrlMap.get(storagePath) ?? null : null;
        const metadata = (row.metadata as Record<string, unknown> | null) ?? {};
        const fileType = String(row.file_type ?? "document");
        const fallbackArtist =
          typeof metadata.artist === "string"
            ? metadata.artist
            : typeof metadata.original_name === "string"
              ? metadata.original_name
              : "You";
        const displayImage =
          fileType === "image" && signedUrl
            ? signedUrl
            : typeof row.thumbnail_url === "string" && row.thumbnail_url
              ? row.thumbnail_url
              : universalAiLogo;

        return {
          creatorId: String(row.creator_id),
          id: String(row.id),
          title: String(row.title ?? "Untitled asset"),
          artist: fallbackArtist,
          image: displayImage,
          description: typeof row.description === "string" ? row.description : null,
          fileType,
          storagePath,
          signedUrl,
          tags: Array.isArray(row.tags) ? row.tags.map((tag) => String(tag)) : [],
          publicationCount: Number(row.publication_count ?? 0),
          linkCount: Number(row.link_count ?? 0),
          createdAt: String(row.created_at),
          updatedAt: String(row.updated_at),
        };
      });
    },
  });
}
