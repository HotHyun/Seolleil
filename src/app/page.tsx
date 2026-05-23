import { ArrowRight } from "lucide-react";
import { AnalyticsLink } from "@/components/analytics-link";
import { Button } from "@/components/ui/button";
import { CinematicHero } from "@/components/ui/cinematic-landing-hero";
import { resorts } from "@/data/resorts";

export default function HomePage() {
  const activeCount = resorts.filter((resort) => resort.operationStatus === "operating").length;

  return (
    <main className="overflow-hidden bg-background">
      <CinematicHero activeResortCount={activeCount} />

      <section className="relative flex min-h-screen items-center bg-zinc-950 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: "url('/images/ski-hero.jpg')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.88),rgba(9,9,11,0.72))]" aria-hidden="true" />
        <div className="page-shell relative z-10 py-20 text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">Start now</p>
          <h2 className="mx-auto mt-4 max-w-4xl text-balance text-5xl font-black leading-[0.98] tracking-normal sm:text-6xl md:text-8xl">
            지금부터 스키 여행을 만들어보세요.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base font-semibold leading-7 text-white/72 sm:text-lg">
            조건을 입력하면 추천 스키장, 예상 비용, 예약 확인 링크, 동행자 체크리스트까지 바로 트립으로 정리됩니다.
          </p>
          <AnalyticsLink href="/plan" eventName="home_final_cta_click" className="mt-9 inline-flex">
            <Button className="h-12 px-6 text-base">
              내게 맞는 스키장 찾기 <ArrowRight className="h-5 w-5" />
            </Button>
          </AnalyticsLink>
        </div>
      </section>
    </main>
  );
}
