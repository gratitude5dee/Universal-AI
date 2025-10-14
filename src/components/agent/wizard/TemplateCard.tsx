import React from "react";
import { motion } from "framer-motion";
import { Star, Users } from "lucide-react";

interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    category: string;
    description: string;
    personality: {
      tone: string;
      verbosity: string;
      interactionStyle: string;
    };
    previewMessages: Array<{ role: string; content: string }>;
    installCount: number;
  };
  isSelected: boolean;
  onSelect: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, isSelected, onSelect }) => {
  return (
    <motion.div
      className={`glass-card p-5 rounded-xl cursor-pointer transition-all border-2 ${
        isSelected 
          ? 'border-[hsl(var(--accent-purple))] bg-[hsl(var(--accent-purple))]/10' 
          : 'border-white/10 hover:border-white/20'
      }`}
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-[hsl(var(--text-primary))] mb-1">
            {template.name}
          </h4>
          <span className="inline-block px-2 py-1 text-xs rounded-full bg-white/5 text-[hsl(var(--text-secondary))] border border-white/10">
            {template.category}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-[hsl(var(--text-tertiary))]">
          <Users className="w-3 h-3" />
          {template.installCount.toLocaleString()}
        </div>
      </div>

      <p className="text-sm text-[hsl(var(--text-secondary))] mb-4">
        {template.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[hsl(var(--text-tertiary))]">Tone:</span>
          <span className="text-[hsl(var(--text-primary))] font-medium">{template.personality.tone}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-[hsl(var(--text-tertiary))]">Verbosity:</span>
          <span className="text-[hsl(var(--text-primary))] font-medium">{template.personality.verbosity}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-[hsl(var(--text-tertiary))]">Style:</span>
          <span className="text-[hsl(var(--text-primary))] font-medium">{template.personality.interactionStyle}</span>
        </div>
      </div>

      {template.previewMessages.length > 0 && (
        <div className="bg-white/5 rounded-lg p-3 space-y-2">
          <p className="text-xs font-medium text-[hsl(var(--text-tertiary))] mb-2">Preview:</p>
          {template.previewMessages.slice(0, 2).map((msg, idx) => (
            <div key={idx} className="text-xs">
              <span className="font-medium text-[hsl(var(--accent-purple))]">{msg.role}:</span>
              <span className="text-[hsl(var(--text-secondary))] ml-1">{msg.content}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default TemplateCard;
