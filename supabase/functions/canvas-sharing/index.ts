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
    const requestData = await req.json();
    const { action } = requestData;

    let result;

    switch (action) {
      case 'create_share': {
        if (!requestData.boardId) {
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
          .eq('id', requestData.boardId)
          .single();

        if (!board) {
          throw new Error('Board not found');
        }

        let hasAccess = board.user_id === user.id;
        
        if (!hasAccess) {
          const { data: collaborator } = await supabase
            .from('board_collaborators')
            .select('role')
            .eq('board_id', requestData.boardId)
            .eq('user_id', user.id)
            .eq('status', 'accepted')
            .single();

          hasAccess = (collaborator && (collaborator.role === 'editor' || collaborator.role === 'admin')) ?? false;
        }

        if (!hasAccess) {
          throw new Error('Access denied');
        }

        // Check if share already exists
        const { data: existingShare } = await supabase
          .from('board_shares')
          .select('id, share_id, title, description')
          .eq('board_id', requestData.boardId)
          .single();

        if (existingShare) {
          const shareTitle = requestData.settings?.title ?? board.title;
          const shareDescription =
            requestData.settings?.description ?? board.description ?? null;
          // Update existing share
          const { error: updateError } = await supabase
            .from('board_shares')
            .update({
              title: requestData.settings?.title ?? existingShare.title,
              description: requestData.settings?.description ?? existingShare.description
            })
            .eq('board_id', requestData.boardId);

          if (updateError) {
            throw new Error('Failed to update share settings');
          }

          result = { shareId: existingShare.share_id };
        } else {
          // Create new share
          const newShareId = generateShareId();

          const { error: shareError } = await supabase
            .from('board_shares')
            .insert({
              board_id: requestData.boardId,
              share_id: newShareId,
              created_by: user.id,
              title: requestData.settings?.title ?? board.title,
              description: requestData.settings?.description ?? board.description
            });

          if (shareError) {
            throw new Error('Failed to create share');
          }

          result = { shareId: newShareId };
        }
        break;
      }

      case 'get_shared_board': {
        if (!requestData.shareId) {
          throw new Error('Share ID is required');
        }

        // Get publicly shared board (no auth required)
        const { data: sharedBoard, error: shareError } = await supabase
          .from('board_shares')
          .select(`
            board_id,
            title,
            description,
            boards:board_id (
              id,
              title,
              description,
              canvas_data,
              created_at,
              updated_at,
              creator:user_id (username)
            )
          `)
          .eq('share_id', requestData.shareId)
          .single();

        if (shareError || !sharedBoard) {
          throw new Error('Shared board not found');
        }

        result = {
          board: sharedBoard.boards,
          settings: {
            allowComments: false,
            allowDownloads: false,
            isPublic: true,
            expiresAt: null
          },
          share: {
            title: sharedBoard.title,
            description: sharedBoard.description
          }
        };
        break;
      }

      case 'add_comment': {
        if (!requestData.shareId) {
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

        if (!commentUserId) {
          throw new Error('Authentication required to comment on shared boards');
        }

        const { data: shareRecord } = await supabase
          .from('board_shares')
          .select('board_id')
          .eq('share_id', requestData.shareId)
          .single();

        if (!shareRecord) {
          throw new Error('Share not found');
        }

        if (!requestData.content) {
          throw new Error('Comment content is required');
        }

        const { data: comment, error: commentError } = await supabase
          .from('board_comments')
          .insert({
            board_id: shareRecord.board_id,
            user_id: commentUserId,
            content: requestData.content
          })
          .select(`
            id,
            content,
            created_at,
            user:user_id (username)
          `)
          .single();

        if (commentError) {
          throw new Error('Failed to add comment');
        }

        result = { comment };
        break;
      }

      case 'get_comments': {
        // Get comments for shared board
        if (!requestData.shareId) {
          throw new Error('Share ID is required');
        }

        const { data: commentsBoard } = await supabase
          .from('board_shares')
          .select('board_id')
          .eq('share_id', requestData.shareId)
          .single();

        if (!commentsBoard) {
          throw new Error('Share not found');
        }

        const { data: comments, error: commentsError } = await supabase
          .from('board_comments')
          .select(`
            id,
            content,
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
      }

      case 'delete_share': {
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

        if (!requestData.boardId) {
          throw new Error('Board ID is required');
        }

        const { data: deleteBoard } = await supabase
          .from('boards')
          .select('user_id')
          .eq('id', requestData.boardId)
          .single();

        if (!deleteBoard || deleteBoard.user_id !== deleteUser.id) {
          throw new Error('Only board owner can delete shares');
        }

        const { error: deleteError } = await supabase
          .from('board_shares')
          .delete()
          .eq('board_id', requestData.boardId);

        if (deleteError) {
          throw new Error('Failed to delete share');
        }

        result = { success: true, message: 'Share deleted' };
        break;
      }

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
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});