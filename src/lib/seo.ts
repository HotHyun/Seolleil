import { resorts } from "@/data/resorts";
import { legal } from "@/lib/legal";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? legal.siteUrl).replace(/\/$/, "");
export const siteName = legal.serviceName;
export const siteTitle = "설레일 | 국내 스키장 추천·리프트권 가격 비교·스키 여행 계획";
export const siteDescription =
  "스키장 추천부터 리프트권·렌탈·셔틀 가격 비교까지. 날짜·인원·출발지로 당일치기·1박2일 스키 여행 예상 비용을 계산하고, 예약 전 체크리스트와 동행자 공유로 한 번에 준비하세요.";
export const ogImagePath = "/og-image.png";

export { privatePathPrefixes } from "@/lib/seo-paths";

export const indexableStaticPaths = ["/", "/resorts", "/guides", "/privacy", "/terms"] as const;

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
