import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CalendarDays, MapPin, Plus, Share2 } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { TripCompanions } from "@/components/trip/trip-companions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tripSeasonFor } from "@/lib/season-fallback";
import { getSession } from "@/lib/session";
import { listTripMemberships, listUserTeams, type TripMembership } from "@/lib/trip-collaboration";
import { getTripDisplayName, getTripsByTeamIds, getTripsByUserId, type TripRecord } from "@/lib/trip-store";
import { transportTypeLabel } from "@/lib/transport";

export const metadata: Metadata = {
  title: "내 트립 | 설레일",
  robots: {
    index: false,
    follow: false
  }
};

export default async function MyTripsPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login?callbackUrl=/my-trips");

  const [owned, teams] = await Promise.all([getTripsByUserId(session.user.id), listUserTeams(session.user.id)]);
  const teamIds = teams.teams.map(team => team.$id);
  const teamTrips = await getTripsByTeamIds(teamIds);
  const shared = teamTrips.filter(trip => trip.userId !== session.user.id);
  const relevantTeamIds = [...new Set(teamTrips.flatMap(trip => trip.teamId ? [trip.teamId] : []))];
  const memberships = await Promise.all(relevantTeamIds.map(async teamId => [teamId, await listTripMemberships(teamId)] as const));
  const membersByTeam = new Map<string, TripMembership[]>(memberships);
  const itemsFor = (trips: TripRecord[], sharedWithMe: boolean): TripDashboardItem[] => trips.map(trip => {
    const members = trip.teamId ? membersByTeam.get(trip.teamId) ?? [] : [];
    const currentMembership = members.find(member => member.userId === session.user.id && member.confirm);
    return { trip, members, sharedWithMe, currentUserId: session.user.id, permission: sharedWithMe && currentMembership?.roles.includes("editor") ? "edit" : "read" };
  });
  const ownedItems = itemsFor(owned, false);
  const sharedItems = itemsFor(shared, true).sort((left, right) => left.trip.visitDate.getTime() - right.trip.visitDate.getTime());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingTrips = ownedItems.filter(({ trip }) => trip.visitDate >= today);
  const pastTrips = ownedItems.filter(({ trip }) => trip.visitDate < today).reverse();
  const totalTrips = ownedItems.length + sharedItems.length;

  return (
    <main className="page-shell py-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold md:text-4xl">내 스키 트립</h1>
          {totalTrips ? <p className="mt-2 text-sm text-muted-foreground">전체 {totalTrips}개 · 다가오는 {upcomingTrips.length}개 · 지난 {pastTrips.length}개{sharedItems.length ? ` · 공유받은 ${sharedItems.length}개` : ""}</p> : null}
        </div>
        <a href="/plan">
          <Button>
            <Plus className="h-4 w-4" />
            새 트립 만들기
          </Button>
        </a>
      </div>

      {totalTrips ? (
        <div className="space-y-10">
          <TripSection title="다가오는 트립" trips={upcomingTrips} emptyText="예정된 트립이 없어요" today={today} />
          {sharedItems.length ? <TripSection title="공유받은 트립" trips={sharedItems} emptyText="" today={today} /> : null}
          {pastTrips.length ? (
            <details className="group">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 border-b pb-3 [&::-webkit-details-marker]:hidden">
                <h2 className="text-xl font-semibold">지난 트립 <span className="ml-1 text-sm font-normal text-muted-foreground">{pastTrips.length}개</span></h2>
                <span className="text-sm font-medium text-muted-foreground group-open:hidden">펼치기</span>
                <span className="hidden text-sm font-medium text-muted-foreground group-open:inline">접기</span>
              </summary>
              <ul className="divide-y">
                {pastTrips.map((item) => <PastTripRow key={item.trip.id} item={item} />)}
              </ul>
            </details>
          ) : null}
        </div>
      ) : (
        <Card>
          <CardContent className="flex min-h-56 flex-col items-center justify-center gap-4 text-center">
            <div>
              <h2 className="text-2xl font-semibold">아직 저장된 트립이 없습니다.</h2>
              <p className="mt-2 text-sm text-muted-foreground">트립을 만들면 이곳에서 다시 열 수 있습니다.</p>
            </div>
            <a href="/plan">
              <Button>첫 트립 만들기</Button>
            </a>
          </CardContent>
        </Card>
      )}
    </main>
  );
}

function TripSection({ title, trips, emptyText, today }: { title: string; trips: TripDashboardItem[]; emptyText: string; today: Date }) {
  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <span className="text-sm tabular-nums text-muted-foreground">{trips.length}개</span>
      </div>
      {trips.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {trips.map((item) => (
            <TripCard key={item.trip.id} item={item} today={today} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed px-4 py-8 text-sm text-muted-foreground">{emptyText}</p>
      )}
    </section>
  );
}

function tripStatusLabel(status: string) {
  return status === "planning" ? "계획중" : status === "completed" ? "완료" : status;
}

function PastTripRow({ item }: { item: TripDashboardItem }) {
  const { trip } = item;
  return (
    <li>
      <a href={`/my-trips/${trip.id}`} className="flex min-h-14 items-center justify-between gap-4 py-3 transition-colors hover:text-primary">
        <span className="min-w-0">
          <span className="block truncate font-medium">{getTripDisplayName(trip)}</span>
          <span className="mt-1 block text-xs text-muted-foreground">{new Intl.DateTimeFormat("ko-KR").format(trip.visitDate)} · {trip.peopleCount}명</span>
        </span>
        <span className="shrink-0 text-xs text-muted-foreground">{tripStatusLabel(trip.status)}</span>
      </a>
    </li>
  );
}

type TripDashboardItem = { trip: TripRecord; members: TripMembership[]; sharedWithMe: boolean; currentUserId: string; permission: "read" | "edit" };

function TripCard({ item, today }: { item: TripDashboardItem; today: Date }) {
  const { trip, members, sharedWithMe, currentUserId, permission } = item;
  const activeTasks = trip.tasks.filter((task) => task.status !== "not_needed");
  const doneTasks = activeTasks.filter((task) => ["reserved", "paid", "prepared"].includes(task.status));
  const progress = activeTasks.length ? Math.round((doneTasks.length / activeTasks.length) * 100) : 100;
  const statusLabel = tripStatusLabel(trip.status);
  const daysLeft = Math.ceil((trip.visitDate.getTime() - today.getTime()) / 86400000);

  return (
    <a href={`/my-trips/${trip.id}`} className="block">
      <Card className="h-full transition hover:border-foreground/30">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2"><span className="text-sm tabular-nums text-muted-foreground">{daysLeft > 0 ? `D-${daysLeft}` : daysLeft === 0 ? "D-day" : tripSeasonFor(trip.visitDate, trip.season)}</span>{sharedWithMe ? <StatusBadge tone="good"><Share2 className="mr-1 h-3 w-3" />공유됨 · {permission === "edit" ? "편집" : "보기"}</StatusBadge> : null}</div>
            <StatusBadge tone={trip.status === "completed" ? "good" : "neutral"}>{statusLabel}</StatusBadge>
          </div>
          <CardTitle>{getTripDisplayName(trip)}</CardTitle>
          <p className="text-sm font-semibold text-muted-foreground">{trip.resortNameSnapshot}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <TripCompanions members={members} currentUserId={currentUserId} />
          <div className="grid gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {new Intl.DateTimeFormat("ko-KR").format(trip.visitDate)}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {trip.peopleCount}명 · {transportTypeLabel(trip.transportType)}
            </span>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs font-semibold text-muted-foreground">
              <span>준비 {doneTasks.length}/{activeTasks.length}</span>
              <span className="tabular-nums">{progress}%</span>
            </div>
            <div className="h-1 rounded-full bg-muted">
              <div className="h-1 rounded-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
