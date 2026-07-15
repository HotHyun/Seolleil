import { describe, expect, it } from "vitest";
import { rentalPriceRules } from "@/data/prices";
import { getNearbyLodgingsForResort } from "@/data/resort-map";
import { getRentalShopsForResort } from "@/data/resorts";
import { getStaticDataReport, validateStaticData } from "@/lib/data-validation";

describe("static data validation", () => {
  it("separates verified High1 data from listing-only candidates", () => {
    const shops = getRentalShopsForResort("high1");
    expect(shops.some((shop) => shop.id === "high1-myski" && shop.pickupAvailable)).toBe(true);
    expect(shops.filter((shop) => shop.dataStatus === "verified_25_26").length).toBeGreaterThanOrEqual(4);
    expect(rentalPriceRules.some((rule) => rule.id === "high1-myski-lift-peak-7h" && rule.representativePrice === 53000)).toBe(true);
    expect(rentalPriceRules.some((rule) => rule.rentalShopId === "high1-repo4u")).toBe(false);
    expect(rentalPriceRules.some((rule) => rule.rentalShopId === "high1-four-season" && rule.representativePrice === 12000)).toBe(true);
    expect(getNearbyLodgingsForResort("high1")).toHaveLength(5);
  });

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
