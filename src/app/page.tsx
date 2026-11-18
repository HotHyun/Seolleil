import { ArrowRight, CheckCircle2, Link2, ShieldCheck } from "lucide-react";
import { confidenceMeta, confidenceOrder } from "@/components/confidence-badge";
import { AnalyticsLink } from "@/components/analytics-link";
import { CinematicHero } from "@/components/ui/cinematic-landing-hero";
import { seasonResearchRecords } from "@/data/season-research";
import { rentalShops, resorts } from "@/data/resorts";
import { getRecommendations } from "@/lib/recommendation";
import { formatCurrency, formatMinutes } from "@/lib/utils";

const latestCheckedAt = seasonResearchRecords.reduce((latest, record) => (record.lastCheckedAt > latest ? record.lastCheckedAt : latest), "");

type CompareRow = { name: string; time: string; cost: string; top: boolean };
const fallbackRows: CompareRow[] = [
  { name: "곤지암리조트", time: "45분", cost: "₩17,984~22,979", top: true },
  { name: "지산 포레스트 리조트", time: "55분", cost: "₩21,600~27,600", top: false },
  { name: "비발디파크", time: "1시간 35분", cost: "₩35,280~45,080", top: false }
];

// Computed from the real recommendation engine at build time for a sample trip (2 people, same day, from Gangnam).
function buildSample(): { rows: CompareRow[]; label: string } {
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
      rows: recommendations.map((item, index) => ({
        name: item.resort.name,
        time: formatMinutes(item.travelMinutes),
        cost: `${formatCurrency(item.cost.min)}~${formatCurrency(item.cost.max)}`,
        top: index === 0
      })),
      label: `서울 강남 출발·2명·당일 기준 예시(${visitDate.slice(5).replace("-", "/")} 토요일)이며, 입력한 조건에 따라 달라져요.`
    };
  } catch {
    return { rows: fallbackRows, label: "예시 화면이며 실제 값은 입력한 조건에 따라 달라져요." };
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
  { q: "로그인 없이도 쓸 수 있나요?", a: "네. 로그인 없이 트립을 만들 수 있어요. 대신 편집 링크를 잃으면 다시 찾기 어려우니, 저장하려면 로그인해 두세요." },
  { q: "동행자와는 어떻게 공유하나요?", a: "보기 전용 또는 편집 가능한 링크를 여러 개 만들 수 있고, 링크마다 따로 폐기할 수 있어요. 가입한 계정을 초대할 수도 있어요." },
  { q: "예약이나 결제도 대신 해 주나요?", a: "아니요. 예약은 각 리조트와 렌탈샵의 공식 링크로 연결하고, 설레일에서는 예약·결제·준비 상태를 체크리스트로 관리해요." }
];

export default function HomePage() {
  const sample = buildSample();
  const checkedDate = latestCheckedAt ? latestCheckedAt.replaceAll("-", ".") : "";

  return (
    <main id="main-content" className="overflow-hidden bg-background" tabIndex={-1}>
      <CinematicHero />

      <section aria-label="수록 데이터" className="border-b bg-card">
        <dl className="page-shell grid grid-cols-3 divide-x py-5 text-center sm:py-6">
          <div className="px-2"><dt className="text-xs font-semibold text-muted-foreground sm:text-sm">수록 스키장</dt><dd className="mt-1 text-xl font-black sm:text-2xl">{resorts.length}곳</dd></div>
          <div className="px-2"><dt className="text-xs font-semibold text-muted-foreground sm:text-sm">수록 렌탈샵</dt><dd className="mt-1 text-xl font-black sm:text-2xl">{rentalShops.length}곳</dd></div>
          <div className="px-2"><dt className="text-xs font-semibold text-muted-foreground sm:text-sm">최근 가격 확인</dt><dd className="mt-1 text-lg font-black sm:text-2xl">{checkedDate}</dd></div>
        </dl>
      </section>

      <section className="py-20 sm:py-28">
        <div className="page-shell">
          <div className="max-w-2xl">
            <h2 className="text-balance text-3xl font-black leading-[1.1] tracking-[-.035em] sm:text-5xl">고르고, 계산하고, 챙기고, 나누는 일을 한 화면에서.</h2>
            <p className="mt-4 text-base font-medium leading-7 text-muted-foreground sm:text-lg">스키장을 고르는 순간부터 장갑을 챙기는 순간까지, 트립 하나에 필요한 일이 끊기지 않게 모았어요.</p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-12">
            <article className="relative overflow-hidden rounded-3xl bg-[#071225] p-6 text-white sm:p-8 lg:col-span-7">
              <h3 className="text-xl font-black sm:text-2xl">조건에 맞는 스키장 3곳을 나란히</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/70">출발지·날짜·인원으로 이동 시간과 예상 비용을 한 번에 비교해요.</p>
              <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06]" role="table" aria-label="추천 비교 예시">
                <div role="row" className="grid grid-cols-[1.4fr_1fr_1.4fr] gap-2 border-b border-white/10 px-4 py-2.5 text-xs font-semibold text-white/55">
                  <span role="columnheader">스키장</span><span role="columnheader">이동</span><span role="columnheader" className="text-right">예상 총액</span>
                </div>
                {sample.rows.map(row => (
                  <div role="row" key={row.name} className={`grid grid-cols-[1.4fr_1fr_1.4fr] items-center gap-2 px-4 py-3.5 text-sm ${row.top ? "bg-[#b8f23d]/12" : ""}`}>
                    <span role="cell" className="flex items-center gap-2 font-black">{row.top ? <span className="rounded-md bg-[#b8f23d] px-1.5 py-0.5 text-xs text-[#071225]">1순위</span> : null}{row.name}</span>
                    <span role="cell" className="text-white/80">{row.time}</span>
                    <span role="cell" className={`text-right font-black ${row.top ? "text-[#b8f23d]" : ""}`}>{row.cost}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-white/50">{sample.label}</p>
            </article>

            <article className="rounded-3xl border bg-card p-6 sm:p-8 lg:col-span-5">
              <h3 className="text-xl font-black sm:text-2xl">가격마다 믿을 수 있는 정도를 표시해요</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">출처와 확인일을 함께 보여 주고, 확정되지 않은 가격은 점선으로 구분해요.</p>
              <ul className="mt-6 grid gap-2.5">
                {confidenceOrder.map(key => ({ key, ...confidenceMeta[key] })).map(level => (
                  <li key={level.key} className={`flex items-center gap-3 rounded-xl border bg-background px-4 py-3 ${level.ring}`}>
                    <span aria-hidden="true" className={`h-3 w-3 shrink-0 rounded-full ${level.dot}`} />
                    <span className="text-sm font-black">{level.label}</span>
                    <span className="ml-auto text-xs font-medium text-muted-foreground">{level.note}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-3xl border bg-card p-6 sm:p-8 lg:col-span-5">
              <h3 className="text-xl font-black sm:text-2xl">출발 전 해야 할 일을 빠짐없이</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">예약·결제·준비 상태를 체크하면 진행률이 바로 올라가요.</p>
              <div className="mt-6 rounded-2xl border bg-background p-4">
                <div className="flex items-baseline justify-between"><span className="text-sm font-bold text-muted-foreground">준비 진행률</span><span className="text-2xl font-black text-primary">50%</span></div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full w-1/2 rounded-full bg-primary" /></div>
                <ul className="mt-4 grid gap-2">
                  {checklistSample.map(item => (
                    <li key={item.label} className="flex items-center gap-2.5 text-sm font-semibold">
                      {item.done ? <CheckCircle2 aria-hidden="true" className="h-5 w-5 shrink-0 text-primary" /> : <span aria-hidden="true" className="h-5 w-5 shrink-0 rounded-full border-2 border-muted-foreground/40" />}
                      <span className={item.done ? "text-muted-foreground line-through" : ""}>{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <article className="rounded-3xl border bg-card p-6 sm:p-8 lg:col-span-7">
              <h3 className="text-xl font-black sm:text-2xl">링크 하나로 동행자와 나눠요</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">보기 전용과 편집 가능 링크를 따로 만들고, 필요 없어지면 링크마다 폐기할 수 있어요.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border bg-background p-4">
                  <p className="flex items-center gap-2 text-sm font-black"><Link2 aria-hidden="true" className="h-4 w-4 text-primary" /> 보기 전용 링크</p>
                  <p className="mt-2 truncate rounded-lg bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">ski.hothyun.com/share/••••••••</p>
                  <p className="mt-2 text-xs text-muted-foreground">일정과 준비 상태만 볼 수 있어요.</p>
                </div>
                <div className="rounded-2xl border bg-background p-4">
                  <p className="flex items-center gap-2 text-sm font-black"><ShieldCheck aria-hidden="true" className="h-4 w-4 text-primary" /> 편집 가능 링크</p>
                  <p className="mt-2 truncate rounded-lg bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">ski.hothyun.com/trips/••••••••</p>
                  <p className="mt-2 text-xs text-muted-foreground">체크리스트와 비용을 함께 고쳐요.</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="border-t bg-card py-20 sm:py-24">
        <div className="page-shell grid gap-10 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
          <div>
            <h2 className="text-balance text-3xl font-black leading-[1.1] tracking-[-.035em] sm:text-4xl">출발 전에 자주 묻는 질문</h2>
            <p className="mt-3 text-base font-medium leading-7 text-muted-foreground">더 궁금한 점은 트립을 만들어 보며 확인해 보세요.</p>
          </div>
          <div className="divide-y rounded-2xl border bg-background">
            {faqs.map(item => (
              <details key={item.q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-4 text-base font-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {item.q}
                  <span aria-hidden="true" className="text-xl font-medium text-muted-foreground transition-transform group-open:rotate-45 motion-reduce:transition-none">+</span>
                </summary>
                <p className="pb-2 pt-1 text-sm leading-7 text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell py-16 sm:py-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#071225] px-6 py-14 text-white sm:px-12 sm:py-20">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#b8f23d]/15 blur-3xl" aria-hidden="true" />
          <div className="relative max-w-3xl">
            <h2 className="text-balance text-3xl font-black leading-[1.1] tracking-[-.035em] sm:text-5xl">이번 겨울 첫 트립, 3분이면 계획이 나와요.</h2>
            <p className="mt-4 max-w-xl font-medium leading-7 text-white/70">날짜와 출발지만 입력하면 추천과 예상 비용을 바로 볼 수 있어요. 로그인은 나중에 해도 괜찮아요.</p>
            <AnalyticsLink href="/plan" eventName="home_final_cta_click" className="group mt-8 inline-flex min-h-13 items-center gap-2 rounded-xl bg-[#b8f23d] px-6 py-3.5 font-black text-[#071225] transition hover:-translate-y-0.5 hover:bg-[#c8ff52] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">내 트립 만들기 <ArrowRight aria-hidden="true" className="h-5 w-5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" /></AnalyticsLink>
          </div>
        </div>
      </section>
    </main>
  );
}
