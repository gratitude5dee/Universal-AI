import React from "react";
import { Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EventTriggersStep: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold white-bg-heading">Event Triggers & Conditions</h2>
        <p className="white-bg-subheading">Define when your agent will activate and take action</p>
      </div>
      
      <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-xl">
        <h3 className="font-medium mb-3 text-blue-dark">Activation Triggers</h3>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <input type="checkbox" id="trigger-schedule" className="mr-2" defaultChecked />
            <label htmlFor="trigger-schedule" className="text-sm text-blue-dark">Schedule-based</label>
          </div>
          
          <div className="ml-6 mb-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="frequency" className="text-xs text-blue-dark">Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger id="frequency" className="text-blue-dark">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="time" className="text-xs text-blue-dark">Time</Label>
                <Input type="time" id="time" defaultValue="09:00" className="text-blue-dark" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <input type="checkbox" id="trigger-mention" className="mr-2" />
            <label htmlFor="trigger-mention" className="text-sm">User interaction (mentions, commands)</label>
          </div>
          
          <div className="flex items-center">
            <input type="checkbox" id="trigger-event" className="mr-2" />
            <label htmlFor="trigger-event" className="text-sm">External events (API webhooks)</label>
          </div>
          
          <div className="flex items-center">
            <input type="checkbox" id="trigger-tx" className="mr-2" />
            <label htmlFor="trigger-tx" className="text-sm">Blockchain transactions</label>
          </div>
        </div>
      </div>
      
      <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-xl">
        <h3 className="font-medium mb-3 text-blue-dark">Conditions & Logic</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="condition-source" className="text-xs text-blue-dark">Data Source</Label>
            <Select defaultValue="social">
              <SelectTrigger id="condition-source" className="mt-1 text-blue-dark">
                <SelectValue placeholder="Select data source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="social">Social Media Trends</SelectItem>
                <SelectItem value="crypto">Crypto Market Data</SelectItem>
                <SelectItem value="weather">Weather Data</SelectItem>
                <SelectItem value="custom">Custom API</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="condition-operator" className="text-xs">Operator</Label>
              <Select defaultValue="contains">
                <SelectTrigger id="condition-operator" className="mt-1">
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                  <SelectItem value="greater">Greater Than</SelectItem>
                  <SelectItem value="less">Less Than</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="condition-value" className="text-xs">Value</Label>
              <Input id="condition-value" className="mt-1" placeholder="trending topic" />
            </div>
          </div>
          
          <button className="text-sm text-purple-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add another condition
          </button>
        </div>
      </div>
      
      <div className="flex items-center bg-blue-50/30 backdrop-blur-sm p-4 rounded-lg border border-blue-100/30">
        <Sparkles className="h-5 w-5 text-blue-500 mr-2" />
        <p className="text-sm text-blue-700">
          <strong>AI Assistant:</strong> Daily schedules work well for consistent outputs. Consider adding social media triggers for more dynamic interactions.
        </p>
      </div>
    </div>
  );
};

export default EventTriggersStep;