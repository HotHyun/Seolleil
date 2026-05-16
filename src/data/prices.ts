import { CURRENT_SEASON } from "@/lib/constants";
import type { PriceRule, RentalPriceRule } from "@/lib/types";
import { rentalShops, resorts } from "@/data/resorts";

const seasonStart = "2026-12-01";
const seasonEnd = "2027-03-15";
const checkedAt = "2026-05-13";

const baseLift: Record<string, number> = {
  konjiam: 82000,
  jisan: 68000,
  vivaldi: 78000,
  elysian: 72000,
  phoenix: 85000,
  yongpyong: 89000,
  high1: 86000,
  wellihilli: 76000,
  oakvalley: 70000,
  alpensia: 72000,
  o2: 62000,
  muju: 78000,
  edenvalley: 66000,
  bearstown: 0
};

const slotMultipliers: Record<string, number> = {
  "2h": 0.56,
  "3h": 0.68,
  "4h": 0.78,
  "6h": 0.9,
  night: 0.7,
  full_day: 1,
  all: 1
};

export const priceRules: PriceRule[] = resorts.flatMap((resort) => {
  const base = baseLift[resort.id] || 72000;
  if (resort.operationStatus !== "operating") return [];
  return Object.entries(slotMultipliers).map(([slot, multiplier]) => ({
    id: `${resort.id}-lift-${slot}`,
    resortId: resort.id,
    season: CURRENT_SEASON,
    itemType: "lift_ticket",
    label: `${resort.name} ${slot} 리프트권`,
    validFrom: seasonStart,
    validTo: seasonEnd,
    dayType: "all",
    timeSlot: slot as PriceRule["timeSlot"],
    adultPrice: Math.round((base * multiplier) / 1000) * 1000,
    childPrice: Math.round((base * multiplier * 0.78) / 1000) * 1000,
    priceMin: Math.round((base * multiplier * 0.85) / 1000) * 1000,
    priceMax: Math.round((base * multiplier * 1.12) / 1000) * 1000,
    sourceType: "official_site",
    sourceName: `${resort.name} 공식 요금 안내`,
    sourceUrl: resort.liftTicketUrl,
    bookingUrl: resort.liftTicketUrl,
    confidence: "estimated",
    lastCheckedAt: checkedAt,
    verifiedByHuman: false,
    verificationNote: "2026/27 시즌 실제 요금 수동 검증 전",
    memo: "MVP 초기 더미 가격. 시즌 가격 조사 후 static 데이터로 교체 필요."
  }));
});

export const rentalPriceRules: RentalPriceRule[] = rentalShops.flatMap((shop) => {
  const resort = resorts.find((item) => item.id === shop.resortId);
  if (resort?.operationStatus !== "operating") return [];

  const official = shop.id.endsWith("official-rental");
  const equipment = official ? 32000 : 26000;
  const clothing = official ? 28000 : 22000;
  const packagePrice = official ? 54000 : 42000;
  return [
    {
      id: `${shop.id}-equipment-ski`,
      rentalShopId: shop.id,
      resortId: shop.resortId,
      providerType: official ? "resort_official" : "external_shop",
      season: CURRENT_SEASON,
      itemType: "equipment",
      rideType: "ski",
      ageGroup: "adult",
      label: "스키 장비 렌탈",
      validFrom: seasonStart,
      validTo: seasonEnd,
      dayType: "all",
      representativePrice: equipment,
      priceMin: equipment,
      priceMax: equipment + 8000,
      sourceType: official ? "official_site" : "naver_booking",
      sourceName: shop.name,
      sourceUrl: shop.sourceUrl,
      bookingUrl: shop.url ?? shop.sourceUrl,
      confidence: "estimated",
      lastCheckedAt: checkedAt,
      verifiedByHuman: false,
      verificationNote: "2026/27 시즌 실제 요금 수동 검증 전",
      memo: "MVP 초기 더미 가격. 시즌 가격 조사 후 검증 필요."
    },
    {
      id: `${shop.id}-equipment-board`,
      rentalShopId: shop.id,
      resortId: shop.resortId,
      providerType: official ? "resort_official" : "external_shop",
      season: CURRENT_SEASON,
      itemType: "equipment",
      rideType: "snowboard",
      ageGroup: "adult",
      label: "보드 장비 렌탈",
      validFrom: seasonStart,
      validTo: seasonEnd,
      dayType: "all",
      representativePrice: equipment,
      priceMin: equipment,
      priceMax: equipment + 9000,
      sourceType: official ? "official_site" : "naver_booking",
      sourceName: shop.name,
      sourceUrl: shop.sourceUrl,
      bookingUrl: shop.url ?? shop.sourceUrl,
      confidence: "estimated",
      lastCheckedAt: checkedAt,
      verifiedByHuman: false,
      verificationNote: "2026/27 시즌 실제 요금 수동 검증 전",
      memo: "MVP 초기 더미 가격. 시즌 가격 조사 후 검증 필요."
    },
    {
      id: `${shop.id}-clothing`,
      rentalShopId: shop.id,
      resortId: shop.resortId,
      providerType: official ? "resort_official" : "external_shop",
      season: CURRENT_SEASON,
      itemType: "clothing",
      rideType: "all",
      ageGroup: "adult",
      label: "의류 세트 렌탈",
      validFrom: seasonStart,
      validTo: seasonEnd,
      dayType: "all",
      representativePrice: clothing,
      priceMin: clothing,
      priceMax: clothing + 7000,
      sourceType: official ? "official_site" : "naver_booking",
      sourceName: shop.name,
      sourceUrl: shop.sourceUrl,
      bookingUrl: shop.url ?? shop.sourceUrl,
      confidence: "estimated",
      lastCheckedAt: checkedAt,
      verifiedByHuman: false,
      verificationNote: "2026/27 시즌 실제 요금 수동 검증 전",
      memo: "MVP 초기 더미 가격. 시즌 가격 조사 후 검증 필요."
    },
    {
      id: `${shop.id}-package`,
      rentalShopId: shop.id,
      resortId: shop.resortId,
      providerType: official ? "resort_official" : "external_shop",
      season: CURRENT_SEASON,
      itemType: "equipment_clothing_package",
      rideType: "all",
      ageGroup: "adult",
      label: "장비 + 의류 패키지",
      validFrom: seasonStart,
      validTo: seasonEnd,
      dayType: "all",
      representativePrice: packagePrice,
      priceMin: packagePrice,
      priceMax: packagePrice + 12000,
      sourceType: official ? "official_site" : "naver_booking",
      sourceName: shop.name,
      sourceUrl: shop.sourceUrl,
      bookingUrl: shop.url ?? shop.sourceUrl,
      confidence: "estimated",
      lastCheckedAt: checkedAt,
      verifiedByHuman: false,
      verificationNote: "2026/27 시즌 실제 요금 수동 검증 전",
      memo: "MVP 초기 더미 가격. 시즌 가격 조사 후 검증 필요."
    }
  ];
});
