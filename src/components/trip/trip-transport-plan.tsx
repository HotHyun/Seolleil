"use client";

import { useState } from "react";
import { ArrowLeftRight, BusFront, Car, Route } from "lucide-react";
import { NoAffiliateShuttleNotice } from "@/components/shuttle-coverage";
import { ShuttleRouteExplorer } from "@/components/shuttle-route-explorer";
import { SelectField } from "@/components/ui/select-field";
import { SubmitButton } from "@/components/ui/submit-button";
import type { SkiShuttleCoverage } from "@/data/ski-shuttles";
import type { SkiShuttleRoute } from "@/lib/types";
import type { TransportLegPlan, TripSkiPlan } from "@/lib/trip-ski-plan";

type Props = {
  plan: TripSkiPlan;
  routes: SkiShuttleRoute[];
  coverage: SkiShuttleCoverage;
  access: { name: string; value: string };
  save: (data: FormData) => Promise<void>;
  canEdit: boolean;
};

const transportOptions = [{ value: "car", label: "자차" }, { value: "shuttle", label: "스키장 제휴 셔틀" }, { value: "bus", label: "고속·시외버스" }];
const transportLabels: Record<string, string> = { car: "자차", shuttle: "제휴 셔틀", bus: "고속·시외버스" };

export function TripTransportPlan({ plan, routes, coverage, access, save, canEdit }: Props) {
  const [direction, setDirection] = useState<TransportLegPlan["direction"]>("outbound");
  const activeLeg = plan.transportLegs.find(leg => leg.direction === direction) ?? plan.transportLegs[0];
  const [transportType, setTransportType] = useState<string>(activeLeg?.transportType ?? "car");

  function chooseLeg(next: TransportLegPlan["direction"]) {
    const leg = plan.transportLegs.find(item => item.direction === next);
    setDirection(next);
    setTransportType(leg?.transportType ?? "car");
  }

  if (!activeLeg) return null;

  return <div className="space-y-4">
    <div className="grid gap-2 sm:grid-cols-2" role="tablist" aria-label="왕복 교통 계획">
      {plan.transportLegs.map(leg => {
        const selected = activeLeg.direction === leg.direction;
        const route = routes.find(item => item.id === leg.shuttleRouteId);
        const title = leg.direction === "outbound" ? "가는 길" : "돌아오는 길";
        return <button key={leg.direction} type="button" role="tab" aria-selected={selected} onClick={() => chooseLeg(leg.direction)} className={`min-h-16 cursor-pointer rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${selected ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}><span className="flex items-center gap-2 text-sm font-black">{leg.transportType === "car" ? <Car className="h-4 w-4" /> : <BusFront className="h-4 w-4" />}{title} · {formatLegDate(leg.date)}</span><span className={`mt-1 block text-xs ${selected ? "text-primary-foreground/75" : "text-muted-foreground"}`}>{route ? route.name : transportLabels[leg.transportType]}</span></button>;
      })}
    </div>
    <form action={save} className="rounded-2xl border bg-muted/20 p-4">
      <input type="hidden" name={access.name} value={access.value} />
      <input type="hidden" name="decision" value="transport_leg" />
      <input type="hidden" name="transportLegDirection" value={activeLeg.direction} />
      <div className="flex items-start gap-3"><span className="rounded-xl bg-primary/10 p-2.5 text-primary"><Route className="h-5 w-5" /></span><div className="min-w-0 flex-1"><p className="font-black">{activeLeg.direction === "outbound" ? "가는 길" : "돌아오는 길"} 이동수단</p><p className="mt-1 text-xs text-muted-foreground">{formatLegDate(activeLeg.date)} 이동 조건만 설정합니다.</p><div className="mt-3"><SelectField name="transportType" ariaLabel={`${activeLeg.direction === "outbound" ? "가는 길" : "돌아오는 길"} 교통수단`} value={transportType} onValueChange={setTransportType} options={transportOptions} /></div><label className="mt-3 flex min-h-11 cursor-pointer items-center gap-2 text-sm font-bold"><input type="checkbox" name="applyToAllLegs" value="true" className="h-4 w-4 accent-primary" /><ArrowLeftRight className="h-4 w-4 text-primary" />가는 길과 돌아오는 길에 같이 적용</label>{canEdit ? <SubmitButton className="mt-3" pendingText="교통 저장 중…">이동수단 저장</SubmitButton> : null}</div></div>
    </form>
    {transportType === "shuttle" ? <div className="border-t pt-4">{routes.length ? <ShuttleRouteExplorer routes={routes} direction={activeLeg.direction} compact selectedRouteId={activeLeg.shuttleRouteId} selectedStopId={activeLeg.shuttleStopId} access={access} saveAction={save} canEdit={canEdit} decision="shuttle_leg" extraFields={{ transportLegDirection: activeLeg.direction }} /> : <NoAffiliateShuttleNotice coverage={coverage} compact />}</div> : <div className="rounded-xl border border-dashed p-4 text-sm leading-6 text-muted-foreground">{transportType === "car" ? "출발지 기준 왕복 거리와 통행료를 예상 비용에 반영합니다." : "가는 길과 돌아오는 길이 다르면 각 구간을 선택해 별도로 저장하세요."}</div>}
  </div>;
}

function formatLegDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", { month: "numeric", day: "numeric", weekday: "short", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}
