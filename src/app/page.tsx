import { ArrowRight, MapPinned } from "lucide-react";
import { AnalyticsLink } from "@/components/analytics-link";
import { Button } from "@/components/ui/button";
import { CinematicHero } from "@/components/ui/cinematic-landing-hero";
import { resorts } from "@/data/resorts";

export default function HomePage() {
  const activeCount = resorts.filter((resort) => resort.operationStatus === "operating").length;

  return (
    <main className="overflow-hidden bg-background">
      <CinematicHero activeResortCount={activeCount} />

      <section className="flex min-h-screen items-center bg-background text-foreground">
        <div className="page-shell py-20 text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">Start now</p>
          <h2 className="mx-auto mt-4 max-w-4xl text-balance text-5xl font-black leading-[0.98] tracking-normal sm:text-6xl md:text-8xl">
            지금부터 스키 여행을 만들어보세요.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base font-semibold leading-7 text-muted-foreground sm:text-lg">
            조건을 입력하면 추천 스키장, 예상 비용, 예약 확인 링크, 동행자 체크리스트까지 바로 트립으로 정리됩니다.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <AnalyticsLink href="/plan" eventName="home_final_cta_click" className="w-full sm:w-auto">
              <Button className="h-12 w-full px-6 text-base sm:w-auto">
                내게 맞는 스키장 찾기 <ArrowRight className="h-5 w-5" />
              </Button>
            </AnalyticsLink>
            <AnalyticsLink href="/resorts" eventName="home_final_resorts_click" className="w-full sm:w-auto">
              <Button variant="secondary" className="h-12 w-full px-6 text-base sm:w-auto">
                스키장 둘러보기 <MapPinned className="h-5 w-5" />
              </Button>
            </AnalyticsLink>
          </div>
        </div>
      </section>
    </main>
  );
}
