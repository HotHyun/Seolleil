import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStaticDataReport } from "@/lib/data-validation";
import { resorts } from "@/data/resorts";
import { getSkiShuttleCoverage, getSkiShuttleRoutes } from "@/data/ski-shuttles";

export const metadata: Metadata = {
  title: "데이터 품질 | Korean Ski",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminDataQualityPage() {
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
        <Metric label="26/27 교체 대상" value={report.replacementTargetCount} />
        <Metric label="셔틀 링크" value={`${shuttleCoverage}/${resorts.length}`} />
        <Metric label="숙소 링크" value={`${lodgingCoverage}/${resorts.length}`} tone={lodgingCoverage < resorts.length ? "warn" : "good"} />
      </section>

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
