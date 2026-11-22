import { describe, expect, it } from "vitest";
import { summarizeBudget } from "@/lib/trip-cost-summary";
import type { CostEstimate } from "@/lib/types";

const cost: CostEstimate = {
  min: 150_000, max: 170_000, representative: 160_000, confidence: "estimated",
  items: [
    { key: "lift_ticket", label: "리프트권", representative: 100_000, confidence: "confirmed" },
    { key: "transport", label: "교통비", representative: 60_000, confidence: "estimated" }
  ]
};

describe("trip cost summary", () => {
  it("splits the total into reference and user-confirmed amounts", () => {
    const summary = summarizeBudget(cost, { overrides: { lift_ticket: 90_000 }, extras: [{ id: "meal", category: "meal", title: "저녁", amount: 10_000 }] }, 2);
    expect(summary).toEqual({ total: 160_000, perPerson: 80_000, splitCount: 2, confirmedAmount: 100_000, estimatedAmount: 60_000 });
  });

  it("treats everything as reference before the user confirms anything", () => {
    const summary = summarizeBudget(cost, { overrides: {}, extras: [] }, 3);
    expect(summary.estimatedAmount).toBe(160_000);
    expect(summary.confirmedAmount).toBe(0);
    expect(summary.perPerson).toBe(53_334);
  });

  it("updates instantly when a selection changes the cost", () => {
    const withoutRental = summarizeBudget(cost, { overrides: {}, extras: [] }, 2);
    const withRental = summarizeBudget({ ...cost, items: [...(cost.items ?? []), { key: "rental", label: "렌탈", representative: 40_000, confidence: "estimated" }] }, { overrides: {}, extras: [] }, 2);
    expect(withRental.total - withoutRental.total).toBe(40_000);
  });
});
