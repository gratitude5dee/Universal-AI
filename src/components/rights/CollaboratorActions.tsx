import { motion } from "framer-motion";
import { UserPlus, Settings } from "lucide-react";

interface CollaboratorActionsProps {
  onEdit?: () => void;
}

const CollaboratorActions = ({ onEdit }: CollaboratorActionsProps) => {
  return (
    <div className="flex justify-between mt-3">
      <motion.button 
        className="text-sm text-[#9b87f5] flex items-center gap-1"
        whileHover={{ scale: 1.05 }}
      >
        <UserPlus size={14} />
        Add Collaborator
      </motion.button>
      
      <motion.button 
        className="text-sm text-[#9b87f5] flex items-center gap-1"
        whileHover={{ scale: 1.05 }}
        onClick={onEdit}
      >
        <Settings size={14} />
        Edit Ecosystem
      </motion.button>
    </div>
  );
};

export default CollaboratorActions;
