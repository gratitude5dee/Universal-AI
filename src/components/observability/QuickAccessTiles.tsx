import React from "react";
import { Link } from "react-router-dom";
import { 
  Image, 
  Code, 
  Shield, 
  Gem, 
  Wand2, 
  Globe, 
  Eye, 
  Wallet,
  Music,
  Users,
  HeartPulse,
  Bot
} from "lucide-react";

interface QuickAccessTile {
  id: string;
  title: string;
  icon: React.ElementType;
  path: string;
  color: string;
}

export const QuickAccessTiles = () => {
  const tiles: QuickAccessTile[] = [
    { id: "1", title: "Create Agent", icon: Bot, path: "/create-agent", color: "#8B5CF6" },
    { id: "2", title: "Asset Library", icon: Image, path: "/asset-library", color: "#F97316" },
    { id: "3", title: "Collection", icon: Gem, path: "/collection", color: "#0EA5E9" },
    { id: "4", title: "Projects", icon: Users, path: "/projects", color: "#10B981" },
    { id: "5", title: "Bridge", icon: Wand2, path: "/bridge", color: "#EC4899" },
    { id: "6", title: "Marketplace", icon: Globe, path: "/marketplace-launch", color: "#6366F1" },
    { id: "7", title: "IP Portal", icon: Shield, path: "/rights", color: "#9b87f5" },
    { id: "8", title: "Treasury", icon: Wallet, path: "/treasury", color: "#F97316" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {tiles.map((tile) => {
        const TileIcon = tile.icon;
        return (
          <Link 
            key={tile.id} 
            to={tile.path}
            className="backdrop-blur-md bg-white/10 p-4 rounded-xl border border-white/20 shadow-card-glow flex flex-col items-center justify-center hover:bg-white/15 transition-all duration-200 h-24"
          >
            <div 
              className="p-2 rounded-lg mb-2"
              style={{ backgroundColor: `${tile.color}20` }}
            >
              <TileIcon style={{ color: tile.color }} className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-center text-white text-shadow-sm">{tile.title}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default QuickAccessTiles;