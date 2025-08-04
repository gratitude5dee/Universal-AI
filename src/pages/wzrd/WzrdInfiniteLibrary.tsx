
import React, { useState } from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Content } from "@/components/ui/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Infinity, Plus, Folder } from "lucide-react";
import CreativeCanvas from "@/components/canvas/CreativeCanvas";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const WzrdInfiniteLibrary = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [currentBoardId, setCurrentBoardId] = useState<string>('');
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const createNewCanvas = async () => {
    if (!newBoardTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your canvas",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('boards')
        .insert({
          title: newBoardTitle.trim(),
          description: 'Creative Canvas workspace',
          user_id: userData.user?.id!,
          canvas_data: {
            nodes: [],
            edges: [],
            viewport: { x: 0, y: 0, zoom: 1 }
          }
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentBoardId(data.id);
      setShowCanvas(true);
      setNewBoardTitle('');
      
      toast({
        title: "Canvas created",
        description: "Your new creative canvas is ready!",
      });
    } catch (error) {
      toast({
        title: "Error creating canvas",
        description: "Failed to create new canvas",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (showCanvas) {
    return (
      <DashboardLayout>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h1 className="text-xl font-semibold text-white">Creative Canvas</h1>
            <Button
              variant="outline"
              onClick={() => setShowCanvas(false)}
              className="text-white border-white/30 hover:bg-white/10"
            >
              Back to Library
            </Button>
          </div>
          <div className="flex-1">
            <CreativeCanvas boardId={currentBoardId} />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Content title="WZRD.tech Infinite Canvas" subtitle="Create and explore an endless creative workspace">
        <div className="space-y-6">
          {/* Create New Canvas */}
          <Card className="glass-card p-6">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-2xl mr-4">
                <Plus className="h-8 w-8 text-purple-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white">Create New Canvas</h2>
                <p className="text-white/80">Start a new creative workspace</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Input
                placeholder="Enter canvas title..."
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createNewCanvas()}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button
                onClick={createNewCanvas}
                disabled={isCreating || !newBoardTitle.trim()}
                className="bg-studio-accent hover:bg-studio-accent/90 text-white"
              >
                {isCreating ? 'Creating...' : 'Create Canvas'}
              </Button>
            </div>
          </Card>

          {/* Features Overview */}
          <Card className="glass-card p-6">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-2xl mr-4">
                <Infinity className="h-8 w-8 text-purple-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Infinite Canvas Features</h2>
                <p className="text-white/80">Unleash your creativity with unlimited space</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <h3 className="text-lg font-medium mb-2 text-white">Creative Workspace</h3>
                <p className="text-sm text-gray-300">Drag, drop, and organize your ideas in an infinite space with custom nodes</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <h3 className="text-lg font-medium mb-2 text-white">Visual Elements</h3>
                <p className="text-sm text-gray-300">Add text, images, tasks, and moodboards to your canvas</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <h3 className="text-lg font-medium mb-2 text-white">Auto-Save</h3>
                <p className="text-sm text-gray-300">Your work is automatically saved as you create</p>
              </div>
            </div>
          </Card>
        </div>
      </Content>
    </DashboardLayout>
  );
};

export default WzrdInfiniteLibrary;
