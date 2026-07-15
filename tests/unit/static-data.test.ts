import { describe, expect, it } from "vitest";
import { rentalPriceRules } from "@/data/prices";
import { getNearbyLodgingsForResort } from "@/data/resort-map";
import { getRentalShopsForResort, rentalShops, resorts } from "@/data/resorts";
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

  it("covers every resort with official rental and official lodging data", () => {
    for (const resort of resorts) {
      expect(getRentalShopsForResort(resort.id).some((shop) => shop.id.endsWith("official-rental"))).toBe(true);
      expect(getNearbyLodgingsForResort(resort.id).some((lodging) => lodging.distanceMinutes === 0)).toBe(true);
    }
  });

  it("never exposes listing-only rental shops to the price calculator", () => {
    const listingOnlyIds = new Set(
      rentalShops
        .filter((shop) => shop.dataStatus === "listed_25_26" && !shop.id.endsWith("official-rental"))
        .map((shop) => shop.id)
    );

    expect(
      rentalPriceRules.some((rule) => rule.rentalShopId !== undefined && listingOnlyIds.has(rule.rentalShopId))
    ).toBe(false);
    expect(rentalPriceRules.some((rule) => rule.rentalShopId === "jisan-yg-leports")).toBe(true);
    expect(rentalPriceRules.some((rule) => rule.rentalShopId === "muju-arirang")).toBe(true);
  });

  it("keeps the researched Konjiam rental directory and verified prices separated", () => {
    const shops = getRentalShopsForResort("konjiam");

    expect(shops.filter((shop) => !shop.id.endsWith("official-rental")).length).toBeGreaterThanOrEqual(10);
    expect(shops.some((shop) => shop.id === "konjiam-skibucks" && shop.dataStatus === "verified_25_26")).toBe(true);
    expect(shops.some((shop) => shop.id === "konjiam-coconut" && shop.dataStatus === "listed_25_26")).toBe(true);
    expect(rentalPriceRules.some((rule) => rule.rentalShopId === "konjiam-skibucks")).toBe(true);
    expect(rentalPriceRules.some((rule) => rule.rentalShopId === "konjiam-coconut")).toBe(false);
  });

  it("keeps the researched Yongpyong rental directory and verified prices separated", () => {
    const shops = getRentalShopsForResort("yongpyong");

    expect(shops.filter((shop) => !shop.id.endsWith("official-rental")).length).toBeGreaterThanOrEqual(9);
    expect(shops.some((shop) => shop.id === "yongpyong-white-sports" && shop.dataStatus === "verified_25_26")).toBe(true);
    expect(shops.some((shop) => shop.id === "yongpyong-tatata" && shop.dataStatus === "listed_25_26")).toBe(true);
    expect(rentalPriceRules.some((rule) => rule.rentalShopId === "yongpyong-white-sports")).toBe(true);
    expect(rentalPriceRules.some((rule) => rule.rentalShopId === "yongpyong-tatata")).toBe(false);
  });

  it("keeps the researched Muju rental directory and verified prices separated", () => {
    const shops = getRentalShopsForResort("muju");

    expect(shops.filter((shop) => !shop.id.endsWith("official-rental")).length).toBeGreaterThanOrEqual(9);
    expect(shops.some((shop) => shop.id === "muju-snowpark" && shop.dataStatus === "verified_25_26")).toBe(true);
    expect(shops.some((shop) => shop.id === "muju-skiworld" && shop.dataStatus === "listed_25_26")).toBe(true);
    expect(rentalPriceRules.some((rule) => rule.rentalShopId === "muju-snowpark")).toBe(true);
    expect(rentalPriceRules.some((rule) => rule.rentalShopId === "muju-skiworld")).toBe(false);
  });

  it("keeps the researched Alpensia rental directory and verified prices separated", () => {
    const shops = getRentalShopsForResort("alpensia");

    expect(shops.filter((shop) => !shop.id.endsWith("official-rental")).length).toBeGreaterThanOrEqual(9);
    expect(shops.some((shop) => shop.id === "alpensia-ski911" && shop.dataStatus === "verified_25_26" && shop.pickupAvailable)).toBe(true);
    expect(shops.some((shop) => shop.id === "alpensia-kind-ski" && shop.dataStatus === "listed_25_26")).toBe(true);
    expect(rentalPriceRules.some((rule) => rule.rentalShopId === "alpensia-ski911")).toBe(true);
    expect(rentalPriceRules.some((rule) => rule.rentalShopId === "alpensia-kind-ski")).toBe(false);
  });

  it("keeps the researched Vivaldi rental directory and verified prices separated", () => {
    const shops = getRentalShopsForResort("vivaldi");

    expect(shops.filter((shop) => !shop.id.endsWith("official-rental")).length).toBeGreaterThanOrEqual(7);
    expect(shops.some((shop) => shop.id === "vivaldi-jamesboard" && shop.dataStatus === "verified_25_26")).toBe(true);
    expect(shops.some((shop) => shop.id === "vivaldi-tomato" && shop.dataStatus === "listed_25_26")).toBe(true);
    expect(rentalPriceRules.some((rule) => rule.rentalShopId === "vivaldi-jamesboard")).toBe(true);
    expect(rentalPriceRules.some((rule) => rule.rentalShopId === "vivaldi-tomato")).toBe(false);
  });

  it("reports resort-level data quality metrics", () => {
    const report = getStaticDataReport(new Date("2026-05-16T00:00:00Z"));

    expect(report.resortCount).toBe(13);
    expect(report.resorts.every((resort) => resort.externalRentalShopCount >= 1)).toBe(true);
    expect(report.resorts.every((resort) => resort.missingTimeSlots.length === 0)).toBe(true);
    expect(report.estimatedPriceCount).toBeGreaterThan(0);
  });
});
