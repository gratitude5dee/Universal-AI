
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
      <h2 className="text-2xl font-bold mb-2">Bio</h2>
      <p className="text-muted-foreground mb-4">
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
              className="flex-1 bg-black/5 text-studio-charcoal p-3 rounded-md border border-gray-700/20"
            />
            <button
              onClick={() => handleRemoveBio(index)}
              className="p-2 text-gray-500 hover:text-gray-700"
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
            className="w-full bg-black/5 text-studio-charcoal p-3 rounded-md border border-gray-700/20"
          />
        </div>
      </div>
    </div>
  );
};

export default BioSection;
