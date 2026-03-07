import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProviderCapability } from "@/types/provider-boundary";

const maturityClasses: Record<ProviderCapability["maturity"], string> = {
  supported: "border-emerald-400/30 bg-emerald-500/15 text-emerald-100",
  advanced: "border-amber-400/30 bg-amber-500/15 text-amber-100",
  backlog: "border-slate-400/30 bg-slate-500/15 text-slate-100",
  server: "border-sky-400/30 bg-sky-500/15 text-sky-100",
};

export function ProviderBadge({
  label,
  maturity,
  className,
}: {
  label: string;
  maturity: ProviderCapability["maturity"];
  className?: string;
}) {
  return (
    <Badge className={cn("border text-xs font-medium uppercase tracking-wide", maturityClasses[maturity], className)}>
      {label}
    </Badge>
  );
}
