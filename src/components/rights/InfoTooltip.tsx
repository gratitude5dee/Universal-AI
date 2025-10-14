import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InfoTooltipProps {
  content: string;
  side?: "top" | "right" | "bottom" | "left";
}

export const InfoTooltip = ({ content, side = "top" }: InfoTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-white/50 hover:text-white/70 transition-colors" />
          </button>
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs bg-black/90 border-white/10">
          <p className="text-xs text-white/90">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Common tooltip texts for the IP Portal
export const TOOLTIP_CONTENT = {
  parentIP: "Parent IP is the direct source this remix derives from. Inherits royalty policy and upstream revenue share.",
  ancestorIP: "Ancestor IPs are further up the lineage chain. They may receive downstream royalties based on policy.",
  lrpPolicy: "Liquid Revenue Protocol automatically splits revenue based on predefined percentages. Payments flow through the stack from primary sales to all stakeholders.",
  lapPolicy: "Liquid Attribution Protocol tracks creative contributions and distributes revenue proportionally to verified attribution.",
  customPolicy: "Custom terms define specific conditions for revenue distribution based on your agreement.",
  gasWarning: "IP is the native token used for transaction fees on Story Protocol. You need sufficient IP to register assets and perform on-chain operations.",
  unbonding: "Unbonding is the 14-day period where your staked IP is locked before it can be withdrawn. During this time, you don't earn rewards and can't use the IP.",
  slashing: "Slashing is a penalty applied to validators (and their delegators) who misbehave. Your staked IP can be reduced if the validator you've delegated to acts maliciously.",
  autoDistribute: "Rewards automatically distribute to your reward address when accumulated rewards reach 8 IP or more. No manual claim needed.",
  ipExplorer: "IP Explorer is Story Protocol's block explorer where you can view all on-chain transactions, IP relationships, and license activity.",
  derivativeWorks: "Derivative works are new creations based on existing IP. They maintain the original IP's royalty policy with additional splits for the derivative creator.",
  revenueShare: "Revenue share determines what percentage of downstream sales flows back to upstream IP holders. Typically 5-15% for derivatives.",
};
