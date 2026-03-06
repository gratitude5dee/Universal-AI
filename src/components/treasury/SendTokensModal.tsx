import React, { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useEvmWallet } from "@/context/EvmWalletContext";
import { useWeb3 } from "@/context/Web3Context";
import { useAuth as useAppAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { createIdempotencyKey } from "@/lib/web3/idempotency";

type AssetKind = "native" | "usdc";

const MAX_NATIVE_SEND = 1; // simple guardrail (can be made configurable)

export function SendTokensModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { address, chainId, chainMeta, sendNative, sendErc20 } = useEvmWallet();
  const { config, writesEnabled } = useWeb3();
  const { user } = useAppAuth();

  const [asset, setAsset] = useState<AssetKind>("native");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const usdcAddress = useMemo(() => {
    if (!chainId) return null;
    const cfg = config.paymentTokensByChainId?.[chainId]?.usdc ?? null;
    if (cfg) return cfg;
    if (chainId === 1) return "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
    if (chainId === 8453) return "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
    if (chainId === 137) return "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
    return null;
  }, [chainId, config.paymentTokensByChainId]);

  const validate = (): string | null => {
    if (!writesEnabled) return "Web3 writes are disabled (set VITE_ENABLE_WEB3_WRITES=true)";
    if (!user) return "Sign in required to send and persist transactions";
    if (!address) return "Connect your wallet first";
    if (!chainId) return "Unknown chain";
    if (!to.trim()) return "Destination address is required";
    if (!amount.trim()) return "Amount is required";
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) return "Amount must be a positive number";
    if (asset === "native" && amt > MAX_NATIVE_SEND) return `Max native send per tx is ${MAX_NATIVE_SEND}`;
    if (asset === "usdc" && !usdcAddress) return "USDC not configured for this chain";
    if (confirmText.trim().toUpperCase() !== "SEND") return 'Type "SEND" to confirm';
    return null;
  };

  const submit = async () => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    setIsSending(true);
    try {
      const idempotencyKey = await createIdempotencyKey({
        action: "send",
        userId: user!.id,
        from: address!,
        to: to.trim(),
        amount: amount.trim(),
        chainId,
        asset,
      });

      const insertRes = await supabase
        .from("wallet_transactions")
        .insert({
          user_id: user!.id,
          wallet_address: address!,
          transaction_type: asset === "native" ? "send_native" : "send_erc20",
          amount: Number(amount),
          asset_symbol: asset === "native" ? (chainMeta?.nativeSymbol ?? "NATIVE") : "USDC",
          status: "prepared",
          transaction_hash: null,
          metadata: {
            idempotencyKey,
            to: to.trim(),
            chainId,
            asset,
            tokenAddress: asset === "usdc" ? usdcAddress : undefined,
          },
        } as any)
        .select("id")
        .single();

      const rowId = (insertRes.data as any)?.id ?? null;

      let txHash: string;
      if (asset === "native") {
        txHash = await sendNative({ to: to.trim(), amount: amount.trim() });
      } else {
        txHash = await sendErc20({
          tokenAddress: usdcAddress!,
          to: to.trim(),
          amount: amount.trim(),
          decimals: 6,
        });
      }

      if (rowId) {
        await supabase
          .from("wallet_transactions")
          .update({ status: "submitted", transaction_hash: txHash })
          .eq("id", rowId);
      }

      toast.success("Transaction submitted", { description: txHash });
      onOpenChange(false);
      setTo("");
      setAmount("");
      setConfirmText("");
    } catch (e: any) {
      toast.error(e?.message ?? "Send failed");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Tokens</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Asset</Label>
            <Select value={asset} onValueChange={(v: any) => setAsset(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="native">{chainMeta?.nativeSymbol ?? "Native"}</SelectItem>
                <SelectItem value="usdc">USDC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>To</Label>
            <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="0x..." />
          </div>

          <div className="space-y-2">
            <Label>Amount</Label>
            <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.01" />
          </div>

          <div className="space-y-2">
            <Label>Confirmation</Label>
            <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder='Type "SEND"' />
          </div>

          <Button onClick={submit} disabled={isSending} className="w-full bg-studio-accent hover:bg-studio-accent/90">
            {isSending ? "Sending..." : "Send"}
          </Button>

          <p className="text-xs text-muted-foreground">
            Guardrails: max {MAX_NATIVE_SEND} native per tx, idempotency key pre-written, and confirmation required.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
