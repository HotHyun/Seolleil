import { priceRules, rentalPriceRules } from "@/data/prices";
import { departureLocations, rentalShops, resorts } from "@/data/resorts";
import { getAllSkiShuttleRoutes, isConfirmedShuttleRoute, routeSupportsShuttleDirection, skiShuttleRoutes } from "@/data/ski-shuttles";
import {
  CURRENT_SEASON,
  CURRENT_SHUTTLE_SEASON,
  seasonRefreshPriority,
  SUPPORTED_PRICE_SEASONS,
  UPCOMING_SEASON,
  UPCOMING_SHUTTLE_SEASON
} from "@/lib/constants";
import type { PriceConfidence, PriceRule, RentalPriceRule, SkiShuttleRoute, TimeSlot } from "@/lib/types";

export type ValidationIssue = {
  severity: "error" | "warning";
  scope: "resort" | "rental_shop" | "price_rule" | "rental_price_rule" | "shuttle_route" | "departure" | "season";
  id: string;
  message: string;
};

export type ResortDataQuality = {
  resortId: string;
  resortName: string;
  liftRuleCount: number;
  confirmedLiftRuleCount: number;
  estimatedLiftRuleCount: number;
  externalRentalShopCount: number;
  rentalRuleCount: number;
  confirmedRentalRuleCount: number;
  estimatedRentalRuleCount: number;
  latestCheckedAt?: string;
  missingTimeSlots: TimeSlot[];
  seasonTransition: ResortSeasonTransition;
};

export type SeasonPublicationStatus = "not_published" | "in_review" | "confirmed" | "unavailable";
export type SeasonRefreshPriority = 1 | 2 | 3;

export type SeasonCategoryProgress = {
  status: SeasonPublicationStatus;
  sourceCount: number;
  targetCount: number;
  confirmedTargetCount: number;
  unavailableTargetCount: number;
  completedTargetCount: number;
  replacementTargetCount: number;
  progressPercent: number;
};

export type ResortSeasonTransition = {
  resortId: string;
  resortName: string;
  priority: SeasonRefreshPriority;
  lift: SeasonCategoryProgress;
  rental: SeasonCategoryProgress;
  shuttle: SeasonCategoryProgress;
  replacementTargetCount: number;
  completedTargetCount: number;
  progressPercent: number;
  nextAction: string;
};

export type SeasonTransitionReport = {
  sourceSeason: string;
  targetSeason: string;
  sourceShuttleSeason: string;
  targetShuttleSeason: string;
  replacementTargetCount: number;
  completedTargetCount: number;
  progressPercent: number;
  statusCounts: Record<SeasonPublicationStatus, number>;
  resorts: ResortSeasonTransition[];
};

export type StaticDataReport = {
  season: string;
  generatedAt: string;
  resortCount: number;
  priceRuleCount: number;
  rentalShopCount: number;
  rentalPriceRuleCount: number;
  issueCount: number;
  warningCount: number;
  estimatedPriceCount: number;
  staleItemCount: number;
  replacementTargetCount: number;
  seasonTransition: SeasonTransitionReport;
  resorts: ResortDataQuality[];
  issues: ValidationIssue[];
  estimatedItems: Array<{ id: string; scope: "price_rule" | "rental_price_rule"; resortId: string; sourceName?: string; lastCheckedAt: string }>;
  staleItems: Array<{ id: string; scope: "resort" | "rental_shop" | "price_rule" | "rental_price_rule"; lastCheckedAt: string }>;
  replacementTargets: Array<{ id: string; scope: "price_rule" | "rental_price_rule"; season: string; resortId: string; replacementKey: string }>;
};

const pricedConfidences: PriceConfidence[] = ["confirmed", "estimated", "phone_confirmed"];
const requiredTimeSlots: TimeSlot[] = ["2h", "3h", "4h", "6h", "night", "full_day"];
const staleAfterDays = 120;
const supportedPriceSeasonSet = new Set<string>(SUPPORTED_PRICE_SEASONS);
const supportedShuttleSeasonSet = new Set([CURRENT_SHUTTLE_SEASON, UPCOMING_SHUTTLE_SEASON]);

function pushIf(issues: ValidationIssue[], condition: boolean, issue: ValidationIssue) {
  if (condition) issues.push(issue);
}

function isUrl(value: string | undefined) {
  return Boolean(value && /^https?:\/\//.test(value));
}

function isDateString(value: string | undefined) {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

function daysSince(dateString: string, now = new Date()) {
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return Number.POSITIVE_INFINITY;
  return Math.floor((now.getTime() - date.getTime()) / 86400000);
}

function hasDuplicate(values: string[]) {
  return new Set(values).size !== values.length;
}

export function getPriceReplacementKey(rule: PriceRule) {
  return rule.replacementKey ?? [rule.resortId, rule.itemType, rule.timeSlot ?? "all", rule.dayType, rule.label].join("|");
}

export function getRentalReplacementKey(rule: RentalPriceRule) {
  return rule.replacementKey ?? [
    rule.resortId,
    rule.rentalShopId ?? rule.providerType,
    rule.itemType,
    rule.timeSlot ?? "all",
    rule.dayType,
    rule.rideType ?? "all",
    rule.ageGroup ?? "all",
    rule.label
  ].join("|");
}

export function getShuttleReplacementKey(route: SkiShuttleRoute) {
  return route.replacementKey ?? [route.resortId, route.operator, route.name].join("|");
}

export function classifySeasonCategory(
  sourceKeys: string[],
  targetItems: Array<{ replacementKey: string; confirmed: boolean; unavailable: boolean }>
): SeasonCategoryProgress {
  const terminalKeys = new Set(
    targetItems
      .filter(item => item.confirmed || item.unavailable)
      .map(item => item.replacementKey)
  );
  const completedTargetCount = sourceKeys.filter(key => terminalKeys.has(key)).length;
  const replacementTargetCount = Math.max(0, sourceKeys.length - completedTargetCount);
  const confirmedTargetCount = targetItems.filter(item => item.confirmed).length;
  const unavailableTargetCount = targetItems.filter(item => item.unavailable).length;
  const status: SeasonPublicationStatus = targetItems.length === 0
    ? "not_published"
    : replacementTargetCount === 0 && unavailableTargetCount === targetItems.length
      ? "unavailable"
      : replacementTargetCount === 0
        ? "confirmed"
        : "in_review";
  const progressPercent = sourceKeys.length
    ? Math.round((completedTargetCount / sourceKeys.length) * 100)
    : targetItems.length && status !== "in_review" ? 100 : 0;

  return {
    status,
    sourceCount: sourceKeys.length,
    targetCount: targetItems.length,
    confirmedTargetCount,
    unavailableTargetCount,
    completedTargetCount,
    replacementTargetCount,
    progressPercent
  };
}

function seasonRefreshPriorityFor(resortId: string): SeasonRefreshPriority {
  const index = seasonRefreshPriority.findIndex(group => (group as readonly string[]).includes(resortId));
  return index === 0 ? 1 : index === 1 ? 2 : 3;
}

function nextSeasonAction(lift: SeasonCategoryProgress, rental: SeasonCategoryProgress, shuttle: SeasonCategoryProgress) {
  if (lift.status === "not_published") return "26/27 공식 리프트 요금 확인";
  if (rental.status === "not_published") return "공식·외부 렌탈 장비/의류 가격 확인";
  if (shuttle.status === "not_published") return "26/27 셔틀 운행 공지 확인";
  if ([lift, rental, shuttle].some(category => category.status === "in_review")) return "등록 항목의 출처·기간·신뢰도 확정";
  return "전환 완료 · 기준 시즌 전환 대기";
}

function buildSeasonTransitionReport(): SeasonTransitionReport {
  const transitions = resorts.map(resort => {
    const sourceLift = priceRules.filter(rule => rule.resortId === resort.id && rule.itemType === "lift_ticket" && rule.season === CURRENT_SEASON);
    const targetLift = priceRules.filter(rule => rule.resortId === resort.id && rule.itemType === "lift_ticket" && rule.season === UPCOMING_SEASON);
    const sourceRental = rentalPriceRules.filter(rule => rule.resortId === resort.id && rule.season === CURRENT_SEASON);
    const targetRental = rentalPriceRules.filter(rule => rule.resortId === resort.id && rule.season === UPCOMING_SEASON);
    const shuttleRoutes = getAllSkiShuttleRoutes(resort.id).filter(route => routeSupportsShuttleDirection(route, "outbound"));
    const sourceShuttle = shuttleRoutes.filter(route => route.season === CURRENT_SHUTTLE_SEASON);
    const targetShuttle = shuttleRoutes.filter(route => route.season === UPCOMING_SHUTTLE_SEASON);
    const lift = classifySeasonCategory(
      sourceLift.map(getPriceReplacementKey),
      targetLift.map(rule => ({ replacementKey: getPriceReplacementKey(rule), confirmed: rule.confidence === "confirmed" || rule.confidence === "phone_confirmed", unavailable: rule.confidence === "unavailable" }))
    );
    const rental = classifySeasonCategory(
      sourceRental.map(getRentalReplacementKey),
      targetRental.map(rule => ({ replacementKey: getRentalReplacementKey(rule), confirmed: rule.confidence === "confirmed" || rule.confidence === "phone_confirmed", unavailable: rule.confidence === "unavailable" }))
    );
    const shuttle = classifySeasonCategory(
      sourceShuttle.map(getShuttleReplacementKey),
      targetShuttle.map(route => ({ replacementKey: getShuttleReplacementKey(route), confirmed: isConfirmedShuttleRoute(route), unavailable: route.dataStatus === "unavailable" }))
    );
    const replacementTargetCount = lift.sourceCount + rental.sourceCount + shuttle.sourceCount;
    const completedTargetCount = lift.completedTargetCount + rental.completedTargetCount + shuttle.completedTargetCount;

    return {
      resortId: resort.id,
      resortName: resort.name,
      priority: seasonRefreshPriorityFor(resort.id),
      lift,
      rental,
      shuttle,
      replacementTargetCount,
      completedTargetCount,
      progressPercent: replacementTargetCount ? Math.round((completedTargetCount / replacementTargetCount) * 100) : 0,
      nextAction: nextSeasonAction(lift, rental, shuttle)
    } satisfies ResortSeasonTransition;
  }).sort((left, right) => left.priority - right.priority || right.replacementTargetCount - left.replacementTargetCount || left.resortName.localeCompare(right.resortName, "ko"));
  const replacementTargetCount = transitions.reduce((sum, transition) => sum + transition.replacementTargetCount, 0);
  const completedTargetCount = transitions.reduce((sum, transition) => sum + transition.completedTargetCount, 0);
  const statusCounts: Record<SeasonPublicationStatus, number> = { not_published: 0, in_review: 0, confirmed: 0, unavailable: 0 };
  for (const transition of transitions) {
    statusCounts[transition.lift.status] += 1;
    statusCounts[transition.rental.status] += 1;
    statusCounts[transition.shuttle.status] += 1;
  }

  return {
    sourceSeason: CURRENT_SEASON,
    targetSeason: UPCOMING_SEASON,
    sourceShuttleSeason: CURRENT_SHUTTLE_SEASON,
    targetShuttleSeason: UPCOMING_SHUTTLE_SEASON,
    replacementTargetCount,
    completedTargetCount,
    progressPercent: replacementTargetCount ? Math.round((completedTargetCount / replacementTargetCount) * 100) : 0,
    statusCounts,
    resorts: transitions
  };
}

function assertScore(
  issues: ValidationIssue[],
  resortId: string,
  label: string,
  value: number
) {
  pushIf(issues, value < 0 || value > 100, {
    scope: "resort",
    severity: "error",
    id: resortId,
    message: `${label} must be between 0 and 100`
  });
}

export function validateStaticData(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const resortIds = resorts.map((resort) => resort.id);
  const resortIdSet = new Set(resortIds);
  const rentalShopIds = rentalShops.map((shop) => shop.id);
  const rentalShopIdSet = new Set(rentalShopIds);
  const priceRuleIds = priceRules.map(rule => rule.id);
  const rentalPriceRuleIds = rentalPriceRules.map(rule => rule.id);
  const shuttleRouteIds = skiShuttleRoutes.map(route => route.id);

  pushIf(issues, hasDuplicate(resortIds), {
    scope: "resort",
    severity: "error",
    id: "all",
    message: "resort ids must be unique"
  });

  pushIf(issues, hasDuplicate(rentalShopIds), {
    scope: "rental_shop",
    severity: "error",
    id: "all",
    message: "rental shop ids must be unique"
  });

  pushIf(issues, hasDuplicate(priceRuleIds), {
    scope: "price_rule",
    severity: "error",
    id: "all",
    message: "price rule ids must be unique across seasons"
  });

  pushIf(issues, hasDuplicate(rentalPriceRuleIds), {
    scope: "rental_price_rule",
    severity: "error",
    id: "all",
    message: "rental price rule ids must be unique across seasons"
  });

  pushIf(issues, hasDuplicate(shuttleRouteIds), {
    scope: "shuttle_route",
    severity: "error",
    id: "all",
    message: "shuttle route ids must be unique across seasons"
  });

  for (const resort of resorts) {
    pushIf(issues, !resort.name || !resort.region || !resort.address, {
      scope: "resort",
      severity: "error",
      id: resort.id,
      message: "name, region, and address are required"
    });
    pushIf(issues, !isUrl(resort.officialUrl), {
      scope: "resort",
      severity: "error",
      id: resort.id,
      message: "officialUrl must be an http(s) URL"
    });
    pushIf(issues, !isUrl(resort.slopeStatusUrl), {
      scope: "resort",
      severity: "error",
      id: resort.id,
      message: "slopeStatusUrl must be an http(s) URL"
    });
    pushIf(issues, !isUrl(resort.liftTicketUrl), {
      scope: "resort",
      severity: "error",
      id: resort.id,
      message: "liftTicketUrl must be an http(s) URL"
    });
    pushIf(issues, !isUrl(resort.mapLinks.naver) && !isUrl(resort.mapLinks.kakao), {
      scope: "resort",
      severity: "error",
      id: resort.id,
      message: "at least one map link is required"
    });
    pushIf(issues, !isDateString(resort.lastCheckedAt), {
      scope: "resort",
      severity: "error",
      id: resort.id,
      message: "lastCheckedAt must be YYYY-MM-DD"
    });

    assertScore(issues, resort.id, "beginnerScore", resort.beginnerScore);
    assertScore(issues, resort.id, "familyScore", resort.familyScore);
    assertScore(issues, resort.id, "accessScore", resort.accessScore);
    assertScore(issues, resort.id, "resortScaleScore", resort.resortScaleScore);
    assertScore(issues, resort.id, "transportScore", resort.transportScore);
    assertScore(issues, resort.id, "rentalConvenienceScore", resort.rentalConvenienceScore);

    if (resort.operationStatus === "operating") {
      pushIf(issues, !priceRules.some((rule) => rule.resortId === resort.id && rule.itemType === "lift_ticket" && rule.season === CURRENT_SEASON), {
        scope: "price_rule",
        severity: "error",
        id: resort.id,
        message: "operating resort must have lift ticket price rules"
      });
      pushIf(issues, !rentalShops.some((shop) => shop.resortId === resort.id), {
        scope: "rental_shop",
        severity: "error",
        id: resort.id,
        message: "operating resort must have rental shops"
      });
      pushIf(issues, !rentalPriceRules.some((rule) => rule.resortId === resort.id && rule.season === CURRENT_SEASON), {
        scope: "rental_price_rule",
        severity: "error",
        id: resort.id,
        message: "operating resort must have rental price rules"
      });
      const externalShops = rentalShops.filter(
        (shop) => shop.resortId === resort.id && !shop.id.endsWith("official-rental")
      );
      pushIf(issues, externalShops.length < 1, {
        scope: "rental_shop",
        severity: "error",
        id: resort.id,
        message: "operating resort must have at least one external rental shop"
      });
      const resortSlots = new Set(
        priceRules
          .filter((rule) => rule.resortId === resort.id && rule.itemType === "lift_ticket" && rule.season === CURRENT_SEASON)
          .map((rule) => rule.timeSlot)
      );
      for (const slot of requiredTimeSlots) {
        pushIf(issues, !resortSlots.has(slot), {
          scope: "price_rule",
          severity: "error",
          id: resort.id,
          message: `missing lift ticket time slot: ${slot}`
        });
      }
    }
  }

  for (const shop of rentalShops) {
    pushIf(issues, !resortIdSet.has(shop.resortId), {
      scope: "rental_shop",
      severity: "error",
      id: shop.id,
      message: "rental shop references an unknown resort"
    });
    pushIf(issues, !shop.name, {
      scope: "rental_shop",
      severity: "error",
      id: shop.id,
      message: "name is required"
    });
    pushIf(issues, !isDateString(shop.lastCheckedAt), {
      scope: "rental_shop",
      severity: "error",
      id: shop.id,
      message: "lastCheckedAt must be YYYY-MM-DD"
    });
    const hasLatitude = shop.latitude !== undefined;
    const hasLongitude = shop.longitude !== undefined;
    pushIf(issues, hasLatitude !== hasLongitude, {
      scope: "rental_shop",
      severity: "error",
      id: shop.id,
      message: "latitude and longitude must be provided together"
    });
    pushIf(issues, hasLatitude && (shop.latitude! < 33 || shop.latitude! > 38.7 || shop.longitude! < 124.6 || shop.longitude! > 131.2), {
      scope: "rental_shop",
      severity: "error",
      id: shop.id,
      message: "coordinates must be inside South Korea bounds"
    });
    pushIf(issues, Boolean(shop.locationCheckedAt) && !isDateString(shop.locationCheckedAt), {
      scope: "rental_shop",
      severity: "error",
      id: shop.id,
      message: "locationCheckedAt must be YYYY-MM-DD"
    });
    pushIf(issues, Boolean(shop.kakaoPlaceId) && !isUrl(shop.mapLinks?.kakao), {
      scope: "rental_shop",
      severity: "error",
      id: shop.id,
      message: "Kakao Place ID requires a Kakao map URL"
    });
    pushIf(issues, !hasLatitude || !shop.kakaoPlaceId, {
      scope: "rental_shop",
      severity: "warning",
      id: shop.id,
      message: "rental shop location requires manual verification"
    });
  }

  for (const rule of priceRules) {
    pushIf(issues, !resortIdSet.has(rule.resortId), {
      scope: "price_rule",
      severity: "error",
      id: rule.id,
      message: "price rule references an unknown resort"
    });
    pushIf(issues, !rule.season || !isDateString(rule.validFrom) || !isDateString(rule.validTo), {
      scope: "price_rule",
      severity: "error",
      id: rule.id,
      message: "season, validFrom, and validTo are required"
    });
    pushIf(issues, rule.validFrom > rule.validTo, {
      scope: "price_rule",
      severity: "error",
      id: rule.id,
      message: "validFrom must be on or before validTo"
    });
    pushIf(issues, pricedConfidences.includes(rule.confidence) && !rule.adultPrice && !rule.priceMin && !rule.priceMax, {
      scope: "price_rule",
      severity: "error",
      id: rule.id,
      message: "priced rule must include adultPrice, priceMin, or priceMax"
    });
    pushIf(issues, rule.sourceType !== "phone" && !isUrl(rule.sourceUrl), {
      scope: "price_rule",
      severity: "error",
      id: rule.id,
      message: "non-phone price rule must include sourceUrl"
    });
    pushIf(issues, !rule.sourceName, {
      scope: "price_rule",
      severity: "error",
      id: rule.id,
      message: "price rule must include sourceName"
    });
    pushIf(issues, !isDateString(rule.lastCheckedAt), {
      scope: "price_rule",
      severity: "error",
      id: rule.id,
      message: "lastCheckedAt must be YYYY-MM-DD"
    });
    pushIf(issues, rule.confidence === "confirmed" && !rule.verifiedByHuman, {
      scope: "price_rule",
      severity: "error",
      id: rule.id,
      message: "confirmed price rule must be verified by a human"
    });
    pushIf(issues, rule.confidence === "estimated", {
      scope: "price_rule",
      severity: "warning",
      id: rule.id,
      message: "estimated price rule should be confirmed before launch"
    });
    pushIf(issues, daysSince(rule.lastCheckedAt) > staleAfterDays, {
      scope: "price_rule",
      severity: "warning",
      id: rule.id,
      message: `price rule lastCheckedAt is older than ${staleAfterDays} days`
    });
    pushIf(issues, !supportedPriceSeasonSet.has(rule.season), {
      scope: "season",
      severity: "error",
      id: rule.id,
      message: `price rule season ${rule.season} is not a supported transition season`
    });
  }

  for (const rule of rentalPriceRules) {
    pushIf(issues, !resortIdSet.has(rule.resortId), {
      scope: "rental_price_rule",
      severity: "error",
      id: rule.id,
      message: "rental price rule references an unknown resort"
    });
    pushIf(issues, Boolean(rule.rentalShopId) && !rentalShopIdSet.has(rule.rentalShopId!), {
      scope: "rental_price_rule",
      severity: "error",
      id: rule.id,
      message: "rental price rule references an unknown rental shop"
    });
    pushIf(issues, !rule.season || !isDateString(rule.validFrom) || !isDateString(rule.validTo), {
      scope: "rental_price_rule",
      severity: "error",
      id: rule.id,
      message: "season, validFrom, and validTo are required"
    });
    pushIf(issues, rule.validFrom > rule.validTo, {
      scope: "rental_price_rule",
      severity: "error",
      id: rule.id,
      message: "validFrom must be on or before validTo"
    });
    pushIf(
      issues,
      pricedConfidences.includes(rule.confidence) &&
        !rule.representativePrice &&
        !rule.priceMin &&
        !rule.priceMax,
      {
        scope: "rental_price_rule",
        severity: "error",
        id: rule.id,
        message: "priced rule must include representativePrice, priceMin, or priceMax"
      }
    );
    pushIf(issues, rule.sourceType !== "phone" && !isUrl(rule.sourceUrl), {
      scope: "rental_price_rule",
      severity: "error",
      id: rule.id,
      message: "non-phone rental price rule must include sourceUrl"
    });
    pushIf(issues, !rule.sourceName, {
      scope: "rental_price_rule",
      severity: "error",
      id: rule.id,
      message: "rental price rule must include sourceName"
    });
    pushIf(issues, !isDateString(rule.lastCheckedAt), {
      scope: "rental_price_rule",
      severity: "error",
      id: rule.id,
      message: "lastCheckedAt must be YYYY-MM-DD"
    });
    pushIf(issues, rule.confidence === "confirmed" && !rule.verifiedByHuman, {
      scope: "rental_price_rule",
      severity: "error",
      id: rule.id,
      message: "confirmed rental price rule must be verified by a human"
    });
    pushIf(issues, rule.confidence === "estimated", {
      scope: "rental_price_rule",
      severity: "warning",
      id: rule.id,
      message: "estimated rental price rule should be confirmed before launch"
    });
    pushIf(issues, daysSince(rule.lastCheckedAt) > staleAfterDays, {
      scope: "rental_price_rule",
      severity: "warning",
      id: rule.id,
      message: `rental price rule lastCheckedAt is older than ${staleAfterDays} days`
    });
    pushIf(issues, !supportedPriceSeasonSet.has(rule.season), {
      scope: "season",
      severity: "error",
      id: rule.id,
      message: `rental price rule season ${rule.season} is not a supported transition season`
    });
  }

  for (const route of skiShuttleRoutes) {
    pushIf(issues, !resortIdSet.has(route.resortId), {
      scope: "shuttle_route",
      severity: "error",
      id: route.id,
      message: "shuttle route references an unknown resort"
    });
    pushIf(issues, !supportedShuttleSeasonSet.has(route.season), {
      scope: "season",
      severity: "error",
      id: route.id,
      message: `shuttle season ${route.season} is not a supported transition season`
    });
    pushIf(issues, !isUrl(route.sourceUrl) || !isUrl(route.bookingUrl), {
      scope: "shuttle_route",
      severity: "error",
      id: route.id,
      message: "shuttle route must include sourceUrl and bookingUrl"
    });
    pushIf(issues, !isDateString(route.lastCheckedAt), {
      scope: "shuttle_route",
      severity: "error",
      id: route.id,
      message: "shuttle route lastCheckedAt must be YYYY-MM-DD"
    });
    pushIf(issues, route.season === UPCOMING_SHUTTLE_SEASON && !route.service?.period, {
      scope: "shuttle_route",
      severity: "error",
      id: route.id,
      message: "26/27 shuttle route must include an operating period"
    });
    pushIf(issues, route.season === UPCOMING_SHUTTLE_SEASON && route.dataStatus.endsWith("_25_26"), {
      scope: "shuttle_route",
      severity: "error",
      id: route.id,
      message: "26/27 shuttle route must use a season-neutral data status"
    });
  }

  for (const departure of departureLocations) {
    for (const [resortId, distance] of Object.entries(departure.distances)) {
      pushIf(issues, !resortIdSet.has(resortId), {
        scope: "departure",
        severity: "error",
        id: departure.id,
        message: `distance references an unknown resort: ${resortId}`
      });
      pushIf(issues, distance.minutes <= 0 || distance.km <= 0, {
        scope: "departure",
        severity: "error",
        id: departure.id,
        message: `distance must have positive minutes and km: ${resortId}`
      });
    }
  }

  return issues;
}

export function getStaticDataReport(now = new Date()): StaticDataReport {
  const issues = validateStaticData();
  const seasonTransition = buildSeasonTransitionReport();
  const warnings = issues.filter((issue) => issue.severity === "warning");
  const estimatedItems = [
    ...priceRules
      .filter((rule) => rule.confidence === "estimated")
      .map((rule) => ({
        id: rule.id,
        scope: "price_rule" as const,
        resortId: rule.resortId,
        sourceName: rule.sourceName,
        lastCheckedAt: rule.lastCheckedAt
      })),
    ...rentalPriceRules
      .filter((rule) => rule.confidence === "estimated")
      .map((rule) => ({
        id: rule.id,
        scope: "rental_price_rule" as const,
        resortId: rule.resortId,
        sourceName: rule.sourceName,
        lastCheckedAt: rule.lastCheckedAt
      }))
  ];
  const staleItems = [
    ...resorts
      .filter((item) => daysSince(item.lastCheckedAt, now) > staleAfterDays)
      .map((item) => ({ id: item.id, scope: "resort" as const, lastCheckedAt: item.lastCheckedAt })),
    ...rentalShops
      .filter((item) => daysSince(item.lastCheckedAt, now) > staleAfterDays)
      .map((item) => ({ id: item.id, scope: "rental_shop" as const, lastCheckedAt: item.lastCheckedAt })),
    ...priceRules
      .filter((item) => daysSince(item.lastCheckedAt, now) > staleAfterDays)
      .map((item) => ({ id: item.id, scope: "price_rule" as const, lastCheckedAt: item.lastCheckedAt })),
    ...rentalPriceRules
      .filter((item) => daysSince(item.lastCheckedAt, now) > staleAfterDays)
      .map((item) => ({ id: item.id, scope: "rental_price_rule" as const, lastCheckedAt: item.lastCheckedAt }))
  ];
  const targetPriceKeys = new Set(priceRules.filter(rule => rule.season === UPCOMING_SEASON).map(getPriceReplacementKey));
  const targetRentalKeys = new Set(rentalPriceRules.filter(rule => rule.season === UPCOMING_SEASON).map(getRentalReplacementKey));
  const replacementTargets = [
    ...priceRules
      .filter(rule => rule.season === CURRENT_SEASON && !targetPriceKeys.has(getPriceReplacementKey(rule)))
      .map(rule => ({ id: rule.id, scope: "price_rule" as const, season: rule.season, resortId: rule.resortId, replacementKey: getPriceReplacementKey(rule) })),
    ...rentalPriceRules
      .filter(rule => rule.season === CURRENT_SEASON && !targetRentalKeys.has(getRentalReplacementKey(rule)))
      .map(rule => ({ id: rule.id, scope: "rental_price_rule" as const, season: rule.season, resortId: rule.resortId, replacementKey: getRentalReplacementKey(rule) }))
  ];
  const transitionByResort = new Map(seasonTransition.resorts.map(transition => [transition.resortId, transition]));

  const resortReports = resorts.map((resort) => {
    const liftRules = priceRules.filter((rule) => rule.resortId === resort.id && rule.itemType === "lift_ticket" && rule.season === CURRENT_SEASON);
    const rentalRules = rentalPriceRules.filter((rule) => rule.resortId === resort.id && rule.season === CURRENT_SEASON);
    const externalRentalShopCount = rentalShops.filter(
      (shop) => shop.resortId === resort.id && !shop.id.endsWith("official-rental")
    ).length;
    const latestCheckedAt = [
      resort.lastCheckedAt,
      ...liftRules.map((rule) => rule.lastCheckedAt),
      ...rentalRules.map((rule) => rule.lastCheckedAt)
    ].sort().at(-1);
    const availableSlots = new Set(liftRules.map((rule) => rule.timeSlot));
    return {
      resortId: resort.id,
      resortName: resort.name,
      liftRuleCount: liftRules.length,
      confirmedLiftRuleCount: liftRules.filter((rule) => rule.confidence === "confirmed").length,
      estimatedLiftRuleCount: liftRules.filter((rule) => rule.confidence === "estimated").length,
      externalRentalShopCount,
      rentalRuleCount: rentalRules.length,
      confirmedRentalRuleCount: rentalRules.filter((rule) => rule.confidence === "confirmed").length,
      estimatedRentalRuleCount: rentalRules.filter((rule) => rule.confidence === "estimated").length,
      latestCheckedAt,
      missingTimeSlots: requiredTimeSlots.filter((slot) => !availableSlots.has(slot)),
      seasonTransition: transitionByResort.get(resort.id)!
    };
  });

  return {
    season: CURRENT_SEASON,
    generatedAt: now.toISOString(),
    resortCount: resorts.length,
    priceRuleCount: priceRules.length,
    rentalShopCount: rentalShops.length,
    rentalPriceRuleCount: rentalPriceRules.length,
    issueCount: issues.filter((issue) => issue.severity === "error").length,
    warningCount: warnings.length,
    estimatedPriceCount: estimatedItems.length,
    staleItemCount: staleItems.length,
    replacementTargetCount: replacementTargets.length,
    seasonTransition,
    resorts: resortReports,
    issues,
    estimatedItems,
    staleItems,
    replacementTargets
  };
}
