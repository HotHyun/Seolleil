import { describe, expect, it } from "vitest";
import { getStaticDataReport, validateStaticData } from "@/lib/data-validation";

describe("static data validation", () => {
  it("keeps resort, price, rental, and departure data internally consistent", () => {
    expect(validateStaticData().filter((issue) => issue.severity === "error")).toEqual([]);
  });

  it("reports resort-level data quality metrics", () => {
    const report = getStaticDataReport(new Date("2026-05-16T00:00:00Z"));

    expect(report.resortCount).toBe(13);
    expect(report.resorts.every((resort) => resort.externalRentalShopCount >= 1)).toBe(true);
    expect(report.resorts.every((resort) => resort.missingTimeSlots.length === 0)).toBe(true);
    expect(report.estimatedPriceCount).toBeGreaterThan(0);
  });
});
