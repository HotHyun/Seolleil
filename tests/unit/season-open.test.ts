import { describe, expect, it } from "vitest";
import { seasonOpenings, type SeasonOpening } from "@/data/season-openings";
import { resorts } from "@/data/resorts";
import { getRecommendations } from "@/lib/recommendation";
import { defaultVisitDate, earliestSelectableDate, formatOpenDate, getNotYetOpenResorts, isBeforeOpening, nextSaturdayOnOrAfter, todayKst } from "@/lib/season-open";
import { estimateTripCost } from "@/lib/pricing";
import type { TripInput } from "@/lib/types";

const openings: SeasonOpening[] = [{ resortId: "yongpyong", openDate: "2026-11-22", status: "official", source: "test", checkedAt: "2026-11-19" }];

const baseInput: TripInput = {
  visitDate: "2026-12-26", departureLocation: "seoul-gangnam", peopleCount: 2, tripDuration: "same_day", skillLevel: "beginner", rideType: "ski",
  ownsEquipment: false, ownsClothing: false, transportType: "car", priorities: ["beginner", "close", "rental"], liftTicketTimeSlot: "4h"
};

describe("season openings", () => {
  it("uses Korea time for today", () => {
    expect(todayKst(new Date("2026-11-19T16:30:00Z"))).toBe("2026-11-20");
  });

  it("limits the selectable date to the later of today and the opening date", () => {
    expect(earliestSelectableDate("yongpyong", "2026-11-19", openings)).toBe("2026-11-22");
    expect(earliestSelectableDate("yongpyong", "2026-12-01", openings)).toBe("2026-12-01");
    expect(earliestSelectableDate("unknown", "2026-11-19", openings)).toBe("2026-11-19");
    expect(earliestSelectableDate(undefined, "2026-11-19", openings)).toBe("2026-11-19");
  });

  it("detects visits before opening only when the opening date is known", () => {
    expect(isBeforeOpening("yongpyong", "2026-11-21", openings)).toBe(true);
    expect(isBeforeOpening("yongpyong", "2026-11-22", openings)).toBe(false);
    expect(isBeforeOpening("konjiam", "2026-11-01", openings)).toBe(false);
    expect(isBeforeOpening("yongpyong", "", openings)).toBe(false);
  });

  it("picks the nearest Saturday on or after a date", () => {
    expect(nextSaturdayOnOrAfter("2026-11-19")).toBe("2026-11-21");
    expect(nextSaturdayOnOrAfter("2026-11-21")).toBe("2026-11-21");
    expect(nextSaturdayOnOrAfter("2026-11-22")).toBe("2026-11-28");
    expect(defaultVisitDate("2026-11-19")).toBe("2026-11-21");
  });

  it("lists resorts that are not open yet and formats the date", () => {
    expect(getNotYetOpenResorts("2026-11-20", openings).map((item) => item.resortId)).toEqual(["yongpyong"]);
    expect(getNotYetOpenResorts("2026-12-26", openings)).toEqual([]);
    expect(getNotYetOpenResorts("", openings)).toEqual([]);
    expect(formatOpenDate("2026-11-22")).toBe("11/22(일)");
  });

  it("keeps shipped opening data valid", () => {
    const ids = new Set<string>();
    for (const item of seasonOpenings) {
      expect(resorts.some((resort) => resort.id === item.resortId)).toBe(true);
      expect(item.openDate).toMatch(/^2026-\d{2}-\d{2}$/);
      expect(ids.has(item.resortId)).toBe(false);
      ids.add(item.resortId);
    }
  });

  it("excludes resorts that have not opened from recommendations", () => {
    const early = getRecommendations({ ...baseInput, visitDate: "2026-11-20" }).map((item) => item.resort.id);
    expect(early).not.toContain("yongpyong");
    expect(early).not.toContain("oakvalley");
    const later = getRecommendations({ ...baseInput, visitDate: "2026-12-26" }).map((item) => item.resort.id);
    expect(later.length).toBeGreaterThan(0);
  });

  it("prices a dated visit far above an empty date (the bug the default date fixes)", () => {
    const resort = resorts.find((item) => item.id === "konjiam")!;
    const withDate = estimateTripCost(resort, baseInput).representative;
    const withoutDate = estimateTripCost(resort, { ...baseInput, visitDate: "" }).representative;
    expect(withDate).toBeGreaterThan(withoutDate * 3);
  });
});

describe("early-season price coverage", () => {
  it("prices November visits from the start of the reference price table", async () => {
    const { previousSeasonDate } = await import("@/lib/season-fallback");
    expect(previousSeasonDate("2026-11-21")).toBe("2025-12-01");
    expect(previousSeasonDate("2026-12-26")).toBe("2025-12-26");
    expect(previousSeasonDate("2027-01-09")).toBe("2026-01-09");
    expect(previousSeasonDate("2027-03-06")).toBe("2026-03-06");
  });

  it("gives November dates a realistic total instead of only transport", () => {
    const resort = resorts.find((item) => item.id === "konjiam")!;
    const november = estimateTripCost(resort, { ...baseInput, visitDate: "2026-11-21" }).representative;
    const december = estimateTripCost(resort, { ...baseInput, visitDate: "2026-12-05" }).representative;
    expect(november).toBeGreaterThan(200000);
    expect(Math.abs(november - december)).toBeLessThan(december * 0.2);
  });
});
