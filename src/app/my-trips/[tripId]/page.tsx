import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { AnalyticsLink } from "@/components/analytics-link";
import { StatusBadge } from "@/components/status-badge";
import { ProgressSummary } from "@/components/trip/progress";
import { TaskList } from "@/components/trip/task-list";
import { TripCostDisclosure } from "@/components/trip/trip-cost-disclosure";
import { TripBudgetWorkspace } from "@/components/trip/trip-budget-workspace";
import { TripCompanions } from "@/components/trip/trip-companions";
import { TripManagementMenu } from "@/components/trip/trip-management-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getResort } from "@/data/resorts";
import { getSession, getSessionSecret } from "@/lib/session";
import { getTripTeamPermission, listTripMemberships } from "@/lib/trip-collaboration";
import { getTripById, getTripDisplayName, listTripShareLinks } from "@/lib/trip-store";
import { getRentalOptionsForResort } from "@/lib/pricing";

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
  const rentalOptions = getRentalOptionsForResort(trip.resortId).flatMap(({ shop, options }) => options.map(option => ({ value: option.id, label: `${shop.name} · ${option.label}` })));
  const shareUrl = shareToken ? `/share/${shareToken}` : undefined;

  return (
    <main className="page-shell py-4 sm:py-8">
      <div className="mx-auto max-w-5xl space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2"><StatusBadge tone="good">{trip.season}</StatusBadge><StatusBadge>{trip.status}</StatusBadge></div>
                  <CardTitle className="mt-3 text-2xl font-black sm:text-3xl">{getTripDisplayName(trip)}</CardTitle>
                  <p className="mt-1 text-sm font-semibold text-muted-foreground">{trip.resortNameSnapshot}</p>
                </div>
                {isOwner ? <TripManagementMenu trip={trip} shareUrl={shareUrl} sharePermission={sharePermission} shareLinks={shareLinks} members={members} /> : <StatusBadge>{collaborationPermission === "edit" ? "초대됨 · 편집" : "초대됨 · 보기"}</StatusBadge>}
              </div>
            </CardHeader>
            <CardContent>
              {trip.tripMemo ? <p className="mb-4 whitespace-pre-wrap rounded-xl bg-muted p-4 text-sm leading-6 text-muted-foreground">{trip.tripMemo}</p> : null}
              <div className="mb-4"><TripCompanions members={members} currentUserId={session.user.id} /></div>
              <div className="grid gap-3 md:grid-cols-3">
                <Info label="방문 날짜" value={new Intl.DateTimeFormat("ko-KR").format(trip.visitDate)} />
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
          </Card>
          <ProgressSummary tasks={trip.tasks} />
          {canEdit ? <TaskList tasks={trip.tasks} tripId={trip.id} /> : null}
          {canEdit ? <TripBudgetWorkspace trip={trip} lodgingSearchUrl={resort?.lodgingUrl} rentalOptions={rentalOptions} /> : <TripCostDisclosure trip={trip} />}
      </div>
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
