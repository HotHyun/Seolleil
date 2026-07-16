import type { RentalPriceRule, RentalShop } from "@/lib/types";

export type RentalComparisonGroup = { shop: RentalShop; options: RentalPriceRule[] };
export type RentalComparisonSort = "distance" | "price" | "verified";

export function lowestRentalPrice(options: RentalPriceRule[]) {
  return Math.min(...options.map((item) => item.representativePrice ?? Number.MAX_SAFE_INTEGER), Number.MAX_SAFE_INTEGER);
}

export function sortRentalComparisonGroups(groups: RentalComparisonGroup[], sort: RentalComparisonSort, selectedShopId?: string | null) {
  return groups.toSorted((a, b) => {
    const savedOrder = Number(b.shop.id === selectedShopId) - Number(a.shop.id === selectedShopId);
    if (savedOrder) return savedOrder;
    if (sort === "distance") return (a.shop.distanceMinutes ?? Number.MAX_SAFE_INTEGER) - (b.shop.distanceMinutes ?? Number.MAX_SAFE_INTEGER);
    if (sort === "price") return lowestRentalPrice(a.options) - lowestRentalPrice(b.options);
    return Number(b.shop.dataStatus === "verified_25_26") - Number(a.shop.dataStatus === "verified_25_26");
  });
}
