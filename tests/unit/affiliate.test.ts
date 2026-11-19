import { describe, expect, it } from "vitest";
import { affiliateLinkOverrides } from "@/data/affiliate-links";
import { hasActiveAffiliate, normalizeOutboundKey, resolveOutboundLink, type AffiliateLinkOverride, type AffiliateProvider } from "@/lib/affiliate";

const providers: AffiliateProvider[] = [
  { id: "yeogi", label: "여기어때", category: "lodging", hostSuffixes: ["yeogi.com"], params: { aid: "abc" } },
  { id: "klook", label: "클룩", category: "lift", hostSuffixes: ["klook.com"], params: {} }
];

describe("affiliate links", () => {
  it("adds params and sponsored rel for configured providers", () => {
    const link = resolveOutboundLink("https://www.yeogi.com/place/1?x=1", providers, []);
    expect(link.affiliate).toBe(true);
    expect(link.href).toBe("https://www.yeogi.com/place/1?x=1&aid=abc");
    expect(link.rel).toContain("sponsored");
    expect(link.provider).toBe("yeogi");
    expect(link.category).toBe("lodging");
  });

  it("leaves links alone when params are empty or host is unknown", () => {
    const klook = resolveOutboundLink("https://www.klook.com/a", providers, []);
    expect(klook).toMatchObject({ href: "https://www.klook.com/a", affiliate: false, provider: "klook" });
    expect(klook.rel).not.toContain("sponsored");
    expect(resolveOutboundLink("https://example.com/", providers, []).affiliate).toBe(false);
  });

  it("does not match lookalike hosts or non-http links", () => {
    expect(resolveOutboundLink("https://notyeogi.com/", providers, []).affiliate).toBe(false);
    expect(resolveOutboundLink("javascript:alert(1)", providers, []).affiliate).toBe(false);
    expect(resolveOutboundLink(undefined, providers, []).href).toBe("");
  });

  it("reports whether any provider is active", () => {
    expect(hasActiveAffiliate(providers, [])).toBe(true);
    expect(hasActiveAffiliate([providers[1]], [])).toBe(false);
  });

  describe("per-product overrides", () => {
    const overrides: AffiliateLinkOverride[] = [
      { provider: "coupang", category: "gear", url: "https://www.coupang.com/vp/products/1", affiliateUrl: "https://link.coupang.com/a/abc" },
      { provider: "bad", category: "other", url: "https://example.com/x", affiliateUrl: "javascript:alert(1)" }
    ];

    it("replaces the link and ignores www, trailing slash, query and hash", () => {
      const link = resolveOutboundLink("https://coupang.com/vp/products/1/?q=1#a", providers, overrides);
      expect(link).toMatchObject({ href: "https://link.coupang.com/a/abc", affiliate: true, provider: "coupang", category: "gear" });
      expect(link.rel).toContain("sponsored");
    });

    it("does not match other products and rejects non-https affiliate urls", () => {
      expect(resolveOutboundLink("https://www.coupang.com/vp/products/2", providers, overrides).affiliate).toBe(false);
      expect(resolveOutboundLink("https://example.com/x", providers, overrides).affiliate).toBe(false);
    });

    it("counts overrides as active affiliate", () => {
      expect(hasActiveAffiliate([providers[1]], overrides)).toBe(true);
    });

    it("normalizes keys and rejects invalid urls", () => {
      expect(normalizeOutboundKey("https://WWW.Example.com/a/")).toBe("example.com/a");
      expect(normalizeOutboundKey("not a url")).toBeNull();
    });
  });

  it("keeps the shipped override data well-formed", () => {
    const keys = new Set<string>();
    for (const item of affiliateLinkOverrides) {
      expect(new URL(item.affiliateUrl).protocol).toBe("https:");
      const key = normalizeOutboundKey(item.url);
      expect(key).not.toBeNull();
      expect(keys.has(key as string)).toBe(false);
      keys.add(key as string);
    }
  });
});
