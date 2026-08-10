import type { SkiShuttleRoute, SkiShuttleStop } from "@/lib/types";
import { skiShuttleRoutes2526 } from "./routes";

export type SkiShuttleOperator = {
  name: string;
  phone?: string;
  routeIds: string[];
  resortIds: string[];
};

export type SkiShuttleStopRecord = SkiShuttleStop & {
  routeId: string;
  resortId: string;
  season: string;
};

export const skiShuttleSeasons = [...new Set(skiShuttleRoutes2526.map(route => route.season))];

export const skiShuttleOperators: SkiShuttleOperator[] = [...skiShuttleRoutes2526.reduce((operators, route) => {
  const current = operators.get(route.operator) ?? { name: route.operator, phone: route.operatorPhone, routeIds: [], resortIds: [] };
  current.routeIds.push(route.id);
  if (!current.resortIds.includes(route.resortId)) current.resortIds.push(route.resortId);
  operators.set(route.operator, current);
  return operators;
}, new Map<string, SkiShuttleOperator>()).values()];

export const skiShuttleStops: SkiShuttleStopRecord[] = skiShuttleRoutes2526.flatMap(route => route.stops.map(stop => ({ ...stop, routeId: route.id, resortId: route.resortId, season: route.season })));

export function getShuttleRegions(routes: SkiShuttleRoute[]) {
  return [...new Set(routes.map(route => route.region))];
}

export function getShuttleStopsForDirection(route: SkiShuttleRoute, direction: "outbound" | "return" = "outbound") {
  if (direction === "outbound") return route.stops;
  // Legacy 25/26 routes did not split return metadata. Keep their known local
  // stops selectable while the UI marks the return boarding details for recheck.
  if (!route.returnService) return route.stops;
  if (route.returnService.stopOrder === "listed") return route.returnService.stops ?? [];
  if (route.returnService.stopOrder === "same_stops") return route.stops;
  return [...route.stops].reverse();
}

export function searchShuttleRoutes(routes: SkiShuttleRoute[], query: string, region = "all", direction: "outbound" | "return" = "outbound") {
  const normalized = query.trim().toLocaleLowerCase("ko-KR");
  return routes.filter(route => {
    const stops = getShuttleStopsForDirection(route, direction);
    return (region === "all" || route.region === region) && (!normalized || [route.name, route.operator, route.region, ...stops.flatMap(stop => [stop.city, stop.name])].some(value => value.toLocaleLowerCase("ko-KR").includes(normalized)));
  });
}
