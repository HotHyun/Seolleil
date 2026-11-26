import { priceRules } from "@/data/prices";
import { getResortLiftGuide, type LiftDiscount, type RentalGuideItem, type ResortLiftGuide } from "@/data/lift-discounts";
import { CURRENT_SEASON, UPCOMING_SEASON } from "@/lib/constants";
import { seasonLabel } from "@/lib/guides";
import type { DayType, PriceConfidence, TimeSlot } from "@/lib/types";

// 리프트권 정상가를 시간권 × 요일 구분 표로 모은다. 가이드·스키장 상세가 같은 표를 쓴다.
// 새 시즌 공식 가격이 있으면 그 시즌만 보여 주고, 없을 때만 지난 시즌을 참고가로 보여 준다(두 시즌을 섞지 않는다).

export type BoardCell = { price: number; childPrice?: number; confidence: PriceConfidence };
export type BoardRow = { slot: TimeSlot; cells: Partial<Record<DayType, BoardCell>> };

export type LiftPriceBoard = {
  season: string;
  seasonLabel: string;
  /** 새 시즌 공식 가격이 없어 지난 시즌 가격을 참고가로 보여 주는 경우 */
  isReference: boolean;
  columns: DayType[];
  rows: BoardRow[];
  sourceName?: string;
  sourceUrl?: string;
  checkedAt: string;
};

const slotOrder: TimeSlot[] = ["2h", "3h", "4h", "5h", "6h", "7h", "night", "full_day", "all"];
const columnOrder: DayType[] = ["all", "weekday", "friday", "weekend", "holiday", "peak"];

export function getLiftPriceBoard(resortId: string): LiftPriceBoard | undefined {
  const all = priceRules.filter((rule) => rule.resortId === resortId && rule.itemType === "lift_ticket" && (rule.adultPrice ?? rule.priceMin) !== undefined);
  const season = [UPCOMING_SEASON, CURRENT_SEASON].find((candidate) => all.some((rule) => rule.season === candidate));
  if (!season) return undefined;
  const rules = all.filter((rule) => rule.season === season);

  const rows = slotOrder.flatMap<BoardRow>((slot) => {
    const slotRules = rules.filter((rule) => (rule.timeSlot ?? "all") === slot);
    if (!slotRules.length) return [];
    // 같은 시간권에 요일별 가격이 있으면 요일 구분 없는 값은 쓰지 않는다.
    const specific = slotRules.filter((rule) => rule.dayType !== "all");
    const cells: BoardRow["cells"] = {};
    for (const rule of specific.length ? specific : slotRules) {
      if (cells[rule.dayType]) continue;
      cells[rule.dayType] = { price: (rule.adultPrice ?? rule.priceMin)!, childPrice: rule.childPrice, confidence: rule.confidence };
    }
    return [{ slot, cells }];
  });

  const present = new Set(rows.flatMap((row) => Object.keys(row.cells) as DayType[]));
  const columns = columnOrder.filter((column) => present.has(column));
  const newest = rules.reduce((latest, rule) => (rule.lastCheckedAt > latest ? rule.lastCheckedAt : latest), "");
  const source = rules.find((rule) => rule.sourceUrl);

  return {
    season,
    seasonLabel: seasonLabel(season),
    isReference: season !== UPCOMING_SEASON,
    columns,
    rows,
    sourceName: source?.sourceName,
    sourceUrl: source?.sourceUrl,
    checkedAt: newest
  };
}

/** 정상가에서 할인율(%)만큼 뺀 금액. 원 단위로 반올림한다. */
export function discountedPrice(price: number, ratePercent: number) {
  return Math.round(price * (1 - ratePercent / 100));
}

export type DiscountCard = {
  discount: LiftDiscount;
  rows: { slot: TimeSlot; weekday?: number; weekend?: number; single?: number }[];
};

/** 리프트권 할인율이 있고 가격표 카드로 보여 줄 할인을 시간권별 할인가로 계산한다. */
export function buildDiscountCards(board: LiftPriceBoard, guide: ResortLiftGuide): DiscountCard[] {
  return guide.discounts
    .filter((discount) => discount.highlight && discount.rates.lift)
    .map((discount) => {
      const rate = discount.rates.lift!;
      const rows = board.rows.flatMap<DiscountCard["rows"][number]>((row) => {
        const weekday = row.cells.weekday?.price;
        const weekend = row.cells.weekend?.price;
        const single = row.cells.all?.price;
        if (weekday === undefined && weekend === undefined && single === undefined) return [];
        return [{
          slot: row.slot,
          weekday: weekday === undefined ? undefined : discountedPrice(weekday, rate),
          weekend: discount.weekdayOnly || weekend === undefined ? undefined : discountedPrice(weekend, rate),
          single: single === undefined || discount.weekdayOnly ? undefined : discountedPrice(single, rate)
        }];
      });
      return { discount, rows };
    });
}

export function getLiftGuideForBoard(resortId: string, board: LiftPriceBoard) {
  const guide = getResortLiftGuide(resortId);
  return guide && guide.season === board.season ? guide : undefined;
}

export type RentalDiscountCard = {
  discount: LiftDiscount;
  rows: { item: RentalGuideItem; prices: { label: string; price: number }[] }[];
};

/** 장비 렌탈 할인율이 있는 '누구나' 할인을 할인받을 수 있는 품목별 할인가로 계산한다. */
export function buildRentalDiscountCards(guide: ResortLiftGuide): RentalDiscountCard[] {
  const rental = guide.rental;
  if (!rental) return [];
  const items = rental.equipment.filter((item) => item.discountable);
  return guide.discounts
    .filter((discount) => discount.group === "anyone" && discount.rates.rental)
    .map((discount) => ({
      discount,
      rows: items.map((item) => ({ item, prices: item.prices.map((entry) => ({ label: entry.label, price: discountedPrice(entry.price, discount.rates.rental!) })) }))
    }));
}

export type TripExample = {
  title: string;
  note?: string;
  weekday?: { lift: number; equipment: number; clothing: number; total: number };
  weekend?: { lift: number; equipment: number; clothing: number; total: number };
};

/** 4시간권 + 장비 풀세트 + 의류 풀세트(4시간 이하)를 한 번에 빌릴 때 1인 비용. 의류는 공식 우대표에 없어 할인하지 않는다. */
export function buildTripExamples(board: LiftPriceBoard, guide: ResortLiftGuide): TripExample[] {
  const rental = guide.rental;
  const lift = board.rows.find((row) => row.slot === "4h");
  const equipment = rental?.equipment.find((item) => item.discountable);
  const clothing = rental?.clothing.find((item) => item.prices.length)?.prices[0]?.price;
  if (!rental || !lift || !equipment || clothing === undefined) return [];
  const priceOf = (label: string) => equipment.prices.find((entry) => entry.label === label)?.price;

  const scenario = (title: string, rates: { lift: number; rental: number }, note?: string): TripExample => {
    const build = (liftPrice: number | undefined, equipmentPrice: number | undefined) =>
      liftPrice === undefined || equipmentPrice === undefined
        ? undefined
        : (() => {
            const l = discountedPrice(liftPrice, rates.lift);
            const e = discountedPrice(equipmentPrice, rates.rental);
            return { lift: l, equipment: e, clothing, total: l + e + clothing };
          })();
    return { title, note, weekday: build(lift.cells.weekday?.price, priceOf("주중")), weekend: build(lift.cells.weekend?.price, priceOf("주말")) };
  };

  const picks = guide.discounts.filter((discount) => discount.group === "anyone" && discount.rates.lift && discount.rates.rental && discount.highlight);
  return [scenario("정상가", { lift: 0, rental: 0 }), ...picks.map((discount) => scenario(discount.title, { lift: discount.rates.lift!, rental: discount.rates.rental! }))];
}
