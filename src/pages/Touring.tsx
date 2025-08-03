import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, DollarSign, Bot, FileText } from "lucide-react";
import GigManagerDashboard from "@/components/touring/GigManagerDashboard";
import AIBookingAssistant from "@/components/touring/AIBookingAssistant";
import TourCalendar from "@/components/touring/TourCalendar";
import InvoicesPanel from "@/components/touring/InvoicesPanel";
import ContactsDirectory from "@/components/touring/ContactsDirectory";

const Touring = () => {
  const [activeTab, setActiveTab] = useState("gigs");

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const tabData = [
    {
      value: "gigs",
      label: "Gig Manager",
      icon: Calendar,
      component: <GigManagerDashboard />
    },
    {
      value: "ai-booking",
      label: "AI Booking",
      icon: Bot,
      component: <AIBookingAssistant />
    },
    {
      value: "calendar",
      label: "Tour Calendar",
      icon: Calendar,
      component: <TourCalendar />
    },
    {
      value: "invoices",
      label: "Invoices",
      icon: DollarSign,
      component: <InvoicesPanel />
    },
    {
      value: "contacts",
      label: "Contacts",
      icon: Users,
      component: <ContactsDirectory />
    }
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-gradient-to-br from-background via-background to-studio-accent/5 p-4 md:p-6"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-studio-accent to-accent bg-clip-text text-transparent">
            Touring Management
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Professional gig management with AI-powered booking assistance
          </p>
        </motion.div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-1 bg-white/5 backdrop-blur-md border border-white/10 p-1">
              {tabData.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex items-center gap-2 data-[state=active]:bg-studio-accent/20 data-[state=active]:text-studio-accent transition-all duration-200"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </motion.div>

          {/* Tab Content */}
          <div className="mt-6">
            {tabData.map((tab, index) => (
              <TabsContent key={tab.value} value={tab.value} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {tab.component}
                </motion.div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default Touring;