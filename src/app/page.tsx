import type { ReactNode } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Link2,
  MapPinned,
  Route,
  ShieldCheck,
  UsersRound,
  WalletCards
} from "lucide-react";
import { AnalyticsLink } from "@/components/analytics-link";
import { Button } from "@/components/ui/button";
import { CinematicHero } from "@/components/ui/cinematic-landing-hero";
import { resorts } from "@/data/resorts";

export default function HomePage() {
  const activeCount = resorts.filter((resort) => resort.operationStatus === "operating").length;

  return (
    <main className="overflow-hidden bg-background">
      <CinematicHero activeResortCount={activeCount} />

      <section className="page-shell grid gap-8 py-12 md:grid-cols-[0.9fr_1.1fr] md:items-end md:py-16">
        <div>
          <p className="text-sm font-black text-primary">What Korean Ski does</p>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
            검색보다 빠르게, 예약 전에 필요한 결정을 정리합니다.
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Feature icon={<Route />} title="추천" text="출발지, 날짜, 예산, 초보 여부를 반영해 후보를 좁힙니다." />
          <Feature icon={<WalletCards />} title="비용" text="리프트권, 렌탈, 교통비를 날짜 기준 범위로 계산합니다." />
          <Feature icon={<ShieldCheck />} title="공유" text="편집 링크와 읽기 전용 공유 링크를 분리합니다." />
        </div>
      </section>

      <section className="border-y bg-zinc-950 text-white">
        <div className="page-shell grid gap-8 py-12 md:grid-cols-[0.8fr_1.2fr] md:items-center md:py-16">
          <div>
            <p className="text-sm font-black text-primary">Trip flow</p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
              3분 안에 스키 트립 초안을 만듭니다.
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <Step number="01" icon={<CalendarDays />} title="조건 입력" text="방문 날짜, 인원, 교통, 장비 보유 여부를 선택합니다." />
            <Step number="02" icon={<MapPinned />} title="후보 비교" text="이동 시간, 예상 비용, 렌탈 편의성을 같이 봅니다." />
            <Step number="03" icon={<CheckCircle2 />} title="준비 완료" text="예약, 운영 확인, 준비물을 체크하고 동행자에게 공유합니다." />
          </div>
        </div>
      </section>

      <section className="page-shell py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <div className="space-y-4">
            <p className="text-sm font-black text-primary">Beginner ready</p>
            <h2 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
              처음 가도 빠뜨릴 일을 줄이는 구조입니다.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Korean Ski는 멋진 소개보다 실제 출발 전에 필요한 확인 항목을 우선합니다. 추천 결과에서 바로 트립을 만들고, 예약과 준비 상태를 계속 갱신합니다.
            </p>
          </div>
          <div className="grid gap-3">
            <ValueRow icon={<Clock3 />} title="날짜 중심" text="방문일 기준 가격과 운영 확인 링크를 같이 보여줍니다." />
            <ValueRow icon={<UsersRound />} title="동행자 공유" text="일정, 체크리스트, 예약 상태만 읽기 전용으로 공유합니다." />
            <ValueRow icon={<Link2 />} title="외부 예약 연결" text="결제는 하지 않고 공식 예매와 렌탈 확인 링크로 연결합니다." />
          </div>
        </div>
      </section>

      <section className="page-shell pb-14 md:pb-20">
        <div className="relative overflow-hidden rounded-xl border bg-zinc-950 p-6 text-white md:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-black text-primary">Start now</p>
              <h2 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">
                이번 주말 스키 계획을 바로 만들어보세요.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">
                로그인 없이 시작할 수 있고, 나중에 계정에 연결해 내 트립으로 보관할 수 있습니다.
              </p>
            </div>
            <AnalyticsLink href="/plan" eventName="home_bottom_cta_click">
              <Button className="h-12 w-full px-5 text-base md:w-auto">
                트립 만들기 <ArrowRight className="h-5 w-5" />
              </Button>
            </AnalyticsLink>
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="motion-card rounded-lg border bg-card/[0.82] p-4 shadow-sm">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary/15 text-primary [&_svg]:h-5 [&_svg]:w-5">
        {icon}
      </div>
      <h3 className="font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}

function Step({ number, icon, title, text }: { number: string; icon: ReactNode; title: string; text: string }) {
  return (
    <div className="motion-card rounded-lg border border-white/10 bg-white/[0.06] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/[0.18] text-primary [&_svg]:h-5 [&_svg]:w-5">
          {icon}
        </div>
        <div className="text-sm font-black text-white/[0.40]">{number}</div>
      </div>
      <h3 className="mt-5 text-xl font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-300">{text}</p>
    </div>
  );
}

function ValueRow({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="motion-card flex gap-4 rounded-lg border bg-card/[0.82] p-4 shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-zinc-950 text-primary [&_svg]:h-5 [&_svg]:w-5">
        {icon}
      </div>
      <div>
        <h3 className="font-black">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
