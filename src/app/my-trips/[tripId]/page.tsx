import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { AnalyticsLink } from "@/components/analytics-link";
import { StatusBadge } from "@/components/status-badge";
import { ProgressSummary } from "@/components/trip/progress";
import { ReadOnlyAccessBanner } from "@/components/trip/read-only-access-banner";
import { TaskList } from "@/components/trip/task-list";
import { TripChecklistReadOnly } from "@/components/trip/trip-checklist-read-only";
import { TripCostDisclosure } from "@/components/trip/trip-cost-disclosure";
import { TripBudgetWorkspace } from "@/components/trip/trip-budget-workspace";
import { TripCompanions } from "@/components/trip/trip-companions";
import { TripDashboard } from "@/components/trip/trip-dashboard";
import { TripDecisionReadOnly } from "@/components/trip/trip-decision-read-only";
import { TripDecisionWorkspace } from "@/components/trip/trip-decision-workspace";
import { TripIdentityEditor } from "@/components/trip/trip-identity-editor";
import { TripManagementMenu } from "@/components/trip/trip-management-menu";
import { TripWorkspaceNav } from "@/components/trip/trip-workspace-nav";
import { getTripWorkspaceView, isTripDecisionView } from "@/lib/trip-workspace";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getResort } from "@/data/resorts";
import { getSession, getSessionSecret } from "@/lib/session";
import { getTripTeamPermission, listTripMemberships } from "@/lib/trip-collaboration";
import { getTripById, getTripDisplayName, listTripShareLinks } from "@/lib/trip-store";
import { getRentalOptionsForResort } from "@/lib/pricing";
import { getNearbyLodgingsForResort } from "@/data/resort-map";
import { skiPlanDateLabel } from "@/lib/trip-ski-plan";

export const metadata: Metadata = {
  title: "내 트립 상세 | Korean Ski",
  robots: {
    index: false,
    follow: false
  }
};

export default async function MyTripDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ tripId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login?callbackUrl=/my-trips");

  const { tripId } = await params;
  const query = await searchParams;
  const shareToken = Array.isArray(query.share) ? query.share[0] : query.share;
  const sharePermission = (Array.isArray(query.sharePermission) ? query.sharePermission[0] : query.sharePermission) === "edit" ? "edit" : "read";
  const activeView = getTripWorkspaceView(query.view);
  const trip = await getTripById(tripId);

  if (!trip) notFound();
  const isOwner = trip.userId === session.user.id;
  const sessionSecret = await getSessionSecret();
  const collaborationPermission = !isOwner && trip.teamId && sessionSecret ? await getTripTeamPermission(sessionSecret, trip.teamId, session.user.id) : null;
  if (!isOwner && !collaborationPermission) notFound();
  const canEdit = isOwner || collaborationPermission === "edit";
  const [shareLinks, members] = await Promise.all([
    isOwner ? listTripShareLinks(trip.id) : Promise.resolve([]),
    trip.teamId && sessionSecret ? listTripMemberships(sessionSecret, trip.teamId) : Promise.resolve([])
  ]);

  const resort = getResort(trip.resortId);
  const rentalGroups = getRentalOptionsForResort(trip.resortId);
  const lodgingOptions = getNearbyLodgingsForResort(trip.resortId);
  const rentalOptions = rentalGroups.flatMap(({ shop, options }) => options.filter(option => option.itemType !== "lift_ticket").map(option => ({ value: option.id, label: `${shop.name} · ${option.label}` })));
  const shareUrl = shareToken ? `/share/${shareToken}` : undefined;

  return (
    <main className="min-h-[calc(100svh-4rem)] py-3 sm:py-4 lg:py-0">
      <TripWorkspaceNav basePath={`/my-trips/${trip.id}`} activeView={activeView} tasks={trip.tasks}>
        <div className="space-y-4">
          <Link href="/my-trips" className="inline-flex"><Button variant="ghost" className="-ml-2 h-10 px-2 text-muted-foreground"><ArrowLeft className="h-4 w-4" /> 내 트립으로 돌아가기</Button></Link>
          {!canEdit ? <ReadOnlyAccessBanner compact={activeView !== "overview"} /> : null}
          {activeView === "overview" ? <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2"><StatusBadge tone="good">{trip.season}</StatusBadge><StatusBadge>{trip.status}</StatusBadge></div>
                  <div className="mt-3"><TripIdentityEditor tripId={trip.id} name={getTripDisplayName(trip)} canEdit={canEdit} /></div>
                  <p className="mt-1 text-sm font-semibold text-muted-foreground">{trip.resortNameSnapshot}</p>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  {!isOwner ? <StatusBadge>{collaborationPermission === "edit" ? "초대됨 · 편집" : "초대됨 · 보기"}</StatusBadge> : null}
                  {isOwner ? <TripManagementMenu trip={trip} shareUrl={shareUrl} sharePermission={sharePermission} shareLinks={shareLinks} members={members} canManageTrip canManageSharing allowAccountInvites /> : null}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4"><TripCompanions members={members} currentUserId={session.user.id} /></div>
              <div className="grid gap-3 md:grid-cols-3">
                <Info label="여행 기간" value={skiPlanDateLabel(trip.visitDate, trip.endDate)} />
                <Info label="인원" value={`${trip.peopleCount}명`} />
                <Info label="교통" value={trip.transportType} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {resort?.officialUrl ? (
                  <AnalyticsLink
                    href={resort.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    eventName="external_link_click"
                    eventData={{ type: "official", resortId: resort.id }}
                  >
                    <Button variant="secondary">
                      공식 사이트 <ExternalLink className="h-4 w-4" />
                    </Button>
                  </AnalyticsLink>
                ) : null}
                {resort?.slopeStatusUrl ? (
                  <AnalyticsLink
                    href={resort.slopeStatusUrl}
                    target="_blank"
                    rel="noreferrer"
                    eventName="external_link_click"
                    eventData={{ type: "slope_status", resortId: resort.id }}
                  >
                    <Button variant="secondary">운영현황 확인</Button>
                  </AnalyticsLink>
                ) : null}
              </div>
            </CardContent>
          </Card> : null}
              {activeView === "overview" ? <div className="space-y-4"><TripDashboard trip={trip} basePath={`/my-trips/${trip.id}`} canEdit={canEdit} /><ProgressSummary tasks={trip.tasks} /></div> : null}
              {isTripDecisionView(activeView) ? (canEdit ? <TripDecisionWorkspace view={activeView} trip={trip} rentalGroups={rentalGroups} lodgingOptions={lodgingOptions} liftUrl={resort?.liftTicketUrl} shuttleUrl={resort?.shuttleUrl} lodgingSearchUrl={resort?.lodgingUrl} canEdit /> : <TripDecisionReadOnly view={activeView} trip={trip} rentalGroups={rentalGroups} />) : null}
              {activeView === "checklist" ? (canEdit ? <TaskList tasks={trip.tasks} tripId={trip.id} basePath={`/my-trips/${trip.id}`} /> : <TripChecklistReadOnly tasks={trip.tasks} />) : null}
              {activeView === "budget" ? (canEdit ? <TripBudgetWorkspace trip={trip} basePath={`/my-trips/${trip.id}`} rentalOptions={rentalOptions} /> : <TripCostDisclosure trip={trip} />) : null}
        </div>
      </TripWorkspaceNav>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted p-3">
      <div className="text-xs font-semibold text-muted-foreground">{label}</div>
      <div className="mt-1 font-black">{value}</div>
    </div>
  );
}
