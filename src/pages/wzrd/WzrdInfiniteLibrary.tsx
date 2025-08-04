
import React from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Content } from "@/components/ui/content";
import { Infinity } from "lucide-react";

const WzrdInfiniteLibrary = () => {
  return (
    <DashboardLayout>
      <Content title="WZRD.tech Infinite Canvas" subtitle="Create and explore an endless creative workspace">
        <div className="glass-card p-6">
          <div className="flex items-center mb-4">
            <div className="bg-studio-highlight p-3 rounded-2xl mr-4">
              <Infinity className="h-8 w-8 text-studio-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Infinite Canvas</h2>
              <p className="text-muted-foreground">Limitless creative workspace for your ideas</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-xl border border-studio-sand/30">
              <h3 className="text-lg font-medium mb-2 text-blue-darker">Creative Workspace</h3>
              <p className="text-sm text-blue-dark">An infinite canvas for brainstorming, designing, and organizing your creative projects</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-studio-sand/30">
              <h3 className="text-lg font-medium mb-2 text-blue-darker">Collaborative Tools</h3>
              <p className="text-sm text-blue-dark">Real-time collaboration features for teams to work together seamlessly</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-studio-sand/30">
              <h3 className="text-lg font-medium mb-2 text-blue-darker">Visual Organization</h3>
              <p className="text-sm text-blue-dark">Organize ideas, concepts, and projects in an intuitive visual format</p>
            </div>
          </div>
        </div>
      </Content>
    </DashboardLayout>
  );
};

export default WzrdInfiniteLibrary;
