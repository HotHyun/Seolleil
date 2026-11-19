import { describe, expect, it } from "vitest";
import { safeCallbackPath } from "@/lib/safe-redirect";

describe("safeCallbackPath", () => {
  it("allows same-site paths with query and hash", () => {
    expect(safeCallbackPath("/trips/abc?x=1#top")).toBe("/trips/abc?x=1#top");
    expect(safeCallbackPath("/my-trips")).toBe("/my-trips");
  });

  it("falls back for external, protocol-relative, backslash and control-char values", () => {
    for (const value of ["https://evil.com", "//evil.com", "/\\evil.com", "/\\/evil.com", "/a\nb", "javascript:alert(1)", "evil.com", "", null, undefined, `/${"a".repeat(600)}`]) {
      expect(safeCallbackPath(value)).toBe("/my-trips");
    }
  });

  it("uses the provided fallback", () => {
    expect(safeCallbackPath("//evil.com", "/")).toBe("/");
  });
});
