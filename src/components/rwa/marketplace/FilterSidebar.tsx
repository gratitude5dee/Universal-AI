import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

interface FilterSidebarProps {
  onClose: () => void;
}

export const FilterSidebar = ({ onClose }: FilterSidebarProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0F172A] border-l border-white/10 p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Filters</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Yield Range */}
          <div className="space-y-3">
            <Label className="text-white">Yield Range (APY)</Label>
            <Slider defaultValue={[5, 15]} max={20} step={1} className="w-full" />
            <div className="flex justify-between text-sm text-white/70">
              <span>5%</span>
              <span>15%</span>
            </div>
          </div>

          {/* Risk Level */}
          <div className="space-y-3">
            <Label className="text-white">Risk Level</Label>
            <div className="space-y-2">
              {["Low", "Medium", "High"].map((risk) => (
                <div key={risk} className="flex items-center gap-2">
                  <Checkbox id={`risk-${risk}`} />
                  <Label htmlFor={`risk-${risk}`} className="text-white/70 cursor-pointer">
                    {risk}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Min Investment */}
          <div className="space-y-3">
            <Label className="text-white">Min Investment</Label>
            <Slider defaultValue={[1000]} max={100000} step={1000} className="w-full" />
            <div className="flex justify-between text-sm text-white/70">
              <span>$1K</span>
              <span>$100K</span>
            </div>
          </div>

          {/* Liquidity */}
          <div className="space-y-3">
            <Label className="text-white">Liquidity</Label>
            <div className="space-y-2">
              {["High", "Medium", "Low"].map((liquidity) => (
                <div key={liquidity} className="flex items-center gap-2">
                  <Checkbox id={`liquidity-${liquidity}`} />
                  <Label htmlFor={`liquidity-${liquidity}`} className="text-white/70 cursor-pointer">
                    {liquidity}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-3">
            <Label className="text-white">Status</Label>
            <div className="space-y-2">
              {["Primary Offering", "Secondary Market"].map((status) => (
                <div key={status} className="flex items-center gap-2">
                  <Checkbox id={`status-${status}`} />
                  <Label htmlFor={`status-${status}`} className="text-white/70 cursor-pointer">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-6 border-t border-white/10">
            <Button variant="outline" onClick={onClose} className="flex-1 border-white/10 text-white">
              Clear All
            </Button>
            <Button onClick={onClose} className="flex-1 bg-[#1E40AF] hover:bg-[#1E40AF]/90">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
