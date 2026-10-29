import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getStaticDataReport,
  type SeasonCategoryProgress,
  type SeasonPublicationStatus,
  type SeasonRefreshPriority
} from "@/lib/data-validation";
import { resorts } from "@/data/resorts";
import { getSkiShuttleCoverage, getSkiShuttleRoutes } from "@/data/ski-shuttles";

export const metadata: Metadata = {
  title: "데이터 품질 | 설레일",
  robots: {
    index: false,
    follow: false
  }
};

type PageProps = {
  searchParams: Promise<{ priority?: string }>;
};

export default async function AdminDataQualityPage({ searchParams }: PageProps) {
  const { priority: priorityParam } = await searchParams;
  const selectedPriority = priorityParam === "1" || priorityParam === "2" || priorityParam === "3"
    ? Number(priorityParam) as SeasonRefreshPriority
    : "all";
  const report = getStaticDataReport();
  const errors = report.issues.filter((issue) => issue.severity === "error");
  const warnings = report.issues.filter((issue) => issue.severity === "warning");
  const confirmedTotal =
    report.resorts.reduce((sum, resort) => sum + resort.confirmedLiftRuleCount + resort.confirmedRentalRuleCount, 0);
  const totalRules = report.priceRuleCount + report.rentalPriceRuleCount;
  const confirmedRate = totalRules ? Math.round((confirmedTotal / totalRules) * 100) : 0;
  const shuttleCoverage = resorts.filter(resort => resort.shuttleUrl).length;
  const lodgingCoverage = resorts.filter(resort => resort.lodgingUrl).length;
  const shuttleRows = resorts.map(resort => { const routes = getSkiShuttleRoutes(resort.id); return { resort, routes, coverage: getSkiShuttleCoverage(resort, routes), stopCount: routes.reduce((sum, route) => sum + route.stops.length, 0), missingSourceCount: routes.filter(route => !route.sourceUrl || !route.bookingUrl).length }; });
  const shuttleConfirmed = shuttleRows.reduce((sum, row) => sum + row.coverage.confirmedRouteCount, 0);
  const shuttleRecheck = shuttleRows.reduce((sum, row) => sum + row.coverage.recheckRouteCount, 0);
  const transitionRows = report.seasonTransition.resorts.filter(
    resort => selectedPriority === "all" || resort.priority === selectedPriority
  );
  const preliminaryResearch = transitionRows.flatMap(resort => [
    { resortName: resort.resortName, category: "리프트", research: resort.lift.research },
    { resortName: resort.resortName, category: "렌탈", research: resort.rental.research },
    { resortName: resort.resortName, category: "셔틀", research: resort.shuttle.research }
  ]).filter(item => item.research?.status === "preliminary");

  return (
    <main className="page-shell py-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <StatusBadge tone={errors.length ? "warn" : "good"}>{report.season}</StatusBadge>
          <h1 className="mt-3 text-3xl font-black md:text-5xl">데이터 품질</h1>
          <p className="mt-2 text-muted-foreground">가격/렌탈/링크 데이터의 보강 대상을 확인합니다.</p>
        </div>
        <Link href="/admin">
          <Button variant="secondary">운영 대시보드</Button>
        </Link>
      </div>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
        <Metric label="오류" value={report.issueCount} tone={report.issueCount ? "warn" : "good"} />
        <Metric label="경고" value={report.warningCount} />
        <Metric label="confirmed 비율" value={`${confirmedRate}%`} />
        <Metric label="estimated" value={report.estimatedPriceCount} />
        <Metric label="26/27 가격·렌탈 미등록" value={report.replacementTargetCount} />
        <Metric label="셔틀 링크" value={`${shuttleCoverage}/${resorts.length}`} />
        <Metric label="숙소 링크" value={`${lodgingCoverage}/${resorts.length}`} tone={lodgingCoverage < resorts.length ? "warn" : "good"} />
      </section>

      <Card className="mt-6 overflow-hidden" data-testid="season-transition-board">
        <div className="border-b border-border bg-zinc-950 px-4 py-5 text-white md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-black tracking-[0.16em] text-lime-300">SEASON TRANSITION</p>
              <CardTitle className="mt-2 text-xl font-black md:text-2xl">
                25/26 → 26/27 전환 보드
              </CardTitle>
              <p className="mt-2 max-w-2xl text-sm text-zinc-300">
                리프트·렌탈·셔틀을 기존 시즌과 나란히 유지하며, 출처와 유효 기간이 확정된 항목만 완료로 집계합니다.
              </p>
            </div>
            <div className="text-right">
              <div className="font-mono text-4xl font-black tabular-nums">{report.seasonTransition.progressPercent}%</div>
              <div className="mt-1 text-xs text-zinc-400">
                {report.seasonTransition.completedTargetCount.toLocaleString("ko-KR")} / {report.seasonTransition.replacementTargetCount.toLocaleString("ko-KR")} 항목 완료
              </div>
            </div>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15" aria-label={`26/27 시즌 전환 ${report.seasonTransition.progressPercent}%`}>
            <div className="h-full rounded-full bg-lime-300 transition-[width]" style={{ width: `${report.seasonTransition.progressPercent}%` }} />
          </div>
        </div>

        <CardContent className="pt-4 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2" aria-label="시즌 전환 상태 요약">
              <StatusBadge>미공개 {report.seasonTransition.statusCounts.not_published}</StatusBadge>
              <StatusBadge tone="warn">확인 중 {report.seasonTransition.statusCounts.in_review}</StatusBadge>
              <StatusBadge tone="good">확정 {report.seasonTransition.statusCounts.confirmed}</StatusBadge>
              <StatusBadge tone="dark">이용 불가 {report.seasonTransition.statusCounts.unavailable}</StatusBadge>
              <StatusBadge tone="good">P1 조사 {report.seasonTransition.priorityOneResearchCount}/12</StatusBadge>
              <StatusBadge tone="good">P2 조사 {report.seasonTransition.priorityTwoResearchCount}/15</StatusBadge>
              <StatusBadge tone="good">P3 조사 {report.seasonTransition.priorityThreeResearchCount}/12</StatusBadge>
              <StatusBadge tone="warn">사전 공지 {report.seasonTransition.preliminaryResearchCount}</StatusBadge>
            </div>
            <nav className="flex flex-wrap gap-1 rounded-xl bg-muted p-1" aria-label="조사 우선순위 필터">
              {([
                ["all", "전체"],
                ["1", "P1 핵심"],
                ["2", "P2 수도권·강원"],
                ["3", "P3 장거리"]
              ] as const).map(([value, label]) => {
                const active = String(selectedPriority) === value;
                return (
                  <Link
                    key={value}
                    href={value === "all" ? "/admin/data-quality" : `/admin/data-quality?priority=${value}`}
                    aria-current={active ? "page" : undefined}
                    className={active
                      ? "rounded-lg bg-background px-3 py-2 text-xs font-black text-foreground shadow-sm"
                      : "rounded-lg px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground"}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {preliminaryResearch.length ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2" aria-label="26/27 공식 사전 공지">
              {preliminaryResearch.map(({ resortName, category, research }) => (
                <article key={`${resortName}-${category}`} className="rounded-xl border border-amber-500/25 bg-amber-500/8 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-black tracking-[0.12em] text-amber-700 dark:text-amber-300">OFFICIAL EARLY SIGNAL</p>
                      <h3 className="mt-1 font-black">{resortName} · {category}</h3>
                    </div>
                    <StatusBadge tone="warn">사전 공지</StatusBadge>
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    {research?.announcedFacts?.map(fact => (
                      <div key={fact.label} className="rounded-lg bg-background/75 p-2.5">
                        <dt className="text-muted-foreground">{fact.label}</dt>
                        <dd className="mt-1 font-black">{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">{research?.note}</p>
                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                    {research?.sources.map(source => (
                      <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-primary hover:underline">
                        {source.name}
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : null}

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[1040px] text-left text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b">
                  <th className="py-2">우선</th>
                  <th>스키장</th>
                  <th>리프트</th>
                  <th>렌탈</th>
                  <th>셔틀</th>
                  <th className="w-36">전체 진행</th>
                  <th>남음</th>
                  <th>다음 조치</th>
                </tr>
              </thead>
              <tbody>
                {transitionRows.map((resort) => (
                  <tr key={resort.resortId} className="border-b last:border-0">
                    <td className="py-3"><StatusBadge tone={resort.priority === 1 ? "dark" : "neutral"}>P{resort.priority}</StatusBadge></td>
                    <td className="font-black">{resort.resortName}</td>
                    <td><CategoryProgress category={resort.lift} /></td>
                    <td><CategoryProgress category={resort.rental} /></td>
                    <td><CategoryProgress category={resort.shuttle} /></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${resort.progressPercent}%` }} />
                        </div>
                        <span className="w-9 text-right font-mono text-xs font-bold tabular-nums">{resort.progressPercent}%</span>
                      </div>
                    </td>
                    <td className="font-mono text-xs tabular-nums">{resort.replacementTargetCount - resort.completedTargetCount}</td>
                    <td className="text-xs text-muted-foreground">{resort.nextAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>리조트별 품질</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b">
                <th className="py-2">스키장</th>
                <th>리프트</th>
                <th>리프트 확인</th>
                <th>외부 렌탈</th>
                <th>렌탈 가격</th>
                <th>렌탈 확인</th>
                <th>누락 시간권</th>
                <th>최근 확인</th>
              </tr>
            </thead>
            <tbody>
              {report.resorts.map((resort) => (
                <tr key={resort.resortId} className="border-b">
                  <td className="py-3 font-bold">{resort.resortName}</td>
                  <td>{resort.liftRuleCount}</td>
                  <td>{resort.confirmedLiftRuleCount}/{resort.liftRuleCount}</td>
                  <td>{resort.externalRentalShopCount}</td>
                  <td>{resort.rentalRuleCount}</td>
                  <td>{resort.confirmedRentalRuleCount}/{resort.rentalRuleCount}</td>
                  <td>{resort.missingTimeSlots.length ? resort.missingTimeSlots.join(", ") : "-"}</td>
                  <td>{resort.latestCheckedAt ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="mt-6" data-testid="admin-shuttle-quality">
        <CardHeader><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-black tracking-[0.14em] text-primary">25/26 SKI SHUTTLE</p><CardTitle className="mt-2">셔틀 데이터 품질</CardTitle></div><div className="flex flex-wrap gap-2"><StatusBadge tone="good">확정 {shuttleConfirmed}</StatusBadge><StatusBadge tone="warn">재확인 {shuttleRecheck}</StatusBadge><StatusBadge>{shuttleRows.filter(row => row.coverage.status === "no_affiliate_service").length}곳 운행 없음</StatusBadge></div></div></CardHeader>
        <CardContent className="overflow-x-auto"><table className="w-full min-w-[980px] text-left text-sm"><thead className="text-xs text-muted-foreground"><tr className="border-b"><th className="py-2">스키장</th><th>상태</th><th>노선</th><th>정류장</th><th>확정</th><th>재확인</th><th>출처 누락</th><th>마지막 확인</th><th>다음 조치</th></tr></thead><tbody>{shuttleRows.map(({ resort, routes, coverage, stopCount, missingSourceCount }) => <tr key={resort.id} className="border-b"><td className="py-3 font-bold">{resort.name}</td><td><StatusBadge tone={coverage.status === "confirmed_schedule" ? "good" : coverage.status === "needs_recheck" ? "warn" : "neutral"}>{coverage.status === "confirmed_schedule" ? "확정 시간표" : coverage.status === "needs_recheck" ? "시간 재확인" : "운행 없음"}</StatusBadge></td><td>{routes.length}</td><td>{stopCount}</td><td>{coverage.confirmedRouteCount}</td><td>{coverage.recheckRouteCount}</td><td className={missingSourceCount ? "font-bold text-amber-500" : ""}>{missingSourceCount || "-"}</td><td>{coverage.lastCheckedAt}</td><td className="text-xs text-muted-foreground">{coverage.status === "no_affiliate_service" ? "26/27 신규 공지 확인" : coverage.recheckRouteCount ? "시간·가격 갱신" : routes.some(route => !route.fare || route.fare.type === "unknown") ? "요금 보강" : "26/27 교체 대기"}</td></tr>)}</tbody></table></CardContent>
      </Card>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <IssueCard title="오류" issues={errors} emptyText="배포를 막을 오류가 없습니다." />
        <IssueCard title="경고" issues={warnings.slice(0, 40)} emptyText="경고가 없습니다." />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>estimated 가격 확인 대상</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-2">
          {report.estimatedItems.slice(0, 60).map((item) => (
            <div key={`${item.scope}-${item.id}`} className="rounded-md border bg-white/7 p-3 text-sm">
              <div className="font-bold">{item.id}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {item.scope} · {item.sourceName ?? "출처명 없음"} · {item.lastCheckedAt}
              </div>
            </div>
          ))}
          {!report.estimatedItems.length ? <p className="text-sm text-muted-foreground">모든 가격이 confirmed입니다.</p> : null}
        </CardContent>
      </Card>
    </main>
  );
}

const seasonStatusPresentation: Record<SeasonPublicationStatus, { label: string; tone: "neutral" | "good" | "warn" | "dark" }> = {
  not_published: { label: "미공개", tone: "neutral" },
  in_review: { label: "확인 중", tone: "warn" },
  confirmed: { label: "확정", tone: "good" },
  unavailable: { label: "이용 불가", tone: "dark" }
};

function CategoryProgress({ category }: { category: SeasonCategoryProgress }) {
  const presentation = seasonStatusPresentation[category.status];
  return (
    <div className="whitespace-nowrap">
      <div className="flex items-center gap-2">
        <StatusBadge tone={presentation.tone}>{presentation.label}</StatusBadge>
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {category.completedTargetCount}/{category.sourceCount}
        </span>
      </div>
      {category.research ? (
        <a
          href={category.research.sources[0]?.url}
          target="_blank"
          rel="noreferrer"
          className={category.research.status === "preliminary"
            ? "mt-1.5 block text-[10px] font-black text-amber-600 hover:underline dark:text-amber-300"
            : "mt-1.5 block text-[10px] font-bold text-muted-foreground hover:text-foreground"}
        >
          {category.research.status === "preliminary" ? "공식 사전 공지" : `${category.research.lastCheckedAt.slice(5)} 확인`}
        </a>
      ) : null}
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: number | string; tone?: "good" | "warn" }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs font-semibold text-muted-foreground">{label}</div>
        <div className={tone === "warn" ? "mt-1 text-3xl font-black text-amber-500" : "mt-1 text-3xl font-black"}>
          {typeof value === "number" ? value.toLocaleString("ko-KR") : value}
        </div>
      </CardContent>
    </Card>
  );
}

function IssueCard({
  title,
  issues,
  emptyText
}: {
  title: string;
  issues: Array<{ scope: string; id: string; message: string }>;
  emptyText: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {issues.length ? issues.map((issue) => (
          <div key={`${issue.scope}-${issue.id}-${issue.message}`} className="rounded-md bg-muted px-3 py-2 text-sm">
            <div className="font-bold">[{issue.scope}] {issue.id}</div>
            <div className="mt-1 text-xs text-muted-foreground">{issue.message}</div>
          </div>
        )) : <p className="rounded-md bg-muted px-3 py-6 text-center text-sm font-semibold text-muted-foreground">{emptyText}</p>}
      </CardContent>
    </Card>
  );
}
