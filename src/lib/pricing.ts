import { departureLocations, getRentalShopsForResort } from "@/data/resorts";
import { priceRules, rentalPriceRules } from "@/data/prices";
import { getSkiShuttleRoutes } from "@/data/ski-shuttles";
import type {
  CostEstimate,
  CostItem,
  DayType,
  PriceConfidence,
  PriceRule,
  RentalPriceRule,
  SkiShuttleRoute,
  SkiResort,
  TimeSlot,
  TripInput
} from "@/lib/types";
import { optionAppliesToDay, rentalOptionIds, type TripSkiPlan } from "@/lib/trip-ski-plan";
import { normalizeTransportType } from "@/lib/transport";

function appendToIndex<T>(index: Map<string, T[]>, key: string, value: T) {
  const values = index.get(key);
  if (values) values.push(value);
  else index.set(key, [value]);
}

const liftRulesByResort = new Map<string, PriceRule[]>();
for (const rule of priceRules) {
  if (rule.itemType === "lift_ticket") appendToIndex(liftRulesByResort, rule.resortId, rule);
}

const rentalRulesByResort = new Map<string, RentalPriceRule[]>();
const rentalRulesByResortAndType = new Map<string, Map<RentalPriceRule["itemType"], RentalPriceRule[]>>();
const rentalRulesByShop = new Map<string, RentalPriceRule[]>();
for (const rule of rentalPriceRules) {
  appendToIndex(rentalRulesByResort, rule.resortId, rule);
  if (rule.rentalShopId) appendToIndex(rentalRulesByShop, rule.rentalShopId, rule);

  let rulesByType = rentalRulesByResortAndType.get(rule.resortId);
  if (!rulesByType) {
    rulesByType = new Map();
    rentalRulesByResortAndType.set(rule.resortId, rulesByType);
  }
  const rules = rulesByType.get(rule.itemType);
  if (rules) rules.push(rule);
  else rulesByType.set(rule.itemType, [rule]);
}

function combineConfidence(items: CostItem[]): PriceConfidence {
  if (items.some((item) => item.confidence === "unavailable")) return "unavailable";
  if (items.some((item) => item.confidence === "estimated")) return "estimated";
  if (items.some((item) => item.confidence === "phone_confirmed")) return "phone_confirmed";
  return "confirmed";
}

function getVisitDayType(visitDate: string): DayType {
  const date = new Date(`${visitDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "all";
  const day = date.getDay();
  if (day === 5) return "friday";
  if (day === 0 || day === 6) return "weekend";
  return "weekday";
}

function dayTypeScore(ruleDayType: DayType, visitDayType: DayType) {
  if (ruleDayType === visitDayType) return 4;
  if (visitDayType === "friday" && ruleDayType === "weekday") return 3;
  if (ruleDayType === "all") return 1;
  return 0;
}

export function resolveLiftPrice(resortId: string, timeSlot: TimeSlot, visitDate: string) {
  const visitDayType = getVisitDayType(visitDate);
  let bestRule: PriceRule | undefined;
  let bestScore = 0;

  for (const rule of liftRulesByResort.get(resortId) ?? []) {
    if (
      rule.validFrom > visitDate ||
      rule.validTo < visitDate ||
      (rule.timeSlot !== timeSlot && rule.timeSlot !== "all")
    ) continue;

    const score = dayTypeScore(rule.dayType, visitDayType);
    if (score > bestScore) {
      bestRule = rule;
      bestScore = score;
    }
  }

  return bestRule;
}

function resolveRentalPrice(
  resortId: string,
  input: TripInput,
  selectedRentalOptionId?: string,
  strictDate = true
): RentalPriceRule | undefined {
  const resortRules = rentalRulesByResort.get(resortId) ?? [];
  if (selectedRentalOptionId) {
    const selected = resortRules.find(
      (rule) => rule.id === selectedRentalOptionId && rule.resortId === resortId && rule.itemType !== "lift_ticket"
    );
    return selected && (!strictDate || optionAppliesToDay(selected, {
      date: input.visitDate,
      timeSlot: input.liftTicketTimeSlot
    })) ? selected : undefined;
  }

  const needEquipment = !input.ownsEquipment || input.priorities.includes("rental");
  const needClothing = !input.ownsClothing;
  const itemType =
    needEquipment && needClothing
      ? "equipment_clothing_package"
      : needEquipment
        ? "equipment"
        : needClothing
          ? "clothing"
          : undefined;

  if (!itemType) return undefined;

  const candidates = rentalRulesByResortAndType.get(resortId)?.get(itemType) ?? [];
  let cheapest: RentalPriceRule | undefined;
  let cheapestPrice = Number.POSITIVE_INFINITY;
  let cheapestDated: RentalPriceRule | undefined;
  let cheapestDatedPrice = Number.POSITIVE_INFINITY;

  for (const rule of candidates) {
    if (itemType === "equipment" && input.rideType !== "both" && rule.rideType !== input.rideType) continue;

    const price = rule.representativePrice ?? 999999;
    if (!cheapest || price < cheapestPrice) {
      cheapest = rule;
      cheapestPrice = price;
    }
    if (
      optionAppliesToDay(rule, { date: input.visitDate, timeSlot: input.liftTicketTimeSlot }) &&
      (!cheapestDated || price < cheapestDatedPrice)
    ) {
      cheapestDated = rule;
      cheapestDatedPrice = price;
    }
  }

  return cheapestDated ?? (strictDate ? undefined : cheapest);
}

export function liftTicketSavings(option: RentalPriceRule, visitDate: string) {
  if (option.itemType !== "lift_ticket" || !option.timeSlot || !option.representativePrice) return null;
  if (!optionAppliesToDay(option, { date: visitDate, timeSlot: option.timeSlot })) return null;
  const official = resolveLiftPrice(option.resortId, option.timeSlot, visitDate);
  const officialPrice = official?.adultPrice ?? official?.priceMin;
  if (!officialPrice || officialPrice <= option.representativePrice) return null;
  const savedPerPerson = officialPrice - option.representativePrice;
  return {
    officialPrice,
    shopPrice: option.representativePrice,
    savedPerPerson,
    discountRate: Math.round(savedPerPerson / officialPrice * 100)
  };
}

export function estimateTransportCost(resort: SkiResort, input: TripInput, shuttleRoute?: SkiShuttleRoute): CostItem {
  const transportType = normalizeTransportType(input.transportType);
  if (transportType === "public_transit" && shuttleRoute?.fare) {
    const fare = shuttleRoute.fare;
    const perPerson = fare.roundTripAdult ?? (fare.oneWayAdult !== undefined ? fare.oneWayAdult * 2 : fare.seasonPassAdult);
    if (perPerson !== undefined) {
      const total = perPerson * input.peopleCount;
      const isSeasonPass = fare.roundTripAdult === undefined && fare.seasonPassAdult !== undefined;
      return { key: "transport", label: isSeasonPass ? "셔틀 교통시즌권" : fare.type === "free" ? "무료 셔틀" : "셔틀 왕복 비용", representative: total, min: total, max: total, confidence: "confirmed", sourceName: shuttleRoute.operator, sourceUrl: shuttleRoute.sourceUrl, bookingUrl: shuttleRoute.bookingUrl, lastCheckedAt: shuttleRoute.lastCheckedAt, note: fare.note ?? `${shuttleRoute.name} · ${isSeasonPass ? "1인 시즌권" : fare.roundTripAdult !== undefined ? "1인 왕복" : "1인 편도 2회"} 기준` };
    }
  }

  if (transportType === "public_transit") {
    const onePerson = 22000;
    const total = onePerson * input.peopleCount;
    return {
      key: "transport",
      label: "대중교통 예상 비용",
      representative: total,
      min: total,
      max: Math.round(total * 1.15),
      confidence: "estimated",
      note: "버스·기차·제휴 셔틀의 실제 요금은 노선과 예약처에서 확인해 주세요."
    };
  }

  const departure = departureLocations.find((location) => location.id === input.departureLocation);
  const distance = departure?.distances[resort.id];
  if (!distance) {
    return {
      key: "transport",
      label: "교통비",
      confidence: "unavailable",
      note: "출발지 기준 거리 정보가 없습니다."
    };
  }

  const fuelEfficiency = 11;
  const fuelPrice = 1700;
  const toll = distance.km > 120 ? 18000 : distance.km > 80 ? 12000 : 7000;
  const cost = Math.round(((distance.km * 2) / fuelEfficiency) * fuelPrice + toll);
  return {
    key: "transport",
    label: "자차 예상 교통비",
    representative: cost,
    min: Math.round(cost * 0.9),
    max: Math.round(cost * 1.15),
    confidence: "estimated",
    note: "왕복거리, 평균 연비, 유가, 통행료 추정 기준"
  };
}

export function estimateTransportPlanCost(resort: SkiResort, input: TripInput, plan: TripSkiPlan): CostItem {
  const [outbound, returning] = plan.transportLegs;
  if (!outbound || !returning) return estimateTransportCost(resort, input);
  const outboundType = normalizeTransportType(outbound.transportType);
  const returningType = normalizeTransportType(returning.transportType);
  if (outboundType === "public_transit" && returningType === "public_transit") {
    const routes = getSkiShuttleRoutes(resort.id);
    const outboundRoute = routes.find(item => item.id === outbound.shuttleRouteId);
    const returnRoute = routes.find(item => item.id === returning.shuttleRouteId);
    const seasonPassAdult = outboundRoute?.fare?.seasonPassAdult;
    if (outboundRoute && returnRoute && seasonPassAdult !== undefined && returnRoute.fare?.seasonPassAdult === seasonPassAdult && returnRoute.operator === outboundRoute.operator && returnRoute.sourceUrl === outboundRoute.sourceUrl) {
      const total = seasonPassAdult * input.peopleCount;
      return { key: "transport", label: "셔틀 교통시즌권", representative: total, min: total, max: total, confidence: "confirmed", sourceName: outboundRoute.operator, sourceUrl: outboundRoute.sourceUrl, bookingUrl: outboundRoute.bookingUrl, lastCheckedAt: outboundRoute.lastCheckedAt, note: `${outboundRoute.operator} 동일 교통시즌권으로 선택한 가는 편·오는 편 이용` };
    }
    const roundTripAdult = outboundRoute?.fare?.roundTripAdult;
    const hasLegOrStopFare = Boolean(
      outboundRoute?.stops.some(stop => stop.oneWayFareAdult !== undefined || stop.roundTripFareAdult !== undefined) ||
      returnRoute?.stops.some(stop => stop.oneWayFareAdult !== undefined || stop.roundTripFareAdult !== undefined)
    );
    if (outboundRoute && returnRoute && !hasLegOrStopFare && roundTripAdult !== undefined && returnRoute.fare?.roundTripAdult === roundTripAdult && returnRoute.operator === outboundRoute.operator && returnRoute.sourceUrl === outboundRoute.sourceUrl) {
      const total = roundTripAdult * input.peopleCount;
      return { key: "transport", label: roundTripAdult === 0 ? "무료 셔틀" : "셔틀 왕복 비용", representative: total, min: total, max: total, confidence: "confirmed", sourceName: outboundRoute.operator, sourceUrl: outboundRoute.sourceUrl, bookingUrl: outboundRoute.bookingUrl, lastCheckedAt: outboundRoute.lastCheckedAt, note: `${outboundRoute.operator} 동일 왕복 상품으로 선택한 가는 편·오는 편 이용` };
    }
  }
  if (outboundType === returningType) {
    const route = outboundType === "public_transit" && outbound.shuttleRouteId === returning.shuttleRouteId
      ? getSkiShuttleRoutes(resort.id).find(item => item.id === outbound.shuttleRouteId)
      : undefined;
    const sharedStop = route && outbound.shuttleStopId && outbound.shuttleStopId === returning.shuttleStopId
      ? route.stops.find(stop => stop.id === outbound.shuttleStopId)
      : undefined;
    if (route && sharedStop?.roundTripFareAdult !== undefined) {
      const total = sharedStop.roundTripFareAdult * input.peopleCount;
      return { key: "transport", label: "셔틀 왕복 비용", representative: total, min: total, max: total, confidence: "confirmed", sourceName: route.operator, sourceUrl: route.sourceUrl, bookingUrl: route.bookingUrl, lastCheckedAt: route.lastCheckedAt, note: `${sharedStop.name} 왕복 기준` };
    }
    if (outboundType !== "public_transit" || route || (!outbound.shuttleRouteId && !returning.shuttleRouteId)) {
      const hasDifferentPricedStops = Boolean(route && (outbound.shuttleStopId !== returning.shuttleStopId || sharedStop?.oneWayFareAdult !== undefined));
      if (!hasDifferentPricedStops) return estimateTransportCost(resort, { ...input, transportType: outboundType }, route);
    }
  }

  const items = plan.transportLegs.map(leg => estimateTransportLegCost(resort, input, leg));
  const aggregate = aggregatePlanItems("transport", "가는 길·돌아오는 길 교통비", items);
  return { ...aggregate, note: "가는 길과 돌아오는 길에 저장한 이동수단·셔틀 요금을 구간별로 합산했습니다." };
}

function estimateTransportLegCost(resort: SkiResort, input: TripInput, leg: TripSkiPlan["transportLegs"][number]): CostItem {
  const transportType = normalizeTransportType(leg.transportType);
  if (transportType === "public_transit" && leg.shuttleRouteId) {
    const route = getSkiShuttleRoutes(resort.id).find(item => item.id === leg.shuttleRouteId);
    const fare = route?.fare;
    if (route && fare) {
      const stop = route.stops.find(item => item.id === leg.shuttleStopId);
      const oneWay = stop?.oneWayFareAdult ?? fare.oneWayAdult ?? (fare.roundTripAdult !== undefined ? Math.round(fare.roundTripAdult / 2) : fare.type === "free" ? 0 : undefined);
      if (oneWay !== undefined) {
        const total = oneWay * input.peopleCount;
        return { key: `transport:${leg.direction}`, label: `${leg.date} · ${route.name}`, representative: total, min: total, max: total, confidence: stop?.oneWayFareAdult !== undefined || fare.oneWayAdult !== undefined || fare.type === "free" ? "confirmed" : "estimated", sourceName: route.operator, sourceUrl: route.sourceUrl, bookingUrl: route.bookingUrl };
      }
    }
  }
  const roundTrip = estimateTransportCost(resort, { ...input, transportType });
  const half = (value?: number) => value === undefined ? undefined : Math.round(value / 2);
  return { ...roundTrip, key: `transport:${leg.direction}`, label: `${leg.date} · ${leg.direction === "outbound" ? "가는 길" : "돌아오는 길"}`, representative: half(roundTrip.representative), min: half(roundTrip.min), max: half(roundTrip.max), confidence: "estimated" };
}

export function estimateTripCost(
  resort: SkiResort,
  input: TripInput,
  selectedRentalOptionId?: string,
  shuttleRoute?: SkiShuttleRoute,
  selectedLiftTicketOptionId?: string,
  skiPlan?: TripSkiPlan
): CostEstimate {
  const people = Math.max(1, input.peopleCount);
  const items: CostItem[] = [];
  if (skiPlan?.days.length) {
    items.push(...estimateSkiPlanItems(resort, input, skiPlan, people));
  } else {
  const resortRentalRules = rentalRulesByResort.get(resort.id) ?? [];
  const discountedLift = selectedLiftTicketOptionId
    ? resortRentalRules.find(rule =>
        rule.id === selectedLiftTicketOptionId &&
        rule.resortId === resort.id &&
        rule.itemType === "lift_ticket" &&
        optionAppliesToDay(rule, { date: input.visitDate, timeSlot: input.liftTicketTimeSlot })
      )
    : undefined;
  const lift = discountedLift ?? resolveLiftPrice(resort.id, input.liftTicketTimeSlot, input.visitDate);

  if (lift) {
    const adult = discountedLift
      ? discountedLift.representativePrice ?? discountedLift.priceMin
      : "adultPrice" in lift ? lift.adultPrice ?? lift.priceMin : lift.priceMin;
    items.push({
      key: "lift_ticket",
      label: discountedLift ? `${lift.sourceName ?? "렌탈샵"} · ${lift.label}` : `${lift.label}`,
      representative: adult ? adult * people : undefined,
      min: lift.priceMin ? lift.priceMin * people : undefined,
      max: lift.priceMax ? lift.priceMax * people : undefined,
      confidence: lift.confidence,
      sourceType: lift.sourceType,
      sourceName: lift.sourceName,
      sourceUrl: lift.sourceUrl,
      bookingUrl: lift.bookingUrl,
      lastCheckedAt: lift.lastCheckedAt,
      verifiedByHuman: lift.verifiedByHuman,
      note: lift.memo
    });
  } else {
    items.push({ key: "lift_ticket", label: "리프트권", confidence: "unavailable" });
  }

  const rental = resolveRentalPrice(resort.id, input, selectedRentalOptionId);
  if (rental) {
    items.push({
      key: "rental",
      label: rental.label,
      representative: rental.representativePrice
        ? rental.representativePrice * people
        : undefined,
      min: rental.priceMin ? rental.priceMin * people : undefined,
      max: rental.priceMax ? rental.priceMax * people : undefined,
      confidence: rental.confidence,
      sourceType: rental.sourceType,
      sourceName: rental.sourceName,
      sourceUrl: rental.sourceUrl,
      bookingUrl: rental.bookingUrl,
      lastCheckedAt: rental.lastCheckedAt,
      verifiedByHuman: rental.verifiedByHuman,
      note: rental.memo
    });
  }
  }

  if (skiPlan?.lodgingNights.length) {
    const entered = skiPlan.lodgingNights.filter(night => night.cost !== null);
    if (entered.length) {
      const total = entered.reduce((sum, night) => sum + night.cost!, 0);
      const complete = entered.length === skiPlan.lodgingNights.length;
      items.push({
        key: "lodging",
        label: `${skiPlan.lodgingNights.length}박 숙박비`,
        representative: total,
        min: total,
        max: total,
        confidence: complete ? "confirmed" : "unavailable",
        note: complete ? "숙박 밤별 입력 금액을 합산했습니다." : `${entered.length}/${skiPlan.lodgingNights.length}박 금액만 입력되었습니다.`
      });
    }
  } else if (input.lodgingCostInput && input.lodgingCostInput > 0) {
    items.push({
      key: "lodging",
      label: "숙박비 직접 입력",
      representative: input.lodgingCostInput,
      min: input.lodgingCostInput,
      max: input.lodgingCostInput,
      confidence: "confirmed"
    });
  }

  items.push(skiPlan?.transportLegs.length ? estimateTransportPlanCost(resort, input, skiPlan) : estimateTransportCost(resort, input, shuttleRoute));

  const min = items.reduce((sum, item) => sum + (item.min ?? item.representative ?? 0), 0);
  const max = items.reduce((sum, item) => sum + (item.max ?? item.representative ?? 0), 0);
  const representative = items.reduce((sum, item) => sum + (item.representative ?? item.min ?? 0), 0);

  return {
    min,
    max,
    representative,
    confidence: combineConfidence(items),
    items
  };
}

function estimateSkiPlanItems(resort: SkiResort, input: TripInput, plan: TripSkiPlan, people: number) {
  const liftItems: CostItem[] = [];
  const rentalItems: CostItem[] = [];
  const resortRentalRules = rentalRulesByResort.get(resort.id) ?? [];

  for (const day of plan.days) {
    const discountedLift = day.liftTicketOptionId
      ? resortRentalRules.find(rule => rule.id === day.liftTicketOptionId && rule.itemType === "lift_ticket" && optionAppliesToDay(rule, day))
      : undefined;
    const lift = discountedLift ?? resolveLiftPrice(resort.id, day.timeSlot, day.date);
    if (lift) {
      const adult = discountedLift
        ? discountedLift.representativePrice ?? discountedLift.priceMin
        : "adultPrice" in lift ? lift.adultPrice ?? lift.priceMin : lift.priceMin;
      liftItems.push({
        key: `lift_ticket:${day.date}`,
        label: `${day.date} · ${lift.label}`,
        representative: adult ? adult * people : undefined,
        min: lift.priceMin ? lift.priceMin * people : undefined,
        max: lift.priceMax ? lift.priceMax * people : undefined,
        confidence: lift.confidence
      });
    } else {
      liftItems.push({ key: `lift_ticket:${day.date}`, label: `${day.date} 리프트권`, confidence: "unavailable" });
    }

    const selectedOptionIds = rentalOptionIds(day);
    const selectedOptions = selectedOptionIds
      .map(id => resortRentalRules.find(rule => rule.id === id && rule.itemType !== "lift_ticket"))
      .filter((rule): rule is RentalPriceRule => Boolean(rule && optionAppliesToDay(rule, day)));
    if (selectedOptions.length) {
      for (const option of selectedOptions) {
        rentalItems.push({
          key: `rental:${day.date}:${option.id}`,
          label: `${day.date} · ${option.label}`,
          representative: option.representativePrice !== undefined ? option.representativePrice * people : undefined,
          min: option.priceMin !== undefined ? option.priceMin * people : undefined,
          max: option.priceMax !== undefined ? option.priceMax * people : undefined,
          confidence: option.confidence
        });
      }
    } else if (selectedOptionIds.length) {
      rentalItems.push({ key: `rental:${day.date}`, label: `${day.date} 선택 렌탈`, confidence: "unavailable" });
    } else {
      const fallback = resolveRentalPrice(resort.id, { ...input, visitDate: day.date, liftTicketTimeSlot: day.timeSlot }, undefined, true);
      if (fallback) {
        rentalItems.push({
          key: `rental:${day.date}`,
          label: `${day.date} · ${fallback.label}`,
          representative: fallback.representativePrice !== undefined ? fallback.representativePrice * people : undefined,
          min: fallback.priceMin !== undefined ? fallback.priceMin * people : undefined,
          max: fallback.priceMax !== undefined ? fallback.priceMax * people : undefined,
          confidence: fallback.confidence
        });
      } else if (!input.ownsEquipment || !input.ownsClothing || input.priorities.includes("rental")) {
        rentalItems.push({ key: `rental:${day.date}`, label: `${day.date} 렌탈`, confidence: "unavailable" });
      }
    }
  }

  const result: CostItem[] = [];
  result.push(aggregatePlanItems("lift_ticket", `${plan.days.length}일 리프트권`, liftItems));
  if (rentalItems.length) result.push(aggregatePlanItems("rental", `${plan.days.length}일 장비·의류 렌탈`, rentalItems));
  return result;
}

function aggregatePlanItems(key: string, label: string, items: CostItem[]): CostItem;
function aggregatePlanItems(key: string, label: string, values: CostItem[]): CostItem {
  const hasRepresentative = values.some(item => item.representative !== undefined);
  const hasMin = values.some(item => item.min !== undefined);
  const hasMax = values.some(item => item.max !== undefined);
  return {
    key,
    label,
    representative: hasRepresentative ? values.reduce((sum, item) => sum + (item.representative ?? item.min ?? 0), 0) : undefined,
    min: hasMin ? values.reduce((sum, item) => sum + (item.min ?? item.representative ?? 0), 0) : undefined,
    max: hasMax ? values.reduce((sum, item) => sum + (item.max ?? item.representative ?? 0), 0) : undefined,
    confidence: combineConfidence(values),
    note: "날짜별 이용 시간과 주중·주말 가격 조건을 합산한 금액입니다."
  };
}

export function getRentalOptionsForResort(resortId: string) {
  const shops = getRentalShopsForResort(resortId);
  return shops.map((shop) => ({
    shop,
    options: rentalRulesByShop.get(shop.id)?.slice() ?? []
  }));
}
