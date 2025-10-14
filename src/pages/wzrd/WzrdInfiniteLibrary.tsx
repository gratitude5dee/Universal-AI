
import React, { useCallback, useEffect, useState } from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Infinity, Save, Share, Download, Loader2, Plus } from "lucide-react";
import CreativeCanvas from "@/components/canvas/CreativeCanvas";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ensureBoardForUser, type BoardRow } from "./boardLoader";

const WzrdInfiniteLibrary = () => {
  const [isDemo, setIsDemo] = useState(true); // Start in demo mode
  const { toast } = useToast();
  const { user } = useAuth();
  const [boards, setBoards] = useState<BoardRow[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [isBoardsLoading, setIsBoardsLoading] = useState(true);
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);

  const handleSave = () => {
    toast({
      title: "Canvas saved",
      description: "Your creative canvas has been saved!",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share link copied",
      description: "Canvas share link copied to clipboard!",
    });
  };

  const handleExport = () => {
    toast({
      title: "Exporting canvas",
      description: "Preparing your canvas for download...",
    });
  };

  const createBoard = useCallback(async (): Promise<BoardRow | null> => {
    if (!user) return null;

    setIsCreatingBoard(true);
    try {
      const { data, error } = await supabase
        .from("boards")
        .insert({
          title: "Untitled Canvas",
          user_id: user.id,
          is_public: false,
          canvas_data: {
            nodes: [],
            edges: [],
            viewport: { x: 0, y: 0, zoom: 1 },
          },
        })
        .select()
        .single();

      if (error) throw error;

      setBoards((prev) => [data, ...prev.filter((board) => board.id !== data.id)]);
      setSelectedBoardId(data.id);
      toast({
        title: "Canvas ready",
        description: "A fresh board has been created for you.",
      });

      return data;
    } catch (error) {
      console.error("Error creating board", error);
      toast({
        title: "Unable to create board",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsCreatingBoard(false);
    }
  }, [toast, user]);

  const loadBoards = useCallback(async () => {
    if (!user) {
      setBoards([]);
      setSelectedBoardId(null);
      setIsBoardsLoading(false);
      return;
    }

    setIsBoardsLoading(true);
    try {
      const result = await ensureBoardForUser({
        fetchBoards: async () => {
          const { data, error } = await supabase
            .from("boards")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (error) {
            throw error;
          }

          return data ?? [];
        },
        createBoard,
      });

      setBoards(result.boards);
      setSelectedBoardId(result.activeBoardId);
    } catch (error) {
      console.error("Error loading boards", error);
      toast({
        title: "Unable to load canvases",
        description: "Please refresh the page to try again.",
        variant: "destructive",
      });
    } finally {
      setIsBoardsLoading(false);
    }
  }, [createBoard, toast, user]);

  useEffect(() => {
    void loadBoards();
  }, [loadBoards]);

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Infinity className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Infinite Canvas</h1>
              <p className="text-sm text-white/70">
                {isDemo ? "Demo Mode - Start creating!" : "Creative Workspace"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="flex items-center gap-2">
              <Select
                value={selectedBoardId ?? undefined}
                onValueChange={setSelectedBoardId}
                disabled={isBoardsLoading || boards.length === 0}
              >
                <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder={isBoardsLoading ? "Loading canvases..." : "Select a canvas"} />
                </SelectTrigger>
                <SelectContent className="bg-studio-clay text-white">
                  {boards.map((board) => (
                    <SelectItem key={board.id} value={board.id}>
                      {board.title || "Untitled Canvas"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={createBoard}
                disabled={isCreatingBoard || isBoardsLoading}
                className="text-white border-white/30 hover:bg-white/10"
              >
                {isCreatingBoard ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                New Canvas
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="text-white border-white/30 hover:bg-white/10"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="text-white border-white/30 hover:bg-white/10"
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="text-white border-white/30 hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative">
          {isBoardsLoading || !selectedBoardId ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-white/80">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm">Preparing your canvas workspace...</p>
            </div>
          ) : (
            <CreativeCanvas boardId={selectedBoardId} isReadOnly={false} />
          )}

          {/* Welcome overlay for first-time users */}
          {isDemo && (
            <div className="absolute top-4 right-4 z-50">
              <Card className="p-4 bg-white/90 backdrop-blur-sm border-white/20 shadow-lg max-w-sm">
                <h3 className="font-semibold text-studio-clay mb-2">Welcome to Infinite Canvas!</h3>
                <p className="text-sm text-studio-clay/80 mb-3">
                  Use the toolbar on the left to add elements. Drag, connect, and organize your ideas freely.
                </p>
                <Button
                  size="sm"
                  onClick={() => setIsDemo(false)}
                  className="bg-studio-accent hover:bg-studio-accent/90 text-white w-full"
                >
                  Got it!
                </Button>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WzrdInfiniteLibrary;
