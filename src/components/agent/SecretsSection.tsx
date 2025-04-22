
import React, { useState } from "react";
import { Plus } from "lucide-react";

interface Secret {
  key: string;
  value: string;
}

const SecretsSection: React.FC = () => {
  const [secrets, setSecrets] = useState<Secret[]>([
    { key: "TWITTER_PASSWORD", value: "" },
    { key: "TWITTER_EMAIL", value: "" },
    { key: "TWITTER_2FA_SECRET", value: "" },
    { key: "POST_IMMEDIATELY", value: "true" },
    { key: "ENABLE_ACTION_PROCESSING", value: "true" },
    { key: "MAX_ACTIONS_PROCESSING", value: "10" },
    { key: "POST_INTERVAL_MAX", value: "180" },
    { key: "POST_INTERVAL_MIN", value: "90" },
    { key: "TWITTER_SPACES_ENABLE", value: "false" },
    { key: "ACTION_TIMELINE_TYPE", value: "foryou" },
    { key: "TWITTER_POLL_INTERVAL", value: "120" },
  ]);

  const [newSecretKey, setNewSecretKey] = useState("");
  const [newSecretValue, setNewSecretValue] = useState("");

  const handleAddSecret = () => {
    if (newSecretKey.trim()) {
      setSecrets([...secrets, { key: newSecretKey, value: newSecretValue }]);
      setNewSecretKey("");
      setNewSecretValue("");
    }
  };

  const updateSecret = (index: number, field: keyof Secret, value: string) => {
    const updatedSecrets = [...secrets];
    updatedSecrets[index][field] = value;
    setSecrets(updatedSecrets);
  };

  return (
    <div className="py-6" id="secrets">
      <h2 className="text-2xl font-bold mb-4">Add secrets</h2>
      <p className="text-muted-foreground mb-6">
        These are required to connect with your model, clients and plugins.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {secrets.map((secret, index) => (
          <React.Fragment key={index}>
            <div className="bg-black/20 p-3 rounded-md text-white">
              {secret.key}
            </div>
            <input
              type="text"
              placeholder="Enter value..."
              value={secret.value}
              onChange={(e) => updateSecret(index, "value", e.target.value)}
              className="bg-black/20 p-3 rounded-md text-white border-0 focus:ring-1 focus:ring-studio-accent"
            />
          </React.Fragment>
        ))}
      </div>

      <div className="bg-black/10 p-4 rounded-lg mb-6">
        <h3 className="text-xl font-medium mb-2">Additional secrets</h3>
        <p className="text-sm text-muted-foreground mb-4">
          In case you need to add secrets that are not listed above.
        </p>

        <button
          onClick={handleAddSecret}
          className="flex items-center gap-2 text-studio-accent hover:text-studio-accent/80"
        >
          <Plus className="h-4 w-4" /> Add secret
        </button>
      </div>

      <div className="py-4">
        <h3 className="text-xl font-medium mb-2">Voice model <span className="text-xs text-gray-400 font-normal">Optional</span></h3>
        <input
          type="text"
          value="en_US-male-medium"
          className="w-full bg-black/20 p-3 rounded-md text-white border-0 focus:ring-1 focus:ring-studio-accent"
        />
      </div>
    </div>
  );
};

export default SecretsSection;
