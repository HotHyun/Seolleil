import { CURRENT_SEASON, UPCOMING_SEASON, UPCOMING_SEASON_END, UPCOMING_SEASON_START } from "@/lib/constants";
import type { PriceRule, RentalPriceRule } from "@/lib/types";

// 26/27 공식 가격이 아직 없는 항목은 25/26 가격을 "참고가"로 쓴다.
// 같은 리조트(렌탈은 렌탈샵)에 26/27 규칙이 하나라도 등록되면 그 항목의 25/26 규칙은 `upcomingFallback: false`가 되어
// 폴백을 멈추고 26/27 규칙만 쓴다. 가격은 계산 시점마다 규칙에서 구하므로, 26/27 규칙이 추가되면
// 트립 가격도 다시 계산할 때 자동으로 바뀐다. (표시는 src/data/prices.ts 끝에서 규칙에 붙인다.)

// 25/26 가격표의 시작 월-일과, 그보다 이른 시즌 초(4/01~11/30) 방문일을 가격표 시작일로 맞추는 기준.
const REFERENCE_PRICE_START = "12-01";

type SeasonRule = Pick<PriceRule | RentalPriceRule, "season" | "upcomingFallback">;

export function isUpcomingSeasonDate(date: string) {
  return date >= UPCOMING_SEASON_START && date <= UPCOMING_SEASON_END;
}

// 26/27 방문일에 대응하는 25/26 시즌의 같은 날짜(1년 전)를 돌려준다. 해당 없으면 undefined.
export function previousSeasonDate(date: string) {
  if (!isUpcomingSeasonDate(date)) return undefined;
  const year = Number(date.slice(0, 4)) - 1;
  // 25/26 가격표는 12/01부터 시작한다. 11월 방문일(조기 개장)은 가격표 시작일(12/01)의 가격을 참고가로 쓴다.
  // 요일 구분은 방문일 기준으로 따로 계산하므로 여기서는 유효 기간 비교용 날짜만 옮긴다.
  const monthDay = date.slice(5);
  const beforePriceStart = monthDay >= UPCOMING_SEASON_START.slice(5) && monthDay < REFERENCE_PRICE_START;
  const shifted = beforePriceStart ? `${year}-${REFERENCE_PRICE_START}` : `${year}${date.slice(4)}`;
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

// 트립에 표시할 시즌. 방문일이 26/27 시즌 기간이면 저장된 값과 관계없이 26/27로 보여 준다.
export function tripSeasonFor(visitDate: Date | string, storedSeason: string) {
  const date = typeof visitDate === "string" ? visitDate.slice(0, 10) : visitDate.toISOString().slice(0, 10);
  return isUpcomingSeasonDate(date) ? UPCOMING_SEASON : storedSeason;
}
