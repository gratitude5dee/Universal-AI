
import React, { useState } from "react";
import { Key, Lock, Eye, EyeOff, Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const SecretsSection: React.FC = () => {
  const [secrets, setSecrets] = useState([
    { key: 'OPENAI_API_KEY', value: '', visible: false },
    { key: 'TWITTER_API_KEY', value: '', visible: false }
  ]);
  
  const [showAddSecret, setShowAddSecret] = useState(false);
  const [newSecretKey, setNewSecretKey] = useState('');
  
  const toggleVisibility = (index: number) => {
    const updatedSecrets = [...secrets];
    updatedSecrets[index].visible = !updatedSecrets[index].visible;
    setSecrets(updatedSecrets);
  };
  
  const handleSecretChange = (index: number, value: string) => {
    const updatedSecrets = [...secrets];
    updatedSecrets[index].value = value;
    setSecrets(updatedSecrets);
  };
  
  const addNewSecret = () => {
    if (!newSecretKey.trim()) return;
    
    setSecrets([...secrets, { key: newSecretKey, value: '', visible: false }]);
    setNewSecretKey('');
    setShowAddSecret(false);
  };
  
  const removeSecret = (index: number) => {
    const updatedSecrets = [...secrets];
    updatedSecrets.splice(index, 1);
    setSecrets(updatedSecrets);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold white-bg-heading mb-1">API Keys & Secrets</h2>
        <p className="white-bg-subheading">Configure API keys and other sensitive information your agent needs</p>
      </div>
      
      <div className="space-y-4">
        {secrets.map((secret, index) => (
          <div key={index} className="grid grid-cols-12 gap-4 items-center border p-4 rounded-md">
            <div className="col-span-4">
              <Label htmlFor={`secret-key-${index}`} className="mb-1 block">Key</Label>
              <div className="flex items-center">
                <Key className="w-4 h-4 text-muted-foreground mr-2" />
                <Input
                  id={`secret-key-${index}`}
                  value={secret.key}
                  readOnly
                  className="font-mono text-sm"
                />
              </div>
            </div>
            
            <div className="col-span-7">
              <Label htmlFor={`secret-value-${index}`} className="mb-1 block">Value</Label>
              <div className="flex items-center">
                <Lock className="w-4 h-4 text-muted-foreground mr-2" />
                <Input
                  id={`secret-value-${index}`}
                  type={secret.visible ? "text" : "password"}
                  value={secret.value}
                  onChange={(e) => handleSecretChange(index, e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            </div>
            
            <div className="col-span-1 flex items-end justify-end space-x-2">
              <button
                type="button"
                onClick={() => toggleVisibility(index)}
                className="p-2 text-muted-foreground hover:text-foreground"
              >
                {secret.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              
              {index > 1 && (
                <button
                  type="button"
                  onClick={() => removeSecret(index)}
                  className="p-2 text-muted-foreground hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {showAddSecret ? (
        <div className="border p-4 rounded-md">
          <Label htmlFor="new-secret-key" className="mb-1 block">New Secret Key</Label>
          <div className="flex items-center">
            <Input
              id="new-secret-key"
              value={newSecretKey}
              onChange={(e) => setNewSecretKey(e.target.value)}
              placeholder="CUSTOM_API_KEY"
              className="font-mono text-sm mr-2"
              autoFocus
            />
            <Button type="button" onClick={addNewSecret} size="sm">Add</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddSecret(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setShowAddSecret(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Custom Secret
        </Button>
      )}
      
      <div className="bg-muted p-4 rounded-md">
        <h3 className="text-sm font-medium mb-2">Security Notice</h3>
        <p className="text-sm text-muted-foreground">
          Your secrets are stored securely and are only accessible by your agent. 
          They are encrypted at rest and never exposed to other users or agents.
        </p>
      </div>
      
      <div>
        <Label htmlFor="system-context" className="mb-1 block">System Context</Label>
        <Textarea
          id="system-context"
          placeholder="Add additional system context for your agent..."
          className="h-24"
        />
        <p className="text-xs text-muted-foreground mt-1">
          This information will be included in the system prompt for your agent.
        </p>
      </div>
    </div>
  );
};

export default SecretsSection;
