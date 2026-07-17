import { ensureAttribute, string, type Config } from "../client";
import type { Migration } from "../migrations";

export const migration202607170001TripShuttleSelection: Migration = {
  id: "202607170001_trip_shuttle_selection",
  description: "Add selected ski shuttle route and stop to trips",
  async up(cfg: Config) {
    await ensureAttribute(cfg, cfg.collections.trips, string("shuttleRouteId", false, 128));
    await ensureAttribute(cfg, cfg.collections.trips, string("shuttleStopId", false, 128));
  }
};
