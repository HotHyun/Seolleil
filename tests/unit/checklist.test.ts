import { describe, expect, it } from "vitest";
import { buildDefaultTasks, externalUrlForTask, isTaskComplete } from "@/lib/checklist";
import { tripInput } from "../fixtures/trip-input";

describe("checklist", () => {
  it("creates all default checklist items and marks irrelevant rental/lodging as not needed", () => {
    const tasks = buildDefaultTasks(
      tripInput({
        ownsEquipment: true,
        ownsClothing: true,
        tripDuration: "same_day",
        transportType: "car"
      })
    );

    expect(tasks.length).toBeGreaterThan(20);
    expect(tasks.find((task) => task.title === "장비 렌탈 예약")?.status).toBe("not_needed");
    expect(tasks.find((task) => task.title === "의류 렌탈 예약")?.status).toBe("not_needed");
    expect(tasks.find((task) => task.title === "숙박 예약")?.status).toBe("not_needed");
    expect(tasks.find((task) => task.title === "자차 경로/주차 확인")?.status).toBe("needs_check");
  });

  it("marks shuttle/bus reservation as planned when transport is not car", () => {
    const tasks = buildDefaultTasks(tripInput({ transportType: "shuttle" }));

    expect(tasks.find((task) => task.title === "셔틀/버스 예약")?.status).toBe("planned");
    expect(tasks.find((task) => task.title === "자차 경로/주차 확인")?.status).toBe("not_needed");
  });

  it("uses category-specific completion rules", () => {
    expect(isTaskComplete("lift_ticket", "reserved")).toBe(true);
    expect(isTaskComplete("gear", "reserved")).toBe(false);
    expect(isTaskComplete("gear", "prepared")).toBe(true);
    expect(isTaskComplete("gear", "not_needed")).toBe(false);
  });

  it("returns contextual external links for default task categories", () => {
    expect(
      externalUrlForTask({
        resortId: "konjiam",
        category: "lift_ticket",
        title: "리프트권 확인"
      })
    ).toContain("konjiam");
    expect(
      externalUrlForTask({
        resortId: "konjiam",
        selectedRentalOptionId: "konjiam-goodgear-package",
        category: "equipment_rental",
        title: "장비 렌탈 예약"
      })
    ).toContain("gonjiam");
  });
});
