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
        <h1 className="text-3xl font-semibold md:text-4xl">어느 스키장으로 여행 가세요?</h1>
      </div>
      <TripBuilderForm />
    </main>
  );
}
