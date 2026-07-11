import type { Config, CollectionSpec } from "../client";
import { boolean, datetime, ensureCollection, index, integer, string } from "../client";
import type { Migration } from "../migrations";

function specs(cfg: Config): CollectionSpec[] {
  return [
    {
      id: cfg.collections.trips,
      name: "Trips",
      attributes: [
        string("userId", false, 255),
        string("editTokenHash", true, 128),
        string("shareTokenHash", true, 128),
        string("resortId", true, 128),
        string("resortNameSnapshot", true, 255),
        string("selectedRecommendation", false, 65535),
        string("season", true, 64),
        datetime("visitDate", true),
        string("departureLocation", true, 128),
        integer("peopleCount", true),
        string("skillLevel", true, 32),
        string("rideType", true, 32),
        string("transportType", true, 32),
        string("tripDuration", true, 32),
        boolean("ownsEquipment", true),
        boolean("ownsClothing", true),
        boolean("needRental", true),
        boolean("needClothing", true),
        integer("budgetMin", false),
        integer("budgetMax", false),
        integer("lodgingCostInput", false),
        string("liftTicketTimeSlot", true, 32),
        string("selectedRentalShopId", false, 128),
        string("selectedRentalOptionId", false, 128),
        string("status", true, 32),
        datetime("archivedAt", false),
        datetime("expiresAt", false)
      ],
      indexes: [
        index("editTokenHash_idx", ["editTokenHash"]),
        index("shareTokenHash_idx", ["shareTokenHash"]),
        index("userId_idx", ["userId"]),
        index("resortId_idx", ["resortId"]),
        index("visitDate_idx", ["visitDate"])
      ]
    },
    {
      id: cfg.collections.tripTasks,
      name: "Trip Tasks",
      attributes: [
        string("tripId", true, 255),
        string("category", true, 64),
        string("title", true, 255),
        string("status", true, 32),
        string("memo", false, 4096),
        boolean("isDefault", true),
        integer("sortOrder", true),
        datetime("dueDate", false),
        string("externalUrl", false, 2048)
      ],
      indexes: [
        index("tripId_idx", ["tripId"]),
        index("category_idx", ["category"]),
        index("sortOrder_idx", ["sortOrder"])
      ]
    },
    {
      id: cfg.collections.analyticsEvents,
      name: "Analytics Events",
      attributes: [
        string("tripId", false, 255),
        string("eventName", true, 128),
        string("properties", false, 65535)
      ],
      indexes: [
        index("tripId_idx", ["tripId"]),
        index("eventName_idx", ["eventName"])
      ]
    }
  ];
}

export const migration202607110001InitialSchema: Migration = {
  id: "202607110001_initial_schema",
  description: "Create Korean Ski Appwrite database collections",
  async up(cfg) {
    for (const spec of specs(cfg)) {
      await ensureCollection(cfg, spec);
    }
  }
};
