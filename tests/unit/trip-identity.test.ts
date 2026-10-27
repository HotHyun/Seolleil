import { describe, expect, it } from "vitest";
import { membershipDisplayName } from "@/components/trip/trip-companions";
import { getTripDisplayName } from "@/lib/trip-store";

describe("trip identity", () => {
  it("uses a custom name and safely falls back for legacy trips", () => {
    expect(getTripDisplayName({ tripName: "대학 동기 신년 여행", resortNameSnapshot: "곤지암리조트" })).toBe("대학 동기 신년 여행");
    expect(getTripDisplayName({ tripName: null, resortNameSnapshot: "곤지암리조트" })).toBe("곤지암리조트 트립");
  });

  it("shows a member name without exposing the full email as the fallback", () => {
    expect(membershipDisplayName({ $id: "m1", teamId: "team1", userId: "u1", userName: "동행자", userEmail: "person@example.com", confirm: true, roles: ["viewer"], joined: "" })).toBe("동행자");
    expect(membershipDisplayName({ $id: "m2", teamId: "team2", userId: "u2", userName: "", userEmail: "person@example.com", confirm: true, roles: ["viewer"], joined: "" })).toBe("person");
  });
});
