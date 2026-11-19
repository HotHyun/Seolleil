import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { jsonLd, privatePathPrefixes } from "@/lib/seo";
import { resorts } from "@/data/resorts";
import { getGuidePaths } from "@/lib/guides";

describe("seo", () => {
  it("sitemap lists only public pages and every resort", () => {
    const urls = sitemap().map((entry) => new URL(entry.url).pathname);
    expect(urls).toEqual(expect.arrayContaining(["/", "/resorts", "/privacy", "/terms", ...resorts.map((resort) => `/resorts/${resort.id}`)]));
    for (const url of urls) expect(privatePathPrefixes.some((prefix) => url === prefix || url.startsWith(`${prefix}/`))).toBe(false);
  });

  it("sitemap lists the guide hub and every guide that has data", () => {
    const urls = sitemap().map((entry) => new URL(entry.url).pathname);
    expect(urls).toContain("/guides");
    expect(getGuidePaths().length).toBeGreaterThan(0);
    expect(urls).toEqual(expect.arrayContaining(getGuidePaths()));
  });

  it("robots allows the site, blocks private paths and points to the sitemap", () => {
    const result = robots();
    const rule = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    expect(rule.allow).toBe("/");
    expect(rule.disallow).toEqual(expect.arrayContaining(["/trips", "/share", "/invite", "/admin", "/api"]));
    expect(result.sitemap).toBe("https://seolleil.com/sitemap.xml");
  });

  it("jsonLd escapes script terminators", () => {
    expect(jsonLd({ a: "</script><b>" })).not.toContain("<");
  });
});
