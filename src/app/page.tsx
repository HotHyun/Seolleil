import { ArrowRight, CalendarCheck, Map, ReceiptText, Share2, Sparkles } from "lucide-react";
import { AnalyticsLink } from "@/components/analytics-link";
import { CinematicHero } from "@/components/ui/cinematic-landing-hero";
import { resorts } from "@/data/resorts";

const journey = [
  { step: "01", icon: Map, title: "취향에 맞는 설원 찾기", copy: "거리, 실력, 동행 유형을 바탕으로 이유가 분명한 스키장을 추천해요.", color: "bg-[#326bff]" },
  { step: "02", icon: ReceiptText, title: "현실적인 비용 그리기", copy: "방문 날짜의 시즌 요금으로 리프트권, 렌탈, 교통비를 미리 계산해요.", color: "bg-[#ff6b57]" },
  { step: "03", icon: CalendarCheck, title: "빠짐없이 출발 준비", copy: "예약 링크와 준비물을 한곳에 모아 출발 전까지 차근차근 완료해요.", color: "bg-[#8b5cf6]" },
  { step: "04", icon: Share2, title: "동행자와 가볍게 공유", copy: "읽기 전용 링크 하나로 일정과 준비 상태를 모두에게 알려요.", color: "bg-[#0fa77a]" }
];

export default function HomePage() {
  const activeCount = resorts.filter((resort) => resort.operationStatus === "operating").length;
  return (
    <main className="overflow-hidden bg-background">
      <CinematicHero activeResortCount={activeCount} />
      <section className="relative py-24 sm:py-32">
        <div className="page-shell">
          <div className="max-w-2xl">
            <p className="section-kicker"><Sparkles className="h-4 w-4" /> 여행이 계획이 되는 순간</p>
            <h2 className="mt-5 text-balance text-4xl font-black leading-[1.05] tracking-[-.04em] sm:text-6xl">복잡한 검색 대신,<br /><span className="text-primary">출발에 가까운 네 단계.</span></h2>
            <p className="mt-5 text-base font-medium leading-7 text-muted-foreground sm:text-lg">스키장을 고르는 순간부터 장갑을 챙기는 순간까지, 여행의 흐름이 끊기지 않도록 설계했습니다.</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {journey.map(({ step, icon: Icon, title, copy, color }) => (
              <article key={step} className="motion-card group relative overflow-hidden rounded-2xl border bg-card p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4"><span className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${color}`}><Icon className="h-6 w-6" /></span><span className="text-5xl font-black tracking-[-.06em] text-foreground/5">{step}</span></div>
                <h3 className="mt-8 text-2xl font-black tracking-[-.025em]">{title}</h3>
                <p className="mt-3 max-w-md font-medium leading-7 text-muted-foreground">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="page-shell pb-24 sm:pb-32">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#326bff] px-6 py-14 text-white shadow-[0_30px_80px_rgba(50,107,255,.25)] sm:px-12 sm:py-20">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[48px] border-white/10" aria-hidden="true" />
          <div className="relative max-w-3xl"><p className="text-sm font-black text-[#d9ff83]">READY FOR THE FIRST RUN?</p><h2 className="mt-4 text-balance text-4xl font-black leading-[1.05] tracking-[-.04em] sm:text-6xl">이번 겨울의 첫 트립을<br />지금 만들어 보세요.</h2><p className="mt-5 max-w-xl font-medium leading-7 text-white/75">3분이면 추천과 예산이 완성됩니다. 로그인은 나중에 해도 괜찮아요.</p><AnalyticsLink href="/plan" eventName="home_final_cta_click" className="group mt-8 inline-flex min-h-13 items-center gap-2 rounded-xl bg-[#b8f23d] px-6 py-3.5 font-black text-[#071225] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">내 트립 만들기 <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" /></AnalyticsLink></div>
        </div>
      </section>
    </main>
  );
}
