import { ensureAttribute, integer, string, type Config } from "../client";
import type { Migration } from "../migrations";

export const migration202607130003TripBudget: Migration = {
  id: "202607130003_trip_budget",
  description: "Add lodging, custom budget and split settlement fields",
  async up(cfg: Config) {
    await ensureAttribute(cfg, cfg.collections.trips, string("lodgingName", false, 255));
    await ensureAttribute(cfg, cfg.collections.trips, string("lodgingUrl", false, 2048));
    await ensureAttribute(cfg, cfg.collections.trips, integer("splitCount", false));
    await ensureAttribute(cfg, cfg.collections.trips, string("budgetData", false, 16384));
  }
};
