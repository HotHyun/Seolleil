import { z } from "zod";
import type { Priority, TimeSlot, TripInput } from "@/lib/types";

const prioritySchema = z.enum([
  "close",
  "cheap",
  "beginner",
  "night",
  "transport",
  "facilities",
  "scale",
  "rental"
]);

export const tripInputSchema = z.object({
  visitDate: z.string().min(1),
  endDate: z.string().optional(),
  departureLocation: z.string().min(1),
  peopleCount: z.coerce.number().int().min(1).max(20),
  tripDuration: z.enum(["same_day", "overnight"]),
  skillLevel: z.enum(["first_time", "beginner", "intermediate", "advanced"]),
  rideType: z.enum(["ski", "snowboard"]),
  ownsEquipment: z.preprocess((value) => value === "true" || value === true, z.boolean()),
  ownsClothing: z.preprocess((value) => value === "true" || value === true, z.boolean()),
  transportType: z.enum(["car", "shuttle", "bus"]),
  budgetMin: z.coerce.number().int().optional(),
  budgetMax: z.coerce.number().int().optional(),
  priority1: prioritySchema,
  priority2: prioritySchema,
  priority3: prioritySchema,
  liftTicketTimeSlot: z.enum(["2h", "3h", "4h", "6h", "night", "full_day", "all"]),
  lodgingCostInput: z.coerce.number().int().optional()
});

export function parseTripInput(formData: FormData): TripInput {
  const raw = Object.fromEntries(formData.entries());
  const parsed = tripInputSchema.parse(raw);
  return {
    visitDate: parsed.visitDate,
    endDate: parsed.endDate || undefined,
    departureLocation: parsed.departureLocation,
    peopleCount: parsed.peopleCount,
    tripDuration: parsed.tripDuration,
    skillLevel: parsed.skillLevel,
    rideType: parsed.rideType,
    ownsEquipment: parsed.ownsEquipment,
    ownsClothing: parsed.ownsClothing,
    transportType: parsed.transportType,
    budgetMin: parsed.budgetMin || undefined,
    budgetMax: parsed.budgetMax || undefined,
    priorities: [parsed.priority1, parsed.priority2, parsed.priority3] as Priority[],
    liftTicketTimeSlot: parsed.liftTicketTimeSlot as TimeSlot,
    lodgingCostInput: parsed.lodgingCostInput || undefined
  };
}
