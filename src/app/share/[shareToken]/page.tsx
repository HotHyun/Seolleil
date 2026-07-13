import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { ProgressSummary } from "@/components/trip/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hashToken } from "@/lib/tokens";
import { getTripByShareTokenHash, recordAnalyticsEvent } from "@/lib/trip-store";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default async function SharePage({ params }: { params: Promise<{ shareToken: string }> }) {
  const { shareToken } = await params;
  const trip = await getTripByShareTokenHash(hashToken(shareToken));
  if (!trip) notFound();

  await recordAnalyticsEvent({ tripId: trip.id, eventName: "share_page_viewed" });

  return (
    <main className="page-shell py-8">
      <div className="mb-6">
        <StatusBadge tone="good">읽기 전용 공유</StatusBadge>
        <h1 className="mt-3 text-3xl font-black md:text-5xl">{trip.resortNameSnapshot} 트립</h1>
      </div>
      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>일정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <ShareInfo icon={<CalendarDays />} label="방문 날짜" value={new Intl.DateTimeFormat("ko-KR").format(trip.visitDate)} />
              <ShareInfo icon={<Users />} label="인원" value={`${trip.peopleCount}명`} />
              <ShareInfo icon={<MapPin />} label="교통" value={trip.transportType} />
            </CardContent>
          </Card>
          <ProgressSummary tasks={trip.tasks} />
        </aside>
        <Card>
          <CardHeader>
            <CardTitle>예약·준비 상태</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {trip.tasks.filter((task) => task.status !== "not_needed").map((task) => (
                <div key={task.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <div className="font-semibold">{task.title}</div>
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

function ShareInfo({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md bg-muted p-3">
      <span className="[&_svg]:h-4 [&_svg]:w-4">{icon}</span>
      <div>
        <div className="text-xs font-semibold text-muted-foreground">{label}</div>
        <div className="font-black">{value}</div>
      </div>
    </div>
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
