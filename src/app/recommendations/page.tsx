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
import { getRentalOptionsForResort } from "@/lib/pricing";
import { getRecommendations } from "@/lib/recommendation";
import { getSession } from "@/lib/session";
import type { CostItem, PriceConfidence, Priority, RentalPriceRule, TimeSlot, TripDuration, TripInput } from "@/lib/types";
import { formatCurrency, formatMinutes } from "@/lib/utils";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RecommendationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const input = parseParams(params);
  const recommendations = getRecommendations(input);
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
            이동 시간, 날짜 기준 비용, 렌탈 후보를 한 화면에서 보고 바로 트립으로 저장하세요.
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
          const rentalOptions = getRentalOptionsForResort(recommendation.resort.id);
          const primaryRentalOptions = rentalOptions.flatMap(({ shop, options }) =>
            options
              .filter((option) => option.itemType === "equipment_clothing_package" || option.itemType === "equipment")
              .slice(0, 2)
              .map((option) => ({ option, shop }))
          );
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
                        <div className="text-xs font-bold text-muted-foreground">날짜 기준 예상 총액</div>
                        <h3 className="mt-1 text-2xl font-black">{formatCurrency(recommendation.cost.representative)}</h3>
                      </div>
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div className="mt-3 space-y-2">
                      {recommendation.cost.items.map((item) => (
                        <CostLine key={item.key} item={item} />
                      ))}
                    </div>
                  </div>
                  <label className="mb-2 block text-sm font-semibold">렌탈 옵션 선택</label>
                  <SelectField
                    name="selectedRentalOptionId"
                    defaultValue="skip"
                    options={[
                      { value: "skip", label: "나중에 선택" },
                      ...rentalOptions.flatMap(({ shop, options }) =>
                        options.map((option) => ({
                          value: option.id,
                          label: `${shop.id.endsWith("official-rental") ? "공식" : "외부"} · ${shop.name} · ${option.label} (${formatCurrency(option.representativePrice)})`
                        }))
                      )
                    ]}
                  />
                  <div className="mt-4 space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground">렌탈 후보 비교</div>
                    {primaryRentalOptions.slice(0, 3).map(({ option, shop }) => (
                      <RentalOptionLine key={option.id} option={option} shopName={shop.name} official={shop.id.endsWith("official-rental")} />
                    ))}
                  </div>
                  <CreateTripSubmit isAuthenticated={isAuthenticated} />
                </form>
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

function CostLine({ item }: { item: CostItem }) {
  const price = formatCurrency(item.representative ?? item.min);
  return (
    <div className="rounded-md border bg-background/40 px-3 py-2 text-sm">
      <div className="flex justify-between gap-3">
        <span className="text-muted-foreground">{item.label}</span>
        <span className="font-semibold">{price}</span>
      </div>
      {item.sourceName || item.lastCheckedAt ? (
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-muted-foreground">
          <StatusBadge tone={item.confidence === "confirmed" ? "good" : item.confidence === "unavailable" ? "warn" : "neutral"}>{confidenceLabels[item.confidence]}</StatusBadge>
          {item.sourceName ? <span>{item.sourceName}</span> : null}
          {item.sourceUrl ? (
            <AnalyticsLink
              href={item.sourceUrl}
              target="_blank"
              rel="noreferrer"
              eventName="external_link_click"
              eventData={{ type: "price_source", sourceName: item.sourceName ?? item.key }}
              className="inline-flex items-center gap-1 text-primary"
            >
              출처 <ExternalLink className="h-3 w-3" />
            </AnalyticsLink>
          ) : null}
        </div>
      ) : null}
    </div>
  );
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

function RentalOptionLine({
  option,
  shopName,
  official
}: {
  option: RentalPriceRule;
  shopName: string;
  official: boolean;
}) {
  return (
    <div className="rounded-md border bg-card/80 px-3 py-2 text-xs">
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold">{shopName}</span>
        <span className="font-semibold text-primary">{formatCurrency(option.representativePrice)}</span>
      </div>
      <div className="mt-1 flex flex-wrap gap-2 text-muted-foreground">
        <span>{official ? "공식 렌탈" : "외부 렌탈샵"}</span>
        <span>{option.label}</span>
        <span>{confidenceLabels[option.confidence]}</span>
        {option.sourceUrl ? (
          <AnalyticsLink
            href={option.sourceUrl}
            target="_blank"
            rel="noreferrer"
            eventName="external_link_click"
            eventData={{ type: "rental_source", sourceName: shopName }}
            className="text-primary"
          >
            출처
          </AnalyticsLink>
        ) : null}
      </div>
    </div>
  );
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
