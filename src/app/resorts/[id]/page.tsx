import { NearbyPlaceHelp } from "@/components/nearby-place-help";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BedDouble, Check, ExternalLink, Eye, MapPinned, Route, Shirt, Ticket } from "lucide-react";
import { AnalyticsLink } from "@/components/analytics-link";
import { AnalyticsTrack } from "@/components/analytics-track";
import { LiftPriceBoard } from "@/components/lift-price-board";
import { StatusBadge } from "@/components/status-badge";
import { ResortShuttleCoverage } from "@/components/shuttle-coverage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { rentalPriceRules } from "@/data/prices";
import { getResortStory } from "@/data/resort-content";
import { getSkiShuttleCoverage, getSkiShuttleRoutes } from "@/data/ski-shuttles";
import { getRentalShopsForResort, getResort, resorts } from "@/data/resorts";
import { guideTopicLabels, guideTopicsForResort } from "@/lib/guides";
import { absoluteUrl, jsonLd, ogImagePath } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils";

type PageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() { return resorts.map((resort) => ({ id: resort.id })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resort = getResort((await params).id);
  if (!resort) return { title: "스키장 상세 | 설레일" };
  const story = getResortStory(resort);
  const title = `${resort.name} 리프트권·렌탈·셔틀 가격 비교와 스키 여행 준비 | 설레일`;
  const description = `${resort.name}(${resort.region}) ${story.summary} 리프트권·렌탈 시즌 가격, 셔틀, 주변 렌탈샵과 숙박 후보를 한곳에서 확인하세요.`;
  const path = `/resorts/${resort.id}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "ko_KR", siteName: "설레일", url: path, title, description, images: [{ url: ogImagePath, width: 1200, height: 630, alt: `${resort.name} - 설레일` }] },
    twitter: { card: "summary_large_image", title, description, images: [ogImagePath] }
  };
}

export default async function ResortDetailPage({ params }: PageProps) {
  const resort = getResort((await params).id);
  if (!resort) notFound();
  const story = getResortStory(resort);
  const shops = getRentalShopsForResort(resort.id);
  const rentalPrices = rentalPriceRules.filter((rule) => rule.resortId === resort.id);
  const shuttleRoutes = getSkiShuttleRoutes(resort.id);
  const shuttleCoverage = getSkiShuttleCoverage(resort, shuttleRoutes);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "SkiResort", "@id": `${absoluteUrl(`/resorts/${resort.id}`)}#resort`, name: resort.name, description: story.summary, url: resort.officialUrl, address: { "@type": "PostalAddress", addressCountry: "KR", streetAddress: resort.address, addressRegion: resort.region }, sameAs: [resort.mapLinks.kakao, resort.mapLinks.naver].filter(Boolean) },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "설레일", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "국내 스키장", item: absoluteUrl("/resorts") },
        { "@type": "ListItem", position: 3, name: resort.name, item: absoluteUrl(`/resorts/${resort.id}`) }
      ] }
    ]
  };

  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
    <AnalyticsTrack eventName="resort_detail_view" eventData={{ resortId: resort.id }} />
    <section className="border-b">
      <div className="page-shell py-8 sm:py-12 lg:py-16">
        <Link href="/resorts" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"><ArrowLeft className="h-4 w-4" /> 스키장 지도로 돌아가기</Link>
        <div className="mt-8 max-w-4xl">
          <div className="flex flex-wrap gap-2"><StatusBadge tone={resort.operationStatus === "operating" ? "good" : "warn"}>{statusLabel(resort.operationStatus)}</StatusBadge>{resort.nightSkiAvailable ? <StatusBadge>야간 운영</StatusBadge> : null}{resort.tags.map((tag) => <StatusBadge key={tag}>{tag}</StatusBadge>)}</div>
          {resort.operationStatus !== "operating" ? <p role="note" className="mt-4 rounded-lg border bg-muted/50 px-4 py-3 text-sm leading-6">{operationNotice(resort.operationStatus)}</p> : null}
          <p className="mt-6 text-sm text-muted-foreground">{resort.region}</p>
          <h1 className="mt-2 text-balance text-3xl font-semibold leading-tight sm:text-5xl">{story.headline}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{story.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href={`/plan?resortId=${resort.id}`}><Button className="h-12 px-5">{resort.name}으로 트립 만들기 <ArrowRight className="h-4 w-4" /></Button></Link><ExternalButton href={resort.slopeStatusUrl} label="오늘 운영하는 코스 확인하기" resortId={resort.id} type="slope_status" className="h-12" /></div>
        </div>
      </div>
    </section>

    <nav aria-label="여행 준비 바로가기" className="sticky top-16 z-20 border-b bg-background/90 backdrop-blur">
      <ul className="page-shell flex gap-1 overflow-x-auto py-1 text-sm font-medium text-muted-foreground">
        {[["lift", "리프트권"], ["rental", "렌탈"], ["lodging", "숙박"], ["shuttle", "셔틀"]].map(([anchor, label]) => <li key={anchor}><a href={`#${anchor}`} className="inline-flex min-h-11 items-center whitespace-nowrap rounded-md px-3 transition-colors hover:text-foreground">{label}</a></li>)}
      </ul>
    </nav>

    <div className="page-shell py-8 sm:py-12">
      <section className="grid gap-3 sm:grid-cols-3">
        {story.bestFor.map((item) => <div key={item} className="rounded-2xl border bg-card p-5"><Check aria-hidden="true" className="h-4 w-4 text-primary" /><p className="mt-3 font-semibold">{item}</p></div>)}
      </section>

      <div className="mt-10 grid min-w-0 gap-6">
        <div className="min-w-0 space-y-6">
          <section className="grid gap-4 sm:grid-cols-2">
            <StoryCard icon={<Route />} title="코스는 이렇게 살펴보세요" description={story.courseNote} action={<ExternalTextLink href={resort.slopeStatusUrl} label="공식 코스·운영 현황" resortId={resort.id} type="course_guide" />} />
            <StoryCard icon={<Eye />} title="이곳에서 만나는 풍경" description={story.sceneryNote} action={<ExternalTextLink href={resort.galleryUrl ?? resort.officialUrl} label="공식 소개 더 보기" resortId={resort.id} type="resort_story" />} />
          </section>

          <Card id="lift" className="scroll-mt-32"><CardHeader><div className="flex items-end justify-between gap-3"><div><CardTitle>리프트권 확인</CardTitle></div><Ticket aria-hidden="true" className="h-5 w-5 text-muted-foreground" /></div></CardHeader><CardContent><LiftPriceBoard resortId={resort.id} variant="compact" guideHref={`/guides/${resort.id}/lift-prices`} /></CardContent></Card>

          <Card id="rental" className="scroll-mt-32"><CardHeader><div className="flex items-end justify-between gap-3"><div><CardTitle>주변 렌탈샵 {shops.length}곳</CardTitle></div><Shirt aria-hidden="true" className="h-5 w-5 text-muted-foreground" /></div></CardHeader><CardContent><p className="mb-4 text-sm leading-6 text-muted-foreground">가격과 픽업 여부를 먼저 훑어보고, 실제 위치 비교는 스키장 지도에서 이어가세요.</p><div className="grid gap-3 sm:grid-cols-2">{shops.slice(0, 6).map((shop) => { const prices = rentalPrices.filter((price) => price.rentalShopId === shop.id); return <div key={shop.id} className="rounded-lg border bg-muted/30 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{shop.name}</p><p className="mt-1 text-xs text-muted-foreground">{shop.id.endsWith("official-rental") ? "공식 렌탈" : "외부 렌탈샵"}{shop.distanceMinutes !== undefined ? ` · 약 ${shop.distanceMinutes}분` : ""}</p></div>{shop.pickupAvailable ? <StatusBadge>픽업</StatusBadge> : null}</div><div className="mt-3 flex flex-wrap gap-2">{shop.recommendationTags?.slice(0, 3).map((tag) => <StatusBadge key={tag}>{tag}</StatusBadge>)}</div>{prices[0] ? <p className="mt-3 text-sm"><span className="text-muted-foreground">확인 가격 </span><strong>{formatCurrency(prices[0].representativePrice)}부터</strong></p> : <p className="mt-3 text-xs text-muted-foreground">가격은 예약 원문에서 확인</p>}</div>; })}</div><NearbyPlaceHelp resortName={resort.name} kind="rental" className="mt-4" /><Link href={`/resorts?resortId=${resort.id}`}><Button variant="secondary" className="mt-5 w-full">지도에서 렌탈·숙박 비교하기 <MapPinned className="h-4 w-4" /></Button></Link></CardContent></Card>
          <Card id="lodging" className="scroll-mt-32"><CardHeader><div className="flex items-end justify-between gap-3"><CardTitle>숙박 찾기</CardTitle><BedDouble aria-hidden="true" className="h-5 w-5 text-muted-foreground" /></div></CardHeader><CardContent><p className="mb-4 text-sm leading-6 text-muted-foreground">숙박 가격과 재고는 실시간으로 보여 드리지 않아요. 공식 숙박과 지도에서 후보를 찾고, 트립에 숙소명·링크·금액을 등록해 동행자와 함께 비교하세요.</p><div className="grid gap-3 sm:grid-cols-2"><ExternalButton href={resort.lodgingUrl} label="공식 숙박 보기" resortId={resort.id} type="lodging" /><Link href={`/resorts?resortId=${resort.id}`}><Button variant="secondary" className="w-full justify-between">지도에서 주변 숙소 찾기 <MapPinned className="h-4 w-4" /></Button></Link></div><NearbyPlaceHelp resortName={resort.name} kind="lodging" className="mt-4" /></CardContent></Card>
          <div id="shuttle" className="scroll-mt-32"><ResortShuttleCoverage resortName={resort.name} routes={shuttleRoutes} coverage={shuttleCoverage} /></div>
          {guideTopicsForResort(resort).length ? <section aria-label={`${resort.name} 가이드`} className="rounded-2xl border bg-card p-5"><h2 className="font-semibold">{resort.name} 가이드 더 보기</h2><div className="mt-3 flex flex-wrap gap-2">{guideTopicsForResort(resort).map((topic) => <Link key={topic} href={`/guides/${resort.id}/${topic}`} className="inline-flex min-h-10 items-center rounded-lg border px-4 text-sm font-medium transition-colors hover:bg-muted">{guideTopicLabels[topic]}</Link>)}</div></section> : null}
        </div>

        <aside className="min-w-0"><Card><CardHeader><CardTitle>{resort.name} 여행, 같이 준비해요</CardTitle></CardHeader><CardContent><p className="mb-5 text-sm leading-6 text-muted-foreground">날짜와 인원만 정하면 리프트·렌탈·교통 예상 총액과 준비 체크리스트가 만들어지고, 동행자에게 링크로 공유할 수 있어요.</p><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><Link href={`/plan?resortId=${resort.id}`} className="block"><Button className="w-full justify-between">트립 만들기 <ArrowRight className="h-4 w-4" /></Button></Link><ExternalButton href={resort.liftTicketUrl} label="공식 리프트권" resortId={resort.id} type="lift_ticket" /><ExternalButton href={resort.rentalUrl} label="공식 렌탈" resortId={resort.id} type="rental" /><ExternalButton href={resort.lodgingUrl} label="공식 숙박" resortId={resort.id} type="lodging" /><ExternalButton href={resort.mapLinks.kakao ?? resort.mapLinks.naver} label="외부 지도에서 보기" resortId={resort.id} type="external_map" /></div></CardContent></Card></aside>
      </div>
    </div>
  </main>;
}

function StoryCard({ icon, title, description, action }: { icon: React.ReactNode; title: string; description: string; action: React.ReactNode }) { return <Card><CardContent className="p-5 sm:p-6"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground [&_svg]:h-5 [&_svg]:w-5">{icon}</span><h2 className="mt-5 text-xl font-semibold">{title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p><div className="mt-5">{action}</div></CardContent></Card>; }
function ExternalTextLink({ href, label, resortId, type }: { href: string; label: string; resortId: string; type: string }) { return <AnalyticsLink href={href} target="_blank" rel="noreferrer" eventName="external_link_click" eventData={{ type, resortId }} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary">{label} <ExternalLink className="h-4 w-4" /></AnalyticsLink>; }
function ExternalButton({ href, label, resortId, type, className }: { href?: string; label: string; resortId: string; type: string; className?: string }) { if (!href) return null; return <AnalyticsLink href={href} target="_blank" rel="noreferrer" eventName="external_link_click" eventData={{ type, resortId }} className="block"><Button variant="secondary" className={`w-full justify-between ${className ?? ""}`}>{label}<ExternalLink className="h-4 w-4" /></Button></AnalyticsLink>; }
function operationNotice(status: string) {
  if (status === "unknown") return "26/27 시즌 운영 공지를 아직 확인하지 못해 추천에서는 제외했어요. 아래 가격은 25/26 참고 데이터이며, 예약 전 공식 사이트에서 운영 여부를 꼭 확인해 주세요.";
  if (status === "season_pending") return "이번 시즌 오픈 전이에요. 오픈 일정과 가격은 공식 사이트에서 확인해 주세요.";
  return "현재 운영하지 않는 스키장이에요. 공식 사이트에서 운영 여부를 확인해 주세요.";
}

function statusLabel(status: string) { return ({ operating: "운영", season_pending: "오픈 예정", temporarily_closed: "임시 휴장", closed: "폐장", unknown: "확인 필요" }[status] ?? status); }
