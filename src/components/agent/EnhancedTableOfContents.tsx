import React from "react";
import { 
  User, Image, Brain, MessageSquare, Mail, FileText, 
  Lightbulb, Book, MessageCircle, Share2, Palette, 
  Hash, Tag, CheckCircle, Circle, ChevronDown, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

type TableOfContentsProps = {
  activeSection?: string;
  completedSections?: string[];
  sectionProgress?: Record<string, number>;
  onSectionClick?: (sectionId: string) => void;
};

interface SectionGroup {
  id: string;
  label: string;
  sections: {
    id: string;
    label: string;
    icon: React.ElementType;
  }[];
}

const EnhancedTableOfContents: React.FC<TableOfContentsProps> = ({ 
  activeSection = "name", 
  completedSections = [],
  sectionProgress = {},
  onSectionClick 
}) => {
  const [expandedGroups, setExpandedGroups] = React.useState<string[]>([
    "identity", "personality", "knowledge", "examples"
  ]);

  const sectionGroups: SectionGroup[] = [
    {
      id: "identity",
      label: "Identity",
      sections: [
        { id: "name", label: "Name", icon: User },
        { id: "avatar", label: "Avatar", icon: Image },
        { id: "modelProvider", label: "Model", icon: Brain },
        { id: "clients", label: "Clients", icon: Mail },
        { id: "plugins", label: "Plugins", icon: Share2 },
      ]
    },
    {
      id: "personality",
      label: "Personality",
      sections: [
        { id: "bio", label: "Bio", icon: FileText },
        { id: "lore", label: "Lore", icon: Book },
        { id: "style", label: "Style", icon: Palette },
        { id: "topics", label: "Topics", icon: Hash },
        { id: "adjectives", label: "Adjectives", icon: Tag },
      ]
    },
    {
      id: "knowledge",
      label: "Knowledge",
      sections: [
        { id: "knowledge", label: "Knowledge", icon: Lightbulb },
      ]
    },
    {
      id: "examples",
      label: "Examples",
      sections: [
        { id: "messageExamples", label: "Messages", icon: MessageCircle },
        { id: "postExamples", label: "Posts", icon: MessageSquare },
      ]
    },
  ];

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleSectionClick = (sectionId: string) => {
    if (onSectionClick) {
      onSectionClick(sectionId);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const getGroupProgress = (group: SectionGroup) => {
    const totalSections = group.sections.length;
    const completedCount = group.sections.filter(s => completedSections.includes(s.id)).length;
    return Math.round((completedCount / totalSections) * 100);
  };

  return (
    <div className="sticky top-4">
      <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-4 shadow-lg">
        <h3 className="font-semibold mb-4 text-lg text-[hsl(var(--text-primary))] flex items-center gap-2">
          <Book className="w-5 h-5 text-[hsl(var(--accent-purple))]" />
          Table of Contents
        </h3>
        
        <div className="space-y-2">
          {sectionGroups.map((group) => {
            const isExpanded = expandedGroups.includes(group.id);
            const groupProgress = getGroupProgress(group);

            return (
              <div key={group.id} className="space-y-1">
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-[hsl(var(--text-secondary))]" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[hsl(var(--text-secondary))]" />
                    )}
                    <span className="text-sm font-medium text-[hsl(var(--text-primary))]">
                      {group.label}
                    </span>
                  </div>
                  
                  {groupProgress > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[hsl(var(--accent-purple))] to-[hsl(var(--accent-blue))] transition-all duration-500"
                          style={{ width: `${groupProgress}%` }}
                        />
                      </div>
                      <span className="text-xs text-[hsl(var(--text-tertiary))] w-8 text-right">
                        {groupProgress}%
                      </span>
                    </div>
                  )}
                </button>

                {isExpanded && (
                  <div className="ml-4 space-y-1 animate-accordion-down">
                    {group.sections.map((section) => {
                      const isActive = activeSection === section.id;
                      const isCompleted = completedSections.includes(section.id);
                      const progress = sectionProgress[section.id] || 0;
                      const Icon = section.icon;

                      return (
                        <button
                          key={section.id}
                          onClick={() => handleSectionClick(section.id)}
                          className={cn(
                            "w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200 group",
                            isActive 
                              ? "bg-gradient-to-r from-[hsl(var(--accent-purple))]/20 to-[hsl(var(--accent-blue))]/20 border-l-2 border-[hsl(var(--accent-purple))]" 
                              : "hover:bg-white/5"
                          )}
                        >
                          <div className={cn(
                            "flex items-center justify-center w-6 h-6 rounded transition-colors",
                            isActive && "text-[hsl(var(--accent-purple))]",
                            !isActive && "text-[hsl(var(--text-tertiary))] group-hover:text-[hsl(var(--text-secondary))]"
                          )}>
                            <Icon className="w-4 h-4" />
                          </div>
                          
                          <span className={cn(
                            "text-sm flex-1 text-left transition-colors",
                            isActive 
                              ? "text-[hsl(var(--text-primary))] font-medium" 
                              : "text-[hsl(var(--text-secondary))] group-hover:text-[hsl(var(--text-primary))]"
                          )}>
                            {section.label}
                          </span>

                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-[hsl(var(--success))]" />
                          ) : progress > 0 ? (
                            <div className="relative w-4 h-4">
                              <Circle className="w-4 h-4 text-white/20" />
                              <svg className="absolute inset-0 w-4 h-4 -rotate-90">
                                <circle
                                  cx="8"
                                  cy="8"
                                  r="6"
                                  stroke="hsl(var(--accent-purple))"
                                  strokeWidth="2"
                                  fill="none"
                                  strokeDasharray={`${2 * Math.PI * 6}`}
                                  strokeDashoffset={`${2 * Math.PI * 6 * (1 - progress / 100)}`}
                                  className="transition-all duration-500"
                                />
                              </svg>
                            </div>
                          ) : (
                            <Circle className="w-4 h-4 text-white/20" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EnhancedTableOfContents;