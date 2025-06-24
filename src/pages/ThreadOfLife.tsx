import React from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Trees, GitBranch, ArrowUpRight, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const ThreadOfLife = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white text-shadow-sm">Thread of Life</h1>
          <p className="text-white/80 text-shadow-sm">Track the lineage and transformations of your real-world assets</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-5 shadow-card-glow hover:bg-white/15 transition-all duration-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#22c55e]/20 flex items-center justify-center">
                <Trees className="w-5 h-5 text-[#22c55e]" />
              </div>
              <h3 className="font-medium text-white text-shadow-sm">Asset Lineage</h3>
            </div>
            <p className="text-sm text-white/80 text-shadow-sm">Track the origins and transformations of your physical assets</p>
          </div>
          
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-5 shadow-card-glow hover:bg-white/15 transition-all duration-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#6366f1]/20 flex items-center justify-center">
                <GitBranch className="w-5 h-5 text-[#6366f1]" />
              </div>
              <h3 className="font-medium text-white text-shadow-sm">Transformation Records</h3>
            </div>
            <p className="text-sm text-white/80 text-shadow-sm">Document every change in your asset's lifecycle</p>
          </div>
          
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-5 shadow-card-glow hover:bg-white/15 transition-all duration-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#f59e0b]/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#f59e0b]" />
              </div>
              <h3 className="font-medium text-white text-shadow-sm">Historical Timeline</h3>
            </div>
            <p className="text-sm text-white/80 text-shadow-sm">View the complete history of your asset through time</p>
          </div>
        </div>

        <Tabs defaultValue="lineage" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow">
            <TabsTrigger value="lineage" className="text-white data-[state=active]:bg-studio-accent data-[state=active]:text-white">Asset Lineage</TabsTrigger>
            <TabsTrigger value="transformations" className="text-white data-[state=active]:bg-studio-accent data-[state=active]:text-white">Transformations</TabsTrigger>
            <TabsTrigger value="timeline" className="text-white data-[state=active]:bg-studio-accent data-[state=active]:text-white">Timeline</TabsTrigger>
          </TabsList>
          <TabsContent value="lineage" className="pt-4">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 shadow-card-glow">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-white text-shadow-sm">Asset Lineage Visualization</h3>
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              
              <div className="flex justify-center items-center h-64 bg-white/5 rounded-lg border border-dashed border-white/20">
                <p className="text-white/70 text-shadow-sm">Select an asset to view its lineage tree</p>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="backdrop-blur-md bg-white/10 p-4 rounded-lg border border-white/20 shadow-card-glow">
                  <h4 className="font-medium mb-2 text-white text-shadow-sm">Asset Selection</h4>
                  <p className="text-sm text-white/80 text-shadow-sm">Choose from your collection of registered assets</p>
                  <Button className="w-full mt-4 bg-studio-accent hover:bg-studio-accent/90 text-white" size="sm">Browse Assets</Button>
                </div>
                
                <div className="backdrop-blur-md bg-white/10 p-4 rounded-lg border border-white/20 shadow-card-glow">
                  <h4 className="font-medium mb-2 text-white text-shadow-sm">Lineage Depth</h4>
                  <p className="text-sm text-white/80 text-shadow-sm">Determine how many generations to display in the visualization</p>
                  <div className="flex items-center justify-between mt-4">
                    <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">1 Gen</Button>
                    <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">3 Gen</Button>
                    <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">All</Button>
                  </div>
                </div>
                
                <div className="backdrop-blur-md bg-white/10 p-4 rounded-lg border border-white/20 shadow-card-glow">
                  <h4 className="font-medium mb-2 text-white text-shadow-sm">View Options</h4>
                  <p className="text-sm text-white/80 text-shadow-sm">Customize the display of your asset lineage</p>
                  <Button className="w-full mt-4" size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">Customize View</Button>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="transformations" className="pt-4">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 shadow-card-glow">
              <h3 className="text-lg font-medium mb-6 text-white text-shadow-sm">Transformation Records</h3>
              <p className="text-white/80 text-shadow-sm mb-4">This tab will display the transformation records for your assets.</p>
            </div>
          </TabsContent>
          <TabsContent value="timeline" className="pt-4">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 shadow-card-glow">
              <h3 className="text-lg font-medium mb-6 text-white text-shadow-sm">Historical Timeline</h3>
              <p className="text-white/80 text-shadow-sm mb-4">This tab will display the complete historical timeline for your assets.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ThreadOfLife;