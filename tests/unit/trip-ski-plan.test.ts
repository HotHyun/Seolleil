import { describe, expect, it } from "vitest";
import { rentalPriceRules } from "@/data/prices";
import {
  createEmptySkiDay,
  enumerateTripDates,
  optionAppliesToDay,
  parseTripSkiPlan,
  rebuildSkiSchedule,
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
    const plan = rebuildSkiSchedule({ version: 1, days: [first] }, [
      { date: "2026-01-16", timeSlot: "6h" },
      { date: "2026-01-17", timeSlot: "full_day" }
    ]);
    expect(plan.days[0]).toMatchObject({ date: "2026-01-16", timeSlot: "6h", rentalShopId: "shop-a", equipmentOptionId: "gear-a" });
    expect(plan.days[1]).toMatchObject({ date: "2026-01-17", timeSlot: "full_day", rentalShopId: null });
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

  it("matches rental rules using both day and time conditions", () => {
    const option = rentalPriceRules.find(rule => rule.id === "high1-ski-no1-equipment-5h")!;
    expect(optionAppliesToDay(option, { date: "2026-01-16", timeSlot: "5h" })).toBe(true);
    expect(optionAppliesToDay(option, { date: "2026-01-16", timeSlot: "full_day" })).toBe(false);
  });
});
