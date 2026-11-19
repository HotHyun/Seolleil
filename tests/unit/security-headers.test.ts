// @ts-expect-error -- Next.js 내부 컴파일 모듈이라 타입 선언이 없다.
import { pathToRegexp } from "next/dist/compiled/path-to-regexp";
import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config";

type HeaderRule = { source: string; headers: Array<{ key: string; value: string }> };

async function cspFor(path: string) {
  const rules = (await nextConfig.headers!()) as HeaderRule[];
  const matches = rules.filter((rule) => rule.headers.some((header) => header.key === "Content-Security-Policy") && pathToRegexp(rule.source).test(path));
  return matches.map((rule) => rule.headers.find((header) => header.key === "Content-Security-Policy")!.value);
}

describe("security headers", () => {
  it("applies exactly one CSP to every path and allows eval only on map pages", async () => {
    for (const path of ["/", "/login", "/verify-email", "/reset-password", "/forgot-password", "/privacy", "/terms", "/plan", "/recommendations", "/admin", "/admin/data-quality", "/my-trips", "/invite/accept", "/api/auth/session", "/auth/action"]) {
      const csp = await cspFor(path);
      expect(csp, path).toHaveLength(1);
      expect(csp[0], path).not.toContain("'unsafe-eval'");
    }
    for (const path of ["/resorts", "/resorts/konjiam", "/trips/abc123", "/my-trips/abc123", "/my-trips/abc123/x", "/share/abc123"]) {
      const csp = await cspFor(path);
      expect(csp, path).toHaveLength(1);
      expect(csp[0], path).toContain("'unsafe-eval'");
    }
  });

  it("restricts framing, plugins, base URI and form targets", async () => {
    const [csp] = await cspFor("/login");
    for (const directive of ["frame-ancestors 'none'", "object-src 'none'", "base-uri 'self'", "form-action 'self'", "default-src 'self'"]) expect(csp).toContain(directive);
  });

  it("sets the base security headers and hides the framework header", async () => {
    const rules = (await nextConfig.headers!()) as HeaderRule[];
    const base = rules.find((rule) => rule.source === "/:path*")!.headers.map((header) => header.key);
    for (const key of ["Strict-Transport-Security", "X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy", "Permissions-Policy"]) expect(base).toContain(key);
    expect(nextConfig.poweredByHeader).toBe(false);
  });
});
