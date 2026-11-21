"use client";

import { useSearchParams } from "next/navigation";
import { AnalyticsTrack } from "@/components/analytics-track";
import { TripBuilderForm } from "@/components/trip/trip-builder-form";
import { createDirectTripAction } from "@/app/actions";
import { getResort } from "@/data/resorts";

export function PlanPageContent() {
  const searchParams = useSearchParams();
  const selectedResortId = searchParams.get("resortId");
  const selectedResort = selectedResortId ? getResort(selectedResortId) : undefined;
  // 유입 경로(예: 공유 페이지 CTA)를 퍼널에서 구분한다. 허용 형식만 통과시킨다.
  const refValue = searchParams.get("ref");
  const ref = refValue && /^[a-z_]{1,20}$/.test(refValue) ? refValue : undefined;

  return (
    <main className="page-shell py-8">
      <AnalyticsTrack eventName="trip_form_start" eventData={ref ? { ref } : undefined} />
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-semibold md:text-4xl">
          {selectedResort ? `${selectedResort.name} 트립 만들기` : "조건을 입력하면 추천 3곳을 비교해요"}
        </h1>
        {selectedResort ? (
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            날짜, 인원, 장비 상태만 입력하면 체크리스트와 비용 요약이 만들어져요
          </p>
        ) : null}
      </div>
      <TripBuilderForm
        action={selectedResort ? createDirectTripAction : "/recommendations"}
        selectedResort={selectedResort}
      />
    </main>
  );
}
