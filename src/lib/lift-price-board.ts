import { priceRules } from "@/data/prices";
import { getResortLiftGuide, type DiscountRates, type LiftDiscount, type RentalGuideItem, type ResortLiftGuide } from "@/data/lift-discounts";
import { CURRENT_SEASON, UPCOMING_SEASON, timeSlotLabels } from "@/lib/constants";
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

/** 정상가에서 할인율(%)만큼 뺀 금액. roundTo원 단위로 반올림한다(기본 1원). */
export function discountedPrice(price: number, ratePercent: number, roundTo = 1) {
  return Math.round((price * (1 - ratePercent / 100)) / roundTo) * roundTo;
}

export type PeriodBlock<Row> = { label?: string; range?: string; rows: Row[] };

export type DiscountCard = {
  discount: LiftDiscount;
  /** 기간별 할인율이 없으면 블록 하나, 있으면 기간마다 블록 하나 */
  periods: PeriodBlock<{ slot: TimeSlot; weekday?: number; weekend?: number; single?: number }>[];
};

/** 할인율이 기간별로 다른 가이드면 기간 이름과 그 기간 할인율을, 아니면 하나짜리 기간을 돌려준다. */
function periodRates(guide: ResortLiftGuide, discount: LiftDiscount) {
  if (!guide.periods || !discount.altRates) return [{ label: undefined, range: undefined, rates: discount.rates }];
  return [
    { label: guide.periods[0].label, range: guide.periods[0].range, rates: discount.rates },
    { label: guide.periods[1].label, range: guide.periods[1].range, rates: discount.altRates }
  ];
}

/** 리프트권 할인율이 있고 가격표 카드로 보여 줄 할인을 시간권별 할인가로 계산한다. */
export function buildDiscountCards(board: LiftPriceBoard, guide: ResortLiftGuide): DiscountCard[] {
  return guide.discounts
    .filter((discount) => discount.highlight && discount.rates.lift)
    .map((discount) => ({
      discount,
      periods: periodRates(guide, discount).map(({ label, range, rates }) => {
        const rate = rates.lift ?? 0;
        const weekendRate = rates.weekend?.lift;
        const rows = board.rows.flatMap<PeriodBlock<DiscountCard["periods"][number]["rows"][number]>["rows"][number]>((row) => {
          const weekday = row.cells.weekday?.price;
          const weekend = row.cells.weekend?.price;
          const single = row.cells.all?.price;
          if (weekday === undefined && weekend === undefined && single === undefined) return [];
          return [{
            slot: row.slot,
            weekday: weekday === undefined ? undefined : discountedPrice(weekday, rate, guide.roundTo),
            weekend: discount.weekdayOnly || weekend === undefined ? undefined : discountedPrice(weekend, rate, guide.roundTo),
            single: single === undefined || discount.weekdayOnly || weekendRate !== undefined ? undefined : discountedPrice(single, rate, guide.roundTo)
          }].map((entry) => single !== undefined && weekendRate !== undefined && !discount.weekdayOnly ? { ...entry, weekday: discountedPrice(single, rate, guide.roundTo), weekend: discountedPrice(single, weekendRate, guide.roundTo) } : entry);
        });
        return { label, range, rows };
      })
    }));
}

export function getLiftGuideForBoard(resortId: string, board: LiftPriceBoard) {
  const guide = getResortLiftGuide(resortId);
  return guide && guide.season === board.season ? guide : undefined;
}

/** 가이드가 정한 이름으로 시간권을 부른다. */
export function slotLabelFor(guide: ResortLiftGuide | undefined, slot: TimeSlot) {
  return guide?.slotLabels?.[slot] ?? timeSlotLabels[slot];
}

function discountedItemPrices(item: RentalGuideItem, rates: DiscountRates, roundTo?: number) {
  const base = rates.rental ?? 0;
  const weekend = rates.weekend?.rental;
  if (weekend === undefined || weekend === base) return item.prices.map((entry) => ({ label: entry.label, price: discountedPrice(entry.price, base, roundTo) }));
  // 주중·주말 할인율이 다르면 주중·주말 할인가를 따로 보여 준다.
  const single = item.prices.length === 1;
  return item.prices.flatMap((entry) => [
    { label: single ? "주중" : `주중 ${entry.label}`, price: discountedPrice(entry.price, base, roundTo) },
    { label: single ? "주말" : `주말 ${entry.label}`, price: discountedPrice(entry.price, weekend, roundTo) }
  ]);
}

export type RentalDiscountCard = {
  discount: LiftDiscount;
  periods: PeriodBlock<{ item: RentalGuideItem; prices: { label: string; price: number }[] }>[];
};

/** 장비 렌탈 할인율이 있는 '누구나' 할인을 할인받을 수 있는 품목별 할인가로 계산한다. */
export function buildRentalDiscountCards(guide: ResortLiftGuide): RentalDiscountCard[] {
  const rental = guide.rental;
  if (!rental) return [];
  const items = rental.equipment.filter((item) => item.discountable && (!rental.discountCardItemIds || rental.discountCardItemIds.includes(item.id)));
  return guide.discounts
    .filter((discount) => discount.group === "anyone" && discount.rates.rental)
    .map((discount) => ({
      discount,
      periods: periodRates(guide, discount).map(({ label, range, rates }) => ({
        label,
        range,
        rows: items.map((item) => ({ item, prices: discountedItemPrices(item, rates, guide.roundTo) }))
      }))
    }));
}

export type TripExampleCell = { lift: number; equipment: number; clothing?: number; total: number };
export type TripExample = { title: string; weekday?: TripExampleCell; weekend?: TripExampleCell; all?: TripExampleCell };

/** 리프트권 + 장비(+의류)를 한 번에 빌릴 때 1인 비용. 구성은 가이드 데이터의 example이 정한다. 의류는 할인하지 않는다. */
export function buildTripExamples(board: LiftPriceBoard, guide: ResortLiftGuide): TripExample[] {
  const rental = guide.rental;
  const config = rental?.example;
  if (!rental || !config) return [];
  const lift = board.rows.find((row) => row.slot === config.liftSlot);
  const equipment = rental.equipment.find((item) => item.id === config.equipmentId);
  const clothingItem = config.clothingId ? rental.clothing.find((item) => item.id === config.clothingId) : undefined;
  const clothing = clothingItem ? (config.clothingPriceLabel ? clothingItem.prices.find((entry) => entry.label === config.clothingPriceLabel) : clothingItem.prices[0])?.price : undefined;
  if (!lift || !equipment || (config.clothingId && clothing === undefined)) return [];
  const labels = { weekday: config.equipmentPriceLabels?.weekday ?? "주중", weekend: config.equipmentPriceLabels?.weekend ?? "주말", all: config.equipmentPriceLabels?.all ?? "전체" };
  const priceOf = (label: string) => equipment.prices.find((entry) => entry.label === label)?.price;

  const scenario = (title: string, rates: { lift: number; rental: number }, weekendRates?: { lift: number; rental: number }): TripExample => {
    const build = (liftPrice: number | undefined, equipmentPrice: number | undefined, useRates = rates): TripExampleCell | undefined => {
      if (liftPrice === undefined || equipmentPrice === undefined) return undefined;
      const l = discountedPrice(liftPrice, useRates.lift, guide.roundTo);
      const e = discountedPrice(equipmentPrice, useRates.rental, guide.roundTo);
      return { lift: l, equipment: e, clothing, total: l + e + (clothing ?? 0) };
    };
    if (weekendRates && lift.cells.all) {
      const equipmentPrice = priceOf(labels.all);
      const weekendCell = build(lift.cells.all.price, equipmentPrice, weekendRates);
      return { title, weekday: build(lift.cells.all.price, equipmentPrice), weekend: weekendCell };
    }
    return {
      title,
      weekday: build(lift.cells.weekday?.price, priceOf(labels.weekday)),
      weekend: build(lift.cells.weekend?.price, priceOf(labels.weekend)),
      all: build(lift.cells.all?.price, priceOf(labels.all))
    };
  };

  const picks = guide.discounts.filter((discount) => discount.group === "anyone" && discount.rates.lift && discount.rates.rental && discount.highlight);
  const scenarios = picks.flatMap((discount) => periodRates(guide, discount).map(({ label, rates }) => scenario(
    label ? `${discount.title} · ${label}` : discount.title,
    { lift: rates.lift ?? 0, rental: rates.rental ?? 0 },
    rates.weekend ? { lift: rates.weekend.lift ?? rates.lift ?? 0, rental: rates.weekend.rental ?? rates.rental ?? 0 } : undefined
  )));
  return [scenario("정상가", { lift: 0, rental: 0 }), ...scenarios];
}
