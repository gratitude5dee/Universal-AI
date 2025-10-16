import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
  delay?: number;
}

export const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  color = "bg-[#9b87f5]/20",
  delay = 0 
}: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.03, y: -4 }}
    >
      <Card className={`backdrop-blur-md ${color} border border-white/20 p-5 shadow-card-glow hover:shadow-glow transition-all duration-300`}>
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-medium text-white text-shadow-sm">{title}</h3>
        </div>
        <p className="text-sm text-white/80 text-shadow-sm">{description}</p>
      </Card>
    </motion.div>
  );
};
