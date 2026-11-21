import { seasonOpenings, type SeasonOpening } from "@/data/season-openings";
import { getResort } from "@/data/resorts";

const weekdayNames = ["일", "월", "화", "수", "목", "금", "토"];

export { todayKst } from "@/lib/kst-date";
import { todayKst } from "@/lib/kst-date";

export function getSeasonOpening(resortId: string | undefined, openings: SeasonOpening[] = seasonOpenings) {
  return resortId ? openings.find((item) => item.resortId === resortId) : undefined;
}

/** 스키장을 고른 상태면 오늘과 개장일 중 늦은 날, 아니면 오늘. */
export function earliestSelectableDate(resortId?: string, today: string = todayKst(), openings: SeasonOpening[] = seasonOpenings) {
  const open = getSeasonOpening(resortId, openings)?.openDate;
  return open && open > today ? open : today;
}

/** 방문 날짜가 개장일보다 이른 스키장인지. 개장일을 모르면 false. */
export function isBeforeOpening(resortId: string, visitDate: string, openings: SeasonOpening[] = seasonOpenings) {
  const open = getSeasonOpening(resortId, openings)?.openDate;
  return Boolean(open && visitDate && visitDate < open);
}

/** minDate 이상인 가장 가까운 토요일(minDate가 토요일이면 그날). */
export function nextSaturdayOnOrAfter(minDate: string) {
  const date = new Date(`${minDate}T00:00:00Z`);
  const add = (6 - date.getUTCDay() + 7) % 7;
  date.setUTCDate(date.getUTCDate() + add);
  return date.toISOString().slice(0, 10);
}

/** 날짜를 비워 둔 채 추천을 볼 때 계산에 쓰는 기본 방문 날짜. */
export function defaultVisitDate(today: string = todayKst()) {
  return nextSaturdayOnOrAfter(today);
}

export function formatOpenDate(date: string) {
  const parsed = new Date(`${date}T00:00:00Z`);
  return `${parsed.getUTCMonth() + 1}/${parsed.getUTCDate()}(${weekdayNames[parsed.getUTCDay()]})`;
}

/** 선택 날짜 기준으로 아직 열지 않은 스키장 이름과 개장일. */
export function getNotYetOpenResorts(visitDate: string, openings: SeasonOpening[] = seasonOpenings) {
  if (!visitDate) return [];
  return openings
    .filter((item) => visitDate < item.openDate)
    .flatMap((item) => {
      const resort = getResort(item.resortId);
      return resort ? [{ resortId: item.resortId, name: resort.name, openDate: item.openDate, status: item.status }] : [];
    });
}
