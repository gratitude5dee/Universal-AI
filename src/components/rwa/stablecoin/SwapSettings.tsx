import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface SwapSettingsProps {
  onClose: () => void;
}

export const SwapSettings = ({ onClose }: SwapSettingsProps) => {
  const [slippage, setSlippage] = useState<"0.1" | "0.5" | "1.0" | "custom">("0.1");
  const [customSlippage, setCustomSlippage] = useState("0.15");
  const [txSpeed, setTxSpeed] = useState<"standard" | "fast" | "instant">("standard");
  const [useMultipleDEXes, setUseMultipleDEXes] = useState(true);
  const [allowSplitRoutes, setAllowSplitRoutes] = useState(true);
  const [prioritize, setPrioritize] = useState<"best-price" | "fastest" | "balanced">("balanced");
  const [useGasTokens, setUseGasTokens] = useState(false);
  const [batchTx, setBatchTx] = useState(true);
  const [mevProtection, setMevProtection] = useState(false);
  const [expertMode, setExpertMode] = useState(false);

  const handleSave = () => {
    // Save settings to localStorage or context
    localStorage.setItem(
      "swapSettings",
      JSON.stringify({
        slippage: slippage === "custom" ? parseFloat(customSlippage) : parseFloat(slippage),
        txSpeed,
        useMultipleDEXes,
        allowSplitRoutes,
        prioritize,
        useGasTokens,
        batchTx,
        mevProtection,
        expertMode,
      })
    );
    onClose();
  };

  const handleReset = () => {
    setSlippage("0.1");
    setCustomSlippage("0.15");
    setTxSpeed("standard");
    setUseMultipleDEXes(true);
    setAllowSplitRoutes(true);
    setPrioritize("balanced");
    setUseGasTokens(false);
    setBatchTx(true);
    setMevProtection(false);
    setExpertMode(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-900 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">Swap Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Slippage Tolerance */}
          <div className="space-y-3">
            <Label className="text-white font-medium">Slippage Tolerance</Label>
            <p className="text-sm text-white/60">
              Maximum price slippage you're willing to accept
            </p>
            <RadioGroup value={slippage} onValueChange={(v) => setSlippage(v as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0.1" id="slippage-0.1" />
                <Label htmlFor="slippage-0.1" className="text-white cursor-pointer">
                  0.1% (Recommended for stablecoins)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0.5" id="slippage-0.5" />
                <Label htmlFor="slippage-0.5" className="text-white cursor-pointer">
                  0.5%
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1.0" id="slippage-1.0" />
                <Label htmlFor="slippage-1.0" className="text-white cursor-pointer">
                  1.0%
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="slippage-custom" />
                <Label htmlFor="slippage-custom" className="text-white cursor-pointer">
                  Custom:
                </Label>
                <Input
                  type="number"
                  min="0.01"
                  max="50"
                  step="0.01"
                  value={customSlippage}
                  onChange={(e) => {
                    setCustomSlippage(e.target.value);
                    setSlippage("custom");
                  }}
                  className="w-24 bg-white/5 border-white/10"
                />
                <span className="text-white/70">%</span>
              </div>
            </RadioGroup>
            <p className="text-xs text-white/50">
              💡 Lower slippage = higher chance of failed transaction. Higher slippage = more cost
              but better execution rate.
            </p>
          </div>

          {/* Transaction Speed */}
          <div className="space-y-3">
            <Label className="text-white font-medium">Transaction Speed</Label>
            <RadioGroup value={txSpeed} onValueChange={(v) => setTxSpeed(v as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="speed-standard" />
                <Label htmlFor="speed-standard" className="text-white cursor-pointer">
                  Standard (5-15 sec) - Normal gas price
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fast" id="speed-fast" />
                <Label htmlFor="speed-fast" className="text-white cursor-pointer">
                  Fast (1-5 sec) - 20% higher gas
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="instant" id="speed-instant" />
                <Label htmlFor="speed-instant" className="text-white cursor-pointer">
                  Instant (&lt;1 sec) - 50% higher gas [For large swaps]
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Routing Preferences */}
          <div className="space-y-3">
            <Label className="text-white font-medium">Routing Preferences</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="multiple-dexes"
                  checked={useMultipleDEXes}
                  onCheckedChange={(checked) => setUseMultipleDEXes(!!checked)}
                />
                <Label htmlFor="multiple-dexes" className="text-white cursor-pointer">
                  Use multiple DEXes for best price
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="split-routes"
                  checked={allowSplitRoutes}
                  onCheckedChange={(checked) => setAllowSplitRoutes(!!checked)}
                />
                <Label htmlFor="split-routes" className="text-white cursor-pointer">
                  Allow split routes (if better pricing)
                </Label>
              </div>
            </div>
            <div className="mt-3">
              <Label className="text-white/70 text-sm">Prioritize:</Label>
              <RadioGroup value={prioritize} onValueChange={(v) => setPrioritize(v as any)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="best-price" id="priority-price" />
                  <Label htmlFor="priority-price" className="text-white cursor-pointer">
                    Best Price (may take longer to find route)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fastest" id="priority-fast" />
                  <Label htmlFor="priority-fast" className="text-white cursor-pointer">
                    Fastest Execution (accept slightly worse price)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="balanced" id="priority-balanced" />
                  <Label htmlFor="priority-balanced" className="text-white cursor-pointer">
                    Balanced (default)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Gas Optimization */}
          <div className="space-y-3">
            <Label className="text-white font-medium">Gas Optimization</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gas-tokens"
                  checked={useGasTokens}
                  onCheckedChange={(checked) => setUseGasTokens(!!checked)}
                />
                <Label htmlFor="gas-tokens" className="text-white cursor-pointer">
                  Use gas tokens when available (e.g., CHI, GST2)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="batch-tx"
                  checked={batchTx}
                  onCheckedChange={(checked) => setBatchTx(!!checked)}
                />
                <Label htmlFor="batch-tx" className="text-white cursor-pointer">
                  Batch transactions when possible
                </Label>
              </div>
            </div>
          </div>

          {/* Advanced */}
          <div className="space-y-3">
            <Label className="text-white font-medium">Advanced</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="expert-mode"
                  checked={expertMode}
                  onCheckedChange={(checked) => setExpertMode(!!checked)}
                />
                <Label htmlFor="expert-mode" className="text-white cursor-pointer">
                  Expert Mode (disable safety checks)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mev-protection"
                  checked={mevProtection}
                  onCheckedChange={(checked) => setMevProtection(!!checked)}
                />
                <Label htmlFor="mev-protection" className="text-white cursor-pointer">
                  Enable MEV protection (Flashbots)
                </Label>
              </div>
            </div>
            {expertMode && (
              <p className="text-xs text-warning">
                ⚠️ Warning: Expert mode disables important safety checks. Only enable if you know
                what you're doing.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button variant="outline" onClick={handleReset}>
              Reset to Defaults
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
