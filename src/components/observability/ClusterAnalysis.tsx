import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Download } from "lucide-react";

export const ClusterAnalysis = () => {
  return (
    <div className="space-y-6">
      <Card className="glassmorphism p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Cluster Analysis</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Explore data patterns and anomalies in 3D space
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>

        {/* 3D Visualization Placeholder */}
        <div className="aspect-video rounded-lg bg-gradient-to-br from-accent/5 to-accent/10 border border-border/50 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-studio-accent/10 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-studio-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <p className="text-sm font-medium">3D Cluster Visualization</p>
            <p className="text-xs text-muted-foreground max-w-sm">
              Interactive 3D scatter plot will render here.<br />
              Requires React Three Fiber integration.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span>Show Fireworks</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span>Grid</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span>Labels</span>
            </label>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </Card>

      {/* Cluster List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { id: 1, points: 11, coverage: "100%" },
          { id: 2, points: 22, coverage: "68.18%" },
          { id: 3, points: 16, coverage: "75%" },
          { id: 10, points: 8, coverage: "50%" }
        ].map((cluster) => (
          <Card key={cluster.id} className="glassmorphism p-4 hover:shadow-card-glow transition-all cursor-pointer">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Cluster {cluster.id}</span>
                <div className="w-3 h-3 rounded-full bg-studio-accent" />
              </div>
              <div className="text-sm text-muted-foreground">
                <p>{cluster.points} pts</p>
                <p>{cluster.coverage}</p>
              </div>
              <div className="w-full bg-accent/20 rounded-full h-1.5">
                <div 
                  className="bg-studio-accent h-full rounded-full transition-all" 
                  style={{ width: cluster.coverage }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
