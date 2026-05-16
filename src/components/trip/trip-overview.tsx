import { ExternalLink, MapPinned } from "lucide-react";
import { AnalyticsLink } from "@/components/analytics-link";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { rentalPriceRules } from "@/data/prices";
import { getRentalShopsForResort, getResort } from "@/data/resorts";
import { estimateTripCost } from "@/lib/pricing";
import type { CostEstimate, CostItem, PriceConfidence, TimeSlot } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type TripOverviewData = {
  resortId: string;
  resortNameSnapshot: string;
  selectedRecommendation: unknown;
  selectedRentalOptionId: string | null;
  visitDate: Date;
  departureLocation: string;
  peopleCount: number;
  transportType: "car" | "shuttle" | "bus";
  tripDuration: "same_day" | "overnight";
  skillLevel: "first_time" | "beginner" | "intermediate" | "advanced";
  rideType: "ski" | "snowboard";
  ownsEquipment: boolean;
  ownsClothing: boolean;
  budgetMin: number | null;
  budgetMax: number | null;
  lodgingCostInput: number | null;
  liftTicketTimeSlot: string;
};

const confidenceLabels: Record<PriceConfidence, string> = {
  confirmed: "확인됨",
  estimated: "추정",
  phone_confirmed: "전화확인",
  unavailable: "확인필요"
};

export function TripCostAndBooking({ trip }: { trip: TripOverviewData }) {
  const resort = getResort(trip.resortId);
  const cost = parseCostEstimate(trip.selectedRecommendation);
  const rentalOption = trip.selectedRentalOptionId
    ? rentalPriceRules.find((rule) => rule.id === trip.selectedRentalOptionId)
    : undefined;
  const currentCost = resort
    ? estimateTripCost(
        resort,
        {
          visitDate: trip.visitDate.toISOString().slice(0, 10),
          departureLocation: trip.departureLocation,
          peopleCount: trip.peopleCount,
          tripDuration: trip.tripDuration,
          skillLevel: trip.skillLevel,
          rideType: trip.rideType,
          ownsEquipment: trip.ownsEquipment,
          ownsClothing: trip.ownsClothing,
          transportType: trip.transportType,
          budgetMin: trip.budgetMin ?? undefined,
          budgetMax: trip.budgetMax ?? undefined,
          priorities: ["beginner", "close", "rental"],
          liftTicketTimeSlot: trip.liftTicketTimeSlot as TimeSlot,
          lodgingCostInput: trip.lodgingCostInput ?? undefined
        },
        trip.selectedRentalOptionId ?? undefined
      )
    : null;
  const priceChanged =
    cost && currentCost && Math.abs(currentCost.representative - cost.representative) >= 1000;
  const rentalShop = rentalOption?.rentalShopId
    ? getRentalShopsForResort(trip.resortId).find((shop) => shop.id === rentalOption.rentalShopId)
    : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>비용·예약 링크</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cost ? (
          <>
            <div className="rounded-lg border bg-white/7 p-4">
              <div className="text-xs font-semibold text-muted-foreground">예상 총액</div>
              <div className="mt-1 text-2xl font-black">
                {formatCurrency(cost.min)} ~ {formatCurrency(cost.max)}
              </div>
              <div className="mt-1 text-xs font-semibold text-muted-foreground">
                대표 {formatCurrency(cost.representative)} · {confidenceLabels[cost.confidence]}
              </div>
              {priceChanged ? (
                <div className="mt-2 rounded-md bg-amber-500/15 px-3 py-2 text-xs font-semibold text-amber-700 dark:text-amber-200">
                  현재 static 가격 기준 대표 총액은 {formatCurrency(currentCost.representative)}입니다. 생성 당시 가격과 다를 수 있습니다.
                </div>
              ) : null}
            </div>
            <div className="space-y-2">
              {cost.items.map((item) => (
                <CostItemLine key={item.key} item={item} />
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">생성 당시 비용 스냅샷이 없습니다.</p>
        )}

        {rentalOption ? (
          <div className="rounded-lg border bg-white/7 p-4">
            <div className="text-xs font-semibold text-muted-foreground">선택한 렌탈 옵션</div>
            <div className="mt-1 font-black">{rentalShop?.name ?? rentalOption.sourceName}</div>
            <div className="mt-1 text-sm text-muted-foreground">
              {rentalOption.label} · {formatCurrency(rentalOption.representativePrice)}
            </div>
            {rentalOption.sourceUrl ? (
              <AnalyticsLink
                href={rentalOption.sourceUrl}
                target="_blank"
                rel="noreferrer"
                eventName="external_link_click"
                eventData={{ type: "selected_rental", resortId: trip.resortId }}
                className="mt-3 inline-flex text-sm font-semibold text-primary"
              >
                렌탈샵 출처 보기 <ExternalLink className="ml-1 h-4 w-4" />
              </AnalyticsLink>
            ) : null}
          </div>
        ) : null}

        <div className="grid gap-2">
          {resort?.liftTicketUrl ? (
            <BookingButton href={resort.liftTicketUrl} label="리프트권 공식 확인" type="lift_ticket" resortId={trip.resortId} />
          ) : null}
          {rentalOption?.bookingUrl || rentalShop?.url ? (
            <BookingButton
              href={rentalOption?.bookingUrl ?? rentalShop?.url}
              label="렌탈샵 예약/확인"
              type="rental"
              resortId={trip.resortId}
            />
          ) : resort?.rentalUrl ? (
            <BookingButton href={resort.rentalUrl} label="공식 렌탈 확인" type="rental" resortId={trip.resortId} />
          ) : null}
          {resort?.mapLinks.naver ? (
            <BookingButton href={resort.mapLinks.naver} label="네이버 지도" type="naver_map" resortId={trip.resortId} icon={<MapPinned className="h-4 w-4" />} />
          ) : null}
          {resort?.slopeStatusUrl ? (
            <BookingButton href={resort.slopeStatusUrl} label="운영현황 확인" type="slope_status" resortId={trip.resortId} />
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function CostItemLine({ item }: { item: CostItem }) {
  return (
    <div className="rounded-md border bg-white/7 px-3 py-2 text-sm">
      <div className="flex justify-between gap-3">
        <span className="text-muted-foreground">{item.label}</span>
        <span className="font-semibold">{formatCurrency(item.representative ?? item.min)}</span>
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-muted-foreground">
        <StatusBadge>{confidenceLabels[item.confidence]}</StatusBadge>
        {item.sourceName ? <span>{item.sourceName}</span> : null}
        {item.lastCheckedAt ? <span>{item.lastCheckedAt} 확인</span> : null}
        {item.sourceUrl ? (
          <AnalyticsLink
            href={item.sourceUrl}
            target="_blank"
            rel="noreferrer"
            eventName="external_link_click"
            eventData={{ type: "trip_price_source", sourceName: item.sourceName ?? item.key }}
            className="inline-flex items-center gap-1 text-primary"
          >
            출처 <ExternalLink className="h-3 w-3" />
          </AnalyticsLink>
        ) : null}
      </div>
    </div>
  );
}

function BookingButton({
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
      <Button variant="secondary" className="w-full justify-between" type="button">
        <span className="inline-flex items-center gap-2">
          {icon}
          {label}
        </span>
        <ExternalLink className="h-4 w-4" />
      </Button>
    </AnalyticsLink>
  );
}

function parseCostEstimate(value: unknown): CostEstimate | null {
  if (!value || typeof value !== "object" || !("cost" in value)) return null;
  const cost = (value as { cost?: CostEstimate }).cost;
  if (!cost || !Array.isArray(cost.items)) return null;
  return cost;
}
