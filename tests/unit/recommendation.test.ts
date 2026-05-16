import { describe, expect, it } from "vitest";
import { getCategoryRecommendations, getRecommendations } from "@/lib/recommendation";
import { tripInput } from "../fixtures/trip-input";

describe("recommendation", () => {
  it("returns operating resorts with explanations and cost", () => {
    const recommendations = getRecommendations(tripInput());

    expect(recommendations.length).toBeGreaterThan(3);
    expect(recommendations.every((item) => item.resort.operationStatus === "operating")).toBe(true);
    expect(recommendations[0].reasons.length).toBeGreaterThanOrEqual(2);
    expect(recommendations[0].cost.representative).toBeGreaterThan(0);
  });

  it("filters out resorts without night ski when night is a priority", () => {
    const recommendations = getRecommendations(tripInput({ priorities: ["night", "close", "cheap"] }));

    expect(recommendations.every((item) => item.resort.nightSkiAvailable)).toBe(true);
  });

  it("produces category recommendations", () => {
    const categories = getCategoryRecommendations(tripInput());

    expect(categories.map((category) => category.label)).toEqual(
      expect.arrayContaining(["가까운 곳 TOP 3", "저렴한 곳 TOP 3", "초보 친화 TOP 3", "렌탈 편한 TOP 3"])
    );
    expect(categories.every((category) => category.recommendations.length <= 3)).toBe(true);
    expect(categories.every((category) => category.recommendations.length > 0)).toBe(true);
  });
});
