import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink, MapPinned } from "lucide-react";
import { AnalyticsLink } from "@/components/analytics-link";
import { AnalyticsTrack } from "@/components/analytics-track";
import { PriceContextBanner } from "@/components/price-context-banner";
import { StatusBadge } from "@/components/status-badge";
import { ResortNearbyPanel } from "@/components/resort-nearby-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { priceRules, rentalPriceRules } from "@/data/prices";
import { getRentalShopsForResort, getResort, resorts } from "@/data/resorts";
import type { PriceConfidence } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return resorts.map((resort) => ({ id: resort.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const resort = getResort(id);
  return {
    title: resort ? `${resort.name} | Korean Ski` : "스키장 상세 | Korean Ski"
  };
}

const confidenceLabels: Record<PriceConfidence, string> = {
  confirmed: "확인됨",
  estimated: "추정",
  phone_confirmed: "전화확인",
  unavailable: "확인필요"
};

export default async function ResortDetailPage({ params }: PageProps) {
  const { id } = await params;
  const resort = getResort(id);
  if (!resort) notFound();

  const liftPrices = priceRules.filter((rule) => rule.resortId === resort.id && rule.itemType === "lift_ticket");
  const shops = getRentalShopsForResort(resort.id);
  const rentalPrices = rentalPriceRules.filter((rule) => rule.resortId === resort.id);

  return (
    <main className="page-shell py-8">
      <AnalyticsTrack eventName="resort_detail_view" eventData={{ resortId: resort.id }} />
      <div className="mb-8">
        <div className="mb-3 flex flex-wrap gap-2">
          <StatusBadge tone={resort.operationStatus === "operating" ? "good" : "warn"}>{statusLabel(resort.operationStatus)}</StatusBadge>
          {resort.nightSkiAvailable ? <StatusBadge>야간</StatusBadge> : null}
          {resort.tags.map((tag) => (
            <StatusBadge key={tag}>{tag}</StatusBadge>
          ))}
        </div>
        <h1 className="text-3xl font-black md:text-5xl">{resort.name}</h1>
        <p className="mt-2 text-muted-foreground">{resort.region} · {resort.address}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <section className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>지도와 주변 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <ResortNearbyPanel resort={resort} rentalShops={shops} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>리프트권 가격 출처</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <PriceContextBanner compact />
              <div className="grid gap-2 md:grid-cols-2">
              {liftPrices.map((price) => (
                <div key={price.id} className="rounded-md border bg-white/7 p-3 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold">{price.label}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {price.dayType} · <StatusBadge tone={price.confidence === "confirmed" ? "good" : price.confidence === "unavailable" ? "warn" : "neutral"}>{confidenceLabels[price.confidence]}</StatusBadge>
                      </div>
                    </div>
                    <div className="shrink-0 font-black">{formatCurrency(price.adultPrice ?? price.priceMin)}</div>
                  </div>
                  {price.sourceUrl ? (
                    <AnalyticsLink
                      href={price.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      eventName="external_link_click"
                      eventData={{ type: "resort_lift_price", resortId: resort.id }}
                      className="mt-2 inline-flex text-xs font-semibold text-primary"
                    >
                      출처 보기 <ExternalLink className="ml-1 h-3 w-3" />
                    </AnalyticsLink>
                  ) : null}
                </div>
              ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>렌탈 후보</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {shops.map((shop) => {
                const prices = rentalPrices.filter((price) => price.rentalShopId === shop.id);
                return (
                  <div key={shop.id} className="rounded-lg border bg-white/7 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-black">{shop.name}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {shop.id.endsWith("official-rental") ? "공식 렌탈" : "외부 렌탈샵"}
                          {shop.distanceMinutes !== undefined ? ` · 약 ${shop.distanceMinutes}분` : ""}
                        </div>
                      </div>
                      {shop.pickupAvailable ? <StatusBadge>픽업</StatusBadge> : null}
                    </div>
                    <div className="mt-3 space-y-1 text-sm">
                      {prices.slice(0, 4).map((price) => (
                        <div key={price.id} className="flex justify-between gap-2">
                          <span className="text-muted-foreground">{price.label}</span>
                          <span className="font-semibold">{formatCurrency(price.representativePrice)}</span>
                        </div>
                      ))}
                    </div>
                    {shop.url ? (
                      <AnalyticsLink
                        href={shop.url}
                        target="_blank"
                        rel="noreferrer"
                        eventName="external_link_click"
                        eventData={{ type: "resort_rental_shop", resortId: resort.id }}
                        className="mt-3 inline-flex text-xs font-semibold text-primary"
                      >
                        렌탈샵 확인 <ExternalLink className="ml-1 h-3 w-3" />
                      </AnalyticsLink>
                    ) : null}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>공식 링크</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Link href={`/plan?resortId=${resort.id}`}>
                <Button className="w-full justify-between">
                  이 스키장으로 트립 만들기 <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <ExternalButton href={resort.officialUrl} label="공식 사이트" type="official" resortId={resort.id} />
              <ExternalButton href={resort.slopeStatusUrl} label="운영현황/슬로프" type="slope_status" resortId={resort.id} />
              <ExternalButton href={resort.liftTicketUrl} label="리프트권" type="lift_ticket" resortId={resort.id} />
              <ExternalButton href={resort.rentalUrl} label="공식 렌탈" type="rental" resortId={resort.id} />
              <ExternalButton href={resort.mapLinks.naver} label="네이버 지도" type="naver_map" resortId={resort.id} icon={<MapPinned className="h-4 w-4" />} />
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}

function ExternalButton({
  href,
  label,
  type,
  resortId,
  icon
}: {
  href?: string;
  label: string;
  type: string;
  resortId: string;
  icon?: React.ReactNode;
}) {
  if (!href) return null;
  return (
    <AnalyticsLink
      href={href}
      target="_blank"
      rel="noreferrer"
      eventName="external_link_click"
      eventData={{ type, resortId }}
    >
      <Button variant="secondary" className="w-full justify-between">
        <span className="inline-flex items-center gap-2">
          {icon}
          {label}
        </span>
        <ExternalLink className="h-4 w-4" />
      </Button>
    </AnalyticsLink>
  );
}

function statusLabel(status: string) {
  return (
    {
      operating: "운영",
      season_pending: "오픈 예정",
      temporarily_closed: "임시 휴장",
      closed: "폐장",
      unknown: "확인 필요"
    }[status] ?? status
  );
}
