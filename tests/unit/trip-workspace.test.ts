import { describe, expect, it } from "vitest";
import { getTripWorkspaceView } from "@/lib/trip-workspace";

describe("trip workspace view", () => {
  it("accepts known views and defaults unknown input to overview", () => {
    expect(getTripWorkspaceView("checklist")).toBe("checklist");
    expect(getTripWorkspaceView("decisions")).toBe("decisions");
    expect(getTripWorkspaceView(["budget"])).toBe("budget");
    expect(getTripWorkspaceView("invalid")).toBe("overview");
    expect(getTripWorkspaceView(undefined)).toBe("overview");
  });
});
