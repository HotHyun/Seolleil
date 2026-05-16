import { describe, expect, it } from "vitest";
import { resorts } from "@/data/resorts";
import { buildDefaultTasks } from "@/lib/checklist";
import { estimateTripCost } from "@/lib/pricing";
import { getRecommendations } from "@/lib/recommendation";
import { tripInput } from "../fixtures/trip-input";

describe("trip planning feature flow", () => {
  it("connects recommendation, selected resort pricing, and checklist generation", () => {
    const input = tripInput({
      priorities: ["beginner", "close", "rental"],
      ownsEquipment: false,
      ownsClothing: false
    });
    const [recommendation] = getRecommendations(input);

    expect(recommendation).toBeDefined();
    expect(recommendation.requiredTasks).toEqual(
      expect.arrayContaining(["리프트권 확인", "장비 렌탈 예약", "의류 렌탈 예약"])
    );

    const cost = estimateTripCost(recommendation.resort, input);
    const tasks = buildDefaultTasks(input);

    expect(cost.items.some((item) => item.key === "rental")).toBe(true);
    expect(tasks.find((task) => task.title === "장비 렌탈 예약")?.status).toBe("planned");
    expect(tasks.find((task) => task.title === "의류 렌탈 예약")?.status).toBe("planned");
  });

  it("uses the 13-resort MVP dataset and recommends only operating resorts", () => {
    expect(resorts).toHaveLength(13);
    expect(resorts.some((resort) => resort.id === "bearstown")).toBe(false);

    const recommendations = getRecommendations(tripInput());

    expect(recommendations.every((item) => item.resort.operationStatus === "operating")).toBe(true);
  });
});
