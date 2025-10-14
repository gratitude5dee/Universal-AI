import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";
import TemplateCard from "./TemplateCard";
import { Button } from "@/components/ui/button";

interface TemplateLibraryProps {
  selectedArchetype: string;
  selectedTemplate: string | null;
  setSelectedTemplate: (templateId: string | null) => void;
}

const templates = [
  {
    id: "professional-creative",
    name: "Professional Creative",
    category: "Professional",
    archetype: "creative",
    description: "Formal and polished communication style, perfect for client-facing creative work",
    personality: {
      tone: "Professional & Confident",
      verbosity: "Moderate",
      interactionStyle: "Results-focused"
    },
    previewMessages: [
      { role: "User", content: "Create an art concept" },
      { role: "Agent", content: "I'll develop a sophisticated concept that aligns with your brand vision and artistic goals." }
    ],
    installCount: 1250
  },
  {
    id: "casual-creative",
    name: "Casual Creative",
    category: "Casual",
    archetype: "creative",
    description: "Friendly and approachable, great for community-driven creative projects",
    personality: {
      tone: "Friendly & Enthusiastic",
      verbosity: "Concise",
      interactionStyle: "Collaborative"
    },
    previewMessages: [
      { role: "User", content: "Help me brainstorm" },
      { role: "Agent", content: "Let's jam on some ideas! What vibe are we going for?" }
    ],
    installCount: 2100
  },
  {
    id: "business-executive",
    name: "Business Executive",
    category: "Professional",
    archetype: "business",
    description: "Executive-level communication for high-stakes business operations",
    personality: {
      tone: "Authoritative & Strategic",
      verbosity: "Detailed",
      interactionStyle: "Data-driven"
    },
    previewMessages: [
      { role: "User", content: "Review this contract" },
      { role: "Agent", content: "I've analyzed the terms and identified three key considerations for your review." }
    ],
    installCount: 890
  },
  {
    id: "technical-expert",
    name: "Technical Expert",
    category: "Technical",
    archetype: "technical",
    description: "Precise and analytical, optimized for technical problem-solving",
    personality: {
      tone: "Analytical & Precise",
      verbosity: "Detailed",
      interactionStyle: "Methodical"
    },
    previewMessages: [
      { role: "User", content: "Debug this code" },
      { role: "Agent", content: "Analyzing the stack trace... I've identified the root cause in the async handling logic." }
    ],
    installCount: 1560
  },
  {
    id: "supportive-helper",
    name: "Supportive Helper",
    category: "Supportive",
    archetype: "communication",
    description: "Empathetic and patient, ideal for customer support and assistance",
    personality: {
      tone: "Empathetic & Patient",
      verbosity: "Moderate",
      interactionStyle: "Supportive"
    },
    previewMessages: [
      { role: "User", content: "I'm confused about this" },
      { role: "Agent", content: "No worries! Let me walk you through this step by step at your pace." }
    ],
    installCount: 3200
  },
  {
    id: "research-analyst",
    name: "Research Analyst",
    category: "Technical",
    archetype: "research",
    description: "Thorough and objective, built for comprehensive research and analysis",
    personality: {
      tone: "Objective & Thorough",
      verbosity: "Detailed",
      interactionStyle: "Evidence-based"
    },
    previewMessages: [
      { role: "User", content: "Research market trends" },
      { role: "Agent", content: "I'll conduct a comprehensive analysis across multiple data sources and provide evidence-based insights." }
    ],
    installCount: 670
  }
];

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  selectedArchetype,
  selectedTemplate,
  setSelectedTemplate
}) => {
  const [showAll, setShowAll] = useState(false);

  const filteredTemplates = templates.filter(
    t => t.archetype === selectedArchetype || showAll
  );

  const recommendedTemplates = templates.filter(t => t.archetype === selectedArchetype);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-[hsl(var(--text-primary))] mb-2">
          Choose a Personality Template
        </h3>
        <p className="text-sm text-[hsl(var(--text-secondary))]">
          Start with a pre-configured template or build from scratch
        </p>
      </div>

      {recommendedTemplates.length > 0 && !showAll && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 rounded-lg border border-[hsl(var(--accent-purple))]/30 bg-[hsl(var(--accent-purple))]/5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[hsl(var(--accent-purple))]" />
            <h5 className="font-medium text-[hsl(var(--text-primary))]">
              Recommended for {selectedArchetype} agents
            </h5>
          </div>
          <p className="text-sm text-[hsl(var(--text-secondary))]">
            These templates are optimized for your selected archetype
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate === template.id}
            onSelect={() => setSelectedTemplate(template.id)}
          />
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => setShowAll(!showAll)}
          className="border-white/20 text-[hsl(var(--text-primary))] hover:bg-white/5"
        >
          {showAll ? "Show Recommended Only" : "Browse All Templates"}
        </Button>

        <Button
          variant="outline"
          onClick={() => setSelectedTemplate(null)}
          className="border-white/20 text-[hsl(var(--text-primary))] hover:bg-white/5"
        >
          <Zap className="w-4 h-4 mr-2" />
          Start from Scratch
        </Button>
      </div>
    </div>
  );
};

export default TemplateLibrary;
