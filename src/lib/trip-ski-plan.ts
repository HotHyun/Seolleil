import type { RentalPriceRule, TimeSlot } from "@/lib/types";

export const SKI_PLAN_VERSION = 1 as const;
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

export type TripSkiPlan = {
  version: typeof SKI_PLAN_VERSION;
  days: SkiDayPlan[];
};

export type LegacySkiPlanInput = {
  visitDate: Date;
  liftTicketTimeSlot: string;
  selectedRentalShopId?: string | null;
  selectedRentalOptionId?: string | null;
  selectedLiftTicketOptionId?: string | null;
  rentalOptions?: RentalPriceRule[];
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
  return { version: SKI_PLAN_VERSION, days: [day] };
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

  return days.length ? { version: SKI_PLAN_VERSION, days } : createLegacySkiPlan(fallback);
}

export function rebuildSkiSchedule(
  current: TripSkiPlan,
  selectedDays: Array<{ date: string; timeSlot: TimeSlot }>
): TripSkiPlan {
  const currentByDate = new Map(current.days.map((day) => [day.date, day]));
  return {
    version: SKI_PLAN_VERSION,
    days: selectedDays
      .filter((day, index, all) => isDateOnly(day.date) && all.findIndex((item) => item.date === day.date) === index)
      .sort((left, right) => left.date.localeCompare(right.date))
      .slice(0, MAX_TRIP_DAYS)
      .map(({ date, timeSlot }) => ({ ...(currentByDate.get(date) ?? createEmptySkiDay(date, timeSlot)), timeSlot }))
  };
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

function isAccessory(itemType: RentalPriceRule["itemType"]) {
  return itemType === "helmet" || itemType === "goggles" || itemType === "protective_gear";
}
