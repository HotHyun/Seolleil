import { UPCOMING_SEASON } from "@/lib/constants";
import type { SeasonResearchRecord } from "@/lib/types";

const checkedAt = "2026-08-11";
const nextCheckAfter = "2026-09-01";

export const seasonResearchRecords: SeasonResearchRecord[] = [
  {
    resortId: "high1",
    targetSeason: UPCOMING_SEASON,
    category: "lift",
    status: "checked_unpublished",
    sources: [{ name: "하이원리조트 스키 이용요금", url: "https://www.high1.com/ski/contents.do?key=750" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 이용요금 화면의 3·4·5·7시간권과 종일권 가격이 25/26과 동일하며 26/27 시즌 표기나 신규 공지가 없습니다."
  },
  {
    resortId: "high1",
    targetSeason: UPCOMING_SEASON,
    category: "rental",
    status: "checked_unpublished",
    sources: [{ name: "하이원리조트 스키 이용요금", url: "https://www.high1.com/ski/contents.do?key=750" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 장비 렌탈 표는 확인되지만 26/27 시즌 표기가 없어 다음 시즌 가격으로 등록하지 않았습니다."
  },
  {
    resortId: "high1",
    targetSeason: UPCOMING_SEASON,
    category: "shuttle",
    status: "checked_unpublished",
    sources: [{ name: "대원관광 KD 교통시즌권", url: "https://skibus.purplebus.co.kr/Shop/YpSeason25/" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "운영사 판매 화면은 25/26 하이원 교통시즌권과 2026년 3월 2일까지의 노선만 안내합니다."
  },
  {
    resortId: "vivaldi",
    targetSeason: UPCOMING_SEASON,
    category: "lift",
    status: "checked_unpublished",
    sources: [{ name: "비발디파크 스키&보드 공지", url: "https://www.sonohotelsresorts.com/skiboard/notice" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 스키&보드 공지 목록에 26/27 일일 리프트권 또는 시즌패스 가격 공지가 없습니다."
  },
  {
    resortId: "vivaldi",
    targetSeason: UPCOMING_SEASON,
    category: "rental",
    status: "checked_unpublished",
    sources: [{ name: "비발디파크 스키&보드 공지", url: "https://www.sonohotelsresorts.com/skiboard/notice" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "26/27 공식 장비·의류 렌탈 가격표가 아직 게시되지 않았습니다."
  },
  {
    resortId: "vivaldi",
    targetSeason: UPCOMING_SEASON,
    category: "shuttle",
    status: "checked_unpublished",
    sources: [
      { name: "비발디파크 국내 셔틀", url: "https://vivaldipark.rideus.net/vivaldipark/page/1" },
      { name: "비발디파크 외국인 셔틀", url: "https://vivabus.net/en/vivabus/page/vivaldi-timetable" }
    ],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "현재 공개 시간표는 종료일 3월 2일인 기존 시즌 노선이며 26/27 운행 기간·정류장·요금은 확인되지 않았습니다."
  },
  {
    resortId: "yongpyong",
    targetSeason: UPCOMING_SEASON,
    category: "lift",
    status: "checked_unpublished",
    sources: [{ name: "모나용평 리프트&렌탈요금", url: "https://www.yongpyong.co.kr/kor/skiNboard/utilizationFee/rentCharge.do" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 페이지가 여전히 25/26 시즌 리프트 요금으로 표시되어 26/27 규칙을 생성하지 않았습니다."
  },
  {
    resortId: "yongpyong",
    targetSeason: UPCOMING_SEASON,
    category: "rental",
    status: "checked_unpublished",
    sources: [{ name: "모나용평 리프트&렌탈요금", url: "https://www.yongpyong.co.kr/kor/skiNboard/utilizationFee/rentCharge.do" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "장비·고급장비·의류 가격표가 모두 25/26 시즌으로 표시되어 다음 시즌 가격은 미등록 상태입니다."
  },
  {
    resortId: "yongpyong",
    targetSeason: UPCOMING_SEASON,
    category: "shuttle",
    status: "checked_unpublished",
    sources: [{ name: "대원관광 KD 교통시즌권", url: "https://skibus.purplebus.co.kr/Shop/YpSeason25/" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "운영사 화면에는 25/26 용평 교통시즌권과 기존 노선만 있으며 26/27 판매·시간표는 없습니다."
  },
  {
    resortId: "phoenix",
    targetSeason: UPCOMING_SEASON,
    category: "lift",
    status: "preliminary",
    sources: [
      { name: "휘닉스 26/27 시즌패스 슈퍼 얼리버드", url: "https://phoenixhnr.co.kr/page/pyeongchang/board/event/150000047000" },
      { name: "휘닉스 26/27 스키학교 운영 공고", url: "https://phoenixhnr.co.kr/page/customer/notice/14488" }
    ],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "시즌패스와 동계 운영 준비 일정은 공식 발표됐지만 트립 계산에 필요한 일일 4시간·7시간권 가격은 아직 없습니다.",
    announcedFacts: [
      { label: "BASIC PASS", value: "549,000원" },
      { label: "얼리버드 판매", value: "2026-07-23 ~ 07-29" },
      { label: "폐장 예정", value: "2027-03-14" },
      { label: "스키학교 운영 계약 기간", value: "2026-11-20 ~ 2027-03-14" }
    ]
  },
  {
    resortId: "phoenix",
    targetSeason: UPCOMING_SEASON,
    category: "rental",
    status: "preliminary",
    sources: [{ name: "휘닉스 26/27 시즌패스 슈퍼 얼리버드", url: "https://phoenixhnr.co.kr/page/pyeongchang/board/event/150000047000" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "시즌패스 자녀 혜택에 장비 대여가 포함된 사실은 확인했지만 일반 고객용 장비·의류 일일 렌탈 가격은 미공개입니다.",
    announcedFacts: [
      { label: "자녀 시즌패스 등록", value: "1인 50,000원 · 최대 2인" },
      { label: "자녀 혜택", value: "장비 대여 포함" }
    ]
  },
  {
    resortId: "phoenix",
    targetSeason: UPCOMING_SEASON,
    category: "shuttle",
    status: "checked_unpublished",
    sources: [{ name: "대원관광 KD 교통시즌권", url: "https://skibus.purplebus.co.kr/Shop/YpSeason25/" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "대원관광 화면은 25/26 휘닉스 교통시즌권 275,000원과 기존 노선만 안내하며 26/27 판매 정보는 없습니다."
  }
];
