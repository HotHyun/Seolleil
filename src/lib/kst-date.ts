/** 한국 시간 기준 오늘(yyyy-MM-dd). 서버·브라우저 시간대와 무관하다. 클라이언트 번들에 데이터 모듈이 딸려 오지 않도록 별도 파일로 둔다. */
export function todayKst(now: Date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}
