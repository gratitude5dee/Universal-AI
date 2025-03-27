
import React from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Content } from "@/components/ui/content";
import { Infinity } from "lucide-react";

const WzrdInfiniteLibrary = () => {
  return (
    <DashboardLayout>
      <Content title="WZRD.tech Infinite Library" subtitle="Explore an endless collection of generated magical knowledge">
        <div className="glass-card p-6">
          <div className="flex items-center mb-4">
            <div className="bg-studio-highlight p-3 rounded-2xl mr-4">
              <Infinity className="h-8 w-8 text-studio-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Infinite Library</h2>
              <p className="text-muted-foreground">Endless knowledge through generative magic</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-xl border border-studio-sand/30">
              <h3 className="text-lg font-medium mb-2 text-blue-darker">Generated Grimoires</h3>
              <p className="text-sm text-blue-dark">Access an infinite collection of magical textbooks on any subject</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-studio-sand/30">
              <h3 className="text-lg font-medium mb-2 text-blue-darker">Personalized Learning</h3>
              <p className="text-sm text-blue-dark">Custom-generated educational content tailored to your interests</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-studio-sand/30">
              <h3 className="text-lg font-medium mb-2 text-blue-darker">Historical Archives</h3>
              <p className="text-sm text-blue-dark">Explore recreated texts from throughout magical history</p>
            </div>
          </div>
        </div>
      </Content>
    </DashboardLayout>
  );
};

export default WzrdInfiniteLibrary;
