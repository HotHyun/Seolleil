import type { ReactNode } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Link2,
  MapPinned,
  ReceiptText,
  Route,
  ShieldCheck,
  Snowflake,
  UsersRound,
  WalletCards
} from "lucide-react";
import { AnalyticsLink } from "@/components/analytics-link";
import { Button } from "@/components/ui/button";
import { resorts } from "@/data/resorts";

const heroImage = "/images/ski-hero.jpg";

export default function HomePage() {
  const activeCount = resorts.filter((resort) => resort.operationStatus === "operating").length;

  return (
    <main className="overflow-hidden bg-background">
      <section
        className="relative min-h-[calc(100vh-4rem)] border-b bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.78),rgba(0,0,0,0.45),rgba(0,0,0,0.2))]" />
        <div className="page-shell relative flex min-h-[calc(100vh-4rem)] flex-col justify-end py-10 sm:py-12 md:py-16">
          <div className="max-w-4xl pb-8 md:pb-12">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-black backdrop-blur">
              <Snowflake className="h-4 w-4 text-primary" />
              한국 스키 여행을 한 번에 계획
            </div>
            <h1 className="text-balance text-5xl font-black leading-[0.96] tracking-normal sm:text-6xl md:text-8xl">
              스키장 추천부터 비용, 준비물까지 한 번에.
            </h1>
            <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-white/[0.82] sm:text-lg md:text-xl md:leading-8">
              날짜와 조건만 입력하면 지금 갈 만한 스키장, 예상 비용, 예약 확인 링크, 동행자 공유 체크리스트를 트립으로 만들어줍니다.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <AnalyticsLink href="/plan" eventName="home_hero_cta_click">
                <Button className="h-12 w-full px-5 text-base sm:w-auto">
                  트립 만들기 <ArrowRight className="h-5 w-5" />
                </Button>
              </AnalyticsLink>
              <AnalyticsLink href="/resorts" eventName="home_hero_resorts_click">
                <Button variant="secondary" className="h-12 w-full border-white/[0.25] bg-white/[0.12] px-5 text-base text-white hover:bg-white/[0.18] sm:w-auto">
                  스키장 둘러보기
                </Button>
              </AnalyticsLink>
            </div>
          </div>
          <div className="grid gap-3 border-t border-white/[0.16] pt-5 sm:grid-cols-3 md:max-w-3xl">
            <HeroStat icon={<MapPinned />} label="운영 스키장" value={`${activeCount}곳`} />
            <HeroStat icon={<ReceiptText />} label="예상 비용" value="날짜 기준" />
            <HeroStat icon={<ClipboardCheck />} label="준비 관리" value="공유 가능" />
          </div>
        </div>
      </section>

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

function HeroStat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-h-20 items-center gap-3 rounded-lg border border-white/[0.14] bg-white/[0.09] px-4 py-3 backdrop-blur">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground [&_svg]:h-5 [&_svg]:w-5">
        {icon}
      </div>
      <div>
        <div className="text-xs font-bold text-white/[0.62]">{label}</div>
        <div className="mt-1 text-lg font-black">{value}</div>
      </div>
    </div>
  );
}

function Feature({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-lg border bg-card/[0.82] p-4 shadow-sm">
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
    <div className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
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
    <div className="flex gap-4 rounded-lg border bg-card/[0.82] p-4 shadow-sm">
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
