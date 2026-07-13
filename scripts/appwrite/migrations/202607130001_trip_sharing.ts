import { ensureAttribute, ensureCollection, index, string, datetime, type Config } from "../client";
import type { Migration } from "../migrations";

export const migration202607130001TripSharing: Migration = {
  id: "202607130001_trip_sharing",
  description: "Add persistent read/edit trip share links",
  async up(cfg: Config) {
    await ensureAttribute(cfg, cfg.collections.trips, string("teamId", false, 255));
    await ensureCollection(cfg, {
      id: cfg.collections.tripShareLinks,
      name: "Trip Share Links",
      attributes: [string("tripId", true, 255), string("tokenHash", true, 128), string("permission", true, 16), string("createdBy", false, 255), datetime("revokedAt", false)],
      indexes: [index("tripId_idx", ["tripId"]), index("tokenHash_idx", ["tokenHash"])]
    });
  }
};
