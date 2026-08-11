import { skiShuttleRoutes } from "./all-routes";
import { CURRENT_SHUTTLE_SEASON } from "@/lib/constants";

export { getShuttleRegions, getShuttleStopsForDirection, isConfirmedShuttleRoute, routeSupportsShuttleDirection, searchShuttleRoutes, skiShuttleOperators, skiShuttleSeasons, skiShuttleStops } from "./catalog";
export { getSkiShuttleCoverage } from "./coverage";
export type { ShuttleCoverageStatus, SkiShuttleCoverage } from "./coverage";
export { skiShuttleRoutes2526 } from "./routes";
export { skiShuttleRoutes2627 } from "./routes-26-27";
export { skiShuttleRoutes } from "./all-routes";

export function getSkiShuttleRoutes(resortId: string, season = CURRENT_SHUTTLE_SEASON) {
  return skiShuttleRoutes.filter(route => route.resortId === resortId && route.season === season);
}

export function getAllSkiShuttleRoutes(resortId: string) {
  return skiShuttleRoutes.filter(route => route.resortId === resortId);
}
