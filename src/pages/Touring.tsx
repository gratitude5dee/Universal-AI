import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Calendar, Users, DollarSign, Bot, Music, Sparkles, MapPin, Clock, TrendingUp } from "lucide-react";
import DashboardLayout from "@/layouts/dashboard-layout";
import GigManagerDashboard from "@/components/touring/GigManagerDashboard";
import AIBookingAssistant from "@/components/touring/AIBookingAssistant";
import TourCalendar from "@/components/touring/TourCalendar";
import InvoicesPanel from "@/components/touring/InvoicesPanel";
import ContactsDirectory from "@/components/touring/ContactsDirectory";

const Touring = () => {
  const [activeTab, setActiveTab] = useState("gigs");

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const tabData = [
    {
      value: "gigs",
      label: "Gig Manager",
      description: "Performance scheduling",
      icon: Calendar,
      component: <GigManagerDashboard />,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      gradient: "from-blue-500/20 to-blue-600/20"
    },
    {
      value: "ai-booking",
      label: "AI Booking",
      description: "Intelligent automation",
      icon: Bot,
      component: <AIBookingAssistant />,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      gradient: "from-purple-500/20 to-purple-600/20"
    },
    {
      value: "calendar",
      label: "Tour Calendar",
      description: "Timeline overview",
      icon: Calendar,
      component: <TourCalendar />,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      gradient: "from-green-500/20 to-green-600/20"
    },
    {
      value: "invoices",
      label: "Invoices",
      description: "Payment tracking",
      icon: DollarSign,
      component: <InvoicesPanel />,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      gradient: "from-orange-500/20 to-orange-600/20"
    },
    {
      value: "contacts",
      label: "Contacts",
      description: "Network management",
      icon: Users,
      component: <ContactsDirectory />,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      gradient: "from-pink-500/20 to-pink-600/20"
    }
  ];

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-8"
        variants={containerAnimation}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={itemAnimation} className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/10 rounded-2xl">
              <Music className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                Touring Central
                <Sparkles className="h-6 w-6 text-primary" />
              </h1>
              <p className="text-muted-foreground text-lg">
                AI-powered tour management with intelligent booking automation
              </p>
            </div>
          </div>

          {/* Tour Stats Overview */}
          <div className="glass-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div 
                className="text-center"
                variants={itemAnimation}
              >
                <div className="p-3 bg-blue-500/10 rounded-xl inline-block mb-3">
                  <MapPin className="h-6 w-6 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Cities Visited</p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                variants={itemAnimation}
              >
                <div className="p-3 bg-green-500/10 rounded-xl inline-block mb-3">
                  <Calendar className="h-6 w-6 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Upcoming Shows</p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                variants={itemAnimation}
              >
                <div className="p-3 bg-purple-500/10 rounded-xl inline-block mb-3">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-foreground">$0</p>
                <p className="text-sm text-muted-foreground">Tour Revenue</p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                variants={itemAnimation}
              >
                <div className="p-3 bg-orange-500/10 rounded-xl inline-block mb-3">
                  <Clock className="h-6 w-6 text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Hours Performed</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Tabs */}
        <motion.div variants={itemAnimation} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center w-full mb-8">
              <div className="glass-card p-3 max-w-4xl w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-3 bg-transparent h-auto p-0">
                  {tabData.map((tab, index) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.value;
                    
                    return (
                      <motion.div
                        key={tab.value}
                        variants={itemAnimation}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <TabsTrigger
                          value={tab.value}
                          className={`
                            group relative flex flex-col items-center gap-2 w-full p-4 rounded-xl
                            transition-all duration-300 hover:shadow-card-glow overflow-hidden
                            ${isActive 
                              ? `${tab.bgColor} ${tab.color} shadow-lg` 
                              : 'hover:bg-background/50 text-muted-foreground hover:text-foreground'}
                          `}
                        >
                          <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-background/50'} group-hover:scale-110 transition-transform`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-sm leading-tight">{tab.label}</p>
                            <p className="text-xs opacity-75 mt-1">{tab.description}</p>
                          </div>
                          
                          {isActive && (
                            <motion.div
                              layoutId="activeTabIndicator"
                              className={`absolute inset-0 bg-gradient-to-br ${tab.gradient} rounded-xl opacity-20`}
                              initial={false}
                              transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                          )}
                        </TabsTrigger>
                      </motion.div>
                    );
                  })}
                </TabsList>
              </div>
            </div>

            {/* Enhanced Tab Content */}
            <AnimatePresence mode="wait">
              {tabData.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="mt-6">
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ 
                      duration: 0.4,
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                  >
                    <div className="glass-card p-8 min-h-[600px] hover:shadow-card-glow transition-all duration-300">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                        className="mb-6"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 ${tab.bgColor} rounded-lg`}>
                            <tab.icon className={`h-5 w-5 ${tab.color}`} />
                          </div>
                          <h2 className="text-2xl font-semibold text-foreground">{tab.label}</h2>
                        </div>
                        <p className="text-muted-foreground">{tab.description}</p>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        {tab.component}
                      </motion.div>
                    </div>
                  </motion.div>
                </TabsContent>
              ))}
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Touring;