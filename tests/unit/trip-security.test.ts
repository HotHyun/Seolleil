import { describe, expect, it } from "vitest";
import { canEditOwnedTrip, canManageTripSharing, canMutateWithSharePermission, createdTripDestination } from "@/lib/trip-access";
import { createToken, hashToken } from "@/lib/tokens";
import { assertShareLinkBelongsToTrip } from "@/lib/trip-store";

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

  it("reserves share-link management for the trip owner", () => {
    expect(canManageTripSharing("owner", "owner")).toBe(true);
    expect(canManageTripSharing("viewer", "owner")).toBe(false);
    expect(canManageTripSharing("editor", "owner")).toBe(false);
    expect(canManageTripSharing(undefined, "owner")).toBe(false);
  });

  it("sends a newly created owned trip to its canonical account route", () => {
    expect(createdTripDestination({ tripId: "trip-a", editToken: "secret", userId: "owner" })).toBe("/my-trips/trip-a?notice=%EB%82%B4%20%ED%8A%B8%EB%A6%BD%EC%97%90%20%EC%A0%80%EC%9E%A5%ED%96%88%EC%96%B4%EC%9A%94.");
    expect(createdTripDestination({ tripId: "trip-a", editToken: "secret", userId: null })).toBe("/trips/secret?notice=%EB%B9%84%EA%B3%B5%EA%B0%9C%20%ED%8A%B8%EB%A6%BD%EC%9D%84%20%EB%A7%8C%EB%93%A4%EC%97%88%EC%96%B4%EC%9A%94.");
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

  it("rejects revoking a link through a different trip", () => {
    expect(() => assertShareLinkBelongsToTrip("trip-a", "trip-b")).toThrow("does not belong");
    expect(() => assertShareLinkBelongsToTrip("trip-a", "trip-a")).not.toThrow();
  });
});
