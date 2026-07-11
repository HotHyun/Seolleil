import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStaticDataReport } from "@/lib/data-validation";

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

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Metric label="오류" value={report.issueCount} tone={report.issueCount ? "warn" : "good"} />
        <Metric label="경고" value={report.warningCount} />
        <Metric label="confirmed 비율" value={`${confirmedRate}%`} />
        <Metric label="estimated" value={report.estimatedPriceCount} />
        <Metric label="26/27 교체 대상" value={report.replacementTargetCount} />
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
