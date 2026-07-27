import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const StatCardSkeleton = () => (
  <Card className="p-4">
    <Skeleton className="w-10 h-10 rounded-lg mb-3" />
    <Skeleton className="w-12 h-8 mb-2" />
    <Skeleton className="w-24 h-4" />
  </Card>
);

export const TrackingListSkeleton = () => (
  <div className="divide-y divide-border">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="p-4 flex items-center justify-between gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="w-48 h-4" />
          <Skeleton className="w-full h-3" />
          <Skeleton className="w-64 h-3" />
        </div>
        <Skeleton className="w-20 h-6 rounded-full" />
      </div>
    ))}
  </div>
);

export const TimelineSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex gap-3">
        <div className="flex flex-col items-center">
          <Skeleton className="w-8 h-8 rounded-full" />
          {i < 3 && <Skeleton className="w-px h-6 mt-2" />}
        </div>
        <div className="flex-1 space-y-2 pb-4">
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-64 h-3" />
          <Skeleton className="w-40 h-3" />
        </div>
      </div>
    ))}
  </div>
);

export const MapSkeleton = () => (
  <div className="rounded-xl overflow-hidden border border-border">
    <Skeleton className="w-full h-80" />
  </div>
);
