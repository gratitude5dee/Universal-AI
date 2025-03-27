
import React from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Content } from "@/components/ui/content";
import { BookOpen } from "lucide-react";

const WzrdLibrary = () => {
  return (
    <DashboardLayout>
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
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <h3 className="text-lg font-medium mb-2">Research Papers</h3>
              <p className="text-sm text-gray-300">Access cutting-edge research in magical technologies</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <h3 className="text-lg font-medium mb-2">Tutorials & Guides</h3>
              <p className="text-sm text-gray-300">Step-by-step instructions for mastering wizardry tools</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <h3 className="text-lg font-medium mb-2">Case Studies</h3>
              <p className="text-sm text-gray-300">Real-world applications of WZRD.tech solutions</p>
            </div>
          </div>
        </div>
      </Content>
    </DashboardLayout>
  );
};

export default WzrdLibrary;
