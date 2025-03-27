
import React from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Content } from "@/components/ui/content";
import { Brain } from "lucide-react";

const WzrdResearch = () => {
  return (
    <DashboardLayout>
      <Content title="WZRD.tech DeepResearch" subtitle="Explore the cutting edge of magical technology research">
        <div className="glass-card p-6">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-2xl mr-4">
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">DeepResearch</h2>
              <p className="text-muted-foreground">Advanced research into magical technologies</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-xl border border-studio-sand/30">
              <h3 className="text-lg font-medium mb-2 text-blue-darker">Quantum Enchantment</h3>
              <p className="text-sm text-blue-dark">Breakthrough research on quantum-powered enchantment technologies</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-studio-sand/30">
              <h3 className="text-lg font-medium mb-2 text-blue-darker">Neural Spellcraft</h3>
              <p className="text-sm text-blue-dark">Innovative approaches to neural network-based spell creation</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-studio-sand/30">
              <h3 className="text-lg font-medium mb-2 text-blue-darker">Arcane Analytics</h3>
              <p className="text-sm text-blue-dark">Advanced data analytics for magical performance optimization</p>
            </div>
          </div>
        </div>
      </Content>
    </DashboardLayout>
  );
};

export default WzrdResearch;
