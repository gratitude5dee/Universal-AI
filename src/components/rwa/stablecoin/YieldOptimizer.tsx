import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, TrendingUp } from "lucide-react";
import { StatsCard } from "../shared/StatsCard";

export const YieldOptimizer = () => {
  const [step, setStep] = useState(1);
  const [riskTolerance, setRiskTolerance] = useState<"conservative" | "moderate" | "aggressive">(
    "moderate"
  );
  const [liquidityNeeds, setLiquidityNeeds] = useState(20);
  const [selectedChains, setSelectedChains] = useState({
    ethereum: true,
    polygon: true,
    arbitrum: true,
    optimism: false,
    base: false,
  });

  const idleBalance = 47530; // $47,530 in idle stablecoins
  const optimizableAmount = idleBalance * (1 - liquidityNeeds / 100);
  const lostYield = idleBalance * 0.08; // 8% avg yield missed

  const recommendedAllocation = {
    USD1: { percent: 35, apy: 8.2, amount: optimizableAmount * 0.35 },
    AaveUSDC: { percent: 30, apy: 4.5, amount: optimizableAmount * 0.3 },
    Curve3Pool: { percent: 20, apy: 6.8, amount: optimizableAmount * 0.2 },
    "$5DEE": { percent: 15, apy: 12.5, amount: optimizableAmount * 0.15 },
  };

  const weightedAPY =
    (recommendedAllocation.USD1.apy * recommendedAllocation.USD1.percent +
      recommendedAllocation.AaveUSDC.apy * recommendedAllocation.AaveUSDC.percent +
      recommendedAllocation.Curve3Pool.apy * recommendedAllocation.Curve3Pool.percent +
      recommendedAllocation["$5DEE"].apy * recommendedAllocation["$5DEE"].percent) /
    100;

  const expectedAnnualReturn = (optimizableAmount * weightedAPY) / 100;

  const getRiskColor = (risk: string) => {
    if (risk === "conservative") return "text-success";
    if (risk === "moderate") return "text-warning";
    return "text-destructive";
  };

  const getRiskAPY = (risk: string) => {
    if (risk === "conservative") return "4-6%";
    if (risk === "moderate") return "6-10%";
    return "10-15%";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Stablecoin Yield Optimizer</h2>
        <p className="text-white/70 text-sm mt-1">
          Automatically convert your idle stablecoins into yield-earning assets
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-4">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                s === step
                  ? "bg-primary text-white"
                  : s < step
                  ? "bg-success text-white"
                  : "bg-white/10 text-white/50"
              }`}
            >
              {s < step ? "✓" : s}
            </div>
            {s < 4 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  s < step ? "bg-success" : "bg-white/10"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Current Holdings */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">
              Your Current Holdings
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Idle Stablecoins (0% yield):</span>
              </div>
              <div className="space-y-2 pl-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white">• 45,230 USDC</span>
                  <span className="text-white">$45,230</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white">• 2,300 DAI</span>
                  <span className="text-white">$2,300</span>
                </div>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-white font-semibold">Total Idle:</span>
                <span className="text-white font-bold text-xl">
                  ${idleBalance.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-destructive">
                <span>Lost Yield:</span>
                <span className="font-semibold">
                  ~${lostYield.toLocaleString()}/year (8% avg)
                </span>
              </div>
            </div>
          </div>

          <Button onClick={() => setStep(2)} className="w-full" size="lg">
            Continue to Optimization
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Step 2: Risk & Liquidity */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-xl border border-white/10 space-y-6">
            <div>
              <Label className="text-white font-medium mb-3 block">Risk Tolerance</Label>
              <RadioGroup
                value={riskTolerance}
                onValueChange={(v) => setRiskTolerance(v as any)}
              >
                <div
                  className={`p-4 rounded-lg border ${
                    riskTolerance === "conservative"
                      ? "border-success bg-success/10"
                      : "border-white/10 bg-white/5"
                  } cursor-pointer`}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="conservative" id="risk-conservative" />
                    <Label
                      htmlFor="risk-conservative"
                      className="text-white cursor-pointer flex-1"
                    >
                      <div className="flex items-center justify-between">
                        <span>Conservative (4-6% APY)</span>
                        <span className="text-success text-sm">Low Risk</span>
                      </div>
                      <p className="text-xs text-white/60 mt-1">
                        Only T-Bill backed stablecoins
                      </p>
                    </Label>
                  </div>
                </div>
                <div
                  className={`p-4 rounded-lg border ${
                    riskTolerance === "moderate"
                      ? "border-warning bg-warning/10"
                      : "border-white/10 bg-white/5"
                  } cursor-pointer`}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="risk-moderate" />
                    <Label
                      htmlFor="risk-moderate"
                      className="text-white cursor-pointer flex-1"
                    >
                      <div className="flex items-center justify-between">
                        <span>Moderate (6-10% APY)</span>
                        <span className="text-warning text-sm">Medium Risk</span>
                      </div>
                      <p className="text-xs text-white/60 mt-1">
                        Mix of backed stables + DeFi yield
                      </p>
                    </Label>
                  </div>
                </div>
                <div
                  className={`p-4 rounded-lg border ${
                    riskTolerance === "aggressive"
                      ? "border-destructive bg-destructive/10"
                      : "border-white/10 bg-white/5"
                  } cursor-pointer`}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="aggressive" id="risk-aggressive" />
                    <Label
                      htmlFor="risk-aggressive"
                      className="text-white cursor-pointer flex-1"
                    >
                      <div className="flex items-center justify-between">
                        <span>Aggressive (10-15% APY)</span>
                        <span className="text-destructive text-sm">Higher Risk</span>
                      </div>
                      <p className="text-xs text-white/60 mt-1">Higher DeFi exposure</p>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-white font-medium mb-3 block">Liquidity Needs</Label>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-white/70 text-sm">Keep liquid:</span>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={liquidityNeeds}
                    onChange={(e) => setLiquidityNeeds(parseInt(e.target.value) || 0)}
                    className="w-24 bg-white/5 border-white/10"
                  />
                  <span className="text-white/70">%</span>
                  <span className="text-white">
                    (${((idleBalance * liquidityNeeds) / 100).toLocaleString()})
                  </span>
                </div>
                <Progress value={liquidityNeeds} className="h-2" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Can optimize: {100 - liquidityNeeds}%</span>
                  <span className="text-white font-medium">
                    ${optimizableAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-white font-medium mb-3 block">Preferred Chains</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="chain-ethereum"
                    checked={selectedChains.ethereum}
                    onCheckedChange={(checked) =>
                      setSelectedChains({ ...selectedChains, ethereum: !!checked })
                    }
                  />
                  <Label htmlFor="chain-ethereum" className="text-white cursor-pointer">
                    Ethereum (highest security, higher gas)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="chain-polygon"
                    checked={selectedChains.polygon}
                    onCheckedChange={(checked) =>
                      setSelectedChains({ ...selectedChains, polygon: !!checked })
                    }
                  />
                  <Label htmlFor="chain-polygon" className="text-white cursor-pointer">
                    Polygon (low fees, good yields)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="chain-arbitrum"
                    checked={selectedChains.arbitrum}
                    onCheckedChange={(checked) =>
                      setSelectedChains({ ...selectedChains, arbitrum: !!checked })
                    }
                  />
                  <Label htmlFor="chain-arbitrum" className="text-white cursor-pointer">
                    Arbitrum (L2 security + low fees)
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={() => setStep(3)} className="flex-1">
              View Recommendations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Recommended Allocation */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">
              Recommended Allocation
            </h3>
            <p className="text-white/70 text-sm mb-6">
              Based on "{riskTolerance}" risk + {100 - liquidityNeeds}% optimization
            </p>

            <div className="space-y-4">
              {/* USD1 */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">
                    1. USD1 ({recommendedAllocation.USD1.percent}%)
                  </h4>
                  <span className="text-white font-bold">
                    ${recommendedAllocation.USD1.amount.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-white/70 space-y-1">
                  <div>• Yield: {recommendedAllocation.USD1.apy}% APY</div>
                  <div>
                    • Expected: $
                    {((recommendedAllocation.USD1.amount *
                      recommendedAllocation.USD1.apy) /
                      100).toFixed(0)}
                    /year
                  </div>
                  <div>• Risk: Very Low (T-Bill backed)</div>
                </div>
              </div>

              {/* Aave USDC */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">
                    2. Aave USDC ({recommendedAllocation.AaveUSDC.percent}%)
                  </h4>
                  <span className="text-white font-bold">
                    ${recommendedAllocation.AaveUSDC.amount.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-white/70 space-y-1">
                  <div>• Yield: {recommendedAllocation.AaveUSDC.apy}% APY</div>
                  <div>
                    • Expected: $
                    {((recommendedAllocation.AaveUSDC.amount *
                      recommendedAllocation.AaveUSDC.apy) /
                      100).toFixed(0)}
                    /year
                  </div>
                  <div>• Risk: Low (battle-tested protocol)</div>
                </div>
              </div>

              {/* Curve 3Pool */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">
                    3. Curve 3Pool LP ({recommendedAllocation.Curve3Pool.percent}%)
                  </h4>
                  <span className="text-white font-bold">
                    ${recommendedAllocation.Curve3Pool.amount.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-white/70 space-y-1">
                  <div>
                    • Yield: {recommendedAllocation.Curve3Pool.apy}% APY + CRV rewards
                  </div>
                  <div>
                    • Expected: $
                    {((recommendedAllocation.Curve3Pool.amount *
                      recommendedAllocation.Curve3Pool.apy) /
                      100).toFixed(0)}
                    /year
                  </div>
                  <div>• Risk: Low-Medium (IL risk minimal for stables)</div>
                </div>
              </div>

              {/* $5DEE */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">
                    4. $5DEE ({recommendedAllocation["$5DEE"].percent}%)
                  </h4>
                  <span className="text-white font-bold">
                    ${recommendedAllocation["$5DEE"].amount.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-white/70 space-y-1">
                  <div>• Yield: {recommendedAllocation["$5DEE"].apy}% APY</div>
                  <div>
                    • Expected: $
                    {((recommendedAllocation["$5DEE"].amount *
                      recommendedAllocation["$5DEE"].apy) /
                      100).toFixed(0)}
                    /year
                  </div>
                  <div>• Risk: Medium (newer protocol)</div>
                </div>
              </div>

              {/* Keep Liquid */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">
                    Keep Liquid ({liquidityNeeds}%)
                  </h4>
                  <span className="text-white font-bold">
                    ${((idleBalance * liquidityNeeds) / 100).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-white/70 space-y-1">
                  <div>• Yield: 0%</div>
                  <div>• For: Immediate withdrawals, swaps, purchases</div>
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/20 to-purple-600/20 border border-primary/30">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Total Optimized:</span>
                    <span className="text-white font-bold">
                      ${optimizableAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Weighted APY:</span>
                    <span className="text-success font-bold text-xl">
                      {weightedAPY.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Expected Annual:</span>
                    <span className="text-white font-bold">
                      ${expectedAnnualReturn.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-success">
                    <span>vs Current (0%):</span>
                    <span className="font-bold">
                      +${expectedAnnualReturn.toLocaleString()}/year 💰
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button onClick={() => setStep(4)} className="flex-1">
              View Execution Plan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Execution Plan */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Execution Plan</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Transactions Required:</span>
                <span className="text-white font-medium">4</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Total Gas Cost:</span>
                <span className="text-white font-medium">~$8.50 (Ethereum + Polygon)</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Time to Execute:</span>
                <span className="text-white font-medium">~2-3 minutes</span>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <h4 className="text-white font-medium">Breakdown:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">
                      1. Swap {recommendedAllocation.USD1.amount.toLocaleString()} USDC → USD1
                    </span>
                    <span className="text-white/50">$2.50 gas</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">
                      2. Deposit {recommendedAllocation.AaveUSDC.amount.toLocaleString()} USDC →
                      Aave
                    </span>
                    <span className="text-white/50">$3.20 gas</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">
                      3. Add {recommendedAllocation.Curve3Pool.amount.toLocaleString()} USDC →
                      Curve
                    </span>
                    <span className="text-white/50">$1.80 gas</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">
                      4. Swap {recommendedAllocation["$5DEE"].amount.toLocaleString()} USDC →
                      $5DEE
                    </span>
                    <span className="text-white/50">$1.00 gas</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <Checkbox id="understand-risks" />
                  <Label htmlFor="understand-risks" className="text-white cursor-pointer">
                    I understand risks and projected yields are estimates
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="can-withdraw" />
                  <Label htmlFor="can-withdraw" className="text-white cursor-pointer">
                    I can withdraw funds anytime (some may have unbonding)
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(3)}>
              Back
            </Button>
            <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
              Customize Allocation
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-primary to-purple-600">
              <TrendingUp className="mr-2 h-4 w-4" />
              EXECUTE OPTIMIZATION
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
