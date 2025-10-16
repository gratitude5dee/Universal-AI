import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Settings, Download, Move, Hand, Info, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Cluster {
  id: number;
  points: number;
  coverage: number;
  color: string;
  centroid: [number, number, number];
  characteristics: {
    category?: string;
    priority?: string;
    sentiment?: string;
  };
}

interface Particle {
  x: number;
  y: number;
  z: number;
  clusterId: number;
  baseX: number;
  baseY: number;
  baseZ: number;
}

const clusters: Cluster[] = [
  { id: 1, points: 11, coverage: 100, color: '#06B6D4', centroid: [150, 200, 0], characteristics: { category: 'Hardware', priority: 'High' } },
  { id: 3, points: 16, coverage: 75, color: '#8B5CF6', centroid: [350, 250, 20], characteristics: { category: 'Software', priority: 'Medium' } },
  { id: 2, points: 22, coverage: 68.18, color: '#10B981', centroid: [250, 150, -10], characteristics: { category: 'Network', priority: 'Low' } },
  { id: 10, points: 8, coverage: 50, color: '#F59E0B', centroid: [450, 180, 15], characteristics: { category: 'Other', priority: 'High' } },
];

export const ClusterAnalysis = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showFireworks, setShowFireworks] = useState(true);
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    // Initialize particles for each cluster
    const newParticles: Particle[] = [];
    clusters.forEach(cluster => {
      for (let i = 0; i < cluster.points; i++) {
        const angle = (Math.PI * 2 * i) / cluster.points;
        const radius = 30 + Math.random() * 20;
        const offsetX = Math.cos(angle) * radius;
        const offsetY = Math.sin(angle) * radius;
        const offsetZ = (Math.random() - 0.5) * 20;
        
        newParticles.push({
          x: cluster.centroid[0] + offsetX,
          y: cluster.centroid[1] + offsetY,
          z: cluster.centroid[2] + offsetZ,
          clusterId: cluster.id,
          baseX: cluster.centroid[0] + offsetX,
          baseY: cluster.centroid[1] + offsetY,
          baseZ: cluster.centroid[2] + offsetZ,
        });
      }
    });
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 14, 26, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid if enabled
      if (showGrid) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 50) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
          ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 50) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(canvas.width, i);
          ctx.stroke();
        }
      }

      // Draw particles with glow effect
      particles.forEach(particle => {
        const cluster = clusters.find(c => c.id === particle.clusterId);
        if (!cluster) return;

        // Animate particles with slight floating
        const time = Date.now() * 0.001;
        const floatX = particle.baseX + Math.sin(time + particle.x) * 2;
        const floatY = particle.baseY + Math.cos(time + particle.y) * 2;
        
        // Apply simple 3D projection
        const scale = 1 + (particle.z / 100);
        const projectedX = floatX * scale;
        const projectedY = floatY * scale;
        const size = 4 * scale;

        // Glow effect
        const gradient = ctx.createRadialGradient(projectedX, projectedY, 0, projectedX, projectedY, size * 3);
        gradient.addColorStop(0, cluster.color);
        gradient.addColorStop(0.5, cluster.color + '40');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(projectedX, projectedY, size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Solid particle
        ctx.fillStyle = cluster.color;
        ctx.beginPath();
        ctx.arc(projectedX, projectedY, size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw cluster labels if enabled
      if (showLabels) {
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        clusters.forEach(cluster => {
          ctx.fillStyle = cluster.color;
          ctx.fillText(`Cluster ${cluster.id}`, cluster.centroid[0], cluster.centroid[1] - 50);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.fillText(`${cluster.points} points`, cluster.centroid[0], cluster.centroid[1] - 35);
        });
      }

      // Draw connecting lines between clusters (optional)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < clusters.length; i++) {
        for (let j = i + 1; j < clusters.length; j++) {
          ctx.beginPath();
          ctx.moveTo(clusters[i].centroid[0], clusters[i].centroid[1]);
          ctx.lineTo(clusters[j].centroid[0], clusters[j].centroid[1]);
          ctx.stroke();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles, showGrid, showLabels, showFireworks]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[hsl(var(--accent-cyan))] via-[hsl(var(--accent-blue))] to-[hsl(var(--accent-purple))] bg-clip-text text-transparent">
              Cluster Analysis
            </h2>
            <p className="text-sm text-[hsl(var(--text-secondary))] mt-1">
              Explore data patterns and anomalies in 3D space
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>

        {/* Main Visualization Area */}
        <div className="grid grid-cols-[240px_1fr] gap-4">
          {/* Sidebar */}
          <div className="space-y-4">
            {/* Clusters List */}
            <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[hsl(var(--text-primary))]">CLUSTERS</h3>
                <Button variant="ghost" size="sm" className="h-6 text-xs">
                  Sort
                </Button>
              </div>
              
              <div className="space-y-2">
                {clusters.map((cluster) => (
                  <motion.button
                    key={cluster.id}
                    onClick={() => setSelectedCluster(cluster)}
                    className="w-full backdrop-blur-lg bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 transition-all duration-200 text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[hsl(var(--text-primary))]">
                        Cluster {cluster.id}
                      </span>
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cluster.color, boxShadow: `0 0 8px ${cluster.color}` }}
                      />
                    </div>
                    <div className="text-xs text-[hsl(var(--text-tertiary))] space-y-1">
                      <div>{cluster.points} pts</div>
                      <div>{cluster.coverage}%</div>
                    </div>
                    <div className="mt-2 w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${cluster.coverage}%`,
                          backgroundColor: cluster.color
                        }}
                      />
                    </div>
                  </motion.button>
                ))}
              </div>

              <Button size="sm" variant="outline" className="w-full mt-4">
                + New
              </Button>
            </div>

            {/* Display Options */}
            <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-[hsl(var(--text-primary))] mb-3">DISPLAY</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-[hsl(var(--text-secondary))] cursor-pointer">
                  <input 
                    type="radio" 
                    name="colorBy" 
                    defaultChecked 
                    className="accent-[hsl(var(--accent-cyan))]"
                  />
                  Primary
                </label>
                <label className="flex items-center gap-2 text-sm text-[hsl(var(--text-secondary))] cursor-pointer">
                  <input 
                    type="radio" 
                    name="colorBy" 
                    className="accent-[hsl(var(--accent-cyan))]"
                  />
                  Corpus
                </label>
              </div>
              
              <Button size="sm" variant="outline" className="w-full mt-4 gap-2">
                <Download className="w-3 h-3" />
                Export
              </Button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="relative">
            <canvas 
              ref={canvasRef}
              width={800}
              height={500}
              className="w-full h-[500px] rounded-xl border border-white/10"
              style={{
                background: 'linear-gradient(135deg, #0A0E1A 0%, #1A1033 50%, #0A0E1A 100%)'
              }}
            />
            
            {/* Top Controls */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <Button size="sm" variant="outline" className="backdrop-blur-xl bg-white/10 border-white/20 gap-2">
                <Move className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" className="backdrop-blur-xl bg-white/10 border-white/20 gap-2">
                <Hand className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" className="backdrop-blur-xl bg-white/10 border-white/20 gap-2">
                <Settings className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" className="backdrop-blur-xl bg-white/10 border-white/20 gap-2">
                <Info className="w-3 h-3" />
              </Button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-4 left-4 right-4 backdrop-blur-xl bg-white/10 border border-white/10 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs text-[hsl(var(--text-primary))] cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={showFireworks}
                      onChange={(e) => setShowFireworks(e.target.checked)}
                      className="accent-[hsl(var(--accent-cyan))]"
                    />
                    Show Fireworks
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[hsl(var(--text-primary))] cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={showGrid}
                      onChange={(e) => setShowGrid(e.target.checked)}
                      className="accent-[hsl(var(--accent-cyan))]"
                    />
                    Grid
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[hsl(var(--text-primary))] cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={showLabels}
                      onChange={(e) => setShowLabels(e.target.checked)}
                      className="accent-[hsl(var(--accent-cyan))]"
                    />
                    Labels
                  </label>
                </div>
                <Button size="sm" variant="outline" className="gap-2 text-xs">
                  <Download className="w-3 h-3" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Anomaly Detection Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="backdrop-blur-xl bg-white/5 border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-[hsl(var(--warning))]" />
            <h3 className="text-lg font-semibold text-[hsl(var(--text-primary))]">Anomaly Detection</h3>
            <Badge variant="outline" className="ml-auto">5 Detected</Badge>
          </div>

          <div className="space-y-3">
            {[
              { type: 'Isolated Point', input: 'Best restaurants in Cleveland?', distance: '2.4σ', severity: 'high' },
              { type: 'Boundary Case', input: 'Bluetooth headset connects but no sound', distance: '1.2σ', severity: 'medium' },
            ].map((anomaly, idx) => (
              <div key={idx} className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge 
                        variant="outline"
                        className={anomaly.severity === 'high' ? 'border-[hsl(var(--error))] text-[hsl(var(--error))]' : 'border-[hsl(var(--warning))] text-[hsl(var(--warning))]'}
                      >
                        {anomaly.type}
                      </Badge>
                      <span className="text-xs text-[hsl(var(--text-tertiary))]">Distance: {anomaly.distance}</span>
                    </div>
                    <p className="text-sm text-[hsl(var(--text-secondary))]">Input: "{anomaly.input}"</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Button size="sm" variant="outline" className="text-xs">View in 3D</Button>
                  <Button size="sm" variant="outline" className="text-xs">Add to Training</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Cluster Details Modal */}
      <Dialog open={!!selectedCluster} onOpenChange={() => setSelectedCluster(null)}>
        <DialogContent className="backdrop-blur-3xl bg-[hsl(var(--bg-primary))]/90 border border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="text-xl font-bold text-[hsl(var(--text-primary))]">
                Cluster {selectedCluster?.id} Details
              </span>
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: selectedCluster?.color, boxShadow: `0 0 8px ${selectedCluster?.color}` }}
              />
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Statistics */}
            <div>
              <h4 className="text-sm font-semibold text-[hsl(var(--text-secondary))] mb-3">Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="text-xs text-[hsl(var(--text-tertiary))]">Points</div>
                  <div className="text-2xl font-bold text-[hsl(var(--text-primary))] mt-1">{selectedCluster?.points}</div>
                </div>
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="text-xs text-[hsl(var(--text-tertiary))]">Query Coverage</div>
                  <div className="text-2xl font-bold text-[hsl(var(--text-primary))] mt-1">{selectedCluster?.coverage}%</div>
                </div>
              </div>
            </div>

            {/* Characteristics */}
            <div>
              <h4 className="text-sm font-semibold text-[hsl(var(--text-secondary))] mb-3">Characteristics</h4>
              <div className="space-y-2">
                {Object.entries(selectedCluster?.characteristics || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-[hsl(var(--text-tertiary))] capitalize">{key}:</span>
                    <Badge variant="outline">{value}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-white/5">
              <Button size="sm" variant="outline" className="flex-1">View All Points</Button>
              <Button size="sm" variant="outline" className="flex-1">Export Cluster</Button>
              <Button size="sm" variant="outline" className="flex-1">Merge Clusters</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
