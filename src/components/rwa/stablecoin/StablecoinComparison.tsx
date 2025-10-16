import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockStablecoins } from "@/data/rwa/mockData";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";

interface StablecoinComparisonProps {
  onClose: () => void;
}

export const StablecoinComparison = ({ onClose }: StablecoinComparisonProps) => {
  const [sortBy, setSortBy] = useState<"yield" | "marketCap" | "volume">("yield");
  const [sortDesc, setSortDesc] = useState(true);
  const [minYield, setMinYield] = useState(0);
  const [filterTypes, setFilterTypes] = useState({
    fiat: true,
    algorithmic: true,
    yieldBearing: true,
  });

  const filteredStables = mockStablecoins
    .filter((s) => {
      if (!filterTypes.fiat && s.type === "fiat-backed") return false;
      if (!filterTypes.algorithmic && s.type === "algorithmic") return false;
      if (!filterTypes.yieldBearing && s.type === "yield-bearing") return false;
      if ((s.currentYield || 0) < minYield) return false;
      return true;
    })
    .sort((a, b) => {
      const mult = sortDesc ? -1 : 1;
      if (sortBy === "yield") {
        return ((b.currentYield || 0) - (a.currentYield || 0)) * mult;
      } else if (sortBy === "marketCap") {
        return (b.marketCap - a.marketCap) * mult;
      } else {
        return (b.dailyVolume - a.dailyVolume) * mult;
      }
    });

  const getRiskBadge = (type: string, yield_: number) => {
    if (yield_ > 10) return <Badge variant="destructive">High Risk</Badge>;
    if (yield_ > 5) return <Badge className="bg-warning/20 text-warning border-warning/30">Medium</Badge>;
    if (type === "fiat-backed") return <Badge className="bg-success/20 text-success border-success/30">Very Low</Badge>;
    return <Badge variant="outline">Low</Badge>;
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-900 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">Stablecoin Comparison</DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="space-y-4 p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-2">
              <Label className="text-white/70">Type</Label>
              <div className="flex gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="fiat"
                    checked={filterTypes.fiat}
                    onCheckedChange={(checked) =>
                      setFilterTypes({ ...filterTypes, fiat: !!checked })
                    }
                  />
                  <Label htmlFor="fiat" className="text-white cursor-pointer">
                    Fiat-Backed
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="algo"
                    checked={filterTypes.algorithmic}
                    onCheckedChange={(checked) =>
                      setFilterTypes({ ...filterTypes, algorithmic: !!checked })
                    }
                  />
                  <Label htmlFor="algo" className="text-white cursor-pointer">
                    Algorithmic
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="yield"
                    checked={filterTypes.yieldBearing}
                    onCheckedChange={(checked) =>
                      setFilterTypes({ ...filterTypes, yieldBearing: !!checked })
                    }
                  />
                  <Label htmlFor="yield" className="text-white cursor-pointer">
                    Yield-Bearing
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/70">Min Yield</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={minYield}
                  onChange={(e) => setMinYield(parseFloat(e.target.value) || 0)}
                  className="w-24 bg-white/5 border-white/10"
                />
                <span className="text-white/70">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/70">Sort By</Label>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                <SelectTrigger className="w-[180px] bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yield">Yield (APY)</SelectItem>
                  <SelectItem value="marketCap">Market Cap</SelectItem>
                  <SelectItem value="volume">Daily Volume</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortDesc(!sortDesc)}
              className="mt-auto"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-white/70 font-medium p-3">Coin</th>
                <th className="text-left text-white/70 font-medium p-3">Type</th>
                <th className="text-right text-white/70 font-medium p-3">Yield</th>
                <th className="text-right text-white/70 font-medium p-3">Market Cap</th>
                <th className="text-left text-white/70 font-medium p-3">Chains</th>
                <th className="text-left text-white/70 font-medium p-3">Risk</th>
                <th className="text-right text-white/70 font-medium p-3">Liquidity</th>
                <th className="text-center text-white/70 font-medium p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStables.map((stable) => (
                <tr
                  key={stable.symbol}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{stable.symbol}</span>
                      {stable.isNew && (
                        <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                          NEW
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-white/50">{stable.name}</div>
                  </td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-xs">
                      {stable.type === "fiat-backed"
                        ? "Fiat"
                        : stable.type === "algorithmic"
                        ? "Algo"
                        : "Yield"}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    {stable.currentYield ? (
                      <span className="text-success font-semibold">
                        {stable.currentYield.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-white/50">0%</span>
                    )}
                  </td>
                  <td className="p-3 text-right text-white">
                    ${(stable.marketCap / 1_000_000_000).toFixed(1)}B
                  </td>
                  <td className="p-3">
                    <span className="text-white/70 text-sm">{stable.chains.length}</span>
                  </td>
                  <td className="p-3">
                    {getRiskBadge(stable.type, stable.currentYield || 0)}
                  </td>
                  <td className="p-3 text-right text-white">
                    ${(stable.dailyVolume / 1_000_000).toFixed(0)}M
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center gap-1">
                      <Button size="sm" variant="ghost" className="text-xs h-7">
                        Add
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs h-7">
                        Swap
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Export */}
        <div className="flex justify-end gap-3">
          <Button variant="outline">Export CSV</Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
