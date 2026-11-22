"use client";

import { useSearchParams } from "next/navigation";
import { AnalyticsTrack } from "@/components/analytics-track";
import { recommendChoice, TripBuilderForm } from "@/components/trip/trip-builder-form";
import { createDirectTripAction } from "@/app/actions";
import { getResort } from "@/data/resorts";

export function PlanPageContent() {
  const searchParams = useSearchParams();
  const resortId = searchParams.get("resortId");
  // 스키장을 지정해 들어오면 그 스키장을, mode=recommend면 추천 흐름을 미리 선택해 둔다. 아무것도 없으면 직접 고르게 한다.
  const initialChoice = resortId && getResort(resortId) ? resortId : searchParams.get("mode") === recommendChoice ? recommendChoice : "";
  // 유입 경로(예: 공유 페이지 CTA)를 퍼널에서 구분한다. 허용 형식만 통과시킨다.
  const refValue = searchParams.get("ref");
  const ref = refValue && /^[a-z_]{1,20}$/.test(refValue) ? refValue : undefined;

  return (
    <main className="page-shell py-8">
      <AnalyticsTrack eventName="trip_form_start" eventData={ref ? { ref } : undefined} />
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-semibold md:text-4xl">어느 스키장으로 여행 가세요?</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          스키장을 고르면 체크리스트와 비용 요약이 바로 만들어져요. 아직 못 정했다면 추천을 받을 수 있어요.
        </p>
      </div>
      <TripBuilderForm directAction={createDirectTripAction} initialChoice={initialChoice} />
    </main>
  );
}
