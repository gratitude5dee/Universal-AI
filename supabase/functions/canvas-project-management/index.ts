import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const defaultCanvasPayload = {
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
};

type BoardContentLike = Record<string, unknown> | null | undefined;

const scoreCanvasPayload = (payload: BoardContentLike) => {
  if (!payload || typeof payload !== 'object') return -1;
  const nodes = Array.isArray((payload as { nodes?: unknown }).nodes)
    ? ((payload as { nodes?: unknown }).nodes as unknown[]).length
    : 0;
  const edges = Array.isArray((payload as { edges?: unknown }).edges)
    ? ((payload as { edges?: unknown }).edges as unknown[]).length
    : 0;

  const keys = Object.keys(payload as Record<string, unknown>).length;
  return nodes * 2 + edges + (keys > 0 ? 1 : 0);
};

const resolveBoardContent = (board: {
  content?: BoardContentLike;
  canvas_data?: BoardContentLike;
}) => {
  const contentScore = scoreCanvasPayload(board.content);
  const canvasScore = scoreCanvasPayload(board.canvas_data);

  if (canvasScore > contentScore) {
    return (board.canvas_data as Record<string, unknown>) ?? defaultCanvasPayload;
  }

  return (board.content as Record<string, unknown>)
    ?? (board.canvas_data as Record<string, unknown>)
    ?? defaultCanvasPayload;
};

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
          .select('title, description, content, canvas_data')
          .eq('id', boardId)
          .single();

        if (!board) {
          throw new Error('Board not found');
        }

        const boardContent = resolveBoardContent(board);

        const { data: project, error: projectError } = await supabase
          .from('projects')
          .insert({
            user_id: user.id,
            title: data.title || `Project from ${board.title}`,
            description: data.description || board.description,
            concept_text: JSON.stringify(boardContent),
            source_board_id: boardId
          })
          .select()
          .single();

        if (projectError) {
          throw new Error('Failed to create project');
        }

        const { error: boardLinkError } = await supabase
          .from('boards')
          .update({
            source_project_id: project.id,
            content: boardContent,
            canvas_data: boardContent,
            updated_at: new Date().toISOString(),
          })
          .eq('id', boardId);

        if (boardLinkError) {
          throw new Error('Failed to update board link');
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
          .select('content, canvas_data')
          .eq('id', boardId)
          .single();

        if (!syncBoard) {
          throw new Error('Board not found');
        }

        const boardContentToSync = resolveBoardContent(syncBoard);

        const { error: syncError } = await supabase
          .from('projects')
          .update({
            concept_text: JSON.stringify(boardContentToSync),
            source_board_id: boardId,
            updated_at: new Date().toISOString()
          })
          .eq('id', projectId);

        if (syncError) {
          throw new Error('Failed to sync to project');
        }

        const { error: boardSyncError } = await supabase
          .from('boards')
          .update({
            content: boardContentToSync,
            canvas_data: boardContentToSync,
            source_project_id: projectId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', boardId);

        if (boardSyncError) {
          throw new Error('Failed to update board content');
        }

        result = { success: true };
        break;

      case 'get_project_boards':
        // Get all boards linked to a project
        const { data: projectBoards, error: boardsError } = await supabase
          .from('boards')
          .select('id, title, description, created_at, updated_at, content, canvas_data')
          .eq('source_project_id', projectId);

        if (boardsError) {
          throw new Error('Failed to fetch project boards');
        }

        result = {
          boards: (projectBoards || []).map((board) => ({
            ...board,
            content: resolveBoardContent(board),
          })),
        };
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

        let boardContent: Record<string, unknown> = {};
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
            canvas_data: boardContent,
            source_project_id: projectId
          })
          .select()
          .single();

        if (newBoardError) {
          throw new Error('Failed to create board');
        }

        const { error: projectLinkError } = await supabase
          .from('projects')
          .update({
            source_board_id: newBoard.id,
            concept_text: JSON.stringify(boardContent),
            updated_at: new Date().toISOString(),
          })
          .eq('id', projectId);

        if (projectLinkError) {
          throw new Error('Failed to update project link');
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