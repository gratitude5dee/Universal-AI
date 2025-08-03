
import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface SavingsGoalProps {
  goal: {
    id: string;
    name: string;
    target: number;
    current: number;
    deadline: string;
    color: string;
  };
  onAddToGoal: (goalId: string) => void;
}

const SavingsGoalItem: React.FC<SavingsGoalProps> = ({ goal, onAddToGoal }) => {
  const progress = (goal.current / goal.target) * 100;
  const isComplete = goal.current >= goal.target;

  return (
    <div className="glass-card rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">{goal.name}</h4>
        <div className="text-sm font-medium">
          ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
        </div>
      </div>
      
      <div className="mb-2">
        <Progress 
          value={progress} 
          className="h-2"
          indicatorClassName={`bg-gradient-to-r from-studio-accent/70 to-${goal.color}`}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {goal.deadline}
        </span>
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs h-7 px-2"
          onClick={() => onAddToGoal(goal.id)}
        >
          Add Magic (+$500)
        </Button>
      </div>
      
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 bg-green-100 p-2 rounded-lg text-xs text-green-800 flex items-center"
        >
          <Sparkles className="h-3 w-3 mr-1" />
          Goal achieved! Your magic is strong!
        </motion.div>
      )}
    </div>
  );
};

export default SavingsGoalItem;
