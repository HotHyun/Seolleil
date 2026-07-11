import { AnalyticsTrack } from "@/components/analytics-track";
import { TripBuilderForm } from "@/components/trip/trip-builder-form";
import { createDirectTripAction } from "@/app/actions";
import { getResort } from "@/data/resorts";
import { getSession } from "@/lib/session";

export default async function PlanPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const session = await getSession();
  const resortId = Array.isArray(params.resortId) ? params.resortId[0] : params.resortId;
  const selectedResort = resortId ? getResort(resortId) : undefined;

  return (
    <main className="page-shell py-8">
      <AnalyticsTrack eventName="trip_form_start" />
      <div className="mb-8 max-w-3xl">
        <p className="mb-2 text-sm font-semibold text-primary">{selectedResort ? "스키장 고정 트립" : "트립 추천"}</p>
        <h1 className="text-3xl font-black md:text-5xl">
          {selectedResort ? `${selectedResort.name} 트립을 바로 만듭니다.` : "조건을 입력하면 추천 3곳을 비교합니다."}
        </h1>
        {selectedResort ? (
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            스키장은 고정하고 날짜, 인원, 장비 상태만 입력해 바로 체크리스트와 비용 요약을 만듭니다.
          </p>
        ) : null}
      </div>
      <TripBuilderForm
        action={selectedResort ? createDirectTripAction : "/recommendations"}
        selectedResort={selectedResort}
        isAuthenticated={Boolean(session?.user)}
      />
    </main>
  );
}
