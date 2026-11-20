import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DaySummaryPanel } from "@/components/trip/day-summary-panel";
import { getRentalOptionsForResort } from "@/lib/pricing";
import { buildDaySummaries } from "@/lib/trip-day-summary";
import { parseTripSkiPlan } from "@/lib/trip-ski-plan";

function render(date: string, edit?: (plan: ReturnType<typeof parseTripSkiPlan>) => void, resortId = "konjiam") {
  const day = new Date(`${date}T00:00:00Z`);
  const plan = parseTripSkiPlan(null, { visitDate: day, endDate: day, liftTicketTimeSlot: "4h", transportType: "car" });
  edit?.(plan);
  const summaries = buildDaySummaries(resortId, plan, getRentalOptionsForResort(resortId), 2);
  return renderToStaticMarkup(createElement(DaySummaryPanel, { summaries, peopleCount: 2, onSelectDay: () => {}, canEdit: true }));
}

describe("day summary panel", () => {
  it("shows an undecided day with the lift price and a prompt to choose a rental shop", () => {
    const html = render("2026-01-17");
    expect(html).toContain("렌탈 미정");
    expect(html).toContain("아직 정하지 않았어요");
    expect(html).toContain("공식 4시간권");
    expect(html).toContain("이 날짜 렌탈 고르기");
  });

  it("shows a confirmed shop with its gear prices and the day total", () => {
    const groups = getRentalOptionsForResort("konjiam");
    const group = groups.find(item => item.options.some(option => option.itemType === "equipment"))!;
    const equipment = group.options.find(option => option.itemType === "equipment")!;
    const html = render("2026-01-17", plan => { plan.days[0] = { ...plan.days[0], rentalShopId: group.shop.id, equipmentOptionId: equipment.id }; });
    expect(html).toContain("렌탈 확정");
    expect(html).toContain(group.shop.name);
    expect(html).toContain("이 날 합계");
    expect(html).toContain("이 날짜 렌탈 바꾸기");
  });

  it("flags 25/26 reference prices on 26/27 dates", () => {
    expect(render("2027-01-16", undefined, "jisan")).toContain("25/26 참고가");
  });
});
