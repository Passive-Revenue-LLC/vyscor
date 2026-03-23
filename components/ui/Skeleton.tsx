import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('skeleton rounded-lg', className)} />;
}

export function EventCardSkeleton() {
  return (
    <div className="bg-bg-card border border-border rounded-lg p-4 border-l-2 border-l-border">
      <div className="grid grid-cols-[38px_1fr_auto] gap-3">
        <Skeleton className="w-[38px] h-[38px]" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-6 w-12" />
        </div>
      </div>
    </div>
  );
}
