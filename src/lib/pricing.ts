import { departureLocations, getRentalShopsForResort } from "@/data/resorts";
import { priceRules, rentalPriceRules } from "@/data/prices";
import type {
  CostEstimate,
  CostItem,
  PriceConfidence,
  RentalPriceRule,
  SkiResort,
  TimeSlot,
  TripInput
} from "@/lib/types";

function combineConfidence(items: CostItem[]): PriceConfidence {
  if (items.some((item) => item.confidence === "unavailable")) return "unavailable";
  if (items.some((item) => item.confidence === "estimated")) return "estimated";
  if (items.some((item) => item.confidence === "phone_confirmed")) return "phone_confirmed";
  return "confirmed";
}

function resolveLiftPrice(resortId: string, timeSlot: TimeSlot) {
  return priceRules.find(
    (rule) =>
      rule.resortId === resortId &&
      rule.itemType === "lift_ticket" &&
      (rule.timeSlot === timeSlot || rule.timeSlot === "all")
  );
}

function resolveRentalPrice(
  resortId: string,
  input: TripInput,
  selectedRentalOptionId?: string
): RentalPriceRule | undefined {
  if (selectedRentalOptionId) {
    return rentalPriceRules.find((rule) => rule.id === selectedRentalOptionId);
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

  const candidates = rentalPriceRules.filter((rule) => {
    if (rule.resortId !== resortId || rule.itemType !== itemType) return false;
    if (itemType === "equipment" && rule.rideType !== input.rideType) return false;
    return true;
  });

  return candidates.sort(
    (a, b) => (a.representativePrice ?? 999999) - (b.representativePrice ?? 999999)
  )[0];
}

export function estimateTransportCost(resort: SkiResort, input: TripInput): CostItem {
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

  if (input.transportType === "car") {
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

  const shuttle = input.transportType === "shuttle";
  const onePerson = shuttle ? 28000 : 22000;
  const total = onePerson * input.peopleCount;
  return {
    key: "transport",
    label: shuttle ? "셔틀 예상 비용" : "버스 예상 비용",
    representative: total,
    min: total,
    max: Math.round(total * 1.15),
    confidence: "estimated",
    note: "정확한 노선 가격은 예약처 확인 필요"
  };
}

export function estimateTripCost(
  resort: SkiResort,
  input: TripInput,
  selectedRentalOptionId?: string
): CostEstimate {
  const people = Math.max(1, input.peopleCount);
  const items: CostItem[] = [];
  const lift = resolveLiftPrice(resort.id, input.liftTicketTimeSlot);

  if (lift) {
    const adult = lift.adultPrice ?? lift.priceMin;
    items.push({
      key: "lift_ticket",
      label: `${lift.label}`,
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

  if (input.lodgingCostInput && input.lodgingCostInput > 0) {
    items.push({
      key: "lodging",
      label: "숙박비 직접 입력",
      representative: input.lodgingCostInput,
      min: input.lodgingCostInput,
      max: input.lodgingCostInput,
      confidence: "confirmed"
    });
  }

  items.push(estimateTransportCost(resort, input));

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

export function getRentalOptionsForResort(resortId: string) {
  const shops = getRentalShopsForResort(resortId);
  return shops.map((shop) => ({
    shop,
    options: rentalPriceRules.filter((rule) => rule.rentalShopId === shop.id)
  }));
}
