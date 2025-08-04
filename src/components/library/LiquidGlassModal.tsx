import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, QrCode, Link as LinkIcon, Plus, Check, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface Link {
  id: string;
  name: string;
  url: string;
}

interface LiquidGlassModalProps {
  asset: any;
  isOpen: boolean;
  onClose: () => void;
}

const LiquidGlassModal: React.FC<LiquidGlassModalProps> = ({ asset, isOpen, onClose }) => {
  const { toast } = useToast();
  const [links, setLinks] = useState<Link[]>([
    { id: "1", name: "Spotify", url: "https://spotify.com" },
    { id: "2", name: "SoundCloud", url: "https://soundcloud.com" },
    { id: "3", name: "Instagram", url: "https://instagram.com" },
    { id: "4", name: "X (Twitter)", url: "https://x.com" },
  ]);
  
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  if (!asset) return null;

  const handleAddLink = () => {
    if (!newLinkName.trim() || !newLinkUrl.trim()) {
      toast({
        title: "Error",
        description: "Please provide both a name and URL for the link.",
        variant: "destructive",
      });
      return;
    }

    const newLink: Link = {
      id: Date.now().toString(),
      name: newLinkName.trim(),
      url: newLinkUrl.trim(),
    };

    setLinks([...links, newLink]);
    setNewLinkName("");
    setNewLinkUrl("");
    setIsAddingLink(false);
    
    toast({
      title: "Success",
      description: `Added ${newLink.name} link successfully!`,
    });
  };

  const handleEditLink = (link: Link) => {
    setEditingLinkId(link.id);
    setNewLinkName(link.name);
    setNewLinkUrl(link.url);
  };

  const handleUpdateLink = () => {
    if (!newLinkName.trim() || !newLinkUrl.trim()) {
      toast({
        title: "Error",
        description: "Please provide both a name and URL for the link.",
        variant: "destructive",
      });
      return;
    }

    setLinks(links.map(link => 
      link.id === editingLinkId 
        ? { ...link, name: newLinkName.trim(), url: newLinkUrl.trim() }
        : link
    ));
    
    setEditingLinkId(null);
    setNewLinkName("");
    setNewLinkUrl("");
    
    toast({
      title: "Success",
      description: "Link updated successfully!",
    });
  };

  const handleDeleteLink = (linkId: string) => {
    setLinks(links.filter(link => link.id !== linkId));
    toast({
      title: "Success",
      description: "Link deleted successfully!",
    });
  };

  const cancelEditing = () => {
    setIsAddingLink(false);
    setEditingLinkId(null);
    setNewLinkName("");
    setNewLinkUrl("");
  };

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

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {links.map(link => (
                  <motion.div 
                    key={link.id}
                    layout
                    className="group relative"
                  >
                    {editingLinkId === link.id ? (
                      <div className="space-y-2 p-3 bg-white/5 rounded-lg border border-white/10">
                        <Input 
                          value={newLinkName}
                          onChange={(e) => setNewLinkName(e.target.value)}
                          placeholder="Link name (e.g., Spotify)"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                        <Input 
                          value={newLinkUrl}
                          onChange={(e) => setNewLinkUrl(e.target.value)}
                          placeholder="URL (e.g., https://spotify.com)"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleUpdateLink} className="flex-1 bg-green-600/80 hover:bg-green-600 text-white">
                            <Check className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEditing} className="text-white border-white/20 hover:bg-white/10">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1 justify-start text-white bg-white/10 hover:bg-white/20 border-white/20 transition-all"
                          onClick={() => window.open(link.url, '_blank')}
                        >
                          <LinkIcon className="h-4 w-4 mr-3" />
                          {link.name}
                        </Button>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                            onClick={() => handleEditLink(link)}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={() => handleDeleteLink(link.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {isAddingLink ? (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2 p-3 bg-white/5 rounded-lg border border-white/10 border-dashed"
                  >
                    <Input 
                      value={newLinkName}
                      onChange={(e) => setNewLinkName(e.target.value)}
                      placeholder="Link name (e.g., YouTube Music)"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      autoFocus
                    />
                    <Input 
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      placeholder="URL (e.g., https://music.youtube.com)"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAddLink} className="flex-1 bg-[#9b87f5] hover:bg-[#9b87f5]/90 text-white">
                        <Check className="h-3 w-3 mr-1" />
                        Add Link
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEditing} className="text-white border-white/20 hover:bg-white/10">
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-white bg-white/10 hover:bg-white/20 border-white/20 border-dashed transition-all"
                    onClick={() => setIsAddingLink(true)}
                  >
                    <Plus className="h-4 w-4 mr-3" />
                    Add New Link
                  </Button>
                )}
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