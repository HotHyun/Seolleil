import { describe, expect, it } from "vitest";
import { hasActiveAffiliate, resolveOutboundLink, type AffiliateProvider } from "@/lib/affiliate";

const providers: AffiliateProvider[] = [
  { id: "yeogi", label: "여기어때", category: "lodging", hostSuffixes: ["yeogi.com"], params: { aid: "abc" } },
  { id: "klook", label: "클룩", category: "lift", hostSuffixes: ["klook.com"], params: {} }
];

describe("affiliate links", () => {
  it("adds params and sponsored rel for configured providers", () => {
    const link = resolveOutboundLink("https://www.yeogi.com/place/1?x=1", providers);
    expect(link.affiliate).toBe(true);
    expect(link.href).toBe("https://www.yeogi.com/place/1?x=1&aid=abc");
    expect(link.rel).toContain("sponsored");
    expect(link.provider).toBe("yeogi");
    expect(link.category).toBe("lodging");
  });

  it("leaves links alone when params are empty or host is unknown", () => {
    const klook = resolveOutboundLink("https://www.klook.com/a", providers);
    expect(klook).toMatchObject({ href: "https://www.klook.com/a", affiliate: false, provider: "klook" });
    expect(klook.rel).not.toContain("sponsored");
    expect(resolveOutboundLink("https://example.com/", providers).affiliate).toBe(false);
  });

  it("does not match lookalike hosts or non-http links", () => {
    expect(resolveOutboundLink("https://notyeogi.com/", providers).affiliate).toBe(false);
    expect(resolveOutboundLink("javascript:alert(1)", providers).affiliate).toBe(false);
    expect(resolveOutboundLink(undefined, providers).href).toBe("");
  });

  it("reports whether any provider is active", () => {
    expect(hasActiveAffiliate(providers)).toBe(true);
    expect(hasActiveAffiliate([providers[1]])).toBe(false);
  });
});
