import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QrCode, Link, Plus } from "lucide-react";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContent: (qrData: string, title: string, description?: string) => Promise<void>;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onAddContent
}) => {
  const [qrData, setQrData] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrData || !title) return;

    try {
      setLoading(true);
      await onAddContent(qrData, title, description);
      setQrData("");
      setTitle("");
      setDescription("");
      onClose();
    } catch (error) {
      console.error('Error adding QR content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQrDataChange = (value: string) => {
    setQrData(value);
    
    // Auto-generate title from URL if possible
    if (value && !title) {
      try {
        const url = new URL(value);
        const domain = url.hostname.replace('www.', '');
        const path = url.pathname.split('/').filter(Boolean).pop() || '';
        setTitle(`Content from ${domain}${path ? ` - ${path}` : ''}`);
      } catch {
        // If not a URL, use the data as title
        setTitle(value.substring(0, 50) + (value.length > 50 ? '...' : ''));
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-background/95 backdrop-blur-md border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Add Content via QR Code
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Scan a QR code or paste URL/data to add content to your library.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* QR Data Input */}
          <div>
            <Label htmlFor="qrData" className="text-white">QR Code Data / URL</Label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                id="qrData"
                type="text"
                placeholder="Paste QR code data or URL here..."
                value={qrData}
                onChange={(e) => handleQrDataChange(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                required
              />
            </div>
          </div>

          {/* Title Input */}
          <div>
            <Label htmlFor="title" className="text-white">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter a title for this content..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <Label htmlFor="description" className="text-white">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add a description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              rows={3}
            />
          </div>

          {/* Preview */}
          {qrData && (
            <div className="p-3 bg-white/10 rounded-lg">
              <p className="text-white/70 text-sm mb-1">Preview:</p>
              <p className="text-white text-sm font-medium">{title}</p>
              {description && (
                <p className="text-white/60 text-xs mt-1">{description}</p>
              )}
              <p className="text-white/50 text-xs mt-2 break-all">{qrData}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!qrData || !title || loading}>
              <Plus className="h-4 w-4 mr-2" />
              {loading ? 'Adding...' : 'Add Content'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};