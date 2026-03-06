import React from "react";
import { ConnectButton } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { useWeb3 } from "@/context/Web3Context";

export function ConnectWalletButton({
  label = "Connect Wallet",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const { client } = useWeb3();

  return (
    <div className={className}>
      <ConnectButton
        client={client}
        wallets={[createWallet("io.metamask"), createWallet("com.coinbase.wallet"), createWallet("walletConnect")]}
        connectButton={{ label }}
        connectModal={{ title: "Connect Your Wallet", size: "compact" }}
      />
    </div>
  );
}

