import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Bot } from 'lucide-react';
import { useOnboarding } from '@/context/OnboardingContext';
import { motion, AnimatePresence } from 'framer-motion';

interface PersonalityQuizStepProps {
  onNext: () => void;
  onBack: () => void;
}

const newQuestions = [
  {
    question: "When a new idea strikes, is it a flash of lightning or a slowly growing seed?",
    options: ["Flash of Lightning", "Growing Seed"],
    key: 'ideaPace'
  },
  {
    question: "Do you draw power from the silent whispers of ancient lore or the vibrant pulse of modern culture?",
    options: ["Ancient Lore", "Modern Pulse"],
    key: 'inspirationSource'
  },
  {
    question: "Is your creative sanctuary a solitary tower of focus or a bustling roundtable of collaboration?",
    options: ["Solitary Tower", "Bustling Roundtable"],
    key: 'workStyle'
  },
  {
    question: "When you create, are you channeling raw, chaotic magic or weaving intricate, structured spells?",
    options: ["Chaotic Magic", "Structured Spells"],
    key: 'processStyle'
  },
  {
    question: "Is the final creation a polished gem, perfect in every facet, or a living artifact, beautifully imperfect?",
    options: ["Polished Gem", "Living Artifact"],
    key: 'perfectionism'
  },
];

const determineArchetype = (answers: {[key: string]: string}): string => {
  // Example Archetype Logic (can be made more complex)
  // For simplicity, let's pick two dominant traits.
  // Trait 1: Based on inspirationSource
  const sourceTrait = answers.inspirationSource === "Ancient Lore" ? "Lorekeeper" : "Innovator";
  // Trait 2: Based on processStyle
  const styleTrait = answers.processStyle === "Structured Spells" ? "Architect" : "Alchemist";

  // Combine them, or use more sophisticated mapping
  if (sourceTrait === "Lorekeeper" && styleTrait === "Architect") return "Chronicler Architect";
  if (sourceTrait === "Lorekeeper" && styleTrait === "Alchemist") return "Mystic Alchemist";
  if (sourceTrait === "Innovator" && styleTrait === "Architect") return "Visionary Architect";
  if (sourceTrait === "Innovator" && styleTrait === "Alchemist") return "Future Alchemist";

  // Fallback / simpler version if needed
  return `${sourceTrait} ${styleTrait}`;
};


const PersonalityQuizStep: React.FC<PersonalityQuizStepProps> = ({ onNext, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const { setPersonalityType } = useOnboarding();

  const handleAnswer = (option: string) => {
    const newAnswers = {...answers, [newQuestions[currentQuestion].key]: option};
    setAnswers(newAnswers);

    if (currentQuestion < newQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const archetype = determineArchetype(newAnswers);
      setPersonalityType(archetype);
      onNext();
    }
  };

  return (
    <div className="bg-background/20 backdrop-blur-sm border border-border rounded-lg max-w-3xl mx-auto p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-primary/20 p-3 rounded-full">
          <Bot className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Essence Alignment</h2>
          <p className="text-muted-foreground">The Oracle will ask a few questions to understand your creative spirit.</p>
        </div>
      </div>

      <div className="min-h-[150px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-lg mb-6 text-center">{newQuestions[currentQuestion].question}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {newQuestions[currentQuestion].options.map(option => (
                <Button key={option} variant="outline" size="lg" className="min-w-[200px]" onClick={() => handleAnswer(option)}>
                  {option}
                </Button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between mt-8 pt-4 border-t border-border">
        <Button variant="ghost" onClick={onBack} disabled={currentQuestion === 0}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
    </div>
  );
};

export default PersonalityQuizStep;