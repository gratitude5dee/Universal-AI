import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, DollarSign, Bot, Music, Sparkles, Zap } from "lucide-react";
import { 
  GlassPanel, 
  Card3D, 
  LiquidBackground, 
  FloatingOrb, 
  GradientBorder,
  HolographicText,
  ParticleField,
  MagneticButton,
  ShimmerEffect,
  NoiseTexture 
} from "@/components/ui/glass-components";
import { Content } from "@/components/ui/content";
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
    <Content className="relative overflow-hidden">
      {/* Ambient liquid background effects positioned behind content */}
      <div className="absolute inset-0 pointer-events-none">
        <LiquidBackground colors={["purple", "cyan", "pink"]} count={3} baseSize={80} />
        <ParticleField count={25} className="opacity-30" />
        
        {/* Strategic floating orbs */}
        <FloatingOrb 
          color="purple" 
          size="64" 
          position={{ top: "15%", right: "10%" }} 
          delay={0} 
          duration={12} 
        />
        <FloatingOrb 
          color="cyan" 
          size="48" 
          position={{ bottom: "20%", left: "8%" }} 
          delay={3} 
          duration={15} 
        />
        <FloatingOrb 
          color="pink" 
          size="56" 
          position={{ top: "70%", right: "15%" }} 
          delay={6} 
          duration={10} 
        />
      </div>

      {/* World-class header design */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.8, ease: "easeOutCubic" }}
        className="relative z-10 mb-12"
      >
        <div className="text-center space-y-6">
          <GradientBorder 
            className="inline-block"
            borderWidth={2}
            animationDuration={12}
            colors={["from-purple-400", "via-cyan-400", "via-pink-400", "to-purple-400"]}
          >
            <GlassPanel className="px-10 py-6" blur="3xl" withBorder={false}>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6, ease: "easeOutBack" }}
              >
                <HolographicText 
                  as="h1" 
                  className="text-4xl md:text-6xl font-extrabold tracking-tight"
                >
                  <motion.div 
                    className="flex items-center justify-center gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Music className="h-10 w-10 md:h-12 md:w-12 text-purple-400" />
                    Touring Central
                    <Zap className="h-8 w-8 md:h-10 md:w-10 text-cyan-400" />
                  </motion.div>
                </HolographicText>
              </motion.div>
            </GlassPanel>
          </GradientBorder>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="relative"
          >
            <p className="text-white/90 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
              Next-generation tour management with AI-powered booking intelligence
            </p>
            <ShimmerEffect className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-0.5" />
          </motion.div>
        </div>
      </motion.div>

      {/* Premium tabs with world-class liquid glass design */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative z-10"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Ultra-premium tab navigation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-10"
          >
            <GlassPanel 
              className="p-3 max-w-4xl mx-auto" 
              blur="3xl" 
              withNoise={true}
              withBorder={true}
            >
              <NoiseTexture opacity={0.02} />
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-3 bg-transparent">
                {tabData.map((tab, index) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.value;
                  
                  return (
                    <motion.div
                      key={tab.value}
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        delay: 0.5 + index * 0.1, 
                        duration: 0.5,
                        ease: "easeOutBack"
                      }}
                    >
                      <MagneticButton className="w-full">
                        <TabsTrigger
                          value={tab.value}
                          className={`
                            group flex items-center gap-3 relative overflow-hidden w-full
                            bg-white/5 hover:bg-white/15 border border-white/20 
                            backdrop-blur-xl transition-all duration-500 ease-out
                            rounded-xl px-4 py-3 shadow-lg hover:shadow-2xl
                            hover:scale-105 active:scale-95
                            ${isActive 
                              ? 'bg-gradient-to-r from-purple-500/30 to-cyan-500/20 border-purple-400/60 text-white shadow-purple-500/25' 
                              : 'text-white/80 hover:text-white'}
                          `}
                        >
                          <Icon className="h-5 w-5 z-10 relative transition-transform group-hover:scale-110" />
                          <span className="hidden sm:inline z-10 relative font-medium">{tab.label}</span>
                          
                          {isActive && (
                            <>
                              <motion.div
                                layoutId="activeTabBg"
                                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-pink-500/20 rounded-xl"
                                initial={false}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                              />
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-cyan-400/10 rounded-xl"
                                animate={{ 
                                  opacity: [0.5, 1, 0.5],
                                  scale: [1, 1.02, 1]
                                }}
                                transition={{ 
                                  duration: 3, 
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                            </>
                          )}
                          
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </TabsTrigger>
                      </MagneticButton>
                    </motion.div>
                  );
                })}
              </TabsList>
            </GlassPanel>
          </motion.div>

          {/* Premium content cards with advanced 3D effects */}
          <AnimatePresence mode="wait">
            {tabData.map((tab) => (
              <TabsContent 
                key={tab.value} 
                value={tab.value} 
                className="focus:outline-none"
              >
                <motion.div
                  initial={{ opacity: 0, y: 60, scale: 0.9, rotateX: 10 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                  exit={{ opacity: 0, y: -60, scale: 0.9, rotateX: -10 }}
                  transition={{ 
                    duration: 0.7, 
                    ease: "easeOutCubic",
                    opacity: { duration: 0.4 }
                  }}
                  style={{ transformPerspective: 1000 }}
                >
                  <Card3D 
                    className="w-full"
                    maxRotation={3}
                    scale={1.01}
                    withLiquid={true}
                  >
                    <GlassPanel 
                      className="p-8 md:p-12 min-h-[600px]" 
                      blur="2xl" 
                      withNoise={true}
                      withBorder={true}
                    >
                      <div className="relative">
                        <NoiseTexture opacity={0.015} />
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.6 }}
                        >
                          {tab.component}
                        </motion.div>
                      </div>
                    </GlassPanel>
                  </Card3D>
                </motion.div>
              </TabsContent>
            ))}
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </Content>
  );
};

export default Touring;