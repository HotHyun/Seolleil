import { describe, expect, it } from "vitest";
import { isAccountEligibleForProduct } from "@/lib/session";

describe("email verification gate", () => {
  it("grants product access only after Appwrite confirms the email", () => {
    expect(isAccountEligibleForProduct({ emailVerification: true })).toBe(true);
    expect(isAccountEligibleForProduct({ emailVerification: false })).toBe(false);
    expect(isAccountEligibleForProduct({})).toBe(false);
  });
});
