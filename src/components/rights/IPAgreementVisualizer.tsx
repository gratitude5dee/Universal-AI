
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Clock, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  X, 
  AlertTriangle,
  Globe,
  DollarSign,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AgreementTerm {
  id: string;
  title: string;
  description: string;
  status: "active" | "pending" | "warning";
}

const IPAgreementVisualizer = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  
  const agreementTerms: AgreementTerm[] = [
    {
      id: "term-1",
      title: "Collaboration Rights & Splits",
      description: "Creator maintains 70% ownership with delegated rights to collaborators. Splits are automatically enforced at 70%, 15%, 15% distribution amongst all parties.",
      status: "active"
    },
    {
      id: "term-2",
      title: "Usage Permissions",
      description: "Creative Commons Attribution license allowing sharing with required attribution. Commercial use permitted under specific conditions outlined in clause 3.2.",
      status: "active"
    },
    {
      id: "term-3",
      title: "Derivative Works",
      description: "Limited rights for derivative works with consent of at least 2/3 stakeholders. All derivative works maintain original split model with additional 5% to derivative creator.",
      status: "active"
    },
    {
      id: "term-4",
      title: "Territory Restrictions",
      description: "Rights valid in all territories with exception of restricted jurisdictions as specified in the most recent amendment dated June 7, 2023.",
      status: "warning"
    },
    {
      id: "term-5",
      title: "License Term Duration",
      description: "Agreement valid for 2 years with automatic renewal for 1-year terms unless terminated by majority stakeholder decision with 60-day notice.",
      status: "pending"
    }
  ];
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case "active":
        return <CheckCircle size={16} className="text-green-500" />;
      case "pending":
        return <Clock size={16} className="text-amber-500" />;
      case "warning":
        return <AlertTriangle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };
  
  const toggleExpand = (id: string) => {
    if (expanded === id) {
      setExpanded(null);
    } else {
      setExpanded(id);
    }
  };

  return (
    <div className="space-y-5 mt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <FileText size={18} className="text-[#9b87f5]" />
          IP Agreement Visualization
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Save Changes" : "Edit Agreement"}
        </Button>
      </div>
      
      <div className="space-y-3">
        {agreementTerms.map((term) => (
          <motion.div
            key={term.id}
            className="glass-card border border-white/10 backdrop-blur-md rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F1F0FB]/50"
              onClick={() => toggleExpand(term.id)}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(term.status)}
                <h4 className="font-medium">{term.title}</h4>
              </div>
              <div>
                {expanded === term.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>
            
            {expanded === term.id && (
              <div className="p-4 pt-0 border-t border-white/10 backdrop-blur-md">
                {editMode ? (
                  <Textarea 
                    className="w-full min-h-[80px]"
                    defaultValue={term.description}
                  />
                ) : (
                  <p className="text-sm text-studio-clay">{term.description}</p>
                )}
                
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    View History
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    Explain in Simple Terms
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="flex justify-between items-center pt-2">
        <div className="flex gap-3 text-xs text-studio-clay">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Active</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span>Requires Attention</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" className="bg-[#9b87f5] hover:bg-[#8A78DF]">
            <Globe size={14} className="mr-1" /> 
            Publish Agreement
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IPAgreementVisualizer;
