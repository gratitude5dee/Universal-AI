
import React from "react";
import { Image, FileText, FileVideo, Music, Globe } from "lucide-react";

interface CreativeOutput {
  id: string;
  title: string;
  type: "image" | "text" | "video" | "audio" | "web";
  chain: string;
  timestamp: string;
  preview: string;
}

export const CreativeOutputs = () => {
  const outputs: CreativeOutput[] = [
    { 
      id: "1", 
      title: "Sunset Mountains", 
      type: "image", 
      chain: "Ethereum", 
      timestamp: "35m ago",
      preview: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80"
    },
    { 
      id: "2", 
      title: "AI Story Prompt", 
      type: "text", 
      chain: "Solana", 
      timestamp: "2h ago",
      preview: ""
    },
    { 
      id: "3", 
      title: "Animation Loop", 
      type: "video", 
      chain: "Polygon", 
      timestamp: "4h ago",
      preview: ""
    },
    { 
      id: "4", 
      title: "Ambient Melody", 
      type: "audio", 
      chain: "Flow", 
      timestamp: "Yesterday",
      preview: ""
    },
    { 
      id: "5", 
      title: "Interactive Experience", 
      type: "web", 
      chain: "Ethereum", 
      timestamp: "2d ago",
      preview: ""
    },
  ];

  const getTypeIcon = (type: CreativeOutput["type"]) => {
    switch (type) {
      case "image":
        return <Image className="h-5 w-5 text-purple-500" />;
      case "text":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "video":
        return <FileVideo className="h-5 w-5 text-red-500" />;
      case "audio":
        return <Music className="h-5 w-5 text-green-500" />;
      case "web":
        return <Globe className="h-5 w-5 text-amber-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {outputs.map((output) => (
        <div key={output.id} className="flex p-4 glass-card border border-white/10 backdrop-blur-md rounded-xl hover:shadow-md transition-all">
          {output.type === "image" && output.preview ? (
            <div className="w-14 h-14 flex-shrink-0 rounded-lg mr-4 overflow-hidden">
              <img 
                src={output.preview} 
                alt={output.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-14 h-14 flex-shrink-0 rounded-lg bg-studio-sand/20 flex items-center justify-center mr-4">
              {getTypeIcon(output.type)}
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium">{output.title}</h4>
              <span className="text-xs text-muted-foreground">{output.timestamp}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-muted-foreground">
                {getTypeIcon(output.type)}
                <span className="ml-1">{output.type}</span>
              </div>
              <span className="text-xs bg-studio-highlight px-2 py-0.5 rounded-full">
                {output.chain}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
