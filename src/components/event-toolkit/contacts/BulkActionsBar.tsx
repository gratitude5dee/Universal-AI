import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Mail, 
  Tag, 
  Trash2, 
  X,
  UserPlus,
  Download,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BulkActionsBarProps {
  selectedCount: number;
  onEmailAll?: () => void;
  onAddTags?: () => void;
  onDeleteAll?: () => void;
  onExport?: () => void;
  onClearSelection: () => void;
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onEmailAll,
  onAddTags,
  onDeleteAll,
  onExport,
  onClearSelection
}) => {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <Card className="bg-[hsl(var(--bg-elevated))] backdrop-blur-xl border-white/20 shadow-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Selection Count */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[hsl(var(--accent-blue))]/20 border border-[hsl(var(--accent-blue))]/30">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(var(--accent-blue))]" />
                  <span className="text-white font-medium text-sm">
                    {selectedCount} selected
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {onEmailAll && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onEmailAll}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email All
                    </Button>
                  )}

                  {onAddTags && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onAddTags}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Tag className="h-4 w-4 mr-2" />
                      Add Tags
                    </Button>
                  )}

                  {onExport && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onExport}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  )}

                  {onDeleteAll && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onDeleteAll}
                      className="border-[hsl(var(--error))]/50 text-[hsl(var(--error))] hover:bg-[hsl(var(--error))]/10"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  )}
                </div>

                {/* Clear Selection */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onClearSelection}
                  className="text-white/70 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
