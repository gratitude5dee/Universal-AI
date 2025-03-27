
import React from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Content } from "@/components/ui/content";
import { Headphones } from "lucide-react";

const WzrdPodcasts = () => {
  return (
    <DashboardLayout>
      <Content title="WZRD.tech Generative Podcasts" subtitle="Listen to AI-generated podcasts on fascinating magical topics">
        <div className="glass-card p-6">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-2xl mr-4">
              <Headphones className="h-8 w-8 text-purple-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Generative Podcasts</h2>
              <p className="text-muted-foreground">AI-powered audio content on magical topics</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-xl border border-studio-sand/30">
              <h3 className="text-lg font-medium mb-2 text-blue-darker">Personalized Podcasts</h3>
              <p className="text-sm text-blue-dark">Engaging discussions between AI hosts on magical technologies</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-studio-sand/30">
              <h3 className="text-lg font-medium mb-2 text-blue-darker">Generate with ANY Voice</h3>
              <p className="text-sm text-blue-dark">Deep dives into the technical aspects of modern spellcrafting</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-studio-sand/30">
              <h3 className="text-lg font-medium mb-2 text-blue-darker">Safe & Private Storage</h3>
              <p className="text-sm text-blue-dark">Exploring the potential future developments in magical technologies</p>
            </div>
          </div>
        </div>
      </Content>
    </DashboardLayout>
  );
};

export default WzrdPodcasts;
