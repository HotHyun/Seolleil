import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, ExternalLink, ShieldAlert } from "lucide-react";
import { signInWithGoogleAction } from "@/app/auth-actions";
import { AnalyticsLink } from "@/components/analytics-link";
import { StatusBadge } from "@/components/status-badge";
import { ProgressSummary } from "@/components/trip/progress";
import { TaskList } from "@/components/trip/task-list";
import { TripBudgetWorkspace } from "@/components/trip/trip-budget-workspace";
import { TripManagementMenu } from "@/components/trip/trip-management-menu";
import { TripDashboard } from "@/components/trip/trip-dashboard";
import { TripDecisionWorkspace } from "@/components/trip/trip-decision-workspace";
import { TripIdentityEditor } from "@/components/trip/trip-identity-editor";
import { TripWorkspaceNav } from "@/components/trip/trip-workspace-nav";
import { getTripWorkspaceView, isTripDecisionView } from "@/lib/trip-workspace";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getResort } from "@/data/resorts";
import { getTripByEditTokenHash, getTripDisplayName } from "@/lib/trip-store";
import { hashToken } from "@/lib/tokens";
import { getRentalOptionsForResort } from "@/lib/pricing";
import { getNearbyLodgingsForResort } from "@/data/resort-map";
import { skiPlanDateLabel } from "@/lib/trip-ski-plan";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default async function TripEditPage({
  params,
  searchParams
}: {
  params: Promise<{ editToken: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ editToken }, query] = await Promise.all([params, searchParams]);
  const shareToken = Array.isArray(query.share) ? query.share[0] : query.share;
  const sharePermission = (Array.isArray(query.sharePermission) ? query.sharePermission[0] : query.sharePermission) === "edit" ? "edit" : "read";
  const activeView = getTripWorkspaceView(query.view);
  const [trip, session] = await Promise.all([
    getTripByEditTokenHash(hashToken(editToken)),
    getSession()
  ]);
  if (!trip) notFound();
  if (trip.userId && trip.userId === session?.user?.id) {
    const ownerQuery = new URLSearchParams();
    for (const key of ["view", "notice", "share", "sharePermission"] as const) {
      const value = Array.isArray(query[key]) ? query[key]?.[0] : query[key];
      if (value) ownerQuery.set(key, value);
    }
    const suffix = ownerQuery.size ? `?${ownerQuery.toString()}` : "";
    redirect(`/my-trips/${trip.id}${suffix}`);
  }

  const resort = getResort(trip.resortId);
  const rentalGroups = getRentalOptionsForResort(trip.resortId);
  const lodgingOptions = getNearbyLodgingsForResort(trip.resortId);
  const rentalOptions = rentalGroups.flatMap(({ shop, options }) => options.filter(option => option.itemType !== "lift_ticket").map(option => ({ value: option.id, label: `${shop.name} · ${option.label}` })));
  const shareUrl = shareToken ? `/share/${shareToken}` : undefined;

  return (
    <main className="min-h-[calc(100svh-4rem)] py-3 sm:py-4 lg:py-0">
      <TripWorkspaceNav basePath={`/trips/${editToken}`} activeView={activeView} tasks={trip.tasks}>
      <div className="space-y-4">
      {activeView === "overview" ? <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-950 sm:p-4">
        <div className="flex gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <div className="font-black">이 편집 링크를 가진 사람은 트립을 수정할 수 있습니다.</div>
              <p className="mt-1 text-sm">이 링크는 나만 보관하고, 동행자에게는 관리 메뉴의 읽기 전용 공유 링크를 보내세요.</p>
          </div>
        </div>
      </div> : <div className="inline-flex max-w-full items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-950"><ShieldAlert aria-hidden="true" className="h-4 w-4 shrink-0" /><span className="min-w-0 text-pretty">편집 권한 링크 사용 중 · 이 링크를 다른 사람에게 보내지 마세요.</span></div>}

          {activeView === "overview" ? <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2"><StatusBadge tone="good">{trip.season}</StatusBadge><StatusBadge>{trip.status}</StatusBadge></div>
                  <div className="mt-3"><TripIdentityEditor tripId={trip.id} editToken={editToken} name={getTripDisplayName(trip)} canEdit /></div>
                  <p className="mt-1 text-sm font-semibold text-muted-foreground">{trip.resortNameSnapshot}</p>
                </div>
                <TripManagementMenu trip={trip} editToken={editToken} shareUrl={shareUrl} sharePermission={sharePermission} canManageSharing={false} />
              </div>
            </CardHeader>
            <CardContent>
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
          {activeView === "overview" && !trip.userId ? (
          <Card>
            <CardHeader>
              <CardTitle>이 트립을 잃어버리지 마세요</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <>
                  <p className="text-sm text-muted-foreground">
                    로그인하면 이 링크를 따로 저장하지 않아도 내 트립 목록에서 다시 열 수 있습니다.
                  </p>
                  <form action={signInWithGoogleAction}>
                    <input type="hidden" name="callbackUrl" value={`/trips/${editToken}`} />
                    <Button className="w-full" type="submit">
                      Google로 로그인하고 저장
                    </Button>
                  </form>
                </>
            </CardContent>
          </Card>
          ) : activeView === "overview" ? <div className="flex items-center gap-2 rounded-xl bg-primary/10 p-3 text-sm font-semibold text-primary"><CheckCircle2 className="h-4 w-4" /> 내 트립에 저장되어 있어요.</div> : null}
              {activeView === "overview" ? <div className="space-y-4"><TripDashboard trip={trip} basePath={`/trips/${editToken}`} /><ProgressSummary tasks={trip.tasks} /></div> : null}
              {isTripDecisionView(activeView) ? <TripDecisionWorkspace view={activeView} trip={trip} rentalGroups={rentalGroups} lodgingOptions={lodgingOptions} liftUrl={resort?.liftTicketUrl} shuttleUrl={resort?.shuttleUrl} lodgingSearchUrl={resort?.lodgingUrl} editToken={editToken} /> : null}
              {activeView === "checklist" ? <TaskList tasks={trip.tasks} editToken={editToken} basePath={`/trips/${editToken}`} /> : null}
              {activeView === "budget" ? <TripBudgetWorkspace trip={trip} basePath={`/trips/${editToken}`} editToken={editToken} rentalOptions={rentalOptions} /> : null}
      </div>
      </TripWorkspaceNav>
    </main>
  );
}

function WorkspaceIntro() {
  return <Card><CardHeader><CardTitle>여행 준비 현황</CardTitle></CardHeader><CardContent><p className="text-sm leading-6 text-muted-foreground">체크리스트와 비용을 각각의 메뉴에서 관리할 수 있어요. 준비할 일과 실제 비용을 한 단계씩 확정해 보세요.</p></CardContent></Card>;
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted p-3">
      <div className="text-xs font-semibold text-muted-foreground">{label}</div>
      <div className="mt-1 font-black">{value}</div>
    </div>
  );
}
