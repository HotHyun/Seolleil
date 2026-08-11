import type { TripInput } from "@/lib/types";

export function tripInput(overrides: Partial<TripInput> = {}): TripInput {
  return {
    visitDate: "2026-01-10",
    departureLocation: "seoul-gangnam",
    peopleCount: 2,
    tripDuration: "same_day",
    skillLevel: "beginner",
    rideType: "ski",
    ownsEquipment: false,
    ownsClothing: false,
    transportType: "car",
    budgetMin: 100000,
    budgetMax: 260000,
    priorities: ["beginner", "close", "rental"],
    liftTicketTimeSlot: "4h",
    ...overrides
  };
}
