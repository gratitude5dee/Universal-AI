import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, DollarSign, Bot, FileText, Sparkles } from "lucide-react";
import { 
  GlassPanel, 
  Card3D, 
  LiquidBackground, 
  FloatingOrb, 
  GradientBorder,
  HolographicText,
  ParticleField,
  MagneticButton,
  ShimmerEffect 
} from "@/components/ui/glass-components";
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
    <div className="relative min-h-screen overflow-hidden">
      {/* Liquid Background Effects */}
      <LiquidBackground colors={["purple", "cyan", "pink"]} count={4} baseSize={120} />
      <ParticleField count={30} className="absolute inset-0 pointer-events-none" />
      
      {/* Floating Orbs */}
      <FloatingOrb 
        color="purple" 
        size="128" 
        position={{ top: "10%", left: "85%" }} 
        delay={0} 
        duration={8} 
      />
      <FloatingOrb 
        color="cyan" 
        size="96" 
        position={{ top: "60%", left: "5%" }} 
        delay={2} 
        duration={10} 
      />

      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative z-10 p-4 md:p-6"
      >
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Enhanced Header with Glass Effect */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-center space-y-4"
          >
            <GradientBorder 
              className="inline-block"
              borderWidth={3}
              animationDuration={8}
              colors={["from-purple-500", "via-cyan-500", "to-pink-500"]}
            >
              <GlassPanel className="px-8 py-4" blur="2xl" withBorder={false}>
                <HolographicText 
                  as="h1" 
                  className="text-3xl md:text-5xl font-bold"
                >
                  <Sparkles className="inline-block mr-3 h-8 w-8" />
                  Touring Management
                </HolographicText>
              </GlassPanel>
            </GradientBorder>
            
            <motion.p 
              className="text-white/80 text-sm md:text-lg max-w-3xl mx-auto backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Professional gig management with AI-powered booking assistance
              <ShimmerEffect className="ml-2 inline-block" />
            </motion.p>
          </motion.div>

          {/* Enhanced Tabs Navigation with Glass Effect */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <GlassPanel 
                className="p-2" 
                blur="3xl" 
                withNoise={true}
                withBorder={true}
              >
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 bg-transparent">
                  {tabData.map((tab, index) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.value;
                    
                    return (
                      <motion.div
                        key={tab.value}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <MagneticButton asChild>
                          <TabsTrigger
                            value={tab.value}
                            className={`
                              flex items-center gap-2 relative overflow-hidden
                              bg-white/5 hover:bg-white/10 border border-white/20 
                              backdrop-blur-md transition-all duration-300
                              ${isActive ? 'bg-purple-500/20 border-purple-400/50 text-purple-200' : 'text-white/70'}
                            `}
                          >
                            <Icon className="h-4 w-4 z-10 relative" />
                            <span className="hidden sm:inline z-10 relative">{tab.label}</span>
                            {isActive && (
                              <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-cyan-500/30"
                                initial={false}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              />
                            )}
                          </TabsTrigger>
                        </MagneticButton>
                      </motion.div>
                    );
                  })}
                </TabsList>
              </GlassPanel>
            </motion.div>

            {/* Enhanced Tab Content with 3D Cards */}
            <div className="mt-8">
              <AnimatePresence mode="wait">
                {tabData.map((tab) => (
                  <TabsContent 
                    key={tab.value} 
                    value={tab.value} 
                    className="space-y-6 focus:outline-none"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -30, scale: 0.95 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <Card3D 
                        className="w-full"
                        maxRotation={5}
                        scale={1.02}
                        withLiquid={true}
                      >
                        <GlassPanel 
                          className="p-6 md:p-8" 
                          blur="2xl" 
                          withNoise={true}
                          withBorder={true}
                        >
                          {tab.component}
                        </GlassPanel>
                      </Card3D>
                    </motion.div>
                  </TabsContent>
                ))}
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
};

export default Touring;