import { describe, expect, it } from "vitest";
import { calculateTripBudget, parseTripBudget } from "@/lib/trip-budget";
import type { CostEstimate } from "@/lib/types";

const cost: CostEstimate = {
  min: 150_000, max: 170_000, representative: 160_000, confidence: "estimated",
  items: [
    { key: "lift_ticket", label: "리프트권", representative: 100_000, confidence: "confirmed" },
    { key: "transport", label: "교통비", representative: 60_000, confidence: "estimated" }
  ]
};

describe("trip budget", () => {
  it("uses confirmed overrides, extras and rounds an equal split upward", () => {
    const result = calculateTripBudget(cost, { overrides: { lift_ticket: 90_000 }, extras: [{ id: "meal", category: "meal", title: "저녁", amount: 31_001 }] }, 3);
    expect(result.total).toBe(181_001);
    expect(result.perPerson).toBe(60_334);
    expect(result.items[0].overridden).toBe(true);
  });

  it("drops malformed persisted entries", () => {
    expect(parseTripBudget({ overrides: { rental: -1 }, extras: [{ id: "", title: "", amount: -1 }] })).toEqual({ overrides: {}, extras: [] });
  });
});
