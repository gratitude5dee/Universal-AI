import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Mail, 
  Calendar, 
  FileText,
  Trash2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BulkOperationsModalProps {
  open: boolean;
  onClose: () => void;
  operation: 'email' | 'status' | 'contract' | 'invoice' | 'delete' | null;
  selectedItems: any[];
  onSuccess: () => void;
}

export const BulkOperationsModal: React.FC<BulkOperationsModalProps> = ({
  open,
  onClose,
  operation,
  selectedItems,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const { toast } = useToast();

  const getOperationTitle = () => {
    switch (operation) {
      case 'email': return 'Send Bulk Email';
      case 'status': return 'Update Status';
      case 'contract': return 'Generate Contracts';
      case 'invoice': return 'Generate Invoices';
      case 'delete': return 'Delete Items';
      default: return 'Bulk Operation';
    }
  };

  const getOperationIcon = () => {
    switch (operation) {
      case 'email': return <Mail className="h-5 w-5 text-[hsl(var(--accent-blue))]" />;
      case 'status': return <Calendar className="h-5 w-5 text-[hsl(var(--success))]" />;
      case 'contract': return <FileText className="h-5 w-5 text-[hsl(var(--accent-cyan))]" />;
      case 'invoice': return <FileText className="h-5 w-5 text-[hsl(var(--warning))]" />;
      case 'delete': return <Trash2 className="h-5 w-5 text-[hsl(var(--error))]" />;
      default: return null;
    }
  };

  const handleExecute = async () => {
    setLoading(true);
    try {
      switch (operation) {
        case 'email':
          // In production, this would call an edge function to send emails
          toast({
            title: "Emails Queued",
            description: `${selectedItems.length} emails have been queued for sending.`,
          });
          break;

        case 'status':
          if (!newStatus) {
            toast({
              title: "Error",
              description: "Please select a status",
              variant: "destructive"
            });
            return;
          }
          
          const { error: statusError } = await supabase
            .from('gigs')
            .update({ status: newStatus })
            .in('id', selectedItems.map(item => item.id));

          if (statusError) throw statusError;

          toast({
            title: "Status Updated",
            description: `${selectedItems.length} gigs updated to ${newStatus}`,
          });
          break;

        case 'contract':
          toast({
            title: "Contracts Generating",
            description: `Generating contracts for ${selectedItems.length} gigs...`,
          });
          break;

        case 'invoice':
          toast({
            title: "Invoices Generating",
            description: `Generating invoices for ${selectedItems.length} gigs...`,
          });
          break;

        case 'delete':
          const { error: deleteError } = await supabase
            .from('gigs')
            .delete()
            .in('id', selectedItems.map(item => item.id));

          if (deleteError) throw deleteError;

          toast({
            title: "Items Deleted",
            description: `${selectedItems.length} items have been deleted.`,
          });
          break;
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete operation",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[hsl(var(--bg-elevated))] border-white/10 text-white max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {getOperationIcon()}
            <DialogTitle className="text-white">{getOperationTitle()}</DialogTitle>
          </div>
          <DialogDescription className="text-white/70">
            Perform bulk operation on {selectedItems.length} selected items
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Selected Items Preview */}
          <div>
            <Label className="text-white/90 mb-2 block">Selected Items</Label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-3 rounded-lg bg-white/5 border border-white/10">
              {selectedItems.slice(0, 10).map((item) => (
                <Badge 
                  key={item.id}
                  variant="outline"
                  className="bg-white/5 border-white/20 text-white/90"
                >
                  {item.title || item.name}
                </Badge>
              ))}
              {selectedItems.length > 10 && (
                <Badge variant="outline" className="bg-white/5 border-white/20 text-white/90">
                  +{selectedItems.length - 10} more
                </Badge>
              )}
            </div>
          </div>

          {/* Operation-Specific Fields */}
          {operation === 'email' && (
            <div className="space-y-4">
              <div>
                <Label className="text-white/90 mb-2 block">Subject</Label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Email subject..."
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-blue))]"
                />
              </div>
              <div>
                <Label className="text-white/90 mb-2 block">Message</Label>
                <Textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Email body..."
                  rows={6}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-[hsl(var(--accent-blue))]"
                />
              </div>
            </div>
          )}

          {operation === 'status' && (
            <div>
              <Label className="text-white/90 mb-2 block">New Status</Label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-blue))]"
              >
                <option value="">Select status...</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="contracted">Contracted</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}

          {operation === 'delete' && (
            <div className="p-4 rounded-lg bg-[hsl(var(--error))]/10 border border-[hsl(var(--error))]/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-[hsl(var(--error))] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[hsl(var(--error))] font-medium mb-1">
                    Warning: This action cannot be undone
                  </p>
                  <p className="text-white/70 text-sm">
                    {selectedItems.length} items will be permanently deleted from your database.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleExecute}
            disabled={loading}
            className={
              operation === 'delete'
                ? 'bg-[hsl(var(--error))] hover:bg-[hsl(var(--error))]/80 text-white'
                : 'bg-[hsl(var(--accent-blue))] hover:bg-[hsl(var(--accent-blue))]/80 text-white'
            }
          >
            {loading ? (
              <>Processing...</>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {operation === 'delete' ? 'Delete All' : 'Execute'}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
