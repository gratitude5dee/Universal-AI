import { Button } from "@/components/ui/button";
import { ConnectWalletButton } from "@/components/web3/ConnectWalletButton";
import { useEvmWallet } from "@/context/EvmWalletContext";
import { ProviderBadge } from "@/components/providers/ProviderBadge";
import { PROVIDER_CAPABILITIES } from "@/lib/provider-capabilities";
import { ExternalLink, ShieldCheck, Wallet } from "lucide-react";
import { motion } from "framer-motion";

const walletSurfaces = [
  {
    id: "thirdweb",
    title: "Creator EVM Wallet",
    summary: "Primary wallet for creator identity, token gating, minting, and user-signed EVM execution.",
    provider: PROVIDER_CAPABILITIES.thirdweb,
    primary: true,
  },
  {
    id: "solana_wallet_standard",
    title: "Solana Launch Wallet",
    summary: "Connected only inside Bags launch routes. It is intentionally not a global profile wallet.",
    provider: PROVIDER_CAPABILITIES.bags,
    primary: false,
  },
  {
    id: "crossmint",
    title: "Custodial Treasury Wallets",
    summary: "Reserved for agent wallets, operator treasury, and guarded Solana transfer flows.",
    provider: PROVIDER_CAPABILITIES.crossmint,
    primary: false,
  },
];

export const WalletManagement = () => {
  const { address, nativeBalance, chainMeta } = useEvmWallet();

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-card-glow backdrop-blur-md">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-white text-shadow-sm">Wallet Boundary Management</h3>
          <p className="mt-1 text-sm text-white/60">
            thirdweb owns creator-facing EVM wallet UX. Crossmint custody is isolated to treasury and operator surfaces.
          </p>
        </div>

        <div className="space-y-4">
          {walletSurfaces.map((wallet, index) => (
            <motion.div
              key={wallet.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-xl border border-white/20 bg-white/5 p-5"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white text-shadow-sm">{wallet.title}</h4>
                    {wallet.primary && (
                      <span className="rounded-full border border-emerald-300/30 bg-emerald-300/15 px-2 py-0.5 text-xs text-emerald-100">
                        Primary
                      </span>
                    )}
                  </div>
                  <ProviderBadge label={wallet.provider.label} maturity={wallet.provider.maturity} />
                  <p className="text-sm text-white/60">{wallet.summary}</p>
                  {wallet.id === "thirdweb" && (
                    <p className="text-xs font-mono text-white/50">
                      {address
                        ? `${address} • ${nativeBalance?.formatted ?? "0"} ${chainMeta?.nativeSymbol ?? ""}`.trim()
                        : "No creator EVM wallet connected"}
                    </p>
                  )}
                  {wallet.id === "solana_wallet_standard" && (
                    <p className="text-xs text-white/50">
                      Solana wallets connect only within Bags launch and fee routes. They are not persisted as the app header wallet.
                    </p>
                  )}
                  {wallet.id === "crossmint" && (
                    <p className="text-xs text-white/50">
                      Custodial wallet identities are managed server-side and should never appear as the default creator wallet.
                    </p>
                  )}
                </div>
                <div className="rounded-xl bg-white/10 p-3 text-white">
                  {wallet.id === "crossmint" ? (
                    <ShieldCheck className="h-5 w-5" />
                  ) : (
                    <Wallet className="h-5 w-5" />
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {wallet.id === "thirdweb" ? (
                  <>
                    <ConnectWalletButton label={address ? "Manage EVM Wallet" : "Connect EVM Wallet"} />
                    {chainMeta?.explorerBaseUrl && address && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10"
                        onClick={() =>
                          window.open(
                            `${chainMeta.explorerBaseUrl.replace(/\/$/, "")}/address/${address}`,
                            "_blank",
                            "noopener,noreferrer",
                          )
                        }
                      >
                        <ExternalLink className="mr-2 h-3 w-3" />
                        {chainMeta.name} Explorer
                      </Button>
                    )}
                  </>
                ) : (
                  <Button variant="outline" size="sm" className="border-white/20 text-white/70 hover:bg-white/10">
                    {wallet.id === "crossmint" ? "Open Treasury Controls" : "Open Launch Flow"}
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
