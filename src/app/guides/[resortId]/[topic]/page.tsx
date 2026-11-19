import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink } from "lucide-react";
import { AnalyticsLink } from "@/components/analytics-link";
import { AnalyticsTrack } from "@/components/analytics-track";
import { AffiliateNotice } from "@/components/affiliate-notice";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { PriceContextBanner } from "@/components/price-context-banner";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { getResort } from "@/data/resorts";
import {
  getGuideParams,
  getLiftGuideRows,
  getRentalGuideRows,
  getShuttleGuideRows,
  guideTopicLabels,
  guideTopicsForResort,
  hasGuideContent,
  isGuideTopic,
  type GuideTopic
} from "@/lib/guides";
import { absoluteUrl, jsonLd, ogImagePath } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils";

type PageProps = { params: Promise<{ resortId: string; topic: string }> };

// 데이터가 있는 조합만 만든다. 내용이 빈 페이지는 색인 품질을 떨어뜨리므로 404로 둔다.
export function generateStaticParams() {
  return getGuideParams();
}
export const dynamicParams = false;

function guideCopy(resortName: string, topic: GuideTopic, count: number) {
  if (topic === "lift-prices") {
    return {
      title: `${resortName} 리프트권 가격 정리 - 시간권·요일별 비교 | 설레일`,
      description: `${resortName} 리프트권 ${count}개 가격을 시즌, 요일, 시간권별로 비교하고 가격 출처와 확인 상태를 함께 확인하세요.`,
      heading: `${resortName} 리프트권 가격`
    };
  }
  if (topic === "rental-shops") {
    return {
      title: `${resortName} 주변 렌탈샵 ${count}곳 비교 - 장비·의류 가격 | 설레일`,
      description: `${resortName} 주변 스키·보드 렌탈샵 ${count}곳의 장비·의류 렌탈 가능 여부, 시작 가격, 픽업과 리프트권 판매 정보를 비교하세요.`,
      heading: `${resortName} 주변 렌탈샵 비교`
    };
  }
  return {
    title: `${resortName} 스키버스·셔틀 노선과 요금 | 설레일`,
    description: `${resortName}으로 가는 스키버스·셔틀 ${count}개 노선의 운영사, 요금, 운행 조건을 한눈에 확인하세요.`,
    heading: `${resortName} 스키버스·셔틀`
  };
}

function topicCount(resortId: string, topic: GuideTopic) {
  if (topic === "lift-prices") return getLiftGuideRows(resortId).length;
  if (topic === "rental-shops") return getRentalGuideRows(resortId).length;
  return getShuttleGuideRows(resortId).length;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { resortId, topic } = await params;
  const resort = getResort(resortId);
  if (!resort || !isGuideTopic(topic) || !hasGuideContent(resortId, topic)) return { title: "가이드 | 설레일" };
  const copy = guideCopy(resort.name, topic, topicCount(resortId, topic));
  const path = `/guides/${resortId}/${topic}`;
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: path },
    openGraph: { type: "article", locale: "ko_KR", siteName: "설레일", url: path, title: copy.title, description: copy.description, images: [{ url: ogImagePath, width: 1200, height: 630, alt: `${copy.heading} - 설레일` }] },
    twitter: { card: "summary_large_image", title: copy.title, description: copy.description, images: [ogImagePath] }
  };
}

type Faq = { question: string; answer: string };

function buildFaq(resortId: string, resortName: string, topic: GuideTopic): Faq[] {
  if (topic === "lift-prices") {
    const rows = getLiftGuideRows(resortId).filter((row) => row.price !== undefined);
    const first = rows[0];
    const dayTypes = [...new Set(rows.map((row) => row.dayTypeLabel))];
    const faq: Faq[] = [];
    if (first) faq.push({ question: `${resortName}에서 가장 저렴한 리프트 시간권은 얼마인가요?`, answer: `${first.seasonLabel} 기준 ${first.label}(${first.dayTypeLabel}·${first.timeSlotLabel})이 ${formatCurrency(first.price)}으로 가장 낮게 등록되어 있습니다. 가격은 판매처 사정에 따라 바뀔 수 있어 예약 전 공식 판매처에서 다시 확인하세요.` });
    if (dayTypes.length) faq.push({ question: `${resortName} 리프트권 가격은 요일마다 다른가요?`, answer: `등록된 가격은 ${dayTypes.join(", ")} 구분으로 나뉩니다. 방문 날짜에 맞는 구분의 가격을 확인하세요.` });
    faq.push({ question: "표시된 가격은 확정 가격인가요?", answer: "'확인됨'은 공식 판매처에서 확인한 가격이고, 그 외는 전년 가격이나 전화 확인 등을 바탕으로 한 참고값입니다. 새 시즌 가격이 게시되면 갱신합니다." });
    return faq;
  }
  if (topic === "rental-shops") {
    const rows = getRentalGuideRows(resortId);
    const priced = rows.filter((row) => row.fromPrice !== undefined);
    const clothing = rows.filter((row) => row.clothing).length;
    const cheapest = priced.reduce<(typeof priced)[number] | undefined>((min, row) => (!min || (row.fromPrice ?? Infinity) < (min.fromPrice ?? Infinity) ? row : min), undefined);
    const faq: Faq[] = [{ question: `${resortName} 주변에 렌탈샵은 몇 곳인가요?`, answer: `설레일에 등록된 렌탈샵은 ${rows.length}곳이며, 이 중 가격이 확인된 곳은 ${priced.length}곳입니다.` }];
    if (cheapest) faq.push({ question: `${resortName} 장비 렌탈 시작 가격은 얼마인가요?`, answer: `가격이 등록된 곳 중 ${cheapest.name}의 ${cheapest.priceLabel ?? "장비 렌탈"}이 ${formatCurrency(cheapest.fromPrice)}부터입니다. 시즌과 요일에 따라 달라질 수 있습니다.` });
    faq.push({ question: "의류 렌탈도 가능한가요?", answer: `의류 렌탈이 가능한 곳은 ${clothing}곳으로 표시되어 있습니다. 각 업체의 재고와 사이즈는 예약 전에 확인하세요.` });
    return faq;
  }
  const rows = getShuttleGuideRows(resortId);
  return [
    { question: `${resortName}으로 가는 스키버스는 몇 개 노선인가요?`, answer: `설레일에는 ${rows.length}개 노선이 등록되어 있습니다. 운영사와 지역에 따라 탑승 장소와 운행 조건이 다릅니다.` },
    { question: "셔틀 요금과 운행 시간은 어디서 확인하나요?", answer: "요금은 노선별로 표시하고 있으며, 운행 일정과 예약 마감은 운영사에 따라 바뀌므로 예약 전 운영사 안내에서 확인하세요." }
  ];
}

export default async function GuidePage({ params }: PageProps) {
  const { resortId, topic } = await params;
  const resort = getResort(resortId);
  if (!resort || !isGuideTopic(topic) || !hasGuideContent(resortId, topic)) notFound();

  const count = topicCount(resortId, topic);
  const copy = guideCopy(resort.name, topic, count);
  const faq = buildFaq(resortId, resort.name, topic);
  const otherTopics = guideTopicsForResort(resort).filter((item) => item !== topic);
  const path = `/guides/${resortId}/${topic}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "설레일", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "스키장 가이드", item: absoluteUrl("/guides") },
          { "@type": "ListItem", position: 3, name: resort.name, item: absoluteUrl(`/resorts/${resortId}`) },
          { "@type": "ListItem", position: 4, name: guideTopicLabels[topic], item: absoluteUrl(path) }
        ]
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } }))
      }
    ]
  };

  return (
    <main className="page-shell py-8 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
      <AnalyticsTrack eventName="guide_view" eventData={{ resortId, topic }} />
      <nav aria-label="경로" className="text-sm font-semibold text-muted-foreground">
        <Link href="/guides" className="hover:text-foreground">스키장 가이드</Link> / <Link href={`/resorts/${resortId}`} className="hover:text-foreground">{resort.name}</Link>
      </nav>
      <header className="mt-4 max-w-3xl">
        <div className="flex flex-wrap gap-2">
          <StatusBadge tone={resort.operationStatus === "operating" ? "good" : "warn"}>{resort.operationStatus === "operating" ? "운영" : "운영 여부 확인 필요"}</StatusBadge>
          <StatusBadge>{resort.region}</StatusBadge>
        </div>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] sm:text-5xl">{copy.heading}</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">{copy.description}</p>
      </header>

      <div className="mt-6 max-w-3xl space-y-4">
        {topic !== "shuttle" ? <PriceContextBanner /> : null}
        <AffiliateNotice />
      </div>

      <section className="mt-8 max-w-4xl" aria-label={guideTopicLabels[topic]}>
        {topic === "lift-prices" ? <LiftList resortId={resortId} /> : null}
        {topic === "rental-shops" ? <RentalList resortId={resortId} /> : null}
        {topic === "shuttle" ? <ShuttleList resortId={resortId} /> : null}
      </section>

      <section className="mt-12 max-w-3xl" aria-labelledby="guide-faq-title">
        <h2 id="guide-faq-title" className="text-xl font-black">자주 묻는 질문</h2>
        <dl className="mt-4 space-y-3">
          {faq.map((item) => (
            <div key={item.question} className="rounded-2xl border bg-card p-4 sm:p-5">
              <dt className="font-black">{item.question}</dt>
              <dd className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12 max-w-3xl rounded-2xl border border-primary/25 bg-card p-5 sm:p-6">
        <h2 className="text-lg font-black">{resort.name} 트립을 만들어 볼까요?</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">날짜와 인원만 정하면 리프트권·렌탈·교통 예상 비용과 준비 체크리스트를 한 번에 만들 수 있어요. 로그인은 필요 없습니다.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <AnalyticsLink href={`/plan?resortId=${resortId}&ref=guide`} eventName="guide_cta_click" eventData={{ resortId, topic }}>
            <Button className="h-12 px-5">{resort.name}으로 트립 만들기 <ArrowRight className="h-4 w-4" /></Button>
          </AnalyticsLink>
          <Link href={`/resorts/${resortId}`}><Button variant="secondary" className="h-12 px-5">스키장 상세 보기</Button></Link>
        </div>
        {otherTopics.length ? (
          <p className="mt-5 text-sm font-semibold text-muted-foreground">
            함께 보면 좋아요: {otherTopics.map((item, index) => (
              <span key={item}>{index ? " · " : ""}<Link href={`/guides/${resortId}/${item}`} className="text-primary underline-offset-4 hover:underline">{guideTopicLabels[item]}</Link></span>
            ))}
          </p>
        ) : null}
      </section>
    </main>
  );
}

function ExternalLinkText({ href, label, resortId, type }: { href: string; label: string; resortId: string; type: string }) {
  return (
    <AnalyticsLink href={href} target="_blank" rel="noreferrer" eventName="external_link_click" eventData={{ type, resortId }} className="inline-flex min-h-9 items-center gap-1 text-xs font-bold text-primary underline-offset-4 hover:underline">
      {label} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
    </AnalyticsLink>
  );
}

function LiftList({ resortId }: { resortId: string }) {
  const rows = getLiftGuideRows(resortId);
  const seasons = [...new Set(rows.map((row) => row.seasonLabel))];
  return (
    <div className="space-y-8">
      {seasons.map((season) => (
        <div key={season}>
          <h2 className="text-lg font-black">{season}</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {rows.filter((row) => row.seasonLabel === season).map((row) => (
              <li key={row.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-black">{row.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{row.dayTypeLabel} · {row.timeSlotLabel}</p>
                  </div>
                  <span className="shrink-0 text-lg font-black tabular-nums">{formatCurrency(row.price)}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <ConfidenceBadge confidence={row.confidence} />
                  <span className="text-[11px] text-muted-foreground">적용 {row.period} · 확인 {row.checkedAt}</span>
                </div>
                {row.sourceUrl ? <div className="mt-2"><ExternalLinkText href={row.sourceUrl} label="가격 출처" resortId={resortId} type="guide_lift_source" /></div> : null}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function RentalList({ resortId }: { resortId: string }) {
  const rows = getRentalGuideRows(resortId);
  return (
    <ul className="grid gap-3">
      {rows.map((row) => (
        <li key={row.id} className="rounded-xl border bg-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-black">{row.name}</h2>
              {row.address ? <p className="mt-1 text-xs text-muted-foreground">{row.address}</p> : null}
            </div>
            <div className="shrink-0 text-right">
              <p className="text-lg font-black tabular-nums">{row.fromPrice !== undefined ? `${formatCurrency(row.fromPrice)}~` : "가격 확인 필요"}</p>
              {row.priceLabel ? <p className="text-[11px] text-muted-foreground">{row.priceLabel}</p> : null}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold">
            {row.equipment ? <span className="rounded-full bg-muted px-2.5 py-1">장비 렌탈</span> : null}
            {row.clothing ? <span className="rounded-full bg-muted px-2.5 py-1">의류 렌탈</span> : null}
            {row.pickup ? <span className="rounded-full bg-muted px-2.5 py-1">픽업</span> : null}
            {row.liftTickets ? <span className="rounded-full bg-muted px-2.5 py-1">리프트권 판매</span> : null}
            {row.confidence ? <ConfidenceBadge confidence={row.confidence} /> : null}
            {row.needsRecheck ? <span className="rounded-full border border-dashed border-amber-500/60 px-2.5 py-1">정보 재확인 필요</span> : null}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4">
            {row.url ? <ExternalLinkText href={row.url} label="업체 페이지" resortId={resortId} type="guide_rental_site" /> : null}
            {row.mapUrl ? <ExternalLinkText href={row.mapUrl} label="지도" resortId={resortId} type="guide_rental_map" /> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

function ShuttleList({ resortId }: { resortId: string }) {
  const rows = getShuttleGuideRows(resortId);
  return (
    <ul className="grid gap-3">
      {rows.map((row) => (
        <li key={row.id} className="rounded-xl border bg-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-black">{row.name}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{row.operator} · {row.region} · {row.season} 시즌</p>
            </div>
            <span className="shrink-0 text-right text-sm font-black">{row.fare}</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{row.note}</p>
          {row.phone ? <p className="mt-1 text-xs text-muted-foreground">문의 {row.phone}</p> : null}
        </li>
      ))}
    </ul>
  );
}
