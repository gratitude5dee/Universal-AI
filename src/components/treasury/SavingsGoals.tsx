
import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import SavingsGoalItem from "./SavingsGoalItem";

interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
}

interface SavingsGoalsProps {
  goals: SavingsGoal[];
  onAddToGoal: (goalId: string) => void;
}

const SavingsGoals: React.FC<SavingsGoalsProps> = ({ goals, onAddToGoal }) => {
  return (
    <div className="glass-card rounded-xl p-5 border border-white/10 backdrop-blur-md">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Sparkles className="h-5 w-5 mr-2 text-studio-accent" />
        Enchanted Savings Goals
      </h3>
      
      <div className="space-y-4">
        {goals.map((goal) => (
          <SavingsGoalItem 
            key={goal.id} 
            goal={goal} 
            onAddToGoal={onAddToGoal} 
          />
        ))}
      </div>
    </div>
  );
};

export default SavingsGoals;
