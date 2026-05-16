import { priceRules, rentalPriceRules } from "@/data/prices";
import { departureLocations, rentalShops, resorts } from "@/data/resorts";
import type { PriceConfidence } from "@/lib/types";

export type ValidationIssue = {
  scope: "resort" | "rental_shop" | "price_rule" | "rental_price_rule" | "departure";
  id: string;
  message: string;
};

const pricedConfidences: PriceConfidence[] = ["confirmed", "estimated", "phone_confirmed"];

function pushIf(issues: ValidationIssue[], condition: boolean, issue: ValidationIssue) {
  if (condition) issues.push(issue);
}

function isUrl(value: string | undefined) {
  return Boolean(value && /^https?:\/\//.test(value));
}

function isDateString(value: string | undefined) {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
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
    id: "all",
    message: "resort ids must be unique"
  });

  pushIf(issues, hasDuplicate(rentalShopIds), {
    scope: "rental_shop",
    id: "all",
    message: "rental shop ids must be unique"
  });

  for (const resort of resorts) {
    pushIf(issues, !resort.name || !resort.region || !resort.address, {
      scope: "resort",
      id: resort.id,
      message: "name, region, and address are required"
    });
    pushIf(issues, !isUrl(resort.officialUrl), {
      scope: "resort",
      id: resort.id,
      message: "officialUrl must be an http(s) URL"
    });
    pushIf(issues, !isUrl(resort.slopeStatusUrl), {
      scope: "resort",
      id: resort.id,
      message: "slopeStatusUrl must be an http(s) URL"
    });
    pushIf(issues, !isUrl(resort.liftTicketUrl), {
      scope: "resort",
      id: resort.id,
      message: "liftTicketUrl must be an http(s) URL"
    });
    pushIf(issues, !isUrl(resort.mapLinks.naver) && !isUrl(resort.mapLinks.kakao), {
      scope: "resort",
      id: resort.id,
      message: "at least one map link is required"
    });
    pushIf(issues, !isDateString(resort.lastCheckedAt), {
      scope: "resort",
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
        id: resort.id,
        message: "operating resort must have lift ticket price rules"
      });
      pushIf(issues, !rentalShops.some((shop) => shop.resortId === resort.id), {
        scope: "rental_shop",
        id: resort.id,
        message: "operating resort must have rental shops"
      });
      pushIf(issues, !rentalPriceRules.some((rule) => rule.resortId === resort.id), {
        scope: "rental_price_rule",
        id: resort.id,
        message: "operating resort must have rental price rules"
      });
    }
  }

  for (const shop of rentalShops) {
    pushIf(issues, !resortIdSet.has(shop.resortId), {
      scope: "rental_shop",
      id: shop.id,
      message: "rental shop references an unknown resort"
    });
    pushIf(issues, !shop.name, {
      scope: "rental_shop",
      id: shop.id,
      message: "name is required"
    });
    pushIf(issues, !isDateString(shop.lastCheckedAt), {
      scope: "rental_shop",
      id: shop.id,
      message: "lastCheckedAt must be YYYY-MM-DD"
    });
  }

  for (const rule of priceRules) {
    pushIf(issues, !resortIdSet.has(rule.resortId), {
      scope: "price_rule",
      id: rule.id,
      message: "price rule references an unknown resort"
    });
    pushIf(issues, !rule.season || !isDateString(rule.validFrom) || !isDateString(rule.validTo), {
      scope: "price_rule",
      id: rule.id,
      message: "season, validFrom, and validTo are required"
    });
    pushIf(issues, pricedConfidences.includes(rule.confidence) && !rule.adultPrice && !rule.priceMin && !rule.priceMax, {
      scope: "price_rule",
      id: rule.id,
      message: "priced rule must include adultPrice, priceMin, or priceMax"
    });
    pushIf(issues, rule.sourceType !== "phone" && !isUrl(rule.sourceUrl), {
      scope: "price_rule",
      id: rule.id,
      message: "non-phone price rule must include sourceUrl"
    });
    pushIf(issues, !isDateString(rule.lastCheckedAt), {
      scope: "price_rule",
      id: rule.id,
      message: "lastCheckedAt must be YYYY-MM-DD"
    });
  }

  for (const rule of rentalPriceRules) {
    pushIf(issues, !resortIdSet.has(rule.resortId), {
      scope: "rental_price_rule",
      id: rule.id,
      message: "rental price rule references an unknown resort"
    });
    pushIf(issues, Boolean(rule.rentalShopId) && !rentalShopIdSet.has(rule.rentalShopId!), {
      scope: "rental_price_rule",
      id: rule.id,
      message: "rental price rule references an unknown rental shop"
    });
    pushIf(issues, !rule.season || !isDateString(rule.validFrom) || !isDateString(rule.validTo), {
      scope: "rental_price_rule",
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
        id: rule.id,
        message: "priced rule must include representativePrice, priceMin, or priceMax"
      }
    );
    pushIf(issues, rule.sourceType !== "phone" && !isUrl(rule.sourceUrl), {
      scope: "rental_price_rule",
      id: rule.id,
      message: "non-phone rental price rule must include sourceUrl"
    });
    pushIf(issues, !isDateString(rule.lastCheckedAt), {
      scope: "rental_price_rule",
      id: rule.id,
      message: "lastCheckedAt must be YYYY-MM-DD"
    });
  }

  for (const departure of departureLocations) {
    for (const [resortId, distance] of Object.entries(departure.distances)) {
      pushIf(issues, !resortIdSet.has(resortId), {
        scope: "departure",
        id: departure.id,
        message: `distance references an unknown resort: ${resortId}`
      });
      pushIf(issues, distance.minutes <= 0 || distance.km <= 0, {
        scope: "departure",
        id: departure.id,
        message: `distance must have positive minutes and km: ${resortId}`
      });
    }
  }

  return issues;
}
