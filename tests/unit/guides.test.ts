import { describe, expect, it } from "vitest";
import { resorts } from "@/data/resorts";
import {
  getGuideParams,
  getLiftGuideRows,
  getRentalGuideRows,
  getShuttleGuideRows,
  guideTopics,
  hasGuideContent,
  isGuideTopic,
  seasonLabel,
  shuttleFareLabel
} from "@/lib/guides";

describe("guides", () => {
  it("generates a page only for resort/topic pairs that have data", () => {
    const params = getGuideParams();
    expect(params.length).toBeGreaterThan(0);
    for (const { resortId, topic } of params) {
      expect(resorts.some((resort) => resort.id === resortId)).toBe(true);
      expect(hasGuideContent(resortId, topic)).toBe(true);
    }
    const all = resorts.length * guideTopics.length;
    const empty = resorts.flatMap((resort) => guideTopics.filter((topic) => !hasGuideContent(resort.id, topic)));
    expect(params.length + empty.length).toBe(all);
  });

  it("lists the upcoming season before the reference season and keeps price sources", () => {
    for (const resort of resorts) {
      const rows = getLiftGuideRows(resort.id);
      const firstCurrent = rows.findIndex((row) => row.season === "2025-2026");
      const lastUpcoming = rows.map((row) => row.season).lastIndexOf("2026-2027");
      if (firstCurrent >= 0 && lastUpcoming >= 0) expect(lastUpcoming).toBeLessThan(firstCurrent);
      for (const row of rows) expect(row.checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("puts priced rental shops first and never invents a price", () => {
    for (const resort of resorts) {
      const rows = getRentalGuideRows(resort.id);
      const firstUnpriced = rows.findIndex((row) => row.fromPrice === undefined);
      if (firstUnpriced >= 0) expect(rows.slice(firstUnpriced).every((row) => row.fromPrice === undefined)).toBe(true);
      for (const row of rows) if (row.fromPrice !== undefined) expect(row.confidence).toBeDefined();
    }
  });

  it("describes shuttle fares and falls back when missing", () => {
    for (const resort of resorts) for (const row of getShuttleGuideRows(resort.id)) expect(row.fare.length).toBeGreaterThan(0);
    expect(shuttleFareLabel({ fare: undefined } as never)).toBe("요금 확인 필요");
  });

  it("formats season labels and validates topics", () => {
    expect(seasonLabel("2026-2027")).toBe("26/27 시즌");
    expect(isGuideTopic("lift-prices")).toBe(true);
    expect(isGuideTopic("unknown")).toBe(false);
  });
});
