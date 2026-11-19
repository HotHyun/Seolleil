import { affiliateDisclosure, hasActiveAffiliate } from "@/lib/affiliate";

// 제휴가 하나라도 활성화된 경우에만 보인다. 예약·구매 링크가 있는 화면 가까이에 둔다.
export function AffiliateNotice({ className }: { className?: string }) {
  if (!hasActiveAffiliate()) return null;
  return (
    <p className={`text-[11px] leading-5 text-muted-foreground ${className ?? ""}`} data-testid="affiliate-notice">
      {affiliateDisclosure}
    </p>
  );
}
