import { datetime, ensureAttribute, string, type Config } from "../client";
import type { Migration } from "../migrations";

export const migration202608080001TripSkiPlan: Migration = {
  id: "202608080001_trip_ski_plan",
  description: "Add trip end date and per-day ski rental plan",
  async up(cfg: Config) {
    await ensureAttribute(cfg, cfg.collections.trips, datetime("endDate", false));
    await ensureAttribute(cfg, cfg.collections.trips, string("skiPlanData", false, 32768));
  }
};
