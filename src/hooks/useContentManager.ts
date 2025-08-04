import { useState, useEffect } from 'react';
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
  thumbnail_url?: string;
  metadata: any;
  tags: string[];
  qr_code_data?: string;
  created_at: string;
  updated_at: string;
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

export const useContentManager = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [folders, setFolders] = useState<ContentFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  // Fetch content items and folders
  const fetchContent = async () => {
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

      setContentItems((itemsResponse.data as ContentItem[]) || []);
      setFolders((foldersResponse.data as ContentFolder[]) || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: "Error",
        description: "Failed to load content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Upload file to Supabase Storage
  const uploadFile = async (file: File, folderId?: string) => {
    try {
      setUploading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create file path with user ID
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('content-library')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('content-library')
        .getPublicUrl(filePath);

      // Determine file type
      const fileType = getFileType(file.type);

      // Create content item record
      const { error: insertError } = await supabase
        .from('content_items')
        .insert({
          user_id: user.id,
          folder_id: folderId,
          title: file.name,
          file_type: fileType,
          file_size: file.size,
          file_url: publicUrl,
          metadata: {
            original_name: file.name,
            mime_type: file.type,
            upload_date: new Date().toISOString()
          },
          tags: []
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "File uploaded successfully!"
      });

      // Refresh content
      await fetchContent();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  // Create new folder
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
        title: "Success",
        description: "Folder created successfully!"
      });

      await fetchContent();
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: "Error",
        description: "Failed to create folder. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Delete content item
  const deleteContentItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('content_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Content item deleted successfully!"
      });

      await fetchContent();
    } catch (error) {
      console.error('Error deleting content item:', error);
      toast({
        title: "Error",
        description: "Failed to delete content item.",
        variant: "destructive"
      });
    }
  };

  // Search content items
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

      setContentItems((data as ContentItem[]) || []);
    } catch (error) {
      console.error('Error searching content:', error);
      toast({
        title: "Search Error",
        description: "Failed to search content.",
        variant: "destructive"
      });
    }
  };

  // Add content via QR code
  const addQRContent = async (qrData: string, title: string, description?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Try to determine if QR data is a URL or contains file info
      let fileType: 'audio' | 'video' | 'image' | 'document' = 'document';
      let fileUrl = qrData;

      // Simple URL validation and type detection
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
            scan_date: new Date().toISOString()
          },
          tags: ['qr-imported']
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Content added from QR code!"
      });

      await fetchContent();
    } catch (error) {
      console.error('Error adding QR content:', error);
      toast({
        title: "QR Import Error",
        description: "Failed to add content from QR code.",
        variant: "destructive"
      });
    }
  };

  // Helper function to determine file type from MIME type
  const getFileType = (mimeType: string): 'audio' | 'video' | 'image' | 'document' => {
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('image/')) return 'image';
    return 'document';
  };

  useEffect(() => {
    fetchContent();
  }, []);

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