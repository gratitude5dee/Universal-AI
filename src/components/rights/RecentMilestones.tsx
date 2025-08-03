
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, DollarSign, Users, Eye, Book, PartyPopper } from "lucide-react";
import confetti from "canvas-confetti";

const RecentMilestones = () => {
  const [celebratingIndex, setCelebratingIndex] = useState<number | null>(null);
  
  const milestones = [
    {
      icon: DollarSign,
      title: "Revenue Milestone",
      description: "You've reached $500 in revenue!",
      date: "December 15, 2023",
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: Users,
      title: "Collaboration Milestone",
      description: "5 creators have joined your ecosystem",
      date: "November 30, 2023",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: Eye,
      title: "Audience Milestone",
      description: "Your creation has reached 10,000 views",
      date: "November 10, 2023",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: Book,
      title: "License Milestone",
      description: "Your creation has been licensed by a major platform",
      date: "October 25, 2023",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600"
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
      {milestones.map((milestone, index) => (
        <motion.div
          key={index}
          className="p-4 rounded-xl glass-card border border-white/10 backdrop-blur-md relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
        >
          <AnimatePresence>
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
          </AnimatePresence>
          
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${milestone.iconBg}`}>
              <milestone.icon className={`h-5 w-5 ${milestone.iconColor}`} />
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium">{milestone.title}</h3>
              <p className="text-sm text-studio-clay">{milestone.description}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-studio-clay">{milestone.date}</span>
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
    </div>
  );
};

export default RecentMilestones;
