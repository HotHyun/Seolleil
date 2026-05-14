import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Copy, ExternalLink, ShieldAlert, Trash2 } from "lucide-react";
import { deleteTripAction, regenerateShareLinkAction } from "@/app/actions";
import { AnalyticsLink } from "@/components/analytics-link";
import { StatusBadge } from "@/components/status-badge";
import { ShareLinkBox } from "@/components/share-link-box";
import { ProgressSummary } from "@/components/trip/progress";
import { TaskList } from "@/components/trip/task-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getResort } from "@/data/resorts";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/tokens";

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
  const { editToken } = await params;
  const query = await searchParams;
  const shareToken = Array.isArray(query.share) ? query.share[0] : query.share;
  const trip = await prisma.trip.findUnique({
    where: { editTokenHash: hashToken(editToken) },
    include: { tasks: { orderBy: [{ category: "asc" }, { sortOrder: "asc" }] } }
  });
  if (!trip) notFound();

  const resort = getResort(trip.resortId);
  const shareUrl = shareToken ? `/share/${shareToken}` : undefined;

  return (
    <main className="page-shell py-8">
      <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-950">
        <div className="flex gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <div className="font-black">이 편집 링크를 가진 사람은 트립을 수정할 수 있습니다.</div>
              <p className="mt-1 text-sm">공유할 때는 읽기 전용 공유 링크를 사용하세요. 생성 직후에만 공유 토큰이 표시됩니다.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <section className="space-y-5">
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

          <TaskList tasks={trip.tasks} editToken={editToken} />
        </section>

        <aside className="space-y-5">
          <ProgressSummary tasks={trip.tasks} />
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
                <input type="hidden" name="editToken" value={editToken} />
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
                <input type="hidden" name="editToken" value={editToken} />
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
