import { priceRules, rentalPriceRules } from "@/data/prices";
import { getRentalShopsForResort, getResort, resorts } from "@/data/resorts";
import { getSkiShuttleRoutes } from "@/data/ski-shuttles";
import { CURRENT_SEASON, UPCOMING_SEASON, timeSlotLabels } from "@/lib/constants";
import type { DayType, PriceConfidence, RentalShop, SkiResort, SkiShuttleRoute } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export const guideTopics = ["lift-prices", "rental-shops", "shuttle"] as const;
export type GuideTopic = (typeof guideTopics)[number];

export const guideTopicLabels: Record<GuideTopic, string> = {
  "lift-prices": "리프트권 가격",
  "rental-shops": "렌탈샵 비교",
  shuttle: "스키버스·셔틀"
};

const dayTypeLabels: Record<DayType, string> = {
  weekday: "평일",
  friday: "금요일",
  weekend: "주말",
  holiday: "공휴일",
  peak: "성수기",
  all: "전체"
};

export function seasonLabel(season: string) {
  const [start, end] = season.split("-");
  return start && end ? `${start.slice(2)}/${end.slice(2)} 시즌` : season;
}

export function isGuideTopic(value: string): value is GuideTopic {
  return (guideTopics as readonly string[]).includes(value);
}

const confidenceRank: Record<PriceConfidence, number> = { confirmed: 0, phone_confirmed: 1, estimated: 2, unavailable: 3 };

export type LiftGuideRow = {
  id: string;
  season: string;
  seasonLabel: string;
  label: string;
  dayTypeLabel: string;
  timeSlotLabel: string;
  price?: number;
  confidence: PriceConfidence;
  period: string;
  sourceUrl?: string;
  checkedAt: string;
};

export function getLiftGuideRows(resortId: string): LiftGuideRow[] {
  return priceRules
    .filter((rule) => rule.resortId === resortId && rule.itemType === "lift_ticket")
    .map((rule) => ({
      id: rule.id,
      season: rule.season,
      seasonLabel: seasonLabel(rule.season),
      label: rule.label,
      dayTypeLabel: dayTypeLabels[rule.dayType] ?? rule.dayType,
      timeSlotLabel: rule.timeSlot ? timeSlotLabels[rule.timeSlot] : "시간권",
      price: rule.adultPrice ?? rule.priceMin,
      confidence: rule.confidence,
      period: `${rule.validFrom} ~ ${rule.validTo}`,
      sourceUrl: rule.sourceUrl ?? rule.bookingUrl,
      checkedAt: rule.lastCheckedAt
    }))
    .sort((a, b) => {
      const seasonOrder = (season: string) => (season === UPCOMING_SEASON ? 0 : season === CURRENT_SEASON ? 1 : 2);
      return seasonOrder(a.season) - seasonOrder(b.season) || (a.price ?? Infinity) - (b.price ?? Infinity);
    });
}

export type RentalGuideRow = {
  id: string;
  name: string;
  address?: string;
  equipment: boolean;
  clothing: boolean;
  pickup: boolean;
  liftTickets: boolean;
  fromPrice?: number;
  priceLabel?: string;
  confidence?: PriceConfidence;
  needsRecheck: boolean;
  url?: string;
  mapUrl?: string;
};

function shopPrice(shop: RentalShop) {
  const rules = rentalPriceRules.filter(
    (rule) =>
      rule.rentalShopId === shop.id &&
      (rule.itemType === "equipment" || rule.itemType === "equipment_clothing_package") &&
      (rule.representativePrice ?? rule.priceMin) !== undefined
  );
  if (!rules.length) return undefined;
  const best = rules.reduce((min, rule) => ((rule.representativePrice ?? rule.priceMin ?? Infinity) < (min.representativePrice ?? min.priceMin ?? Infinity) ? rule : min));
  const confidence = rules.reduce<PriceConfidence>((worst, rule) => (confidenceRank[rule.confidence] > confidenceRank[worst] ? rule.confidence : worst), "confirmed");
  return { price: best.representativePrice ?? best.priceMin, label: best.label, confidence };
}

export function getRentalGuideRows(resortId: string): RentalGuideRow[] {
  return getRentalShopsForResort(resortId)
    .map((shop) => {
      const price = shopPrice(shop);
      return {
        id: shop.id,
        name: shop.name,
        address: shop.address,
        equipment: shop.equipmentRentalAvailable,
        clothing: shop.clothingRentalAvailable,
        pickup: Boolean(shop.pickupAvailable),
        liftTickets: Boolean(shop.liftTicketSalesAvailable),
        fromPrice: price?.price,
        priceLabel: price?.label,
        confidence: price?.confidence,
        needsRecheck: shop.dataStatus === "historical_needs_recheck",
        url: shop.url,
        mapUrl: shop.mapLinks?.kakao ?? shop.mapLinks?.naver
      };
    })
    .sort((a, b) => Number(a.fromPrice === undefined) - Number(b.fromPrice === undefined) || Number(a.needsRecheck) - Number(b.needsRecheck) || a.name.localeCompare(b.name, "ko"));
}

export type ShuttleGuideRow = {
  id: string;
  name: string;
  operator: string;
  region: string;
  season: string;
  fare: string;
  note: string;
  phone?: string;
};

export function shuttleFareLabel(route: SkiShuttleRoute) {
  if (route.priceLabel) return route.priceLabel;
  const fare = route.fare;
  if (!fare) return "요금 확인 필요";
  if (fare.type === "free") return "무료";
  const parts = [
    fare.oneWayAdult !== undefined ? `편도 ${formatCurrency(fare.oneWayAdult)}` : undefined,
    fare.roundTripAdult !== undefined ? `왕복 ${formatCurrency(fare.roundTripAdult)}` : undefined,
    fare.seasonPassAdult !== undefined ? `시즌권 ${formatCurrency(fare.seasonPassAdult)}` : undefined
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : "요금 확인 필요";
}

export function getShuttleGuideRows(resortId: string): ShuttleGuideRow[] {
  return getSkiShuttleRoutes(resortId).map((route) => ({
    id: route.id,
    name: route.name,
    operator: route.operator,
    region: route.region,
    season: route.season,
    fare: shuttleFareLabel(route),
    note: route.operationNote,
    phone: route.operatorPhone
  }));
}

export function hasGuideContent(resortId: string, topic: GuideTopic) {
  if (topic === "lift-prices") return getLiftGuideRows(resortId).length > 0;
  if (topic === "rental-shops") return getRentalGuideRows(resortId).length > 0;
  return getShuttleGuideRows(resortId).length > 0;
}

export function getGuideParams() {
  return resorts.flatMap((resort) => guideTopics.filter((topic) => hasGuideContent(resort.id, topic)).map((topic) => ({ resortId: resort.id, topic })));
}

export function getGuidePaths() {
  return getGuideParams().map((item) => `/guides/${item.resortId}/${item.topic}`);
}

export function guideTopicsForResort(resort: SkiResort) {
  return guideTopics.filter((topic) => hasGuideContent(resort.id, topic));
}

export function getGuideResort(id: string) {
  return getResort(id);
}
