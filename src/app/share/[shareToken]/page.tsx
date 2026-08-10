import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { ProgressSummary } from "@/components/trip/progress";
import { ReadOnlyAccessBanner } from "@/components/trip/read-only-access-banner";
import { TaskList } from "@/components/trip/task-list";
import { TripBudgetWorkspace } from "@/components/trip/trip-budget-workspace";
import { TripChecklistReadOnly } from "@/components/trip/trip-checklist-read-only";
import { TripCostDisclosure } from "@/components/trip/trip-cost-disclosure";
import { TripWorkspaceNav } from "@/components/trip/trip-workspace-nav";
import { TripDashboard } from "@/components/trip/trip-dashboard";
import { TripDecisionReadOnly } from "@/components/trip/trip-decision-read-only";
import { TripDecisionWorkspace } from "@/components/trip/trip-decision-workspace";
import { getTripWorkspaceView, isTripDecisionView } from "@/lib/trip-workspace";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hashToken } from "@/lib/tokens";
import { getShareLinkByTokenHash, getTripByShareTokenHash, getTripDisplayName, recordAnalyticsEvent } from "@/lib/trip-store";
import { getResort } from "@/data/resorts";
import { getRentalOptionsForResort } from "@/lib/pricing";
import { getNearbyLodgingsForResort } from "@/data/resort-map";
import { skiPlanDateLabel } from "@/lib/trip-ski-plan";

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
  const canEdit = link?.permission === "edit";
  const rentalGroups = getRentalOptionsForResort(trip.resortId);
  const lodgingOptions = getNearbyLodgingsForResort(trip.resortId);
  const rentalOptions = rentalGroups.flatMap(({ shop, options }) => options.filter(option => option.itemType !== "lift_ticket").map(option => ({ value: option.id, label: `${shop.name} · ${option.label}` })));

  await recordAnalyticsEvent({ tripId: trip.id, eventName: "share_page_viewed" });

  return (
    <main className="min-h-[calc(100svh-4rem)] py-3 sm:py-4 lg:py-0">
      <TripWorkspaceNav basePath={`/share/${shareToken}`} activeView={activeView} tasks={trip.tasks}>
      {activeView === "overview" ? <div className="mb-4">
        <StatusBadge tone="good">{canEdit ? "함께 편집" : "보기 전용"}</StatusBadge>
        <h1 data-trip-workspace-title tabIndex={-1} className="mt-3 text-3xl font-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-5xl">{getTripDisplayName(trip)}</h1>
        <p className="mt-2 font-semibold text-muted-foreground">{trip.resortNameSnapshot}</p>
      </div> : canEdit ? <div className="mb-3"><StatusBadge tone="good">함께 편집</StatusBadge></div> : null}
          {!canEdit ? <div className="mb-4"><ReadOnlyAccessBanner compact={activeView !== "overview"} /></div> : null}
          {activeView === "overview" ? (
            <div className="space-y-5">
              <TripDashboard trip={trip} basePath={`/share/${shareToken}`} canEdit={canEdit} />
              <aside className="grid gap-5 md:grid-cols-2">
                <Card>
                  <CardHeader><CardTitle>일정</CardTitle></CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <ShareInfo icon={<CalendarDays aria-hidden="true" />} label="여행 기간" value={skiPlanDateLabel(trip.visitDate, trip.endDate)} />
                    <ShareInfo icon={<Users aria-hidden="true" />} label="인원" value={`${trip.peopleCount}명`} />
                    <ShareInfo icon={<MapPin aria-hidden="true" />} label="교통" value={trip.transportType} />
                  </CardContent>
                </Card>
                <ProgressSummary tasks={trip.tasks} />
              </aside>
            </div>
          ) : null}
          {isTripDecisionView(activeView) ? (canEdit ? <TripDecisionWorkspace view={activeView} trip={trip} rentalGroups={rentalGroups} lodgingOptions={lodgingOptions} liftUrl={resort?.liftTicketUrl} shuttleUrl={resort?.shuttleUrl} lodgingSearchUrl={resort?.lodgingUrl} shareToken={shareToken} canEdit /> : <TripDecisionReadOnly view={activeView} trip={trip} rentalGroups={rentalGroups} />) : null}
          {activeView === "checklist" ? (canEdit ? <TaskList tasks={trip.tasks} shareToken={shareToken} basePath={`/share/${shareToken}`} /> : <TripChecklistReadOnly tasks={trip.tasks} />) : null}
          {activeView === "budget" ? (canEdit ? <TripBudgetWorkspace trip={trip} basePath={`/share/${shareToken}`} shareToken={shareToken} rentalOptions={rentalOptions} /> : <TripCostDisclosure trip={trip} />) : null}
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
