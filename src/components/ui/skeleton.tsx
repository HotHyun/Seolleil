import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-lg bg-muted", className)} {...props} />;
}

/** 서버에서 데이터를 가져오는 동안 보여 주는 공통 뼈대 화면(트립/내 트립/공유 페이지). */
export function PageSkeleton({ label, cards = 3 }: { label: string; cards?: number }) {
  return (
    <div className="page-shell space-y-5 py-8" role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72 max-w-full" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cards }, (_, index) => <Skeleton key={index} className="h-40" />)}
      </div>
    </div>
  );
}
