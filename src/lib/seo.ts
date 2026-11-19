import { resorts } from "@/data/resorts";
import { legal } from "@/lib/legal";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? legal.siteUrl).replace(/\/$/, "");
export const siteName = legal.serviceName;
export const siteTitle = "설레일 | 국내 스키장 추천·가격 비교·스키 트립 준비";
export const siteDescription =
  "날짜·인원·출발지로 국내 스키장 3곳을 비교하고, 리프트권·렌탈·교통 시즌 가격과 예상 비용, 준비 체크리스트, 동행자 공유까지 한 번에 정리하세요.";
export const ogImagePath = "/og-image.png";

export { privatePathPrefixes } from "@/lib/seo-paths";

export const indexableStaticPaths = ["/", "/resorts", "/privacy", "/terms"] as const;

export function absoluteUrl(path: string) {
  return `${siteUrl}${path === "/" ? "" : path}`;
}

export function getIndexableResortPaths() {
  return resorts.map((resort) => `/resorts/${resort.id}`);
}

// JSON-LD를 <script>에 넣을 때 </script> 조기 종료를 막는다.
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
