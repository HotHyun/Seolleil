import type { SkiShuttleRoute } from "@/lib/types";
import type { SkiResort } from "@/lib/types";
import { CURRENT_SHUTTLE_SEASON } from "@/lib/constants";
import { isConfirmedShuttleRoute, routeSupportsShuttleDirection } from "./catalog";

export type ShuttleCoverageStatus = "confirmed_schedule" | "needs_recheck" | "no_affiliate_service";

export type SkiShuttleCoverage = {
  resortId: string;
  season: string;
  status: ShuttleCoverageStatus;
  confirmedRouteCount: number;
  recheckRouteCount: number;
  officialTransportUrl?: string;
  lastCheckedAt: string;
};

const noAffiliateServiceLastCheckedAt = new Map([["konjiam", "2026-08-10"]]);

export function getSkiShuttleCoverage(resort: Pick<SkiResort, "id" | "shuttleUrl" | "lastCheckedAt">, routes: SkiShuttleRoute[]): SkiShuttleCoverage {
  const outboundRoutes = routes.filter(route => route.season === CURRENT_SHUTTLE_SEASON && routeSupportsShuttleDirection(route, "outbound"));
  const confirmedRouteCount = outboundRoutes.filter(isConfirmedShuttleRoute).length;
  const recheckRouteCount = outboundRoutes.length - confirmedRouteCount;
  const status = noAffiliateServiceLastCheckedAt.has(resort.id) ? "no_affiliate_service" : recheckRouteCount > 0 ? "needs_recheck" : "confirmed_schedule";
  return { resortId: resort.id, season: CURRENT_SHUTTLE_SEASON, status, confirmedRouteCount, recheckRouteCount, officialTransportUrl: resort.shuttleUrl, lastCheckedAt: outboundRoutes[0]?.lastCheckedAt ?? noAffiliateServiceLastCheckedAt.get(resort.id) ?? resort.lastCheckedAt };
}
