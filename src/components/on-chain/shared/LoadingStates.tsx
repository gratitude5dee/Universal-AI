import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const PortfolioSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="glass-card p-4">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32" />
          </Card>
        ))}
      </div>

      {/* Chart Skeleton */}
      <Card className="glass-card p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
      </Card>

      {/* Asset List Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="glass-card p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-10 w-24" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const AgentSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="glass-card p-4">
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-8 w-20" />
          </Card>
        ))}
      </div>

      {/* Agent Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <Card key={i} className="glass-card p-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((j) => (
                  <div key={j}>
                    <Skeleton className="h-3 w-20 mb-1" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const LiquiditySkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="glass-card p-4">
            <Skeleton className="h-4 w-28 mb-2" />
            <Skeleton className="h-8 w-24" />
          </Card>
        ))}
      </div>

      {/* Chart Skeleton */}
      <Card className="glass-card p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-48 w-full" />
      </Card>

      {/* Positions Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="glass-card p-5">
            <Skeleton className="h-6 w-32 mb-3" />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j}>
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-5 w-20" />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
