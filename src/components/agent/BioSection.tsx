import React, { useState } from "react";
import { Trash } from "lucide-react";

const BioSection: React.FC = () => {
  const [bioItems, setBioItems] = useState<string[]>([
    "secured the Southern Border COMPLETELY (until they DESTROYED it)",
    "protected WOMEN'S SPORTS (while Democrats let MEN compete)",
    "ended INFLATION and made America AFFORDABLE (until Kamala ruined it)"
  ]);

  const [newBio, setNewBio] = useState("");

  const handleAddBio = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newBio.trim()) {
      setBioItems([...bioItems, newBio]);
      setNewBio("");
    }
  };

  const handleRemoveBio = (index: number) => {
    setBioItems(bioItems.filter((_, i) => i !== index));
  };

  return (
    <div className="py-6" id="bio">
      <h2 className="text-2xl font-bold mb-2 text-white animate-text-glow">Bio</h2>
      <p className="text-white/80 text-shadow-sm mb-4">
        Background information for your character. Includes biographical details about the character, either as one complete biography or several statements that vary.
      </p>

      <div className="space-y-2">
        {bioItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const newItems = [...bioItems];
                newItems[index] = e.target.value;
                setBioItems(newItems);
              }}
              className="flex-1 backdrop-blur-sm bg-white/10 border border-white/20 text-white p-3 rounded-md placeholder:text-white/50"
            />
            <button
              onClick={() => handleRemoveBio(index)}
              className="p-2 text-white/70 hover:text-white"
            >
              <Trash className="h-5 w-5" />
            </button>
          </div>
        ))}

        <div className="mt-4">
          <input
            type="text"
            placeholder="Add new bio statement..."
            value={newBio}
            onChange={(e) => setNewBio(e.target.value)}
            onKeyDown={handleAddBio}
            className="w-full backdrop-blur-sm bg-white/10 border border-white/20 text-white p-3 rounded-md placeholder:text-white/50"
          />
        </div>
      </div>
    </div>
  );
};

export default BioSection;