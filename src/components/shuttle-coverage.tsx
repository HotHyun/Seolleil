import { Ban, BusFront, CircleCheck, ExternalLink, RotateCcw } from "lucide-react";
import { ShuttleRouteExplorer } from "@/components/shuttle-route-explorer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SkiShuttleCoverage } from "@/data/ski-shuttles";
import type { SkiShuttleRoute } from "@/lib/types";

export function ResortShuttleCoverage({ resortName, routes, coverage }: { resortName: string; routes: SkiShuttleRoute[]; coverage: SkiShuttleCoverage }) {
  return <Card data-testid="shuttle-coverage">
    <CardHeader><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black tracking-[0.14em] text-primary">SKI SHUTTLE · {coverage.season}</p><CardTitle className="mt-2">차 없이 {resortName} 가는 법</CardTitle><CoverageLegend coverage={coverage} /></div><BusFront className="h-6 w-6 shrink-0 text-primary" /></div></CardHeader>
    <CardContent>{routes.length > 0 ? <ShuttleRouteExplorer routes={routes} destinationName={resortName} /> : <NoAffiliateShuttleNotice coverage={coverage} />}</CardContent>
  </Card>;
}

export function CoverageLegend({ coverage }: { coverage: SkiShuttleCoverage }) {
  return <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-black">
    {coverage.confirmedRouteCount > 0 ? <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-emerald-800 dark:text-emerald-200"><CircleCheck className="h-3.5 w-3.5" />확정 시간표 {coverage.confirmedRouteCount}</span> : null}
    {coverage.recheckRouteCount > 0 ? <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 text-amber-800 dark:text-amber-200"><RotateCcw className="h-3.5 w-3.5" />시간 재확인 {coverage.recheckRouteCount}</span> : null}
    {coverage.status === "no_affiliate_service" ? <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/15 px-2.5 py-1 text-slate-700 dark:text-slate-200"><Ban className="h-3.5 w-3.5" />운행 없음</span> : null}
  </div>;
}

export function NoAffiliateShuttleNotice({ coverage, compact = false }: { coverage: SkiShuttleCoverage; compact?: boolean }) {
  return <div className={`rounded-2xl border border-dashed border-slate-400/50 bg-slate-500/[0.06] ${compact ? "p-4" : "p-5 sm:p-6"}`} data-testid="shuttle-no-service">
    <div className="flex items-start gap-3"><span className="rounded-xl bg-slate-500/15 p-2.5 text-slate-600 dark:text-slate-300"><Ban className="h-5 w-5" /></span><div className="min-w-0"><p className="font-black">확인된 25/26 제휴 셔틀 없음</p><p className="mt-1 text-sm leading-6 text-muted-foreground">시외·고속버스와 행사·강습 전용 차량을 제외한 일반 고객용 제휴 노선을 찾지 못했습니다. 다음 시즌 공지는 공식 교통 안내에서 다시 확인하세요.</p></div></div>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-muted-foreground">마지막 확인 {coverage.lastCheckedAt}</p>{coverage.officialTransportUrl ? <a href={coverage.officialTransportUrl} target="_blank" rel="noreferrer"><Button type="button" variant="secondary" className="h-9 px-3 text-xs">공식 교통 안내 <ExternalLink className="h-3.5 w-3.5" /></Button></a> : null}</div>
  </div>;
}
