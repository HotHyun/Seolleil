import { ExternalLink, MapPinned, ReceiptText } from "lucide-react";
import { createTripAction } from "@/app/actions";
import { AnalyticsLink } from "@/components/analytics-link";
import { AnalyticsTrack } from "@/components/analytics-track";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectField } from "@/components/ui/select-field";
import { getRentalOptionsForResort } from "@/lib/pricing";
import { getCategoryRecommendations, getRecommendations } from "@/lib/recommendation";
import type { Priority, TimeSlot, TripDuration, TripInput } from "@/lib/types";
import { formatCurrency, formatMinutes } from "@/lib/utils";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RecommendationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const input = parseParams(params);
  const recommendations = getRecommendations(input);
  const categories = getCategoryRecommendations(input);

  return (
    <main className="page-shell py-8">
      <AnalyticsTrack eventName="recommendation_view" eventData={{ count: recommendations.length }} />
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold text-primary">Recommendations</p>
          <h1 className="text-3xl font-black md:text-5xl">조건에 맞는 추천 3곳</h1>
        </div>
        <a href="/plan">
          <Button variant="secondary">조건 다시 입력</Button>
        </a>
      </div>

      <section className="mb-8 grid gap-3 md:grid-cols-5">
        {categories.map((item) => (
          <Card key={item.label}>
            <CardContent className="p-4">
              <div className="text-xs font-semibold text-muted-foreground">{item.label}</div>
              <div className="mt-1 font-black">{item.recommendation.resort.name}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4">
        {recommendations.slice(0, 3).map((recommendation, index) => {
          const rentalOptions = getRentalOptionsForResort(recommendation.resort.id);
          return (
            <Card key={recommendation.resort.id} className="overflow-hidden">
              <div className="grid gap-0 lg:grid-cols-[1fr_360px]">
                <div className="p-5">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <StatusBadge tone="dark">추천 {index + 1}</StatusBadge>
                    {recommendation.resort.tags.map((tag) => (
                      <StatusBadge key={tag}>{tag}</StatusBadge>
                    ))}
                  </div>
                  <h2 className="text-2xl font-black">{recommendation.resort.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{recommendation.resort.region}</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <MiniStat icon={<MapPinned />} label="예상 이동" value={formatMinutes(recommendation.travelMinutes)} />
                    <MiniStat icon={<ReceiptText />} label="예상 총액" value={`${formatCurrency(recommendation.cost.min)}~`} />
                    <MiniStat label="렌탈 후보" value={`${recommendation.rentalShops.length}곳`} />
                  </div>
                  <ul className="mt-4 space-y-2 text-sm">
                    {recommendation.reasons.map((reason) => (
                      <li key={reason} className="rounded-md bg-muted px-3 py-2">
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
                <form action={createTripAction} className="border-t bg-white/7 p-5 lg:border-l lg:border-t-0">
                  {Object.entries(inputToHidden(input)).map(([key, value]) => (
                    <input key={key} type="hidden" name={key} value={value} />
                  ))}
                  <input type="hidden" name="resortId" value={recommendation.resort.id} />
                  <div className="mb-4">
                    <h3 className="font-black">비용 요약</h3>
                    <div className="mt-3 space-y-2">
                      {recommendation.cost.items.map((item) => (
                        <div key={item.key} className="flex justify-between gap-3 text-sm">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className="font-semibold">{formatCurrency(item.representative ?? item.min)}</span>
                        </div>
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
                          label: `${shop.name} - ${option.label} (${formatCurrency(option.representativePrice)})`
                        }))
                      )
                    ]}
                  />
                  <Button type="submit" className="mt-4 w-full">
                    이 스키장으로 트립 만들기
                  </Button>
                </form>
              </div>
            </Card>
          );
        })}
      </section>
    </main>
  );
}

function MiniStat({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border bg-white/7 p-3">
      <div className="mb-1 flex items-center gap-1 text-xs font-semibold text-muted-foreground">
        {icon ? <span className="[&_svg]:h-3.5 [&_svg]:w-3.5">{icon}</span> : null}
        {label}
      </div>
      <div className="font-black">{value}</div>
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
