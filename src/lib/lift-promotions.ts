import { liftPromotions } from "@/data/lift-promotions";
import { resolveLiftPrice } from "@/lib/pricing";
import { todayKst } from "@/lib/season-open";
import type { TimeSlot } from "@/lib/types";

// 공식 공지에 근거한 한정 할인(얼리버드 등)을 정상가와 분리해 보여 주기 위한 데이터다.
// 총액 계산에는 쓰지 않는다. 판매 기간·판매처·수량 제한이 있어 "받을 수 있는 가격"이 아니라 "받을 수도 있는 가격"이기 때문이다.
// 판매 기간이 지나면 자동으로 사라진다.

export type LiftPromotionPrice = {
  timeSlot: TimeSlot;
  dayType: "weekday" | "weekend";
  /** 리프트권 단독 할인가(성인) */
  adultPrice: number;
  /** 리프트권 + 장비렌탈 패키지 할인가(성인). 공지에 없으면 생략 */
  withRentalPrice?: number;
  /** 별도 판매되는 장비 렌탈 가격(성인). 패키지 가격과 구분한다. */
  equipmentRentalPrice?: number;
  equipmentRentalDuration?: string;
};

export type LiftPromotion = {
  id: string;
  resortId: string;
  title: string;
  /** 판매처 이름. 예: "NOL" */
  channel: string;
  /** 판매 시작·종료일(포함). 오늘이 이 범위 밖이면 보이지 않는다. */
  salesFrom: string;
  salesTo: string;
  /** 이용 가능한 방문일 범위(포함). 이 밖의 방문일에는 보이지 않는다. */
  useFrom: string;
  useTo: string;
  prices: LiftPromotionPrice[];
  /** 한정 수량·채널 정책 등 조건 한 줄 */
  condition: string;
  sourceName: string;
  sourceUrl: string;
  lastCheckedAt: string;
};

export type LiftPromotionMatch = {
  promotion: LiftPromotion;
  adultPrice: number;
  withRentalPrice?: number;
  equipmentRentalPrice?: number;
  equipmentRentalDuration?: string;
  /** 같은 조건의 정상가. 정상가를 못 구하면 undefined */
  regularPrice?: number;
  /** 정상가 대비 할인액(양수). 정상가를 못 구하면 undefined */
  saving?: number;
};

function visitDayType(visitDate: string): "weekday" | "weekend" {
  const date = new Date(`${visitDate}T00:00:00`);
  const day = date.getDay();
  // 금요일은 공식 요금표에서 주중으로 묶이는 경우가 많아 주중으로 본다(정상가 계산과 같은 기준).
  return day === 0 || day === 6 ? "weekend" : "weekday";
}

export function isPromotionOnSale(promotion: LiftPromotion, today: string) {
  return promotion.salesFrom <= today && today <= promotion.salesTo;
}

export function findLiftPromotion(
  resortId: string,
  timeSlot: TimeSlot,
  visitDate: string,
  today: string = todayKst(),
  promotions: LiftPromotion[] = liftPromotions
): LiftPromotionMatch | undefined {
  const dayType = visitDayType(visitDate);
  let best: LiftPromotionMatch | undefined;

  for (const promotion of promotions) {
    if (promotion.resortId !== resortId) continue;
    if (!isPromotionOnSale(promotion, today)) continue;
    if (visitDate < promotion.useFrom || visitDate > promotion.useTo) continue;
    const price = promotion.prices.find((item) => item.timeSlot === timeSlot && item.dayType === dayType);
    if (!price) continue;

    const regular = resolveLiftPrice(resortId, timeSlot, visitDate);
    const regularPrice = regular?.adultPrice ?? regular?.priceMin;
    // 정상가보다 싸지 않으면 할인으로 보여 주지 않는다.
    if (regularPrice !== undefined && price.adultPrice >= regularPrice) continue;
    const saving = regularPrice === undefined ? undefined : regularPrice - price.adultPrice;
    if (!best || (saving ?? 0) > (best.saving ?? 0)) {
      best = {
        promotion,
        adultPrice: price.adultPrice,
        withRentalPrice: price.withRentalPrice,
        equipmentRentalPrice: price.equipmentRentalPrice,
        equipmentRentalDuration: price.equipmentRentalDuration,
        regularPrice,
        saving
      };
    }
  }

  return best;
}

/** 오늘 판매 중인 할인이 있는 스키장 id 목록(중복 없음). */
export function resortsWithActivePromotion(today: string = todayKst(), promotions: LiftPromotion[] = liftPromotions) {
  return [...new Set(promotions.filter((item) => isPromotionOnSale(item, today)).map((item) => item.resortId))];
}
