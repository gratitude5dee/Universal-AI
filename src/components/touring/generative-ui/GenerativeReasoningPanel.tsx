import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";

interface GenerativeReasoningPanelProps {
  reasoning: string;
  matchScore: number;
  delay?: number;
}

export const GenerativeReasoningPanel: React.FC<GenerativeReasoningPanelProps> = ({
  reasoning,
  matchScore,
  delay = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= reasoning.length) {
        setDisplayedText(reasoning.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 20);

    return () => clearInterval(typingInterval);
  }, [reasoning]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000 }}
      className="glass-card p-4 border-l-4 border-purple-500"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-start justify-between gap-3 text-left group"
      >
        <div className="flex items-start gap-3 flex-1">
          <motion.div
            animate={{ rotate: isTyping ? 360 : 0 }}
            transition={{ duration: 2, repeat: isTyping ? Infinity : 0, ease: "linear" }}
          >
            <Sparkles className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
          </motion.div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
              Why This Venue is Perfect
              <span className="text-sm font-normal text-purple-400">({matchScore}% match)</span>
            </h4>
            <p className={`text-sm text-muted-foreground ${!isExpanded ? 'line-clamp-2' : ''}`}>
              {displayedText}
              {isTyping && <span className="animate-pulse">|</span>}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          )}
        </motion.div>
      </button>
    </motion.div>
  );
};
