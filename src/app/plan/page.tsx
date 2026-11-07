import { Suspense } from "react";
import { AnalyticsTrack } from "@/components/analytics-track";
import { TripBuilderForm } from "@/components/trip/trip-builder-form";
import { PlanPageContent } from "@/components/trip/plan-page-content";

export default function PlanPage() {
  return (
    <Suspense fallback={<PlanPageFallback />}>
      <PlanPageContent />
    </Suspense>
  );
}

function PlanPageFallback() {
  return (
    <main className="page-shell py-8" aria-busy="true">
      <AnalyticsTrack eventName="trip_form_start" />
      <div className="mb-8 max-w-3xl">
        <p className="mb-2 text-sm font-semibold text-primary">트립 추천</p>
        <h1 className="text-3xl font-black md:text-5xl">조건을 입력하면 추천 3곳을 비교합니다.</h1>
      </div>
      <TripBuilderForm action="/recommendations" />
    </main>
  );
}
