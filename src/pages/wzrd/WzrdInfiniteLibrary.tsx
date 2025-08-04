
import React, { useState } from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Infinity, Save, Share, Download } from "lucide-react";
import CreativeCanvas from "@/components/canvas/CreativeCanvas";
import { useToast } from "@/hooks/use-toast";

const WzrdInfiniteLibrary = () => {
  const [isDemo, setIsDemo] = useState(true); // Start in demo mode
  const { toast } = useToast();

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
          
          <div className="flex items-center gap-2">
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
          <CreativeCanvas isReadOnly={false} />
          
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
