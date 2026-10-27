import { CheckCircle2, ExternalLink, MapPinned, ReceiptText, Sparkles } from "lucide-react";
import { createTripAction } from "@/app/actions";
import { AnalyticsLink } from "@/components/analytics-link";
import { AnalyticsTrack } from "@/components/analytics-track";
import { PriceContextBanner } from "@/components/price-context-banner";
import { StatusBadge } from "@/components/status-badge";
import { CreateTripSubmit } from "@/components/trip/create-trip-submit";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SelectField } from "@/components/ui/select-field";
import { estimateTripCost, getRentalOptionsForResort, resolveLiftPrice } from "@/lib/pricing";
import { getRecommendations } from "@/lib/recommendation";
import { optionAppliesToDay } from "@/lib/trip-ski-plan";
import { departureLocations } from "@/data/departure-locations";
import { getSession } from "@/lib/session";
import type { CostEstimate, CostItem, PriceConfidence, Priority, RentalPriceRule, RentalShop, SkiResort, TimeSlot, TripDuration, TripInput } from "@/lib/types";
import { formatCurrency, formatMinutes } from "@/lib/utils";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RecommendationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const input = parseParams(params);
  const recommendations = getRecommendations(input);
  const departureLabel = departureLocations.find((location) => location.id === input.departureLocation)?.label ?? "서울 강남";
  const session = await getSession();
  const isAuthenticated = Boolean(session?.user);

  return (
    <main className="page-shell py-8">
      <AnalyticsTrack eventName="recommendation_view" eventData={{ count: recommendations.length }} />
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold text-primary">Recommendations</p>
          <h1 className="text-balance text-3xl font-black md:text-5xl">예약 전에 비교할 추천 3곳</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            같은 날짜와 인원으로 리조트 공식 이용과 주변 렌탈샵 이용의 비용을 비교하고, 마음에 드는 곳을 트립으로 저장하세요.
          </p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            기준 지역: {departureLabel} · 이동 시간과 자차 교통비는 대표 지점 기준의 대략적인 추정치입니다.
          </p>
        </div>
        <a href="/plan">
          <Button variant="secondary">조건 다시 입력</Button>
        </a>
      </div>

      <div className="mb-5"><PriceContextBanner /></div>

      {recommendations.length ? <RecommendationComparison recommendations={recommendations.slice(0, 3)} /> : null}

      <section className="grid gap-4">
        {recommendations.length === 0 ? (
          <Card>
            <CardContent className="flex min-h-64 flex-col items-center justify-center gap-4 text-center">
              <div>
                <h2 className="text-2xl font-black">조건에 맞는 추천 결과가 없습니다.</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  야간/교통 조건을 낮추거나 출발지를 바꿔 다시 시도해 주세요.
                </p>
              </div>
              <a href="/plan">
                <Button>조건 다시 입력</Button>
              </a>
            </CardContent>
          </Card>
        ) : recommendations.slice(0, 3).map((recommendation, index) => {
          return (
            <Card key={recommendation.resort.id} className="overflow-hidden transition-colors hover:border-primary/50">
              <div className="grid gap-0 lg:grid-cols-[1fr_360px]">
                <div className="p-5 md:p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <StatusBadge tone="dark">추천 {index + 1}</StatusBadge>
                    {recommendation.resort.tags.map((tag) => (
                      <StatusBadge key={tag}>{tag}</StatusBadge>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-2xl font-black md:text-3xl">{recommendation.resort.name}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{recommendation.resort.region}</p>
                    </div>
                    <div className="rounded-lg border bg-primary/10 px-3 py-2 text-sm font-black text-primary">
                      {formatCurrency(recommendation.cost.representative)}
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <MiniStat icon={<MapPinned />} label="예상 이동" value={formatMinutes(recommendation.travelMinutes)} />
                    <MiniStat icon={<ReceiptText />} label="예상 총액" value={`${formatCurrency(recommendation.cost.min)}~${formatCurrency(recommendation.cost.max)}`} />
                    <MiniStat label="렌탈 후보" value={`${recommendation.rentalShops.length}곳`} />
                  </div>
                  <ul className="mt-4 grid gap-2 text-sm md:grid-cols-2">
                    {recommendation.reasons.map((reason) => (
                      <li key={reason} className="flex gap-2 rounded-md bg-muted px-3 py-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <AnalyticsLink
                      href={recommendation.resort.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      eventName="external_link_click"
                      eventData={{ type: "official", resortId: recommendation.resort.id }}
                    >
                      <Button variant="secondary" type="button">
                        공식 사이트 <ExternalLink className="h-4 w-4" />
                      </Button>
                    </AnalyticsLink>
                    {recommendation.resort.mapLinks.naver ? (
                      <AnalyticsLink
                        href={recommendation.resort.mapLinks.naver}
                        target="_blank"
                        rel="noreferrer"
                        eventName="external_link_click"
                        eventData={{ type: "naver_map", resortId: recommendation.resort.id }}
                      >
                        <Button variant="ghost" type="button">네이버 지도</Button>
                      </AnalyticsLink>
                    ) : null}
                  </div>
                </div>
                <form action={createTripAction} className="border-t bg-muted/40 p-5 lg:border-l lg:border-t-0">
                  {Object.entries(inputToHidden(input)).map(([key, value]) => (
                    <input key={key} type="hidden" name={key} value={value} />
                  ))}
                  <input type="hidden" name="resortId" value={recommendation.resort.id} />
                  <div className="mb-4 rounded-lg border bg-card/80 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-muted-foreground">조건 기준 예상 총액 · {input.peopleCount}명</div>
                        <h3 className="mt-1 text-2xl font-black">{formatCurrency(recommendation.cost.representative)}</h3>
                      </div>
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">범위 {formatCurrency(recommendation.cost.min)}–{formatCurrency(recommendation.cost.max)} · 리프트·렌탈·교통 기준</p>
                  </div>
                  <input type="hidden" name="selectedRentalOptionId" value="skip" />
                  <p className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs leading-5 text-muted-foreground">
                    가격을 비교한 뒤 트립을 만들면 날짜별로 샵과 품목을 바꿀 수 있어요.
                  </p>
                  <CreateTripSubmit isAuthenticated={isAuthenticated} />
                </form>
              </div>
              <div className="border-t bg-muted/20 p-4 md:p-6">
                <RentalCostComparison resort={recommendation.resort} input={input} baseEstimate={recommendation.cost} expanded={index === 0} />
              </div>
            </Card>
          );
        })}
      </section>
    </main>
  );
}

const confidenceLabels: Record<PriceConfidence, string> = {
  confirmed: "확인됨",
  estimated: "추정",
  phone_confirmed: "전화확인",
  unavailable: "확인필요"
};

type RentalCostScenario = {
  kind: "official" | "external";
  shop: RentalShop;
  rentalOption: RentalPriceRule;
  estimate: CostEstimate;
};

function RentalCostComparison({ resort, input, baseEstimate, expanded }: { resort: SkiResort; input: TripInput; baseEstimate: CostEstimate; expanded: boolean }) {
  const itemType = getNeededRentalItemType(input);
  const scenarios = itemType ? getRentalCostScenarios(resort, input, itemType) : [];
  const official = scenarios.find((scenario) => scenario.kind === "official");
  const external = scenarios.find((scenario) => scenario.kind === "external");
  const officialUrl = resort.rentalUrl ?? resort.officialUrl;
  const savings = official && external && hasCompleteCost(official.estimate) && hasCompleteCost(external.estimate)
    ? official.estimate.representative - external.estimate.representative
    : null;

  return (
    <details open={expanded} className="rounded-xl border bg-card">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-3 py-3 font-black outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block text-sm">공식 리조트와 주변 렌탈샵 비교</span>
          <span className="mt-0.5 block text-[11px] font-semibold text-muted-foreground">
            {itemType === null ? "장비·의류 보유로 렌탈 비교 제외" : <>
              {official ? `공식 ${scenarioTotalLabel(official.estimate)}` : "공식 렌탈 가격 미확인"}
              {" · "}
              {external ? `주변 ${scenarioTotalLabel(external.estimate)}` : "주변 샵 가격 미확인"}
            </>}
          </span>
          {savings !== null && savings !== 0 ? <span className="mt-1 block text-[11px] font-black text-primary">대표 예상액 기준 {savings > 0 ? "주변 샵이" : "공식 렌탈이"}{" "}{formatCurrency(Math.abs(savings))} 낮아요</span> : null}
        </span>
        <span aria-hidden="true" className="text-lg text-muted-foreground">⌄</span>
      </summary>
      <div className="space-y-3 border-t p-3">
        {!itemType ? (
          <>
            <p className="text-xs leading-5 text-muted-foreground">장비와 의류를 모두 보유한다고 입력해 렌탈비 비교는 생략했어요.</p>
            <BaseCostBreakdown estimate={baseEstimate} />
          </>
        ) : scenarios.length ? (
          <>
            <div className="grid gap-3 md:grid-cols-2">
              {official ? <RentalScenarioCard scenario={official} peopleCount={input.peopleCount} /> : (
                <p className="rounded-lg border border-dashed p-3 text-xs leading-5 text-muted-foreground">이 날짜에 적용할 공식 렌탈 가격을 찾지 못했어요. 공식 요금은 원문에서 확인할 수 있습니다.</p>
              )}
              {external ? <RentalScenarioCard scenario={external} peopleCount={input.peopleCount} /> : (
                <p className="rounded-lg border border-dashed p-3 text-xs leading-5 text-muted-foreground">이 날짜에 적용할 주변 샵 가격을 찾지 못했어요. 지도에서 주변 렌탈샵을 확인해 보세요.</p>
              )}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold">
              <AnalyticsLink href={officialUrl} target="_blank" rel="noreferrer" eventName="external_link_click" eventData={{ type: "official_rental", resortId: resort.id }} className="inline-flex min-h-9 items-center gap-1 text-primary">
                공식 렌탈 요금 <ExternalLink className="h-3 w-3" />
              </AnalyticsLink>
              <AnalyticsLink href={`/resorts?resortId=${resort.id}`} eventName="resort_map_open" eventData={{ resortId: resort.id }} className="inline-flex min-h-9 items-center gap-1 text-primary">
                주변 샵 더 보기 <MapPinned className="h-3 w-3" />
              </AnalyticsLink>
            </div>
            <p className="text-[11px] leading-5 text-muted-foreground">주변 샵은 해당 날짜에 적용 가능한 가격 자료가 있는 후보 중 낮은 대표 예상액으로 계산했어요. 교통·인원·숙박 입력은 두 경우에 동일하게 적용합니다.</p>
          </>
        ) : (
          <div className="space-y-2 text-xs leading-5 text-muted-foreground">
            <p>선택한 날짜에는 비교할 수 있는 렌탈 가격이 아직 없습니다.</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 font-bold">
              <AnalyticsLink href={officialUrl} target="_blank" rel="noreferrer" eventName="external_link_click" eventData={{ type: "official_rental", resortId: resort.id }} className="inline-flex min-h-9 items-center gap-1 text-primary">공식 렌탈 요금 <ExternalLink className="h-3 w-3" /></AnalyticsLink>
              <AnalyticsLink href={`/resorts?resortId=${resort.id}`} eventName="resort_map_open" eventData={{ resortId: resort.id }} className="inline-flex min-h-9 items-center gap-1 text-primary">주변 샵 더 보기 <MapPinned className="h-3 w-3" /></AnalyticsLink>
            </div>
            <BaseCostBreakdown estimate={baseEstimate} />
          </div>
        )}
      </div>
    </details>
  );
}

function RentalScenarioCard({ scenario, peopleCount }: { scenario: RentalCostScenario; peopleCount: number }) {
  const hasUnknownItems = scenario.estimate.items.some((item) => !hasCostAmount(item));
  const sourceUrl = scenario.rentalOption.sourceUrl ?? scenario.shop.sourceUrl ?? scenario.shop.url;
  const label = scenario.kind === "official" ? "리조트 공식" : "주변 렌탈샵";
  const shopDetails = [
    scenario.kind === "external" && scenario.shop.distanceMinutes !== undefined && scenario.shop.distanceMinutes > 0 ? `약 ${scenario.shop.distanceMinutes}분` : null,
    scenario.kind === "external" && scenario.shop.pickupAvailable ? "픽업 가능" : null
  ].filter(Boolean).join(" · ");

  return (
    <section className="rounded-lg border bg-background p-3" aria-label={`${label} ${scenario.shop.name} 예상 비용`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <StatusBadge>{label}</StatusBadge>
          <h4 className="mt-1 truncate text-sm font-black">{scenario.shop.name}</h4>
          {shopDetails ? <p className="mt-0.5 text-[11px] font-semibold text-muted-foreground">{shopDetails}</p> : null}
        </div>
        <StatusBadge tone={scenario.estimate.confidence === "confirmed" ? "good" : scenario.estimate.confidence === "unavailable" ? "warn" : "neutral"}>{confidenceLabels[scenario.estimate.confidence]}</StatusBadge>
      </div>
      <div className="mt-3 divide-y rounded-md border px-2.5">
        {scenario.estimate.items.map((item) => <ScenarioCostLine key={item.key} item={item} />)}
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold text-muted-foreground">{hasUnknownItems ? "확인된 항목 합계" : "일행 전체 예상"}</p>
          <p className="text-lg font-black">{formatCurrency(scenario.estimate.representative)}</p>
        </div>
        <p className="text-right text-[11px] font-semibold text-muted-foreground">1인 약 {formatCurrency(Math.round(scenario.estimate.representative / peopleCount))}</p>
      </div>
      {sourceUrl ? <AnalyticsLink href={sourceUrl} target="_blank" rel="noreferrer" eventName="external_link_click" eventData={{ type: "rental_price_source", resortId: scenario.shop.resortId, shopId: scenario.shop.id }} className="mt-2 inline-flex min-h-9 items-center gap-1 text-xs font-bold text-primary">렌탈 가격 원문 <ExternalLink className="h-3 w-3" /></AnalyticsLink> : null}
    </section>
  );
}

function ScenarioCostLine({ item }: { item: CostItem }) {
  const label = item.key.startsWith("lift_ticket") ? "리프트권" : item.key.startsWith("rental") ? "장비·의류" : item.key.startsWith("transport") ? "교통" : item.label;
  const amount = hasCostAmount(item) ? formatCostItem(item) : "가격 확인 필요";
  return (
    <div className="flex items-start justify-between gap-2 py-2 text-xs">
      <div className="min-w-0">
        <p className="font-bold">{label}</p>
        {item.sourceName || item.confidence !== "confirmed" ? <p className="mt-0.5 truncate text-[10px] font-medium text-muted-foreground">{item.sourceName ?? confidenceLabels[item.confidence]}</p> : null}
      </div>
      <div className="shrink-0 text-right">
        <p className="font-black">{amount}</p>
        {item.sourceUrl ? <AnalyticsLink href={item.sourceUrl} target="_blank" rel="noreferrer" eventName="external_link_click" eventData={{ type: "price_source", sourceName: item.sourceName ?? item.key }} className="text-[10px] font-bold text-primary">출처</AnalyticsLink> : null}
      </div>
    </div>
  );
}

function BaseCostBreakdown({ estimate }: { estimate: CostEstimate }) {
  return (
    <div className="space-y-2 rounded-lg border bg-background p-3">
      <p className="text-xs font-black text-foreground">기본 예상액 구성</p>
      {estimate.items.map((item) => <BaseCostLine key={item.key} item={item} />)}
    </div>
  );
}

function BaseCostLine({ item }: { item: CostItem }) {
  return (
    <div className="flex items-start justify-between gap-3 text-xs">
      <div className="min-w-0">
        <p className="font-bold text-foreground">{item.label}</p>
        {item.sourceName ? <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{item.sourceName}</p> : null}
      </div>
      <div className="shrink-0 text-right">
        <p className="font-black text-foreground">{hasCostAmount(item) ? formatCostItem(item) : "가격 확인 필요"}</p>
        {item.sourceUrl ? <AnalyticsLink href={item.sourceUrl} target="_blank" rel="noreferrer" eventName="external_link_click" eventData={{ type: "price_source", sourceName: item.sourceName ?? item.key }} className="text-[10px] font-bold text-primary">출처</AnalyticsLink> : null}
      </div>
    </div>
  );
}

function getRentalCostScenarios(resort: SkiResort, input: TripInput, itemType: RentalPriceRule["itemType"]): RentalCostScenario[] {
  const matchingDay = { date: input.visitDate, timeSlot: input.liftTicketTimeSlot };
  const officialLift = resolveLiftPrice(resort.id, input.liftTicketTimeSlot, input.visitDate);
  const officialLiftPrice = officialLift?.adultPrice ?? officialLift?.priceMin;
  const optionsByShop = getRentalOptionsForResort(resort.id);
  const candidates = optionsByShop.flatMap(({ shop, options }) => {
    const rentalOption = options
      .filter((option) => option.itemType === itemType)
      .filter((option) => option.representativePrice !== undefined || option.priceMin !== undefined)
      .filter((option) => itemType !== "equipment" || !option.rideType || option.rideType === input.rideType || option.rideType === "all")
      .filter((option) => optionAppliesToDay(option, matchingDay))
      .sort((left, right) => (left.representativePrice ?? left.priceMin ?? Number.MAX_SAFE_INTEGER) - (right.representativePrice ?? right.priceMin ?? Number.MAX_SAFE_INTEGER))[0];
    if (!rentalOption) return [];

    const kind = shop.id.endsWith("official-rental") ? "official" : "external";
    const liftOption = kind === "external"
      ? options
        .filter((option) => option.itemType === "lift_ticket" && optionAppliesToDay(option, matchingDay))
        .filter((option) => option.representativePrice !== undefined || option.priceMin !== undefined)
        .filter((option) => officialLiftPrice === undefined || (option.representativePrice ?? option.priceMin ?? Number.MAX_SAFE_INTEGER) < officialLiftPrice)
        .sort((left, right) => (left.representativePrice ?? left.priceMin ?? Number.MAX_SAFE_INTEGER) - (right.representativePrice ?? right.priceMin ?? Number.MAX_SAFE_INTEGER))[0]
      : undefined;

    return [{
      kind,
      shop,
      rentalOption,
      estimate: estimateTripCost(resort, input, rentalOption.id, undefined, liftOption?.id)
    } satisfies RentalCostScenario];
  });

  const official = candidates.find((scenario) => scenario.kind === "official");
  const external = candidates
    .filter((scenario) => scenario.kind === "external")
    .sort((left, right) => left.estimate.representative - right.estimate.representative)[0];
  return [official, external].filter((scenario): scenario is RentalCostScenario => Boolean(scenario));
}

function getNeededRentalItemType(input: TripInput): RentalPriceRule["itemType"] | null {
  const needsEquipment = !input.ownsEquipment || input.priorities.includes("rental");
  const needsClothing = !input.ownsClothing;
  if (needsEquipment && needsClothing) return "equipment_clothing_package";
  if (needsEquipment) return "equipment";
  if (needsClothing) return "clothing";
  return null;
}

function hasCostAmount(item: CostItem) {
  return item.representative !== undefined || item.min !== undefined || item.max !== undefined;
}

function hasCompleteCost(estimate: CostEstimate) {
  return estimate.items.length > 0 && estimate.items.every(hasCostAmount);
}

function scenarioTotalLabel(estimate: CostEstimate) {
  const prefix = hasCompleteCost(estimate) ? "" : "확인 항목 ";
  return `${prefix}${formatCurrency(estimate.representative)}`;
}

function formatCostItem(item: CostItem) {
  if (item.min !== undefined && item.max !== undefined && item.min !== item.max) {
    return `${formatCurrency(item.min)}–${formatCurrency(item.max)}`;
  }
  return formatCurrency(item.representative ?? item.min ?? item.max ?? 0);
}

function RecommendationComparison({ recommendations }: { recommendations: ReturnType<typeof getRecommendations> }) {
  return (
    <section className="mb-6 overflow-hidden rounded-2xl border bg-card" aria-labelledby="comparison-title">
      <div className="border-b px-5 py-4"><h2 id="comparison-title" className="text-lg font-black">추천 3곳 한눈에 비교</h2><p className="mt-1 text-xs text-muted-foreground">같은 조건으로 계산한 이동·예산·렌탈 편의를 나란히 확인하세요.</p><p className="mt-2 text-xs font-bold text-primary md:hidden">표를 좌우로 밀어 3곳을 비교하세요 →</p></div>
      <div className="overscroll-x-contain overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-muted/60 text-xs text-muted-foreground"><tr><th className="px-5 py-3">비교 기준</th>{recommendations.map((item) => <th key={item.resort.id} className="px-4 py-3 text-foreground">{item.resort.name}</th>)}</tr></thead>
          <tbody className="divide-y">
            <ComparisonRow label="예상 이동" values={recommendations.map((item) => formatMinutes(item.travelMinutes))} />
            <ComparisonRow label="예상 총액" values={recommendations.map((item) => `${formatCurrency(item.cost.min)}~${formatCurrency(item.cost.max)}`)} />
            <ComparisonRow label="가격 신뢰도" values={recommendations.map((item) => confidenceLabels[item.cost.confidence])} />
            <ComparisonRow label="렌탈 후보" values={recommendations.map((item) => `${item.rentalShops.length}곳`)} />
            <ComparisonRow label="추천 핵심" values={recommendations.map((item) => item.reasons[0] ?? "조건 확인 필요")} />
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ComparisonRow({ label, values }: { label: string; values: string[] }) {
  return <tr><th className="whitespace-nowrap px-5 py-3 font-bold text-muted-foreground">{label}</th>{values.map((value, index) => <td key={`${label}-${index}`} className="px-4 py-3 font-semibold">{value}</td>)}</tr>;
}

function MiniStat({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border bg-card/70 p-3">
      <div className="mb-1 flex items-center gap-1 text-xs font-semibold text-muted-foreground">
        {icon ? <span className="[&_svg]:h-3.5 [&_svg]:w-3.5">{icon}</span> : null}
        {label}
      </div>
      <div className="break-words font-black">{value}</div>
    </div>
  );
}

function parseParams(params: Record<string, string | string[] | undefined>): TripInput {
  const value = (key: string, fallback = "") => {
    const raw = params[key];
    return Array.isArray(raw) ? raw[0] ?? fallback : raw ?? fallback;
  };
  return {
    visitDate: value("visitDate"),
    endDate: value("endDate") || undefined,
    departureLocation: value("departureLocation", "seoul-gangnam"),
    peopleCount: Number(value("peopleCount", "2")),
    tripDuration: value("tripDuration", "same_day") as TripDuration,
    skillLevel: value("skillLevel", "beginner") as TripInput["skillLevel"],
    rideType: value("rideType", "ski") as TripInput["rideType"],
    ownsEquipment: value("ownsEquipment", "false") === "true",
    ownsClothing: value("ownsClothing", "false") === "true",
    transportType: value("transportType", "car") as TripInput["transportType"],
    budgetMin: Number(value("budgetMin", "0")) || undefined,
    budgetMax: Number(value("budgetMax", "0")) || undefined,
    priorities: [value("priority1", "beginner"), value("priority2", "close"), value("priority3", "rental")] as Priority[],
    liftTicketTimeSlot: value("liftTicketTimeSlot", "4h") as TimeSlot,
    lodgingCostInput: Number(value("lodgingCostInput", "0")) || undefined
  };
}

function inputToHidden(input: TripInput) {
  return {
    visitDate: input.visitDate,
    endDate: input.endDate ?? input.visitDate,
    departureLocation: input.departureLocation,
    peopleCount: String(input.peopleCount),
    tripDuration: input.tripDuration,
    skillLevel: input.skillLevel,
    rideType: input.rideType,
    ownsEquipment: String(input.ownsEquipment),
    ownsClothing: String(input.ownsClothing),
    transportType: input.transportType,
    budgetMin: String(input.budgetMin ?? ""),
    budgetMax: String(input.budgetMax ?? ""),
    priority1: input.priorities[0],
    priority2: input.priorities[1],
    priority3: input.priorities[2],
    liftTicketTimeSlot: input.liftTicketTimeSlot,
    lodgingCostInput: String(input.lodgingCostInput ?? "")
  };
}
