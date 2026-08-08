import { describe, expect, it } from "vitest";
import { resorts } from "@/data/resorts";
import { rentalPriceRules } from "@/data/prices";
import { getSkiShuttleRoutes } from "@/data/ski-shuttles";
import { estimateTransportCost, estimateTripCost, getRentalOptionsForResort, liftTicketSavings } from "@/lib/pricing";
import { tripInput } from "../fixtures/trip-input";
import { createEmptySkiDay, type TripSkiPlan } from "@/lib/trip-ski-plan";

describe("pricing", () => {
  const konjiam = resorts.find((resort) => resort.id === "konjiam")!;

  it("estimates lift, rental, and transport costs for a rental trip", () => {
    const estimate = estimateTripCost(konjiam, tripInput());

    expect(estimate.items.map((item) => item.key)).toEqual(
      expect.arrayContaining(["lift_ticket", "rental", "transport"])
    );
    expect(estimate.min).toBeGreaterThan(0);
    expect(estimate.max).toBeGreaterThanOrEqual(estimate.min);
    expect(estimate.confidence).toBe("estimated");
  });

  it("does not add rental cost when equipment and clothing are owned unless rental is a priority", () => {
    const estimate = estimateTripCost(
      konjiam,
      tripInput({ ownsEquipment: true, ownsClothing: true, priorities: ["beginner", "close", "cheap"] })
    );

    expect(estimate.items.find((item) => item.key === "rental")).toBeUndefined();
  });

  it("estimates car transport from round-trip distance", () => {
    const transport = estimateTransportCost(konjiam, tripInput({ transportType: "car" }));

    expect(transport.key).toBe("transport");
    expect(transport.representative).toBeGreaterThan(0);
    expect(transport.note).toContain("왕복거리");
  });

  it("returns grouped rental options for a resort", () => {
    const options = getRentalOptionsForResort("konjiam");

    expect(options.length).toBeGreaterThanOrEqual(2);
    expect(options[0].options.length).toBeGreaterThan(0);
  });

  it("uses date-specific lift rules before all-day fallback rules", () => {
    const weekday = estimateTripCost(konjiam, tripInput({ visitDate: "2026-01-14", liftTicketTimeSlot: "4h" }));
    const weekend = estimateTripCost(konjiam, tripInput({ visitDate: "2026-01-17", liftTicketTimeSlot: "4h" }));

    expect(weekday.items.find((item) => item.key === "lift_ticket")?.representative).toBe(162000);
    expect(weekend.items.find((item) => item.key === "lift_ticket")?.representative).toBe(192000);
  });

  it("prices a rental-shop lift ticket independently and reports verified savings", () => {
    const high1 = resorts.find((resort) => resort.id === "high1")!;
    const liftOption = rentalPriceRules.find(rule => rule.id === "high1-myski-lift-peak-7h")!;
    const savings = liftTicketSavings(liftOption, "2026-01-17");
    const estimate = estimateTripCost(high1, tripInput({ visitDate: "2026-01-17", peopleCount: 3, liftTicketTimeSlot: "7h" }), undefined, undefined, liftOption.id);

    expect(savings).toMatchObject({ officialPrice: 82000, shopPrice: 53000, savedPerPerson: 29000, discountRate: 35 });
    expect(estimate.items.find(item => item.key === "lift_ticket")).toMatchObject({ representative: 159000, sourceName: "하이원 마이스키" });
  });

  it("uses a selected shuttle's structured round-trip fare instead of the generic estimate", () => {
    const jisan = resorts.find((resort) => resort.id === "jisan")!;
    const route = getSkiShuttleRoutes("jisan")[0];
    const estimate = estimateTripCost(jisan, tripInput({ transportType: "shuttle", peopleCount: 3 }), undefined, route);
    expect(estimate.items.find(item => item.key === "transport")).toMatchObject({ label: "셔틀 왕복 비용", representative: 114000, confidence: "confirmed", sourceName: "투어윈도우글로벌" });
  });

  it("keeps a confirmed zero cost for a selected free resort shuttle", () => {
    const o2 = resorts.find((resort) => resort.id === "o2")!;
    const route = getSkiShuttleRoutes("o2")[0];
    expect(estimateTransportCost(o2, tripInput({ transportType: "shuttle" }), route)).toMatchObject({ label: "무료 셔틀", representative: 0, min: 0, max: 0, confidence: "confirmed" });
  });

  it("adds lift and split rental selections across multiple ski dates", () => {
    const high1 = resorts.find((resort) => resort.id === "high1")!;
    const first = createEmptySkiDay("2026-01-16", "5h");
    first.rentalShopId = "high1-ski-no1";
    first.equipmentOptionId = "high1-ski-no1-equipment-5h";
    first.clothingOptionId = "high1-ski-no1-clothing-grade";
    const second = createEmptySkiDay("2026-01-17", "full_day");
    second.rentalShopId = "high1-ski-no1";
    second.equipmentOptionId = "high1-ski-no1-equipment-full-day";
    second.clothingOptionId = "high1-ski-no1-clothing-grade";
    const plan: TripSkiPlan = { version: 1, days: [first, second] };

    const estimate = estimateTripCost(high1, tripInput({ visitDate: "2026-01-16", peopleCount: 2 }), undefined, undefined, undefined, plan);

    expect(estimate.items.find(item => item.key === "rental")).toMatchObject({ representative: 166000 });
    expect(estimate.items.find(item => item.key === "lift_ticket")?.representative).toBeGreaterThan(0);
  });
});
