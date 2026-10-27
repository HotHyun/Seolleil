import { describe, expect, it } from "vitest";
import { rentalPriceRules } from "@/data/prices";
import {
  createEmptySkiDay,
  enumerateTripDates,
  lodgingPlanIsComplete,
  optionAppliesToDay,
  parseTripSkiPlan,
  rentalPriceAvailability,
  rebuildSkiSchedule,
  transportPlanIsComplete,
  tripDayTypeLabel
} from "@/lib/trip-ski-plan";

describe("trip ski plan", () => {
  it("enumerates an inclusive trip range and rejects ranges over 14 days", () => {
    expect(enumerateTripDates("2026-01-15", "2026-01-17")).toEqual(["2026-01-15", "2026-01-16", "2026-01-17"]);
    expect(enumerateTripDates("2026-01-01", "2026-01-15")).toHaveLength(14);
    expect(enumerateTripDates("2026-99-01", "2026-99-02")).toEqual([]);
  });

  it("preserves per-day choices when the ski schedule changes", () => {
    const first = { ...createEmptySkiDay("2026-01-16", "4h"), rentalShopId: "shop-a", equipmentOptionId: "gear-a" };
    const plan = rebuildSkiSchedule({ version: 2, days: [first], lodgingNights: [], transportLegs: [
      { direction: "outbound", date: "2026-01-16", transportType: "car", shuttleRouteId: null, shuttleStopId: null },
      { direction: "return", date: "2026-01-16", transportType: "car", shuttleRouteId: null, shuttleStopId: null }
    ] }, [
      { date: "2026-01-16", timeSlot: "6h" },
      { date: "2026-01-17", timeSlot: "full_day" }
    ], "2026-01-16", "2026-01-18");
    expect(plan.days[0]).toMatchObject({ date: "2026-01-16", timeSlot: "6h", rentalShopId: "shop-a", equipmentOptionId: "gear-a" });
    expect(plan.days[1]).toMatchObject({ date: "2026-01-17", timeSlot: "full_day", rentalShopId: null });
    expect(plan.lodgingNights.map(night => night.date)).toEqual(["2026-01-16", "2026-01-17"]);
    expect(plan.transportLegs).toMatchObject([{ direction: "outbound", date: "2026-01-16" }, { direction: "return", date: "2026-01-18" }]);
  });

  it("migrates a legacy package selection into the first ski date", () => {
    const packageOption = rentalPriceRules.find(option => option.itemType === "equipment_clothing_package")!;
    const plan = parseTripSkiPlan(null, {
      visitDate: new Date("2026-01-17T00:00:00Z"),
      liftTicketTimeSlot: "4h",
      selectedRentalShopId: packageOption.rentalShopId,
      selectedRentalOptionId: packageOption.id,
      rentalOptions: rentalPriceRules
    });
    expect(plan.days[0]).toMatchObject({ date: "2026-01-17", packageOptionId: packageOption.id });
    expect(tripDayTypeLabel(plan.days[0].date)).toBe("주말");
  });

  it("migrates legacy lodging totals and round-trip transport into daily plan data", () => {
    const plan = parseTripSkiPlan(null, {
      visitDate: new Date("2026-01-16T00:00:00Z"),
      endDate: new Date("2026-01-18T00:00:00Z"),
      liftTicketTimeSlot: "4h",
      transportType: "shuttle",
      shuttleRouteId: "route-a",
      shuttleStopId: "stop-a",
      lodgingName: "테스트 숙소",
      lodgingCostInput: 210001
    });
    expect(plan.lodgingNights).toEqual([
      expect.objectContaining({ date: "2026-01-16", lodgingName: "테스트 숙소", cost: 105001 }),
      expect.objectContaining({ date: "2026-01-17", lodgingName: "테스트 숙소", cost: 105000 })
    ]);
    expect(plan.transportLegs).toEqual([
      expect.objectContaining({ direction: "outbound", date: "2026-01-16", transportType: "public_transit", shuttleRouteId: "route-a" }),
      expect.objectContaining({ direction: "return", date: "2026-01-18", transportType: "public_transit", shuttleRouteId: "route-a" })
    ]);
  });

  it("matches rental rules using both day and time conditions", () => {
    const option = rentalPriceRules.find(rule => rule.id === "high1-ski-no1-equipment-5h")!;
    expect(optionAppliesToDay(option, { date: "2026-01-16", timeSlot: "5h" })).toBe(true);
    expect(optionAppliesToDay(option, { date: "2026-01-16", timeSlot: "full_day" })).toBe(false);
  });

  it("distinguishes unavailable future-season pricing from an empty rental catalog", () => {
    const options = rentalPriceRules.filter(rule => rule.rentalShopId === "high1-ski-no1");
    expect(rentalPriceAvailability(options, { date: "2026-01-16", timeSlot: "5h" })).toBe("available");
    expect(rentalPriceAvailability(options, { date: "2026-12-24", timeSlot: "5h" })).toBe("outside_validity");
    expect(rentalPriceAvailability([], { date: "2026-12-24", timeSlot: "5h" })).toBe("no_catalog");
  });

  it("requires lodging details but not an optional shuttle route to complete transit planning", () => {
    const plan = parseTripSkiPlan(null, {
      visitDate: new Date("2026-01-16T00:00:00Z"),
      endDate: new Date("2026-01-18T00:00:00Z"),
      liftTicketTimeSlot: "4h",
      transportType: "shuttle"
    });
    expect(lodgingPlanIsComplete(plan)).toBe(false);
    expect(transportPlanIsComplete(plan)).toBe(true);
    plan.lodgingNights = plan.lodgingNights.map(night => ({ ...night, lodgingName: "숙소" }));
    plan.transportLegs = plan.transportLegs.map(leg => ({ ...leg, shuttleRouteId: "route", shuttleStopId: "stop" }));
    expect(lodgingPlanIsComplete(plan)).toBe(true);
    expect(transportPlanIsComplete(plan)).toBe(true);
  });
});
