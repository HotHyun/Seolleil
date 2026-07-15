import Link from "next/link";
import { BedDouble, BusFront, CheckCircle2, Clock3, ExternalLink, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { rentalPriceRules } from "@/data/prices";
import { getRentalShopsForResort } from "@/data/resorts";
import { isTaskComplete } from "@/lib/checklist";
import type { TripTaskRecord } from "@/lib/trip-store";
import { formatCurrency } from "@/lib/utils";

type Trip = { resortId: string; selectedRentalOptionId: string | null; selectedRentalShopId: string | null; liftTicketTimeSlot: string; transportType: string; lodgingName: string | null; lodgingUrl: string | null; tasks: TripTaskRecord[] };
const liftLabels: Record<string, string> = { "2h": "2시간권", "3h": "3시간권", "4h": "4시간권", "6h": "6시간권", night: "야간권", full_day: "종일권" };
const transportLabels: Record<string, string> = { car: "자차", shuttle: "스키장 셔틀", bus: "고속·시외버스" };

export function TripDashboard({ trip, basePath }: { trip: Trip; basePath: string }) {
  const option = trip.selectedRentalOptionId ? rentalPriceRules.find(item => item.id === trip.selectedRentalOptionId) : null;
  const shop = getRentalShopsForResort(trip.resortId).find(item => item.id === (trip.selectedRentalShopId ?? option?.rentalShopId));
  return <div className="space-y-4">
    <Card className="overflow-hidden border-primary/20"><CardHeader className="bg-gradient-to-r from-primary/15 via-card to-card"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Trip at a glance</p><CardTitle className="mt-2">이번 여행, 지금 정해진 것</CardTitle></div><Link href={`${basePath}?view=decisions`}><Button>선택·예약 이어가기</Button></Link></div></CardHeader><CardContent className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
      <DashboardItem icon={<Shirt />} label="렌탈" value={shop ? `${shop.name}${option ? ` · ${option.label}` : ""}` : "아직 정하지 않았어요"} detail={option?.representativePrice ? `1인 ${formatCurrency(option.representativePrice)}` : shop ? "업체 선택됨 · 가격 원문 확인 필요" : undefined} href={`${basePath}?view=decisions#rental`} ready={Boolean(shop)} />
      <DashboardItem icon={<Clock3 />} label="리프트권" value={liftLabels[trip.liftTicketTimeSlot] ?? trip.liftTicketTimeSlot} detail={taskState(trip.tasks, "lift_ticket")} href={`${basePath}?view=decisions#lift`} ready />
      <DashboardItem icon={<BusFront />} label="교통" value={transportLabels[trip.transportType] ?? trip.transportType} detail={taskState(trip.tasks, "transport")} href={`${basePath}?view=decisions#transport`} ready />
      <DashboardItem icon={<BedDouble />} label="숙소" value={trip.lodgingName ?? "아직 정하지 않았어요"} detail={taskState(trip.tasks, "lodging")} href={`${basePath}?view=decisions#lodging`} externalHref={trip.lodgingUrl ?? undefined} ready={Boolean(trip.lodgingName)} />
    </CardContent></Card>
  </div>;
}

function DashboardItem({ icon, label, value, detail, href, externalHref, ready }: { icon: React.ReactNode; label: string; value: string; detail?: string; href: string; externalHref?: string; ready: boolean }) { return <div className="group rounded-2xl border bg-background/70 p-4 transition-colors hover:border-primary/40"><div className="flex items-start gap-3"><span className="rounded-xl bg-muted p-2 text-primary [&>svg]:h-4 [&>svg]:w-4">{icon}</span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="text-xs font-bold text-muted-foreground">{label}</p>{ready ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : null}</div><p className="mt-1 font-black leading-5">{value}</p>{detail ? <p className="mt-1 text-xs text-muted-foreground">{detail}</p> : null}<div className="mt-3 flex gap-3"><Link href={href} className="text-xs font-bold text-primary">{ready ? "선택 변경" : "둘러보기"}</Link>{externalHref ? <a href={externalHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground">예약 링크 <ExternalLink className="h-3 w-3" /></a> : null}</div></div></div></div>; }

function taskState(tasks: TripTaskRecord[], category: string) { const task = tasks.find(item => item.category === category && item.status !== "not_needed"); return task ? (isTaskComplete(task.category, task.status) ? "예약·준비 완료" : task.status === "planned" ? "선택됨 · 예약 확인 필요" : "예약 상태 확인 필요") : undefined; }
