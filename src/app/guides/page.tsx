import type { Metadata } from "next";
import Link from "next/link";
import { resorts } from "@/data/resorts";
import { guideTopicLabels, guideTopicsForResort } from "@/lib/guides";
import { jsonLd, absoluteUrl, ogImagePath } from "@/lib/seo";

const title = "스키장 가격 비교 가이드 - 리프트권·렌탈샵·스키버스 | 설레일";
const description = "스키 여행 전에 국내 스키장별 리프트권 가격, 주변 렌탈샵 비교, 스키버스·셔틀 요금을 출처와 확인 상태와 함께 정리했습니다.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/guides" },
  openGraph: { type: "website", locale: "ko_KR", siteName: "설레일", url: "/guides", title, description, images: [{ url: ogImagePath, width: 1200, height: 630, alt: "설레일 스키장 가이드" }] },
  twitter: { card: "summary_large_image", title, description, images: [ogImagePath] }
};

export default function GuidesPage() {
  const items = resorts
    .map((resort) => ({ resort, topics: guideTopicsForResort(resort) }))
    .filter((item) => item.topics.length > 0);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "설레일", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "스키장 가이드", item: absoluteUrl("/guides") }
    ]
  };
  return (
    <main className="page-shell py-8 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
      <header className="max-w-3xl">
        <h1 className="mt-3 text-3xl font-semibold sm:text-5xl">국내 스키장 가이드</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">{description} 시즌 가격은 정적 참고 데이터이며 예약 전 공식 판매처에서 확인하세요.</p>
      </header>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {items.map(({ resort, topics }) => (
          <li key={resort.id} className="rounded-2xl border bg-card p-5">
            <h2 className="font-semibold"><Link href={`/resorts/${resort.id}`} className="hover:text-primary">{resort.name}</Link></h2>
            <p className="mt-1 text-xs text-muted-foreground">{resort.region}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {topics.map((topic) => (
                <Link key={topic} href={`/guides/${resort.id}/${topic}`} className="inline-flex min-h-9 items-center rounded-lg border px-3 text-sm font-medium transition-colors hover:bg-muted">{guideTopicLabels[topic]}</Link>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
