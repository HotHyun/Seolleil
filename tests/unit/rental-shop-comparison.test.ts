import { describe, expect, it } from "vitest";
import { compareRentalShops, pickShopDay, type ComparisonContext } from "@/lib/rental-shop-comparison";
import type { RentalPriceRule, RentalShop } from "@/lib/types";

const date = "2027-01-10";
const day = { date, timeSlot: "4h" as const };

function shop(id: string): RentalShop {
  return { id, resortId: "test", name: id, equipmentRentalAvailable: true, clothingRentalAvailable: true, lastCheckedAt: "2026-07-16" } as RentalShop;
}

function rule(shopId: string, itemType: RentalPriceRule["itemType"], price: number, extra: Partial<RentalPriceRule> = {}): RentalPriceRule {
  return { id: `${shopId}-${itemType}-${price}`, rentalShopId: shopId, resortId: "test", providerType: "external_shop", season: "26/27", itemType, label: itemType, validFrom: "2026-11-01", validTo: "2027-03-31", dayType: "all", timeSlot: "4h", rideType: "all", representativePrice: price, sourceType: "official_site", confidence: "confirmed", lastCheckedAt: "2026-07-16", verifiedByHuman: true, ...extra } as RentalPriceRule;
}

const context: ComparisonContext = { rideType: "ski", needsEquipment: true, needsClothing: true, officialLift: () => ({ price: 60_000, confidence: "confirmed", reference: false }) };

const official = { shop: shop("test-official-rental"), options: [rule("test-official-rental", "equipment", 40_000), rule("test-official-rental", "clothing", 20_000)] };
const cheap = { shop: shop("cheap"), options: [rule("cheap", "equipment", 25_000), rule("cheap", "clothing", 15_000), rule("cheap", "lift_ticket", 45_000)] };
const bundled = { shop: shop("bundled"), options: [rule("bundled", "equipment", 30_000), rule("bundled", "clothing", 20_000), rule("bundled", "equipment_clothing_package", 42_000)] };
const noClothing = { shop: shop("no-clothing"), options: [rule("no-clothing", "equipment", 20_000)] };

describe("pickShopDay", () => {
  it("uses the shop discount ticket only when it is cheaper than the official ticket", () => {
    expect(pickShopDay(cheap, day, context)).toMatchObject({ lift: 45_000, liftSource: "shop", liftTicketOptionId: cheap.options[2].id });
    expect(pickShopDay(official, day, context)).toMatchObject({ lift: 60_000, liftSource: "official", liftTicketOptionId: null });
    const expensive = { shop: shop("pricey"), options: [rule("pricey", "equipment", 1), rule("pricey", "clothing", 1), rule("pricey", "lift_ticket", 70_000)] };
    expect(pickShopDay(expensive, day, context)).toMatchObject({ lift: 60_000, liftSource: "official" });
  });

  it("takes the package when it beats equipment plus clothing", () => {
    const pick = pickShopDay(bundled, day, context);
    expect(pick).toMatchObject({ rental: 42_000, bundle: 42_000, equipment: 0, clothing: 0, packageOptionId: bundled.options[2].id, equipmentOptionId: null, clothingOptionId: null });
  });

  it("splits the rental price into equipment and clothing", () => {
    expect(pickShopDay(cheap, day, context)).toMatchObject({ equipment: 25_000, clothing: 15_000, bundle: 0 });
  });

  it("skips equipment or clothing the traveler already owns", () => {
    expect(pickShopDay(cheap, day, { ...context, needsClothing: false }).rental).toBe(25_000);
    expect(pickShopDay(cheap, day, { ...context, needsEquipment: false, needsClothing: false }).rental).toBe(0);
  });

  it("reports what is missing instead of guessing a price", () => {
    expect(pickShopDay(noClothing, day, context)).toMatchObject({ rental: null, missing: ["clothing"] });
    expect(pickShopDay({ shop: shop("empty"), options: [] }, day, { ...context, officialLift: () => null }).missing).toEqual(["equipment", "clothing", "lift"]);
  });
});

describe("compareRentalShops", () => {
  const groups = [official, cheap, bundled, noClothing];

  it("totals every ski day and measures savings against the official lift ticket plus official rental", () => {
    const { baseline, results } = compareRentalShops(groups, [day, { date: "2027-01-11", timeSlot: "4h" }], 2, context);
    expect(baseline).toMatchObject({ lift: 120_000, rental: 120_000, perPerson: 240_000, shopId: "test-official-rental" });
    const byId = Object.fromEntries(results.map(result => [result.shopId, result]));
    expect(byId.cheap).toMatchObject({ complete: true, lift: 90_000, equipment: 50_000, clothing: 30_000, perPerson: 2 * (45_000 + 40_000), total: 2 * 2 * 85_000 });
    expect(byId.cheap.savings).toMatchObject({ perPerson: 240_000 - 170_000, total: (240_000 - 170_000) * 2, rate: 29, basis: "all" });
    expect(byId["test-official-rental"].savings).toMatchObject({ perPerson: 0 });
  });

  it("lists complete shops first by savings and leaves incomplete shops without a saving", () => {
    const { results } = compareRentalShops(groups, [day], 1, context);
    expect(results.map(result => result.shopId)).toEqual(["cheap", "bundled", "test-official-rental", "no-clothing"]);
    expect(results.at(-1)).toMatchObject({ complete: false, savings: null, perPerson: null, missing: ["clothing"] });
  });

  it("falls back to a lift-only comparison when the resort has no official rental prices", () => {
    const { baseline, results } = compareRentalShops([cheap], [day], 1, context);
    expect(baseline.rental).toBeNull();
    expect(results[0].savings).toMatchObject({ perPerson: 15_000, basis: "lift_only" });
  });

  it("compares only the lift ticket when the traveler owns all equipment", () => {
    const { results } = compareRentalShops(groups, [day], 1, { ...context, needsEquipment: false, needsClothing: false });
    expect(results.find(result => result.shopId === "cheap")).toMatchObject({ perPerson: 45_000, savings: { perPerson: 15_000, basis: "lift_only" } });
  });
});
