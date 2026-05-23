import { AnalyticsTrack } from "@/components/analytics-track";
import { TripBuilderForm } from "@/components/trip/trip-builder-form";

export default function PlanPage() {
  return (
    <main className="page-shell py-8">
      <AnalyticsTrack eventName="trip_form_start" />
      <div className="mb-8 max-w-3xl">
        <p className="mb-2 text-sm font-semibold text-primary">Trip Builder</p>
        <h1 className="text-3xl font-black md:text-5xl">조건을 입력하면 추천 3곳을 비교합니다.</h1>
      </div>
      <TripBuilderForm />
    </main>
  );
}
