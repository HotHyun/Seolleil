import { describe, expect, it } from "vitest";
import { parseTripInput, tripInputSchema } from "@/lib/trip-input";

describe("trip input parsing", () => {
  it("coerces form values into a TripInput", () => {
    const formData = new FormData();
    formData.set("visitDate", "2027-01-10");
    formData.set("endDate", "2027-01-12");
    formData.set("departureLocation", "seoul-gangnam");
    formData.set("peopleCount", "3");
    formData.set("tripDuration", "overnight");
    formData.set("skillLevel", "first_time");
    formData.set("rideType", "snowboard");
    formData.set("ownsEquipment", "false");
    formData.set("ownsClothing", "true");
    formData.set("transportType", "shuttle");
    formData.set("budgetMin", "100000");
    formData.set("budgetMax", "300000");
    formData.set("priority1", "beginner");
    formData.set("priority2", "transport");
    formData.set("priority3", "cheap");
    formData.set("liftTicketTimeSlot", "night");
    formData.set("lodgingCostInput", "120000");

    const input = parseTripInput(formData);

    expect(input.peopleCount).toBe(3);
    expect(input.endDate).toBe("2027-01-12");
    expect(input.ownsEquipment).toBe(false);
    expect(input.ownsClothing).toBe(true);
    expect(input.priorities).toEqual(["beginner", "transport", "cheap"]);
    expect(input.lodgingCostInput).toBe(120000);
  });

  it("rejects invalid people count", () => {
    expect(() => tripInputSchema.parse({ peopleCount: 0 })).toThrow();
  });
});
