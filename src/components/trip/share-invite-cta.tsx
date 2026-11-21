import { ArrowRight, Snowflake } from "lucide-react";
import { AnalyticsLink } from "@/components/analytics-link";

// 공유 링크로 들어온 동행자가 자기 트립을 만들도록 안내한다. 가장 비용이 낮은 바이럴 경로다.
export function ShareInviteCta({ permission }: { permission: "view" | "edit" }) {
  return (
    <section aria-labelledby="share-invite-cta-title" className="rounded-2xl border bg-card p-5 sm:p-6" data-testid="share-invite-cta">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="text-muted-foreground"><Snowflake aria-hidden="true" className="h-5 w-5" /></span>
          <div>
            <h2 id="share-invite-cta-title" className="font-semibold">나도 스키 트립 만들기</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">로그인 없이 스키장 추천, 렌탈·리프트·셔틀 비용 비교, 준비물 체크리스트까지 한 번에 만들 수 있어요.</p>
          </div>
        </div>
        <AnalyticsLink
          href="/plan?ref=share"
          eventName="share_cta_click"
          eventData={{ permission }}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          트립 만들기 <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </AnalyticsLink>
      </div>
    </section>
  );
}
