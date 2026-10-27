import { describe, expect, it } from "vitest";
import { isAccountEligibleForProduct } from "@/lib/session";

describe("email verification gate", () => {
  it("grants product access only after Firebase confirms the email", () => {
    expect(isAccountEligibleForProduct({ email_verified: true })).toBe(true);
    expect(isAccountEligibleForProduct({ email_verified: false })).toBe(false);
    expect(isAccountEligibleForProduct({})).toBe(false);
  });
});
