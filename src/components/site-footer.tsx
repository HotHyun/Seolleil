import Link from "next/link";
import { legal } from "@/lib/legal";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-card/60">
      <div className="page-shell flex flex-col gap-3 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="font-black text-foreground">{legal.serviceName}</p>
          <p>운영: {legal.operatorName} · 문의: <a href={`mailto:${legal.contactEmail}`} className="underline underline-offset-2">{legal.contactEmail}</a></p>
          <p>가격 정보는 시즌 참고용이며 예약 전 공식 판매처에서 최신 가격을 확인해 주세요.</p>
        </div>
        <nav aria-label="약관 및 정책" className="flex flex-wrap gap-x-4 gap-y-1 font-semibold">
          <Link href="/terms" className="inline-flex min-h-11 items-center hover:text-foreground">이용약관</Link>
          <Link href="/privacy" className="inline-flex min-h-11 items-center hover:text-foreground">개인정보처리방침</Link>
        </nav>
      </div>
    </footer>
  );
}
