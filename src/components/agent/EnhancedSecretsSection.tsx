import React, { useState } from "react";
import { Plus, Eye, EyeOff, CheckCircle, XCircle, Loader2, Upload, Key } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SectionCard from "./SectionCard";

interface Secret {
  key: string;
  value: string;
  category?: string;
}

interface SecretCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  secrets: Secret[];
  testable?: boolean;
}

const EnhancedSecretsSection: React.FC = () => {
  const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set());
  const [testingSecrets, setTestingSecrets] = useState<Set<string>>(new Set());
  const [testedSecrets, setTestedSecrets] = useState<Map<string, boolean>>(new Map());

  const [categories, setCategories] = useState<SecretCategory[]>([
    {
      id: "twitter",
      name: "Twitter / X",
      icon: <Key className="w-5 h-5" />,
      testable: true,
      secrets: [
        { key: "TWITTER_PASSWORD", value: "", category: "twitter" },
        { key: "TWITTER_EMAIL", value: "", category: "twitter" },
        { key: "TWITTER_2FA_SECRET", value: "", category: "twitter" },
      ]
    },
    {
      id: "configuration",
      name: "Configuration",
      icon: <Key className="w-5 h-5" />,
      testable: false,
      secrets: [
        { key: "POST_IMMEDIATELY", value: "true", category: "configuration" },
        { key: "ENABLE_ACTION_PROCESSING", value: "true", category: "configuration" },
        { key: "MAX_ACTIONS_PROCESSING", value: "10", category: "configuration" },
        { key: "POST_INTERVAL_MAX", value: "180", category: "configuration" },
        { key: "POST_INTERVAL_MIN", value: "90", category: "configuration" },
        { key: "TWITTER_SPACES_ENABLE", value: "false", category: "configuration" },
        { key: "ACTION_TIMELINE_TYPE", value: "foryou", category: "configuration" },
        { key: "TWITTER_POLL_INTERVAL", value: "120", category: "configuration" },
      ]
    },
  ]);

  const [newSecretKey, setNewSecretKey] = useState("");
  const [newSecretValue, setNewSecretValue] = useState("");

  const toggleSecretVisibility = (secretKey: string) => {
    setVisibleSecrets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(secretKey)) {
        newSet.delete(secretKey);
      } else {
        newSet.add(secretKey);
      }
      return newSet;
    });
  };

  const testConnection = async (categoryId: string) => {
    setTestingSecrets(prev => new Set(prev).add(categoryId));
    
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setTestingSecrets(prev => {
      const newSet = new Set(prev);
      newSet.delete(categoryId);
      return newSet;
    });
    
    setTestedSecrets(prev => new Map(prev).set(categoryId, Math.random() > 0.3));
  };

  const updateSecret = (categoryId: string, secretKey: string, value: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          secrets: cat.secrets.map(s => 
            s.key === secretKey ? { ...s, value } : s
          )
        };
      }
      return cat;
    }));
    
    // Reset test status when value changes
    setTestedSecrets(prev => {
      const newMap = new Map(prev);
      newMap.delete(categoryId);
      return newMap;
    });
  };

  const handleAddSecret = () => {
    if (newSecretKey.trim()) {
      setCategories(prev => {
        const configCategory = prev.find(cat => cat.id === "configuration");
        if (configCategory) {
          return prev.map(cat => {
            if (cat.id === "configuration") {
              return {
                ...cat,
                secrets: [...cat.secrets, { key: newSecretKey, value: newSecretValue, category: "configuration" }]
              };
            }
            return cat;
          });
        }
        return prev;
      });
      setNewSecretKey("");
      setNewSecretValue("");
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const lines = content.split('\n');
          const importedSecrets: Secret[] = [];
          
          lines.forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
              importedSecrets.push({ 
                key: key.trim(), 
                value: value.trim().replace(/^["']|["']$/g, ''),
                category: "configuration"
              });
            }
          });

          // Merge with existing configuration secrets
          setCategories(prev => prev.map(cat => {
            if (cat.id === "configuration") {
              return {
                ...cat,
                secrets: [...cat.secrets, ...importedSecrets]
              };
            }
            return cat;
          }));
        } catch (error) {
          console.error('Error importing file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const isTesting = testingSecrets.has(category.id);
        const testResult = testedSecrets.get(category.id);

        return (
          <SectionCard
            key={category.id}
            id={`secrets-${category.id}`}
            title={category.name}
            description={`Manage your ${category.name} credentials`}
            icon={category.icon}
            isValid={testResult}
            validationMessage={testResult === false ? "Connection test failed. Please check your credentials." : undefined}
          >
            <div className="space-y-3">
              {category.secrets.map((secret) => (
                <div key={secret.key} className="grid grid-cols-[1fr,2fr,auto] gap-3 items-center">
                  <div className="bg-white/5 p-3 rounded-lg text-[hsl(var(--text-primary))] text-sm font-mono border border-white/10">
                    {secret.key}
                  </div>
                  
                  <div className="relative">
                    <Input
                      type={visibleSecrets.has(secret.key) ? "text" : "password"}
                      placeholder="Enter value..."
                      value={secret.value}
                      onChange={(e) => updateSecret(category.id, secret.key, e.target.value)}
                      className="bg-white/5 border-white/10 text-[hsl(var(--text-primary))] pr-10"
                    />
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleSecretVisibility(secret.key)}
                    className="text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))]"
                  >
                    {visibleSecrets.has(secret.key) ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ))}

              {category.testable && (
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    {testResult === true && (
                      <div className="flex items-center gap-2 text-[hsl(var(--success))] text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Connection successful</span>
                      </div>
                    )}
                    {testResult === false && (
                      <div className="flex items-center gap-2 text-[hsl(var(--error))] text-sm">
                        <XCircle className="w-4 h-4" />
                        <span>Connection failed</span>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => testConnection(category.id)}
                    disabled={isTesting}
                    variant="outline"
                    className={cn(
                      "border-white/20 text-[hsl(var(--text-primary))]",
                      testResult === true && "border-[hsl(var(--success))]/50 text-[hsl(var(--success))]",
                      testResult === false && "border-[hsl(var(--error))]/50 text-[hsl(var(--error))]"
                    )}
                  >
                    {isTesting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      "Test Connection"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </SectionCard>
        );
      })}

      {/* Additional Secrets */}
      <SectionCard
        id="additional-secrets"
        title="Additional Secrets"
        description="Add any custom environment variables"
        icon={<Plus className="w-5 h-5" />}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-[hsl(var(--text-primary))]">
                <Upload className="w-4 h-4" />
                <span className="text-sm">Import from .env file</span>
              </div>
              <input
                id="file-upload"
                type="file"
                accept=".env,.txt"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
          </div>

          <div className="grid grid-cols-[1fr,2fr,auto] gap-3 items-end">
            <Input
              placeholder="SECRET_KEY"
              value={newSecretKey}
              onChange={(e) => setNewSecretKey(e.target.value)}
              className="bg-white/5 border-white/10 text-[hsl(var(--text-primary))]"
            />
            <Input
              placeholder="secret_value"
              value={newSecretValue}
              onChange={(e) => setNewSecretValue(e.target.value)}
              className="bg-white/5 border-white/10 text-[hsl(var(--text-primary))]"
            />
            <Button
              onClick={handleAddSecret}
              variant="outline"
              className="border-white/20 text-[hsl(var(--text-primary))]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default EnhancedSecretsSection;