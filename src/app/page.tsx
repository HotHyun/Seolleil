import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Circle,
  ExternalLink,
  MapPinned,
  ReceiptText,
  Route,
  ShieldCheck
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
        <div className="page-shell grid min-h-[calc(100vh-4rem)] items-center gap-10 py-10 md:grid-cols-[0.95fr_1.05fr] md:py-12">
          <div className="space-y-7">
            <div className="inline-flex rounded-full bg-lime-100 px-3 py-1 text-sm font-semibold text-lime-950">
              국내 스키장 전체 기반 MVP
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">
                스키장 고르고, 준비 누락 없이 출발하세요.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
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
            <div className="grid max-w-2xl grid-cols-3 gap-3 pt-2">
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
      <section className="page-shell grid gap-4 py-8 md:grid-cols-3">
        <Feature icon={<Route />} title="조건 기반 추천" description="출발지, 날짜, 예산, 우선순위를 반영해 운영 중인 스키장만 추천합니다." />
        <Feature icon={<ReceiptText />} title="가격 비교" description="리프트권, 렌탈, 교통비를 항목별로 나누고 선택 전에는 범위로 보여줍니다." />
        <Feature icon={<ShieldCheck />} title="공유 체크리스트" description="편집 링크와 읽기 전용 공유 링크를 분리해 동행자에게 상태만 공유합니다." />
      </section>
    </main>
  );
}

function ProductPreview({ activeCount }: { activeCount: number }) {
  return (
    <div className="rounded-xl border bg-white p-3 shadow-2xl shadow-zinc-200/80">
      <div className="rounded-lg bg-zinc-950 p-4 text-white">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-zinc-300">추천 결과 미리보기</div>
            <div className="mt-1 text-2xl font-black">비발디파크 스키월드</div>
          </div>
          <div className="rounded-md bg-lime-300 px-3 py-2 text-center text-zinc-950">
            <div className="text-xs font-bold">운영</div>
            <div className="text-xl font-black">{activeCount}</div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <PreviewStat label="이동" value="1시간 35분" />
          <PreviewStat label="예상" value="16.8만원~" />
          <PreviewStat label="렌탈" value="2곳" />
        </div>
      </div>

      <div className="grid gap-3 p-3 md:grid-cols-[1fr_0.85fr]">
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
      <CardContent className="p-4">
        <div className="mb-3 text-zinc-500 [&_svg]:h-5 [&_svg]:w-5">{icon}</div>
        <div className="text-xs font-semibold text-muted-foreground">{label}</div>
        <div className="text-lg font-black">{value}</div>
      </CardContent>
    </Card>
  );
}

function PreviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white/10 p-3">
      <div className="text-xs font-semibold text-zinc-400">{label}</div>
      <div className="mt-1 text-sm font-black text-white">{value}</div>
    </div>
  );
}

function PreviewCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-white p-4">
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
    <div className="rounded-lg border bg-white p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-lime-100 text-lime-900 [&_svg]:h-5 [&_svg]:w-5">
        {icon}
      </div>
      <h2 className="font-black">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}
