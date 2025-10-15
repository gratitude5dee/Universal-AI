import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ContentItem {
  id: string;
  user_id: string;
  folder_id?: string;
  title: string;
  description?: string;
  file_type: 'audio' | 'video' | 'image' | 'document';
  file_size?: number;
  file_url?: string;
  storage_path?: string | null;
  signed_url?: string | null;
  thumbnail_url?: string;
  metadata: Record<string, unknown> | null;
  tags: string[] | null;
  qr_code_data?: string;
  created_at: string;
  updated_at: string;
  signed_url?: string | null;
}

interface ContentMetadata {
  original_name?: string;
  mime_type?: string;
  upload_date?: string;
  storage_path?: string;
  [key: string]: unknown;
}

export interface ContentFolder {
  id: string;
  user_id: string;
  parent_folder_id?: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

const getFileType = (mimeType: string): 'audio' | 'video' | 'image' | 'document' => {
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('image/')) return 'image';
  return 'document';
};

export const useContentManager = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [folders, setFolders] = useState<ContentFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const enrichWithSignedUrls = useCallback(async (items: ContentItem[]): Promise<ContentItem[]> => {
    if (items.length === 0) return [];

    const paths = items
      .map(item => item.storage_path || null)
      .filter((path): path is string => Boolean(path));

    if (paths.length === 0) {
      return items.map(item => ({
        ...item,
        signed_url: item.storage_path ? null : item.file_url ?? null
      }));
    }

    const { data: signedData, error: signedError } = await supabase.storage
      .from('content-library')
      .createSignedUrls(paths, 60 * 60);

    if (signedError) {
      console.error('Error creating signed URLs:', signedError);
      return items.map(item => ({
        ...item,
        signed_url: item.storage_path ? null : item.file_url ?? null
      }));
    }

    const signedUrlMap = new Map<string, string | null>(
      (signedData ?? []).map((entry) => [entry.path, entry.signedUrl ?? null])
    );

    return items.map(item => ({
      ...item,
      signed_url: item.storage_path ? signedUrlMap.get(item.storage_path) ?? null : item.file_url ?? null
    }));
  }, []);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);

      const [itemsResponse, foldersResponse] = await Promise.all([
        supabase
          .from('content_items')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('content_folders')
          .select('*')
          .order('name', { ascending: true })
      ]);

      if (itemsResponse.error) throw itemsResponse.error;
      if (foldersResponse.error) throw foldersResponse.error;

      const items = (itemsResponse.data as ContentItem[]) || [];
      setContentItems(await enrichWithSignedUrls(items));
      setFolders((foldersResponse.data as ContentFolder[]) || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: 'Error',
        description: 'Failed to load content. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast, enrichWithSignedUrls]);

  const uploadFile = async (
    file: File,
    folderId?: string
  ): Promise<{
    signedUrl: string | null;
    filePath: string;
    fileType: 'audio' | 'video' | 'image' | 'document';
  } | null> => {
    try {
      setUploading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('content-library')
        .upload(filePath, file, {
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const fileType = getFileType(file.type);

      const { error: insertError } = await supabase
        .from('content_items')
        .insert({
          user_id: user.id,
          folder_id: folderId,
          title: file.name,
          file_type: fileType,
          file_size: file.size,
          storage_path: filePath,
          metadata: {
            original_name: file.name,
            mime_type: file.type,
            upload_date: new Date().toISOString(),
            storage_path: filePath,
          },
          tags: []
        });

      if (insertError) throw insertError;

      toast({
        title: 'Success',
        description: 'File uploaded successfully!'
      });

      const { data: signedData } = await supabase.storage
        .from('content-library')
        .createSignedUrl(filePath, 60 * 60);

      await fetchContent();

      return { signedUrl: signedData?.signedUrl ?? '', filePath, fileType };
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload Error',
        description: 'Failed to upload file. Please try again.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const createFolder = async (name: string, description?: string, parentFolderId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('content_folders')
        .insert({
          user_id: user.id,
          parent_folder_id: parentFolderId,
          name,
          description
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Folder created successfully!'
      });

      await fetchContent();
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: 'Error',
        description: 'Failed to create folder. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const deleteContentItem = async (id: string) => {
    try {
      const { data: item, error: fetchError } = await supabase
        .from('content_items')
        .select('storage_path')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      if (item?.storage_path && !item.storage_path.startsWith('external/')) {
        const { error: storageError } = await supabase.storage
          .from('content-library')
          .remove([item.storage_path]);

        if (storageError && !storageError.message?.toLowerCase().includes('not found')) {
          throw storageError;
        }
      }

      const { error } = await supabase
        .from('content_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Content item deleted successfully!'
      });

      await fetchContent();
    } catch (error) {
      console.error('Error deleting content item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete content item.',
        variant: 'destructive'
      });
    }
  };

  const searchContent = async (query: string, fileType?: string) => {
    try {
      let searchQuery = supabase
        .from('content_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (query) {
        searchQuery = searchQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      }

      if (fileType && fileType !== 'all') {
        searchQuery = searchQuery.eq('file_type', fileType);
      }

      const { data, error } = await searchQuery;

      if (error) throw error;

      const items = (data as ContentItem[]) || [];
      setContentItems(await enrichWithSignedUrls(items));
    } catch (error) {
      console.error('Error searching content:', error);
      toast({
        title: 'Search Error',
        description: 'Failed to search content.',
        variant: 'destructive'
      });
    }
  };

  const addQRContent = async (qrData: string, title: string, description?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let fileType: 'audio' | 'video' | 'image' | 'document' = 'document';
      const fileUrl = qrData;

      if (qrData.includes('youtube.com') || qrData.includes('youtu.be')) {
        fileType = 'video';
      } else if (qrData.includes('spotify.com') || qrData.includes('soundcloud.com')) {
        fileType = 'audio';
      } else if (qrData.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        fileType = 'image';
      } else if (qrData.match(/\.(mp4|mov|avi|mkv)$/i)) {
        fileType = 'video';
      } else if (qrData.match(/\.(mp3|wav|flac|ogg)$/i)) {
        fileType = 'audio';
      }

      const fallbackPath = `external/${crypto.randomUUID()}`;

      const { error } = await supabase
        .from('content_items')
        .insert({
          user_id: user.id,
          title,
          description,
          file_type: fileType,
          file_url: fileUrl,
          qr_code_data: qrData,
          metadata: {
            source: 'qr_code',
            scan_date: new Date().toISOString(),
            external_url: qrData,
            storage_path: fallbackPath
          },
          tags: ['qr-imported']
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Content added from QR code!'
      });

      await fetchContent();
    } catch (error) {
      console.error('Error adding QR content:', error);
      toast({
        title: 'QR Import Error',
        description: 'Failed to add content from QR code.',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    contentItems,
    folders,
    loading,
    uploading,
    uploadFile,
    createFolder,
    deleteContentItem,
    searchContent,
    addQRContent,
    fetchContent
  };
};
