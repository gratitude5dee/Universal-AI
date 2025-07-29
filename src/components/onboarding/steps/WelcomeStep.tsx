import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card3D } from '@/components/ui/glass-components';
import { useOnboarding } from '@/context/OnboardingContext';
import { useOnboardingNavigation } from '@/hooks/useOnboardingNavigation';

// Floating particles component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 blur-sm"
          initial={{
            x: Math.random() * 100 + '%',
            y: 100 + Math.random() * 20 + '%',
            scale: 0
          }}
          animate={{
            y: -20 + '%',
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.7,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

// Holographic text component
const HolographicText = ({ children, ...props }) => (
  <span
    className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent animate-shimmer"
    style={{ backgroundSize: '200% 100%' }}
    {...props}
  >
    {children}
  </span>
);

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const { setCreatorName } = useOnboarding();
  const { handleAreaClick } = useOnboardingNavigation({ onNext });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <FloatingParticles />
      
      {/* Dynamic gradient background that follows mouse */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(139, 92, 246, 0.3), transparent 50%)`,
        }}
        transition={{ type: "tween", ease: "linear", duration: 0 }}
        onMouseMove={handleMouseMove}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        className="relative z-10 w-full max-w-4xl mx-auto px-4"
      >
        <Card3D className="p-12 lg:p-16">
          {/* Floating icons */}
          <motion.div
            className="absolute top-8 right-8"
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Star className="w-8 h-8 text-yellow-400/50" />
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-8"
            animate={{
              rotate: -360,
              y: [0, -10, 0],
            }}
            transition={{
              rotate: { duration: 15, repeat: Infinity, ease: "linear" },
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Zap className="w-6 h-6 text-cyan-400/50" />
          </motion.div>

          {/* Main content */}
          <div 
            className="text-center space-y-8 cursor-pointer" 
            onClick={handleAreaClick}
            role="button"
            tabIndex={0}
            aria-label="Click anywhere or press Enter/Space to continue to next step"
          >
            <motion.div variants={itemVariants}>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                className="inline-block mb-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-2xl opacity-50 animate-pulse" />
                  <Sparkles className="w-16 h-16 text-white relative z-10" />
                </div>
              </motion.div>

              <h1 className="text-5xl lg:text-7xl font-bold mb-4">
                <HolographicText>Welcome to</HolographicText>
                <br />
                <motion.span
                  className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  UniversalAI
                </motion.span>
              </h1>
            </motion.div>

            <motion.div variants={itemVariants}>
              <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                You are about to embark on the <span className="text-cyan-400 font-semibold">Genesis Ritual</span>.
                This process will align the Creator OS with your unique essence, skills, and creative spirit.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-8 relative z-50">
              {/* Enhanced clickable area with proper pointer events */}
              <div className="relative inline-block group cursor-pointer">
                {/* Animated glow background - positioned behind button */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-300 pointer-events-none" />
                
                {/* Expanded clickable zone for better UX */}
                <div className="relative p-2 -m-2">
                  <Button
                    onClick={onNext}
                    size="lg"
                    className="
                      relative px-8 py-4 text-lg font-semibold
                      bg-gradient-to-r from-purple-600/20 to-pink-600/20
                      text-white rounded-2xl border border-white/20
                      hover:from-purple-600/40 hover:to-pink-600/40
                      hover:border-white/40 hover:scale-105
                      active:scale-95
                      transition-all duration-300 ease-out
                      flex items-center gap-3
                      backdrop-blur-xl
                      shadow-lg hover:shadow-xl
                      focus:outline-none focus:ring-4 focus:ring-purple-500/50
                      min-h-[56px] min-w-[200px]
                      pointer-events-auto
                      z-10
                    "
                    aria-label="Begin the Genesis Ritual onboarding process"
                    role="button"
                    tabIndex={0}
                  >
                    <span className="relative z-10">Begin the Ritual</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="relative z-10"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Progress indicator */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-2 pt-8"
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`h-1 w-8 rounded-full ${i === 0 ? 'bg-cyan-400' : 'bg-white/20'}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + i * 0.1 }}
                />
              ))}
            </motion.div>
          </div>

          {/* Animated corner accents */}
          <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-white/20 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-white/20 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-white/20 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-white/20 rounded-br-2xl" />
        </Card3D>
      </motion.div>
    </div>
  );
};

export default WelcomeStep;