import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, AlertTriangle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Collaborator {
  address: string;
  role: string;
  split: number;
  permissions: {
    editIP: boolean;
    createLicense: boolean;
    withdraw: boolean;
  };
}

interface CollaboratorEditorProps {
  isOpen: boolean;
  onClose: () => void;
  existingCollaborators?: Collaborator[];
  onSave?: (collaborators: Collaborator[]) => void;
}

const ROLES = ["Creator", "Co-author", "Composer", "Producer", "Designer", "Engineer", "Other"];

export const CollaboratorEditor = ({ 
  isOpen, 
  onClose,
  existingCollaborators = [],
  onSave
}: CollaboratorEditorProps) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(
    existingCollaborators.length > 0 
      ? existingCollaborators 
      : [{ address: "", role: "Creator", split: 100, permissions: { editIP: true, createLicense: true, withdraw: true } }]
  );
  
  const [auditLog] = useState([
    { timestamp: new Date(), action: "Changed split from 20% to 15%", user: "0x742d...bEb8" },
    { timestamp: new Date(Date.now() - 86400000), action: "Added new collaborator", user: "0x742d...bEb8" },
  ]);

  const totalSplit = collaborators.reduce((sum, c) => sum + Number(c.split || 0), 0);
  const splitIsValid = totalSplit === 100;

  const addCollaborator = () => {
    setCollaborators([
      ...collaborators,
      { address: "", role: "Collaborator", split: 0, permissions: { editIP: false, createLicense: false, withdraw: false } }
    ]);
  };

  const removeCollaborator = (index: number) => {
    if (collaborators.length > 1) {
      setCollaborators(collaborators.filter((_, i) => i !== index));
    }
  };

  const updateCollaborator = (index: number, field: string, value: any) => {
    const updated = [...collaborators];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updated[index] = {
        ...updated[index],
        [parent]: { ...updated[index].permissions, [child]: value }
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setCollaborators(updated);
  };

  const handleSave = () => {
    if (!splitIsValid) {
      toast.error("Splits must total exactly 100%");
      return;
    }

    const invalidAddresses = collaborators.filter(c => !c.address || c.address.length < 10);
    if (invalidAddresses.length > 0) {
      toast.error("All collaborators must have valid wallet addresses");
      return;
    }

    onSave?.(collaborators);
    toast.success("Collaborator ecosystem updated");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden glass-card border border-white/10 rounded-2xl shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="border-b border-white/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Edit Collaborator Ecosystem</h2>
                <p className="text-sm text-white/70 mt-1">Manage ownership shares and permissions</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Collaborators List */}
              <div className="space-y-4">
                {collaborators.map((collab, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 glass-card border border-white/10 rounded-xl"
                  >
                    <div className="space-y-4">
                      {/* Row 1: Address and Role */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-white/70">Wallet Address *</Label>
                          <Input
                            value={collab.address}
                            onChange={(e) => updateCollaborator(index, "address", e.target.value)}
                            placeholder="0x..."
                            className="mt-1 bg-white/5 border-white/10 font-mono text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-white/70">Role</Label>
                          <select
                            value={collab.role}
                            onChange={(e) => updateCollaborator(index, "role", e.target.value)}
                            className="mt-1 w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                          >
                            {ROLES.map(role => (
                              <option key={role} value={role}>{role}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Row 2: Split and Permissions */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label className="text-xs text-white/70">Revenue Split %</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={collab.split}
                            onChange={(e) => updateCollaborator(index, "split", Number(e.target.value))}
                            className="mt-1 bg-white/5 border-white/10 text-sm"
                          />
                        </div>
                        <div className="md:col-span-3">
                          <Label className="text-xs text-white/70 mb-2 block">Permissions</Label>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={collab.permissions.editIP}
                                onChange={(e) => updateCollaborator(index, "permissions.editIP", e.target.checked)}
                                className="w-4 h-4 rounded border-white/20 bg-white/5"
                              />
                              <span className="text-xs text-white">Edit IP</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={collab.permissions.createLicense}
                                onChange={(e) => updateCollaborator(index, "permissions.createLicense", e.target.checked)}
                                className="w-4 h-4 rounded border-white/20 bg-white/5"
                              />
                              <span className="text-xs text-white">License</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={collab.permissions.withdraw}
                                onChange={(e) => updateCollaborator(index, "permissions.withdraw", e.target.checked)}
                                className="w-4 h-4 rounded border-white/20 bg-white/5"
                              />
                              <span className="text-xs text-white">Withdraw</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Delete Button */}
                      {collaborators.length > 1 && (
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeCollaborator(index)}
                            className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                <Button
                  variant="outline"
                  onClick={addCollaborator}
                  className="w-full border-white/10 border-dashed"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Collaborator
                </Button>
              </div>

              {/* Split Validation */}
              <div className={`p-4 rounded-xl ${splitIsValid ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {splitIsValid ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    )}
                    <span className="text-sm font-medium">Total Split</span>
                  </div>
                  <span className={`text-lg font-bold ${splitIsValid ? "text-green-400" : "text-red-400"}`}>
                    {totalSplit}%
                  </span>
                </div>
                {!splitIsValid && (
                  <p className="text-xs text-red-300 mt-2">Splits must total exactly 100%</p>
                )}
              </div>

              {/* Audit Log */}
              <div className="border-t border-white/10 pt-4">
                <h3 className="text-sm font-medium text-white mb-3">Recent Changes</h3>
                <div className="space-y-2">
                  {auditLog.map((log, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs p-3 bg-white/5 rounded-lg">
                      <div className="flex-1">
                        <p className="text-white">{log.action}</p>
                        <p className="text-white/50 mt-1">
                          {log.timestamp.toLocaleDateString()} at {log.timestamp.toLocaleTimeString()} • {log.user}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 p-6">
            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" onClick={onClose} className="border-white/10">
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!splitIsValid}
                className="bg-primary hover:bg-primary/80"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
