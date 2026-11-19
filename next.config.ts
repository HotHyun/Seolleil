import type { NextConfig } from "next";
import { baseSecurityHeaders, buildContentSecurityPolicy, mapPageSources, strictPageSource } from "./src/lib/security-headers";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  poweredByHeader: false,
  async redirects() {
    return ["ski.hothyun.com", "www.seolleil.com"].map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: "https://seolleil.com/:path*",
      permanent: true
    }));
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet, noimageindex"
          },
          ...baseSecurityHeaders
        ]
      },
      { source: strictPageSource, headers: [{ key: "Content-Security-Policy", value: buildContentSecurityPolicy({ allowEval: false }) }] },
      ...mapPageSources.map((source) => ({ source, headers: [{ key: "Content-Security-Policy", value: buildContentSecurityPolicy({ allowEval: true }) }] }))
    ];
  }
};

export default nextConfig;
