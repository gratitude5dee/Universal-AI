import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, AlertCircle, CreditCard, Wallet, Building, Clock } from "lucide-react";
import { ComplianceBadge } from "../shared/ComplianceBadge";
import { useToast } from "@/hooks/use-toast";
import type { MarketplaceListing } from "@/types/rwa";

interface BuyModalProps {
  listing: MarketplaceListing;
  onClose: () => void;
}

type PurchaseStep = "amount" | "payment" | "kyc" | "confirm" | "processing" | "success";

export const BuyModal = ({ listing, onClose }: BuyModalProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<PurchaseStep>("amount");
  const [amount, setAmount] = useState(5000);
  const [paymentMethod, setPaymentMethod] = useState<"usdc" | "usdt" | "wire" | "ach">("usdc");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isKYCVerified] = useState(true); // Mock - would check real status

  const tokens = Math.floor(amount / listing.pricePerToken);
  const isFullyFunded = listing.fundingProgress >= 100;

  const paymentMethods = [
    { id: "usdc", name: "USDC", desc: "Instant (Ethereum/Polygon)", icon: Wallet },
    { id: "usdt", name: "USDT", desc: "Instant (Ethereum/Polygon)", icon: Wallet },
    { id: "wire", name: "Wire Transfer", desc: "2-3 days processing", icon: Building },
    { id: "ach", name: "ACH", desc: "3-5 days processing", icon: CreditCard },
  ];

  const handleConfirmPurchase = () => {
    setStep("processing");
    setTimeout(() => {
      setStep("success");
      toast({
        title: "Investment Successful! 🎉",
        description: `You've successfully invested $${amount.toLocaleString()} and received ${tokens.toLocaleString()} tokens.`,
      });
    }, 2000);
  };

  const renderStepContent = () => {
    switch (step) {
      case "amount":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="invest-amount" className="text-white">Investment Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">$</span>
                <Input
                  id="invest-amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  min={1000}
                  step={100}
                  className="pl-7 bg-white/5 border-white/10 text-white"
                />
              </div>
              <p className="text-xs text-white/50">Minimum: $1,000 | Maximum: $100,000</p>
            </div>

            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex justify-between mb-2">
                <span className="text-white/70">Tokens</span>
                <span className="text-white font-semibold">{tokens.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-white/70">Price per token</span>
                <span className="text-white">${listing.pricePerToken}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10">
                <span className="text-white font-semibold">Total</span>
                <span className="text-white font-bold">${amount.toLocaleString()}</span>
              </div>
            </div>

            <Button
              onClick={() => setStep("payment")}
              className="w-full bg-[#1E40AF] hover:bg-[#1E40AF]/90"
              disabled={amount < 1000}
            >
              Continue to Payment
            </Button>
          </div>
        );

      case "payment":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-white">Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-3 p-4 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <method.icon className="h-5 w-5 text-[#D4AF37]" />
                        <div>
                          <p className="text-white font-medium">{method.name}</p>
                          <p className="text-xs text-white/50">{method.desc}</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("amount")} className="flex-1 border-white/10 text-white">
                Back
              </Button>
              <Button onClick={() => setStep("kyc")} className="flex-1 bg-[#1E40AF] hover:bg-[#1E40AF]/90">
                Continue
              </Button>
            </div>
          </div>
        );

      case "kyc":
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-start gap-3">
                {isKYCVerified ? (
                  <div className="p-2 rounded-full bg-[#059669]/20">
                    <Check className="h-5 w-5 text-[#059669]" />
                  </div>
                ) : (
                  <div className="p-2 rounded-full bg-[#EA580C]/20">
                    <AlertCircle className="h-5 w-5 text-[#EA580C]" />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-1">KYC/Accreditation Status</h4>
                  {isKYCVerified ? (
                    <div className="space-y-2">
                      <ComplianceBadge status="verified" label="KYC Verified" />
                      <ComplianceBadge status="verified" label="Accredited Investor" />
                      <p className="text-sm text-white/70 mt-2">
                        ✓ Identity Verified (KYC Level 2)
                      </p>
                      <p className="text-sm text-white/70">
                        ✓ Accredited Investor Status Confirmed
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-white/70">
                        You need to complete KYC verification and accreditation before investing.
                      </p>
                      <Button variant="outline" className="border-white/10 text-white">
                        Complete KYC Now
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isKYCVerified && (
              <>
                <div className="p-4 rounded-lg bg-[#1E40AF]/10 border border-[#1E40AF]/20">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-[#1E40AF] mt-0.5" />
                    <p className="text-sm text-white/70">
                      This offering is limited to accredited investors under Regulation D (506c).
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep("payment")} className="flex-1 border-white/10 text-white">
                    Back
                  </Button>
                  <Button onClick={() => setStep("confirm")} className="flex-1 bg-[#1E40AF] hover:bg-[#1E40AF]/90">
                    Continue
                  </Button>
                </div>
              </>
            )}
          </div>
        );

      case "confirm":
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-white/5 border border-white/10 space-y-4">
              <h4 className="text-white font-semibold">Investment Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Asset</span>
                  <span className="text-white">{listing.asset.tokenName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Amount</span>
                  <span className="text-white font-semibold">${amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Tokens</span>
                  <span className="text-white">{tokens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Payment Method</span>
                  <span className="text-white uppercase">{paymentMethod}</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm text-white/70 cursor-pointer">
                I have read and agree to the{" "}
                <button className="text-[#1E40AF] hover:underline">Offering Memorandum</button>,{" "}
                <button className="text-[#1E40AF] hover:underline">Subscription Agreement</button>, and{" "}
                <button className="text-[#1E40AF] hover:underline">Risk Disclosures</button>.
              </Label>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("kyc")} className="flex-1 border-white/10 text-white">
                Back
              </Button>
              <Button
                onClick={handleConfirmPurchase}
                disabled={!termsAccepted}
                className="flex-1 bg-[#1E40AF] hover:bg-[#1E40AF]/90"
              >
                Confirm Investment
              </Button>
            </div>
          </div>
        );

      case "processing":
        return (
          <div className="py-12 text-center space-y-4">
            <div className="animate-spin h-12 w-12 border-4 border-[#1E40AF] border-t-transparent rounded-full mx-auto" />
            <div>
              <h4 className="text-white font-semibold mb-2">Processing Your Investment...</h4>
              <p className="text-sm text-white/70">
                {paymentMethod === "usdc" || paymentMethod === "usdt"
                  ? "Confirming blockchain transaction..."
                  : "Processing payment..."}
              </p>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="py-12 text-center space-y-6">
            <div className="p-4 rounded-full bg-[#059669]/20 w-fit mx-auto">
              <Check className="h-12 w-12 text-[#059669]" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-white mb-2">Investment Successful! 🎉</h4>
              <p className="text-white/70">
                You've successfully invested ${amount.toLocaleString()} and received {tokens.toLocaleString()} tokens.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Transaction Hash</span>
                <button className="text-[#1E40AF] hover:underline">0x7a8b...9c2d</button>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Expected First Distribution</span>
                <span className="text-white">December 2025</span>
              </div>
            </div>
            <Button onClick={onClose} className="w-full bg-[#1E40AF] hover:bg-[#1E40AF]/90">
              View My Portfolio
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#0F172A] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">
            {step === "success" ? "Investment Complete" : isFullyFunded ? "Buy on Secondary Market" : "Invest in Asset"}
          </DialogTitle>
          <p className="text-sm text-white/50 mt-2">
            {listing.asset.tokenName} • {listing.asset.tokenSymbol}
          </p>
        </DialogHeader>

        {step !== "processing" && step !== "success" && (
          <div className="flex items-center gap-2 mb-6">
            {["amount", "payment", "kyc", "confirm"].map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`flex-1 h-1 rounded-full ${
                  ["amount", "payment", "kyc", "confirm"].indexOf(step) >= i
                    ? "bg-[#1E40AF]"
                    : "bg-white/10"
                }`} />
              </div>
            ))}
          </div>
        )}

        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
};
