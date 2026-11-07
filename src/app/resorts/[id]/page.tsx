import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, Eye, MapPinned, Route, Shirt, Sparkles, Ticket } from "lucide-react";
import { AnalyticsLink } from "@/components/analytics-link";
import { AnalyticsTrack } from "@/components/analytics-track";
import { PriceContextBanner } from "@/components/price-context-banner";
import { StatusBadge } from "@/components/status-badge";
import { ResortShuttleCoverage } from "@/components/shuttle-coverage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { priceRules, rentalPriceRules } from "@/data/prices";
import { getResortStory } from "@/data/resort-content";
import { getSkiShuttleCoverage, getSkiShuttleRoutes } from "@/data/ski-shuttles";
import { getRentalShopsForResort, getResort, resorts } from "@/data/resorts";
import { formatCurrency } from "@/lib/utils";

type PageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() { return resorts.map((resort) => ({ id: resort.id })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resort = getResort((await params).id);
  return { title: resort ? `${resort.name} | 설레일` : "스키장 상세 | 설레일" };
}

export default async function ResortDetailPage({ params }: PageProps) {
  const resort = getResort((await params).id);
  if (!resort) notFound();
  const story = getResortStory(resort);
  const shops = getRentalShopsForResort(resort.id);
  const liftPrices = priceRules.filter((rule) => rule.resortId === resort.id && rule.itemType === "lift_ticket");
  const rentalPrices = rentalPriceRules.filter((rule) => rule.resortId === resort.id);
  const shuttleRoutes = getSkiShuttleRoutes(resort.id);
  const shuttleCoverage = getSkiShuttleCoverage(resort, shuttleRoutes);

  return <main>
    <AnalyticsTrack eventName="resort_detail_view" eventData={{ resortId: resort.id }} />
    <section className="relative overflow-hidden border-b bg-[radial-gradient(circle_at_82%_18%,hsl(var(--primary)/0.24),transparent_28rem),linear-gradient(145deg,hsl(var(--background)),hsl(var(--muted)))]">
      <div className="page-shell relative py-8 sm:py-14 lg:py-20">
        <Link href="/resorts" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-muted-foreground transition hover:text-foreground"><ArrowLeft className="h-4 w-4" /> 스키장 지도로 돌아가기</Link>
        <div className="mt-8 max-w-4xl">
          <div className="flex flex-wrap gap-2"><StatusBadge tone={resort.operationStatus === "operating" ? "good" : "warn"}>{statusLabel(resort.operationStatus)}</StatusBadge>{resort.nightSkiAvailable ? <StatusBadge>야간 운영</StatusBadge> : null}{resort.tags.map((tag) => <StatusBadge key={tag}>{tag}</StatusBadge>)}</div>
          <p className="mt-6 text-sm font-black tracking-[0.16em] text-primary">{resort.region} · SKI GUIDE</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-6xl">{story.headline}</h1>
          <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-muted-foreground sm:text-lg">{story.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href={`/plan?resortId=${resort.id}`}><Button className="min-h-12 px-5">{resort.name}으로 트립 만들기 <ArrowRight className="h-4 w-4" /></Button></Link><ExternalButton href={resort.slopeStatusUrl} label="오늘의 코스 확인" resortId={resort.id} type="slope_status" /></div>
        </div>
      </div>
    </section>

    <div className="page-shell py-8 sm:py-12">
      <section className="grid gap-3 sm:grid-cols-3">
        {story.bestFor.map((item) => <div key={item} className="rounded-2xl border bg-card p-5"><Sparkles className="h-5 w-5 text-primary" /><p className="mt-3 font-black">{item}</p></div>)}
      </section>

      <div className="mt-10 grid min-w-0 gap-6">
        <div className="min-w-0 space-y-6">
          <section className="grid gap-4 sm:grid-cols-2">
            <StoryCard icon={<Route />} title="코스는 이렇게 살펴보세요" description={story.courseNote} action={<ExternalTextLink href={resort.slopeStatusUrl} label="공식 코스·운영 현황" resortId={resort.id} type="course_guide" />} />
            <StoryCard icon={<Eye />} title="이곳에서 만나는 풍경" description={story.sceneryNote} action={<ExternalTextLink href={resort.officialUrl} label="공식 소개 더 보기" resortId={resort.id} type="resort_story" />} />
          </section>

          <Card><CardHeader><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-black tracking-[0.14em] text-primary">PRICE CHECK</p><CardTitle className="mt-2">리프트권 확인</CardTitle></div><Ticket className="h-6 w-6 text-primary" /></div></CardHeader><CardContent className="space-y-4"><PriceContextBanner compact /><div className="grid gap-2 sm:grid-cols-2">{liftPrices.slice(0, 6).map((price) => <div key={price.id} className="flex items-center justify-between gap-3 rounded-xl border bg-muted/40 p-3"><div><p className="text-sm font-bold">{price.label}</p><p className="mt-1 text-xs text-muted-foreground">{price.confidence === "confirmed" ? "가격 확인됨" : "방문 전 재확인"}</p></div><span className="shrink-0 font-black">{formatCurrency(price.adultPrice ?? price.priceMin)}</span></div>)}</div></CardContent></Card>

          <Card><CardHeader><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-black tracking-[0.14em] text-primary">NEARBY RENTAL</p><CardTitle className="mt-2">주변 렌탈샵 {shops.length}곳</CardTitle></div><Shirt className="h-6 w-6 text-primary" /></div></CardHeader><CardContent><p className="mb-4 text-sm leading-6 text-muted-foreground">가격과 픽업 여부를 먼저 훑어보고, 실제 위치 비교는 스키장 지도에서 이어가세요.</p><div className="grid gap-3 sm:grid-cols-2">{shops.slice(0, 6).map((shop) => { const prices = rentalPrices.filter((price) => price.rentalShopId === shop.id); return <div key={shop.id} className="rounded-xl border bg-muted/30 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-black">{shop.name}</p><p className="mt-1 text-xs text-muted-foreground">{shop.id.endsWith("official-rental") ? "공식 렌탈" : "외부 렌탈샵"}{shop.distanceMinutes !== undefined ? ` · 약 ${shop.distanceMinutes}분` : ""}</p></div>{shop.pickupAvailable ? <StatusBadge>픽업</StatusBadge> : null}</div><div className="mt-3 flex flex-wrap gap-1.5">{shop.recommendationTags?.slice(0, 3).map((tag) => <StatusBadge key={tag}>{tag}</StatusBadge>)}</div>{prices[0] ? <p className="mt-3 text-sm"><span className="text-muted-foreground">확인 가격 </span><strong>{formatCurrency(prices[0].representativePrice)}부터</strong></p> : <p className="mt-3 text-xs text-muted-foreground">가격은 예약 원문에서 확인</p>}</div>; })}</div><Link href={`/resorts?resortId=${resort.id}`}><Button variant="secondary" className="mt-5 w-full">지도에서 렌탈·숙박 비교하기 <MapPinned className="h-4 w-4" /></Button></Link></CardContent></Card>
          <ResortShuttleCoverage resortName={resort.name} routes={shuttleRoutes} coverage={shuttleCoverage} />
        </div>

        <aside className="min-w-0"><Card className="border-primary/25"><CardHeader><CardTitle>이 여행을 구체화할까요?</CardTitle></CardHeader><CardContent><p className="mb-5 text-sm leading-6 text-muted-foreground">날짜와 인원만 정하면 예상 비용과 준비 체크리스트가 만들어져요.</p><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><Link href={`/plan?resortId=${resort.id}`} className="block"><Button className="w-full justify-between">트립 만들기 <ArrowRight className="h-4 w-4" /></Button></Link><ExternalButton href={resort.liftTicketUrl} label="공식 리프트권" resortId={resort.id} type="lift_ticket" /><ExternalButton href={resort.rentalUrl} label="공식 렌탈" resortId={resort.id} type="rental" /><ExternalButton href={resort.lodgingUrl} label="공식 숙박" resortId={resort.id} type="lodging" /><ExternalButton href={resort.mapLinks.kakao ?? resort.mapLinks.naver} label="외부 지도에서 보기" resortId={resort.id} type="external_map" /></div></CardContent></Card></aside>
      </div>
    </div>
  </main>;
}

function StoryCard({ icon, title, description, action }: { icon: React.ReactNode; title: string; description: string; action: React.ReactNode }) { return <Card><CardContent className="p-5 sm:p-6"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 text-primary [&_svg]:h-5 [&_svg]:w-5">{icon}</span><h2 className="mt-5 text-xl font-black">{title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p><div className="mt-5">{action}</div></CardContent></Card>; }
function ExternalTextLink({ href, label, resortId, type }: { href: string; label: string; resortId: string; type: string }) { return <AnalyticsLink href={href} target="_blank" rel="noreferrer" eventName="external_link_click" eventData={{ type, resortId }} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-primary">{label} <ExternalLink className="h-3.5 w-3.5" /></AnalyticsLink>; }
function ExternalButton({ href, label, resortId, type }: { href?: string; label: string; resortId: string; type: string }) { if (!href) return null; return <AnalyticsLink href={href} target="_blank" rel="noreferrer" eventName="external_link_click" eventData={{ type, resortId }} className="block"><Button variant="secondary" className="w-full justify-between">{label}<ExternalLink className="h-4 w-4" /></Button></AnalyticsLink>; }
function statusLabel(status: string) { return ({ operating: "운영", season_pending: "오픈 예정", temporarily_closed: "임시 휴장", closed: "폐장", unknown: "확인 필요" }[status] ?? status); }
