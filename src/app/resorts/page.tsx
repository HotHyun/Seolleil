import type { Metadata } from "next";
import { AnalyticsTrack } from "@/components/analytics-track";
import { ResortMapExplorer } from "@/components/resort-map-explorer";
import { rentalShops, resorts } from "@/data/resorts";

const title = "국내 스키장 추천·비교 - 지도와 목록 | 설레일";
const description = "수도권·강원·남부권 국내 스키장을 지도에서 비교하고, 스키장별 리프트권·렌탈 가격, 주변 렌탈샵과 숙박 후보를 확인해 스키 여행을 계획하세요.";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/resorts" },
  openGraph: { type: "website", locale: "ko_KR", siteName: "설레일", url: "/resorts", title, description, images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "설레일 국내 스키장 지도" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] }
};

export default function ResortsPage() {
  const sorted = [...resorts].sort((a, b) => {
    if (a.operationStatus === b.operationStatus) return a.name.localeCompare(b.name, "ko");
    if (a.operationStatus === "operating") return -1;
    return 1;
  });

  return (
    <main>
      <AnalyticsTrack eventName="resort_detail_view" eventData={{ page: "directory" }} />
      <ResortMapExplorer resorts={sorted} rentalShops={rentalShops} />
    </main>
  );
}
