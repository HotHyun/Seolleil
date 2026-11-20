import { describe, expect, it } from "vitest";
import { liftSlotOptions } from "@/lib/lift-slots";

describe("lift slot options", () => {
  it("offers only the slots the resort sells on that date", () => {
    expect(liftSlotOptions("konjiam", "2026-12-26").map(option => option.value)).toEqual(["2h", "4h", "6h"]);
    expect(liftSlotOptions("yongpyong", "2026-12-20").map(option => option.label)).toEqual(["4시간권", "6시간권", "종일권"]);
  });

  it("keeps an already saved slot visible and marks it as not sold", () => {
    const options = liftSlotOptions("konjiam", "2026-12-26", "3h");
    expect(options.map(option => option.value)).toEqual(["2h", "4h", "6h", "3h"]);
    expect(options.at(-1)?.label).toBe("3시간권 (미판매)");
  });

  it("falls back to every slot when the resort or date has no price data", () => {
    expect(liftSlotOptions(undefined, "2026-12-26").length).toBeGreaterThan(5);
    expect(liftSlotOptions("konjiam", "2030-01-01").map(option => option.value)).toContain("night");
  });
});
