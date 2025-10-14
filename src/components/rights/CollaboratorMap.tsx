
import { motion } from "framer-motion";
import { useState } from "react";
import { Shield, Info, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collaborator } from "./types";

interface CollaboratorMapProps {
  collaborators: Collaborator[];
  onToggleDetails: (id: string) => void;
}

const CollaboratorMap = ({ collaborators, onToggleDetails }: CollaboratorMapProps) => {
  return (
    <div className="relative h-[220px] p-4 rounded-xl bg-transparent overflow-hidden flex items-center justify-center">
      {/* Lines connecting collaborators */}
      <svg className="absolute inset-0 w-full h-full z-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9b87f5" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#9b87f5" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <motion.line 
          x1="90" 
          y1="110" 
          x2="210" 
          y2="70" 
          stroke="url(#lineGradient)" 
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        />
        <motion.line 
          x1="90" 
          y1="110" 
          x2="210" 
          y2="150" 
          stroke="url(#lineGradient)" 
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        />
        <motion.line 
          x1="210" 
          y1="70" 
          x2="210" 
          y2="150" 
          stroke="url(#lineGradient)" 
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        />
      </svg>
      
      {/* Collaboration center sphere */}
      <motion.div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#9b87f5]/30 bg-white z-10"
        animate={{ 
          scale: [1, 1.1, 1],
          boxShadow: [
            "0px 0px 0px 0px rgba(155, 135, 245, 0.3)",
            "0px 0px 15px 3px rgba(155, 135, 245, 0.3)",
            "0px 0px 0px 0px rgba(155, 135, 245, 0.3)"
          ]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      >
        <Shield size={18} className="text-[#9b87f5]" />
      </motion.div>
      
      {/* Collaborators */}
      {collaborators.map((collaborator, index) => {
        // Calculate position in the ecosystem
        let x, y;
        
        // Custom positions
        if (index === 0) { // You (Creator)
          x = 90;
          y = 110;
        } else if (index === 1) { // Alex
          x = 210;
          y = 70;
        } else { // Sam
          x = 210;
          y = 150;
        }
        
        // Scale circle based on share percentage
        const scale = 0.5 + (collaborator.share / 100) * 0.6;
        
        return (
          <motion.div
            key={collaborator.id}
            className="absolute flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              x,
              y,
              transition: { delay: index * 0.2, duration: 0.5 }
            }}
            style={{ 
              left: 0,
              top: 0,
              transform: `translate(${x}px, ${y}px) scale(${scale})` 
            }}
            whileHover={{ scale: scale * 1.1, zIndex: 30 }}
          >
            <motion.div 
              className="relative w-16 h-16 rounded-full flex items-center justify-center font-medium text-white cursor-pointer"
              style={{ backgroundColor: collaborator.color }}
              onClick={() => onToggleDetails(collaborator.id)}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm">{collaborator.share}%</span>
              <motion.div 
                className="absolute -right-1 -top-1 w-5 h-5 rounded-full bg-white flex items-center justify-center border border-studio-sand"
                whileHover={{ scale: 1.2 }}
              >
                <Info size={10} className="text-studio-charcoal" />
              </motion.div>
            </motion.div>
            <div className="flex flex-col items-center mt-2">
              <span className="text-xs font-medium whitespace-nowrap">{collaborator.name}</span>
              <span className="text-[10px] text-studio-clay whitespace-nowrap">{collaborator.role}</span>
            </div>
          </motion.div>
        );
      })}
      
      {/* Add collaborator button positioned at bottom right */}
      <motion.div
        className="absolute bottom-4 right-4 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Button size="sm" variant="outline" className="bg-white">
          <UserPlus size={14} className="mr-1" />
          Add
        </Button>
      </motion.div>
    </div>
  );
};

export default CollaboratorMap;
