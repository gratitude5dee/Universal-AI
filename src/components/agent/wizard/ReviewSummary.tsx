import React from "react";
import { motion } from "framer-motion";
import { Check, DollarSign, Zap, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ReviewSummaryProps {
  config: {
    name: string;
    username: string;
    archetype: string;
    template: string | null;
    avatar: string | null;
    bio: string[];
    topics: string[];
    adjectives: string[];
    voiceProvider: string;
  };
  launchMode: string;
  setLaunchMode: (mode: string) => void;
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({ config, launchMode, setLaunchMode }) => {
  const estimatedCost = 0.05; // $0.05 per 1K messages

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-[hsl(var(--text-primary))] mb-2">
          Review & Deploy
        </h3>
        <p className="text-sm text-[hsl(var(--text-secondary))]">
          Verify your agent configuration before deployment
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Identity */}
        <div className="glass-card p-5 rounded-xl border border-white/10">
          <h4 className="font-semibold text-[hsl(var(--text-primary))] mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[hsl(var(--accent-purple))]/20 flex items-center justify-center">
              {config.avatar || "🤖"}
            </div>
            Agent Identity
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[hsl(var(--text-tertiary))]">Name:</span>
              <span className="text-[hsl(var(--text-primary))] font-medium">{config.name || "Not set"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[hsl(var(--text-tertiary))]">Username:</span>
              <span className="text-[hsl(var(--text-primary))] font-medium">@{config.username || "not-set"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[hsl(var(--text-tertiary))]">Archetype:</span>
              <span className="text-[hsl(var(--text-primary))] font-medium capitalize">{config.archetype || "None"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[hsl(var(--text-tertiary))]">Voice:</span>
              <span className="text-[hsl(var(--text-primary))] font-medium capitalize">{config.voiceProvider || "None"}</span>
            </div>
          </div>
        </div>

        {/* Personality */}
        <div className="glass-card p-5 rounded-xl border border-white/10">
          <h4 className="font-semibold text-[hsl(var(--text-primary))] mb-3">Personality</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[hsl(var(--text-tertiary))]">Template:</span>
              <span className="text-[hsl(var(--text-primary))] font-medium">{config.template || "Custom"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[hsl(var(--text-tertiary))]">Bio Lines:</span>
              <span className="text-[hsl(var(--text-primary))] font-medium">{config.bio.filter(b => b.trim()).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[hsl(var(--text-tertiary))]">Topics:</span>
              <span className="text-[hsl(var(--text-primary))] font-medium">{config.topics.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[hsl(var(--text-tertiary))]">Traits:</span>
              <span className="text-[hsl(var(--text-primary))] font-medium">{config.adjectives.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Topics */}
      {config.topics.length > 0 && (
        <div className="glass-card p-5 rounded-xl border border-white/10">
          <h4 className="font-semibold text-[hsl(var(--text-primary))] mb-3">Expertise Areas</h4>
          <div className="flex flex-wrap gap-2">
            {config.topics.slice(0, 8).map((topic, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-full bg-[hsl(var(--accent-purple))]/20 border border-[hsl(var(--accent-purple))]/30 text-sm text-[hsl(var(--text-primary))]"
              >
                {topic}
              </span>
            ))}
            {config.topics.length > 8 && (
              <span className="px-3 py-1.5 text-sm text-[hsl(var(--text-tertiary))]">
                +{config.topics.length - 8} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Cost Estimate */}
      <div className="glass-card p-5 rounded-xl border border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-[hsl(var(--success))]/20">
            <DollarSign className="w-6 h-6 text-[hsl(var(--success))]" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-[hsl(var(--text-primary))] mb-1">Cost Estimate</h4>
            <p className="text-sm text-[hsl(var(--text-secondary))] mb-3">
              Estimated operational cost based on your configuration
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-[hsl(var(--text-tertiary))] mb-1">Per 1K Messages</p>
                <p className="text-lg font-semibold text-[hsl(var(--success))]">${estimatedCost.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-[hsl(var(--text-tertiary))] mb-1">Light Usage (10K/mo)</p>
                <p className="text-lg font-semibold text-[hsl(var(--text-primary))]">${(estimatedCost * 10).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-[hsl(var(--text-tertiary))] mb-1">Heavy Usage (100K/mo)</p>
                <p className="text-lg font-semibold text-[hsl(var(--text-primary))]">${(estimatedCost * 100).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Launch Options */}
      <div className="glass-card p-5 rounded-xl border border-white/10">
        <h4 className="font-semibold text-[hsl(var(--text-primary))] mb-3">Deployment Options</h4>
        <RadioGroup value={launchMode} onValueChange={setLaunchMode}>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
              <RadioGroupItem value="immediate" id="immediate" />
              <Label htmlFor="immediate" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[hsl(var(--success))]" />
                  <span className="text-[hsl(var(--text-primary))] font-medium">Activate Immediately</span>
                </div>
                <p className="text-xs text-[hsl(var(--text-tertiary))] mt-1">
                  Your agent will be active and ready to use right away
                </p>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
              <RadioGroupItem value="scheduled" id="scheduled" />
              <Label htmlFor="scheduled" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[hsl(var(--accent-purple))]" />
                  <span className="text-[hsl(var(--text-primary))] font-medium">Schedule for Later</span>
                </div>
                <p className="text-xs text-[hsl(var(--text-tertiary))] mt-1">
                  Choose a specific date and time to activate your agent
                </p>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
              <RadioGroupItem value="draft" id="draft" />
              <Label htmlFor="draft" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-[hsl(var(--text-secondary))]" />
                  <span className="text-[hsl(var(--text-primary))] font-medium">Save as Draft</span>
                </div>
                <p className="text-xs text-[hsl(var(--text-tertiary))] mt-1">
                  Save configuration without activating (activate later)
                </p>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Export Option */}
      <Button
        variant="outline"
        className="w-full border-white/20 text-[hsl(var(--text-primary))] hover:bg-white/5"
      >
        <Download className="w-4 h-4 mr-2" />
        Export Configuration as JSON
      </Button>

      {/* Confirmation Message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 rounded-lg border border-[hsl(var(--accent-purple))]/30 bg-[hsl(var(--accent-purple))]/5"
      >
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-[hsl(var(--success))] mt-0.5" />
          <div>
            <h5 className="font-medium text-[hsl(var(--text-primary))] mb-1">Ready to Deploy</h5>
            <p className="text-sm text-[hsl(var(--text-secondary))]">
              Your agent configuration looks great! Click "Create Agent" below to deploy.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewSummary;
