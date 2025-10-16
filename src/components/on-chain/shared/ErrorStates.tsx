import { AlertCircle, WifiOff, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  type?: 'error' | 'offline' | 'empty' | 'maintenance';
}

export const ErrorState = ({ 
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
  type = 'error'
}: ErrorStateProps) => {
  const icons = {
    error: AlertCircle,
    offline: WifiOff,
    empty: TrendingDown,
    maintenance: AlertCircle,
  };

  const Icon = icons[type];

  return (
    <Card className="glass-card p-12 text-center">
      <Icon className="w-16 h-16 text-destructive mx-auto mb-4 opacity-50" />
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </Card>
  );
};

export const EmptyState = ({ 
  icon: Icon = TrendingDown,
  title = "No data yet",
  message = "Get started by adding your first item.",
  action,
  actionLabel = "Get Started"
}: {
  icon?: any;
  title?: string;
  message?: string;
  action?: () => void;
  actionLabel?: string;
}) => {
  return (
    <Card className="glass-card p-12 text-center">
      <Icon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {message}
      </p>
      {action && (
        <Button onClick={action}>
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};
