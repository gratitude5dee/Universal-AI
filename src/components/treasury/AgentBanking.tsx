import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Landmark, ShieldCheck, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUserId } from "@/hooks/useCurrentUserId";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface CustodialAccountRow {
  id: string;
  provider_id: string;
  wallet_id: string | null;
  wallet_address: string | null;
  chain: string;
  status: string;
  created_at: string;
}

interface TransferRequestRow {
  id: string;
  custodial_account_id: string | null;
  to_address: string;
  asset_symbol: string;
  chain: string;
  amount: number;
  status: string;
  idempotency_key: string;
  created_at: string;
}

const statusTone = (status: string) => {
  switch (status) {
    case "active":
    case "approved":
    case "completed":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    case "pending":
    case "submitted":
      return "bg-amber-500/15 text-amber-200 border-amber-500/30";
    case "rejected":
    case "failed":
    case "suspended":
      return "bg-rose-500/15 text-rose-200 border-rose-500/30";
    default:
      return "bg-white/10 text-white/70 border-white/15";
  }
};

const AgentBanking = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: creatorId } = useCurrentUserId();
  const [accountForm, setAccountForm] = useState({
    chain: "solana",
    walletAddress: "",
    walletId: "",
  });
  const [transferForm, setTransferForm] = useState({
    custodialAccountId: "",
    toAddress: "",
    assetSymbol: "SOL",
    chain: "solana",
    amount: "0",
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ["agent-banking", "accounts"],
    queryFn: async (): Promise<CustodialAccountRow[]> => {
      const { data, error } = await supabase
        .from("custodial_accounts")
        .select("id, provider_id, wallet_id, wallet_address, chain, status, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as CustodialAccountRow[];
    },
  });

  const { data: requests = [] } = useQuery({
    queryKey: ["agent-banking", "requests"],
    queryFn: async (): Promise<TransferRequestRow[]> => {
      const { data, error } = await supabase
        .from("treasury_transfer_requests")
        .select("id, custodial_account_id, to_address, asset_symbol, chain, amount, status, idempotency_key, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as TransferRequestRow[];
    },
  });

  const invalidateBanking = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["agent-banking"] }),
      queryClient.invalidateQueries({ queryKey: ["platform-overview"] }),
    ]);
  };

  const handleCreateAccount = async () => {
    if (!creatorId) return;
    try {
      const { error } = await supabase.from("custodial_accounts").insert({
        creator_id: creatorId,
        provider_id: "crossmint",
        wallet_id: accountForm.walletId || null,
        wallet_address: accountForm.walletAddress || null,
        chain: accountForm.chain,
        status: "active",
      });
      if (error) throw error;
      setAccountForm({ chain: "solana", walletAddress: "", walletId: "" });
      await invalidateBanking();
      toast({ title: "Custodial account saved", description: "The banking portal now tracks this Crossmint account." });
    } catch (error) {
      toast({
        title: "Unable to save custodial account",
        description: error instanceof Error ? error.message : "Unknown account error.",
        variant: "destructive",
      });
    }
  };

  const handleRequestTransfer = async () => {
    try {
      const { error } = await supabase.rpc("request_treasury_transfer", {
        p_custodial_account_id: transferForm.custodialAccountId,
        p_to_address: transferForm.toAddress,
        p_asset_symbol: transferForm.assetSymbol,
        p_chain: transferForm.chain,
        p_amount: Number(transferForm.amount || 0),
        p_confirmation_token_hash: `ui-${crypto.randomUUID()}`,
        p_idempotency_key: crypto.randomUUID(),
        p_metadata: { source: "agent_banking_ui" },
      });
      if (error) throw error;
      setTransferForm((current) => ({
        ...current,
        toAddress: "",
        amount: "0",
      }));
      await invalidateBanking();
      toast({ title: "Transfer requested", description: "The request was stored with idempotency and approval metadata." });
    } catch (error) {
      toast({
        title: "Unable to request transfer",
        description: error instanceof Error ? error.message : "Unknown transfer request error.",
        variant: "destructive",
      });
    }
  };

  const handleApprove = async (requestId: string, status: "approved" | "rejected") => {
    try {
      const { error } = await supabase.rpc("approve_treasury_transfer_request", {
        p_request_id: requestId,
        p_status: status,
        p_comment: `Set from agent banking UI: ${status}`,
        p_metadata: { source: "agent_banking_ui" },
      });
      if (error) throw error;
      await invalidateBanking();
      toast({ title: `Transfer ${status}`, description: "Approval decision stored in treasury_transfer_approvals." });
    } catch (error) {
      toast({
        title: "Unable to update transfer approval",
        description: error instanceof Error ? error.message : "Unknown approval error.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
        <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Landmark className="h-5 w-5 text-primary" />
              Crossmint custody lane
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-white/60">
              Agent banking is isolated from creator wallets. This pane writes custodial accounts and transfer requests into the guarded finance workflow.
            </p>
            <Input value={accountForm.chain} onChange={(event) => setAccountForm((current) => ({ ...current, chain: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="solana" />
            <Input value={accountForm.walletId} onChange={(event) => setAccountForm((current) => ({ ...current, walletId: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="Crossmint wallet id" />
            <Input value={accountForm.walletAddress} onChange={(event) => setAccountForm((current) => ({ ...current, walletAddress: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="Custodial wallet address" />
            <Button onClick={handleCreateAccount} className="w-full bg-primary hover:bg-primary/90">
              Save Custodial Account
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Transfer request
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Custodial account</Label>
              <select
                value={transferForm.custodialAccountId}
                onChange={(event) => {
                  const account = accounts.find((item) => item.id === event.target.value);
                  setTransferForm((current) => ({
                    ...current,
                    custodialAccountId: event.target.value,
                    chain: account?.chain ?? current.chain,
                  }));
                }}
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              >
                <option value="">Choose account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.chain} • {account.wallet_address ?? account.wallet_id ?? account.id}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Input value={transferForm.assetSymbol} onChange={(event) => setTransferForm((current) => ({ ...current, assetSymbol: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="SOL" />
              <Input value={transferForm.chain} onChange={(event) => setTransferForm((current) => ({ ...current, chain: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="solana" />
              <Input type="number" value={transferForm.amount} onChange={(event) => setTransferForm((current) => ({ ...current, amount: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="0" />
            </div>
            <Input value={transferForm.toAddress} onChange={(event) => setTransferForm((current) => ({ ...current, toAddress: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="Destination wallet" />
            <Button onClick={handleRequestTransfer} className="w-full bg-primary hover:bg-primary/90">
              Request Transfer
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Wallet className="h-5 w-5 text-primary" />
            Custodial accounts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {accounts.length ? accounts.map((account) => (
            <div key={account.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-white">{account.wallet_address ?? account.wallet_id ?? account.id}</p>
                  <p className="mt-1 text-sm text-white/60">{account.provider_id} • {account.chain}</p>
                </div>
                <Badge className={statusTone(account.status)}>{account.status}</Badge>
              </div>
            </div>
          )) : <p className="text-sm text-white/60">No custodial accounts configured yet.</p>}
        </CardContent>
      </Card>

      <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-white">Transfer approvals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {requests.length ? requests.map((request) => (
            <div key={request.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-white">
                    {Number(request.amount ?? 0).toLocaleString()} {request.asset_symbol} → {request.to_address}
                  </p>
                  <p className="mt-1 text-sm text-white/60">{request.chain} • {new Date(request.created_at).toLocaleString()}</p>
                  <p className="mt-1 text-xs text-white/50">Idempotency key: {request.idempotency_key}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusTone(request.status)}>{request.status}</Badge>
                  {request.status === "pending" ? (
                    <>
                      <Button variant="outline" className="border-white/15 text-white/70" onClick={() => handleApprove(request.id, "approved")}>
                        Approve
                      </Button>
                      <Button variant="outline" className="border-white/15 text-white/70" onClick={() => handleApprove(request.id, "rejected")}>
                        Reject
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          )) : <p className="text-sm text-white/60">No treasury transfer requests yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentBanking;
