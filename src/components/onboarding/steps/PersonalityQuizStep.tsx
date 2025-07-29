import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bot, Sparkles } from 'lucide-react'; // ArrowRight removed as it's not used in merged version
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Card3D } from '@/components/ui/glass-components';
import { useOnboarding } from '@/context/OnboardingContext'; // Added from main
import { useOnboardingNavigation } from '@/hooks/useOnboardingNavigation';

// Floating particles component (from glassmorphism version)
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 blur-sm"
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
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};
const newQuestions = [
  {
    question: "When a new idea strikes, is it a flash of lightning or a slowly growing seed?",
    options: ["Flash of Lightning", "Growing Seed"],
    icon: "⚡",
    gradient: "from-yellow-400 to-orange-500"
  },
  {
    question: "Do you draw power from the silent whispers of ancient lore or the vibrant pulse of modern culture?",
    options: ["Ancient Lore", "Modern Pulse"],
    icon: "📚",
    gradient: "from-purple-400 to-pink-500"
  },
  {
    question: "Is your creative sanctuary a solitary tower of focus or a bustling roundtable of collaboration?",
    options: ["Solitary Tower", "Bustling Roundtable"],
    icon: "🏰",
    gradient: "from-blue-400 to-cyan-500"
  },
  {
    question: "When you create, are you channeling raw, chaotic magic or weaving intricate, structured spells?",
    options: ["Chaotic Magic", "Structured Spells"],
    icon: "🔮",
    gradient: "from-green-400 to-teal-500"
  },
  {
    question: "Is the final creation a polished gem, perfect in every facet, or a living artifact, beautifully imperfect?",
    options: ["Polished Gem", "Living Artifact"],
    icon: "💎",
    gradient: "from-indigo-400 to-purple-500"
  },
];

interface PersonalityQuizStepProps {
  onNext: () => void;
  onBack: () => void;
}

const determinePersonalityType = (answers: {[key: string]: string}): string => {
  // Simple logic for determining personality type based on answers
  const traits = Object.values(answers);
  if (traits.includes("Ancient Lore") && traits.includes("Structured Spells")) return "Chronicler Architect";
  if (traits.includes("Ancient Lore") && traits.includes("Chaotic Magic")) return "Mystic Alchemist";
  if (traits.includes("Modern Pulse") && traits.includes("Structured Spells")) return "Visionary Architect";
  if (traits.includes("Modern Pulse") && traits.includes("Chaotic Magic")) return "Future Alchemist";
  return "Creative Visionary";
};

const PersonalityQuizStep: React.FC<PersonalityQuizStepProps> = ({ onNext, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: string}>({}); // Typed from main
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // Typed and from glass
  const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(0); // For keyboard navigation
  const { setPersonalityType } = useOnboarding(); // From main

  // Initialize with first option preselected
  React.useEffect(() => {
    if (newQuestions[currentQuestion]) {
      setSelectedOption(newQuestions[currentQuestion].options[0]);
      setKeyboardFocusIndex(0);
    }
  }, [currentQuestion]);

  // Enhanced keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const currentQ = newQuestions[currentQuestion];
      if (!currentQ) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          const leftIndex = Math.max(0, keyboardFocusIndex - 1);
          setKeyboardFocusIndex(leftIndex);
          setSelectedOption(currentQ.options[leftIndex]);
          break;
        case 'ArrowRight':
          event.preventDefault();
          const rightIndex = Math.min(currentQ.options.length - 1, keyboardFocusIndex + 1);
          setKeyboardFocusIndex(rightIndex);
          setSelectedOption(currentQ.options[rightIndex]);
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (selectedOption) {
            handleAnswer(selectedOption);
          }
          break;
        case 'Escape':
          event.preventDefault();
          onBack();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, keyboardFocusIndex, selectedOption]);

  // Merged handleAnswer function
  const handleAnswer = (option: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: option }));
    
    setTimeout(() => {
      if (currentQuestion < newQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
      } else {
        const personalityType = determinePersonalityType({ ...answers, [currentQuestion]: option });
        setPersonalityType(personalityType);
        onNext();
      }
    }, 300);
  };

  const currentQ = newQuestions[currentQuestion]; // From glass

  // JSX from glassmorphism version
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingParticles />
      
      <Card3D className="w-full max-w-2xl">
        <div className="p-8">
          {/* Progress */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex space-x-2">
              {newQuestions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index <= currentQuestion ? 'bg-cyan-400' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
            <p className="text-white/50 text-sm">Question {currentQuestion + 1} of {newQuestions.length}</p>
          </div>

          {/* Question */}
          <div className="min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-center"
              >
                <motion.div
                  className="text-6xl mb-4"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {currentQ.icon}
                </motion.div>
                <p className={`text-xl mb-8 text-gradient bg-gradient-to-r ${currentQ.gradient} font-medium`}>
                  {currentQ.question}
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  {currentQ.options.map((option, index) => {
                    const isSelected = selectedOption === option;
                    const isFocused = keyboardFocusIndex === index;
                    
                    return (
                      <motion.button
                        key={option}
                        className={`
                          relative px-8 py-4 rounded-xl font-medium text-white
                          backdrop-blur-xl border transition-all duration-300
                          min-h-[60px] min-w-[180px]
                          ${isSelected
                            ? 'bg-gradient-to-r from-cyan-500/40 to-purple-500/40 border-cyan-400/60 shadow-lg shadow-cyan-400/20 scale-105'
                            : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30 hover:scale-105'
                          }
                          ${isFocused && !isSelected 
                            ? 'ring-2 ring-cyan-400/50 ring-offset-2 ring-offset-transparent' 
                            : ''
                          }
                          focus:outline-none focus:ring-2 focus:ring-cyan-400/50
                          active:scale-95
                        `}
                        onClick={() => {
                          setSelectedOption(option);
                          setKeyboardFocusIndex(index);
                          handleAnswer(option);
                        }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        aria-label={`Select ${option} - ${isSelected ? 'currently selected' : ''}`}
                      >
                        {/* Enhanced shimmer effect for selected state */}
                        <div className="absolute inset-0 rounded-xl overflow-hidden">
                          <div className={`
                            absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                            -translate-x-full transition-transform duration-1000
                            ${isSelected ? 'animate-shimmer' : ''}
                          `} />
                        </div>
                        
                        {/* Selection indicator */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute top-2 right-2 w-3 h-3 bg-cyan-400 rounded-full"
                          />
                        )}
                        
                        <span className="relative z-10">{option}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation and Instructions */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
            <Button
              variant="ghost"
              onClick={onBack}
              disabled={currentQuestion === 0}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            
            <div className="text-center">
              <p className="text-white/50 text-sm">
                Use ← → arrow keys to navigate • Enter to select
              </p>
            </div>
            
            <div className="w-[100px]" /> {/* Spacer for centering */}
          </div>
        </div>
      </Card3D>
    </div>
  );
};

export default PersonalityQuizStep;