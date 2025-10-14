import { describe, expect, mock, test } from "bun:test";
import { ensureBoardForUser, type BoardRow } from "../boardLoader";

const createBoard = (overrides: Partial<BoardRow> = {}): BoardRow => ({
  id: "board-1",
  title: "Test Canvas",
  user_id: "user-1",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  description: null,
  is_public: false,
  slug: null,
  thumbnail_url: null,
  canvas_data: null,
  ...overrides,
});

describe("ensureBoardForUser", () => {
  test("returns existing boards and keeps the latest id", async () => {
    const boards = [
      createBoard({ id: "board-1", title: "Board 1" }),
      createBoard({ id: "board-2", title: "Board 2" }),
    ];
    const fetchBoards = mock(async () => boards);
    const createNewBoard = mock(async () => createBoard({ id: "board-3" }));

    const result = await ensureBoardForUser({
      fetchBoards,
      createBoard: createNewBoard,
    });

    expect(result.boards).toEqual(boards);
    expect(result.activeBoardId).toBe("board-1");
    expect(fetchBoards).toHaveBeenCalledTimes(1);
    expect(createNewBoard).not.toHaveBeenCalled();
  });

  test("creates a board when none exist", async () => {
    const newBoard = createBoard({ id: "board-99", title: "New Board" });
    const fetchBoards = mock(async () => [] as BoardRow[]);
    const createNewBoard = mock(async () => newBoard);

    const result = await ensureBoardForUser({
      fetchBoards,
      createBoard: createNewBoard,
    });

    expect(fetchBoards).toHaveBeenCalledTimes(1);
    expect(createNewBoard).toHaveBeenCalledTimes(1);
    expect(result.boards).toEqual([newBoard]);
    expect(result.activeBoardId).toBe(newBoard.id);
  });

  test("throws when board creation fails", async () => {
    const fetchBoards = mock(async () => [] as BoardRow[]);
    const createNewBoard = mock(async () => null);

    await expect(
      ensureBoardForUser({
        fetchBoards,
        createBoard: createNewBoard,
      })
    ).rejects.toThrow("Board creation failed");
  });
});
