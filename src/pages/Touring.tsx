import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Calendar, Users, DollarSign, Bot, Music } from "lucide-react";
import DashboardLayout from "@/layouts/dashboard-layout";
import GigManagerDashboard from "@/components/touring/GigManagerDashboard";
import AIBookingAssistant from "@/components/touring/AIBookingAssistant";
import TourCalendar from "@/components/touring/TourCalendar";
import InvoicesPanel from "@/components/touring/InvoicesPanel";
import ContactsDirectory from "@/components/touring/ContactsDirectory";

const Touring = () => {
  const [activeTab, setActiveTab] = useState("gigs");

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
    <DashboardLayout>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Music className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Touring Central</h1>
            <p className="text-muted-foreground">Manage your tours with AI-powered booking intelligence</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 bg-background/50 backdrop-blur-sm border border-border/50 p-1">
            {tabData.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <AnimatePresence mode="wait">
            {tabData.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
                    {tab.component}
                  </Card>
                </motion.div>
              </TabsContent>
            ))}
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
};

export default Touring;