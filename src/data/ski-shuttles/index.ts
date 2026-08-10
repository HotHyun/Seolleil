import { skiShuttleRoutes2526 } from "./routes";

export { getShuttleRegions, getShuttleStopsForDirection, routeSupportsShuttleDirection, searchShuttleRoutes, skiShuttleOperators, skiShuttleSeasons, skiShuttleStops } from "./catalog";
export { getSkiShuttleCoverage } from "./coverage";
export type { ShuttleCoverageStatus, SkiShuttleCoverage } from "./coverage";
export { skiShuttleRoutes2526 } from "./routes";

export function getSkiShuttleRoutes(resortId: string) {
  return skiShuttleRoutes2526.filter(route => route.resortId === resortId);
}
