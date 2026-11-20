import { describe, expect, it } from "vitest";
import { tripSeasonFor } from "@/lib/season-fallback";
import { withCurrentCost, type CostableTrip } from "@/lib/trip-current-cost";
import { parseTripSkiPlan } from "@/lib/trip-ski-plan";
import type { CostEstimate } from "@/lib/types";

const staleCost: CostEstimate = { min: 1, max: 1, representative: 1, confidence: "confirmed", items: [] };

function trip(resortId: string, visitDate: string, liftTicketTimeSlot: "4h" | "6h"): CostableTrip {
  const date = new Date(`${visitDate}T00:00:00Z`);
  return {
    resortId,
    selectedRecommendation: { score: 1, cost: staleCost },
    selectedRentalOptionId: null,
    selectedLiftTicketOptionId: null,
    visitDate: date,
    departureLocation: "seoul-gangnam",
    peopleCount: 2,
    transportType: "car",
    shuttleRouteId: null,
    shuttleStopId: null,
    tripDuration: "same_day",
    skillLevel: "beginner",
    rideType: "ski",
    ownsEquipment: false,
    ownsClothing: false,
    budgetMin: null,
    budgetMax: null,
    lodgingCostInput: null,
    liftTicketTimeSlot,
    skiPlan: parseTripSkiPlan(null, { visitDate: date, endDate: date, liftTicketTimeSlot, transportType: "car" })
  };
}

const costOf = (value: CostableTrip) => (value.selectedRecommendation as { cost: CostEstimate }).cost;

describe("current trip cost", () => {
  it("replaces a stale stored snapshot with the current price data", () => {
    const live = withCurrentCost(trip("jisan", "2027-01-16", "4h"));
    const lift = costOf(live).items.find(item => item.key.startsWith("lift_ticket"));

    expect(costOf(live).representative).toBeGreaterThan(1);
    expect(lift).toMatchObject({ referenceSeason: "2025-2026", confidence: "estimated" });
    expect(live.selectedRecommendation).toMatchObject({ score: 1 });
  });

  it("switches to published 26/27 prices without a reference marker", () => {
    const live = withCurrentCost(trip("yongpyong", "2026-12-20", "6h"));
    const lift = costOf(live).items.find(item => item.key.startsWith("lift_ticket"));

    expect(lift?.referenceSeason).toBeUndefined();
    expect(lift?.representative).toBe(89000 * 2);
  });

  it("shows the 26/27 season for 26/27 visit dates regardless of the stored season", () => {
    expect(tripSeasonFor("2027-01-10", "2025-2026")).toBe("2026-2027");
    expect(tripSeasonFor(new Date("2026-12-20T00:00:00Z"), "2025-2026")).toBe("2026-2027");
    expect(tripSeasonFor("2026-01-10", "2025-2026")).toBe("2025-2026");
    expect(tripSeasonFor("2027-12-20", "2025-2026")).toBe("2025-2026");
  });
});
