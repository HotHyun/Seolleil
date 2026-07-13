import { describe, expect, it } from "vitest";
import { canEditOwnedTrip, canMutateWithSharePermission } from "@/lib/trip-access";
import { createToken, hashToken } from "@/lib/tokens";

describe("trip access security", () => {
  it("allows a trip id mutation only for its authenticated owner", () => {
    expect(canEditOwnedTrip("user-a", "user-a")).toBe(true);
    expect(canEditOwnedTrip("user-a", "user-b")).toBe(false);
    expect(canEditOwnedTrip(undefined, "user-a")).toBe(false);
    expect(canEditOwnedTrip("user-a", null)).toBe(false);
  });

  it("allows mutations only through edit-capability share links", () => {
    expect(canMutateWithSharePermission("edit")).toBe(true);
    expect(canMutateWithSharePermission("read")).toBe(false);
    expect(canMutateWithSharePermission(null)).toBe(false);
  });

  it("creates distinct edit/share tokens and stores stable hashes", () => {
    const editToken = createToken();
    const shareToken = createToken();
    expect(editToken).toHaveLength(21);
    expect(shareToken).toHaveLength(21);
    expect(editToken).not.toBe(shareToken);
    expect(hashToken(editToken)).toHaveLength(64);
    expect(hashToken(editToken)).toBe(hashToken(editToken));
    expect(hashToken(editToken)).not.toContain(editToken);
  });
});
