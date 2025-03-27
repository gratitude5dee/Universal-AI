
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
        <h2 className="text-4xl font-bold mb-4">Start with a template</h2>
        <p className="text-muted-foreground mb-6">
          Using the inputs below, craft a unique and engaging personality for your AI agent. Check our <a href="#" className="text-studio-accent">guide</a> for this step.
        </p>

        <div className="bg-black/10 rounded-lg p-6">
          <h3 className="text-xl font-medium mb-4">Templates</h3>
          <p className="text-sm text-muted-foreground mb-6">Use one of the options below to prefill the fields.</p>
          
          <div className="flex flex-wrap gap-2">
            {["Eliza", "Trump", "C-3PO", "BD", "Dobby", "Social", "Support", "Web3"].map((template) => (
              <button
                key={template}
                className={`px-4 py-2.5 rounded-md text-sm font-medium ${
                  template === "Trump" 
                    ? "bg-studio-accent text-white" 
                    : "bg-black/20 text-white hover:bg-black/30"
                }`}
              >
                {template}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="py-6 border-t border-gray-800/10" id="name">
        <h2 className="text-2xl font-bold mb-2">Name</h2>
        <p className="text-muted-foreground mb-4">
          The character's display name for identification and in conversations
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-black/5 text-blue-primary p-3 rounded-md border border-gray-700/20"
        />
      </div>

      <div className="py-6 border-t border-gray-800/10" id="avatar">
        <h2 className="text-2xl font-bold mb-2">Avatar</h2>
        <p className="text-muted-foreground mb-4">
          Update your avatar effortlessly by simply clicking on it.
        </p>
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 bg-green-400 rounded-full flex items-center justify-center">
            <div className="h-16 w-16 bg-green-300 rounded-full flex items-center justify-center">
              <span className="text-3xl">😎</span>
            </div>
          </div>
          <p className="text-muted-foreground">Click to upload or change</p>
        </div>
      </div>

      <div className="py-6 border-t border-gray-800/10" id="modelProvider">
        <h2 className="text-2xl font-bold mb-2">Model provider</h2>
        <p className="text-muted-foreground mb-4">
          The AI model provider, such as OpenAI or Anthropic
        </p>
        <select
          value={modelProvider}
          onChange={(e) => setModelProvider(e.target.value)}
          className="w-full bg-black/5 text-blue-primary p-3 rounded-md border border-gray-700/20"
        >
          {modelProviders.map((provider) => (
            <option key={provider} value={provider}>
              {provider}
            </option>
          ))}
        </select>
      </div>

      <div className="py-6 border-t border-gray-800/10" id="clients">
        <h2 className="text-2xl font-bold mb-2">Clients</h2>
        <p className="text-muted-foreground mb-4">
          Supported client types, such as Discord or X
        </p>
        <select
          value={clientType}
          onChange={(e) => setClientType(e.target.value)}
          className="w-full bg-black/5 text-blue-primary p-3 rounded-md border border-gray-700/20"
        >
          {clientTypes.map((client) => (
            <option key={client} value={client}>
              {client}
            </option>
          ))}
        </select>
      </div>

      <div className="py-6 border-t border-gray-800/10" id="plugins">
        <h2 className="text-2xl font-bold mb-2">Plugins <span className="text-xs text-gray-400 font-normal">Optional</span></h2>
        <p className="text-muted-foreground mb-4">
          Plugins extend Eliza's core functionality with additional features.
        </p>
        <select
          className="w-full bg-black/5 text-blue-primary p-3 rounded-md border border-gray-700/20"
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
