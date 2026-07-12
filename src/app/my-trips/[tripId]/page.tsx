import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Copy, CopyPlus, ExternalLink, Trash2 } from "lucide-react";
import { deleteTripAction, duplicateTripAction, regenerateShareLinkAction } from "@/app/actions";
import { AnalyticsLink } from "@/components/analytics-link";
import { StatusBadge } from "@/components/status-badge";
import { ShareLinkBox } from "@/components/share-link-box";
import { ProgressSummary } from "@/components/trip/progress";
import { TaskList } from "@/components/trip/task-list";
import { TripEditForm } from "@/components/trip/trip-edit-form";
import { TripCostAndBooking } from "@/components/trip/trip-overview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getResort } from "@/data/resorts";
import { getSession } from "@/lib/session";
import { getTripById } from "@/lib/trip-store";

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
  const trip = await getTripById(tripId);

  if (!trip || trip.userId !== session.user.id) notFound();

  const resort = getResort(trip.resortId);
  const shareUrl = shareToken ? `/share/${shareToken}` : undefined;

  return (
    <main className="page-shell py-8">
      <div className="mb-5 rounded-lg border border-primary/30 bg-primary/10 p-4 text-primary">
        <div className="font-black">내 트립에 저장되어 있습니다.</div>
        <p className="mt-1 text-sm">이 화면은 로그인한 본인만 수정할 수 있습니다. 공유할 때는 읽기 전용 공유 링크를 사용하세요.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <section className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>다시 계획하기</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">일정과 체크 항목을 복사하고 완료 상태만 초기화합니다.</p>
              <form action={duplicateTripAction}>
                <input type="hidden" name="tripId" value={trip.id} />
                <Button variant="secondary" className="w-full" type="submit">
                  <CopyPlus className="h-4 w-4" /> 이 트립 복제
                </Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge tone="good">{trip.season}</StatusBadge>
                <StatusBadge>{trip.status}</StatusBadge>
              </div>
              <CardTitle className="text-3xl font-black">{trip.resortNameSnapshot} 트립</CardTitle>
            </CardHeader>
            <CardContent>
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

          <TripCostAndBooking trip={trip} />

          <TaskList tasks={trip.tasks} tripId={trip.id} />
        </section>

        <aside className="space-y-5">
          <ProgressSummary tasks={trip.tasks} />
          <Card>
            <CardHeader>
              <CardTitle>트립 수정</CardTitle>
            </CardHeader>
            <CardContent>
              <TripEditForm trip={trip} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>공유</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {shareUrl ? (
                <ShareLinkBox sharePath={shareUrl} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  보안상 원문 공유 토큰은 DB에 저장하지 않습니다. 필요하면 새 읽기 전용 공유 링크를 재발급하세요.
                </p>
              )}
              <form action={regenerateShareLinkAction}>
                <input type="hidden" name="tripId" value={trip.id} />
                <Button variant="secondary" className="w-full" type="submit">
                  <Copy className="h-4 w-4" /> 읽기 링크 재발급
                </Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>삭제</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={deleteTripAction}>
                <input type="hidden" name="tripId" value={trip.id} />
                <Button variant="danger" className="w-full" type="submit">
                  <Trash2 className="h-4 w-4" /> 트립 삭제
                </Button>
              </form>
            </CardContent>
          </Card>
        </aside>
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
