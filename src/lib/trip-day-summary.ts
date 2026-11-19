import { timeSlotLabels } from "@/lib/constants";
import { resolveLiftPrice } from "@/lib/pricing";
import { ruleForDate } from "@/lib/season-fallback";
import { optionAppliesToDay, rentalOptionIds, tripDayTypeLabel, type SkiDayPlan, type TripSkiPlan } from "@/lib/trip-ski-plan";
import type { PriceConfidence, RentalPriceRule, RentalShop } from "@/lib/types";

export type DaySummaryLineKind = "lift" | "package" | "equipment" | "clothing" | "accessory";

export type DaySummaryLine = {
  kind: DaySummaryLineKind;
  label: string;
  // 1인 기준 금액. 가격을 알 수 없으면 null.
  perPerson: number | null;
  // 렌탈샵 상품이면 샵 이름, 공식 리프트권이면 "공식".
  source: string;
  reference: boolean;
  confidence: PriceConfidence;
};

export type DayRentalState = "items" | "shop_only" | "none";

export type DaySummary = {
  date: string;
  dayTypeLabel: string;
  timeSlotLabel: string;
  shopId: string | null;
  shopName: string | null;
  rentalState: DayRentalState;
  lines: DaySummaryLine[];
  perPersonTotal: number;
  total: number;
  hasUnknownPrice: boolean;
  hasReference: boolean;
};

type RentalGroup = { shop: Pick<RentalShop, "id" | "name">; options: RentalPriceRule[] };

// 날짜별로 렌탈샵·장비·의류·리프트권 선택과 1인 금액을 모아 화면에 보여 준다. 금액 계산은 estimateTripCost와 같은 규칙을 쓴다.
export function buildDaySummaries(resortId: string, plan: TripSkiPlan, groups: RentalGroup[], peopleCount: number): DaySummary[] {
  const people = Math.max(1, peopleCount);
  const optionById = new Map(groups.flatMap(group => group.options.map(option => [option.id, { option, shopName: group.shop.name }] as const)));
  const shopNameById = new Map(groups.map(group => [group.shop.id, group.shop.name]));

  return plan.days.map(day => {
    const lines: DaySummaryLine[] = [];
    const optionIds = rentalOptionIds(day);

    const addOption = (id: string | null, kind: DaySummaryLineKind) => {
      if (!id) return;
      const found = optionById.get(id);
      if (!found || found.option.itemType === "lift_ticket" || !optionAppliesToDay(found.option, day)) {
        lines.push({ kind, label: "선택한 상품", perPerson: null, source: found?.shopName ?? "", reference: false, confidence: "unavailable" });
        return;
      }
      const rule = ruleForDate(found.option, day.date);
      lines.push({ kind, label: rule.label, perPerson: rule.representativePrice ?? null, source: found.shopName, reference: rule.referenceSeason !== undefined, confidence: rule.confidence });
    };
    addOption(day.packageOptionId, "package");
    addOption(day.equipmentOptionId, "equipment");
    addOption(day.clothingOptionId, "clothing");
    for (const id of day.accessoryOptionIds) addOption(id, "accessory");

    lines.push(liftLine(resortId, day, optionById));

    const prices = lines.map(line => line.perPerson).filter((value): value is number => value !== null);
    const perPersonTotal = prices.reduce((sum, value) => sum + value, 0);
    const rentalState: DayRentalState = optionIds.length ? "items" : day.rentalShopId ? "shop_only" : "none";

    return {
      date: day.date,
      dayTypeLabel: tripDayTypeLabel(day.date),
      timeSlotLabel: timeSlotLabels[day.timeSlot],
      shopId: day.rentalShopId,
      shopName: day.rentalShopId ? shopNameById.get(day.rentalShopId) ?? null : null,
      rentalState,
      lines,
      perPersonTotal,
      total: perPersonTotal * people,
      hasUnknownPrice: lines.some(line => line.perPerson === null),
      hasReference: lines.some(line => line.reference)
    };
  });
}

function liftLine(resortId: string, day: SkiDayPlan, optionById: Map<string, { option: RentalPriceRule; shopName: string }>): DaySummaryLine {
  const discounted = day.liftTicketOptionId ? optionById.get(day.liftTicketOptionId) : undefined;
  if (discounted && discounted.option.itemType === "lift_ticket" && optionAppliesToDay(discounted.option, day)) {
    const rule = ruleForDate(discounted.option, day.date);
    return { kind: "lift", label: `할인 리프트권 · ${rule.label}`, perPerson: rule.representativePrice ?? rule.priceMin ?? null, source: discounted.shopName, reference: rule.referenceSeason !== undefined, confidence: rule.confidence };
  }
  const official = resolveLiftPrice(resortId, day.timeSlot, day.date);
  if (!official) {
    return { kind: "lift", label: `공식 ${timeSlotLabels[day.timeSlot]}`, perPerson: null, source: "공식", reference: false, confidence: "unavailable" };
  }
  return { kind: "lift", label: `공식 ${timeSlotLabels[day.timeSlot]}`, perPerson: official.adultPrice ?? official.priceMin ?? null, source: "공식", reference: official.referenceSeason !== undefined, confidence: official.confidence };
}
