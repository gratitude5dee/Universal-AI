import React from "react";
import { motion } from "framer-motion";
import { Gem, Flower, Droplets, Clover, Bird, Sparkles } from "lucide-react";

const achievements = [
  { id: 1, name: "First Bloom", description: "Agent reached 100 interactions", icon: Flower, color: "#FF9800" },
  { id: 2, name: "Garden Guardian", description: "5 consecutive days of growth", icon: Droplets, color: "#03A9F4" },
  { id: 3, name: "Lucky Clover", description: "Exceptional performance spike", icon: Clover, color: "#8BC34A" },
  { id: 4, name: "Butterfly Effect", description: "Created viral content", icon: Bird, color: "#E91E63" },
  { id: 5, name: "Hidden Gem", description: "Discovered underutilized potential", icon: Gem, color: "#673AB7" },
];

interface AchievementGardenProps {
  revealAchievement: (achievement: any) => void;
}

const AchievementGarden = ({ revealAchievement }: AchievementGardenProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-6"
    >
      <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
        <Gem className="h-5 w-5 text-studio-accent" />
        Achievement Garden
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {achievements.map((achievement) => {
          const AchievementIcon = achievement.icon;
          return (
            <motion.div
              key={achievement.id}
              className="backdrop-blur-md bg-white/10 rounded-2xl p-5 text-center cursor-pointer hover:shadow-md transition-all border border-white/20"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onClick={() => revealAchievement(achievement)}
            >
              <div 
                className="rounded-full mx-auto mb-3 w-12 h-12 flex items-center justify-center"
                style={{ backgroundColor: `${achievement.color}20` }}
              >
                <AchievementIcon className="h-6 w-6" style={{ color: achievement.color }} />
              </div>
              <h3 className="font-medium text-sm mb-1">{achievement.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{achievement.description}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AchievementGarden;