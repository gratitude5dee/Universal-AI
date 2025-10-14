import type { Database } from "@/integrations/supabase/types";

export type BoardRow = Database["public"]["Tables"]["boards"]["Row"];

export interface BoardService {
  fetchBoards: () => Promise<BoardRow[]>;
  createBoard: () => Promise<BoardRow | null>;
}

export interface EnsureBoardResult {
  boards: BoardRow[];
  activeBoardId: string;
}

export const ensureBoardForUser = async (
  service: BoardService
): Promise<EnsureBoardResult> => {
  const existingBoards = await service.fetchBoards();

  if (existingBoards.length > 0) {
    return {
      boards: existingBoards,
      activeBoardId: existingBoards[0].id,
    };
  }

  const createdBoard = await service.createBoard();

  if (!createdBoard) {
    throw new Error("Board creation failed");
  }

  return {
    boards: [createdBoard],
    activeBoardId: createdBoard.id,
  };
};
