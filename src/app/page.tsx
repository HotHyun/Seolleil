import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Circle,
  ExternalLink,
  MapPinned,
  ReceiptText,
  Route,
  ShieldCheck,
  Snowflake,
  WalletCards
} from "lucide-react";
import { AnalyticsLink } from "@/components/analytics-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resorts } from "@/data/resorts";

export default function HomePage() {
  const active = resorts.filter((resort) => resort.operationStatus === "operating");
  return (
    <main className="bg-white">
      <section className="border-b bg-[linear-gradient(180deg,#ffffff_0%,#f4f6f0_100%)]">
        <div className="page-shell grid gap-8 py-8 md:min-h-[calc(100vh-4rem)] md:grid-cols-[0.95fr_1.05fr] md:items-center md:gap-10 md:py-12">
          <div className="space-y-6 md:space-y-7">
            <div className="inline-flex rounded-full bg-lime-100 px-3 py-1 text-sm font-semibold text-lime-950">
              국내 스키장 전체 기반 MVP
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl md:text-7xl">
                스키장 고르고, 준비 누락 없이 출발하세요.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:text-xl md:leading-8">
                날짜, 출발지, 예산, 렌탈 여부를 입력하면 추천 스키장과 예상 비용,
                예약 링크, 준비 체크리스트를 한 번에 만듭니다.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <AnalyticsLink href="/plan" eventName="home_cta_click">
                <Button className="w-full sm:w-auto">
                  스키 트립 만들기 <ArrowRight className="h-4 w-4" />
                </Button>
              </AnalyticsLink>
              <AnalyticsLink href="/resorts" eventName="resort_directory_click">
                <Button variant="secondary" className="w-full sm:w-auto">
                  국내 스키장 둘러보기
                </Button>
              </AnalyticsLink>
            </div>
            <div className="grid max-w-2xl grid-cols-3 gap-2 pt-1 sm:gap-3 md:pt-2">
              <Metric icon={<MapPinned />} label="추천" value="Top 3" />
              <Metric icon={<ReceiptText />} label="비용" value="날짜별" />
              <Metric icon={<CheckCircle2 />} label="관리" value="체크" />
            </div>
          </div>
          <div className="grid gap-4">
            <ProductPreview activeCount={active.length} />
          </div>
        </div>
      </section>
      <section className="page-shell grid gap-3 py-6 sm:gap-4 sm:py-8 md:grid-cols-3">
        <Feature icon={<Route />} title="조건 기반 추천" description="출발지, 날짜, 예산, 우선순위를 반영해 운영 중인 스키장만 추천합니다." />
        <Feature icon={<ReceiptText />} title="가격 비교" description="리프트권, 렌탈, 교통비를 항목별로 나누고 선택 전에는 범위로 보여줍니다." />
        <Feature icon={<ShieldCheck />} title="공유 체크리스트" description="편집 링크와 읽기 전용 공유 링크를 분리해 동행자에게 상태만 공유합니다." />
      </section>
      <section className="border-y bg-zinc-950 text-white">
        <div className="page-shell grid gap-8 py-12 md:grid-cols-[0.9fr_1.1fr] md:items-center md:py-16">
          <div>
            <p className="text-sm font-semibold text-lime-300">왜 필요한가</p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
              스키장 찾는 시간보다, 준비 빠뜨릴까 걱정하는 시간이 더 깁니다.
            </h2>
          </div>
          <div className="grid gap-3">
            <ProblemRow label="정보" text="리프트권, 렌탈, 셔틀, 운영현황 링크가 스키장마다 흩어져 있습니다." />
            <ProblemRow label="가격" text="날짜, 시간권, 렌탈샵에 따라 비용이 달라져 비교가 번거롭습니다." />
            <ProblemRow label="준비" text="초보자는 장갑, 고글, 보호대, 운영 확인 같은 기본 준비도 놓치기 쉽습니다." />
          </div>
        </div>
      </section>
      <section className="page-shell py-12 md:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold text-lime-700">How it works</p>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl">세 번만 결정하면 트립이 만들어집니다.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Step number="01" icon={<MapPinned />} title="조건 입력" text="방문 날짜, 출발지, 인원, 교통, 장비/의류 보유 여부를 입력합니다." />
          <Step number="02" icon={<WalletCards />} title="추천 비교" text="스키장 3곳을 이동 시간, 예상 비용, 렌탈 후보와 함께 비교합니다." />
          <Step number="03" icon={<ClipboardCheck />} title="준비 관리" text="트립 생성 후 예약/결제/준비 상태를 체크리스트로 업데이트합니다." />
        </div>
      </section>
      <section className="bg-[#f4f6f0]">
        <div className="page-shell grid gap-8 py-12 md:grid-cols-[1fr_1fr] md:items-center md:py-16">
          <div className="space-y-4">
            <p className="text-sm font-semibold text-lime-700">For beginners</p>
            <h2 className="text-3xl font-black leading-tight sm:text-4xl">
              처음 가는 사람에게 필요한 건, 멋진 설명보다 빠뜨리지 않는 순서입니다.
            </h2>
            <p className="leading-7 text-muted-foreground">
              Korean Ski는 스키장 추천에서 끝나지 않고, 리프트권 확인부터 렌탈샵 선택,
              운영현황 확인, 준비물까지 하나의 트립으로 묶어 관리합니다.
            </p>
          </div>
          <div className="grid gap-3">
            <ValueRow icon={<Snowflake />} title="초보 친화 추천" text="초보 점수, 접근성, 렌탈 편의성을 함께 반영합니다." />
            <ValueRow icon={<ReceiptText />} title="날짜 기준 비용" text="방문 날짜와 시간권을 기준으로 예상 비용을 계산합니다." />
            <ValueRow icon={<ShieldCheck />} title="읽기 전용 공유" text="동행자에게는 수정 권한 없이 일정과 준비 상태만 공유합니다." />
          </div>
        </div>
      </section>
      <section className="page-shell py-12 md:py-16">
        <div className="rounded-xl border bg-zinc-950 p-6 text-white md:p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-semibold text-lime-300">Ready</p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">이번 주말 스키 트립을 3분 안에 만들어보세요.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">
                로그인 없이 시작하고, 트립이 만들어지면 편집 링크와 읽기 전용 공유 링크로 관리합니다.
              </p>
            </div>
            <AnalyticsLink href="/plan" eventName="home_bottom_cta_click">
              <Button className="w-full bg-lime-300 text-zinc-950 hover:bg-lime-200 md:w-auto">
                트립 만들기 <ArrowRight className="h-4 w-4" />
              </Button>
            </AnalyticsLink>
          </div>
        </div>
      </section>
    </main>
  );
}

function ProductPreview({ activeCount }: { activeCount: number }) {
  return (
    <div className="rounded-xl border bg-white p-2 shadow-2xl shadow-zinc-200/80 sm:p-3">
      <div className="rounded-lg bg-zinc-950 p-3 text-white sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-zinc-300">추천 결과 미리보기</div>
            <div className="mt-1 text-xl font-black sm:text-2xl">비발디파크 스키월드</div>
          </div>
          <div className="w-fit rounded-md bg-lime-300 px-3 py-2 text-center text-zinc-950">
            <div className="text-xs font-bold">운영</div>
            <div className="text-xl font-black">{activeCount}</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-5">
          <PreviewStat label="이동" value="1시간 35분" />
          <PreviewStat label="예상" value="16.8만원~" />
          <PreviewStat label="렌탈" value="2곳" />
        </div>
      </div>

      <div className="grid gap-3 p-2 sm:p-3 md:grid-cols-[1fr_0.85fr]">
        <div className="space-y-3">
          <PreviewCard title="추천 이유">
            <PreviewLine text="초보자 코스와 렌탈 동선이 좋습니다." />
            <PreviewLine text="셔틀 접근성이 좋아 당일치기에 적합합니다." />
            <PreviewLine text="야간 스키 조건에 맞습니다." />
          </PreviewCard>
          <PreviewCard title="예약 링크">
            <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-sm font-semibold">
              공식 예매 확인
              <ExternalLink className="h-4 w-4" />
            </div>
          </PreviewCard>
        </div>
        <PreviewCard title="준비 체크">
          <ChecklistItem done text="리프트권 확인" />
          <ChecklistItem done text="렌탈샵 선택" />
          <ChecklistItem text="운영현황 확인" />
          <ChecklistItem text="장갑/고글 준비" />
          <div className="mt-4 rounded-md bg-lime-100 p-3">
            <div className="text-xs font-semibold text-lime-900">진행률</div>
            <div className="mt-1 h-2 rounded-full bg-white">
              <div className="h-2 w-1/2 rounded-full bg-lime-500" />
            </div>
          </div>
        </PreviewCard>
      </div>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-3 sm:p-4">
        <div className="mb-2 text-zinc-500 sm:mb-3 [&_svg]:h-5 [&_svg]:w-5">{icon}</div>
        <div className="text-xs font-semibold text-muted-foreground">{label}</div>
        <div className="text-base font-black sm:text-lg">{value}</div>
      </CardContent>
    </Card>
  );
}

function PreviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white/10 p-2 sm:p-3">
      <div className="text-xs font-semibold text-zinc-400">{label}</div>
      <div className="mt-1 text-xs font-black text-white sm:text-sm">{value}</div>
    </div>
  );
}

function PreviewCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-white p-3 sm:p-4">
      <div className="mb-3 text-sm font-black">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function PreviewLine({ text }: { text: string }) {
  return <div className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">{text}</div>;
}

function ChecklistItem({ text, done = false }: { text: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {done ? <CheckCircle2 className="h-4 w-4 text-lime-600" /> : <Circle className="h-4 w-4 text-zinc-300" />}
      <span className={done ? "font-semibold" : "text-muted-foreground"}>{text}</span>
    </div>
  );
}

function Feature({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-white p-4 sm:p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-lime-100 text-lime-900 [&_svg]:h-5 [&_svg]:w-5">
        {icon}
      </div>
      <h2 className="font-black">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

function ProblemRow({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="text-sm font-black text-lime-300">{label}</div>
      <p className="mt-1 text-sm leading-6 text-zinc-300">{text}</p>
    </div>
  );
}

function Step({
  number,
  icon,
  title,
  text
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-lg border bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-lime-100 text-lime-900 [&_svg]:h-5 [&_svg]:w-5">
          {icon}
        </div>
        <div className="text-sm font-black text-zinc-300">{number}</div>
      </div>
      <h3 className="mt-5 text-xl font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}

function ValueRow({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-4 rounded-lg border bg-white p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-zinc-950 text-lime-300 [&_svg]:h-5 [&_svg]:w-5">
        {icon}
      </div>
      <div>
        <h3 className="font-black">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
