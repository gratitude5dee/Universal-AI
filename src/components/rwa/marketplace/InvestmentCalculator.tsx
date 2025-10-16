import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp } from "lucide-react";
import type { MarketplaceListing } from "@/types/rwa";

interface InvestmentCalculatorProps {
  listing: MarketplaceListing;
  onInvest: () => void;
}

export const InvestmentCalculator = ({ listing, onInvest }: InvestmentCalculatorProps) => {
  const [amount, setAmount] = useState(5000);
  
  const tokens = Math.floor(amount / listing.pricePerToken);
  const yearlyYield = listing.financialDetails?.currentYield || 0;
  const annualReturn = amount * (yearlyYield / 100);
  const monthlyReturn = annualReturn / 12;
  const appreciationRate = 1.6; // 1.6% appreciation
  const appreciationAmount = amount * (appreciationRate / 100);
  const totalAnnualReturn = annualReturn + appreciationAmount;
  const totalReturnPercentage = (totalAnnualReturn / amount) * 100;

  // 5-year projection
  const fiveYearDistributions = annualReturn * 5;
  const fiveYearAppreciation = amount * Math.pow(1 + appreciationRate/100, 5) - amount;
  const fiveYearTotal = amount + fiveYearDistributions + fiveYearAppreciation;
  const fiveYearROI = ((fiveYearTotal - amount) / amount) * 100;

  const isFullyFunded = listing.fundingProgress >= 100;

  return (
    <Card className="glass-card p-6 rounded-xl space-y-6 border-white/10">
      <div className="flex items-center gap-2 text-[#D4AF37]">
        <Calculator className="h-5 w-5" />
        <h3 className="font-semibold text-white">Investment Calculator</h3>
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-white/70">Investment Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">$</span>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min={1000}
            step={100}
            className="pl-7 bg-white/5 border-white/10 text-white"
          />
        </div>
        <div className="flex justify-between text-xs text-white/50">
          <span>Min: $1,000</span>
          <button
            onClick={() => setAmount(1000)}
            className="text-[#1E40AF] hover:underline"
          >
            Set Min
          </button>
        </div>
      </div>

      {/* Tokens Received */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <p className="text-sm text-white/70 mb-1">You will receive</p>
        <p className="text-2xl font-bold text-white">
          {tokens.toLocaleString()} tokens
        </p>
        <p className="text-xs text-white/50 mt-1">
          @ ${listing.pricePerToken}/token
        </p>
      </div>

      {/* Expected Returns */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-white">
          <TrendingUp className="h-4 w-4 text-[#059669]" />
          <span className="font-semibold">Expected Returns (per year)</span>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/70">Distribution Income</span>
            <span className="text-white font-semibold">
              ${annualReturn.toFixed(0)} ({yearlyYield.toFixed(1)}% yield)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Appreciation (est)</span>
            <span className="text-white font-semibold">
              ${appreciationAmount.toFixed(0)} ({appreciationRate}%)
            </span>
          </div>
          <div className="border-t border-white/10 pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span className="text-white">Total Expected Return</span>
              <span className="text-[#059669]">
                ${totalAnnualReturn.toFixed(0)} ({totalReturnPercentage.toFixed(1)}% total)
              </span>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#059669]/10 border border-[#059669]/20">
          <p className="text-xs text-white/70 mb-1">Monthly Distribution</p>
          <p className="text-lg font-bold text-[#059669]">
            ${monthlyReturn.toFixed(2)}
          </p>
        </div>
      </div>

      {/* 5-Year Projection */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2">
        <p className="font-semibold text-white">5-Year Projection</p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between text-white/70">
            <span>Total Distributions</span>
            <span className="text-white">${fiveYearDistributions.toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-white/70">
            <span>Property Appreciation</span>
            <span className="text-white">${fiveYearAppreciation.toFixed(0)}</span>
          </div>
          <div className="border-t border-white/10 pt-1 mt-1">
            <div className="flex justify-between font-semibold">
              <span className="text-white">Total Value</span>
              <span className="text-[#059669]">${fiveYearTotal.toFixed(0)}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Total ROI</span>
            <span className="text-[#059669] font-semibold">+{fiveYearROI.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="space-y-2">
        <Button
          onClick={onInvest}
          className="w-full bg-[#1E40AF] hover:bg-[#1E40AF]/90 text-white font-semibold"
          size="lg"
        >
          🚀 {isFullyFunded ? "Buy on Secondary Market" : "INVEST NOW"}
        </Button>
        <Button
          variant="outline"
          className="w-full border-white/10 text-white hover:bg-white/5"
        >
          Add to Watchlist
        </Button>
      </div>

      <p className="text-xs text-white/50 text-center">
        Projections are estimates only. Past performance does not guarantee future results.
      </p>
    </Card>
  );
};
