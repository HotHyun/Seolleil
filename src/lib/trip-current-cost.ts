import { getResort } from "@/data/resorts";
import { getSkiShuttleRoutes } from "@/data/ski-shuttles";
import { estimateTripCost } from "@/lib/pricing";
import type { TripSkiPlan } from "@/lib/trip-ski-plan";
import type { CostEstimate, TimeSlot, TransportType } from "@/lib/types";

export type CostableTrip = {
  resortId: string;
  selectedRecommendation: unknown;
  selectedRentalOptionId: string | null;
  selectedLiftTicketOptionId: string | null;
  visitDate: Date;
  departureLocation: string;
  peopleCount: number;
  transportType: TransportType;
  shuttleRouteId: string | null;
  shuttleStopId: string | null;
  tripDuration: "same_day" | "overnight";
  skillLevel: "first_time" | "beginner" | "intermediate" | "advanced";
  rideType: "ski" | "snowboard" | "both";
  ownsEquipment: boolean;
  ownsClothing: boolean;
  budgetMin: number | null;
  budgetMax: number | null;
  lodgingCostInput: number | null;
  liftTicketTimeSlot: string;
  skiPlan: TripSkiPlan;
};

// 저장된 스냅샷이 아니라 현재 가격 데이터로 트립 비용을 다시 계산한다.
// 26/27 공식 가격이 등록되면 이미 만든 트립의 금액도 이 계산을 거치며 바로 바뀐다.
export function computeCurrentTripCost(trip: CostableTrip): CostEstimate | null {
  const resort = getResort(trip.resortId);
  if (!resort) return null;
  const shuttleRoute = trip.shuttleRouteId ? getSkiShuttleRoutes(trip.resortId).find(route => route.id === trip.shuttleRouteId) : undefined;
  return estimateTripCost(
    resort,
    {
      visitDate: trip.visitDate.toISOString().slice(0, 10),
      departureLocation: trip.departureLocation,
      peopleCount: trip.peopleCount,
      tripDuration: trip.tripDuration,
      skillLevel: trip.skillLevel,
      rideType: trip.rideType,
      ownsEquipment: trip.ownsEquipment,
      ownsClothing: trip.ownsClothing,
      transportType: trip.transportType,
      budgetMin: trip.budgetMin ?? undefined,
      budgetMax: trip.budgetMax ?? undefined,
      priorities: ["beginner", "close", "rental"],
      liftTicketTimeSlot: trip.liftTicketTimeSlot as TimeSlot,
      lodgingCostInput: trip.lodgingCostInput ?? undefined
    },
    trip.selectedRentalOptionId ?? undefined,
    shuttleRoute,
    trip.selectedLiftTicketOptionId ?? undefined,
    trip.skiPlan
  );
}

// 화면에 넘기는 트립의 비용 스냅샷을 현재 가격으로 계산한 값으로 바꾼다. 계산할 수 없으면 원본을 그대로 돌려준다.
export function withCurrentCost<T extends CostableTrip>(trip: T): T {
  const cost = computeCurrentTripCost(trip);
  if (!cost) return trip;
  const recommendation = trip.selectedRecommendation && typeof trip.selectedRecommendation === "object"
    ? (trip.selectedRecommendation as Record<string, unknown>)
    : {};
  return { ...trip, selectedRecommendation: { ...recommendation, cost } };
}
