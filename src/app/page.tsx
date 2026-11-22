import { ArrowRight, CheckCircle2, Link2, ShieldCheck } from "lucide-react";
import { confidenceMeta, confidenceOrder } from "@/components/confidence-badge";
import { AnalyticsLink } from "@/components/analytics-link";
import { CinematicHero } from "@/components/ui/cinematic-landing-hero";
import { HeroQuickForm } from "@/components/ui/hero-quick-form";
import { TripResultPreviewCard, type SampleRow } from "@/components/ui/trip-result-preview-card";
import { seasonResearchRecords } from "@/data/season-research";
import { rentalShops, resorts } from "@/data/resorts";
import { getRecommendations } from "@/lib/recommendation";
import { absoluteUrl, jsonLd, siteDescription } from "@/lib/seo";
import { formatCurrency, formatMinutes } from "@/lib/utils";

const latestCheckedAt = seasonResearchRecords.reduce((latest, record) => (record.lastCheckedAt > latest ? record.lastCheckedAt : latest), "");

const fallbackRows: SampleRow[] = [
  { id: "konjiam", name: "곤지암리조트", time: "45분", cost: "₩17,984~₩22,979", confidence: "confirmed" },
  { id: "jisan", name: "지산 포레스트 리조트", time: "55분", cost: "₩21,600~₩27,600", confidence: "estimated" },
  { id: "vivaldi", name: "비발디파크", time: "1시간 35분", cost: "₩35,280~₩45,080", confidence: "estimated" }
];

// Computed from the real recommendation engine at build time for a sample trip (2 people, same day, from Gangnam).
function buildSample(): { rows: SampleRow[]; label: string } {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  while (date.getDay() !== 6) date.setDate(date.getDate() + 1);
  const visitDate = date.toISOString().slice(0, 10);
  try {
    const recommendations = getRecommendations({
      visitDate,
      departureLocation: "seoul-gangnam",
      peopleCount: 2,
      tripDuration: "same_day",
      skillLevel: "beginner",
      rideType: "ski",
      ownsEquipment: false,
      ownsClothing: false,
      transportType: "car",
      priorities: ["beginner", "close", "rental"],
      liftTicketTimeSlot: "4h"
    }).slice(0, 3);
    if (recommendations.length < 3) throw new Error("not enough recommendations");
    return {
      rows: recommendations.map((item) => ({
        id: item.resort.id,
        name: item.resort.name,
        time: formatMinutes(item.travelMinutes),
        cost: `${formatCurrency(item.cost.min)}~${formatCurrency(item.cost.max)}`,
        confidence: item.cost.confidence
      })),
      label: `강남 출발 · 2명 · ${visitDate.slice(5).replace("-", "/")}(토)`
    };
  } catch {
    return { rows: fallbackRows, label: "강남 출발 · 2명 · 당일" };
  }
}

const checklistSample = [
  { label: "리프트권 예약", done: true },
  { label: "렌탈 장비 선택", done: true },
  { label: "셔틀 시간 확인", done: false },
  { label: "장갑·고글 챙기기", done: false }
];

const faqs = [
  { q: "가격은 실시간 견적인가요?", a: "아니요. 시즌별로 확인한 참고 가격이며, 항목마다 출처와 확인일, 신뢰도를 함께 보여 드려요. 결제 전에는 공식 판매처에서 최신 가격을 확인해 주세요." },
  { q: "로그인 없이도 쓸 수 있나요?", a: "네. 로그인 없이 스키 여행 계획(트립)을 만들 수 있어요. 대신 편집 링크를 잃으면 다시 찾기 어려우니, 저장하려면 로그인해 두세요." },
  { q: "동행자와는 어떻게 공유하나요?", a: "보기 전용 또는 편집 가능한 링크를 여러 개 만들 수 있고, 링크마다 따로 폐기할 수 있어요. 가입한 계정을 초대할 수도 있어요." },
  { q: "예약이나 결제도 대신 해 주나요?", a: "아니요. 예약은 각 리조트와 렌탈샵의 공식 링크로 연결해요. 설레일에서는 예약 전 가격 비교와 예약·결제·준비 상태 체크리스트를 제공해요." }
];

export default function HomePage() {
  const sample = buildSample();
  const checkedDate = latestCheckedAt ? latestCheckedAt.replaceAll("-", ".") : "";

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${absoluteUrl("/")}#website`, name: "설레일", alternateName: "Seolleil", url: absoluteUrl("/"), inLanguage: "ko-KR", description: siteDescription },
      { "@type": "Organization", "@id": `${absoluteUrl("/")}#organization`, name: "설레일", url: absoluteUrl("/"), logo: absoluteUrl("/icon.svg") }
    ]
  };

  return (
    <main id="main-content" className="bg-background" tabIndex={-1}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
      <CinematicHero resorts={resorts.filter(resort => resort.operationStatus === "operating").map(({ id, name, region }) => ({ id, name, region }))} />

      <section aria-label="수록 데이터" className="page-shell">
        <dl className="grid grid-cols-3 gap-4 border-y py-5 sm:py-6">
          <div><dt className="text-xs text-muted-foreground sm:text-sm">수록 스키장</dt><dd className="mt-1 text-xl font-semibold tabular-nums sm:text-2xl">{resorts.length}곳</dd></div>
          <div><dt className="text-xs text-muted-foreground sm:text-sm">수록 렌탈샵</dt><dd className="mt-1 text-xl font-semibold tabular-nums sm:text-2xl">{rentalShops.length}곳</dd></div>
          <div><dt className="text-xs text-muted-foreground sm:text-sm">최근 가격 확인</dt><dd className="mt-1 text-xl font-semibold tabular-nums sm:text-2xl">{checkedDate}</dd></div>
        </dl>
      </section>

      <section className="py-16 sm:py-24">
        <div className="page-shell">
          <h2 className="max-w-2xl text-balance text-3xl font-semibold leading-tight sm:text-4xl">스키 여행 준비, 한곳에서</h2>

          <div className="mt-10 grid gap-4 lg:grid-cols-12">
            <article className="rounded-2xl border bg-card p-6 lg:col-span-7 lg:p-8">
              <h3 className="text-lg font-semibold">가격마다 믿을 수 있는 정도를 표시해요</h3>
              <p className="mt-2 text-sm text-muted-foreground">출처와 확인일을 함께 보여 주고, 확정되지 않은 가격은 점선으로 구분해요.</p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {confidenceOrder.map(key => ({ key, ...confidenceMeta[key] })).map(level => (
                  <li key={level.key} className={`rounded-lg border bg-background p-4 ${level.ring}`}>
                    <p className="flex items-center gap-2 text-sm font-medium"><span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${level.dot}`} />{level.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{level.note}</p>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border bg-card p-6 lg:col-span-5 lg:p-8">
              <h3 className="text-lg font-semibold">출발 전 해야 할 일을 체크해요</h3>
              <p className="mt-2 text-sm text-muted-foreground">예약·결제·준비 상태를 체크하면 진행률이 올라가요.</p>
              <div className="mt-6">
                <div className="flex items-baseline justify-between"><span className="text-sm text-muted-foreground">준비 진행률</span><span className="text-xl font-semibold tabular-nums">50%</span></div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted"><div className="h-full w-1/2 rounded-full bg-primary" /></div>
                <ul className="mt-4 grid gap-2">
                  {checklistSample.map(item => (
                    <li key={item.label} className="flex items-center gap-3 text-sm">
                      {item.done ? <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} /> : <span aria-hidden="true" className="h-4 w-4 shrink-0 rounded-full border border-muted-foreground/50" />}
                      <span className={item.done ? "text-muted-foreground line-through" : ""}>{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <article className="rounded-2xl border bg-card p-6 lg:col-span-12 lg:p-8">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-center">
                <div>
                  <h3 className="text-lg font-semibold">링크 하나로 동행자와 나눠요</h3>
                  <p className="mt-2 text-sm text-muted-foreground">보기 전용과 편집 가능 링크를 따로 만들고, 필요 없어지면 링크마다 폐기할 수 있어요.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border bg-background p-4">
                    <p className="flex items-center gap-2 text-sm font-medium"><Link2 aria-hidden="true" className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />보기 전용</p>
                    <p className="mt-2 truncate rounded-md bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">seolleil.com/share/••••••••</p>
                    <p className="mt-2 text-xs text-muted-foreground">일정과 준비 상태만 볼 수 있어요</p>
                  </div>
                  <div className="rounded-lg border bg-background p-4">
                    <p className="flex items-center gap-2 text-sm font-medium"><ShieldCheck aria-hidden="true" className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />편집 가능</p>
                    <p className="mt-2 truncate rounded-md bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">seolleil.com/trips/••••••••</p>
                    <p className="mt-2 text-xs text-muted-foreground">체크리스트와 비용을 함께 고쳐요</p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="recommend" className="scroll-mt-20 border-t py-14 sm:py-20">
        <div className="page-shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <h2 className="text-balance text-2xl font-semibold leading-tight sm:text-3xl">어디 갈지 모르겠다면 추천받아요</h2>
            <p className="mt-2 text-muted-foreground">날짜와 출발지만 있으면 이동 시간과 리프트·렌탈·교통 예상 총액으로 스키장을 비교해 드려요. 로그인은 나중에 해도 괜찮아요.</p>
            <HeroQuickForm />
            <p className="mt-4 text-sm text-muted-foreground">
              인원·장비 같은 조건을 직접 정하려면{" "}
              <AnalyticsLink href="/plan" eventName="home_final_cta_click" className="font-medium text-primary underline-offset-4 hover:underline">조건 직접 입력</AnalyticsLink>
            </p>
          </div>
          <TripResultPreviewCard rows={sample.rows} label={sample.label} />
        </div>
      </section>

      <section className="border-t py-16 sm:py-20">
        <div className="page-shell grid gap-8 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
          <h2 className="text-balance text-2xl font-semibold leading-tight sm:text-3xl">자주 묻는 질문</h2>
          <div className="divide-y rounded-xl border bg-card">
            {faqs.map(item => (
              <details key={item.q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-4 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {item.q}
                  <span aria-hidden="true" className="text-xl text-muted-foreground transition-transform group-open:rotate-45 motion-reduce:transition-none">+</span>
                </summary>
                <p className="pb-2 pt-1 text-sm leading-7 text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>


      <section aria-labelledby="home-closing-title" className="page-shell pb-16 sm:pb-24">
        <div className="flex flex-col gap-6 rounded-2xl bg-primary px-6 py-10 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-14">
          <div className="max-w-xl">
            <h2 id="home-closing-title" className="text-balance text-2xl font-semibold leading-tight sm:text-4xl">올겨울도 설레는 스키 여행,<br />준비는 가볍게 시작해요</h2>
            <p className="mt-3 text-pretty text-primary-foreground/80 sm:text-lg">스키장만 고르면 렌탈·숙박 비교부터 체크리스트, 비용 나누기까지 바로 이어져요.</p>
          </div>
          <AnalyticsLink href="/resorts" eventName="home_closing_cta_click" className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-background px-6 font-semibold text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-primary">스키장 고르러 가기 <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" /></AnalyticsLink>
        </div>
      </section>
    </main>
  );
}
