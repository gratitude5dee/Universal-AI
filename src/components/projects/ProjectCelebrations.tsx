
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Award, PartyPopper, Star, ThumbsUp, Gift } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";

const ProjectCelebrations = () => {
  const [celebratingIndex, setCelebratingIndex] = useState<number | null>(null);
  
  const achievements = [
    {
      member: "Team",
      title: "First 100 Users",
      description: "Our interactive story reached its first 100 users!",
      date: "January 30, 2024",
      icon: Star,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600"
    },
    {
      member: "Alex",
      title: "Art Featured",
      description: "Character designs were featured in Digital Artist magazine",
      date: "February 15, 2024",
      icon: Award,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      member: "Morgan",
      title: "Story Milestone",
      description: "Completed the final chapter of our interactive narrative",
      date: "March 5, 2024",
      icon: Gift,
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      member: "Jordan",
      title: "Technical Achievement",
      description: "Implemented the page-turning animation that everyone loves",
      date: "February 20, 2024",
      icon: ThumbsUp,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    }
  ];
  
  const handleCelebrate = (index: number) => {
    setCelebratingIndex(index);
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    setTimeout(() => setCelebratingIndex(null), 3000);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {achievements.map((achievement, index) => (
        <motion.div
          key={index}
          className="p-4 rounded-xl glass-card border border-white/10 backdrop-blur-md relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
        >
          {/* Celebration overlay */}
          {celebratingIndex === index && (
            <motion.div 
              className="absolute inset-0 bg-studio-highlight/20 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                <PartyPopper className="h-12 w-12 text-studio-accent" />
              </motion.div>
            </motion.div>
          )}
          
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${achievement.iconBg}`}>
              <achievement.icon className={`h-5 w-5 ${achievement.iconColor}`} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center">
                <h3 className="font-medium">{achievement.title}</h3>
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-studio-sand/30 text-studio-clay">
                  {achievement.member}
                </span>
              </div>
              <p className="text-sm text-studio-clay">{achievement.description}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-studio-clay">{achievement.date}</span>
                <motion.button 
                  className="text-xs text-studio-accent flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleCelebrate(index)}
                >
                  <Award className="h-3 w-3" />
                  Celebrate
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
      
      <motion.div
        className="col-span-1 sm:col-span-2 p-6 rounded-xl bg-gradient-to-r from-studio-highlight to-studio-accent/20 border border-studio-accent/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center">
              <PartyPopper className="h-8 w-8 text-studio-accent" />
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-medium mb-1">Project Celebration Ritual</h3>
            <p className="text-studio-charcoal/80 mb-3">
              We're nearly halfway to completion! Let's plan our milestone celebration together.
            </p>
            <Button variant="outline" className="bg-white/50">
              Plan Celebration
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectCelebrations;
