import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, boardId, email, collaboratorId, role = 'viewer' } = await req.json();

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

    let result;

    switch (action) {
      case 'send_invite':
        // Verify user owns the board
        const { data: board } = await supabase
          .from('boards')
          .select('user_id, title')
          .eq('id', boardId)
          .single();

        if (!board || board.user_id !== user.id) {
          throw new Error('Board not found or access denied');
        }

        // Check if user exists by email
        const { data: invitedUser } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single();

        let invitedUserId = null;
        if (invitedUser) {
          invitedUserId = invitedUser.id;
          
          // Check if already a collaborator
          const { data: existingCollab } = await supabase
            .from('board_collaborators')
            .select('id')
            .eq('board_id', boardId)
            .eq('user_id', invitedUserId)
            .single();

          if (existingCollab) {
            throw new Error('User is already a collaborator');
          }
        }

        // Create collaboration record
        const { data: collaboration, error: collabError } = await supabase
          .from('board_collaborators')
          .insert({
            board_id: boardId,
            user_id: invitedUserId,
            invited_email: email,
            role,
            status: invitedUserId ? 'pending' : 'invited',
            invited_by: user.id
          })
          .select()
          .single();

        if (collabError) {
          throw new Error('Failed to create collaboration');
        }

        // TODO: Send email invitation here
        // This would typically integrate with an email service

        result = { 
          collaboration,
          message: invitedUserId ? 'Invitation sent to existing user' : 'Invitation sent to email'
        };
        break;

      case 'accept_invite':
        // Accept a collaboration invitation
        const { data: invite } = await supabase
          .from('board_collaborators')
          .select('id, board_id, invited_email')
          .eq('id', collaboratorId)
          .eq('status', 'pending')
          .single();

        if (!invite) {
          throw new Error('Invitation not found');
        }

        // Get user's profile to check email
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', user.id)
          .single();

        if (!userProfile || userProfile.email !== invite.invited_email) {
          throw new Error('Invitation not intended for this user');
        }

        const { error: acceptError } = await supabase
          .from('board_collaborators')
          .update({
            status: 'accepted',
            user_id: user.id
          })
          .eq('id', collaboratorId);

        if (acceptError) {
          throw new Error('Failed to accept invitation');
        }

        result = { success: true, message: 'Invitation accepted' };
        break;

      case 'decline_invite':
        // Decline a collaboration invitation
        const { data: declineInvite } = await supabase
          .from('board_collaborators')
          .select('id, invited_email')
          .eq('id', collaboratorId)
          .eq('status', 'pending')
          .single();

        if (!declineInvite) {
          throw new Error('Invitation not found');
        }

        const { data: declineProfile } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', user.id)
          .single();

        if (!declineProfile || declineProfile.email !== declineInvite.invited_email) {
          throw new Error('Invitation not intended for this user');
        }

        const { error: declineError } = await supabase
          .from('board_collaborators')
          .update({ status: 'declined' })
          .eq('id', collaboratorId);

        if (declineError) {
          throw new Error('Failed to decline invitation');
        }

        result = { success: true, message: 'Invitation declined' };
        break;

      case 'remove_collaborator':
        // Remove a collaborator (only board owner can do this)
        const { data: ownerBoard } = await supabase
          .from('boards')
          .select('user_id')
          .eq('id', boardId)
          .single();

        if (!ownerBoard || ownerBoard.user_id !== user.id) {
          throw new Error('Only board owner can remove collaborators');
        }

        const { error: removeError } = await supabase
          .from('board_collaborators')
          .delete()
          .eq('id', collaboratorId)
          .eq('board_id', boardId);

        if (removeError) {
          throw new Error('Failed to remove collaborator');
        }

        result = { success: true, message: 'Collaborator removed' };
        break;

      case 'get_invites':
        // Get pending invitations for the current user
        const { data: userInvites, error: invitesError } = await supabase
          .from('board_collaborators')
          .select(`
            id,
            role,
            created_at,
            boards:board_id (id, title, description),
            inviter:invited_by (username)
          `)
          .eq('user_id', user.id)
          .eq('status', 'pending');

        if (invitesError) {
          throw new Error('Failed to fetch invitations');
        }

        result = { invites: userInvites };
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
    console.error('Error in canvas-invites:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});