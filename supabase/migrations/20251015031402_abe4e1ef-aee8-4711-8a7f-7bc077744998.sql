-- Fix infinite recursion in board_collaborators RLS policies

-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view collaborators for boards they have access to" ON board_collaborators;
DROP POLICY IF EXISTS "Users can view boards they own or collaborate on" ON boards;

-- Create a security definer function to check board access without recursion
CREATE OR REPLACE FUNCTION public.user_has_board_access(board_id_param uuid, user_id_param uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM boards 
    WHERE id = board_id_param 
    AND user_id = user_id_param
  ) OR EXISTS (
    SELECT 1 FROM board_collaborators
    WHERE board_id = board_id_param
    AND user_id = user_id_param
    AND status = 'accepted'
  );
$$;

-- Recreate the boards policy using the function to avoid recursion
CREATE POLICY "Users can view boards they own or collaborate on"
ON boards
FOR SELECT
USING (
  auth.uid() = user_id OR
  user_has_board_access(id, auth.uid())
);

-- Recreate the board_collaborators view policy without circular dependency
CREATE POLICY "Users can view collaborators for boards they have access to"
ON board_collaborators
FOR SELECT
USING (
  -- Direct board ownership check (no recursion)
  board_id IN (
    SELECT id FROM boards WHERE user_id = auth.uid()
  ) OR
  -- Direct collaborator check (no recursion into boards)
  user_id = auth.uid()
);