
import React from "react";
import { Send, Download, RefreshCw, Link, BellRing, Badge, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BankingControls: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-lg font-medium mb-5 text-white">Permission Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-studio-sand/20">
            <div className="flex items-center">
              <div className="bg-studio-highlight/10 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                <Send className="h-4 w-4 text-studio-accent" />
              </div>
              <div>
                <h4 className="text-sm card-heading">Outgoing Payments</h4>
                <p className="text-xs card-text">Allow agent to send payments</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select className="text-sm border border-studio-sand/30 rounded-md px-2 py-1 text-blue-primary">
                <option>Approval Required</option>
                <option>Autonomous</option>
                <option>Disabled</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-studio-sand/20">
            <div className="flex items-center">
              <div className="bg-studio-highlight/10 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                <Download className="h-4 w-4 text-studio-accent" />
              </div>
              <div>
                <h4 className="text-sm card-heading">Incoming Payments</h4>
                <p className="text-xs card-text">Allow agent to receive funds</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select className="text-sm border border-studio-sand/30 rounded-md px-2 py-1 text-blue-primary">
                <option>Autonomous</option>
                <option>Approval Required</option>
                <option>Disabled</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-studio-sand/20">
            <div className="flex items-center">
              <div className="bg-studio-highlight/10 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                <RefreshCw className="h-4 w-4 text-studio-accent" />
              </div>
              <div>
                <h4 className="text-sm card-heading">Recurring Transactions</h4>
                <p className="text-xs card-text">Allow scheduled payments</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select className="text-sm border border-studio-sand/30 rounded-md px-2 py-1 text-blue-primary">
                <option>Approval Required</option>
                <option>Autonomous</option>
                <option>Disabled</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-studio-sand/20">
            <div className="flex items-center">
              <div className="bg-studio-highlight/10 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                <Link className="h-4 w-4 text-studio-accent" />
              </div>
              <div>
                <h4 className="text-sm card-heading">External Connections</h4>
                <p className="text-xs card-text">Allow connecting to third-party services</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select className="text-sm border border-studio-sand/30 rounded-md px-2 py-1 text-blue-primary">
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
          <h3 className="text-lg font-medium mb-4 text-white">Alert Configuration</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-md border border-studio-sand/20">
              <div className="flex items-center">
                <BellRing className="h-4 w-4 text-studio-accent mr-3" />
                <span className="text-sm text-blue-primary">Large Transactions</span>
              </div>
              <div>
                <input type="checkbox" defaultChecked className="toggle toggle-sm" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-md border border-studio-sand/20">
              <div className="flex items-center">
                <BellRing className="h-4 w-4 text-studio-accent mr-3" />
                <span className="text-sm text-blue-primary">New Recipients</span>
              </div>
              <div>
                <input type="checkbox" defaultChecked className="toggle toggle-sm" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-md border border-studio-sand/20">
              <div className="flex items-center">
                <BellRing className="h-4 w-4 text-studio-accent mr-3" />
                <span className="text-sm text-blue-primary">Suspicious Activity</span>
              </div>
              <div>
                <input type="checkbox" defaultChecked className="toggle toggle-sm" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-md border border-studio-sand/20">
              <div className="flex items-center">
                <BellRing className="h-4 w-4 text-studio-accent mr-3" />
                <span className="text-sm text-blue-primary">Low Balance</span>
              </div>
              <div>
                <input type="checkbox" defaultChecked className="toggle toggle-sm" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium mb-4 text-white">Scheduled Transactions</h3>
          
          <div className="space-y-4">
            <div className="p-3 bg-white rounded-lg border border-studio-sand/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm card-heading">API Subscription</h4>
                <Badge className="bg-blue-500">Monthly</Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs card-text">$29.99 to CloudAPI Inc.</p>
                <Button variant="outline" size="sm" className="h-7 text-xs">Edit</Button>
              </div>
            </div>
            
            <div className="p-3 bg-white rounded-lg border border-studio-sand/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm card-heading">Storage Fees</h4>
                <Badge className="bg-blue-500">Weekly</Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs card-text">$12.50 to DataStore</p>
                <Button variant="outline" size="sm" className="h-7 text-xs">Edit</Button>
              </div>
            </div>
            
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add Scheduled Transaction
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankingControls;
