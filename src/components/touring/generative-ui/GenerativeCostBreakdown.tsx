import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp } from "lucide-react";

interface CostItem {
  label: string;
  amount: number;
}

interface GenerativeCostBreakdownProps {
  items: CostItem[];
  delay?: number;
}

export const GenerativeCostBreakdown: React.FC<GenerativeCostBreakdownProps> = ({
  items,
  delay = 0
}) => {
  const [animatedAmounts, setAnimatedAmounts] = useState<number[]>(items.map(() => 0));
  const total = items.reduce((sum, item) => sum + item.amount, 0);

  useEffect(() => {
    items.forEach((item, index) => {
      const duration = 1000;
      const steps = 30;
      const increment = item.amount / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        if (currentStep < steps) {
          setAnimatedAmounts(prev => {
            const newAmounts = [...prev];
            newAmounts[index] = Math.min(increment * (currentStep + 1), item.amount);
            return newAmounts;
          });
          currentStep++;
        } else {
          clearInterval(interval);
        }
      }, duration / steps);

      return () => clearInterval(interval);
    });
  }, [items]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay / 1000, type: "spring" }}
      className="glass-card p-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="h-5 w-5 text-green-500" />
        <h4 className="font-semibold text-foreground">Cost Breakdown</h4>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (delay / 1000) + (index * 0.1) }}
            className="flex items-center justify-between py-2 border-b border-border last:border-0"
          >
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <motion.span className="text-sm font-semibold text-foreground tabular-nums">
              ${animatedAmounts[index].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </motion.span>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: (delay / 1000) + (items.length * 0.1) + 0.2 }}
          className="pt-3 mt-2 border-t-2 border-green-500/30 bg-green-500/10 -mx-4 px-4 py-3 rounded-b-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="font-bold text-foreground">Total Estimated Cost</span>
            </div>
            <span className="text-lg font-bold text-green-500 tabular-nums">
              ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
