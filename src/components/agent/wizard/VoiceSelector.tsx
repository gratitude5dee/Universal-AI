import React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface VoiceSelectorProps {
  voiceProvider: string;
  setVoiceProvider: (provider: string) => void;
  voiceId: string;
  setVoiceId: (id: string) => void;
}

const voices = {
  elevenlabs: [
    { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel - Natural & Warm" },
    { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi - Strong & Confident" },
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella - Soft & Pleasant" },
  ],
  openai: [
    { id: "alloy", name: "Alloy - Neutral" },
    { id: "echo", name: "Echo - Warm" },
    { id: "fable", name: "Fable - Expressive" },
    { id: "onyx", name: "Onyx - Deep" },
    { id: "nova", name: "Nova - Energetic" },
    { id: "shimmer", name: "Shimmer - Soft" },
  ]
};

const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  voiceProvider,
  setVoiceProvider,
  voiceId,
  setVoiceId
}) => {
  const availableVoices = voiceProvider === "none" ? [] : voices[voiceProvider as keyof typeof voices] || [];

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-[hsl(var(--text-primary))]">
        Voice Configuration
      </label>

      {/* Provider Selection */}
      <div className="space-y-2">
        <span className="text-xs text-[hsl(var(--text-tertiary))]">Voice Provider</span>
        <Select value={voiceProvider} onValueChange={setVoiceProvider}>
          <SelectTrigger className="bg-white/5 border-white/10 text-[hsl(var(--text-primary))]">
            <SelectValue placeholder="Select provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">
              <div className="flex items-center gap-2">
                <VolumeX className="w-4 h-4" />
                No Voice (Text Only)
              </div>
            </SelectItem>
            <SelectItem value="elevenlabs">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                ElevenLabs (High Quality)
              </div>
            </SelectItem>
            <SelectItem value="openai">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                OpenAI Voices
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Voice Selection */}
      {voiceProvider !== "none" && (
        <div className="space-y-2">
          <span className="text-xs text-[hsl(var(--text-tertiary))]">Select Voice</span>
          <Select value={voiceId} onValueChange={setVoiceId}>
            <SelectTrigger className="bg-white/5 border-white/10 text-[hsl(var(--text-primary))]">
              <SelectValue placeholder="Choose a voice" />
            </SelectTrigger>
            <SelectContent>
              {availableVoices.map((voice) => (
                <SelectItem key={voice.id} value={voice.id}>
                  {voice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {voiceId && (
            <Button
              variant="outline"
              size="sm"
              className="w-full border-white/20 text-[hsl(var(--text-primary))] hover:bg-white/5"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Preview Voice Sample
            </Button>
          )}
        </div>
      )}

      {voiceProvider === "elevenlabs" && (
        <div className="glass-card p-3 rounded-lg border border-[hsl(var(--accent-purple))]/30 bg-[hsl(var(--accent-purple))]/5">
          <p className="text-xs text-[hsl(var(--text-secondary))]">
            💡 <strong>Voice Cloning:</strong> You can clone your own voice in the advanced settings after creation
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceSelector;
