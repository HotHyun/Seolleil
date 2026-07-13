import { ensureAttribute, string, type Config } from "../client";
import type { Migration } from "../migrations";

export const migration202607130002TripIdentity: Migration = {
  id: "202607130002_trip_identity",
  description: "Add custom trip names and group notes",
  async up(cfg: Config) {
    await ensureAttribute(cfg, cfg.collections.trips, string("tripName", false, 255));
    await ensureAttribute(cfg, cfg.collections.trips, string("tripMemo", false, 4096));
  }
};
