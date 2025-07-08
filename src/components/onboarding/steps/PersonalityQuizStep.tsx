import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Bot } from 'lucide-react';
import { useOnboarding } from '@/context/OnboardingContext';
import { motion, AnimatePresence } from 'framer-motion';

interface PersonalityQuizStepProps {
  onNext: () => void;
  onBack: () => void;
}

const questions = [
  {
    question: "When approaching a new creation, do you prefer a meticulous plan or spontaneous discovery?",
    options: ["Meticulous Plan", "Spontaneous Discovery"],
    key: 'planning'
  },
  {
    question: "Does your inspiration come more from the tangible world or abstract concepts?",
    options: ["Tangible World", "Abstract Concepts"],
    key: 'inspiration'
  },
  {
    question: "Do you find energy in solitary creation or collaborative brainstorming?",
    options: ["Solitary Creation", "Collaboration"],
    key: 'energy'
  },
  {
    question: "Is your creative process driven by logic and structure, or emotion and feeling?",
    options: ["Logic & Structure", "Emotion & Feeling"],
    key: 'process'
  },
  {
    question: "Do you aim for perfection down to the last detail, or embrace the beauty of imperfection?",
    options: ["Perfection", "Imperfection"],
    key: 'detail'
  },
];

const PersonalityQuizStep: React.FC<PersonalityQuizStepProps> = ({ onNext, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const { setPersonalityType } = useOnboarding();

  const handleAnswer = (option: string) => {
    const newAnswers = {...answers, [questions[currentQuestion].key]: option};
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Simple logic to determine personality type from answers
      const planning = newAnswers.planning === 'Meticulous Plan' ? 'Architect' : 'Bard';
      const inspiration = newAnswers.inspiration === 'Tangible World' ? 'Realist' : 'Visionary';
      setPersonalityType(`${inspiration} ${planning}`);
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
            <p className="text-lg mb-6 text-center">{questions[currentQuestion].question}</p>
            <div className="flex justify-center gap-4">
              {questions[currentQuestion].options.map(option => (
                <Button key={option} variant="outline" onClick={() => handleAnswer(option)}>
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