import { Info } from "lucide-react";
import { REFERENCE_PRICE_SEASON } from "@/lib/constants";

export function PriceContextBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`rounded-lg border bg-muted/50 text-foreground ${compact ? "px-3 py-2" : "p-4"}`}>
      <div className="flex items-start gap-2">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <div>
          <div className="text-sm font-medium">26/27 공식 가격 게시 전에는 {REFERENCE_PRICE_SEASON} 참고가로 보여요</div>
          {!compact ? <p className="mt-1 text-xs leading-5 text-muted-foreground">26/27 공식 가격이 게시된 항목은 그 가격을, 아직 없는 항목은 25/26 가격을 참고가로 합산합니다. 공식 가격이 게시되면 자동으로 바뀝니다. 예약 전 공식 판매처의 최신 가격을 확인해 주세요.</p> : null}
        </div>
      </div>
    </div>
  );
}
