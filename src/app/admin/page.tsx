import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, ExternalLink, Share2, Snowflake, SquareCheckBig } from "lucide-react";
import { auth } from "@/auth";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "운영 대시보드 | Korean Ski",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (!isAdminSession(session)) redirect("/");

  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [
    tripCount,
    createdLast30,
    taskChangedLast30,
    externalClicksLast30,
    shareViewsLast30,
    topResorts,
    topEvents,
    recentTrips
  ] = await Promise.all([
    prisma.trip.count({ where: { status: { not: "deleted" } } }),
    prisma.trip.count({ where: { createdAt: { gte: since }, status: { not: "deleted" } } }),
    prisma.analyticsEvent.count({ where: { eventName: "task_status_changed", createdAt: { gte: since } } }),
    prisma.analyticsEvent.count({ where: { eventName: "external_link_click", createdAt: { gte: since } } }),
    prisma.analyticsEvent.count({ where: { eventName: "share_page_viewed", createdAt: { gte: since } } }),
    prisma.trip.groupBy({
      by: ["resortNameSnapshot"],
      where: { status: { not: "deleted" } },
      _count: { _all: true },
      orderBy: { _count: { resortNameSnapshot: "desc" } },
      take: 5
    }),
    prisma.analyticsEvent.groupBy({
      by: ["eventName"],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
      orderBy: { _count: { eventName: "desc" } },
      take: 8
    }),
    prisma.trip.findMany({
      where: { status: { not: "deleted" } },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        resortNameSnapshot: true,
        visitDate: true,
        peopleCount: true,
        status: true,
        createdAt: true,
        tasks: { select: { status: true, category: true } }
      }
    })
  ]);

  return (
    <main className="page-shell py-8">
      <div className="mb-8">
        <StatusBadge tone="good">Admin</StatusBadge>
        <h1 className="mt-3 text-3xl font-black md:text-5xl">운영 대시보드</h1>
        <p className="mt-2 text-muted-foreground">최근 30일 기준으로 MVP 핵심 지표를 확인합니다.</p>
        <div className="mt-4">
          <Link href="/admin/data-quality">
            <Button variant="secondary">데이터 품질 보기</Button>
          </Link>
        </div>
      </div>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Metric icon={<Snowflake />} label="전체 트립" value={tripCount} />
        <Metric icon={<BarChart3 />} label="30일 생성" value={createdLast30} />
        <Metric icon={<SquareCheckBig />} label="체크 변경" value={taskChangedLast30} />
        <Metric icon={<ExternalLink />} label="외부 링크 클릭" value={externalClicksLast30} />
        <Metric icon={<Share2 />} label="공유 조회" value={shareViewsLast30} />
      </section>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>많이 선택된 스키장</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topResorts.length ? topResorts.map((item) => (
              <RankRow key={item.resortNameSnapshot} label={item.resortNameSnapshot} value={item._count._all} />
            )) : <EmptyText text="아직 트립 데이터가 없습니다." />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>이벤트 Top</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topEvents.length ? topEvents.map((item) => (
              <RankRow key={item.eventName} label={item.eventName} value={item._count._all} />
            )) : <EmptyText text="최근 이벤트가 없습니다." />}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>최근 트립</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {recentTrips.map((trip) => {
              const active = trip.tasks.filter((task) => task.status !== "not_needed");
              const done = active.filter((task) => ["reserved", "paid", "prepared"].includes(task.status));
              const progress = active.length ? Math.round((done.length / active.length) * 100) : 100;
              return (
                <div key={trip.id} className="grid gap-2 rounded-lg border bg-white/7 p-4 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <div className="font-black">{trip.resortNameSnapshot}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {new Intl.DateTimeFormat("ko-KR").format(trip.visitDate)} · {trip.peopleCount}명 · {trip.status}
                    </div>
                  </div>
                  <div className="text-sm font-black text-primary">{progress}%</div>
                </div>
              );
            })}
            {!recentTrips.length ? <EmptyText text="최근 트립이 없습니다." /> : null}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <span className="[&_svg]:h-4 [&_svg]:w-4">{icon}</span>
          {label}
        </div>
        <div className="text-3xl font-black">{value.toLocaleString("ko-KR")}</div>
      </CardContent>
    </Card>
  );
}

function RankRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-muted px-3 py-2 text-sm">
      <span className="font-semibold">{label}</span>
      <span className="font-black text-primary">{value}</span>
    </div>
  );
}

function EmptyText({ text }: { text: string }) {
  return <p className="rounded-md bg-muted px-3 py-6 text-center text-sm font-semibold text-muted-foreground">{text}</p>;
}
