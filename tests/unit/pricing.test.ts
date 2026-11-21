import { describe, expect, it } from "vitest";
import { resorts } from "@/data/resorts";
import { priceRules, rentalPriceRules } from "@/data/prices";
import { getSkiShuttleRoutes } from "@/data/ski-shuttles";
import { estimateTransportCost, estimateTransportPlanCost, estimateTripCost, getRentalOptionsForResort, getSellableLiftSlots, isLiftSlotNotSold, liftTicketSavings, resolveLiftPrice } from "@/lib/pricing";
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

  it("uses 25/26 prices as labelled reference prices on 26/27 dates without published prices", () => {
    const high1 = resorts.find((resort) => resort.id === "high1")!;
    const liftOption = rentalPriceRules.find(rule => rule.id === "high1-myski-lift-peak-7h")!;
    const rentalOption = rentalPriceRules.find(rule => rule.resortId === "konjiam" && rule.itemType !== "lift_ticket")!;
    const estimate = estimateTripCost(
      konjiam,
      tripInput({ visitDate: "2027-01-16", liftTicketTimeSlot: "4h" }),
      rentalOption.id
    );
    const selectedLiftEstimate = estimateTripCost(
      high1,
      tripInput({ visitDate: "2027-01-16", liftTicketTimeSlot: "7h" }),
      undefined,
      undefined,
      liftOption.id
    );

    expect(resolveLiftPrice("jisan", "4h", "2027-01-16")).toMatchObject({ referenceSeason: "2025-2026", confidence: "estimated", adultPrice: 75000 });
    expect(resolveLiftPrice("konjiam", "4h", "2027-01-16")).toMatchObject({ season: "2026-2027", confidence: "confirmed", adultPrice: 96000 });
    expect(resolveLiftPrice("konjiam", "4h", "2027-01-16")).not.toHaveProperty("referenceSeason");
    expect(resolveLiftPrice("konjiam", "4h", "2027-01-14")).toMatchObject({ adultPrice: 81000 });
    expect(estimate.items.find(item => item.key === "lift_ticket")).toMatchObject({ representative: 192000, confidence: "confirmed" });
    expect(estimate.items.find(item => item.key === "lift_ticket")?.label).not.toContain("25/26 참고가");
    expect(estimate.items.find(item => item.key === "rental")).toMatchObject({ confidence: "estimated" });
    expect(selectedLiftEstimate.items.find(item => item.key === "lift_ticket")).toMatchObject({ confidence: "estimated" });
    expect(liftTicketSavings(liftOption, "2027-01-16")).not.toBeNull();
    expect(resolveLiftPrice("konjiam", "4h", "2027-12-16")).toBeUndefined();
  });

  it("uses the published 26/27 Konjiam lift prices and treats slots missing from the table as not sold", () => {
    expect(resolveLiftPrice("konjiam", "2h", "2026-12-23")).toMatchObject({ season: "2026-2027", adultPrice: 69000, confidence: "confirmed" });
    expect(resolveLiftPrice("konjiam", "2h", "2026-12-26")).toMatchObject({ season: "2026-2027", adultPrice: 83000, confidence: "confirmed" });
    expect(resolveLiftPrice("konjiam", "6h", "2026-12-26")).toMatchObject({ adultPrice: 105000 });
    // 26/27 요금표에 없는 시간권은 25/26 값으로 대신하지 않는다.
    expect(resolveLiftPrice("konjiam", "3h", "2026-12-26")).toBeUndefined();
    expect(resolveLiftPrice("konjiam", "night", "2026-12-26")).toBeUndefined();
    expect(resolveLiftPrice("konjiam", "full_day", "2026-12-26")).toBeUndefined();
    // 개장일이 확정되기 전인 11월 방문일도 가격이 비지 않는다.
    expect(resolveLiftPrice("konjiam", "4h", "2026-11-21")).toMatchObject({ season: "2026-2027", adultPrice: 96000 });
  });

  it("uses the current official Vivaldi 26/27 lift and equipment rates by day type", () => {
    expect(resolveLiftPrice("vivaldi", "5h", "2026-12-23")).toMatchObject({
      season: "2026-2027",
      adultPrice: 75000,
      childPrice: 68000,
      dayType: "weekday"
    });
    expect(resolveLiftPrice("vivaldi", "5h", "2026-12-26")).toMatchObject({
      season: "2026-2027",
      adultPrice: 91000,
      childPrice: 82000,
      dayType: "weekend"
    });
    expect(rentalPriceRules.find(rule => rule.id === "vivaldi-official-rental-equipment-ski-5h-weekday-26-27")).toMatchObject({
      timeSlot: "5h",
      representativePrice: 34000,
      memo: expect.stringContaining("소인 31,000원")
    });
    expect(rentalPriceRules.find(rule => rule.id === "vivaldi-official-rental-helmet-7h-26-27")).toMatchObject({
      representativePrice: 7000,
      label: "안전헬멧 렌탈 8시간"
    });
  });

  it("estimates Konjiam equipment and clothing as separately priced items", () => {
    const weekday = estimateTripCost(konjiam, tripInput({
      visitDate: "2026-12-23",
      liftTicketTimeSlot: "4h",
      peopleCount: 1
    }));
    const weekend = estimateTripCost(konjiam, tripInput({
      visitDate: "2026-12-26",
      liftTicketTimeSlot: "4h",
      peopleCount: 1
    }));

    expect(weekday.items.find(item => item.key === "rental")).toMatchObject({
      label: "장비·의류 별도 대여 합산 (4h)",
      representative: 63000,
      note: expect.stringContaining("공식 묶음상품이 아니다")
    });
    expect(weekend.items.find(item => item.key === "rental")).toMatchObject({ representative: 66000 });
  });

  it("lists only the lift time slots a resort sells on the visit date", () => {
    expect(getSellableLiftSlots("konjiam", "2026-12-26")).toEqual(["2h", "4h", "6h"]);
    expect(getSellableLiftSlots("yongpyong", "2026-12-20")).toEqual(["4h", "6h", "full_day"]);
    // 지난 시즌 날짜는 그 시즌 요금표 기준이다.
    expect(getSellableLiftSlots("konjiam", "2026-01-17")).toEqual(expect.arrayContaining(["3h", "4h", "night", "full_day"]));
    // 판단할 요금 자료가 없는 날짜는 빈 배열이다.
    expect(getSellableLiftSlots("konjiam", "2030-01-01")).toEqual([]);
    expect(isLiftSlotNotSold("konjiam", "3h", "2026-12-26")).toBe(true);
    expect(isLiftSlotNotSold("konjiam", "4h", "2026-12-26")).toBe(false);
    expect(isLiftSlotNotSold("konjiam", "3h", "2030-01-01")).toBe(false);
  });

  it("says the selected lift time slot is not sold instead of asking to check the price", () => {
    const estimate = estimateTripCost(konjiam, tripInput({ visitDate: "2026-12-26", liftTicketTimeSlot: "3h" }));
    expect(estimate.items.find(item => item.key === "lift_ticket")).toMatchObject({ confidence: "unavailable", label: "리프트권 · 3시간권 미판매" });
  });

  it("labels 25/26 shuttle fares as reference prices on 26/27 dates", () => {
    const found = resorts.flatMap(resort => getSkiShuttleRoutes(resort.id).map(route => ({ resort, route })))
      .find(({ resort, route }) => {
        const estimate = estimateTripCost(resort, tripInput({ visitDate: "2026-01-20", transportType: "public_transit" }), undefined, route);
        return estimate.items.find(item => item.key === "transport")?.confidence === "confirmed";
      });
    expect(found).toBeDefined();
    const { resort, route } = found!;
    const current = estimateTripCost(resort, tripInput({ visitDate: "2026-01-20", transportType: "public_transit" }), undefined, route);
    const upcoming = estimateTripCost(resort, tripInput({ visitDate: "2026-12-20", transportType: "public_transit" }), undefined, route);

    expect(current.items.find(item => item.key === "transport")?.referenceSeason).toBeUndefined();
    expect(upcoming.items.find(item => item.key === "transport")).toMatchObject({ confidence: "estimated", referenceSeason: "2025-2026" });
    expect(upcoming.items.find(item => item.key === "transport")?.label).toContain("25/26 참고가");
  });

  it("stops using reference prices for a resort once its 26/27 prices are published", () => {
    expect(priceRules.filter(rule => rule.season === "2025-2026" && rule.resortId === "yongpyong").every(rule => rule.upcomingFallback === false)).toBe(true);
    expect(priceRules.filter(rule => rule.season === "2025-2026" && rule.resortId === "high1").every(rule => rule.upcomingFallback === false)).toBe(true);
    expect(priceRules.filter(rule => rule.season === "2025-2026" && rule.resortId === "jisan").every(rule => rule.upcomingFallback === true)).toBe(true);
    expect(resolveLiftPrice("yongpyong", "6h", "2026-12-20")).not.toHaveProperty("referenceSeason");
    expect(resolveLiftPrice("jisan", "4h", "2026-12-20")).toMatchObject({ referenceSeason: "2025-2026" });
  });

  it("uses the published 26/27 High1 lift table and drops slots that are not in it", () => {
    expect(resolveLiftPrice("high1", "3h", "2026-12-20")).toMatchObject({ season: "2026-2027", adultPrice: 66000, confidence: "confirmed" });
    expect(resolveLiftPrice("high1", "4h", "2026-12-20")).toMatchObject({ adultPrice: 73000 });
    expect(resolveLiftPrice("high1", "7h", "2027-01-16")).toMatchObject({ adultPrice: 88000 });
    expect(resolveLiftPrice("high1", "full_day", "2027-01-16")).toMatchObject({ adultPrice: 111000 });
    expect(resolveLiftPrice("high1", "5h", "2026-12-20")).toBeUndefined();
    expect(resolveLiftPrice("high1", "6h", "2026-12-20")).toBeUndefined();
    expect(getSellableLiftSlots("high1", "2026-12-20")).toEqual(["3h", "4h", "7h", "full_day"]);
    // 25/26 날짜는 그 시즌 요금표를 따른다.
    expect(resolveLiftPrice("high1", "4h", "2026-01-17")).toMatchObject({ season: "2025-2026", adultPrice: 68000 });
  });

  it("applies published 26/27 lift prices only to 26/27 visit dates", () => {
    expect(resolveLiftPrice("yongpyong", "6h", "2026-12-20")).toMatchObject({ season: "2026-2027", adultPrice: 89000, childPrice: 79000 });
    expect(resolveLiftPrice("yongpyong", "full_day", "2027-01-16")).toMatchObject({ adultPrice: 99000 });
    expect(resolveLiftPrice("yongpyong", "6h", "2026-02-14")).toMatchObject({ season: "2025-2026", adultPrice: 96000 });
    expect(resolveLiftPrice("yongpyong", "2h", "2026-12-20")).toBeUndefined();
    expect(resolveLiftPrice("alpensia", "night", "2027-01-16")).toMatchObject({ season: "2026-2027", adultPrice: 46000 });
    expect(resolveLiftPrice("alpensia", "full_day", "2027-03-08")).toBeUndefined();
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

  it("applies Jisan's round-trip discount across direction-specific routes", () => {
    const jisan = resorts.find((resort) => resort.id === "jisan")!;
    const routes = getSkiShuttleRoutes("jisan");
    const outbound = routes.find(route => route.id === "jisan-cityhall")!;
    const returning = routes.find(route => route.id === "jisan-return-cityhall-1800")!;
    const plan: TripSkiPlan = { version: 2, days: [createEmptySkiDay("2026-01-17")], lodgingNights: [], transportLegs: [
      { direction: "outbound", date: "2026-01-17", transportType: "shuttle", shuttleRouteId: outbound.id, shuttleStopId: outbound.stops[0].id },
      { direction: "return", date: "2026-01-17", transportType: "shuttle", shuttleRouteId: returning.id, shuttleStopId: returning.stops[0].id }
    ] };

    expect(estimateTransportPlanCost(jisan, tripInput({ transportType: "shuttle", peopleCount: 2 }), plan)).toMatchObject({ label: "셔틀 왕복 비용", representative: 76000, confidence: "confirmed", sourceName: "투어윈도우글로벌" });
  });

  it("keeps a confirmed zero cost for a selected free resort shuttle", () => {
    const o2 = resorts.find((resort) => resort.id === "o2")!;
    const route = getSkiShuttleRoutes("o2")[0];
    expect(estimateTransportCost(o2, tripInput({ transportType: "shuttle" }), route)).toMatchObject({ label: "무료 셔틀", representative: 0, min: 0, max: 0, confidence: "confirmed" });
  });

  it("adds Muju's city-specific one-way fares across separate direction routes", () => {
    const muju = resorts.find((resort) => resort.id === "muju")!;
    const routes = getSkiShuttleRoutes("muju");
    const outbound = routes.find(route => route.id === "muju-mujuro-early")!;
    const returning = routes.find(route => route.id === "muju-mujuro-return-1630")!;
    const outboundStop = outbound.stops.find(stop => stop.city === "군산")!;
    const returnStop = returning.stops.find(stop => stop.city === "군산")!;
    const plan: TripSkiPlan = { version: 2, days: [createEmptySkiDay("2026-01-17")], lodgingNights: [], transportLegs: [
      { direction: "outbound", date: "2026-01-17", transportType: "shuttle", shuttleRouteId: outbound.id, shuttleStopId: outboundStop.id },
      { direction: "return", date: "2026-01-17", transportType: "shuttle", shuttleRouteId: returning.id, shuttleStopId: returnStop.id }
    ] };

    expect(estimateTransportPlanCost(muju, tripInput({ transportType: "shuttle", peopleCount: 2 }), plan)).toMatchObject({ representative: 128000, min: 128000, max: 128000, confidence: "confirmed" });
  });

  it("counts one shared season pass across direction-specific Phoenix routes", () => {
    const phoenix = resorts.find((resort) => resort.id === "phoenix")!;
    const routes = getSkiShuttleRoutes("phoenix");
    const outbound = routes.find(route => route.id === "phoenix-kd-sadang")!;
    const returning = routes.find(route => route.id === "phoenix-return-1700-central")!;
    const plan: TripSkiPlan = { version: 2, days: [createEmptySkiDay("2026-01-17")], lodgingNights: [], transportLegs: [
      { direction: "outbound", date: "2026-01-17", transportType: "shuttle", shuttleRouteId: outbound.id, shuttleStopId: outbound.stops[0].id },
      { direction: "return", date: "2026-01-17", transportType: "shuttle", shuttleRouteId: returning.id, shuttleStopId: returning.stops[0].id }
    ] };

    expect(estimateTransportPlanCost(phoenix, tripInput({ transportType: "shuttle", peopleCount: 3 }), plan)).toMatchObject({ label: "셔틀 교통시즌권", representative: 825000, confidence: "confirmed" });
  });

  it("counts Alpensia's direction-specific direct routes as one round-trip product", () => {
    const alpensia = resorts.find((resort) => resort.id === "alpensia")!;
    const routes = getSkiShuttleRoutes("alpensia");
    const outbound = routes.find(route => route.id === "alpensia-kd-myeongdong")!;
    const returning = routes.find(route => route.id === "alpensia-kd-return-1310")!;
    const plan: TripSkiPlan = { version: 2, days: [createEmptySkiDay("2026-01-17")], lodgingNights: [], transportLegs: [
      { direction: "outbound", date: "2026-01-17", transportType: "shuttle", shuttleRouteId: outbound.id, shuttleStopId: outbound.stops[0].id },
      { direction: "return", date: "2026-01-17", transportType: "shuttle", shuttleRouteId: returning.id, shuttleStopId: returning.stops[0].id }
    ] };

    expect(estimateTransportPlanCost(alpensia, tripInput({ transportType: "shuttle", peopleCount: 2 }), plan)).toMatchObject({ label: "셔틀 왕복 비용", representative: 68000, confidence: "confirmed", sourceName: "경기대원고속관광" });
  });

  it("adds Vivaldi foreign shuttle one-way fares across separate direction routes", () => {
    const vivaldi = resorts.find((resort) => resort.id === "vivaldi")!;
    const routes = getSkiShuttleRoutes("vivaldi");
    const outbound = routes.find(route => route.id === "vivaldi-hongdae")!;
    const returning = routes.find(route => route.id === "vivaldi-foreign-return-1700-hongdae")!;
    const plan: TripSkiPlan = { version: 2, days: [createEmptySkiDay("2026-01-17")], lodgingNights: [], transportLegs: [
      { direction: "outbound", date: "2026-01-17", transportType: "shuttle", shuttleRouteId: outbound.id, shuttleStopId: outbound.stops[0].id },
      { direction: "return", date: "2026-01-17", transportType: "shuttle", shuttleRouteId: returning.id, shuttleStopId: returning.stops[0].id }
    ] };

    expect(estimateTransportPlanCost(vivaldi, tripInput({ transportType: "shuttle", peopleCount: 2 }), plan)).toMatchObject({ representative: 40000, min: 40000, max: 40000, confidence: "confirmed" });
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
    const plan: TripSkiPlan = { version: 2, days: [first, second], lodgingNights: [], transportLegs: [
      { direction: "outbound", date: "2026-01-16", transportType: "car", shuttleRouteId: null, shuttleStopId: null },
      { direction: "return", date: "2026-01-17", transportType: "car", shuttleRouteId: null, shuttleStopId: null }
    ] };

    const estimate = estimateTripCost(high1, tripInput({ visitDate: "2026-01-16", peopleCount: 2 }), undefined, undefined, undefined, plan);

    expect(estimate.items.find(item => item.key === "rental")).toMatchObject({ representative: 166000 });
    expect(estimate.items.find(item => item.key === "lift_ticket")?.representative).toBeGreaterThan(0);
  });

  it("adds nightly lodging and different outbound/return transport choices", () => {
    const plan: TripSkiPlan = {
      version: 2,
      days: [createEmptySkiDay("2026-01-16", "4h")],
      lodgingNights: [
        { date: "2026-01-16", lodgingName: "A", lodgingUrl: null, cost: 120000 },
        { date: "2026-01-17", lodgingName: "B", lodgingUrl: null, cost: 90000 }
      ],
      transportLegs: [
        { direction: "outbound", date: "2026-01-16", transportType: "car", shuttleRouteId: null, shuttleStopId: null },
        { direction: "return", date: "2026-01-18", transportType: "bus", shuttleRouteId: null, shuttleStopId: null }
      ]
    };
    const estimate = estimateTripCost(konjiam, tripInput({ visitDate: "2026-01-16", endDate: "2026-01-18" }), undefined, undefined, undefined, plan);
    expect(estimate.items.find(item => item.key === "lodging")).toMatchObject({ representative: 210000, confidence: "confirmed" });
    expect(estimate.items.find(item => item.key === "transport")?.label).toBe("가는 길·돌아오는 길 교통비");
  });

  it("uses High1 stop-specific one-way fares when outbound and return destinations differ", () => {
    const high1 = resorts.find((resort) => resort.id === "high1")!;
    const plan: TripSkiPlan = {
      version: 2,
      days: [createEmptySkiDay("2026-01-16", "4h")],
      lodgingNights: [],
      transportLegs: [
        { direction: "outbound", date: "2026-01-16", transportType: "shuttle", shuttleRouteId: "daewon-honam", shuttleStopId: "daewon-honam-4" },
        { direction: "return", date: "2026-01-17", transportType: "shuttle", shuttleRouteId: "daewon-honam", shuttleStopId: "daewon-honam-1" }
      ]
    };
    const estimate = estimateTripCost(high1, tripInput({ visitDate: "2026-01-16", endDate: "2026-01-17", peopleCount: 2, transportType: "shuttle" }), undefined, undefined, undefined, plan);

    expect(estimate.items.find(item => item.key === "transport")).toMatchObject({ representative: 240000, confidence: "confirmed" });
  });
});
