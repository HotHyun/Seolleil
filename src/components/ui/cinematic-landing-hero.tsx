import { ArrowRight, Check, MapPinned, Sparkles } from "lucide-react";
import { AnalyticsLink } from "@/components/analytics-link";
import { HeroQuickForm } from "@/components/ui/hero-quick-form";
import { TripResultPreviewCard } from "@/components/ui/trip-result-preview-card";

export function CinematicHero() {
  return (
    <section className="landing-hero relative isolate min-h-[calc(100svh-4rem)] overflow-hidden bg-[#071225] text-white">
      {/* 미리 WebP로 변환한 정적 파일: Workers에서 이미지 변환 없이 바로 서빙하고, srcSet으로 화면 폭·DPR에 맞는 크기만 받는다. */}
      <img
        src="/images/ski-hero-1080.webp"
        srcSet="/images/ski-hero-1080.webp 1080w, /images/ski-hero-2400.webp 2400w"
        sizes="100vw"
        alt="눈 덮인 산을 내려오는 스키어"
        width={1080}
        height={721}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-[62%_center] opacity-80"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,10,24,.9)_0%,rgba(3,10,24,.6)_45%,rgba(3,10,24,.88)_100%)] md:bg-[linear-gradient(90deg,rgba(3,10,24,.94)_0%,rgba(3,10,24,.72)_46%,rgba(3,10,24,.22)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,#071225_0%,transparent_28%,rgba(5,13,30,.08)_100%)]" />
      <div className="snow-drift snow-drift-one" aria-hidden="true" />
      <div className="snow-drift snow-drift-two" aria-hidden="true" />

      <div className="page-shell relative z-10 flex min-h-[calc(100svh-4rem)] flex-col items-start justify-center py-10 sm:py-12 lg:py-20 xl:grid xl:grid-cols-[minmax(0,1fr)_410px] xl:items-center xl:gap-10">
        <div className="min-w-0 max-w-3xl xl:max-w-[650px]">
          <div className="hero-reveal inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-sm font-bold text-white/90 backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-[#b8f23d]" />
            이번 겨울, 계획부터 설레게
          </div>
          <h1 className="hero-reveal hero-delay-1 mt-5 text-balance sm:mt-6 text-[clamp(3.3rem,8vw,7.6rem)] font-black leading-[.9] tracking-[-.055em]">
            설원으로<br />
            <span className="text-[#b8f23d]">출발할 시간.</span>
          </h1>
          <p className="hero-reveal hero-delay-2 mt-5 max-w-xl sm:mt-7 text-pretty text-base font-medium leading-7 text-white/75 sm:text-lg sm:leading-8">
            날짜와 취향을 고르면 나에게 맞는 스키장과 예상 비용을 비교하고, 준비 체크리스트까지 한 번에 만들 수 있어요.
          </p>
          <div className="hero-reveal hero-delay-3 mt-7 flex flex-col sm:mt-9 gap-3 sm:flex-row">
            <AnalyticsLink href="/plan" eventName="home_primary_cta_click" className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#b8f23d] px-6 py-3.5 font-black text-[#071225] shadow-[0_16px_48px_rgba(184,242,61,.28)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#c8ff52] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              내 스키 여행 시작하기
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </AnalyticsLink>
            <AnalyticsLink href="/resorts" eventName="home_resorts_click" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 font-black text-white backdrop-blur-xl transition duration-200 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              <MapPinned className="h-5 w-5" /> 스키장 둘러보기
            </AnalyticsLink>
          </div>
          <HeroQuickForm />
          <div className="hero-reveal hero-delay-4 mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[13px] sm:mt-10 sm:gap-x-6 sm:gap-y-3 sm:text-sm font-semibold text-white/65">
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#b8f23d]" /> 로그인 없이 시작</span>
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#b8f23d]" /> 날짜별 예상 비용</span>
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#b8f23d]" /> 동행자 공유</span>
          </div>
        </div>

        <div className="hero-reveal hero-delay-3 relative mt-8 w-full max-w-lg sm:mt-10 xl:mt-0 xl:max-w-none" aria-label="설레일 트립 플래너 미리보기">
          <div className="absolute -inset-10 -z-10 rounded-full bg-[#326bff]/25 blur-3xl" />
          <TripResultPreviewCard />
        </div>
      </div>
    </section>
  );
}
