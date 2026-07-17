"use client";

import { useMemo, useState } from "react";
import { ArrowRight, BusFront, Clock3, ExternalLink, MapPin, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { getShuttleRegions, searchShuttleRoutes } from "@/data/ski-shuttles-25-26";
import type { SkiShuttleRoute } from "@/lib/types";

type ExplorerProps = { routes: SkiShuttleRoute[]; compact?: boolean; selectedRouteId?: string | null; selectedStopId?: string | null; access?: { name: string; value: string }; saveAction?: (data: FormData) => void | Promise<void>; canEdit?: boolean };

export function ShuttleRouteExplorer({ routes, compact = false, selectedRouteId, selectedStopId, access, saveAction, canEdit = false }: ExplorerProps) {
  const regions = useMemo(() => getShuttleRegions(routes), [routes]);
  const [region, setRegion] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(selectedRouteId ?? null);
  const filtered = useMemo(() => searchShuttleRoutes(routes, query, region), [query, region, routes]);
  const selected = filtered.find(route => route.id === selectedId) ?? (filtered.length === 1 ? filtered[0] : null);

  return <div className="space-y-4" data-testid="shuttle-route-explorer">
    <div className="rounded-2xl border border-sky-500/20 bg-[linear-gradient(135deg,hsl(var(--card)),hsl(var(--primary)/.08))] p-4 sm:p-5">
      <div className="flex items-start gap-3"><span className="rounded-xl bg-sky-500/15 p-2.5 text-sky-700 dark:text-sky-300"><BusFront className="h-5 w-5" /></span><div><div className="flex flex-wrap items-center gap-2"><p className="font-black">내 출발지에서 하이원까지</p><span className="rounded-full bg-amber-500/15 px-2 py-1 text-[10px] font-black text-amber-800 dark:text-amber-200">25/26 종료 시즌</span></div><p className="mt-1 text-sm leading-6 text-muted-foreground">도시나 역 이름을 찾으면 제휴 운행사와 새벽 탑승 순서를 바로 볼 수 있어요. 다음 시즌에는 반드시 운영사 원문을 다시 확인하세요.</p></div></div>
      <label className="relative mt-4 block"><span className="sr-only">출발 도시 또는 정류장 검색</span><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={event => { setQuery(event.target.value); setSelectedId(null); }} placeholder="예: 수원, 동래역, 전주" className="h-12 w-full rounded-xl border bg-background pl-10 pr-3 text-sm font-bold outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="셔틀 권역 필터"><Filter active={region === "all"} onClick={() => { setRegion("all"); setSelectedId(null); }}>전국</Filter>{regions.map(item => <Filter key={item} active={region === item} onClick={() => { setRegion(item); setSelectedId(null); }}>{item}</Filter>)}</div>
    </div>

    <div className={compact ? "grid gap-3" : "grid gap-3 lg:grid-cols-[minmax(250px,.72fr)_minmax(0,1.28fr)]"}>
      <div className={compact ? "flex gap-2 overflow-x-auto pb-1" : "space-y-2 lg:max-h-[520px] lg:overflow-y-auto lg:pr-1"} aria-label="검색된 셔틀 노선">
        {filtered.map(route => <button key={route.id} type="button" onClick={() => setSelectedId(route.id)} className={`${compact ? "min-w-[250px]" : "w-full"} rounded-xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${selected?.id === route.id ? "border-primary bg-primary/5 shadow-sm" : "bg-card hover:border-primary/40 hover:bg-muted/40"}`}><span className="flex items-start justify-between gap-3"><span><span className="block text-[11px] font-black tracking-[0.08em] text-primary">{route.region}</span><span className="mt-1 block font-black">{route.name}</span><span className="mt-1 block text-xs text-muted-foreground">{route.operator} · 정류장 {route.stops.length}곳</span></span><ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" /></span></button>)}
        {filtered.length === 0 ? <div className="rounded-xl border border-dashed p-5 text-center text-sm text-muted-foreground">25/26 제휴 노선에서 찾지 못했어요.<br />다른 도시명이나 가까운 광역시를 검색해 보세요.</div> : null}
      </div>

      {selected ? <RouteDetail key={selected.id} route={selected} selectedStopId={selected.id === selectedRouteId ? selectedStopId : null} access={access} saveAction={saveAction} canEdit={canEdit} /> : <div className="hidden min-h-64 place-items-center rounded-2xl border border-dashed bg-muted/20 p-6 text-center lg:grid"><div><MapPin className="mx-auto h-6 w-6 text-primary" /><p className="mt-3 font-black">노선을 하나 선택하세요</p><p className="mt-1 text-sm text-muted-foreground">탑승 순서와 운행 조건이 여기에 표시됩니다.</p></div></div>}
    </div>
  </div>;
}

function RouteDetail({ route, selectedStopId, access, saveAction, canEdit }: { route: SkiShuttleRoute; selectedStopId?: string | null; access?: { name: string; value: string }; saveAction?: (data: FormData) => void | Promise<void>; canEdit: boolean }) {
  const [stopId, setStopId] = useState(selectedStopId ?? route.stops[0]?.id ?? "");
  return <article className="overflow-hidden rounded-2xl border bg-card" aria-live="polite">
    <div className="border-b bg-muted/35 p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black tracking-[0.12em] text-primary">{route.operator}</p><h3 className="mt-1 text-xl font-black">{route.name}</h3></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${route.dataStatus === "confirmed_25_26" ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200" : "bg-amber-500/15 text-amber-800 dark:text-amber-200"}`}>{route.dataStatus === "confirmed_25_26" ? "시간표 확인" : "시간 재확인"}</span></div><div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{route.operationNote}</span>{route.priceLabel ? <span className="font-bold text-foreground">{route.priceLabel}</span> : null}</div></div>
    <div className="p-4 sm:p-5"><ol className="relative space-y-0 before:absolute before:bottom-4 before:left-[17px] before:top-4 before:w-px before:bg-border">{route.stops.map((stop, index) => <li key={stop.id} className="relative flex min-h-14 items-start gap-3 pb-3 last:pb-0"><button type="button" onClick={() => setStopId(stop.id)} aria-label={`${stop.name} 탑승지 선택`} className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[11px] font-black transition ${stopId === stop.id ? "border-primary bg-primary text-primary-foreground" : "bg-background text-primary"}`}>{index + 1}</button><span className="min-w-0 pt-1"><span className="block font-black">{stop.name}</span><span className="mt-0.5 block text-xs text-muted-foreground">{stop.city}{stop.departureTime ? ` · ${stop.departureTime} 출발` : " · 운영사에 시간 문의"}</span></span></li>)}</ol>{saveAction && access ? <form action={saveAction} className="mt-4"><input type="hidden" name={access.name} value={access.value} /><input type="hidden" name="decision" value="shuttle" /><input type="hidden" name="shuttleRouteId" value={route.id} /><input type="hidden" name="shuttleStopId" value={stopId} />{canEdit ? <SubmitButton className="w-full" pendingText="탑승지 저장 중…">이 노선·탑승지 저장</SubmitButton> : null}</form> : null}<div className="mt-4 flex items-center gap-3 rounded-xl bg-sky-500/10 p-3"><ShieldCheck className="h-5 w-5 shrink-0 text-sky-700 dark:text-sky-300" /><p className="text-xs leading-5"><strong>{route.arrivalName}</strong>{route.returnTime ? ` · 귀가차 ${route.returnTime}` : ""}<br /><span className="text-muted-foreground">예약 인원에 따라 합류·환승 또는 미운행될 수 있어요.</span></p></div><a href={route.bookingUrl} target="_blank" rel="noreferrer" className="mt-4 block"><Button type="button" variant={saveAction ? "secondary" : "primary"} className="w-full justify-between">운영사 예약·원문 확인 <ExternalLink className="h-4 w-4" /></Button></a>{route.operatorPhone ? <p className="mt-2 text-center text-xs text-muted-foreground">전화 문의 {route.operatorPhone}</p> : null}</div>
  </article>;
}
function Filter({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) { return <button type="button" onClick={onClick} className={`h-9 shrink-0 rounded-full border px-3 text-xs font-black transition ${active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}>{children}</button>; }
