import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, QrCode, Link as LinkIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiquidGlassModalProps {
  asset: any;
  isOpen: boolean;
  onClose: () => void;
}

const LiquidGlassModal: React.FC<LiquidGlassModalProps> = ({ asset, isOpen, onClose }) => {
  if (!asset) return null;

  const links = [
    { name: "Spotify", url: "#" },
    { name: "SoundCloud", url: "#" },
    { name: "Instagram", url: "#" },
    { name: "X (Twitter)", url: "#" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative bg-white/10 border border-white/20 rounded-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Image */}
            <img src={asset.image} alt={asset.title} className="absolute inset-0 w-full h-full object-cover opacity-20 blur-md" />
            <div className="absolute inset-0 bg-black/50" />

            <div className="relative p-8">
              <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white/70 hover:text-white" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>

              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-white text-shadow-lg">{asset.title}</h2>
                <p className="text-white/80 text-lg">{asset.artist}</p>
              </div>

              <div className="space-y-4">
                {links.map(link => (
                  <Button key={link.name} variant="outline" className="w-full justify-start text-white bg-white/10 hover:bg-white/20 border-white/20">
                    <LinkIcon className="h-4 w-4 mr-3" />
                    {link.name}
                  </Button>
                ))}
                <Button variant="outline" className="w-full justify-start text-white bg-white/10 hover:bg-white/20 border-white/20 border-dashed">
                  <Plus className="h-4 w-4 mr-3" />
                  Add New Link
                </Button>
              </div>

              <div className="mt-8 flex flex-col items-center">
                <div className="bg-white p-2 rounded-lg">
                  <QrCode className="h-24 w-24 text-black" />
                </div>
                <p className="text-white/70 mt-2 text-sm">Scan to share</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LiquidGlassModal;