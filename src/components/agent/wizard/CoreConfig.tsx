import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AvatarUpload from "./AvatarUpload";
import VoiceSelector from "./VoiceSelector";

interface CoreConfigProps {
  name: string;
  setName: (name: string) => void;
  username: string;
  setUsername: (username: string) => void;
  avatar: string | null;
  setAvatar: (avatar: string | null) => void;
  voiceProvider: string;
  setVoiceProvider: (provider: string) => void;
  voiceId: string;
  setVoiceId: (id: string) => void;
}

const CoreConfig: React.FC<CoreConfigProps> = ({
  name,
  setName,
  username,
  setUsername,
  avatar,
  setAvatar,
  voiceProvider,
  setVoiceProvider,
  voiceId,
  setVoiceId
}) => {
  const handleNameChange = (value: string) => {
    setName(value);
    // Auto-generate username from name
    const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setUsername(slug);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-[hsl(var(--text-primary))] mb-2">
          Core Agent Configuration
        </h3>
        <p className="text-sm text-[hsl(var(--text-secondary))]">
          Set up your agent's identity and communication preferences
        </p>
      </div>

      {/* Name & Username */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="agent-name" className="text-sm font-medium text-[hsl(var(--text-primary))]">
            Display Name *
          </Label>
          <Input
            id="agent-name"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g., Creative Assistant Pro"
            className="bg-white/5 border-white/10 text-[hsl(var(--text-primary))] placeholder:text-[hsl(var(--text-tertiary))]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="agent-username" className="text-sm font-medium text-[hsl(var(--text-primary))]">
            Username (URL Slug) *
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[hsl(var(--text-tertiary))]">@</span>
            <Input
              id="agent-username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="creative-assistant-pro"
              className="bg-white/5 border-white/10 text-[hsl(var(--text-primary))] placeholder:text-[hsl(var(--text-tertiary))]"
            />
          </div>
          <p className="text-xs text-[hsl(var(--text-tertiary))]">
            This will be used in your agent's URL and handle
          </p>
        </div>
      </div>

      {/* Avatar Upload */}
      <AvatarUpload avatar={avatar} setAvatar={setAvatar} />

      {/* Voice Selector */}
      <VoiceSelector
        voiceProvider={voiceProvider}
        setVoiceProvider={setVoiceProvider}
        voiceId={voiceId}
        setVoiceId={setVoiceId}
      />
    </div>
  );
};

export default CoreConfig;
