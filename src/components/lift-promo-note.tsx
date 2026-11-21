import { Tag } from "lucide-react";
import { AnalyticsLink } from "@/components/analytics-link";
import { timeSlotLabels } from "@/lib/constants";
import { findLiftPromotion } from "@/lib/lift-promotions";
import type { TimeSlot } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

// 판매 중인 한정 할인이 있을 때만 보인다. 총액에는 반영하지 않고 정상가 아래에 참고로 안내한다.
export function LiftPromoNote({ resortId, timeSlot, visitDate, className }: { resortId: string; timeSlot: TimeSlot; visitDate: string; className?: string }) {
  const match = findLiftPromotion(resortId, timeSlot, visitDate);
  if (!match) return null;
  const { promotion } = match;
  const saving = match.saving !== undefined && match.saving > 0 ? ` (정상가보다 ${formatCurrency(match.saving)} 저렴)` : "";

  return (
    <div className={`rounded-lg border bg-muted/50 p-3 text-xs leading-5 ${className ?? ""}`} data-testid="lift-promo-note">
      <p className="flex items-start gap-1.5 font-medium text-foreground">
        <Tag className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
        <span>{promotion.title} {timeSlotLabels[timeSlot]} {formatCurrency(match.adultPrice)}{saving}</span>
      </p>
      <p className="mt-1 text-muted-foreground">
        {promotion.channel}에서 {promotion.salesTo.slice(5).replace("-", "/")}까지 판매. 위 예상 총액에는 반영하지 않았어요. {promotion.condition}
      </p>
      <AnalyticsLink
        href={promotion.sourceUrl}
        target="_blank"
        rel="noreferrer"
        eventName="external_link_click"
        eventData={{ type: "lift_promotion", resortId, promotionId: promotion.id }}
        className="mt-1 inline-flex min-h-8 items-center font-medium text-primary"
      >
        공식 공지 보기
      </AnalyticsLink>
    </div>
  );
}
