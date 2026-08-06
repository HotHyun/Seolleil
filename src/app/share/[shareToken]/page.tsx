import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { ProgressSummary } from "@/components/trip/progress";
import { TaskList } from "@/components/trip/task-list";
import { TripBudgetWorkspace } from "@/components/trip/trip-budget-workspace";
import { TripCostDisclosure } from "@/components/trip/trip-cost-disclosure";
import { TripWorkspaceNav } from "@/components/trip/trip-workspace-nav";
import { TripDashboard } from "@/components/trip/trip-dashboard";
import { TripDecisionWorkspace } from "@/components/trip/trip-decision-workspace";
import { getTripWorkspaceView, isTripDecisionView } from "@/lib/trip-workspace";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hashToken } from "@/lib/tokens";
import { getShareLinkByTokenHash, getTripByShareTokenHash, getTripDisplayName, recordAnalyticsEvent } from "@/lib/trip-store";
import { getResort } from "@/data/resorts";
import { getRentalOptionsForResort } from "@/lib/pricing";
import { getNearbyLodgingsForResort } from "@/data/resort-map";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default async function SharePage({ params, searchParams }: { params: Promise<{ shareToken: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { shareToken } = await params;
  const query = await searchParams;
  const activeView = getTripWorkspaceView(query.view);
  const tokenHash = hashToken(shareToken);
  const [trip, link] = await Promise.all([getTripByShareTokenHash(tokenHash), getShareLinkByTokenHash(tokenHash)]);
  if (!trip) notFound();
  const resort = getResort(trip.resortId);
  const rentalGroups = getRentalOptionsForResort(trip.resortId);
  const lodgingOptions = getNearbyLodgingsForResort(trip.resortId);
  const rentalOptions = rentalGroups.flatMap(({ shop, options }) => options.map(option => ({ value: option.id, label: `${shop.name} · ${option.label}` })));

  await recordAnalyticsEvent({ tripId: trip.id, eventName: "share_page_viewed" });

  return (
    <main className="min-h-[calc(100svh-4rem)] py-3 sm:py-4 lg:py-0">
      <TripWorkspaceNav basePath={`/share/${shareToken}`} activeView={activeView} tasks={trip.tasks}>
      <div className="mb-4">
        <StatusBadge tone="good">{link?.permission === "edit" ? "함께 편집" : "보기 전용"}</StatusBadge>
        <h1 className="mt-3 text-3xl font-black md:text-5xl">{getTripDisplayName(trip)}</h1>
        <p className="mt-2 font-semibold text-muted-foreground">{trip.resortNameSnapshot}</p>
      </div>
          {activeView === "overview" ? (
            <div className="space-y-5">
              <TripDashboard trip={trip} basePath={`/share/${shareToken}`} />
              <aside className="grid gap-5 md:grid-cols-2">
                <Card>
                  <CardHeader><CardTitle>일정</CardTitle></CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <ShareInfo icon={<CalendarDays />} label="방문 날짜" value={new Intl.DateTimeFormat("ko-KR").format(trip.visitDate)} />
                    <ShareInfo icon={<Users />} label="인원" value={`${trip.peopleCount}명`} />
                    <ShareInfo icon={<MapPin />} label="교통" value={trip.transportType} />
                  </CardContent>
                </Card>
                <ProgressSummary tasks={trip.tasks} />
              </aside>
            </div>
          ) : null}
          {isTripDecisionView(activeView) ? <TripDecisionWorkspace view={activeView} trip={trip} rentalGroups={rentalGroups} lodgingOptions={lodgingOptions} liftUrl={resort?.liftTicketUrl} shuttleUrl={resort?.shuttleUrl} lodgingSearchUrl={resort?.lodgingUrl} shareToken={shareToken} canEdit={link?.permission === "edit"} /> : null}
          {activeView === "checklist" ? (link?.permission === "edit" ? <TaskList tasks={trip.tasks} shareToken={shareToken} basePath={`/share/${shareToken}`} /> : <Card>
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
          </Card>) : null}
          {activeView === "budget" ? (link?.permission === "edit" ? <TripBudgetWorkspace trip={trip} shareToken={shareToken} lodgingSearchUrl={resort?.lodgingUrl} rentalOptions={rentalOptions} /> : <TripCostDisclosure trip={trip} />) : null}
      </TripWorkspaceNav>
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
