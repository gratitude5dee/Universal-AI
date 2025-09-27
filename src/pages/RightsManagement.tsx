
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/dashboard-layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Users, 
  DollarSign, 
  Shield, 
  Share2, 
  ChevronRight,
  Copyright,
  Clock,
  Wallet,
  BarChart4,
  Code,
  Briefcase,
  Settings,
  Check,
  AlertTriangle
} from "lucide-react";
import RightsJourney from "@/components/rights/RightsJourney";
import CollaboratorEcosystem from "@/components/rights/CollaboratorEcosystem";
import RevenueJourney from "@/components/rights/RevenueJourney";
import RecentMilestones from "@/components/rights/RecentMilestones";
import IPAgreementVisualizer from "@/components/rights/IPAgreementVisualizer";
import RoyaltyScenarioModeler from "@/components/rights/RoyaltyScenarioModeler";
import RightsTransferWizard from "@/components/rights/RightsTransferWizard";
import StoryPortal from "@/components/rights/StoryPortal";

const RightsManagement = () => {
  const navigate = useNavigate();
  const [selectedAsset, setSelectedAsset] = useState<string | null>("The Universal Dream");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isStoryPortalOpen, setIsStoryPortalOpen] = useState(false);
  
  const assetOptions = [
    "The Universal Dream",
    "Cosmic Voyager",
    "Digital Renaissance",
    "Neural Nexus"
  ];
  
  const handleAssetChange = (asset: string) => {
    setSelectedAsset(asset);
    toast(`Loaded IP details for "${asset}"`);
  };
  
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="glass-card p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-medium flex items-center gap-2">
                      <Shield className="text-[#9b87f5]" size={20} />
                      IP Rights Timeline
                    </h2>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-xs">
                        <Clock size={14} className="mr-1" />
                        History
                      </Button>
                      <Button variant="ghost" size="sm" className="text-[#9b87f5]" onClick={() => navigate("/collection")}>
                        Change Creation <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>

                  {selectedAsset && (
                    <div className="flex flex-col gap-3">
                      <h3 className="text-2xl font-semibold text-studio-charcoal">{selectedAsset}</h3>
                      <RightsJourney />
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="glass-card p-6 h-full">
                  <h2 className="text-xl font-medium flex items-center gap-2 mb-4">
                    <Users className="text-[#9b87f5]" size={20} />
                    Collaborator Ecosystem
                  </h2>
                  <CollaboratorEcosystem />
                  
                  <div className="mt-6 pt-4 border-t border-studio-sand/30">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                      <Copyright size={14} className="text-[#9b87f5]" />
                      Rights Management
                    </h3>
                    <div className="space-y-2">
                      <motion.button 
                        className="w-full text-left p-3 flex items-center justify-between rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 text-sm hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-blue-500/20 transition-all duration-300"
                        whileHover={{ x: 3 }}
                      >
                        <span>Register Copyright</span>
                        <ChevronRight size={16} />
                      </motion.button>
                      <motion.button 
                        className="w-full text-left p-3 flex items-center justify-between rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 text-sm hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-blue-500/20 transition-all duration-300"
                        whileHover={{ x: 3 }}
                      >
                        <span>Trademark Creation</span>
                        <ChevronRight size={16} />
                      </motion.button>
                      <motion.button 
                        className="w-full text-left p-3 flex items-center justify-between rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 text-sm hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-blue-500/20 transition-all duration-300"
                        whileHover={{ x: 3 }}
                      >
                        <span>View Smart Contracts</span>
                        <ChevronRight size={16} />
                      </motion.button>
                      <motion.button 
                        className="w-full text-left p-3 flex items-center justify-between rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm hover:from-purple-600 hover:to-indigo-700 shadow-lg"
                        whileHover={{ x: 3, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsStoryPortalOpen(true)}
                      >
                        <span>Story Portal</span>
                        <ChevronRight size={16} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="glass-card p-6 h-full">
                  <h2 className="text-xl font-medium flex items-center gap-2 mb-4">
                    <DollarSign className="text-[#9b87f5]" size={20} />
                    Revenue Journey
                  </h2>
                  <RevenueJourney />
                  
                  <div className="mt-4 pt-4 border-t border-studio-sand/30">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium flex items-center gap-1.5">
                        <Wallet size={14} className="text-[#9b87f5]" />
                        Earnings Overview
                      </h3>
                      <Button variant="outline" size="sm" className="text-xs">
                        <BarChart4 size={14} className="mr-1" />
                        Full Analytics
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 text-center">
                        <p className="text-xs text-white/70">Last 30 Days</p>
                        <p className="text-lg font-medium mt-1 text-white">$1,245.80</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 text-center">
                        <p className="text-xs text-white/70">Platforms</p>
                        <p className="text-lg font-medium mt-1 text-white">8</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 text-center">
                        <p className="text-xs text-white/70">Growth</p>
                        <p className="text-lg font-medium text-green-400 mt-1">+24%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="glass-card p-6 h-full">
                  <h2 className="text-xl font-medium flex items-center gap-2 mb-4">
                    <FileText className="text-[#9b87f5]" size={20} />
                    License Scenario Modeling
                  </h2>
                  <div className="space-y-4">
                    <motion.div 
                      className="p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 rounded-xl flex gap-3 items-center"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <div className="bg-[#9b87f5]/20 p-2 rounded-full">
                        <Share2 size={18} className="text-[#9b87f5]" />
                      </div>
                      <div>
                        <h3 className="font-medium">Creative Commons</h3>
                        <p className="text-sm text-studio-clay">Share, remix, and build upon</p>
                      </div>
                    </motion.div>
                    
                    <div className="text-sm text-white/70 p-3 border border-dashed border-white/20 rounded-lg bg-gradient-to-br from-blue-500/5 to-purple-500/5 backdrop-blur-sm">
                      <p className="mb-2"><strong>License Terms:</strong></p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Share — copy and redistribute in any medium or format</li>
                        <li>Adapt — remix, transform, and build upon the material</li>
                        <li>Credit must be given to the creator</li>
                        <li>Changes must be indicated</li>
                      </ul>
                    </div>
                    
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab("licensing")}>
                      Explore License Scenarios
                    </Button>
                    <Button variant="outline" className="w-full">
                      Export License Agreement
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="glass-card p-6">
                <h2 className="text-xl font-medium flex items-center gap-2 mb-4">
                  <Shield className="text-[#9b87f5]" size={20} />
                  Recent Milestones
                </h2>
                <RecentMilestones />
              </div>
            </motion.div>
          </div>
        );
      case "agreements":
        return (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="glass-card p-6">
                <h2 className="text-xl font-medium flex items-center gap-2 mb-4">
                  <FileText className="text-[#9b87f5]" size={20} />
                  Collaboration Agreements
                </h2>
                <IPAgreementVisualizer />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="glass-card p-6">
                <h2 className="text-xl font-medium flex items-center gap-2 mb-4">
                  <Code className="text-[#9b87f5]" size={20} />
                  Smart Contract Documentation
                </h2>
                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 rounded-lg mb-4">
                  <p className="text-sm text-white/70">Smart contracts provide automated enforcement of agreement terms and transparent tracking of all royalty distributions.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 rounded-lg">
                    <h3 className="font-medium mb-2 text-white">Royalty Distribution Contract</h3>
                    <p className="text-sm text-white/70 mb-3">Automatically splits revenue between collaborators based on predefined percentages.</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-xs">View Contract</Button>
                      <Button variant="outline" size="sm" className="text-xs">Transaction History</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 rounded-lg">
                    <h3 className="font-medium mb-2 text-white">Rights Management Contract</h3>
                    <p className="text-sm text-white/70 mb-3">Maintains a verifiable record of all rights transfers and licensing agreements.</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-xs">View Contract</Button>
                      <Button variant="outline" size="sm" className="text-xs">Transfer History</Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <RightsTransferWizard />
          </div>
        );
      case "licensing":
        return (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="glass-card p-6">
                <h2 className="text-xl font-medium flex items-center gap-2 mb-4">
                  <Briefcase className="text-[#9b87f5]" size={20} />
                  Licensing & Royalty Modeling
                </h2>
                <RoyaltyScenarioModeler />
              </div>
            </motion.div>
          </div>
        );
      case "analytics":
        return (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="glass-card p-6">
                <h2 className="text-xl font-medium flex items-center gap-2 mb-4">
                  <BarChart4 className="text-[#9b87f5]" size={20} />
                  IP Performance Analytics
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 rounded-lg text-center">
                    <h3 className="text-sm font-medium mb-2 text-white">Total Revenue</h3>
                    <p className="text-3xl font-bold text-[#9b87f5]">$28,456</p>
                    <p className="text-xs text-white/70 mt-1">+18% from last quarter</p>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-white/10 rounded-lg text-center">
                    <h3 className="text-sm font-medium mb-2 text-white">Active Licenses</h3>
                    <p className="text-3xl font-bold text-[#33C3F0]">12</p>
                    <p className="text-xs text-white/70 mt-1">Across 8 territories</p>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm border border-white/10 rounded-lg text-center">
                    <h3 className="text-sm font-medium mb-2 text-white">Rights Transfers</h3>
                    <p className="text-3xl font-bold text-[#F97316]">3</p>
                    <p className="text-xs text-white/70 mt-1">2 pending approvals</p>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 rounded-lg mb-6">
                  <h3 className="font-medium mb-3 text-white">Revenue by Platform</h3>
                  <div className="h-[300px]">
                    {/* This would be a chart in a real implementation */}
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-white/70">Platform revenue visualization would appear here</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gradient-to-br from-green-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 rounded-lg">
                    <h3 className="font-medium mb-3 text-white">Usage Rights Activity</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/80">Reproduction Rights</span>
                        <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-green-400" style={{ width: "75%" }}></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/80">Distribution Rights</span>
                        <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-green-400" style={{ width: "90%" }}></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/80">Derivative Works</span>
                        <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400" style={{ width: "40%" }}></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/80">Public Performance</span>
                        <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-red-400" style={{ width: "15%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 rounded-lg">
                    <h3 className="font-medium mb-3 text-white">Licensing Recommendations</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                          <Check size={10} className="text-white" />
                        </div>
                        <span className="text-white/80">Consider expanding to Asian markets based on current engagement trends</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                          <Check size={10} className="text-white" />
                        </div>
                        <span className="text-white/80">Your derivative works rights are underutilized - potential for expansion</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center mt-0.5">
                          <AlertTriangle size={10} className="text-white" />
                        </div>
                        <span className="text-white/80">Consider renegotiating distribution terms with Platform X for better rates</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="glass-card p-6">
                <h2 className="text-xl font-medium flex items-center gap-2 mb-4">
                  <Settings className="text-[#9b87f5]" size={20} />
                  IP Portal Settings
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Notification Preferences</h3>
                    <div className="space-y-2">
                      <label className="flex items-center justify-between">
                        <span className="text-sm">Rights Transfer Notifications</span>
                        <input type="checkbox" defaultChecked className="toggle toggle-primary" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm">Revenue Distribution Alerts</span>
                        <input type="checkbox" defaultChecked className="toggle toggle-primary" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm">License Expiration Reminders</span>
                        <input type="checkbox" defaultChecked className="toggle toggle-primary" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm">Marketplace Activity Reports</span>
                        <input type="checkbox" className="toggle toggle-primary" />
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Privacy & Sharing</h3>
                    <div className="space-y-2">
                      <label className="flex items-center justify-between">
                        <span className="text-sm">Make Rights Public</span>
                        <input type="checkbox" className="toggle toggle-primary" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm">Show Revenue Details</span>
                        <input type="checkbox" defaultChecked className="toggle toggle-primary" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm">Display Collaborator Info</span>
                        <input type="checkbox" defaultChecked className="toggle toggle-primary" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm">Share Analytics</span>
                        <input type="checkbox" className="toggle toggle-primary" />
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-studio-sand/30">
                  <h3 className="font-medium mb-4">Default Rights Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 rounded-lg">
                      <h4 className="text-sm font-medium mb-2 text-white">Default License Template</h4>
                      <select className="w-full p-2 rounded bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                        <option>Creative Commons Attribution</option>
                        <option>Creative Commons Attribution-ShareAlike</option>
                        <option>Creative Commons Non-Commercial</option>
                        <option>All Rights Reserved</option>
                        <option>Custom Template</option>
                      </select>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 rounded-lg">
                      <h4 className="text-sm font-medium mb-2 text-white">Automatic Rights Registration</h4>
                      <select className="w-full p-2 rounded bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                        <option>Register on creation</option>
                        <option>Register on publication</option>
                        <option>Register manually only</option>
                        <option>Ask each time</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button className="bg-[#9b87f5] hover:bg-[#7E69AB]">
                    Save Settings
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-semibold text-studio-charcoal mb-2">IP Portal</h1>
          <p className="text-studio-clay">Transform legal complexity into the story of your creation's journey</p>
        </motion.div>

        <div className="flex flex-wrap gap-3 mb-6">
          {assetOptions.map((asset) => (
            <motion.button
              key={asset}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                selectedAsset === asset 
                  ? 'bg-[#9b87f5] text-white' 
                  : 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 text-white hover:border-[#9b87f5]/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAssetChange(asset)}
            >
              {asset}
            </motion.button>
          ))}
          
          <motion.button
            className="px-4 py-2 rounded-lg text-sm border border-dashed border-studio-sand flex items-center text-studio-clay hover:border-[#9b87f5]/50 hover:text-[#9b87f5]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/collection")}
          >
            <span>Add Asset</span>
            <ChevronRight size={16} className="ml-1" />
          </motion.button>
        </div>

        <div className="mb-6 glass-card p-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={activeTab === "overview" ? "default" : "outline"} 
              size="sm"
              className={activeTab === "overview" ? "bg-[#9b87f5] hover:bg-[#8A78DF]" : ""}
              onClick={() => setActiveTab("overview")}
            >
              <Shield size={16} className="mr-1" />
              Overview
            </Button>
            <Button 
              variant={activeTab === "agreements" ? "default" : "outline"} 
              size="sm"
              className={activeTab === "agreements" ? "bg-[#9b87f5] hover:bg-[#8A78DF]" : ""}
              onClick={() => setActiveTab("agreements")}
            >
              <FileText size={16} className="mr-1" />
              Agreements
            </Button>
            <Button 
              variant={activeTab === "licensing" ? "default" : "outline"} 
              size="sm"
              className={activeTab === "licensing" ? "bg-[#9b87f5] hover:bg-[#8A78DF]" : ""}
              onClick={() => setActiveTab("licensing")}
            >
              <Share2 size={16} className="mr-1" />
              Licensing
            </Button>
            <Button 
              variant={activeTab === "analytics" ? "default" : "outline"} 
              size="sm"
              className={activeTab === "analytics" ? "bg-[#9b87f5] hover:bg-[#8A78DF]" : ""}
              onClick={() => setActiveTab("analytics")}
            >
              <BarChart4 size={16} className="mr-1" />
              Analytics
            </Button>
            <Button 
              variant={activeTab === "settings" ? "default" : "outline"} 
              size="sm"
              className={activeTab === "settings" ? "bg-[#9b87f5] hover:bg-[#8A78DF]" : ""}
              onClick={() => setActiveTab("settings")}
            >
              <Settings size={16} className="mr-1" />
              Settings
            </Button>
          </div>
        </div>

        {renderActiveTab()}

        {/* Story Portal Modal */}
        <StoryPortal 
          isOpen={isStoryPortalOpen} 
          onClose={() => setIsStoryPortalOpen(false)} 
        />
      </div>
    </DashboardLayout>
  );
};

export default RightsManagement;
