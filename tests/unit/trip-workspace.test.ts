import { describe, expect, it } from "vitest";
import { getTripDashboardNextAction, getTripWorkspaceView } from "@/lib/trip-workspace";

describe("trip workspace view", () => {
  it("accepts known views and defaults unknown input to overview", () => {
    expect(getTripWorkspaceView("checklist")).toBe("checklist");
    expect(getTripWorkspaceView("rental_lift")).toBe("rental_lift");
    expect(getTripWorkspaceView("lodging")).toBe("lodging");
    expect(getTripWorkspaceView("transport")).toBe("transport");
    expect(getTripWorkspaceView("decisions")).toBe("rental_lift");
    expect(getTripWorkspaceView(["budget"])).toBe("budget");
    expect(getTripWorkspaceView("invalid")).toBe("overview");
    expect(getTripWorkspaceView(undefined)).toBe("overview");
  });

  it("routes the overview CTA to the first unfinished workspace", () => {
    expect(getTripDashboardNextAction({ rentalReady: false, liftReady: false, lodgingReady: false, transportReady: false, checklistReady: false })).toEqual({ view: "rental_lift", label: "렌탈 선택 이어가기" });
    expect(getTripDashboardNextAction({ rentalReady: true, liftReady: true, lodgingReady: false, transportReady: false, checklistReady: false })).toEqual({ view: "lodging", label: "숙소 정하기" });
    expect(getTripDashboardNextAction({ rentalReady: true, liftReady: true, lodgingReady: true, transportReady: true, checklistReady: true })).toEqual({ view: "budget", label: "비용 정리하기" });
  });
});
