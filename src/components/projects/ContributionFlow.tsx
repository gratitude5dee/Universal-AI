
import React from "react";
import { motion } from "framer-motion";
import { GitBranch, GitPullRequest, ThumbsUp, MessageCircle } from "lucide-react";

const ContributionFlow = () => {
  const contributions = [
    {
      id: 1,
      author: "Morgan",
      type: "Story Update",
      title: "Added character backstories",
      description: "Expanded the history of the main protagonists",
      timestamp: "2 days ago",
      comments: 3,
      reactions: 5
    },
    {
      id: 2,
      author: "Alex",
      type: "Visual Assets",
      title: "New environment illustrations",
      description: "Created the forest clearing and river bend scenes",
      timestamp: "3 days ago",
      comments: 2,
      reactions: 7
    },
    {
      id: 3,
      author: "Jordan",
      type: "Interaction",
      title: "Page transition animations",
      description: "Smooth page turning effect with sound",
      timestamp: "1 week ago",
      comments: 5,
      reactions: 8
    },
    {
      id: 4,
      author: "You",
      type: "Project Update",
      title: "Revised story structure",
      description: "Reorganized narrative flow based on feedback",
      timestamp: "1 week ago",
      comments: 4,
      reactions: 6
    }
  ];

  return (
    <div className="glass-card p-6 rounded-xl">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <GitBranch className="w-5 h-5 mr-2 text-studio-accent" />
        Contribution Rivers
      </h3>
      
      <div className="relative">
        {/* Flowing river visualization */}
        <div className="absolute left-[27px] top-0 bottom-0 w-6">
          <motion.div 
            className="h-full w-full"
            style={{
              background: 'linear-gradient(to bottom, rgba(217, 143, 100, 0.1), rgba(217, 143, 100, 0.3), rgba(217, 143, 100, 0.1))'
            }}
            animate={{
              backgroundPosition: ["0% 0%", "0% 100%"]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        </div>
        
        <div className="space-y-6 pl-16">
          {contributions.map((contribution, index) => (
            <motion.div
              key={contribution.id}
              className="glass-card rounded-xl p-4 border border-white/10 backdrop-blur-md relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Tributary connecting to main river */}
              <div className="absolute left-[-20px] top-1/2 transform -translate-y-1/2 w-5 h-[2px] bg-studio-accent/30" />
              <div className="absolute left-[-24px] top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 border-studio-accent/50 flex items-center justify-center">
                <GitPullRequest className="w-3 h-3 text-studio-accent" />
              </div>
              
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-studio-highlight/20 text-studio-accent">
                    {contribution.type}
                  </span>
                  <span className="text-xs text-studio-clay ml-2">
                    by {contribution.author} • {contribution.timestamp}
                  </span>
                </div>
              </div>
              
              <h4 className="font-medium mb-1">{contribution.title}</h4>
              <p className="text-sm text-studio-clay mb-3">{contribution.description}</p>
              
              <div className="flex gap-3 text-xs text-studio-clay">
                <span className="flex items-center">
                  <ThumbsUp className="w-3 h-3 mr-1" />
                  {contribution.reactions}
                </span>
                <span className="flex items-center">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  {contribution.comments}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContributionFlow;
