import { Eye, LockKeyhole } from "lucide-react";

export function ReadOnlyAccessBanner({ compact = false }: { compact?: boolean }) {
  return <aside className={`border border-sky-500/25 bg-sky-500/[0.08] ${compact ? "rounded-xl p-3" : "rounded-2xl p-4"}`} aria-label="보기 전용 권한">
    <div className="flex items-start gap-3">
      <span className="rounded-xl bg-sky-500/15 p-2.5 text-sky-700 dark:text-sky-300"><LockKeyhole aria-hidden="true" className="h-5 w-5" /></span>
      <div className="min-w-0"><p className="flex items-center gap-2 font-black"><Eye aria-hidden="true" className="h-4 w-4" />보기 전용 트립</p><p className="mt-1 text-sm leading-6 text-muted-foreground">소유자가 결정한 일정과 준비 상태를 보고 있습니다. 이 권한으로는 날짜, 렌탈, 숙박, 교통, 체크리스트와 비용을 변경할 수 없습니다.</p></div>
    </div>
  </aside>;
}
