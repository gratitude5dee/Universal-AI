import React from "react";
import { Send, Download, RefreshCw, Link, BellRing, Badge, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BankingControls: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-lg font-medium mb-5 text-white animate-text-glow">Permission Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 backdrop-blur-md bg-white/10 rounded-lg border border-white/20 shadow-card-glow hover:bg-white/15 transition-all duration-200">
            <div className="flex items-center">
              <div className="bg-studio-highlight/10 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                <Send className="h-4 w-4 text-studio-accent" />
              </div>
              <div>
                <h4 className="text-sm text-white text-shadow-sm">Outgoing Payments</h4>
                <p className="text-xs text-white/80 text-shadow-sm">Allow agent to send payments</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select className="text-sm border border-white/30 rounded-md px-2 py-1 bg-white/10 backdrop-blur-sm text-white">
                <option>Approval Required</option>
                <option>Autonomous</option>
                <option>Disabled</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 backdrop-blur-md bg-white/10 rounded-lg border border-white/20 shadow-card-glow hover:bg-white/15 transition-all duration-200">
            <div className="flex items-center">
              <div className="bg-studio-highlight/10 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                <Download className="h-4 w-4 text-studio-accent" />
              </div>
              <div>
                <h4 className="text-sm text-white text-shadow-sm">Incoming Payments</h4>
                <p className="text-xs text-white/80 text-shadow-sm">Allow agent to receive funds</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select className="text-sm border border-white/30 rounded-md px-2 py-1 bg-white/10 backdrop-blur-sm text-white">
                <option>Autonomous</option>
                <option>Approval Required</option>
                <option>Disabled</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 backdrop-blur-md bg-white/10 rounded-lg border border-white/20 shadow-card-glow hover:bg-white/15 transition-all duration-200">
            <div className="flex items-center">
              <div className="bg-studio-highlight/10 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                <RefreshCw className="h-4 w-4 text-studio-accent" />
              </div>
              <div>
                <h4 className="text-sm text-white text-shadow-sm">Recurring Transactions</h4>
                <p className="text-xs text-white/80 text-shadow-sm">Allow scheduled payments</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select className="text-sm border border-white/30 rounded-md px-2 py-1 bg-white/10 backdrop-blur-sm text-white">
                <option>Approval Required</option>
                <option>Autonomous</option>
                <option>Disabled</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 backdrop-blur-md bg-white/10 rounded-lg border border-white/20 shadow-card-glow hover:bg-white/15 transition-all duration-200">
            <div className="flex items-center">
              <div className="bg-studio-highlight/10 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                <Link className="h-4 w-4 text-studio-accent" />
              </div>
              <div>
                <h4 className="text-sm text-white text-shadow-sm">External Connections</h4>
                <p className="text-xs text-white/80 text-shadow-sm">Allow connecting to third-party services</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select className="text-sm border border-white/30 rounded-md px-2 py-1 bg-white/10 backdrop-blur-sm text-white">
                <option>Disabled</option>
                <option>Approval Required</option>
                <option>Autonomous</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium mb-4 text-white animate-text-glow">Alert Configuration</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 backdrop-blur-md bg-white/10 rounded-md border border-white/20 hover:bg-white/15 transition-all duration-200">
              <div className="flex items-center">
                <BellRing className="h-4 w-4 text-studio-accent mr-3" />
                <span className="text-sm text-white text-shadow-sm">Large Transactions</span>
              </div>
              <div>
                <input type="checkbox" defaultChecked className="toggle toggle-sm" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 backdrop-blur-md bg-white/10 rounded-md border border-white/20 hover:bg-white/15 transition-all duration-200">
              <div className="flex items-center">
                <BellRing className="h-4 w-4 text-studio-accent mr-3" />
                <span className="text-sm text-white text-shadow-sm">New Recipients</span>
              </div>
              <div>
                <input type="checkbox" defaultChecked className="toggle toggle-sm" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 backdrop-blur-md bg-white/10 rounded-md border border-white/20 hover:bg-white/15 transition-all duration-200">
              <div className="flex items-center">
                <BellRing className="h-4 w-4 text-studio-accent mr-3" />
                <span className="text-sm text-white text-shadow-sm">Suspicious Activity</span>
              </div>
              <div>
                <input type="checkbox" defaultChecked className="toggle toggle-sm" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 backdrop-blur-md bg-white/10 rounded-md border border-white/20 hover:bg-white/15 transition-all duration-200">
              <div className="flex items-center">
                <BellRing className="h-4 w-4 text-studio-accent mr-3" />
                <span className="text-sm text-white text-shadow-sm">Low Balance</span>
              </div>
              <div>
                <input type="checkbox" defaultChecked className="toggle toggle-sm" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium mb-4 text-white animate-text-glow">Scheduled Transactions</h3>
          
          <div className="space-y-4">
            <div className="p-3 backdrop-blur-md bg-white/10 rounded-lg border border-white/20 shadow-card-glow hover:bg-white/15 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm text-white text-shadow-sm">API Subscription</h4>
                <Badge className="bg-blue-500/70 text-white">Monthly</Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/80 text-shadow-sm">$29.99 to CloudAPI Inc.</p>
                <Button variant="outline" size="sm" className="h-7 text-xs bg-white/10 border-white/20 text-white hover:bg-white/20">Edit</Button>
              </div>
            </div>
            
            <div className="p-3 backdrop-blur-md bg-white/10 rounded-lg border border-white/20 shadow-card-glow hover:bg-white/15 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm text-white text-shadow-sm">Storage Fees</h4>
                <Badge className="bg-blue-500/70 text-white">Weekly</Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/80 text-shadow-sm">$12.50 to DataStore</p>
                <Button variant="outline" size="sm" className="h-7 text-xs bg-white/10 border-white/20 text-white hover:bg-white/20">Edit</Button>
              </div>
            </div>
            
            <Button className="w-full bg-studio-accent hover:bg-studio-accent/90 text-white">
              <Plus className="h-4 w-4 mr-2" /> Add Scheduled Transaction
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankingControls;