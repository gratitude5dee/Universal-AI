import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Link as LinkIcon, Plus, Check, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";

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
  const queryClient = useQueryClient();
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const isGuestAsset = asset?.creatorId === "guest";

  const { data: links = [] } = useQuery({
    queryKey: ["asset-links", asset?.id],
    enabled: isOpen && Boolean(asset?.id) && !isGuestAsset,
    queryFn: async (): Promise<Link[]> => {
      if (!asset?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from("asset_links")
        .select("id, label, url")
        .eq("content_item_id", asset.id)
        .order("created_at", { ascending: true });

      if (error) {
        throw error;
      }

      return (data ?? []).map((link) => ({
        id: String(link.id),
        name: String(link.label),
        url: String(link.url),
      }));
    },
  });

  const refreshLinks = async () => {
    if (!asset?.id || isGuestAsset) return;
    await queryClient.invalidateQueries({ queryKey: ["asset-links", asset.id] });
    await queryClient.invalidateQueries({ queryKey: ["content-library-assets"] });
  };

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

    void (async () => {
      const { error } = await supabase.from("asset_links").insert({
        content_item_id: asset.id,
        creator_id: asset.creatorId,
        link_type: "external",
        label: newLinkName.trim(),
        url: newLinkUrl.trim(),
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setNewLinkName("");
      setNewLinkUrl("");
      setIsAddingLink(false);
      await refreshLinks();
      toast({
        title: "Success",
        description: `Added ${newLinkName.trim()} link successfully!`,
      });
    })();
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

    void (async () => {
      const { error } = await supabase
        .from("asset_links")
        .update({
          label: newLinkName.trim(),
          url: newLinkUrl.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingLinkId);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setEditingLinkId(null);
      setNewLinkName("");
      setNewLinkUrl("");
      await refreshLinks();
      toast({
        title: "Success",
        description: "Link updated successfully!",
      });
    })();
  };

  const handleDeleteLink = (linkId: string) => {
    void (async () => {
      const { error } = await supabase
        .from("asset_links")
        .delete()
        .eq("id", linkId);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      await refreshLinks();
      toast({
        title: "Success",
        description: "Link deleted successfully!",
      });
    })();
  };

  const cancelEditing = () => {
    setIsAddingLink(false);
    setEditingLinkId(null);
    setNewLinkName("");
    setNewLinkUrl("");
  };

  const shareUrl =
    links[0]?.url ??
    asset.signedUrl ??
    (typeof window !== "undefined" ? window.location.href : "https://universalai.local");

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
                {isGuestAsset ? (
                  <div className="rounded-lg border border-dashed border-white/15 bg-white/5 p-3 text-sm text-white/70">
                    Guest mode demo assets are view-only. Sign in to manage links, rights, and distribution targets.
                  </div>
                ) : null}

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
                
                {!isGuestAsset && isAddingLink ? (
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
                ) : !isGuestAsset ? (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-white bg-white/10 hover:bg-white/20 border-white/20 border-dashed transition-all"
                    onClick={() => setIsAddingLink(true)}
                  >
                    <Plus className="h-4 w-4 mr-3" />
                    Add New Link
                  </Button>
                ) : null}
              </div>

              <div className="mt-8 flex flex-col items-center">
                <div className="bg-white p-2 rounded-lg">
                  <QRCodeSVG value={shareUrl} size={96} />
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
