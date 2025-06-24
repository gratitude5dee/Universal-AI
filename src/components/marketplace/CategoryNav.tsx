import React from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Paintbrush, 
  Code, 
  MessageSquare, 
  Search, 
  Image, 
  Music, 
  Video, 
  FileText, 
  Bot
} from "lucide-react";

interface CategoryNavProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ selectedCategory, setSelectedCategory }) => {
  const categories = [
    { id: "all", name: "All Agents", icon: Bot },
    { id: "creative", name: "Creative Assistants", icon: Sparkles },
    { id: "art", name: "Art Generators", icon: Paintbrush },
    { id: "code", name: "Code Assistants", icon: Code },
    { id: "conversation", name: "Conversational", icon: MessageSquare },
    { id: "research", name: "Research Tools", icon: Search },
    { id: "image", name: "Image Processors", icon: Image },
    { id: "music", name: "Music Creators", icon: Music },
    { id: "video", name: "Video Generators", icon: Video },
    { id: "writing", name: "Writing Assistants", icon: FileText },
  ];

  return (
    <div className="glass-card p-4 sticky top-4 backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow">
      <h3 className="font-medium mb-3 text-white text-shadow-sm">Categories</h3>
      <nav className="space-y-1">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const Icon = category.icon;
          
          return (
            <button
              key={category.id}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors relative ${
                isSelected 
                  ? "text-studio-accent font-medium" 
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <Icon className="h-4 w-4" />
              <span>{category.name}</span>
              
              {isSelected && (
                <motion.div
                  layoutId="category-indicator"
                  className="absolute inset-0 rounded-lg bg-studio-accent/10 -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default CategoryNav;