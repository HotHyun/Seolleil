// 26/27 시즌 스키장별 개장일. 날짜 선택 하한과 추천 제외 기준으로 쓴다.
// - official: 리조트 공식 공지·시즌권 안내에 적힌 개장일.
// - target: 개장 목표·예정일. 날씨에 따라 바뀔 수 있어 공식 공지 확인 후 갱신한다.
// 개장일이 확인되지 않았거나 출처마다 다른 스키장은 넣지 않는다(날짜를 제한하지 않는다).
// 갱신하면 docs/product/season-openings.md의 표와 checkedAt도 함께 고친다.
export type SeasonOpening = {
  resortId: string;
  openDate: string;
  status: "official" | "target";
  source: string;
  checkedAt: string;
};

export const seasonOpenings: SeasonOpening[] = [
  { resortId: "yongpyong", openDate: "2026-11-22", status: "official", source: "모나용평 공식 26/27 리프트 요금 안내(개장 특가 11/22)", checkedAt: "2026-11-19" },
  { resortId: "high1", openDate: "2026-11-27", status: "target", source: "하이원 26/27 개장 목표일(블로그 보도, 공식 공지 확인 필요)", checkedAt: "2026-11-19" },
  { resortId: "o2", openDate: "2026-12-05", status: "target", source: "오투리조트 26/27 시즌권 이용 시작일(공식 개장 공지 확인 필요)", checkedAt: "2026-11-19" },
  { resortId: "oakvalley", openDate: "2026-12-11", status: "official", source: "오크밸리 26/27 시즌권 안내의 스키장 개장일", checkedAt: "2026-11-19" }
];
