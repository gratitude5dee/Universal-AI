import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

type CanvasShareSettings = {
  isPublic?: boolean;
  allowComments?: boolean;
  allowDownloads?: boolean;
  expiresAt?: string | null;
  title?: string;
  description?: string | null;
};

type CanvasSharingPayload = {
  action: string;
  boardId?: string;
  shareId?: string;
  settings?: CanvasShareSettings;
  content?: string;
  guestName?: string | null;
  guestEmail?: string | null;
};

function generateShareId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json() as CanvasSharingPayload;
    const { action, boardId, shareId, settings } = payload;

    let result;

    switch (action) {
      case 'create_share':
        if (!boardId) {
          throw new Error('Board ID is required');
        }
        // Get user from auth header
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
          throw new Error('No authorization header');
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);
        
        if (userError || !user) {
          throw new Error('Invalid token');
        }

        // Verify user owns the board or is a collaborator with edit access
        const { data: board } = await supabase
          .from('boards')
          .select('user_id, title, description')
          .eq('id', boardId)
          .single();

        if (!board) {
          throw new Error('Board not found');
        }

        let hasAccess = board.user_id === user.id;
        
        if (!hasAccess) {
          const { data: collaborator } = await supabase
            .from('board_collaborators')
            .select('role')
            .eq('board_id', boardId)
            .eq('user_id', user.id)
            .eq('status', 'accepted')
            .single();

          hasAccess = collaborator && (collaborator.role === 'editor' || collaborator.role === 'admin');
        }

        if (!hasAccess) {
          throw new Error('Access denied');
        }

        // Check if share already exists
        const { data: existingShare } = await supabase
          .from('board_shares')
          .select('share_id, is_public, expires_at')
          .eq('board_id', boardId)
          .single();

        if (existingShare) {
          const shareTitle = settings?.title ?? board.title;
          const shareDescription =
            settings?.description ?? board.description ?? null;
          // Update existing share
          const { error: updateError } = await supabase
            .from('board_shares')
            .update({
              is_public: settings?.isPublic ?? true,
              allow_comments: settings?.allowComments ?? false,
              allow_downloads: settings?.allowDownloads ?? false,
              expires_at: settings?.expiresAt || null,
              title: shareTitle,
              description: shareDescription,
              updated_at: new Date().toISOString()
            })
            .eq('board_id', boardId);

          if (updateError) {
            throw new Error('Failed to update share settings');
          }

          result = { shareId: existingShare.share_id };
        } else {
          // Create new share
          const newShareId = generateShareId();
          const shareTitle = settings?.title ?? board.title;
          const shareDescription =
            settings?.description ?? board.description ?? null;

          const { error: shareError } = await supabase
            .from('board_shares')
            .insert({
              board_id: boardId,
              share_id: newShareId,
              created_by: user.id,
              is_public: settings?.isPublic ?? true,
              allow_comments: settings?.allowComments ?? false,
              allow_downloads: settings?.allowDownloads ?? false,
              expires_at: settings?.expiresAt || null,
              title: shareTitle,
              description: shareDescription
            });

          if (shareError) {
            throw new Error('Failed to create share');
          }

          result = { shareId: newShareId };
        }
        break;

      case 'get_shared_board':
        if (!shareId) {
          throw new Error('Share ID is required');
        }
        // Get publicly shared board (no auth required)
        const { data: sharedBoard, error: shareError } = await supabase
          .from('board_shares')
          .select(`
            board_id,
            is_public,
            allow_comments,
            allow_downloads,
            expires_at,
            boards:board_id (
              id,
              title,
              description,
              content,
              created_at,
              updated_at,
              creator:user_id (username)
            )
          `)
          .eq('share_id', shareId)
          .eq('is_public', true)
          .single();

        if (shareError || !sharedBoard) {
          throw new Error('Shared board not found or not public');
        }

        // Check if share has expired
        if (sharedBoard.expires_at && new Date(sharedBoard.expires_at) < new Date()) {
          throw new Error('Share link has expired');
        }

        result = { 
          board: sharedBoard.boards,
          settings: {
            allowComments: sharedBoard.allow_comments,
            allowDownloads: sharedBoard.allow_downloads
          }
        };
        break;

      case 'add_comment':
        if (!shareId) {
          throw new Error('Share ID is required');
        }
        // Add comment to shared board
        const commentAuthHeader = req.headers.get('Authorization');
        let commentUserId = null;
        
        if (commentAuthHeader) {
          const commentToken = commentAuthHeader.replace('Bearer ', '');
          const { data: { user: commentUser } } = await supabase.auth.getUser(commentToken);
          commentUserId = commentUser?.id;
        }

        // Get share settings
        const { data: shareSettings } = await supabase
          .from('board_shares')
          .select('board_id, allow_comments')
          .eq('share_id', shareId)
          .single();

        if (!shareSettings || !shareSettings.allow_comments) {
          throw new Error('Comments not allowed on this board');
        }

        const { content, guestName, guestEmail } = payload;

        if (!content) {
          throw new Error('Comment content is required');
        }

        const { data: comment, error: commentError } = await supabase
          .from('board_comments')
          .insert({
            board_id: shareSettings.board_id,
            user_id: commentUserId,
            content,
            guest_name: !commentUserId ? guestName : null,
            guest_email: !commentUserId ? guestEmail : null
          })
          .select(`
            id,
            content,
            guest_name,
            guest_email,
            created_at,
            user:user_id (username)
          `)
          .single();

        if (commentError) {
          throw new Error('Failed to add comment');
        }

        result = { comment };
        break;

      case 'get_comments':
        if (!shareId) {
          throw new Error('Share ID is required');
        }
        // Get comments for shared board
        const { data: commentsBoard } = await supabase
          .from('board_shares')
          .select('board_id, allow_comments')
          .eq('share_id', shareId)
          .single();

        if (!commentsBoard || !commentsBoard.allow_comments) {
          throw new Error('Comments not available');
        }

        const { data: comments, error: commentsError } = await supabase
          .from('board_comments')
          .select(`
            id,
            content,
            guest_name,
            guest_email,
            created_at,
            user:user_id (username)
          `)
          .eq('board_id', commentsBoard.board_id)
          .order('created_at', { ascending: true });

        if (commentsError) {
          throw new Error('Failed to fetch comments');
        }

        result = { comments };
        break;

      case 'delete_share':
        if (!boardId) {
          throw new Error('Board ID is required');
        }
        // Delete share (owner only)
        const deleteAuthHeader = req.headers.get('Authorization');
        if (!deleteAuthHeader) {
          throw new Error('No authorization header');
        }

        const deleteToken = deleteAuthHeader.replace('Bearer ', '');
        const { data: { user: deleteUser }, error: deleteUserError } = await supabase.auth.getUser(deleteToken);
        
        if (deleteUserError || !deleteUser) {
          throw new Error('Invalid token');
        }

        const { data: deleteBoard } = await supabase
          .from('boards')
          .select('user_id')
          .eq('id', boardId)
          .single();

        if (!deleteBoard || deleteBoard.user_id !== deleteUser.id) {
          throw new Error('Only board owner can delete shares');
        }

        const { error: deleteError } = await supabase
          .from('board_shares')
          .delete()
          .eq('board_id', boardId);

        if (deleteError) {
          throw new Error('Failed to delete share');
        }

        result = { success: true, message: 'Share deleted' };
        break;

      default:
        throw new Error('Invalid action');
    }

    return new Response(JSON.stringify({
      success: true,
      ...result
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in canvas-sharing:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});