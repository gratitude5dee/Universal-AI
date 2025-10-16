import React from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Archive, 
  Calendar, 
  Clock, 
  CheckCircle, 
  FileSignature, 
  DollarSign 
} from "lucide-react";

interface GigStatusTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts: {
    all: number;
    upcoming: number;
    pending: number;
    confirmed: number;
    contracted: number;
    completed: number;
  };
  children: React.ReactNode;
}

export const GigStatusTabs: React.FC<GigStatusTabsProps> = ({
  activeTab,
  onTabChange,
  counts,
  children
}) => {
  const tabs = [
    { value: "all", label: "All Gigs", icon: Archive, color: "text-white/70", count: counts.all },
    { value: "upcoming", label: "Upcoming", icon: Calendar, color: "text-blue-400", count: counts.upcoming },
    { value: "pending", label: "Pending", icon: Clock, color: "text-yellow-400", count: counts.pending },
    { value: "confirmed", label: "Confirmed", icon: CheckCircle, color: "text-green-400", count: counts.confirmed },
    { value: "contracted", label: "Contracted", icon: FileSignature, color: "text-cyan-400", count: counts.contracted },
    { value: "completed", label: "Completed", icon: DollarSign, color: "text-purple-400", count: counts.completed },
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="glass-card p-4 mb-6 bg-white/5 backdrop-blur-xl border border-white/10">
        <TabsList className="w-full bg-transparent grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 h-auto p-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;
            
            return (
              <motion.div
                key={tab.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <TabsTrigger
                  value={tab.value}
                  className={`
                    group relative flex items-center justify-between w-full p-4 rounded-xl
                    transition-all duration-300 data-[state=active]:bg-blue-primary/10
                    ${isActive ? 'border-2 border-blue-primary shadow-lg' : 'border border-white/10 hover:bg-white/5'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-primary/20' : 'bg-white/5'}`}>
                      <Icon className={`h-4 w-4 ${isActive ? 'text-blue-primary' : tab.color}`} />
                    </div>
                    <span className={`font-medium text-sm ${isActive ? 'text-blue-primary' : 'text-white'}`}>
                      {tab.label}
                    </span>
                  </div>
                  {tab.count > 0 && (
                    <Badge 
                      variant={isActive ? "default" : "secondary"}
                      className={`ml-2 ${isActive ? 'bg-blue-primary text-white' : 'bg-white/10 text-white/70'}`}
                    >
                      {tab.count}
                    </Badge>
                  )}
                </TabsTrigger>
              </motion.div>
            );
          })}
        </TabsList>
      </div>

      <div className="space-y-4">
        {children}
      </div>
    </Tabs>
  );
};
