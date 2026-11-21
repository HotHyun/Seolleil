import { describe, expect, it } from "vitest";
import { liftPromotions } from "@/data/lift-promotions";
import { findLiftPromotion, isPromotionOnSale, resortsWithActivePromotion, type LiftPromotion } from "@/lib/lift-promotions";
import { resolveLiftPrice } from "@/lib/pricing";

const konjiamPromotion = liftPromotions.find((item) => item.id === "konjiam-earlybird-26-27")!;

describe("lift promotions", () => {
  it("shows the Konjiam early-bird price with the saving against the regular price", () => {
    // 2026-12-26은 토요일, 2026-12-23은 수요일
    expect(findLiftPromotion("konjiam", "4h", "2026-12-26", "2026-11-20")).toMatchObject({ adultPrice: 62000, regularPrice: 96000, saving: 34000, withRentalPrice: 75000 });
    expect(findLiftPromotion("konjiam", "2h", "2026-12-23", "2026-11-20")).toMatchObject({ adultPrice: 44000, regularPrice: 69000, saving: 25000 });
  });

  it("matches the regular price the platform calculates", () => {
    const regular = resolveLiftPrice("konjiam", "6h", "2026-12-26");
    expect(findLiftPromotion("konjiam", "6h", "2026-12-26", "2026-11-20")?.regularPrice).toBe(regular?.adultPrice);
  });

  it("shows the Yongpyong and Phoenix opening offers with equipment rental priced separately", () => {
    expect(findLiftPromotion("yongpyong", "4h", "2026-11-22", "2026-11-22")).toMatchObject({
      adultPrice: 10000,
      equipmentRentalPrice: 10000,
      equipmentRentalDuration: "8시간"
    });
    expect(findLiftPromotion("yongpyong", "4h", "2026-11-23", "2026-11-22")).toBeUndefined();
    expect(findLiftPromotion("phoenix", "7h", "2026-11-27", "2026-11-27")).toMatchObject({
      adultPrice: 30000,
      equipmentRentalPrice: 15000,
      equipmentRentalDuration: "7시간"
    });
    expect(findLiftPromotion("phoenix", "7h", "2026-11-28", "2026-11-27")).toBeUndefined();
    expect(resortsWithActivePromotion("2026-11-22")).toEqual(["konjiam", "yongpyong", "phoenix"]);
  });

  it("hides the promotion outside the sales window, for other resorts and for unlisted time slots", () => {
    expect(isPromotionOnSale(konjiamPromotion, "2026-11-03")).toBe(false);
    expect(isPromotionOnSale(konjiamPromotion, "2026-11-04")).toBe(true);
    expect(isPromotionOnSale(konjiamPromotion, "2026-12-06")).toBe(true);
    expect(isPromotionOnSale(konjiamPromotion, "2026-12-07")).toBe(false);
    expect(findLiftPromotion("konjiam", "4h", "2026-12-26", "2026-12-07")).toBeUndefined();
    expect(findLiftPromotion("jisan", "4h", "2026-12-26", "2026-11-20")).toBeUndefined();
    expect(findLiftPromotion("konjiam", "night", "2026-12-26", "2026-11-20")).toBeUndefined();
  });

  it("hides the promotion for visit dates outside the usable period", () => {
    expect(findLiftPromotion("konjiam", "4h", "2027-04-01", "2026-11-20")).toBeUndefined();
    expect(findLiftPromotion("konjiam", "4h", "2026-10-31", "2026-11-20")).toBeUndefined();
  });

  it("does not present a price that is not lower than the regular price", () => {
    const notCheaper: LiftPromotion = { ...konjiamPromotion, id: "test", prices: [{ timeSlot: "4h", dayType: "weekend", adultPrice: 96000 }] };
    expect(findLiftPromotion("konjiam", "4h", "2026-12-26", "2026-11-20", [notCheaper])).toBeUndefined();
  });

  it("lists resorts that have a promotion on sale today", () => {
    expect(resortsWithActivePromotion("2026-11-20")).toEqual(["konjiam"]);
    expect(resortsWithActivePromotion("2027-01-01")).toEqual([]);
  });
});
