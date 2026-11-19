import { CURRENT_SEASON, UPCOMING_SEASON_END, UPCOMING_SEASON_START } from "@/lib/constants";
import type { PriceRule, RentalPriceRule } from "@/lib/types";

// 26/27 공식 가격이 아직 없는 항목은 25/26 가격을 "참고가"로 쓴다.
// 같은 리조트(렌탈은 렌탈샵)에 26/27 규칙이 하나라도 등록되면 그 항목의 25/26 규칙은 `upcomingFallback: false`가 되어
// 폴백을 멈추고 26/27 규칙만 쓴다. 가격은 계산 시점마다 규칙에서 구하므로, 26/27 규칙이 추가되면
// 트립 가격도 다시 계산할 때 자동으로 바뀐다. (표시는 src/data/prices.ts 끝에서 규칙에 붙인다.)

type SeasonRule = Pick<PriceRule | RentalPriceRule, "season" | "upcomingFallback">;

export function isUpcomingSeasonDate(date: string) {
  return date >= UPCOMING_SEASON_START && date <= UPCOMING_SEASON_END;
}

// 26/27 방문일에 대응하는 25/26 시즌의 같은 날짜(1년 전)를 돌려준다. 해당 없으면 undefined.
export function previousSeasonDate(date: string) {
  if (!isUpcomingSeasonDate(date)) return undefined;
  const shifted = `${Number(date.slice(0, 4)) - 1}${date.slice(4)}`;
  return Number.isNaN(new Date(`${shifted}T00:00:00Z`).getTime()) ? undefined : shifted;
}

export function canUseAsReference(rule: SeasonRule) {
  return rule.season === CURRENT_SEASON && rule.upcomingFallback === true;
}

// 규칙이 방문일에 직접 맞지 않을 때, 25/26 참고가로 쓸 수 있으면 비교에 쓸 25/26 날짜를 돌려준다.
export function referenceDateFor(rule: SeasonRule & { validFrom: string; validTo: string }, date: string) {
  if (!canUseAsReference(rule)) return undefined;
  const previous = previousSeasonDate(date);
  return previous && rule.validFrom <= previous && rule.validTo >= previous ? previous : undefined;
}

export function toReferenceRule<T extends PriceRule | RentalPriceRule>(rule: T): T {
  if (!canUseAsReference(rule) || rule.confidence === "unavailable") return rule;
  return {
    ...rule,
    referenceSeason: CURRENT_SEASON,
    confidence: "estimated",
    verifiedByHuman: false,
    label: `${rule.label} · 25/26 참고가`,
    memo: `26/27 공식 가격이 아직 없어 25/26 가격을 참고로 사용합니다. 26/27 가격이 게시되면 자동으로 바뀝니다.${rule.memo ? ` ${rule.memo}` : ""}`
  };
}

// 방문일에 규칙이 직접 맞으면 그대로, 25/26 참고가로만 맞으면 참고가 표시를 붙여 돌려준다.
export function ruleForDate<T extends PriceRule | RentalPriceRule>(rule: T, date: string): T {
  return rule.validFrom <= date && rule.validTo >= date ? rule : toReferenceRule(rule);
}
