import type { RentalPriceRule, TimeSlot, TransportType } from "@/lib/types";

export const SKI_PLAN_VERSION = 2 as const;
export const MAX_TRIP_DAYS = 14;

export type SkiDayPlan = {
  date: string;
  timeSlot: TimeSlot;
  rentalShopId: string | null;
  equipmentOptionId: string | null;
  clothingOptionId: string | null;
  packageOptionId: string | null;
  accessoryOptionIds: string[];
  liftTicketOptionId: string | null;
};

export type LodgingNightPlan = {
  date: string;
  lodgingName: string | null;
  lodgingUrl: string | null;
  cost: number | null;
};

export type TransportLegPlan = {
  direction: "outbound" | "return";
  date: string;
  transportType: TransportType;
  shuttleRouteId: string | null;
  shuttleStopId: string | null;
};

export type TripSkiPlan = {
  version: typeof SKI_PLAN_VERSION;
  days: SkiDayPlan[];
  lodgingNights: LodgingNightPlan[];
  transportLegs: TransportLegPlan[];
};

export type LegacySkiPlanInput = {
  visitDate: Date;
  liftTicketTimeSlot: string;
  selectedRentalShopId?: string | null;
  selectedRentalOptionId?: string | null;
  selectedLiftTicketOptionId?: string | null;
  rentalOptions?: RentalPriceRule[];
  endDate?: Date;
  transportType?: TransportType;
  shuttleRouteId?: string | null;
  shuttleStopId?: string | null;
  lodgingName?: string | null;
  lodgingUrl?: string | null;
  lodgingCostInput?: number | null;
};

const timeSlots = new Set<TimeSlot>(["2h", "3h", "4h", "5h", "6h", "7h", "night", "full_day", "all"]);
const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

export function toDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function addDays(date: string, amount: number) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + amount);
  return value.toISOString().slice(0, 10);
}

export function enumerateTripDates(startDate: string, endDate: string) {
  if (!isDateOnly(startDate) || !isDateOnly(endDate) || endDate < startDate) return [];
  const dates: string[] = [];
  for (let date = startDate; date <= endDate && dates.length < MAX_TRIP_DAYS; date = addDays(date, 1)) {
    dates.push(date);
  }
  return dates;
}

export function tripDayType(date: string) {
  const day = new Date(`${date}T00:00:00Z`).getUTCDay();
  return day === 0 || day === 6 ? "weekend" as const : day === 5 ? "friday" as const : "weekday" as const;
}

export function tripDayTypeLabel(date: string) {
  const type = tripDayType(date);
  return type === "weekend" ? "주말" : type === "friday" ? "금요일" : "주중";
}

export function createEmptySkiDay(date: string, timeSlot: TimeSlot = "4h"): SkiDayPlan {
  return {
    date,
    timeSlot,
    rentalShopId: null,
    equipmentOptionId: null,
    clothingOptionId: null,
    packageOptionId: null,
    accessoryOptionIds: [],
    liftTicketOptionId: null
  };
}

export function createLegacySkiPlan(input: LegacySkiPlanInput): TripSkiPlan {
  const day = createEmptySkiDay(
    toDateOnly(input.visitDate),
    isTimeSlot(input.liftTicketTimeSlot) ? input.liftTicketTimeSlot : "4h"
  );
  day.rentalShopId = input.selectedRentalShopId ?? null;
  day.liftTicketOptionId = input.selectedLiftTicketOptionId ?? null;
  const option = input.rentalOptions?.find((item) => item.id === input.selectedRentalOptionId);
  if (option?.itemType === "equipment") day.equipmentOptionId = option.id;
  else if (option?.itemType === "clothing") day.clothingOptionId = option.id;
  else if (option?.itemType === "equipment_clothing_package") day.packageOptionId = option.id;
  else if (option && isAccessory(option.itemType)) day.accessoryOptionIds = [option.id];
  const startDate = toDateOnly(input.visitDate);
  const endDate = toDateOnly(input.endDate ?? input.visitDate);
  const nightDates = enumerateTripDates(startDate, endDate).slice(0, -1);
  const totalLodgingCost = input.lodgingCostInput != null && input.lodgingCostInput >= 0 ? Math.round(input.lodgingCostInput) : null;
  const lodgingNights = nightDates.map((date, index) => ({
    date,
    lodgingName: nullableText(input.lodgingName, 120),
    lodgingUrl: nullableText(input.lodgingUrl, 2048),
    cost: totalLodgingCost === null
      ? null
      : Math.floor(totalLodgingCost / nightDates.length) + (index === 0 ? totalLodgingCost % nightDates.length : 0)
  }));
  const transportType = input.transportType ?? "car";
  return {
    version: SKI_PLAN_VERSION,
    days: [day],
    lodgingNights,
    transportLegs: [
      { direction: "outbound", date: startDate, transportType, shuttleRouteId: input.shuttleRouteId ?? null, shuttleStopId: input.shuttleStopId ?? null },
      { direction: "return", date: endDate, transportType, shuttleRouteId: input.shuttleRouteId ?? null, shuttleStopId: input.shuttleStopId ?? null }
    ]
  };
}

export function parseTripSkiPlan(value: unknown, fallback: LegacySkiPlanInput): TripSkiPlan {
  if (!value || typeof value !== "object" || !("days" in value) || !Array.isArray(value.days)) {
    return createLegacySkiPlan(fallback);
  }
  const seen = new Set<string>();
  const days = value.days.flatMap((candidate) => {
    if (!candidate || typeof candidate !== "object") return [];
    const raw = candidate as Record<string, unknown>;
    const date = String(raw.date ?? "");
    if (!isDateOnly(date) || seen.has(date)) return [];
    seen.add(date);
    const timeSlot = isTimeSlot(raw.timeSlot) ? raw.timeSlot : "4h";
    return [{
      date,
      timeSlot,
      rentalShopId: nullableId(raw.rentalShopId),
      equipmentOptionId: nullableId(raw.equipmentOptionId),
      clothingOptionId: nullableId(raw.clothingOptionId),
      packageOptionId: nullableId(raw.packageOptionId),
      accessoryOptionIds: Array.isArray(raw.accessoryOptionIds)
        ? raw.accessoryOptionIds.map(String).filter(Boolean).slice(0, 8)
        : [],
      liftTicketOptionId: nullableId(raw.liftTicketOptionId)
    } satisfies SkiDayPlan];
  }).sort((left, right) => left.date.localeCompare(right.date)).slice(0, MAX_TRIP_DAYS);

  if (!days.length) return createLegacySkiPlan(fallback);

  const fallbackPlan = createLegacySkiPlan(fallback);
  const rawValue = value as Record<string, unknown>;
  const validNightDates = new Set(enumerateTripDates(toDateOnly(fallback.visitDate), toDateOnly(fallback.endDate ?? fallback.visitDate)).slice(0, -1));
  const lodgingNights = Array.isArray(rawValue.lodgingNights)
    ? rawValue.lodgingNights.flatMap(candidate => {
      if (!candidate || typeof candidate !== "object") return [];
      const raw = candidate as Record<string, unknown>;
      const date = String(raw.date ?? "");
      if (!validNightDates.has(date)) return [];
      return [{
        date,
        lodgingName: nullableText(raw.lodgingName, 120),
        lodgingUrl: nullableText(raw.lodgingUrl, 2048),
        cost: nullableCost(raw.cost)
      } satisfies LodgingNightPlan];
    })
    : fallbackPlan.lodgingNights;
  const nightByDate = new Map(lodgingNights.map(night => [night.date, night]));
  const normalizedNights = [...validNightDates].map(date => nightByDate.get(date) ?? createEmptyLodgingNight(date));

  const rawLegs = Array.isArray(rawValue.transportLegs) ? rawValue.transportLegs : [];
  const normalizedLegs = (["outbound", "return"] as const).map(direction => {
    const raw = rawLegs.find(candidate => candidate && typeof candidate === "object" && (candidate as Record<string, unknown>).direction === direction) as Record<string, unknown> | undefined;
    const fallbackLeg = fallbackPlan.transportLegs.find(leg => leg.direction === direction)!;
    if (!raw) return fallbackLeg;
    return {
      direction,
      date: direction === "outbound" ? toDateOnly(fallback.visitDate) : toDateOnly(fallback.endDate ?? fallback.visitDate),
      transportType: isTransportType(raw.transportType) ? raw.transportType : fallbackLeg.transportType,
      shuttleRouteId: nullableId(raw.shuttleRouteId),
      shuttleStopId: nullableId(raw.shuttleStopId)
    } satisfies TransportLegPlan;
  });

  return { version: SKI_PLAN_VERSION, days, lodgingNights: normalizedNights, transportLegs: normalizedLegs };
}

export function rebuildSkiSchedule(
  current: TripSkiPlan,
  selectedDays: Array<{ date: string; timeSlot: TimeSlot }>,
  startDate = selectedDays[0]?.date,
  endDate = selectedDays.at(-1)?.date
): TripSkiPlan {
  const currentByDate = new Map(current.days.map((day) => [day.date, day]));
  const dates = startDate && endDate ? enumerateTripDates(startDate, endDate) : [];
  const currentNights = new Map(current.lodgingNights.map(night => [night.date, night]));
  const currentLegs = new Map(current.transportLegs.map(leg => [leg.direction, leg]));
  return {
    version: SKI_PLAN_VERSION,
    days: selectedDays
      .filter((day, index, all) => isDateOnly(day.date) && all.findIndex((item) => item.date === day.date) === index)
      .sort((left, right) => left.date.localeCompare(right.date))
      .slice(0, MAX_TRIP_DAYS)
      .map(({ date, timeSlot }) => ({ ...(currentByDate.get(date) ?? createEmptySkiDay(date, timeSlot)), timeSlot })),
    lodgingNights: dates.slice(0, -1).map(date => currentNights.get(date) ?? createEmptyLodgingNight(date)),
    transportLegs: (["outbound", "return"] as const).map(direction => {
      const previous = currentLegs.get(direction) ?? current.transportLegs[0];
      return {
        direction,
        date: direction === "outbound" ? startDate! : endDate!,
        transportType: previous?.transportType ?? "car",
        shuttleRouteId: previous?.shuttleRouteId ?? null,
        shuttleStopId: previous?.shuttleStopId ?? null
      };
    })
  };
}

export function createEmptyLodgingNight(date: string): LodgingNightPlan {
  return { date, lodgingName: null, lodgingUrl: null, cost: null };
}

export function lodgingPlanTotal(plan: TripSkiPlan) {
  return plan.lodgingNights.reduce((sum, night) => sum + (night.cost ?? 0), 0);
}

export function lodgingPlanIsComplete(plan: TripSkiPlan) {
  return plan.lodgingNights.length === 0 || plan.lodgingNights.every(night => Boolean(night.lodgingName));
}

export function transportPlanIsComplete(plan: TripSkiPlan) {
  return plan.transportLegs.length === 2 && plan.transportLegs.every(leg => leg.transportType !== "shuttle" || Boolean(leg.shuttleRouteId && leg.shuttleStopId));
}

export function rentalOptionIds(day: SkiDayPlan) {
  return [day.packageOptionId, day.equipmentOptionId, day.clothingOptionId, ...day.accessoryOptionIds].filter((id): id is string => Boolean(id));
}

export function optionAppliesToDay(option: RentalPriceRule, day: Pick<SkiDayPlan, "date" | "timeSlot">) {
  const dayType = tripDayType(day.date);
  const dayMatches = option.dayType === "all"
    || option.dayType === "peak"
    || option.dayType === dayType
    || (dayType === "friday" && option.dayType === "weekday");
  const timeMatches = !option.timeSlot || option.timeSlot === "all" || option.timeSlot === day.timeSlot;
  return dayMatches && timeMatches && option.validFrom <= day.date && option.validTo >= day.date;
}

export function skiPlanDateLabel(startDate: Date, endDate: Date) {
  const formatter = new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "numeric", day: "numeric" });
  if (toDateOnly(startDate) === toDateOnly(endDate)) return formatter.format(startDate);
  return `${formatter.format(startDate)}–${formatter.format(endDate)}`;
}

function isDateOnly(value: string) {
  if (!dateOnlyPattern.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isTimeSlot(value: unknown): value is TimeSlot {
  return typeof value === "string" && timeSlots.has(value as TimeSlot);
}

function nullableId(value: unknown) {
  const id = typeof value === "string" ? value.trim() : "";
  return id ? id.slice(0, 128) : null;
}

function nullableText(value: unknown, maxLength: number) {
  const text = typeof value === "string" ? value.trim() : "";
  return text ? text.slice(0, maxLength) : null;
}

function nullableCost(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const amount = Math.round(Number(value));
  return Number.isFinite(amount) && amount >= 0 && amount <= 100_000_000 ? amount : null;
}

function isTransportType(value: unknown): value is TransportType {
  return value === "car" || value === "shuttle" || value === "bus";
}

function isAccessory(itemType: RentalPriceRule["itemType"]) {
  return itemType === "helmet" || itemType === "goggles" || itemType === "protective_gear";
}
