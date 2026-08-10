import { BedDouble, BusFront, CalendarDays, ExternalLink, Shirt } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getSkiShuttleRoutes } from "@/data/ski-shuttles";
import { timeSlotLabels } from "@/lib/constants";
import { rentalOptionIds, tripDayTypeLabel, type TripSkiPlan } from "@/lib/trip-ski-plan";
import type { RentalPriceRule, RentalShop } from "@/lib/types";
import type { TripDecisionView } from "@/lib/trip-workspace";
import { formatCurrency } from "@/lib/utils";

type Trip = { resortId: string; peopleCount: number; skiPlan: TripSkiPlan };
type RentalGroup = { shop: RentalShop; options: RentalPriceRule[] };

export function TripDecisionReadOnly({ view, trip, rentalGroups }: { view: TripDecisionView; trip: Trip; rentalGroups: RentalGroup[] }) {
  const copy = view === "rental_lift"
    ? { eyebrow: "저장된 스키 계획", title: "결정된 스키 일정과 렌탈", description: "소유자가 날짜별로 저장한 이용 시간, 렌탈과 리프트권입니다.", icon: <Shirt aria-hidden="true" /> }
    : view === "lodging"
      ? { eyebrow: "저장된 숙박 계획", title: "결정된 숙박", description: "숙박 밤마다 저장된 숙소와 비용입니다.", icon: <BedDouble aria-hidden="true" /> }
      : { eyebrow: "저장된 교통 계획", title: "결정된 왕복 교통", description: "가는 길과 돌아오는 길에 저장된 이동수단입니다.", icon: <BusFront aria-hidden="true" /> };

  return <div className="space-y-4" data-testid="trip-decision-read-only">
    <section className="rounded-2xl border border-sky-500/25 bg-gradient-to-br from-sky-500/10 via-card to-card p-5 sm:p-6"><div className="flex items-start gap-4"><span className="rounded-2xl bg-sky-600 p-3 text-white shadow-lg shadow-sky-600/20 [&>svg]:h-5 [&>svg]:w-5">{copy.icon}</span><div className="min-w-0"><p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">{copy.eyebrow}</p><h1 data-trip-workspace-title tabIndex={-1} className="mt-1 text-pretty text-2xl font-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{copy.title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{copy.description}</p></div></div></section>
    {view === "rental_lift" ? <RentalPlan trip={trip} groups={rentalGroups} /> : null}
    {view === "lodging" ? <LodgingPlan plan={trip.skiPlan} /> : null}
    {view === "transport" ? <TransportPlan resortId={trip.resortId} plan={trip.skiPlan} /> : null}
  </div>;
}

function RentalPlan({ trip, groups }: { trip: Trip; groups: RentalGroup[] }) {
  const shops = new Map(groups.map(group => [group.shop.id, group]));
  const options = new Map(groups.flatMap(group => group.options.map(option => [option.id, option] as const)));
  return <Card><CardHeader><SectionTitle icon={<CalendarDays aria-hidden="true" />} title={`${trip.skiPlan.days.length}일 스키 계획`} description="날짜별로 확정된 선택만 표시합니다." /></CardHeader><CardContent className="divide-y">{trip.skiPlan.days.map(day => {
    const group = day.rentalShopId ? shops.get(day.rentalShopId) : undefined;
    const selectedOptions = rentalOptionIds(day).map(id => options.get(id)).filter((option): option is RentalPriceRule => Boolean(option));
    const lift = day.liftTicketOptionId ? options.get(day.liftTicketOptionId) : undefined;
    return <article key={day.date} className="py-4 first:pt-0 last:pb-0"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-black">{formatDate(day.date)}</h2><p className="mt-1 text-xs font-semibold text-muted-foreground">{tripDayTypeLabel(day.date)} · {timeSlotLabels[day.timeSlot]}</p></div><span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold">{group?.shop.name ?? "렌탈 미정"}</span></div><dl className="mt-3 grid gap-2 sm:grid-cols-2"><ReadOnlyField label="장비·의류" value={selectedOptions.length ? selectedOptions.map(option => option.label).join(" · ") : "선택 없음"} /><ReadOnlyField label="리프트권" value={lift ? lift.label : `공식 ${timeSlotLabels[day.timeSlot]}`} /></dl>{group?.shop.url ? <ExternalButton href={group.shop.url}>선택한 렌탈샵 원문</ExternalButton> : null}</article>;
  })}</CardContent></Card>;
}

function LodgingPlan({ plan }: { plan: TripSkiPlan }) {
  if (!plan.lodgingNights.length) return <EmptyDecision icon={<BedDouble aria-hidden="true" />} title="당일치기 · 숙박 없음" description="이 트립에는 숙박 밤이 없습니다." />;
  return <Card><CardHeader><SectionTitle icon={<BedDouble aria-hidden="true" />} title={`${plan.lodgingNights.length}박 숙박 계획`} description="체크인 날짜 기준입니다." /></CardHeader><CardContent className="divide-y">{plan.lodgingNights.map((night, index) => <article key={night.date} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="text-xs font-black text-primary">{index + 1}박 · {formatDate(night.date)}</p><h2 className="mt-1 break-words font-black">{night.lodgingName ?? "숙소 미정"}</h2><p className="mt-1 text-sm font-semibold text-muted-foreground">{night.cost === null ? "숙박비 미정" : formatCurrency(night.cost)}</p></div>{night.lodgingUrl ? <ExternalButton href={night.lodgingUrl}>숙소 원문</ExternalButton> : null}</article>)}</CardContent></Card>;
}

function TransportPlan({ resortId, plan }: { resortId: string; plan: TripSkiPlan }) {
  const routes = getSkiShuttleRoutes(resortId);
  const labels = { car: "자차", shuttle: "스키장 제휴 셔틀", bus: "고속·시외버스" };
  return <Card><CardHeader><SectionTitle icon={<BusFront aria-hidden="true" />} title="가는 길과 돌아오는 길" description="각 이동 구간에 저장된 조건입니다." /></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2">{plan.transportLegs.map(leg => {
    const route = routes.find(item => item.id === leg.shuttleRouteId);
    const stop = route?.stops.find(item => item.id === leg.shuttleStopId);
    return <article key={leg.direction} className="rounded-xl border bg-muted/20 p-4"><p className="text-xs font-black uppercase tracking-wider text-primary">{leg.direction === "outbound" ? "가는 길" : "돌아오는 길"}</p><h2 className="mt-2 font-black">{formatDate(leg.date)}</h2><p className="mt-2 text-sm font-semibold">{route?.name ?? labels[leg.transportType]}</p>{stop ? <p className="mt-1 text-xs leading-5 text-muted-foreground">{stop.name}{stop.departureTime ? ` · ${stop.departureTime} 출발` : ""}</p> : leg.transportType === "shuttle" ? <p className="mt-1 text-xs text-muted-foreground">노선·탑승지 미정</p> : null}{route?.bookingUrl ? <ExternalButton href={route.bookingUrl}>셔틀 예약 원문</ExternalButton> : null}</article>;
  })}</CardContent></Card>;
}

function SectionTitle({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) { return <div className="flex items-start gap-3"><span className="rounded-xl bg-muted p-2.5 text-primary [&>svg]:h-5 [&>svg]:w-5">{icon}</span><div><h2 className="text-lg font-black">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{description}</p></div></div>; }
function ReadOnlyField({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-muted/40 p-3"><dt className="text-xs font-bold text-muted-foreground">{label}</dt><dd className="mt-1 break-words text-sm font-black">{value}</dd></div>; }
function EmptyDecision({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) { return <div className="rounded-2xl border border-dashed bg-muted/20 p-6 text-center"><span className="mx-auto block w-fit text-primary [&>svg]:h-6 [&>svg]:w-6">{icon}</span><h2 className="mt-3 font-black">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{description}</p></div>; }
function ExternalButton({ href, children }: { href: string; children: React.ReactNode }) { return <a href={href} target="_blank" rel="noreferrer" className="mt-3 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 text-xs font-black text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{children}<ExternalLink aria-hidden="true" className="h-3.5 w-3.5" /></a>; }
function formatDate(date: string) { return new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric", weekday: "short", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)); }
