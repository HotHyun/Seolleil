import { priceRules, rentalPriceRules } from "@/data/prices";
import { departureLocations, rentalShops, resorts } from "@/data/resorts";
import { CURRENT_SEASON } from "@/lib/constants";
import type { PriceConfidence, TimeSlot } from "@/lib/types";

export type ValidationIssue = {
  severity: "error" | "warning";
  scope: "resort" | "rental_shop" | "price_rule" | "rental_price_rule" | "departure" | "season";
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
  resorts: ResortDataQuality[];
  issues: ValidationIssue[];
  estimatedItems: Array<{ id: string; scope: "price_rule" | "rental_price_rule"; resortId: string; sourceName?: string; lastCheckedAt: string }>;
  staleItems: Array<{ id: string; scope: "resort" | "rental_shop" | "price_rule" | "rental_price_rule"; lastCheckedAt: string }>;
  replacementTargets: Array<{ id: string; scope: "price_rule" | "rental_price_rule"; season: string }>;
};

const pricedConfidences: PriceConfidence[] = ["confirmed", "estimated", "phone_confirmed"];
const requiredTimeSlots: TimeSlot[] = ["2h", "3h", "4h", "6h", "night", "full_day"];
const staleAfterDays = 120;

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
      pushIf(issues, !priceRules.some((rule) => rule.resortId === resort.id && rule.itemType === "lift_ticket"), {
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
      pushIf(issues, !rentalPriceRules.some((rule) => rule.resortId === resort.id), {
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
          .filter((rule) => rule.resortId === resort.id && rule.itemType === "lift_ticket")
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
    pushIf(issues, rule.season !== CURRENT_SEASON, {
      scope: "season",
      severity: "warning",
      id: rule.id,
      message: `price rule season ${rule.season} differs from CURRENT_SEASON ${CURRENT_SEASON}`
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
    pushIf(issues, rule.season !== CURRENT_SEASON, {
      scope: "season",
      severity: "warning",
      id: rule.id,
      message: `rental price rule season ${rule.season} differs from CURRENT_SEASON ${CURRENT_SEASON}`
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
  const replacementTargets = [
    ...priceRules
      .filter((rule) => rule.season === "2025-2026")
      .map((rule) => ({ id: rule.id, scope: "price_rule" as const, season: rule.season })),
    ...rentalPriceRules
      .filter((rule) => rule.season === "2025-2026")
      .map((rule) => ({ id: rule.id, scope: "rental_price_rule" as const, season: rule.season }))
  ];

  const resortReports = resorts.map((resort) => {
    const liftRules = priceRules.filter((rule) => rule.resortId === resort.id && rule.itemType === "lift_ticket");
    const rentalRules = rentalPriceRules.filter((rule) => rule.resortId === resort.id);
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
      missingTimeSlots: requiredTimeSlots.filter((slot) => !availableSlots.has(slot))
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
    resorts: resortReports,
    issues,
    estimatedItems,
    staleItems,
    replacementTargets
  };
}
