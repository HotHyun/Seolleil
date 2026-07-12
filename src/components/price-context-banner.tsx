import { Info } from "lucide-react";
import { REFERENCE_PRICE_SEASON } from "@/lib/constants";

export function PriceContextBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-100 ${compact ? "px-3 py-2" : "p-4"}`}>
      <div className="flex items-start gap-2.5">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <div>
          <div className="text-sm font-black">{REFERENCE_PRICE_SEASON} 지난 시즌 참고 가격</div>
          {!compact ? <p className="mt-1 text-xs font-medium leading-5 opacity-80">새 시즌 공식 가격이 공개되기 전까지 여행 예산을 가늠하는 참고값입니다. 예약 전 공식 판매처의 최신 가격을 확인해 주세요.</p> : null}
        </div>
      </div>
    </div>
  );
}
