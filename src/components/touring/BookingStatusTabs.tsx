import React from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageSquare, CheckCircle, FileSignature, DollarSign, Archive } from "lucide-react";

interface BookingStatusTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts: {
    all: number;
    new: number;
    negotiating: number;
    accepted: number;
    contracted: number;
    paid: number;
  };
  children: React.ReactNode;
}

const BookingStatusTabs: React.FC<BookingStatusTabsProps> = ({
  activeTab,
  onTabChange,
  counts,
  children
}) => {
  const tabs = [
    { value: "all", label: "All Status", icon: Archive, color: "text-gray-400", count: counts.all },
    { value: "new", label: "New", icon: FileText, color: "text-gray-400", count: counts.new },
    { value: "negotiating", label: "Negotiating", icon: MessageSquare, color: "text-orange-400", count: counts.negotiating },
    { value: "accepted", label: "Accepted", icon: CheckCircle, color: "text-green-400", count: counts.accepted },
    { value: "contracted", label: "Contracted", icon: FileSignature, color: "text-blue-400", count: counts.contracted },
    { value: "paid", label: "Paid", icon: DollarSign, color: "text-emerald-400", count: counts.paid },
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="glass-card p-4 mb-6">
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
                    transition-all duration-300 data-[state=active]:bg-primary/10
                    ${isActive ? 'border-2 border-primary shadow-lg' : 'border border-border hover:bg-accent'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-primary/20' : 'bg-background'}`}>
                      <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : tab.color}`} />
                    </div>
                    <span className={`font-medium text-sm ${isActive ? 'text-primary' : 'text-foreground'}`}>
                      {tab.label}
                    </span>
                  </div>
                  {tab.count > 0 && (
                    <Badge 
                      variant={isActive ? "default" : "secondary"}
                      className={`ml-2 ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
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

export default BookingStatusTabs;
