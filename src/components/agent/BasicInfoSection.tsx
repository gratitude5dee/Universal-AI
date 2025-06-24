import React, { useState } from "react";

const modelProviders = ["OpenAI", "Anthropic", "Claude", "Llama", "Mistral"];
const clientTypes = ["X (Twitter)", "Discord", "Facebook", "Instagram", "Telegram"];

const BasicInfoSection: React.FC = () => {
  const [name, setName] = useState("Trump");
  const [modelProvider, setModelProvider] = useState("OpenAI");
  const [clientType, setClientType] = useState("X (Twitter)");
  
  return (
    <>
      <div className="py-6" id="startTemplate">
        <h2 className="text-2xl font-bold mb-4 text-white animate-text-glow">Start with a template</h2>
        <p className="text-white/80 text-shadow-sm mb-6">
          Using the inputs below, craft a unique and engaging personality for your AI agent. Check our <a href="#" className="text-studio-accent">guide</a> for this step.
        </p>

        <div className="backdrop-blur-md bg-black/20 border border-white/20 rounded-lg p-6">
          <h3 className="text-xl font-medium mb-4 text-white text-shadow-sm">Templates</h3>
          <p className="text-sm text-white/70 mb-6">Use one of the options below to prefill the fields.</p>
          
          <div className="flex flex-wrap gap-2">
            {["Eliza", "Trump", "C-3PO", "BD", "Dobby", "Social", "Support", "Web3"].map((template) => (
              <button
                key={template}
                className={`px-4 py-2.5 rounded-md text-sm font-medium ${
                  template === "Trump" 
                    ? "bg-studio-accent text-white" 
                    : "bg-black/30 text-white hover:bg-black/40"
                }`}
              >
                {template}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="py-6 border-t border-white/10" id="name">
        <h2 className="text-2xl font-bold mb-2 text-white animate-text-glow">Name</h2>
        <p className="text-white/80 text-shadow-sm mb-4">
          The character's display name for identification and in conversations
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full backdrop-blur-sm bg-white/10 border border-white/20 text-white p-3 rounded-md placeholder:text-white/50"
        />
      </div>

      <div className="py-6 border-t border-white/10" id="avatar">
        <h2 className="text-2xl font-bold mb-2 text-white animate-text-glow">Avatar</h2>
        <p className="text-white/80 text-shadow-sm mb-4">
          Update your avatar effortlessly by simply clicking on it.
        </p>
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 bg-green-400/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
            <div className="h-16 w-16 bg-green-300/50 rounded-full flex items-center justify-center">
              <span className="text-3xl">😎</span>
            </div>
          </div>
          <p className="text-white/70">Click to upload or change</p>
        </div>
      </div>

      <div className="py-6 border-t border-white/10" id="modelProvider">
        <h2 className="text-2xl font-bold mb-2 text-white animate-text-glow">Model provider</h2>
        <p className="text-white/80 text-shadow-sm mb-4">
          The AI model provider, such as OpenAI or Anthropic
        </p>
        <select
          value={modelProvider}
          onChange={(e) => setModelProvider(e.target.value)}
          className="w-full backdrop-blur-sm bg-white/10 border border-white/20 text-white p-3 rounded-md"
        >
          {modelProviders.map((provider) => (
            <option key={provider} value={provider}>
              {provider}
            </option>
          ))}
        </select>
      </div>

      <div className="py-6 border-t border-white/10" id="clients">
        <h2 className="text-2xl font-bold mb-2 text-white animate-text-glow">Clients</h2>
        <p className="text-white/80 text-shadow-sm mb-4">
          Supported client types, such as Discord or X
        </p>
        <select
          value={clientType}
          onChange={(e) => setClientType(e.target.value)}
          className="w-full backdrop-blur-sm bg-white/10 border border-white/20 text-white p-3 rounded-md"
        >
          {clientTypes.map((client) => (
            <option key={client} value={client}>
              {client}
            </option>
          ))}
        </select>
      </div>

      <div className="py-6 border-t border-white/10" id="plugins">
        <h2 className="text-2xl font-bold mb-2 text-white animate-text-glow">Plugins <span className="text-xs text-white/50 font-normal">Optional</span></h2>
        <p className="text-white/80 text-shadow-sm mb-4">
          Plugins extend Eliza's core functionality with additional features.
        </p>
        <select
          className="w-full backdrop-blur-sm bg-white/10 border border-white/20 text-white p-3 rounded-md"
        >
          <option value="">Select one or multiple plugins</option>
          <option value="web-search">Web Search</option>
          <option value="knowledge-base">Knowledge Base</option>
          <option value="data-analysis">Data Analysis</option>
        </select>
      </div>
    </>
  );
};

export default BasicInfoSection;