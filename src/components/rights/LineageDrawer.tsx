import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, ExternalLink, GitBranch, Eye, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNetwork } from "@/context/NetworkContext";

interface IPNode {
  id: string;
  name: string;
  type: "parent" | "ancestor" | "current" | "child";
  depth: number;
  revenue: number;
  licensees: number;
}

interface LineageDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockNodes: IPNode[] = [
  { id: "1", name: "Original Genesis", type: "ancestor", depth: 3, revenue: 5000, licensees: 12 },
  { id: "2", name: "Foundation Layer", type: "parent", depth: 2, revenue: 8500, licensees: 8 },
  { id: "3", name: "The Universal Dream", type: "current", depth: 1, revenue: 12000, licensees: 24 },
  { id: "4", name: "Dream Remix #1", type: "child", depth: 0, revenue: 2500, licensees: 5 },
  { id: "5", name: "Dream Remix #2", type: "child", depth: 0, revenue: 1800, licensees: 3 },
];

export const LineageDrawer = ({ isOpen, onClose }: LineageDrawerProps) => {
  const { currentNetwork } = useNetwork();
  const [selectedNode, setSelectedNode] = React.useState<IPNode>(mockNodes[2]);

  const getNodeColor = (type: IPNode['type']) => {
    switch (type) {
      case "ancestor": return "fill-purple-500/30 stroke-purple-500";
      case "parent": return "fill-blue-500/30 stroke-blue-500";
      case "current": return "fill-primary/40 stroke-primary";
      case "child": return "fill-green-500/30 stroke-green-500";
    }
  };

  const getDepthBadge = (depth: number) => {
    if (depth === 0) return "Derivative";
    if (depth === 1) return "Original";
    return `${depth}${depth === 2 ? 'nd' : depth === 3 ? 'rd' : 'th'} Gen`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25 }}
        className="relative ml-auto w-full max-w-6xl h-full bg-background border-l border-white/10 shadow-2xl overflow-hidden flex"
      >
        {/* Left Panel - Graph */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <GitBranch className="w-6 h-6 text-primary" />
                IP Lineage
              </h2>
              <p className="text-sm text-white/70 mt-1">Full relationship graph and provenance</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Graph Visualization */}
          <div className="glass-card border border-white/10 rounded-xl p-6 mb-6">
            <svg width="100%" height="500" className="overflow-visible">
              {/* Connections */}
              <line x1="250" y1="400" x2="250" y2="300" stroke="rgba(155,135,245,0.3)" strokeWidth="2" />
              <line x1="250" y1="300" x2="250" y2="200" stroke="rgba(51,195,240,0.3)" strokeWidth="2" />
              <line x1="250" y1="200" x2="250" y2="100" stroke="rgba(147,51,234,0.3)" strokeWidth="2" />
              <line x1="250" y1="100" x2="150" y2="50" stroke="rgba(34,197,94,0.3)" strokeWidth="2" />
              <line x1="250" y1="100" x2="350" y2="50" stroke="rgba(34,197,94,0.3)" strokeWidth="2" />

              {/* Nodes */}
              {mockNodes.map((node, index) => {
                const x = node.type === "child" 
                  ? (index === 3 ? 150 : 350)
                  : 250;
                const y = node.type === "ancestor" ? 400 
                  : node.type === "parent" ? 300 
                  : node.type === "current" ? 200 
                  : node.type === "child" && index === 3 ? 50 
                  : 50;
                const size = node.type === "current" ? 40 : 30;

                return (
                  <g 
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className="cursor-pointer group"
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={size}
                      className={`${getNodeColor(node.type)} transition-all group-hover:stroke-[3]`}
                      strokeWidth="2"
                    />
                    {node.type === "current" && (
                      <circle
                        cx={x}
                        cy={y}
                        r={size + 8}
                        className="fill-none stroke-primary/30"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      >
                        <animate
                          attributeName="r"
                          from={size + 8}
                          to={size + 12}
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="1"
                          to="0"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                    <text
                      x={x}
                      y={y + size + 20}
                      textAnchor="middle"
                      className="text-xs fill-white/70 font-medium"
                    >
                      {node.name.length > 15 ? node.name.slice(0, 12) + "..." : node.name}
                    </text>
                    <text
                      x={x}
                      y={y + size + 35}
                      textAnchor="middle"
                      className="text-[10px] fill-white/50"
                    >
                      {getDepthBadge(node.depth)}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-500/30 border-2 border-purple-500" />
                <span className="text-xs text-white/70">Ancestor</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500/30 border-2 border-blue-500" />
                <span className="text-xs text-white/70">Parent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-primary/40 border-2 border-primary" />
                <span className="text-xs text-white/70">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500/30 border-2 border-green-500" />
                <span className="text-xs text-white/70">Derivative</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <a
              href={`${currentNetwork.ipExplorerUrl}/ip/${selectedNode.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 glass-card border border-white/10 rounded-lg hover:bg-white/5 transition-all"
            >
              <span className="text-sm text-white">Open in IP Explorer</span>
              <ExternalLink className="w-4 h-4 text-white/50" />
            </a>
            <button className="flex items-center justify-center gap-2 px-4 py-3 glass-card border border-white/10 rounded-lg hover:bg-white/5 transition-all">
              <Eye className="w-4 h-4 text-white/70" />
              <span className="text-sm text-white">View License</span>
            </button>
          </div>
        </div>

        {/* Right Panel - Details */}
        <div className="w-96 border-l border-white/10 p-6 overflow-y-auto bg-white/5">
          <h3 className="text-lg font-medium text-white mb-4">Node Details</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs text-white/50 mb-1">Name</p>
              <p className="text-sm font-medium text-white">{selectedNode.name}</p>
            </div>

            <div>
              <p className="text-xs text-white/50 mb-1">Type</p>
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                selectedNode.type === "ancestor" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" :
                selectedNode.type === "parent" ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" :
                selectedNode.type === "current" ? "bg-primary/20 text-primary border border-primary/30" :
                "bg-green-500/20 text-green-300 border border-green-500/30"
              }`}>
                {selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)}
              </span>
            </div>

            <div>
              <p className="text-xs text-white/50 mb-1">Generation</p>
              <p className="text-sm text-white">{getDepthBadge(selectedNode.depth)}</p>
            </div>

            <div className="pt-4 border-t border-white/10">
              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                Revenue & Activity
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/70">Total Revenue</span>
                  <span className="text-sm font-medium text-green-400">${selectedNode.revenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/70">Active Licensees</span>
                  <span className="text-sm font-medium text-white">{selectedNode.licensees}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <h4 className="text-sm font-medium text-white mb-3">Royalty Stack</h4>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-xs text-white/70 mb-2">Revenue flows through:</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70">Creator</span>
                    <span className="text-white">70%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70">Collaborators</span>
                    <span className="text-white">30%</span>
                  </div>
                </div>
              </div>
              <button className="mt-3 text-xs text-primary hover:text-primary/80 transition-colors">
                Explain this split →
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
