import type { TripCostSummary } from "@/lib/trip-cost-summary";

export const tripCostPreviewEvent = "korean-ski:trip-cost-preview";

// 비용 화면에서 저장 전 입력이 바뀌어도 전역 비용 바가 같은 값을 보여 주도록 알린다.
export function announceTripCostPreview(summary: TripCostSummary) {
  window.dispatchEvent(new CustomEvent<TripCostSummary>(tripCostPreviewEvent, { detail: summary }));
}
