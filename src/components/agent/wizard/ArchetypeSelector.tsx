import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Briefcase, Code, MessageSquare, Search } from "lucide-react";

interface ArchetypeSelectorProps {
  selectedArchetype: string;
  setSelectedArchetype: (archetype: string) => void;
}

const archetypes = [
  {
    id: "creative",
    name: "Creative Agents",
    icon: Sparkles,
    description: "Art generation, music composition, content writing",
    useCases: ["NFT art creation", "Music production", "Story generation"],
    tags: ["Popular", "Trending"]
  },
  {
    id: "business",
    name: "Business Agents",
    icon: Briefcase,
    description: "Booking, invoicing, contracts, CRM management",
    useCases: ["Automated bookings", "Invoice tracking", "Contract generation"],
    tags: ["Enterprise"]
  },
  {
    id: "technical",
    name: "Technical Agents",
    icon: Code,
    description: "Code assistants, data analysis, DevOps automation",
    useCases: ["Code review", "Data processing", "CI/CD automation"],
    tags: ["Developer"]
  },
  {
    id: "communication",
    name: "Communication Agents",
    icon: MessageSquare,
    description: "Social media, customer support, chatbots",
    useCases: ["Social posting", "24/7 support", "Community management"],
    tags: ["Popular"]
  },
  {
    id: "research",
    name: "Research Agents",
    icon: Search,
    description: "Data mining, market analysis, academic research",
    useCases: ["Market insights", "Trend analysis", "Literature review"],
    tags: ["New"]
  }
];

const ArchetypeSelector: React.FC<ArchetypeSelectorProps> = ({
  selectedArchetype,
  setSelectedArchetype
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-[hsl(var(--text-primary))] mb-2">
          Choose Your Agent's Primary Purpose
        </h3>
        <p className="text-sm text-[hsl(var(--text-secondary))]">
          Select the archetype that best matches what you want your agent to accomplish
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {archetypes.map((archetype) => {
          const Icon = archetype.icon;
          const isSelected = selectedArchetype === archetype.id;
          
          return (
            <motion.div
              key={archetype.id}
              className={`glass-card p-5 rounded-xl cursor-pointer transition-all border-2 ${
                isSelected 
                  ? 'border-[hsl(var(--accent-purple))] bg-[hsl(var(--accent-purple))]/10' 
                  : 'border-white/10 hover:border-white/20'
              }`}
              onClick={() => setSelectedArchetype(archetype.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  isSelected 
                    ? 'bg-[hsl(var(--accent-purple))]/20' 
                    : 'bg-white/5'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    isSelected 
                      ? 'text-[hsl(var(--accent-purple))]' 
                      : 'text-[hsl(var(--text-secondary))]'
                  }`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-[hsl(var(--text-primary))]">
                      {archetype.name}
                    </h4>
                    {archetype.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-2 py-0.5 text-xs rounded-full bg-[hsl(var(--accent-purple))]/20 text-[hsl(var(--accent-purple))] border border-[hsl(var(--accent-purple))]/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-sm text-[hsl(var(--text-secondary))] mb-3">
                    {archetype.description}
                  </p>
                  
                  <div className="space-y-1">
                    {archetype.useCases.map((useCase, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[hsl(var(--text-tertiary))]">
                        <div className="w-1 h-1 rounded-full bg-[hsl(var(--accent-purple))]" />
                        {useCase}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {selectedArchetype && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 rounded-lg border border-[hsl(var(--accent-purple))]/30 bg-[hsl(var(--accent-purple))]/5"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[hsl(var(--accent-purple))] mt-0.5" />
            <div>
              <h5 className="font-medium text-[hsl(var(--text-primary))] mb-1">AI Assistant Tip</h5>
              <p className="text-sm text-[hsl(var(--text-secondary))]">
                Based on your selection, I'll recommend optimal templates and plugins in the next steps.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ArchetypeSelector;
