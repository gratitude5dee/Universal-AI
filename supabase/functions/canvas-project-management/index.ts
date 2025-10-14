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
    const { action, boardId, projectId, data } = await req.json();

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
      case 'create_from_board':
        // Create a new project from board content
        const { data: board } = await supabase
          .from('boards')
          .select('title, description, content')
          .eq('id', boardId)
          .single();

        if (!board) {
          throw new Error('Board not found');
        }

        const { data: project, error: projectError } = await supabase
          .from('projects')
          .insert({
            user_id: user.id,
            title: data.title || `Project from ${board.title}`,
            description: data.description || board.description,
            concept_text: JSON.stringify(board.content),
            source_board_id: boardId
          })
          .select()
          .single();

        if (projectError) {
          throw new Error('Failed to create project');
        }

        const { error: boardLinkError } = await supabase
          .from('boards')
          .update({ source_project_id: project.id })
          .eq('id', boardId);

        if (boardLinkError) {
          throw new Error('Failed to link board to project');
        }

        result = { project };
        break;

      case 'sync_to_project':
        // Sync board content to existing project
        const { data: existingProject } = await supabase
          .from('projects')
          .select('user_id')
          .eq('id', projectId)
          .single();

        if (!existingProject || existingProject.user_id !== user.id) {
          throw new Error('Project not found or access denied');
        }

        const { data: syncBoard } = await supabase
          .from('boards')
          .select('content')
          .eq('id', boardId)
          .single();

        if (!syncBoard) {
          throw new Error('Board not found');
        }

        const { error: syncError } = await supabase
          .from('projects')
          .update({
            concept_text: JSON.stringify(syncBoard.content),
            updated_at: new Date().toISOString()
          })
          .eq('id', projectId);

        if (syncError) {
          throw new Error('Failed to sync to project');
        }

        result = { success: true };
        break;

      case 'get_project_boards':
        // Get all boards linked to a project
        const { data: projectBoards, error: boardsError } = await supabase
          .from('boards')
          .select('id, title, description, created_at, updated_at')
          .eq('source_project_id', projectId)
          .eq('user_id', user.id);

        if (boardsError) {
          throw new Error('Failed to fetch project boards');
        }

        result = { boards: projectBoards };
        break;

      case 'create_board_from_project':
        // Create a new board from project content
        const { data: sourceProject } = await supabase
          .from('projects')
          .select('title, description, concept_text')
          .eq('id', projectId)
          .eq('user_id', user.id)
          .single();

        if (!sourceProject) {
          throw new Error('Project not found');
        }

        let boardContent = {};
        try {
          boardContent = JSON.parse(sourceProject.concept_text || '{}');
        } catch {
          boardContent = { text: sourceProject.concept_text || '' };
        }

        const { data: newBoard, error: newBoardError } = await supabase
          .from('boards')
          .insert({
            user_id: user.id,
            title: data.title || `Board from ${sourceProject.title}`,
            description: data.description || sourceProject.description,
            content: boardContent,
            source_project_id: projectId
          })
          .select()
          .single();

        if (newBoardError) {
          throw new Error('Failed to create board');
        }

        result = { board: newBoard };
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
    console.error('Error in canvas-project-management:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});