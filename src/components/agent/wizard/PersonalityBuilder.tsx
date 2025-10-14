import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, X, Upload, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PersonalityBuilderProps {
  bio: string[];
  setBio: (bio: string[]) => void;
  lore: string[];
  setLore: (lore: string[]) => void;
  topics: string[];
  setTopics: (topics: string[]) => void;
  adjectives: string[];
  setAdjectives: (adjectives: string[]) => void;
}

const PersonalityBuilder: React.FC<PersonalityBuilderProps> = ({
  bio,
  setBio,
  lore,
  setLore,
  topics,
  setTopics,
  adjectives,
  setAdjectives
}) => {
  const [newTopic, setNewTopic] = useState("");
  const [newAdjective, setNewAdjective] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const addBioLine = () => setBio([...bio, ""]);
  const updateBioLine = (index: number, value: string) => {
    const newBio = [...bio];
    newBio[index] = value;
    setBio(newBio);
  };
  const removeBioLine = (index: number) => setBio(bio.filter((_, i) => i !== index));

  const addLoreLine = () => setLore([...lore, ""]);
  const updateLoreLine = (index: number, value: string) => {
    const newLore = [...lore];
    newLore[index] = value;
    setLore(newLore);
  };
  const removeLoreLine = (index: number) => setLore(lore.filter((_, i) => i !== index));

  const addTopic = () => {
    if (newTopic.trim() && topics.length < 20) {
      setTopics([...topics, newTopic.trim()]);
      setNewTopic("");
    }
  };

  const addAdjective = () => {
    if (newAdjective.trim()) {
      setAdjectives([...adjectives, newAdjective.trim()]);
      setNewAdjective("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-[hsl(var(--text-primary))] mb-2">
          Personality & Knowledge
        </h3>
        <p className="text-sm text-[hsl(var(--text-secondary))]">
          Define your agent's character, expertise, and knowledge base
        </p>
      </div>

      {/* Bio Builder */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-[hsl(var(--text-primary))]">
            Agent Bio
          </Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addBioLine}
            className="text-[hsl(var(--accent-purple))] hover:bg-[hsl(var(--accent-purple))]/10"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Line
          </Button>
        </div>
        
        <div className="space-y-2">
          {bio.map((line, index) => (
            <div key={index} className="flex gap-2">
              <Textarea
                value={line}
                onChange={(e) => updateBioLine(index, e.target.value)}
                placeholder="Describe this aspect of your agent..."
                className="bg-white/5 border-white/10 text-[hsl(var(--text-primary))] min-h-[60px]"
                maxLength={200}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeBioLine(index)}
                className="text-red-400 hover:bg-red-500/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Topics & Expertise */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-[hsl(var(--text-primary))]">
          Topics & Expertise {topics.length > 0 && <span className="text-[hsl(var(--text-tertiary))]">({topics.length}/20)</span>}
        </Label>
        
        <div className="flex gap-2">
          <Input
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTopic()}
            placeholder="Add a topic or area of expertise..."
            className="bg-white/5 border-white/10 text-[hsl(var(--text-primary))]"
            disabled={topics.length >= 20}
          />
          <Button
            type="button"
            onClick={addTopic}
            disabled={!newTopic.trim() || topics.length >= 20}
            className="bg-[hsl(var(--accent-purple))] hover:bg-[hsl(var(--accent-purple))]/90"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {topics.map((topic, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[hsl(var(--accent-purple))]/20 border border-[hsl(var(--accent-purple))]/30"
            >
              <span className="text-sm text-[hsl(var(--text-primary))]">{topic}</span>
              <button
                type="button"
                onClick={() => setTopics(topics.filter((_, i) => i !== index))}
                className="text-[hsl(var(--text-tertiary))] hover:text-red-400 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Personality Adjectives */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-[hsl(var(--text-primary))]">
          Personality Traits
        </Label>
        
        <div className="flex gap-2">
          <Input
            value={newAdjective}
            onChange={(e) => setNewAdjective(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addAdjective()}
            placeholder="e.g., creative, analytical, friendly..."
            className="bg-white/5 border-white/10 text-[hsl(var(--text-primary))]"
          />
          <Button
            type="button"
            onClick={addAdjective}
            disabled={!newAdjective.trim()}
            className="bg-[hsl(var(--accent-purple))] hover:bg-[hsl(var(--accent-purple))]/90"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {adjectives.map((adj, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
            >
              <span className="text-sm text-[hsl(var(--text-primary))]">{adj}</span>
              <button
                type="button"
                onClick={() => setAdjectives(adjectives.filter((_, i) => i !== index))}
                className="text-[hsl(var(--text-tertiary))] hover:text-red-400 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Advanced: Lore & Knowledge */}
      <div className="border-t border-white/10 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full justify-between text-[hsl(var(--text-primary))] hover:bg-white/5"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Advanced Options (Lore & Knowledge Base)
          </span>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4 mt-4"
            >
              {/* Lore */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-[hsl(var(--text-primary))]">
                    Agent Lore (Background Story)
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addLoreLine}
                    className="text-[hsl(var(--accent-purple))] hover:bg-[hsl(var(--accent-purple))]/10"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Line
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {lore.map((line, index) => (
                    <div key={index} className="flex gap-2">
                      <Textarea
                        value={line}
                        onChange={(e) => updateLoreLine(index, e.target.value)}
                        placeholder="Add backstory or context..."
                        className="bg-white/5 border-white/10 text-[hsl(var(--text-primary))] min-h-[60px]"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLoreLine(index)}
                        className="text-red-400 hover:bg-red-500/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Knowledge Base Upload */}
              <div className="glass-card p-4 rounded-lg border border-white/10 bg-white/5">
                <Label className="text-sm font-medium text-[hsl(var(--text-primary))] mb-3 block">
                  Knowledge Base Files
                </Label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-[hsl(var(--text-secondary))] mx-auto mb-2" />
                  <p className="text-sm text-[hsl(var(--text-primary))] mb-1">
                    Upload PDFs, documents, or URLs
                  </p>
                  <p className="text-xs text-[hsl(var(--text-tertiary))]">
                    Max 50MB total • Supports PDF, DOCX, TXT
                  </p>
                  <Button variant="outline" size="sm" className="mt-3 border-white/20 text-[hsl(var(--text-primary))]">
                    Select Files
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PersonalityBuilder;
