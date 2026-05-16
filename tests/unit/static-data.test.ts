import { describe, expect, it } from "vitest";
import { validateStaticData } from "@/lib/data-validation";

describe("static data validation", () => {
  it("keeps resort, price, rental, and departure data internally consistent", () => {
    expect(validateStaticData()).toEqual([]);
  });
});
