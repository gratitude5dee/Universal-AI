import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ArrowRight, CheckCircle, AlertTriangle, Droplet, ExternalLink, Upload, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNetwork } from "@/context/NetworkContext";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

interface IPRegistrationWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

type RegistrationType = "new" | "remix";

const STEPS = [
  { id: 1, title: "Type", description: "Choose new IP or remix existing" },
  { id: 2, title: "Details", description: "Provide IP information" },
  { id: 3, title: "Collab", description: "Define ownership shares" },
  { id: 4, title: "Policy", description: "Set revenue distribution" },
  { id: 5, title: "Review", description: "Confirm and deploy" },
];

export const IPRegistrationWizard = ({ isOpen, onClose }: IPRegistrationWizardProps) => {
  const { currentNetwork } = useNetwork();
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationType, setRegistrationType] = useState<RegistrationType>("new");
  
  // Form state
  const [assetDetails, setAssetDetails] = useState({
    title: "",
    description: "",
    category: "music",
    tags: [] as string[],
  });
  
  const [collaborators, setCollaborators] = useState([
    { address: "", role: "Creator", split: 100, permissions: { edit: true, license: true, withdraw: true } },
  ]);
  
  const [royaltyPolicy, setRoyaltyPolicy] = useState({
    type: "LRP",
    primarySale: 100,
    downstreamRate: 10,
  });
  
  const [parentIP, setParentIP] = useState("");

  // Mock IP balance - in production, get from wallet
  const ipBalance = 2.5;
  const estimatedCost = registrationType === "new" ? 5 : 7;
  const hasEnoughGas = ipBalance >= estimatedCost;

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRegister = async () => {
    if (!hasEnoughGas) {
      toast.error("Insufficient IP for gas");
      return;
    }

    // Simulate registration
    toast.success("IP Registration initiated! View in IP Explorer");
    setTimeout(() => {
      onClose();
      setCurrentStep(1);
    }, 1500);
  };

  const addCollaborator = () => {
    setCollaborators([...collaborators, { address: "", role: "Co-author", split: 0, permissions: { edit: true, license: true, withdraw: false } }]);
  };

  const removeCollaborator = (index: number) => {
    if (collaborators.length > 1) {
      setCollaborators(collaborators.filter((_, i) => i !== index));
    }
  };

  const updateCollaborator = (index: number, field: string, value: any) => {
    const updated = [...collaborators];
    updated[index] = { ...updated[index], [field]: value };
    setCollaborators(updated);
  };

  const totalSplit = collaborators.reduce((sum, c) => sum + Number(c.split || 0), 0);
  const splitIsValid = totalSplit === 100;

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
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden glass-card border border-white/10 rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="border-b border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-[hsl(var(--text-primary))]">Register your IP</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5 text-[hsl(var(--text-secondary))]" />
              </button>
            </div>
            <p className="text-xs text-[hsl(var(--text-tertiary))] mb-4">Draft autosaved 2 minutes ago</p>

            {/* Progress Bar */}
            <div className="flex items-center gap-2">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                        currentStep > step.id
                          ? "bg-green-500/20 text-green-400 border-2 border-green-500/40"
                          : currentStep === step.id
                          ? "bg-primary/20 text-primary border-2 border-primary/40"
                          : "bg-white/5 text-white/40 border-2 border-white/10"
                      }`}
                    >
                      {currentStep > step.id ? <CheckCircle className="w-4 h-4" /> : step.id}
                    </div>
                    <div className="hidden md:block">
                      <p className={`text-xs font-medium ${currentStep >= step.id ? "text-white" : "text-white/40"}`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`h-0.5 w-full ${currentStep > step.id ? "bg-green-500/40" : "bg-white/10"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-240px)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Step 1: Registration Type */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-[hsl(var(--text-primary))] mb-2">Choose a Registration Type</h3>
                      <p className="text-sm text-[hsl(var(--text-secondary))]">Select whether you're registering a new IP or remixing existing work</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => setRegistrationType("new")}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          registrationType === "new"
                            ? "border-[hsl(var(--accent-purple))]/40 bg-[hsl(var(--accent-purple))]/10"
                            : "border-white/10 bg-[hsl(var(--bg-tertiary))] hover:border-white/20"
                        }`}
                      >
                        <div className="text-left">
                          <div className="text-2xl mb-2">◈</div>
                          <h4 className="text-lg font-medium text-[hsl(var(--text-primary))] mb-2">New IP</h4>
                          <p className="text-sm text-[hsl(var(--text-secondary))] mb-4">
                            Register an original creation
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => setRegistrationType("remix")}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          registrationType === "remix"
                            ? "border-[hsl(var(--accent-purple))]/40 bg-[hsl(var(--accent-purple))]/10"
                            : "border-white/10 bg-[hsl(var(--bg-tertiary))] hover:border-white/20"
                        }`}
                      >
                        <div className="text-left">
                          <div className="text-2xl mb-2">🔗</div>
                          <h4 className="text-lg font-medium text-[hsl(var(--text-primary))] mb-2">Remix</h4>
                          <p className="text-sm text-[hsl(var(--text-secondary))] mb-4">
                            Register a derivative work based on existing parent IP
                          </p>
                        </div>
                      </button>
                    </div>

                    <div className="p-4 bg-[hsl(var(--accent-blue))]/10 border border-[hsl(var(--accent-blue))]/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-[hsl(var(--accent-blue))] mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-[hsl(var(--text-secondary))]">
                          <p className="font-medium mb-1">What's the difference?</p>
                          <p><strong>New IP:</strong> Original work, you set all terms</p>
                          <p><strong>Remix:</strong> Derivative work, inherits parent royalty policy and contributes upstream</p>
                        </div>
                      </div>
                    </div>

                    {registrationType === "remix" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-4"
                      >
                        <div className="p-4 bg-[hsl(var(--bg-tertiary))] border border-white/10 rounded-lg">
                          <Label className="text-[hsl(var(--text-primary))]">Select Parent IP</Label>
                          <Input
                            value={parentIP}
                            onChange={(e) => setParentIP(e.target.value)}
                            placeholder="Search by name or address..."
                            className="mt-2 bg-white/5 border-white/10"
                          />
                          <div className="mt-3 space-y-2">
                            <p className="text-xs font-medium text-[hsl(var(--text-secondary))]">Recent Parent Options:</p>
                            <button className="w-full text-left px-3 py-2 rounded bg-white/5 hover:bg-white/10 text-sm text-[hsl(var(--text-primary))] transition-all">
                              ○ Cosmic Voyager
                            </button>
                            <button className="w-full text-left px-3 py-2 rounded bg-white/5 hover:bg-white/10 text-sm text-[hsl(var(--text-primary))] transition-all">
                              ○ Digital Renaissance
                            </button>
                          </div>
                        </div>
                        <div className="p-3 bg-[hsl(var(--warning))]/10 border border-[hsl(var(--warning))]/20 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-[hsl(var(--warning))] mt-0.5" />
                            <p className="text-xs text-[hsl(var(--warning))]">
                              Note: Remixing inherits the parent's royalty policy (LRP). You'll add your split on top of existing royalties.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Gas Warning */}
                    {!hasEnoughGas && (
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-yellow-300 mb-1">Insufficient IP for gas</p>
                            <p className="text-xs text-yellow-200/70 mb-3">
                              You have {ipBalance} IP but need {estimatedCost} IP to register
                            </p>
                            {currentNetwork.type === "testnet" && currentNetwork.faucetUrl && (
                              <a
                                href={currentNetwork.faucetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all text-sm"
                              >
                                <Droplet className="w-4 h-4 text-blue-400" />
                                <span className="text-blue-300 font-medium">Get 10 IP (Faucet)</span>
                                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Asset Details */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-[hsl(var(--text-primary))] mb-2">Asset Information</h3>
                      <p className="text-sm text-[hsl(var(--text-secondary))]">Provide information about your IP asset</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-[hsl(var(--text-primary))]">Title *</Label>
                        <Input
                          value={assetDetails.title}
                          onChange={(e) => setAssetDetails({ ...assetDetails, title: e.target.value })}
                          placeholder="The Universal Dream"
                          className="mt-2 bg-white/5 border-white/10"
                        />
                      </div>

                      <div>
                        <Label className="text-[hsl(var(--text-primary))]">Description</Label>
                        <Textarea
                          value={assetDetails.description}
                          onChange={(e) => setAssetDetails({ ...assetDetails, description: e.target.value })}
                          placeholder="Describe your IP asset... (Max 500 characters)"
                          maxLength={500}
                          className="mt-2 bg-white/5 border-white/10 min-h-[120px]"
                        />
                        <p className="text-xs text-[hsl(var(--text-tertiary))] mt-1">
                          {assetDetails.description.length}/500 characters
                        </p>
                      </div>

                      <div>
                        <Label className="text-[hsl(var(--text-primary))]">Media Upload</Label>
                        <div className="mt-2 border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-white/20 transition-all cursor-pointer bg-white/5">
                          <Upload className="w-8 h-8 text-[hsl(var(--text-tertiary))] mx-auto mb-2" />
                          <p className="text-sm text-[hsl(var(--text-secondary))] mb-1">Drag file or click to upload</p>
                          <p className="text-xs text-[hsl(var(--text-tertiary))]">PNG, JPG, MP4, MP3 • Max 50MB</p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-[hsl(var(--text-primary))]">Category *</Label>
                        <select
                          value={assetDetails.category}
                          onChange={(e) => setAssetDetails({ ...assetDetails, category: e.target.value })}
                          className="mt-2 w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[hsl(var(--text-primary))]"
                        >
                          <option value="visual-art">Visual Art</option>
                          <option value="music">Music</option>
                          <option value="video">Video</option>
                          <option value="written">Written Work</option>
                          <option value="code">Code</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <Label className="text-[hsl(var(--text-primary))]">Tags (comma separated)</Label>
                        <Input
                          placeholder="scifi, ai-generated, concept-art"
                          className="mt-2 bg-white/5 border-white/10"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && e.currentTarget.value) {
                              setAssetDetails({
                                ...assetDetails,
                                tags: [...assetDetails.tags, e.currentTarget.value.trim()],
                              });
                              e.currentTarget.value = "";
                            }
                          }}
                        />
                        {assetDetails.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {assetDetails.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-[hsl(var(--accent-purple))]/20 text-[hsl(var(--accent-purple))] text-xs rounded border border-[hsl(var(--accent-purple))]/30"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-[hsl(var(--text-tertiary))]">* Required fields</p>
                    </div>
                  </div>
                )}

                {/* Step 3: Collaborators & Splits */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-[hsl(var(--text-primary))] mb-2">Collaborator Ecosystem</h3>
                      <p className="text-sm text-[hsl(var(--text-secondary))]">Define ownership and revenue shares</p>
                    </div>

                    <div className="space-y-4">
                      <div className="text-sm font-medium text-[hsl(var(--text-primary))]">Current Collaborators:</div>
                      {collaborators.map((collab, index) => (
                        <div key={index} className="p-4 bg-[hsl(var(--bg-tertiary))] rounded-lg border border-white/10">
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs text-[hsl(var(--text-secondary))]">Name/Address</Label>
                                <Input
                                  value={collab.address}
                                  onChange={(e) => updateCollaborator(index, "address", e.target.value)}
                                  placeholder="0x... or ENS name"
                                  className="mt-1 bg-white/5 border-white/10 text-sm"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs text-[hsl(var(--text-secondary))]">Role</Label>
                                  <select
                                    value={collab.role}
                                    onChange={(e) => updateCollaborator(index, "role", e.target.value)}
                                    className="mt-1 w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[hsl(var(--text-primary))] text-sm"
                                  >
                                    <option value="Creator">Creator</option>
                                    <option value="Co-author">Co-author</option>
                                    <option value="Visual">Visual</option>
                                    <option value="Narrative">Narrative</option>
                                    <option value="Producer">Producer</option>
                                  </select>
                                </div>
                                <div>
                                  <Label className="text-xs text-[hsl(var(--text-secondary))]">Split %</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={collab.split}
                                    onChange={(e) => updateCollaborator(index, "split", e.target.value)}
                                    className="mt-1 bg-white/5 border-white/10 text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <Label className="text-xs text-[hsl(var(--text-secondary))] mb-2 block">Permissions:</Label>
                              <div className="flex flex-wrap gap-4">
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`edit-${index}`} 
                                    checked={collab.permissions?.edit}
                                    onCheckedChange={(checked) => updateCollaborator(index, "permissions", { ...collab.permissions, edit: checked })}
                                  />
                                  <label htmlFor={`edit-${index}`} className="text-xs text-[hsl(var(--text-secondary))]">View IP details</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`license-${index}`}
                                    checked={collab.permissions?.license}
                                    onCheckedChange={(checked) => updateCollaborator(index, "permissions", { ...collab.permissions, license: checked })}
                                  />
                                  <label htmlFor={`license-${index}`} className="text-xs text-[hsl(var(--text-secondary))]">Create licenses</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`withdraw-${index}`}
                                    checked={collab.permissions?.withdraw}
                                    onCheckedChange={(checked) => updateCollaborator(index, "permissions", { ...collab.permissions, withdraw: checked })}
                                  />
                                  <label htmlFor={`withdraw-${index}`} className="text-xs text-[hsl(var(--text-secondary))]">Withdraw royalties</label>
                                </div>
                              </div>
                            </div>

                            {collaborators.length > 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeCollaborator(index)}
                                className="w-full border-[hsl(var(--error))]/20 text-[hsl(var(--error))] hover:bg-[hsl(var(--error))]/10"
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        onClick={addCollaborator}
                        className="w-full border-white/10"
                      >
                        + Add Collaborator
                      </Button>

                      <div className={`p-4 rounded-lg ${splitIsValid ? "bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/20" : "bg-[hsl(var(--error))]/10 border border-[hsl(var(--error))]/20"}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[hsl(var(--text-primary))]">
                            ℹ️ Total must equal 100%
                          </span>
                          <span className={`text-lg font-bold ${splitIsValid ? "text-[hsl(var(--success))]" : "text-[hsl(var(--error))]"}`}>
                            {totalSplit}% {splitIsValid && "✓"}
                          </span>
                        </div>
                        {!splitIsValid && (
                          <p className="text-xs text-[hsl(var(--error))] mt-2">Current total: {totalSplit}% ({100 - totalSplit}% remaining)</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Royalty Policy */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-[hsl(var(--text-primary))] mb-2">Royalty Policy Configuration *</h3>
                      <p className="text-sm text-[hsl(var(--text-secondary))]">Define how revenue is distributed</p>
                    </div>

                    <div>
                      <Label className="text-[hsl(var(--text-primary))] mb-3 block">Select Policy Type:</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { type: "LRP", name: "Liquid Royalty" },
                          { type: "LAP", name: "License Access" },
                          { type: "Custom", name: "Custom" }
                        ].map(({ type, name }) => (
                          <button
                            key={type}
                            onClick={() => setRoyaltyPolicy({ ...royaltyPolicy, type })}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              royaltyPolicy.type === type
                                ? "border-[hsl(var(--accent-purple))]/40 bg-[hsl(var(--accent-purple))]/10"
                                : "border-white/10 bg-[hsl(var(--bg-tertiary))] hover:border-white/20"
                            }`}
                          >
                            <div className="text-center">
                              {royaltyPolicy.type === type && <CheckCircle className="w-5 h-5 text-[hsl(var(--accent-purple))] mx-auto mb-2" />}
                              <h4 className="text-sm font-medium text-[hsl(var(--text-primary))] mb-1">{type}</h4>
                              <p className="text-xs text-[hsl(var(--text-tertiary))]]">{name}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-[hsl(var(--accent-blue))]/10 border border-[hsl(var(--accent-blue))]/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-[hsl(var(--accent-blue))] mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-[hsl(var(--text-secondary))]">
                          <p className="font-medium mb-1">ℹ️ Liquid Royalty Policy (LRP)</p>
                          <p>Revenue flows upstream to all ancestors automatically. Licensees pay a single fee that distributes across the entire IP lineage.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-[hsl(var(--text-primary))]">Your Share</Label>
                        <div className="mt-2 flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={70}
                            readOnly
                            className="bg-white/5 border-white/10"
                          />
                          <span className="text-sm text-[hsl(var(--text-secondary))]">%</span>
                        </div>
                      </div>

                      {registrationType === "remix" && (
                        <div>
                          <Label className="text-[hsl(var(--text-primary))]">Parent Share</Label>
                          <div className="mt-2 flex items-center gap-2">
                            <Input
                              type="number"
                              value={20}
                              readOnly
                              className="bg-white/5 border-white/10"
                            />
                            <span className="text-sm text-[hsl(var(--text-secondary))]">%</span>
                          </div>
                        </div>
                      )}

                      <div>
                        <Label className="text-[hsl(var(--text-primary))]">Platform Fee</Label>
                        <div className="mt-2 flex items-center gap-2">
                          <Input
                            type="number"
                            value={10}
                            readOnly
                            className="bg-white/5 border-white/10"
                          />
                          <span className="text-sm text-[hsl(var(--text-secondary))]">%</span>
                        </div>
                      </div>

                      <div>
                        <Label className="text-[hsl(var(--text-primary))]">Downstream License Rate</Label>
                        <div className="mt-2 flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={royaltyPolicy.downstreamRate}
                            onChange={(e) => setRoyaltyPolicy({ ...royaltyPolicy, downstreamRate: Number(e.target.value) })}
                            className="bg-white/5 border-white/10"
                          />
                          <span className="text-sm text-[hsl(var(--text-secondary))]">%</span>
                        </div>
                        <p className="text-xs text-[hsl(var(--text-tertiary))] mt-2">When others remix your IP</p>
                      </div>

                      <div className="p-4 bg-[hsl(var(--bg-tertiary))] rounded-lg border border-white/10">
                        <div className="mb-3">
                          <Label className="text-[hsl(var(--text-primary))]">Simulate License Sale</Label>
                          <p className="text-xs text-[hsl(var(--text-secondary))] mt-1">See how payments will flow</p>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                          <Label className="text-sm text-[hsl(var(--text-secondary))]">License Price:</Label>
                          <Input
                            type="number"
                            value={100}
                            className="bg-white/5 border-white/10 max-w-[120px]"
                          />
                          <span className="text-sm text-[hsl(var(--text-secondary))]">IP</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-[hsl(var(--text-secondary))]">You:</span>
                            <span className="text-[hsl(var(--text-primary))] font-medium">70 IP</span>
                          </div>
                          {collaborators.slice(1).map((collab, i) => (
                            <div key={i} className="flex justify-between">
                              <span className="text-[hsl(var(--text-secondary))]">{collab.role}:</span>
                              <span className="text-[hsl(var(--text-primary))]">{collab.split * 0.7} IP</span>
                            </div>
                          ))}
                          {registrationType === "remix" && (
                            <div className="flex justify-between">
                              <span className="text-[hsl(var(--text-secondary))]">Parent IP:</span>
                              <span className="text-[hsl(var(--text-primary))]">20 IP</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Review & Register */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">Review & Register</h3>
                      <p className="text-sm text-white/70">Confirm your IP registration details</p>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <h4 className="text-sm font-medium text-white mb-3">Asset Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white/70">Type</span>
                            <span className="text-white">{registrationType === "new" ? "New IP" : "Remix IP"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Title</span>
                            <span className="text-white">{assetDetails.title || "—"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Category</span>
                            <span className="text-white capitalize">{assetDetails.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Collaborators</span>
                            <span className="text-white">{collaborators.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Royalty Policy</span>
                            <span className="text-white">{royaltyPolicy.type}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <h4 className="text-sm font-medium text-white mb-3">Cost Estimate</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white/70">Registration Fee</span>
                            <span className="text-white">{estimatedCost - 2} IP</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Estimated Gas</span>
                            <span className="text-white">2 IP</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-white/10">
                            <span className="font-medium text-white">Total Cost</span>
                            <span className="font-medium text-white">{estimatedCost} IP</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Your Balance</span>
                            <span className={hasEnoughGas ? "text-green-400" : "text-red-400"}>{ipBalance} IP</span>
                          </div>
                        </div>
                      </div>

                      {!hasEnoughGas && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-red-300 mb-1">Insufficient IP</p>
                              <p className="text-xs text-red-200/70 mb-3">
                                You need {estimatedCost} IP but have {ipBalance} IP
                              </p>
                              {currentNetwork.type === "testnet" && currentNetwork.faucetUrl && (
                                <a
                                  href={currentNetwork.faucetUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all text-sm"
                                >
                                  <Droplet className="w-4 h-4 text-blue-400" />
                                  <span className="text-blue-300 font-medium">Get 10 IP</span>
                                  <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-xs text-blue-200/70">
                          Registration writes to IPGraph precompile. All changes are immutably recorded on {currentNetwork.name}.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 p-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="border-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <div className="text-sm text-white/50">
                Step {currentStep} of {STEPS.length}
              </div>

              {currentStep < 5 ? (
                <Button
                  onClick={handleNext}
                  className="bg-primary hover:bg-primary/80"
                  disabled={
                    (currentStep === 2 && !assetDetails.title) ||
                    (currentStep === 3 && !splitIsValid)
                  }
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleRegister}
                  disabled={!hasEnoughGas}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Register IP
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
