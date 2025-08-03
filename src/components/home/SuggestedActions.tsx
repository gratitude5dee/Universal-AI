import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, Tv, FileText, Calendar, Users, Globe, Search } from "lucide-react";

const suggestedActions = [
  {
    title: "Search for flight information to Denver",
    description: "Find current flights and help with travel planning",
    icon: Search,
  },
  {
    title: "Create a calendar event",
    description: "Set up your potential Denver trip scheduling",
    icon: Calendar,
  },
  {
    title: "Draft a press release",
    description: "For the upcoming album 'Cosmic Echoes'",
    icon: FileText,
  },
  {
    title: "Connect travel booking platforms",
    description: "Access airline reservation systems",
    icon: Globe,
  },
  {
    title: "Schedule social media posts",
    description: "Announcing the album release date",
    icon: Send,
  },
  {
    title: "Brainstorm music video concepts",
    description: "For the lead single 'Starlight'",
    icon: Tv,
  },
];

const SuggestedActions = () => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-white mb-4">What would you like me to help you with?</h3>
      <div className="space-y-3">
        {suggestedActions.map((action, index) => (
          <motion.div
            key={index}
            className="bg-white/5 p-3 rounded-lg flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer"
            whileHover={{ x: 3 }}
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-md">
                <action.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm text-white">{action.title}</p>
                <p className="text-xs text-white/70">{action.description}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
              Start
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedActions;