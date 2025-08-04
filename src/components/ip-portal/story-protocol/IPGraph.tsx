import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Network, 
  GitBranch, 
  Users, 
  DollarSign, 
  Info,
  Maximize2,
  Filter,
  Search,
  Download,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
interface IPNode {
  id: string;
  title: string;
  type: 'original' | 'derivative' | 'remix' | 'license';
  creator: string;
  x: number;
  y: number;
  connections: string[];
  metadata: {
    registrationDate: Date;
    revenue: number;
    licensees: number;
    status: 'active' | 'pending' | 'expired';
  };
}

interface IPEdge {
  id: string;
  source: string;
  target: string;
  type: 'derivation' | 'license' | 'collaboration' | 'revenue';
  strength: number;
  metadata: {
    date: Date;
    value?: number;
    terms?: string;
  };
}

interface GraphStats {
  totalNodes: number;
  totalRevenue: number;
  activeConnections: number;
  derivativeWorks: number;
}

// Mock data
const mockNodes: IPNode[] = [
  {
    id: 'original-1',
    title: 'Midnight Echoes',
    type: 'original',
    creator: 'Artist One',
    x: 400,
    y: 300,
    connections: ['derivative-1', 'derivative-2', 'license-1'],
    metadata: {
      registrationDate: new Date('2024-01-01'),
      revenue: 15000,
      licensees: 25,
      status: 'active'
    }
  },
  {
    id: 'derivative-1',
    title: 'Midnight Echoes (Remix)',
    type: 'remix',
    creator: 'DJ Remix',
    x: 200,
    y: 150,
    connections: ['original-1'],
    metadata: {
      registrationDate: new Date('2024-01-15'),
      revenue: 3500,
      licensees: 8,
      status: 'active'
    }
  },
  {
    id: 'derivative-2',
    title: 'Echoes Extended',
    type: 'derivative',
    creator: 'Producer X',
    x: 600,
    y: 150,
    connections: ['original-1', 'license-2'],
    metadata: {
      registrationDate: new Date('2024-01-20'),
      revenue: 8200,
      licensees: 12,
      status: 'active'
    }
  },
  {
    id: 'license-1',
    title: 'Sync License A',
    type: 'license',
    creator: 'Media Co',
    x: 300,
    y: 450,
    connections: ['original-1'],
    metadata: {
      registrationDate: new Date('2024-02-01'),
      revenue: 25000,
      licensees: 1,
      status: 'active'
    }
  },
  {
    id: 'license-2',
    title: 'Commercial License B',
    type: 'license',
    creator: 'Brand Corp',
    x: 500,
    y: 450,
    connections: ['derivative-2'],
    metadata: {
      registrationDate: new Date('2024-02-15'),
      revenue: 12000,
      licensees: 1,
      status: 'active'
    }
  }
];

const mockEdges: IPEdge[] = [
  {
    id: 'edge-1',
    source: 'original-1',
    target: 'derivative-1',
    type: 'derivation',
    strength: 0.8,
    metadata: {
      date: new Date('2024-01-15'),
      terms: '10% revenue share'
    }
  },
  {
    id: 'edge-2',
    source: 'original-1',
    target: 'derivative-2',
    type: 'derivation',
    strength: 0.9,
    metadata: {
      date: new Date('2024-01-20'),
      terms: '15% revenue share'
    }
  },
  {
    id: 'edge-3',
    source: 'original-1',
    target: 'license-1',
    type: 'license',
    strength: 1.0,
    metadata: {
      date: new Date('2024-02-01'),
      value: 25000,
      terms: 'Sync license for advertising'
    }
  },
  {
    id: 'edge-4',
    source: 'derivative-2',
    target: 'license-2',
    type: 'license',
    strength: 0.7,
    metadata: {
      date: new Date('2024-02-15'),
      value: 12000,
      terms: 'Commercial use license'
    }
  }
];

const IPGraph: React.FC = () => {
  const [nodes] = useState<IPNode[]>(mockNodes);
  const [edges] = useState<IPEdge[]>(mockEdges);
  const [selectedNode, setSelectedNode] = useState<IPNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const svgRef = useRef<SVGSVGElement>(null);

  const stats: GraphStats = {
    totalNodes: nodes.length,
    totalRevenue: nodes.reduce((sum, node) => sum + node.metadata.revenue, 0),
    activeConnections: edges.length,
    derivativeWorks: nodes.filter(n => n.type === 'derivative' || n.type === 'remix').length
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'original': return '#8B5CF6'; // purple
      case 'derivative': return '#3B82F6'; // blue
      case 'remix': return '#10B981'; // green
      case 'license': return '#F59E0B'; // amber
      default: return '#6B7280';
    }
  };

  const getEdgeColor = (type: string) => {
    switch (type) {
      case 'derivation': return '#8B5CF6';
      case 'license': return '#F59E0B';
      case 'collaboration': return '#10B981';
      case 'revenue': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const filteredNodes = nodes.filter(node => {
    const matchesSearch = node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         node.creator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || node.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const filteredEdges = edges.filter(edge => 
    filteredNodes.some(n => n.id === edge.source) && 
    filteredNodes.some(n => n.id === edge.target)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-xl p-6 border border-white/10 backdrop-blur-md">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">IP Relationship Graph</h2>
            <p className="text-white/70">Visualize connections, derivatives, and revenue flows</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              <Maximize2 className="h-4 w-4 mr-2" />
              Fullscreen
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Network className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-white font-semibold">{stats.totalNodes}</p>
              <p className="text-white/70 text-sm">Total Assets</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <GitBranch className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-semibold">{stats.derivativeWorks}</p>
              <p className="text-white/70 text-sm">Derivatives</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-white font-semibold">{stats.activeConnections}</p>
              <p className="text-white/70 text-sm">Connections</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-white font-semibold">${stats.totalRevenue.toLocaleString()}</p>
              <p className="text-white/70 text-sm">Total Revenue</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="graph" className="w-full">
        <TabsList className="bg-white/10 border border-white/20 rounded-lg">
          <TabsTrigger value="graph" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary">
            Relationship Graph
          </TabsTrigger>
          <TabsTrigger value="tree" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary">
            Derivation Tree
          </TabsTrigger>
          <TabsTrigger value="revenue" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary">
            Revenue Flow
          </TabsTrigger>
        </TabsList>

        <TabsContent value="graph" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Graph Visualization */}
            <div className="lg:col-span-3">
              <Card className="glass-card border-white/10 backdrop-blur-md h-[600px]">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white">Network Visualization</CardTitle>
                    <div className="flex space-x-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                        <Input
                          placeholder="Search nodes..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/50 w-40"
                        />
                      </div>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm"
                      >
                        <option value="all">All Types</option>
                        <option value="original">Original</option>
                        <option value="derivative">Derivative</option>
                        <option value="remix">Remix</option>
                        <option value="license">License</option>
                      </select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 h-full">
                  <svg
                    ref={svgRef}
                    width="100%"
                    height="500"
                    className="overflow-visible"
                    viewBox="0 0 800 500"
                  >
                    {/* Edges */}
                    {filteredEdges.map(edge => {
                      const sourceNode = nodes.find(n => n.id === edge.source);
                      const targetNode = nodes.find(n => n.id === edge.target);
                      if (!sourceNode || !targetNode) return null;

                      return (
                        <line
                          key={edge.id}
                          x1={sourceNode.x}
                          y1={sourceNode.y}
                          x2={targetNode.x}
                          y2={targetNode.y}
                          stroke={getEdgeColor(edge.type)}
                          strokeWidth={edge.strength * 3}
                          strokeOpacity={0.6}
                          className="transition-all duration-300"
                        />
                      );
                    })}

                    {/* Nodes */}
                    {filteredNodes.map(node => (
                      <g key={node.id}>
                        {/* Node Circle */}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={hoveredNode === node.id ? 25 : 20}
                          fill={getNodeColor(node.type)}
                          stroke={selectedNode?.id === node.id ? '#ffffff' : 'transparent'}
                          strokeWidth={3}
                          className="cursor-pointer transition-all duration-300"
                          onMouseEnter={() => setHoveredNode(node.id)}
                          onMouseLeave={() => setHoveredNode(null)}
                          onClick={() => setSelectedNode(node)}
                        />
                        
                        {/* Node Label */}
                        <text
                          x={node.x}
                          y={node.y - 35}
                          textAnchor="middle"
                          className="fill-white text-sm font-medium pointer-events-none"
                        >
                          {node.title.length > 15 ? `${node.title.substring(0, 15)}...` : node.title}
                        </text>
                        
                        {/* Revenue indicator */}
                        {node.metadata.revenue > 0 && (
                          <text
                            x={node.x}
                            y={node.y + 40}
                            textAnchor="middle"
                            className="fill-green-400 text-xs pointer-events-none"
                          >
                            ${node.metadata.revenue.toLocaleString()}
                          </text>
                        )}
                      </g>
                    ))}
                  </svg>
                </CardContent>
              </Card>
            </div>

            {/* Node Details Panel */}
            <div className="space-y-4">
              {selectedNode ? (
                <Card className="glass-card border-white/10 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{selectedNode.title}</CardTitle>
                    <Badge 
                      className="w-fit" 
                      style={{ backgroundColor: getNodeColor(selectedNode.type) }}
                    >
                      {selectedNode.type}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-white/70 text-sm">Creator</p>
                        <p className="text-white">{selectedNode.creator}</p>
                      </div>
                      
                      <div>
                        <p className="text-white/70 text-sm">Registration Date</p>
                        <p className="text-white">{selectedNode.metadata.registrationDate.toLocaleDateString()}</p>
                      </div>
                      
                      <div>
                        <p className="text-white/70 text-sm">Revenue</p>
                        <p className="text-white">${selectedNode.metadata.revenue.toLocaleString()}</p>
                      </div>
                      
                      <div>
                        <p className="text-white/70 text-sm">Licensees</p>
                        <p className="text-white">{selectedNode.metadata.licensees}</p>
                      </div>
                      
                      <div>
                        <p className="text-white/70 text-sm">Connections</p>
                        <p className="text-white">{selectedNode.connections.length}</p>
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="w-full bg-primary hover:bg-primary/90"
                        onClick={() => {
                          // Center the selected node
                          const svg = svgRef.current;
                          if (svg) {
                            const viewBox = `${selectedNode.x - 200} ${selectedNode.y - 150} 400 300`;
                            svg.setAttribute('viewBox', viewBox);
                          }
                        }}
                      >
                        <Maximize2 className="h-4 w-4 mr-2" />
                        Focus Node
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="glass-card border-white/10 backdrop-blur-md">
                  <CardContent className="p-6 text-center">
                    <Info className="h-12 w-12 text-white/50 mx-auto mb-3" />
                    <p className="text-white/70">Click on a node to view details</p>
                  </CardContent>
                </Card>
              )}

              {/* Legend */}
              <Card className="glass-card border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Legend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { type: 'original', label: 'Original Work', color: '#8B5CF6' },
                      { type: 'derivative', label: 'Derivative', color: '#3B82F6' },
                      { type: 'remix', label: 'Remix', color: '#10B981' },
                      { type: 'license', label: 'License', color: '#F59E0B' }
                    ].map(item => (
                      <div key={item.type} className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-white/70 text-sm">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tree" className="mt-6">
          <Card className="glass-card border-white/10 backdrop-blur-md">
            <CardContent className="p-12 text-center">
              <GitBranch className="h-16 w-16 text-white/50 mx-auto mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">Derivation Tree View</h3>
              <p className="text-white/70">Hierarchical view of derivative relationships</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="mt-6">
          <Card className="glass-card border-white/10 backdrop-blur-md">
            <CardContent className="p-12 text-center">
              <DollarSign className="h-16 w-16 text-white/50 mx-auto mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">Revenue Flow Visualization</h3>
              <p className="text-white/70">Track revenue distribution across the IP network</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IPGraph;