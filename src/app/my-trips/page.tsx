import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "내 트립 | Korean Ski",
  robots: {
    index: false,
    follow: false
  }
};

export default async function MyTripsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/my-trips");

  const trips = await prisma.trip.findMany({
    where: {
      userId: session.user.id,
      status: { not: "deleted" }
    },
    orderBy: [{ visitDate: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      resortNameSnapshot: true,
      season: true,
      visitDate: true,
      peopleCount: true,
      transportType: true,
      status: true,
      tasks: {
        select: { status: true },
        orderBy: { sortOrder: "asc" }
      }
    }
  });

  return (
    <main className="page-shell py-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-2 text-sm font-semibold text-primary">My Trips</p>
          <h1 className="text-3xl font-black md:text-5xl">내 스키 트립</h1>
        </div>
        <a href="/plan">
          <Button>새 트립 만들기</Button>
        </a>
      </div>

      {trips.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {trips.map((trip) => {
            const activeTasks = trip.tasks.filter((task) => task.status !== "not_needed");
            const doneTasks = activeTasks.filter((task) => ["reserved", "paid", "prepared"].includes(task.status));
            const progress = activeTasks.length ? Math.round((doneTasks.length / activeTasks.length) * 100) : 100;

            return (
              <a key={trip.id} href={`/my-trips/${trip.id}`} className="block">
                <Card className="h-full transition hover:border-zinc-400 hover:shadow-sm">
                  <CardHeader>
                    <div className="text-sm font-semibold text-primary">{trip.season}</div>
                    <CardTitle>{trip.resortNameSnapshot} 트립</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        {new Intl.DateTimeFormat("ko-KR").format(trip.visitDate)}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {trip.peopleCount}명 · {trip.transportType}
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
          })}
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
