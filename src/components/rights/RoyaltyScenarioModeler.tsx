
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  BarChart3, 
  Settings, 
  Sliders, 
  Save, 
  Download,
  BookOpen,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

interface Collaborator {
  id: string;
  name: string;
  role: string;
  percentage: number;
  color: string;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  projectedRevenue: number;
  platformFees: number;
  collaborators: Collaborator[];
}

const RoyaltyScenarioModeler = () => {
  const [activeScenario, setActiveScenario] = useState<string>("standard");
  const [editMode, setEditMode] = useState(false);
  const [hoverInfo, setHoverInfo] = useState<string | null>(null);
  
  const scenarios: { [key: string]: Scenario } = {
    standard: {
      id: "standard",
      name: "Standard Distribution",
      description: "Default royalty distribution based on original collaboration agreement",
      projectedRevenue: 5000,
      platformFees: 500,
      collaborators: [
        { id: "c1", name: "You", role: "Creator", percentage: 70, color: "#9b87f5" },
        { id: "c2", name: "Alex Rivera", role: "Visual", percentage: 15, color: "#33C3F0" },
        { id: "c3", name: "Sam Taylor", role: "Narrative", percentage: 15, color: "#F97316" }
      ]
    },
    expanded: {
      id: "expanded",
      name: "Expanded Team",
      description: "Distribution model including additional collaborators for extended project",
      projectedRevenue: 8000,
      platformFees: 800,
      collaborators: [
        { id: "c1", name: "You", role: "Creator", percentage: 55, color: "#9b87f5" },
        { id: "c2", name: "Alex Rivera", role: "Visual", percentage: 10, color: "#33C3F0" },
        { id: "c3", name: "Sam Taylor", role: "Narrative", percentage: 10, color: "#F97316" },
        { id: "c4", name: "Jordan Lee", role: "Marketing", percentage: 15, color: "#10B981" },
        { id: "c5", name: "Taylor Kim", role: "Sound", percentage: 10, color: "#EC4899" }
      ]
    },
    licensing: {
      id: "licensing",
      name: "Licensing Deal",
      description: "Distribution after third-party licensing agreement",
      projectedRevenue: 12000,
      platformFees: 1200,
      collaborators: [
        { id: "c1", name: "You", role: "Creator", percentage: 40, color: "#9b87f5" },
        { id: "c2", name: "Alex Rivera", role: "Visual", percentage: 10, color: "#33C3F0" },
        { id: "c3", name: "Sam Taylor", role: "Narrative", percentage: 10, color: "#F97316" },
        { id: "c6", name: "Universe Studios", role: "Licensee", percentage: 40, color: "#6366F1" }
      ]
    }
  };
  
  const currentScenario = scenarios[activeScenario];
  
  const COLORS = currentScenario.collaborators.map(c => c.color);
  
  const revenuePlatformData = [
    { name: "Gross Revenue", value: currentScenario.projectedRevenue },
    { name: "Platform Fees", value: currentScenario.platformFees },
    { name: "Net Revenue", value: currentScenario.projectedRevenue - currentScenario.platformFees },
  ];
  
  const platformBreakdownData = [
    { name: "Spotify", value: 30 },
    { name: "YouTube", value: 25 },
    { name: "Apple Music", value: 20 },
    { name: "TikTok", value: 15 },
    { name: "Other", value: 10 },
  ];
  
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };
  
  const handleChangeScenario = (id: string) => {
    setActiveScenario(id);
  };
  
  const handleMouseEnter = (info: string) => {
    setHoverInfo(info);
  };
  
  const handleMouseLeave = () => {
    setHoverInfo(null);
  };

  return (
    <div className="space-y-5 mt-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <BarChart3 size={18} className="text-[#9b87f5]" />
          Royalty Scenario Modeling
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditMode(!editMode)}>
            <Settings size={14} className="mr-1" />
            {editMode ? "Save Changes" : "Configure"}
          </Button>
          <Button variant="outline" size="sm">
            <Save size={14} className="mr-1" />
            Save Scenario
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.values(scenarios).map((scenario) => (
          <Button
            key={scenario.id}
            variant={activeScenario === scenario.id ? "default" : "outline"}
            size="sm"
            className={activeScenario === scenario.id ? "bg-[#9b87f5] hover:bg-[#8A78DF]" : ""}
            onClick={() => handleChangeScenario(scenario.id)}
          >
            {scenario.name}
          </Button>
        ))}
      </div>
      
      <div className="p-4 bg-[#F9F8FF] rounded-lg">
        <p className="text-sm text-studio-clay mb-3">{currentScenario.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Royalty Splits Pie Chart */}
          <div className="glass-card p-4 rounded-lg border border-white/10 backdrop-blur-md">
            <h4 className="text-sm font-medium mb-3">Royalty Distribution</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentScenario.collaborators}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {currentScenario.collaborators.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Revenue Breakdown */}
          <div className="glass-card p-4 rounded-lg border border-white/10 backdrop-blur-md">
            <h4 className="text-sm font-medium mb-3">Revenue Breakdown</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenuePlatformData}
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Bar dataKey="value" fill="#9b87f5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Platform Distribution */}
          <div className="glass-card p-4 rounded-lg border border-white/10 backdrop-blur-md">
            <h4 className="text-sm font-medium mb-3">Platform Distribution</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {platformBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 40}, 70%, 60%)`} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">Projected Earnings by Collaborator</h4>
          <div className="space-y-3">
            {currentScenario.collaborators.map((collaborator) => {
              const earnings = (currentScenario.projectedRevenue - currentScenario.platformFees) * (collaborator.percentage / 100);
              return (
                <div key={collaborator.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: collaborator.color }}
                    ></div>
                    <span className="text-sm">{collaborator.name} ({collaborator.role})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{collaborator.percentage}%</span>
                    <span className="font-medium">{formatCurrency(earnings)}</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-studio-sand/30 flex justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Projected Total:</span>
              <span className="font-bold">{formatCurrency(currentScenario.projectedRevenue)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">After Platform Fees:</span>
              <span className="font-bold">{formatCurrency(currentScenario.projectedRevenue - currentScenario.platformFees)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs flex items-center"
          onMouseEnter={() => handleMouseEnter("legal")}
          onMouseLeave={handleMouseLeave}
        >
          <BookOpen size={14} className="mr-1" />
          Legal Implications
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs flex items-center"
          onMouseEnter={() => handleMouseEnter("tax")}
          onMouseLeave={handleMouseLeave}
        >
          <AlertCircle size={14} className="mr-1" />
          Tax Considerations
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs flex items-center"
        >
          <Download size={14} className="mr-1" />
          Export Model
        </Button>
      </div>
      
      {hoverInfo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="p-3 bg-[#F1F0FB] rounded-lg text-sm text-studio-clay mt-2"
        >
          {hoverInfo === "legal" ? (
            <div className="flex items-start gap-2">
              <BookOpen size={16} className="text-[#9b87f5] mt-0.5" />
              <p>This royalty structure creates legally binding obligations. Changes to the agreement require consent from all parties with &gt;10% share. Failure to distribute according to this model may result in breach of contract.</p>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-[#9b87f5] mt-0.5" />
              <p>Income from this royalty model may be subject to different tax treatments based on jurisdiction. In some regions, royalty income is taxed differently than regular income. Consult with a tax professional for optimized strategies.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default RoyaltyScenarioModeler;
