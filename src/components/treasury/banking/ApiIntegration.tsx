
import React from "react";
import { Button } from "@/components/ui/button";
import { Key, RefreshCw, Trash, ClipboardCopy } from "lucide-react";

const ApiIntegration: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium">API Access Keys</h3>
            <p className="text-sm text-muted-foreground">Securely access your agent's banking capabilities</p>
          </div>
          <Button>
            <Key className="h-4 w-4 mr-2" /> Generate New Key
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 glass-card border border-white/10 backdrop-blur-md rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium">Live API Key</h4>
                <p className="text-xs text-muted-foreground">Created on Jun 12, 2023</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7">
                  <RefreshCw className="h-3 w-3 mr-1" /> Rotate
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-red-500 hover:text-red-600">
                  <Trash className="h-3 w-3 mr-1" /> Revoke
                </Button>
              </div>
            </div>
            
            <div className="bg-studio-sand/10 p-2 rounded-md font-mono text-sm flex items-center">
              <Key className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>sk_live_••••••••••••••••••••••••••••••</span>
              <button className="ml-auto text-studio-accent">
                <ClipboardCopy className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="p-4 glass-card border border-white/10 backdrop-blur-md rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium">Test API Key</h4>
                <p className="text-xs text-muted-foreground">Created on Jun 12, 2023</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7">
                  <RefreshCw className="h-3 w-3 mr-1" /> Rotate
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-red-500 hover:text-red-600">
                  <Trash className="h-3 w-3 mr-1" /> Revoke
                </Button>
              </div>
            </div>
            
            <div className="bg-studio-sand/10 p-2 rounded-md font-mono text-sm flex items-center">
              <Key className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>sk_test_••••••••••••••••••••••••••••••</span>
              <button className="ml-auto text-studio-accent">
                <ClipboardCopy className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass-card p-6">
        <h3 className="text-lg font-medium mb-4">Webhook Configuration</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Webhook URL</label>
            <div className="flex">
              <input type="text" className="flex-1 rounded-l-md border border-white/10 backdrop-blur-md p-2 glass-card" placeholder="https://your-app.com/webhook" />
              <Button className="rounded-l-none">Save</Button>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Events to Trigger Webhook</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <input type="checkbox" id="event-deposit" defaultChecked className="mr-2" />
                <label htmlFor="event-deposit" className="text-sm">Deposits</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="event-withdrawal" defaultChecked className="mr-2" />
                <label htmlFor="event-withdrawal" className="text-sm">Withdrawals</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="event-approval" defaultChecked className="mr-2" />
                <label htmlFor="event-approval" className="text-sm">Approval Requests</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="event-failure" defaultChecked className="mr-2" />
                <label htmlFor="event-failure" className="text-sm">Transaction Failures</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass-card p-6">
        <h3 className="text-lg font-medium mb-4">API Code Samples</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Check Balance</h4>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <ClipboardCopy className="h-3 w-3 mr-1" /> Copy
              </Button>
            </div>
            <pre className="bg-studio-charcoal text-white p-3 rounded-md text-xs overflow-x-auto">
              {`curl -X GET \\
  https://api.payman.io/v1/agent/balance \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
            </pre>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Create Transfer</h4>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <ClipboardCopy className="h-3 w-3 mr-1" /> Copy
              </Button>
            </div>
            <pre className="bg-studio-charcoal text-white p-3 rounded-md text-xs overflow-x-auto">
              {`curl -X POST \\
  https://api.payman.io/v1/agent/transfer \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 100,
    "currency": "USD",
    "recipient": "rec_12345",
    "description": "API payment"
  }'`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiIntegration;
