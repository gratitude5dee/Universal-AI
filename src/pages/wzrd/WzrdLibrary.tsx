
import React from "react";
import { Content } from "@/components/ui/content";
import { BookOpen } from "lucide-react";
import Ambient from "@/components/ui/ambient";

const WzrdLibrary = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Add Ambient component with CloudShader */}
      <Ambient showAsciiStreams={true} />
      
      <div className="relative z-10">
        <Content title="WZRD.tech Library" subtitle="Access our vast collection of magical knowledge and resources">
          <div className="glass-card p-6">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-2xl mr-4">
                <BookOpen className="h-8 w-8 text-purple-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Library</h2>
                <p className="text-muted-foreground">Explore our collection of magical knowledge</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <div className="bg-white p-6 rounded-xl border border-studio-sand/30">
                <h3 className="text-lg font-medium mb-2">Research Papers</h3>
                <p className="text-sm text-studio-clay">Access cutting-edge research in magical technologies</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-studio-sand/30">
                <h3 className="text-lg font-medium mb-2">Tutorials & Guides</h3>
                <p className="text-sm text-studio-clay">Step-by-step instructions for mastering wizardry tools</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-studio-sand/30">
                <h3 className="text-lg font-medium mb-2">Case Studies</h3>
                <p className="text-sm text-studio-clay">Real-world applications of WZRD.tech solutions</p>
              </div>
            </div>
          </div>
        </Content>
      </div>
    </div>
  );
};

export default WzrdLibrary;
