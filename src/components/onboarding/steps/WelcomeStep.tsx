import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Star, Zap } from 'lucide-react';
import {
  Card3D,
  LiquidBackground,
  GradientBorder,
  MagneticButton,
  HolographicText,
  ParticleField,
  GlassPanel
} from '@/components/ui/glass-components'; // Adjusted import path

const WelcomeStep = ({ onNext }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleMouseMove = (e) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.8, filter: "blur(10px)" },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      }
    }
  };

  return (
    <motion.div
      className="relative min-h-screen flex items-center justify-center"
      onMouseMove={handleMouseMove}
    >
      {/* Animated background elements */}
      <LiquidBackground colors={["purple", "cyan", "pink", "yellow"]} count={4} />
      <ParticleField count={30} className="opacity-30" />

      {/* Dynamic gradient background that follows mouse */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(139, 92, 246, 0.3), transparent 50%)`,
        }}
        transition={{ type: "tween", ease: "linear", duration: 0 }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        className="relative z-10 w-full max-w-4xl mx-auto px-4"
      >
        <Card3D maxRotation={10} scale={1.02}>
          <GlassPanel blur="4xl" className="p-12 lg:p-16">
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
            <div className="text-center space-y-8">
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
                  <HolographicText as="span">Welcome to</HolographicText>
                  <br />
                  <motion.span
                    className="text-gradient bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
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

              <motion.div variants={itemVariants} className="pt-8">
                <GradientBorder borderWidth={2} className="inline-block">
                  <MagneticButton
                    onClick={onNext}
                    className="
                      px-8 py-4 text-lg font-semibold
                      bg-gradient-to-r from-purple-600/20 to-pink-600/20
                      text-white rounded-2xl
                      hover:from-purple-600/30 hover:to-pink-600/30
                      transition-all duration-300
                      flex items-center gap-3
                      backdrop-blur-xl
                    "
                  >
                    <span>Begin the Ritual</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </MagneticButton>
                </GradientBorder>
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
          </GlassPanel>
        </Card3D>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeStep;