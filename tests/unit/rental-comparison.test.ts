import { describe, expect, it } from "vitest";
import { sortRentalComparisonGroups } from "@/lib/rental-comparison";
import type { RentalPriceRule, RentalShop } from "@/lib/types";

function group(id: string, distance: number, price: number | undefined, verified = false) {
  return {
    shop: { id, resortId: "test", name: id, equipmentRentalAvailable: true, clothingRentalAvailable: false, distanceMinutes: distance, dataStatus: verified ? "verified_25_26" : "listed_25_26", lastCheckedAt: "2026-07-16" } as RentalShop,
    options: price === undefined ? [] : [{ id: `${id}-price`, resortId: "test", providerType: "external_shop", season: "25/26", itemType: "equipment", label: id, validFrom: "2025-12-01", validTo: "2026-03-31", dayType: "all", representativePrice: price, sourceType: "official_site", confidence: "confirmed", lastCheckedAt: "2026-07-16", verifiedByHuman: true } as RentalPriceRule]
  };
}

describe("rental comparison sorting", () => {
  const groups = [group("far", 8, 10_000, true), group("near", 2, 20_000), group("saved", 5, undefined)];

  it("always keeps the saved shop first", () => {
    expect(sortRentalComparisonGroups(groups, "distance", "saved").map(item => item.shop.id)).toEqual(["saved", "near", "far"]);
  });

  it("supports price and verification ordering", () => {
    expect(sortRentalComparisonGroups(groups, "price").map(item => item.shop.id)).toEqual(["far", "near", "saved"]);
    expect(sortRentalComparisonGroups(groups, "verified")[0].shop.id).toBe("far");
  });
});
