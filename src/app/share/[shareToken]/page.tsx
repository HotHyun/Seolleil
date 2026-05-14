import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/status-badge";
import { ProgressSummary } from "@/components/trip/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/tokens";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default async function SharePage({ params }: { params: Promise<{ shareToken: string }> }) {
  const { shareToken } = await params;
  const trip = await prisma.trip.findUnique({
    where: { shareTokenHash: hashToken(shareToken) },
    include: { tasks: { orderBy: [{ category: "asc" }, { sortOrder: "asc" }] } }
  });
  if (!trip) notFound();

  await prisma.analyticsEvent.create({
    data: { tripId: trip.id, eventName: "share_page_viewed" }
  });

  return (
    <main className="page-shell py-8">
      <div className="mb-6">
        <StatusBadge tone="good">읽기 전용 공유</StatusBadge>
        <h1 className="mt-3 text-3xl font-black md:text-5xl">{trip.resortNameSnapshot} 트립</h1>
        <p className="mt-2 text-muted-foreground">
          {new Intl.DateTimeFormat("ko-KR").format(trip.visitDate)} · {trip.peopleCount}명
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <ProgressSummary tasks={trip.tasks} />
        <Card>
          <CardHeader>
            <CardTitle>체크리스트 상태</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {trip.tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <div className="font-semibold">{task.title}</div>
                    {task.dueDate ? (
                      <div className="text-xs text-muted-foreground">
                        마감: {new Intl.DateTimeFormat("ko-KR").format(task.dueDate)}
                      </div>
                    ) : null}
                  </div>
                  <StatusBadge>{statusLabel(task.status)}</StatusBadge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function statusLabel(status: string) {
  return (
    {
      not_needed: "필요 없음",
      needs_check: "확인 필요",
      planned: "예정",
      reserved: "예약 완료",
      paid: "결제 완료",
      prepared: "준비 완료"
    }[status] ?? status
  );
}

