import { resolveLiftPrice } from "@/lib/pricing";
import { ruleForDate } from "@/lib/season-fallback";
import { optionAppliesToDay, type SkiDayPlan } from "@/lib/trip-ski-plan";
import type { PriceConfidence, RentalPriceRule, RentalShop, RideType } from "@/lib/types";

export type ComparisonGroup = { shop: RentalShop; options: RentalPriceRule[] };
export type ComparisonDay = Pick<SkiDayPlan, "date" | "timeSlot">;
export type OfficialLiftResolver = (timeSlot: SkiDayPlan["timeSlot"], date: string) => { price: number; confidence: PriceConfidence; reference: boolean } | null;

export type ComparisonContext = {
  rideType: RideType;
  needsEquipment: boolean;
  needsClothing: boolean;
  // 공식 리조트 리프트권 1인 가격. 기본값은 요금표(resolveLiftPrice)이고, 테스트에서는 바꿔 끼운다.
  officialLift?: OfficialLiftResolver;
};

export type MissingPart = "lift" | "equipment" | "clothing";

// 한 샵에서 한 날짜를 가장 싸게 채웠을 때의 기본 구성과 1인 금액.
export type ShopDayPick = {
  date: string;
  equipmentOptionId: string | null;
  clothingOptionId: string | null;
  packageOptionId: string | null;
  // 렌탈샵 할인권을 쓸 때만 값이 있고, 공식권이 더 싸거나 같으면 null.
  liftTicketOptionId: string | null;
  lift: number | null;
  liftSource: "shop" | "official" | null;
  rental: number | null;
  // 렌탈 내역(1인). 쓰지 않은 항목은 0, 가격을 알 수 없으면 rental과 함께 null이다.
  equipment: number;
  clothing: number;
  bundle: number;
  missing: MissingPart[];
  confidence: PriceConfidence;
  reference: boolean;
};

export type ShopSavings = {
  perPerson: number;
  total: number;
  // 공식 구성 대비 비율(%). 음수면 공식보다 비싸다.
  rate: number | null;
  basis: "all" | "lift_only" | "rental_only";
};

export type ShopComparison = {
  shopId: string;
  isOfficial: boolean;
  complete: boolean;
  missing: MissingPart[];
  picks: ShopDayPick[];
  lift: number | null;
  rental: number | null;
  // 모든 날짜 합산 렌탈 내역(1인).
  equipment: number;
  clothing: number;
  bundle: number;
  perPerson: number | null;
  total: number | null;
  savings: ShopSavings | null;
  usesShopLift: boolean;
  confidence: PriceConfidence;
  reference: boolean;
};

export type ComparisonBaseline = { lift: number | null; rental: number | null; perPerson: number | null; shopId: string | null };

export function isOfficialRentalShop(shop: Pick<RentalShop, "id">) {
  return shop.id.endsWith("official-rental");
}

const priceOf = (option: RentalPriceRule) => option.representativePrice ?? option.priceMin ?? 0;

const confidenceRank: Record<PriceConfidence, number> = { confirmed: 0, phone_confirmed: 1, estimated: 2, unavailable: 3 };
const worst = (values: PriceConfidence[]) => values.reduce<PriceConfidence>((current, value) => confidenceRank[value] > confidenceRank[current] ? value : current, "confirmed");

function defaultOfficialLift(resortId: string): OfficialLiftResolver {
  return (timeSlot, date) => {
    const rule = resolveLiftPrice(resortId, timeSlot, date);
    if (!rule || rule.confidence === "unavailable") return null;
    const price = "adultPrice" in rule ? rule.adultPrice ?? rule.priceMin : rule.priceMin;
    return price ? { price, confidence: rule.confidence, reference: rule.referenceSeason !== undefined } : null;
  };
}

function rideTypeMatches(option: RentalPriceRule, rideType: RideType) {
  return !option.rideType || option.rideType === "all" || rideType === "both" || option.rideType === rideType;
}

const cheapest = (options: RentalPriceRule[]) => options.filter(option => priceOf(option) > 0).sort((left, right) => priceOf(left) - priceOf(right))[0];

// 샵 하나가 한 날짜에 가장 싸게 채우는 기본 구성(장비·의류 또는 패키지, 리프트권)을 고른다.
export function pickShopDay(group: ComparisonGroup, day: ComparisonDay, context: ComparisonContext): ShopDayPick {
  const official = (context.officialLift ?? defaultOfficialLift(group.shop.resortId))(day.timeSlot, day.date);
  const applicable = group.options
    .filter(option => option.ageGroup !== "child" && optionAppliesToDay(option, day))
    .map(option => ruleForDate(option, day.date));
  const missing: MissingPart[] = [];
  const confidences: PriceConfidence[] = [];
  let reference = false;
  const track = (option: RentalPriceRule) => { confidences.push(option.confidence); if (option.referenceSeason !== undefined) reference = true; };

  const equipment = cheapest(applicable.filter(option => option.itemType === "equipment" && rideTypeMatches(option, context.rideType)));
  const clothing = cheapest(applicable.filter(option => option.itemType === "clothing"));
  const bundle = cheapest(applicable.filter(option => option.itemType === "equipment_clothing_package"));

  let equipmentOptionId: string | null = null;
  let clothingOptionId: string | null = null;
  let packageOptionId: string | null = null;
  let rental: number | null = 0;
  let equipmentPrice = 0;
  let clothingPrice = 0;
  let bundlePrice = 0;
  if (context.needsEquipment && context.needsClothing) {
    const separate = equipment && clothing ? priceOf(equipment) + priceOf(clothing) : null;
    const bundled = bundle ? priceOf(bundle) : null;
    if (bundled !== null && (separate === null || bundled <= separate)) {
      packageOptionId = bundle!.id; rental = bundled; bundlePrice = bundled; track(bundle!);
    } else if (separate !== null) {
      equipmentOptionId = equipment!.id; clothingOptionId = clothing!.id; rental = separate; equipmentPrice = priceOf(equipment!); clothingPrice = priceOf(clothing!); track(equipment!); track(clothing!);
    } else {
      rental = null;
      if (!equipment) missing.push("equipment");
      if (!clothing) missing.push("clothing");
    }
  } else if (context.needsEquipment) {
    if (equipment) { equipmentOptionId = equipment.id; rental = priceOf(equipment); equipmentPrice = rental; track(equipment); } else { rental = null; missing.push("equipment"); }
  } else if (context.needsClothing) {
    if (clothing) { clothingOptionId = clothing.id; rental = priceOf(clothing); clothingPrice = rental; track(clothing); } else { rental = null; missing.push("clothing"); }
  }

  const discount = cheapest(applicable.filter(option => option.itemType === "lift_ticket"));
  let lift: number | null = null;
  let liftSource: ShopDayPick["liftSource"] = null;
  let liftTicketOptionId: string | null = null;
  if (discount && (!official || priceOf(discount) < official.price)) {
    lift = priceOf(discount); liftSource = "shop"; liftTicketOptionId = discount.id; track(discount);
  } else if (official) {
    lift = official.price; liftSource = "official"; confidences.push(official.confidence); if (official.reference) reference = true;
  } else {
    missing.push("lift");
  }

  return { date: day.date, equipmentOptionId, clothingOptionId, packageOptionId, liftTicketOptionId, lift, liftSource, rental, equipment: equipmentPrice, clothing: clothingPrice, bundle: bundlePrice, missing, confidence: confidences.length ? worst(confidences) : "unavailable", reference };
}

function sumOrNull(values: Array<number | null>) {
  return values.some(value => value === null) ? null : values.reduce<number>((sum, value) => sum + (value ?? 0), 0);
}

function savingsFor(result: Pick<ShopComparison, "lift" | "rental">, baseline: ComparisonBaseline, context: ComparisonContext, people: number): ShopSavings | null {
  const rentalNeeded = context.needsEquipment || context.needsClothing;
  const liftComparable = result.lift !== null && baseline.lift !== null;
  const rentalComparable = rentalNeeded && result.rental !== null && baseline.rental !== null;
  if (!liftComparable && !rentalComparable) return null;
  const saved = (liftComparable ? baseline.lift! - result.lift! : 0) + (rentalComparable ? baseline.rental! - result.rental! : 0);
  const base = (liftComparable ? baseline.lift! : 0) + (rentalComparable ? baseline.rental! : 0);
  return {
    perPerson: saved,
    total: saved * people,
    rate: base > 0 ? Math.round((saved / base) * 100) : null,
    basis: liftComparable ? (rentalComparable ? "all" : "lift_only") : "rental_only"
  };
}

// 모든 스키 날짜를 합산해 샵마다 "리프트권 + 장비·의류" 총액과, 공식 리프트권·공식 렌탈 구성 대비 절약액을 구한다.
export function compareRentalShops(groups: ComparisonGroup[], days: ComparisonDay[], peopleCount: number, context: ComparisonContext) {
  const people = Math.max(1, peopleCount);
  const resortId = groups[0]?.shop.resortId ?? "";
  const resolver = context.officialLift ?? defaultOfficialLift(resortId);
  const ctx: ComparisonContext = { ...context, officialLift: resolver };

  const officialGroup = groups.find(({ shop }) => isOfficialRentalShop(shop));
  const officialRental = officialGroup ? sumOrNull(days.map(day => pickShopDay(officialGroup, day, ctx).rental)) : null;
  const baselineLift = sumOrNull(days.map(day => resolver(day.timeSlot, day.date)?.price ?? null));
  const baselineRental = context.needsEquipment || context.needsClothing ? officialRental : 0;
  const baseline: ComparisonBaseline = {
    lift: baselineLift,
    rental: baselineRental,
    perPerson: baselineLift !== null && baselineRental !== null ? baselineLift + baselineRental : null,
    shopId: officialGroup?.shop.id ?? null
  };

  const results = groups.map((group): ShopComparison => {
    const picks = days.map(day => pickShopDay(group, day, ctx));
    const missing = [...new Set(picks.flatMap(pick => pick.missing))];
    const lift = sumOrNull(picks.map(pick => pick.lift));
    const rental = sumOrNull(picks.map(pick => pick.rental));
    const complete = days.length > 0 && missing.length === 0 && lift !== null && rental !== null;
    const perPerson = complete ? lift! + rental! : null;
    return {
      shopId: group.shop.id,
      isOfficial: isOfficialRentalShop(group.shop),
      complete,
      missing,
      picks,
      lift,
      rental,
      equipment: picks.reduce((sum, pick) => sum + pick.equipment, 0),
      clothing: picks.reduce((sum, pick) => sum + pick.clothing, 0),
      bundle: picks.reduce((sum, pick) => sum + pick.bundle, 0),
      perPerson,
      total: perPerson === null ? null : perPerson * people,
      savings: complete ? savingsFor({ lift, rental }, baseline, ctx, people) : null,
      usesShopLift: picks.some(pick => pick.liftSource === "shop"),
      confidence: worst(picks.map(pick => pick.confidence)),
      reference: picks.some(pick => pick.reference)
    };
  });

  results.sort((left, right) => {
    if (left.complete !== right.complete) return Number(right.complete) - Number(left.complete);
    if (left.complete) return (right.savings?.perPerson ?? -Infinity) - (left.savings?.perPerson ?? -Infinity) || (left.perPerson ?? 0) - (right.perPerson ?? 0);
    return 0;
  });
  return { baseline, results };
}
