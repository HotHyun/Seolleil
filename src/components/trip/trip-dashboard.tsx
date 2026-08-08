import Link from "next/link";
import { BedDouble, BusFront, CheckCircle2, Clock3, ExternalLink, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRentalShopsForResort } from "@/data/resorts";
import { getSkiShuttleRoutes } from "@/data/ski-shuttles";
import { isTaskComplete } from "@/lib/checklist";
import { getTripDashboardNextAction } from "@/lib/trip-workspace";
import type { TripTaskRecord } from "@/lib/trip-store";
import { lodgingPlanIsComplete, rentalOptionIds, transportPlanIsComplete, type TripSkiPlan } from "@/lib/trip-ski-plan";
import { timeSlotLabels } from "@/lib/constants";

type Trip = { resortId: string; skiPlan: TripSkiPlan; selectedRentalOptionId: string | null; selectedLiftTicketOptionId: string | null; selectedRentalShopId: string | null; liftTicketTimeSlot: string; transportType: string; shuttleRouteId: string | null; shuttleStopId: string | null; lodgingName: string | null; lodgingUrl: string | null; tasks: TripTaskRecord[] };
const transportLabels: Record<string, string> = { car: "자차", shuttle: "스키장 셔틀", bus: "고속·시외버스" };

export function TripDashboard({ trip, basePath }: { trip: Trip; basePath: string }) {
  const shops = getRentalShopsForResort(trip.resortId);
  const plannedRentalDays = trip.skiPlan.days.filter(day => day.rentalShopId && rentalOptionIds(day).length > 0);
  const plannedShopNames = [...new Set(plannedRentalDays.map(day => shops.find(item => item.id === day.rentalShopId)?.name).filter((name): name is string => Boolean(name)))];
  const rentalReady = trip.skiPlan.days.every(day => day.rentalShopId && rentalOptionIds(day).length > 0);
  const liftSummary = [...new Set(trip.skiPlan.days.map(day => timeSlotLabels[day.timeSlot]))].join(" · ");
  const discountedLiftDays = trip.skiPlan.days.filter(day => day.liftTicketOptionId).length;
  const shuttleRoutes = getSkiShuttleRoutes(trip.resortId);
  const transportSummary = trip.skiPlan.transportLegs.map(leg => {
    const route = shuttleRoutes.find(item => item.id === leg.shuttleRouteId);
    return `${leg.direction === "outbound" ? "갈 때" : "올 때"} ${route?.name ?? transportLabels[leg.transportType] ?? leg.transportType}`;
  }).join(" · ");
  const firstShuttleRoute = shuttleRoutes.find(route => trip.skiPlan.transportLegs.some(leg => leg.shuttleRouteId === route.id));
  const lodgingNames = [...new Set(trip.skiPlan.lodgingNights.map(night => night.lodgingName).filter((name): name is string => Boolean(name)))];
  const lodgingReady = lodgingPlanIsComplete(trip.skiPlan);
  const transportReady = transportPlanIsComplete(trip.skiPlan);
  const relevantTasks = trip.tasks.filter(task => task.status !== "not_needed");
  const rentalRelevant = relevantTasks.some(task => task.category === "equipment_rental" || task.category === "clothing_rental");
  const lodgingRelevant = relevantTasks.some(task => task.category === "lodging");
  const liftTask = relevantTasks.find(task => task.category === "lift_ticket");
  const nextAction = getTripDashboardNextAction({
    rentalReady: !rentalRelevant || rentalReady,
    liftReady: !liftTask || isTaskComplete(liftTask.category, liftTask.status),
    lodgingReady: !lodgingRelevant || lodgingReady,
    transportReady,
    checklistReady: relevantTasks.every(task => isTaskComplete(task.category, task.status))
  });
  return <div className="space-y-4">
    <Card className="overflow-hidden border-primary/20"><CardHeader className="bg-gradient-to-r from-primary/15 via-card to-card"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Trip at a glance</p><CardTitle className="mt-2">이번 여행, 지금 정해진 것</CardTitle></div><Link href={`${basePath}?view=${nextAction.view}`}><Button>{nextAction.label}</Button></Link></div></CardHeader><CardContent className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
      <DashboardItem icon={<Shirt />} label="렌탈" value={plannedShopNames.length ? `${trip.skiPlan.days.length}일 · ${plannedShopNames.join(", ")}` : "날짜별 렌탈을 정해 주세요"} detail={rentalReady ? "모든 스키 날짜의 장비·의류 선택됨" : plannedRentalDays.length ? `${plannedRentalDays.length}/${trip.skiPlan.days.length}일 선택됨` : undefined} href={`${basePath}?view=rental_lift#rental`} ready={rentalReady} />
      <DashboardItem icon={<Clock3 />} label="리프트권" value={`${trip.skiPlan.days.length}일 · ${liftSummary}`} detail={[discountedLiftDays ? `${discountedLiftDays}일 할인권` : "공식권 기준", taskState(trip.tasks, "lift_ticket")].filter(Boolean).join(" · ")} href={`${basePath}?view=rental_lift#lift`} ready />
      <DashboardItem icon={<BusFront />} label="교통" value={transportSummary} detail={taskState(trip.tasks, "transport")} href={`${basePath}?view=transport`} externalHref={firstShuttleRoute?.bookingUrl} ready={transportReady} />
      <DashboardItem icon={<BedDouble />} label="숙소" value={trip.skiPlan.lodgingNights.length ? (lodgingNames.length ? `${trip.skiPlan.lodgingNights.length}박 · ${lodgingNames.join(", ")}` : `${trip.skiPlan.lodgingNights.length}박 숙소를 정해 주세요`) : "당일치기 · 숙박 없음"} detail={trip.skiPlan.lodgingNights.length ? `${trip.skiPlan.lodgingNights.filter(night => night.lodgingName).length}/${trip.skiPlan.lodgingNights.length}박 선택됨` : undefined} href={`${basePath}?view=lodging`} externalHref={trip.skiPlan.lodgingNights.find(night => night.lodgingUrl)?.lodgingUrl ?? undefined} ready={lodgingReady} />
    </CardContent></Card>
  </div>;
}

function DashboardItem({ icon, label, value, detail, href, externalHref, ready }: { icon: React.ReactNode; label: string; value: string; detail?: string; href: string; externalHref?: string; ready: boolean }) { return <div className="group rounded-2xl border bg-background/70 p-4 transition-colors hover:border-primary/40"><div className="flex items-start gap-3"><span className="rounded-xl bg-muted p-2 text-primary [&>svg]:h-4 [&>svg]:w-4">{icon}</span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="text-xs font-bold text-muted-foreground">{label}</p>{ready ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : null}</div><p className="mt-1 font-black leading-5">{value}</p>{detail ? <p className="mt-1 text-xs text-muted-foreground">{detail}</p> : null}<div className="mt-3 flex gap-3"><Link href={href} className="text-xs font-bold text-primary">{ready ? "선택 변경" : "둘러보기"}</Link>{externalHref ? <a href={externalHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground">예약 링크 <ExternalLink className="h-3 w-3" /></a> : null}</div></div></div></div>; }

function taskState(tasks: TripTaskRecord[], category: string) { const task = tasks.find(item => item.category === category && item.status !== "not_needed"); return task ? (isTaskComplete(task.category, task.status) ? "예약·준비 완료" : task.status === "planned" ? "선택됨 · 예약 확인 필요" : "예약 상태 확인 필요") : undefined; }
