
import React from "react";
import { motion } from "framer-motion";
import { Coins, Gem, Scroll } from "lucide-react";
import { TreasureItemProps } from "./types";

const TreasureItem: React.FC<TreasureItemProps> = ({ treasure, onClick, isSelected }) => {
  return (
    <motion.div
      className="glass-card rounded-xl p-4 cursor-pointer border border-white/10 backdrop-blur-md hover:shadow-md transition-all"
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(treasure)}
      style={{ 
        background: `linear-gradient(135deg, white 0%, ${treasure.color}20 100%)`,
        borderLeft: `4px solid ${treasure.color}`
      }}
    >
      <div className="flex justify-between">
        <div>
          <div className="flex items-center">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
              style={{ backgroundColor: `${treasure.color}30` }}
            >
              {treasure.type === "coin" && <Coins className="w-5 h-5" style={{ color: treasure.color }} />}
              {treasure.type === "gem" && <Gem className="w-5 h-5" style={{ color: treasure.color }} />}
              {treasure.type === "artifact" && <Scroll className="w-5 h-5" style={{ color: treasure.color }} />}
            </div>
            <div>
              <h3 className="font-medium">{treasure.name}</h3>
              <p className="text-xs text-muted-foreground">{treasure.description}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">${treasure.value.toLocaleString()}</p>
          <p className={`text-xs ${treasure.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {treasure.growth >= 0 ? '↑' : '↓'} {Math.abs(treasure.growth)}%
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TreasureItem;
