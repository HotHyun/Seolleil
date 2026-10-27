import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CalendarDays, CheckCircle2, MapPin, Plus, Share2 } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { TripCompanions } from "@/components/trip/trip-companions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/session";
import { listTripMemberships, listUserTeams, type TripMembership } from "@/lib/trip-collaboration";
import { getTripDisplayName, getTripsByTeamIds, getTripsByUserId, type TripRecord } from "@/lib/trip-store";

export const metadata: Metadata = {
  title: "내 트립 | Korean Ski",
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
          <p className="mb-2 text-sm font-semibold text-primary">My Trips</p>
          <h1 className="text-3xl font-black md:text-5xl">내 스키 트립</h1>
        </div>
        <a href="/plan">
          <Button>
            <Plus className="h-4 w-4" />
            새 트립 만들기
          </Button>
        </a>
      </div>

      {totalTrips ? (
        <div className="space-y-8">
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard label="전체 트립" value={`${totalTrips}개`} />
            <SummaryCard label="내 다가오는 트립" value={`${upcomingTrips.length}개`} />
            <SummaryCard label="내 지난 트립" value={`${pastTrips.length}개`} />
            <SummaryCard label="공유된 트립" value={`${sharedItems.length}개`} />
          </section>
          <TripSection title="공유된 트립" eyebrow="초대받은 여행" trips={sharedItems} emptyText="초대받은 트립이 없습니다." />
          <TripSection title="다가오는 트립" trips={upcomingTrips} emptyText="예정된 트립이 없습니다." />
          <TripSection title="지난 트립" trips={pastTrips} emptyText="지난 트립이 없습니다." />
        </div>
      ) : (
        <Card>
          <CardContent className="flex min-h-56 flex-col items-center justify-center gap-4 text-center">
            <div>
              <h2 className="text-2xl font-black">아직 저장된 트립이 없습니다.</h2>
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

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs font-semibold text-muted-foreground">{label}</div>
        <div className="mt-1 text-2xl font-black">{value}</div>
      </CardContent>
    </Card>
  );
}

function TripSection({
  title,
  trips,
  emptyText,
  eyebrow
}: {
  title: string;
  trips: TripDashboardItem[];
  emptyText: string;
  eyebrow?: string;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <div>{eyebrow ? <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-primary">{eyebrow}</p> : null}<h2 className="text-xl font-black">{title}</h2></div>
        <span className="text-sm font-semibold text-muted-foreground">{trips.length}개</span>
      </div>
      {trips.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {trips.map((item) => (
            <TripCard key={item.trip.id} item={item} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-sm font-semibold text-muted-foreground">{emptyText}</CardContent>
        </Card>
      )}
    </section>
  );
}

type TripDashboardItem = { trip: TripRecord; members: TripMembership[]; sharedWithMe: boolean; currentUserId: string; permission: "read" | "edit" };

function TripCard({ item }: { item: TripDashboardItem }) {
  const { trip, members, sharedWithMe, currentUserId, permission } = item;
  const activeTasks = trip.tasks.filter((task) => task.status !== "not_needed");
  const doneTasks = activeTasks.filter((task) => ["reserved", "paid", "prepared"].includes(task.status));
  const progress = activeTasks.length ? Math.round((doneTasks.length / activeTasks.length) * 100) : 100;
  const statusLabel = trip.status === "planning" ? "계획중" : trip.status === "completed" ? "완료" : trip.status;

  return (
    <a href={`/my-trips/${trip.id}`} className="block">
      <Card className="h-full transition hover:border-zinc-400 hover:shadow-sm">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2"><span className="text-sm font-semibold text-primary">{trip.season}</span>{sharedWithMe ? <StatusBadge tone="good"><Share2 className="mr-1 h-3 w-3" />공유됨 · {permission === "edit" ? "편집" : "보기"}</StatusBadge> : null}</div>
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
              {trip.peopleCount}명 · {trip.transportType}
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              완료 {doneTasks.length}개 / 체크 {activeTasks.length}개
            </span>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs font-semibold text-muted-foreground">
              <span>준비 진행률</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
