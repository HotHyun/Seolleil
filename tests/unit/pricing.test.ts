import { describe, expect, it } from "vitest";
import { resorts } from "@/data/resorts";
import { estimateTransportCost, estimateTripCost, getRentalOptionsForResort } from "@/lib/pricing";
import { tripInput } from "../fixtures/trip-input";

describe("pricing", () => {
  const konjiam = resorts.find((resort) => resort.id === "konjiam")!;

  it("estimates lift, rental, and transport costs for a rental trip", () => {
    const estimate = estimateTripCost(konjiam, tripInput());

    expect(estimate.items.map((item) => item.key)).toEqual(
      expect.arrayContaining(["lift_ticket", "rental", "transport"])
    );
    expect(estimate.min).toBeGreaterThan(0);
    expect(estimate.max).toBeGreaterThanOrEqual(estimate.min);
    expect(estimate.confidence).toBe("estimated");
  });

  it("does not add rental cost when equipment and clothing are owned unless rental is a priority", () => {
    const estimate = estimateTripCost(
      konjiam,
      tripInput({ ownsEquipment: true, ownsClothing: true, priorities: ["beginner", "close", "cheap"] })
    );

    expect(estimate.items.find((item) => item.key === "rental")).toBeUndefined();
  });

  it("estimates car transport from round-trip distance", () => {
    const transport = estimateTransportCost(konjiam, tripInput({ transportType: "car" }));

    expect(transport.key).toBe("transport");
    expect(transport.representative).toBeGreaterThan(0);
    expect(transport.note).toContain("왕복거리");
  });

  it("returns grouped rental options for a resort", () => {
    const options = getRentalOptionsForResort("konjiam");

    expect(options.length).toBeGreaterThanOrEqual(2);
    expect(options[0].options.length).toBeGreaterThan(0);
  });

  it("uses date-specific lift rules before all-day fallback rules", () => {
    const weekday = estimateTripCost(konjiam, tripInput({ visitDate: "2026-01-14", liftTicketTimeSlot: "4h" }));
    const weekend = estimateTripCost(konjiam, tripInput({ visitDate: "2026-01-17", liftTicketTimeSlot: "4h" }));

    expect(weekday.items.find((item) => item.key === "lift_ticket")?.representative).toBe(162000);
    expect(weekend.items.find((item) => item.key === "lift_ticket")?.representative).toBe(192000);
  });
});
