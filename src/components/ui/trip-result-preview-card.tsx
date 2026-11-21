import Link from "next/link";
import { confidenceMeta } from "@/components/confidence-badge";
import type { PriceConfidence } from "@/lib/types";
import { cn } from "@/lib/utils";

export type SampleRow = { id: string; name: string; time: string; cost: string; confidence: PriceConfidence };

// 추천 엔진이 계산한 실제 값을 그대로 보여 주는 결과 카드. 홈 히어로에서 슬로프 아래쪽에 걸쳐 놓는다.
export function TripResultPreviewCard({ rows, label, className }: { rows: SampleRow[]; label: string; className?: string }) {
  return (
    <article aria-label="추천 결과 예시" className={cn("rounded-xl border bg-card p-4 text-card-foreground shadow-[0_8px_24px_rgba(15,23,42,.10)] sm:p-5", className)}>
      <header className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold">추천 결과 예시</h2>
        <p className="text-xs text-muted-foreground">{label}</p>
      </header>
      <ol className="mt-4 divide-y border-y border-dashed">
        {rows.map((row, index) => (
          <li key={row.id}>
            <Link href={`/resorts/${row.id}`} className="grid grid-cols-[16px_minmax(0,1fr)_auto] items-center gap-x-3 py-3 transition-colors hover:text-primary">
              <span className="text-xs tabular-nums text-muted-foreground">{index + 1}</span>
              <span className="min-w-0">
                <span className={cn("block truncate text-sm", index === 0 ? "font-semibold" : "font-medium")}>{row.name}</span>
                <span className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  이동 {row.time}
                  <span aria-hidden="true" className={cn("ml-1 h-2 w-2 rounded-full", confidenceMeta[row.confidence].dot)} />
                  {confidenceMeta[row.confidence].label}
                </span>
              </span>
              <span className={cn("text-right text-sm tabular-nums", index === 0 ? "font-semibold text-primary" : "font-medium")}>{row.cost}</span>
            </Link>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-muted-foreground">리프트·렌탈·교통 합계. 시즌 참고가예요.</p>
    </article>
  );
}
