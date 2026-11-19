import { describe, expect, it } from "vitest";
import { getRentalOptionsForResort } from "@/lib/pricing";
import { buildDaySummaries } from "@/lib/trip-day-summary";
import { parseTripSkiPlan } from "@/lib/trip-ski-plan";

function planFor(date: string) {
  const day = new Date(`${date}T00:00:00Z`);
  return parseTripSkiPlan(null, { visitDate: day, endDate: day, liftTicketTimeSlot: "4h", transportType: "car" });
}

describe("trip day summary", () => {
  it("shows an undecided rental day with the official lift price only", () => {
    const groups = getRentalOptionsForResort("konjiam");
    const [summary] = buildDaySummaries("konjiam", planFor("2026-01-17"), groups, 2);

    expect(summary.rentalState).toBe("none");
    expect(summary.shopName).toBeNull();
    expect(summary.lines).toHaveLength(1);
    expect(summary.lines[0]).toMatchObject({ kind: "lift", perPerson: 96000, reference: false });
    expect(summary.total).toBe(96000 * 2);
  });

  it("adds the confirmed shop and gear prices per person and for the whole group", () => {
    const groups = getRentalOptionsForResort("konjiam");
    const group = groups.find(item => item.options.some(option => option.itemType === "equipment") && item.options.some(option => option.itemType === "clothing"))!;
    const equipment = group.options.find(option => option.itemType === "equipment")!;
    const clothing = group.options.find(option => option.itemType === "clothing")!;
    const plan = planFor("2026-01-17");
    plan.days[0] = { ...plan.days[0], rentalShopId: group.shop.id, equipmentOptionId: equipment.id, clothingOptionId: clothing.id };
    const [summary] = buildDaySummaries("konjiam", plan, groups, 3);

    expect(summary.rentalState).toBe("items");
    expect(summary.shopName).toBe(group.shop.name);
    expect(summary.lines.map(line => line.kind)).toEqual(["equipment", "clothing", "lift"]);
    const expectedPerPerson = (equipment.representativePrice ?? 0) + (clothing.representativePrice ?? 0) + 96000;
    expect(summary.perPersonTotal).toBe(expectedPerPerson);
    expect(summary.total).toBe(expectedPerPerson * 3);
  });

  it("marks a saved shop without items as a candidate and flags 25/26 reference prices on 26/27 dates", () => {
    const groups = getRentalOptionsForResort("konjiam");
    const plan = planFor("2027-01-16");
    plan.days[0] = { ...plan.days[0], rentalShopId: groups[0].shop.id };
    const [summary] = buildDaySummaries("konjiam", plan, groups, 2);

    expect(summary.rentalState).toBe("shop_only");
    expect(summary.hasReference).toBe(true);
    expect(summary.lines[0]).toMatchObject({ kind: "lift", reference: true });
  });

  it("reports an unknown price instead of zero when the lift price is not published", () => {
    const [summary] = buildDaySummaries("yongpyong", planFor("2026-12-20").days.length ? { ...planFor("2026-12-20"), days: [{ ...planFor("2026-12-20").days[0], timeSlot: "2h" }] } : planFor("2026-12-20"), [], 2);

    expect(summary.hasUnknownPrice).toBe(true);
    expect(summary.lines[0].perPerson).toBeNull();
    expect(summary.perPersonTotal).toBe(0);
  });
});
