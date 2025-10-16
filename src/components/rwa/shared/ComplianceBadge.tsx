import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

interface ComplianceBadgeProps {
  status: 'verified' | 'pending' | 'rejected' | 'expired';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ComplianceBadge = ({ status, label, size = 'md' }: ComplianceBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'verified':
        return {
          icon: CheckCircle,
          color: 'text-[#059669] bg-[#059669]/20',
          text: 'Verified',
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-[#F59E0B] bg-[#F59E0B]/20',
          text: 'Pending',
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-[#DC2626] bg-[#DC2626]/20',
          text: 'Rejected',
        };
      case 'expired':
        return {
          icon: AlertCircle,
          color: 'text-[#EA580C] bg-[#EA580C]/20',
          text: 'Expired',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const iconSize = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 ${config.color} ${sizeClasses[size]}`}>
      <Icon className={iconSize[size]} />
      <span className="font-medium">{label || config.text}</span>
    </div>
  );
};
