import { ensureAttribute, string, type Config } from "../client";
import type { Migration } from "../migrations";

export const migration202608060001TripLiftTicketSelection: Migration = {
  id: "202608060001_trip_lift_choice",
  description: "Store rental-shop lift ticket selection separately from rental gear",
  async up(cfg: Config) {
    await ensureAttribute(cfg, cfg.collections.trips, string("selectedLiftTicketOptionId", false, 128));
  }
};
