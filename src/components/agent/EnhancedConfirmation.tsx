import React, { useState } from "react";
import { ChevronLeft, Download, Calendar, CheckCircle, Code, FileText, Sparkles, Rocket } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EnhancedConfirmationProps {
  name: string;
  username?: string;
  avatar?: string;
  archetype?: string;
  template?: string;
  modelProvider: string;
  clients: string[];
  plugins?: string[];
  bio?: string[];
  topics?: string[];
  adjectives?: string[];
  blockchain?: string;
  aiModel?: string;
  onGoBack: () => void;
  onDeploy?: () => void;
  formData?: any;
}

const EnhancedConfirmation: React.FC<EnhancedConfirmationProps> = ({
  name = "Trump",
  username,
  avatar,
  archetype,
  template,
  modelProvider = "OpenAI",
  clients = ["X (Twitter)"],
  plugins = [],
  bio = [],
  topics = [],
  adjectives = [],
  blockchain,
  aiModel,
  onGoBack,
  onDeploy,
  formData,
}) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [viewMode, setViewMode] = useState<'text' | 'json'>('text');

  const handleDeploy = () => {
    setIsDeploying(true);
    
    setTimeout(() => {
      setIsDeploying(false);
      
      toast({
        title: "🎉 Agent Deployed Successfully!",
        description: `${name} is now live and ready to create magic.`,
        variant: "default",
      });
      
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#3B82F6', '#06B6D4']
      });

      if (onDeploy) {
        onDeploy();
      }
    }, 2000);
  };

  const handleExportJSON = () => {
    const config = {
      name,
      username,
      archetype,
      template,
      modelProvider,
      clients,
      plugins,
      bio,
      topics,
      adjectives,
      blockchain,
      aiModel,
      ...formData
    };

    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name.toLowerCase().replace(/\s+/g, '-')}-agent-config.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Configuration exported",
      description: "Your agent configuration has been downloaded.",
    });
  };

  const configCards = [
    {
      title: "Identity",
      icon: <Sparkles className="w-5 h-5" />,
      items: [
        { label: "Name", value: name },
        { label: "Username", value: username || "N/A" },
        { label: "Archetype", value: archetype || "Custom" },
        { label: "Template", value: template || "From scratch" },
      ]
    },
    {
      title: "Personality",
      icon: <FileText className="w-5 h-5" />,
      items: [
        { label: "Bio", value: bio.length > 0 ? `${bio.length} entries` : "None" },
        { label: "Topics", value: topics.length > 0 ? topics.slice(0, 3).join(", ") + (topics.length > 3 ? "..." : "") : "None" },
        { label: "Adjectives", value: adjectives.length > 0 ? adjectives.slice(0, 3).join(", ") + (adjectives.length > 3 ? "..." : "") : "None" },
      ]
    },
    {
      title: "Capabilities",
      icon: <Rocket className="w-5 h-5" />,
      items: [
        { label: "AI Model", value: aiModel || modelProvider },
        { label: "Blockchain", value: blockchain || "None" },
        { label: "Clients", value: clients.join(", ") },
        { label: "Plugins", value: plugins.length > 0 ? `${plugins.length} enabled` : "None" },
      ]
    },
  ];

  const timeline = [
    { step: "Validation", description: "Verify all configurations", status: "complete" },
    { step: "Build", description: "Compile agent personality", status: "complete" },
    { step: "Deploy", description: "Launch to selected platforms", status: "pending" },
    { step: "Monitor", description: "Track performance metrics", status: "pending" },
  ];

  return (
    <div className="py-6 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <button 
          onClick={onGoBack}
          className="flex items-center text-[hsl(var(--accent-purple))] mb-6 hover:text-[hsl(var(--accent-purple-light))] transition-colors group"
        >
          <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" /> 
          Back to Settings
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--accent-purple))] to-[hsl(var(--accent-blue))] p-1">
            <div className="w-full h-full rounded-full bg-[hsl(var(--bg-primary))] flex items-center justify-center text-3xl">
              {avatar || "🤖"}
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[hsl(var(--text-primary))]">Review & Deploy</h1>
            <p className="text-xl text-[hsl(var(--text-secondary))]">
              Final check before {name} goes live
            </p>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <Card className="bg-white/5 border-white/10">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex gap-4">
            <button
              onClick={() => setViewMode('text')}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all",
                viewMode === 'text' 
                  ? "bg-gradient-to-r from-[hsl(var(--accent-purple))] to-[hsl(var(--accent-blue))] text-white" 
                  : "text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))]"
              )}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Text View
            </button>
            <button
              onClick={() => setViewMode('json')}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all",
                viewMode === 'json' 
                  ? "bg-gradient-to-r from-[hsl(var(--accent-purple))] to-[hsl(var(--accent-blue))] text-white" 
                  : "text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))]"
              )}
            >
              <Code className="w-4 h-4 inline mr-2" />
              JSON
            </button>
          </div>

          <Button
            onClick={handleExportJSON}
            variant="outline"
            className="border-white/20 text-[hsl(var(--text-primary))]"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Config
          </Button>
        </div>

        <div className="p-6">
          {viewMode === 'text' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {configCards.map((card, index) => (
                <Card 
                  key={card.title}
                  className="bg-white/5 border-white/10 p-4 hover:bg-white/10 transition-all animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-[hsl(var(--accent-purple))]/20 to-[hsl(var(--accent-blue))]/20 text-[hsl(var(--accent-purple))]">
                      {card.icon}
                    </div>
                    <h3 className="font-semibold text-[hsl(var(--text-primary))]">{card.title}</h3>
                  </div>
                  <div className="space-y-3">
                    {card.items.map((item) => (
                      <div key={item.label}>
                        <div className="text-xs text-[hsl(var(--text-tertiary))] mb-1">{item.label}</div>
                        <div className="text-sm text-[hsl(var(--text-primary))] font-medium">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-black/40 rounded-lg p-4 overflow-auto max-h-96">
              <pre className="text-sm text-[hsl(var(--text-primary))] font-mono">
                {JSON.stringify({ name, username, archetype, template, modelProvider, clients, plugins, bio, topics, adjectives, blockchain, aiModel, ...formData }, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </Card>

      {/* What Happens Next */}
      <Card className="bg-white/5 border-white/10 p-6">
        <h3 className="text-xl font-semibold text-[hsl(var(--text-primary))] mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[hsl(var(--accent-purple))]" />
          Deployment Timeline
        </h3>
        
        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full",
                item.status === 'complete' 
                  ? "bg-[hsl(var(--success))]/20 text-[hsl(var(--success))]" 
                  : "bg-white/10 text-[hsl(var(--text-tertiary))]"
              )}>
                {item.status === 'complete' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>
              
              <div className="flex-1">
                <div className="font-medium text-[hsl(var(--text-primary))]">{item.step}</div>
                <div className="text-sm text-[hsl(var(--text-secondary))]">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Deploy Button */}
      <Button
        onClick={handleDeploy}
        disabled={isDeploying}
        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-[hsl(var(--accent-purple))] to-[hsl(var(--accent-blue))] hover:opacity-90 transition-opacity disabled:opacity-70"
      >
        {isDeploying ? (
          <>
            <Sparkles className="w-5 h-5 mr-2 animate-spin" />
            Deploying Agent...
          </>
        ) : (
          <>
            <Rocket className="w-5 h-5 mr-2" />
            Deploy Agent
          </>
        )}
      </Button>
    </div>
  );
};

export default EnhancedConfirmation;