
import { motion } from "framer-motion";
import { User, Shield, DollarSign, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collaborator } from "./types";

interface CollaboratorDetailsProps {
  collaborator: Collaborator;
}

const CollaboratorDetails = ({ collaborator }: CollaboratorDetailsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="p-4 glass-card border border-white/10 backdrop-blur-md rounded-lg"
    >
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: collaborator.color }}
          >
            <User size={14} className="text-white" />
          </div>
          <div>
            <h3 className="font-medium">{collaborator.name}</h3>
            <p className="text-xs text-studio-clay">{collaborator.role}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <p className="text-xs font-medium mb-1">Contribution</p>
            <p className="text-sm">{collaborator.contribution}</p>
          </div>
          <div>
            <p className="text-xs font-medium mb-1">Revenue Share</p>
            <p className="text-sm">{collaborator.share}% of total royalties</p>
          </div>
        </div>
        
        <div className="mt-2">
          <p className="text-xs font-medium mb-1">Rights & Responsibilities</p>
          <p className="text-sm">{collaborator.details}</p>
        </div>
        
        <div className="flex justify-between mt-3 pt-3 border-t border-studio-sand/30">
          <Button variant="outline" size="sm" className="text-xs">
            <Shield size={14} className="mr-1" />
            View Rights
          </Button>
          
          <Button variant="outline" size="sm" className="text-xs">
            <DollarSign size={14} className="mr-1" />
            Payment History
          </Button>
          
          <Button variant="outline" size="sm" className="text-xs">
            Contact
            <ChevronRight size={14} className="ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CollaboratorDetails;
