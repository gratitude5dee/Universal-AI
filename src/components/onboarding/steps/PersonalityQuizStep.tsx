import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bot, Sparkles } from 'lucide-react'; // ArrowRight removed as it's not used in merged version
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Card3D } from '@/components/ui/glass-components';
import { useOnboarding } from '@/context/OnboardingContext'; // Added from main

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
  },
  {
    question: "Do you draw power from the silent whispers of ancient lore or the vibrant pulse of modern culture?",
    options: ["Ancient Lore", "Modern Pulse"],
  },
  {
    question: "Is your creative sanctuary a solitary tower of focus or a bustling roundtable of collaboration?",
    options: ["Solitary Tower", "Bustling Roundtable"],
  },
  {
    question: "When you create, are you channeling raw, chaotic magic or weaving intricate, structured spells?",
    options: ["Chaotic Magic", "Structured Spells"],
  },
  {
    question: "Is the final creation a polished gem, perfect in every facet, or a living artifact, beautifully imperfect?",
    options: ["Polished Gem", "Living Artifact"],
  if (sourceTrait === "Lorekeeper" && styleTrait === "Architect") return "Chronicler Architect";
  if (sourceTrait === "Lorekeeper" && styleTrait === "Alchemist") return "Mystic Alchemist";
  if (sourceTrait === "Innovator" && styleTrait === "Architect") return "Visionary Architect";
  if (sourceTrait === "Innovator" && styleTrait === "Alchemist") return "Future Alchemist";

const PersonalityQuizStep: React.FC<PersonalityQuizStepProps> = ({ onNext, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: string}>({}); // Typed from main
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // Typed and from glass
  const { setPersonalityType } = useOnboarding(); // From main

  // Merged handleAnswer function
  const handleAnswer = (option: string) => {
    
  };

  const currentQ = newQuestions[currentQuestion]; // From glass

  // JSX from glassmorphism version
  return (
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
                  {currentQ.options.map((option, index) => (
                    <motion.button
                      key={option}
                      className={`
                        relative px-8 py-4 rounded-xl font-medium text-white
                        backdrop-blur-xl border transition-all duration-300
                        ${selectedOption === option
                          ? 'bg-white/30 border-white/50 scale-105'
                          : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30 hover:scale-105'
                        }
                      `}
                      onClick={() => handleAnswer(option)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 rounded-xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
                      </div>
                      <span className="relative z-10">{option}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
            <Button
              variant="ghost"
              onClick={onBack}
              disabled={currentQuestion === 0}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>
        </div>
      </Card3D>
    </div>
  );
};

export default PersonalityQuizStep;