import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ClipboardCheck,
  MapPinned,
  MountainSnow,
  ReceiptText,
  Sparkles
} from "lucide-react";
import { AnalyticsLink } from "@/components/analytics-link";

export function CinematicHero({ activeResortCount = 0 }: { activeResortCount?: number }) {
  return (
    <section className="landing-hero relative isolate min-h-[calc(100svh-4rem)] overflow-hidden bg-[#071225] text-white">
      <Image
        src="/images/ski-hero.jpg"
        alt="눈 덮인 산을 내려오는 스키어"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[62%_center] opacity-80"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,10,24,.94)_0%,rgba(3,10,24,.72)_46%,rgba(3,10,24,.22)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,#071225_0%,transparent_28%,rgba(5,13,30,.08)_100%)]" />
      <div className="snow-drift snow-drift-one" aria-hidden="true" />
      <div className="snow-drift snow-drift-two" aria-hidden="true" />

      <div className="page-shell relative z-10 flex min-h-[calc(100svh-4rem)] items-center py-16 lg:py-20">
        <div className="min-w-0 max-w-3xl xl:max-w-[650px]">
          <div className="hero-reveal inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-sm font-bold text-white/90 backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-[#b8f23d]" />
            이번 겨울, 계획부터 설레게
          </div>
          <h1 className="hero-reveal hero-delay-1 mt-6 text-balance text-[clamp(3.3rem,8vw,7.6rem)] font-black leading-[.9] tracking-[-.055em]">
            설원으로<br />
            <span className="text-[#b8f23d]">출발할 시간.</span>
          </h1>
          <p className="hero-reveal hero-delay-2 mt-7 max-w-xl text-pretty text-base font-medium leading-7 text-white/75 sm:text-lg sm:leading-8">
            날짜와 취향만 알려주세요. 나에게 맞는 스키장부터 실제 시즌 가격, 준비 체크리스트까지 한 번에 정리해 드려요.
          </p>
          <div className="hero-reveal hero-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
            <AnalyticsLink href="/plan" eventName="home_primary_cta_click" className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#b8f23d] px-6 py-3.5 font-black text-[#071225] shadow-[0_16px_48px_rgba(184,242,61,.28)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#c8ff52] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              내 스키 여행 시작하기
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </AnalyticsLink>
            <AnalyticsLink href="/resorts" eventName="home_resorts_click" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 font-black text-white backdrop-blur-xl transition duration-200 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              <MapPinned className="h-5 w-5" /> 스키장 둘러보기
            </AnalyticsLink>
          </div>
          <div className="hero-reveal hero-delay-4 mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-white/65">
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#b8f23d]" /> 로그인 없이 시작</span>
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#b8f23d]" /> 날짜별 예상 비용</span>
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#b8f23d]" /> 동행자 공유</span>
          </div>
        </div>

        <div className="absolute right-0 top-1/2 hidden w-[410px] -translate-y-1/2 xl:block" aria-label="Korean Ski 트립 플래너 미리보기">
          <div className="hero-reveal hero-delay-3 relative">
            <div className="absolute -inset-10 rounded-full bg-[#326bff]/25 blur-3xl" />
            <div className="hero-preview relative rotate-[2deg] rounded-[2rem] border border-white/15 bg-[#0c1b35]/85 p-4 shadow-[0_40px_100px_rgba(0,0,0,.48)] backdrop-blur-2xl">
            <div className="flex items-center justify-between px-2 pb-4 pt-1">
              <div>
                <p className="text-xs font-bold text-white/45">나의 첫 스키 트립</p>
                <p className="mt-1 text-xl font-black">이번 주말, 어디로 갈까?</p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#326bff] text-white"><MountainSnow className="h-6 w-6" /></span>
            </div>
            <div className="rounded-2xl bg-white p-5 text-[#0a1730]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="rounded-full bg-[#eaf0ff] px-2.5 py-1 text-xs font-extrabold text-[#326bff]">가장 잘 맞아요</span>
                  <h2 className="mt-3 text-2xl font-black">휘닉스 스노우파크</h2>
                  <p className="mt-1 text-sm font-semibold text-slate-500">초보 슬로프 · 셔틀 · 숙박 편의</p>
                </div>
                <strong className="text-3xl font-black text-[#326bff]">92</strong>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <PreviewItem icon={<CalendarDays />} label="방문일" value="1월 18일" />
                <PreviewItem icon={<ReceiptText />} label="1인 예상" value="₩94,000" />
              </div>
              <div className="mt-3 rounded-xl bg-[#071225] p-4 text-white">
                <div className="flex items-center justify-between text-sm"><span className="font-bold text-white/60">준비 진행률</span><strong>3 / 7</strong></div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[43%] rounded-full bg-[#b8f23d]" /></div>
              </div>
            </div>
            </div>
            <div className="hero-float absolute -bottom-8 -left-12 flex items-center gap-3 rounded-2xl border border-white/15 bg-[#326bff] p-4 shadow-2xl">
              <ClipboardCheck className="h-6 w-6" />
              <div><p className="text-xs font-bold text-white/65">현재 운영</p><p className="font-black">스키장 {activeResortCount}곳</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-xl bg-slate-100 p-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-[#326bff]"><div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">{icon}{label}</div><div className="mt-2 font-black">{value}</div></div>;
}
