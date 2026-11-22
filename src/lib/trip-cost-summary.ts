import { calculateTripBudget, type TripBudgetState } from "@/lib/trip-budget";
import { computeCurrentTripCost, type CostableTrip } from "@/lib/trip-current-cost";

export type TripCostSummary = {
  total: number;
  perPerson: number;
  splitCount: number;
  // 사용자가 직접 확정한 금액(덮어쓰기 + 추가 비용)과 아직 참고가인 금액.
  confirmedAmount: number;
  estimatedAmount: number;
};

type SummaryTrip = CostableTrip & { budgetData: TripBudgetState; splitCount: number };

export function summarizeBudget(cost: Parameters<typeof calculateTripBudget>[0], budget: TripBudgetState, splitCount: number): TripCostSummary {
  const totals = calculateTripBudget(cost, budget, splitCount);
  const estimatedAmount = totals.items.filter(item => !item.overridden).reduce((sum, item) => sum + item.amount, 0);
  return { total: totals.total, perPerson: totals.perPerson, splitCount: totals.splitCount, confirmedAmount: totals.total - estimatedAmount, estimatedAmount };
}

// 트립 전역 비용 바에 쓰는 현재 예상 총액. 현재 가격 데이터와 저장된 확정 금액을 합산한다.
export function summarizeTripCost(trip: SummaryTrip): TripCostSummary | null {
  const cost = computeCurrentTripCost(trip);
  if (!cost) return null;
  return summarizeBudget(cost, trip.budgetData, trip.splitCount || trip.peopleCount);
}
