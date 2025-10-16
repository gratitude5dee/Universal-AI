import { getChainById } from "@/data/bridge/chains";
import { ChainId } from "@/types/bridge";

interface ChainBadgeProps {
  chain: ChainId;
  size?: "sm" | "md" | "lg";
}

export const ChainBadge = ({ chain, size = "md" }: ChainBadgeProps) => {
  const chainData = getChainById(chain);
  if (!chainData) return null;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5"
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold uppercase border ${sizeClasses[size]}`}
      style={{
        backgroundColor: `${chainData.color}15`,
        borderColor: `${chainData.color}30`,
        color: chainData.color
      }}
    >
      <span className="opacity-90">{chainData.icon}</span>
      {size !== "sm" && <span>{chainData.symbol}</span>}
    </span>
  );
};
