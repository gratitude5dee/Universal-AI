import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth as useAppAuth } from "@/context/AuthContext";
import { useEvmWallet } from "@/context/EvmWalletContext";
import { Button } from "@/components/ui/button";

function storageKey(userId: string, address: string) {
  return `uai_wallet_linked:${userId}:${address.toLowerCase()}`;
}

export function WalletLinkBanner() {
  const { user } = useAppAuth();
  const { address, signMessage } = useEvmWallet();
  const [isLinking, setIsLinking] = useState(false);
  const [isLinked, setIsLinked] = useState(false);

  useEffect(() => {
    if (!user?.id || !address) {
      setIsLinked(false);
      return;
    }
    try {
      setIsLinked(localStorage.getItem(storageKey(user.id, address)) === "true");
    } catch {
      setIsLinked(false);
    }
  }, [user?.id, address]);

  if (!user || !address || isLinked) return null;

  const linkWallet = async () => {
    setIsLinking(true);
    try {
      const start = await supabase.functions.invoke("wallet-link-start", {
        body: { walletAddress: address, walletType: "evm" },
      });
      if (start.error) throw start.error;
      const sessionId = (start.data as any)?.sessionId;
      const messageToSign = (start.data as any)?.messageToSign;
      if (!sessionId || !messageToSign) throw new Error("wallet-link-start returned an invalid payload");

      // Sign via our wallet abstraction (thirdweb/injected wallet).
      const signature = await signMessage(messageToSign);

      const complete = await supabase.functions.invoke("wallet-link-complete", {
        body: { sessionId, walletAddress: address, signature },
      });
      if (complete.error) throw complete.error;

      try {
        localStorage.setItem(storageKey(user.id, address), "true");
        setIsLinked(true);
      } catch {
        // ignore
      }

      toast.success("Wallet linked to your profile");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to link wallet");
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 flex items-center justify-between gap-4">
      <div className="text-sm text-white/80">
        <div className="font-medium text-white">Link your wallet to UniversalAI</div>
        <div className="text-white/60">This enables secure on-chain actions tied to your Supabase account.</div>
      </div>
      <Button onClick={linkWallet} disabled={isLinking} className="bg-studio-accent hover:bg-studio-accent/90">
        {isLinking ? "Linking..." : "Link Wallet"}
      </Button>
    </div>
  );
}
