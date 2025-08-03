
import { motion } from "framer-motion";
import { Play, Award, Globe, Users, Star, Shield, Coins, FileText, Copyright, DollarSign, Lock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const RightsJourney = () => {
  const [activeRightDetail, setActiveRightDetail] = useState(null);
  
  const journey = [
    { 
      icon: Play, 
      title: "Creation", 
      date: "May 12, 2023",
      description: "Your journey began when you created this work",
      details: "Initial copyright automatically applied at creation. No registration required."
    },
    { 
      icon: Award, 
      title: "Rights Established", 
      date: "May 12, 2023",
      description: "Copyright automatically applied to your creation",
      details: "Full ownership of reproduction, distribution, display, and derivative rights secured." 
    },
    { 
      icon: Users, 
      title: "Collaboration", 
      date: "May 15, 2023",
      description: "You invited 3 collaborators to join the journey",
      details: "Ownership split: You (70%), Alex (15%), Sam (15%). Royalty distributions set up automatically." 
    },
    { 
      icon: Globe, 
      title: "Public Release", 
      date: "June 1, 2023",
      description: "Your creation was shared with the world",
      details: "Released under Creative Commons license allowing sharing with attribution required." 
    },
    { 
      icon: Star, 
      title: "First Milestone", 
      date: "July 10, 2023",
      description: "Reached 5,000 views and first revenue",
      details: "First royalty distribution completed. All parties received their share automatically." 
    }
  ];
  
  const licenseOptions = [
    { id: "cc-by", name: "Creative Commons - Attribution", description: "Others can distribute, remix, adapt, and build upon your work, even commercially, as long as they credit you for the original creation." },
    { id: "cc-by-sa", name: "CC - Attribution-ShareAlike", description: "Others can remix, adapt, and build upon your work even for commercial purposes, as long as they credit you and license their new creations under identical terms." },
    { id: "cc-by-nc", name: "CC - Attribution-NonCommercial", description: "Others can remix, adapt, and build upon your work non-commercially, and although their new works must also acknowledge you, they don't have to license their derivative works on the same terms." },
    { id: "custom", name: "Custom License", description: "Create a custom license with specific terms tailored to your needs." }
  ];
  
  const handleDetailClick = (index) => {
    if (activeRightDetail === index) {
      setActiveRightDetail(null);
    } else {
      setActiveRightDetail(index);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <Shield className="text-[#9b87f5]" size={18} />
          IP Timeline
        </h2>
        <Button variant="outline" size="sm" className="text-xs">
          Export Timeline
        </Button>
      </div>
      
      <div className="relative py-2">
        <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-studio-sand/50" />
        
        {journey.map((step, index) => (
          <motion.div 
            key={index}
            className="flex items-start gap-4 mb-6 relative"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            whileHover={{ x: 5 }}
          >
            <motion.div 
              className="w-7 h-7 rounded-full bg-[#9b87f5]/20 flex items-center justify-center shrink-0 z-10"
              whileHover={{ scale: 1.2, backgroundColor: "rgba(155, 135, 245, 0.4)" }}
            >
              <step.icon size={14} className="text-[#9b87f5]" />
            </motion.div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{step.title}</h3>
                <span className="text-xs text-studio-clay">{step.date}</span>
              </div>
              <p className="text-sm text-studio-clay">{step.description}</p>
              
              <motion.button 
                className="text-xs text-[#9b87f5] mt-1 flex items-center gap-1"
                whileHover={{ x: 3 }}
                onClick={() => handleDetailClick(index)}
              >
                {activeRightDetail === index ? "Hide details" : "View details"}
              </motion.button>
              
              {activeRightDetail === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 p-3 bg-[#F1F0FB] rounded-lg text-xs text-studio-charcoal"
                >
                  {step.details}
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}

        <div className="flex justify-between ml-7">
          <motion.button 
            className="text-sm text-[#9b87f5] flex items-center gap-1"
            whileHover={{ x: 3 }}
          >
            Complete timeline
          </motion.button>
          
          <motion.button 
            className="text-sm text-[#9b87f5] flex items-center gap-1"
            whileHover={{ x: -3 }}
          >
            Add milestone
          </motion.button>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <FileText className="text-[#9b87f5]" size={18} />
            Licensing Options
          </h2>
          <Button variant="outline" size="sm" className="text-xs">
            Apply New License
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {licenseOptions.map((license, index) => (
            <motion.div
              key={license.id}
              className="p-3 glass-card border border-white/10 backdrop-blur-md rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
            >
              <div className="flex items-start gap-2">
                <div className="bg-[#9b87f5]/10 p-1.5 rounded-md">
                  <Copyright size={16} className="text-[#9b87f5]" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">{license.name}</h3>
                  <p className="text-xs text-studio-clay mt-1">{license.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="p-4 rounded-lg glass-card border border-white/10 backdrop-blur-md mt-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-[#9b87f5]/10 p-2 rounded-md">
            <Coins size={18} className="text-[#9b87f5]" />
          </div>
          <h2 className="text-lg font-medium">Current Royalty Structure</h2>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#9b87f5]"></div>
              <span className="text-sm">You (Creator)</span>
            </div>
            <span className="font-medium">70%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#33C3F0]"></div>
              <span className="text-sm">Alex Rivera (Visual)</span>
            </div>
            <span className="font-medium">15%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#F97316]"></div>
              <span className="text-sm">Sam Taylor (Narrative)</span>
            </div>
            <span className="font-medium">15%</span>
          </div>
        </div>
        
        <div className="h-4 w-full bg-gray-100 rounded-full mt-4 overflow-hidden flex">
          <div className="h-full bg-[#9b87f5]" style={{ width: "70%" }}></div>
          <div className="h-full bg-[#33C3F0]" style={{ width: "15%" }}></div>
          <div className="h-full bg-[#F97316]" style={{ width: "15%" }}></div>
        </div>
        
        <div className="mt-4 flex justify-between">
          <Button variant="outline" size="sm" className="text-xs">
            <Share2 size={14} className="mr-1" />
            Adjust Splits
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <DollarSign size={14} className="mr-1" />
            Payment History
          </Button>
        </div>
      </div>
      
      <motion.div 
        className="p-4 rounded-lg border border-[#9b87f5]/30 bg-[#9b87f5]/5 mt-6 flex items-center justify-between"
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-full">
            <Lock size={18} className="text-[#9b87f5]" />
          </div>
          <div>
            <h3 className="font-medium">Rights Transfer Wizard</h3>
            <p className="text-sm text-studio-clay">Transfer or license your IP rights to others</p>
          </div>
        </div>
        <Button className="bg-[#9b87f5] hover:bg-[#7E69AB]">
          Start Transfer
        </Button>
      </motion.div>
    </div>
  );
};

export default RightsJourney;
