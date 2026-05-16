import { describe, expect, it } from "vitest";
import { buildDefaultTasks, dueDateFromVisit, isTaskComplete } from "@/lib/checklist";
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

  it("calculates due dates from visit date offsets", () => {
    expect(dueDateFromVisit("2027-01-10", -3)?.toISOString().slice(0, 10)).toBe("2027-01-07");
  });

  it("uses category-specific completion rules", () => {
    expect(isTaskComplete("lift_ticket", "reserved")).toBe(true);
    expect(isTaskComplete("gear", "reserved")).toBe(false);
    expect(isTaskComplete("gear", "prepared")).toBe(true);
    expect(isTaskComplete("gear", "not_needed")).toBe(false);
  });
});

