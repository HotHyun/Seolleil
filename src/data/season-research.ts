import { UPCOMING_SEASON } from "@/lib/constants";
import type { SeasonResearchRecord } from "@/lib/types";

const checkedAt = "2026-10-11";
const nextCheckAfter = "2026-12-15";

export const seasonResearchRecords: SeasonResearchRecord[] = [
  {
    resortId: "high1",
    targetSeason: UPCOMING_SEASON,
    category: "lift",
    status: "preliminary",
    sources: [
      { name: "하이원리조트 스키 이용요금", url: "https://www.high1.com/ski/contents.do?key=750" },
      { name: "NOL 26/27 X6+ 시즌패스 보도자료", url: "https://nol-universe.com/ko/newsroom/pressRelease/detail?prNo=2544" }
    ],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "26/27 X6+ 통합 시즌패스 판매는 확인했지만, 공식 일일 리프트 요금은 아직 없습니다. 시즌패스는 일일권 가격으로 변환하지 않았습니다.",
    announcedFacts: [
      { label: "26/27 시즌패스", value: "X6+ 통합권 참여 리조트" },
      { label: "1차 판매", value: "2026-09-09 ~ 09-27" }
    ]
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
    sources: [{ name: "대원관광 KD 교통시즌권", url: "https://skibus.purplebus.co.kr/" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "운영사 판매 화면은 25/26 하이원 교통시즌권과 2026년 3월 2일까지의 노선만 안내합니다."
  },
  {
    resortId: "vivaldi",
    targetSeason: UPCOMING_SEASON,
    category: "lift",
    status: "published",
    sources: [{ name: "비발디파크 스키월드 요금&할인 안내", url: "https://www.sonohotelsresorts.com/skiboard/discount" }],
    lastCheckedAt: "2026-11-21",
    nextCheckAfter,
    note: "공식 요금표에 현재 5·6·7시간권 대인·소인과 주중·주말 가격이 게시되어 반영했습니다. 요금표 자체에 시즌명이 없어 현행 26/27 가격이라는 시즌 연결에는 판단이 포함됩니다. 가격 페이지의 소인 출생연도는 2014~2023년입니다."
  },
  {
    resortId: "vivaldi",
    targetSeason: UPCOMING_SEASON,
    category: "rental",
    status: "published",
    sources: [
      { name: "비발디파크 스키월드 요금&할인 안내", url: "https://www.sonohotelsresorts.com/skiboard/discount" },
      { name: "비발디파크 스키&보드 이용약관", url: "https://www.sonohotelsresorts.com/skiboard/terms" }
    ],
    lastCheckedAt: "2026-11-21",
    nextCheckAfter,
    note: "공식 장비 렌탈은 6시간 대인 주중/주말 34,000/43,000원, 7시간 36,000/45,000원, 8시간 38,000/47,000원이며 소인 가격도 게시되어 있습니다. 이용약관은 장비 대여가 리프트권보다 1시간 길다고 명시합니다. 헬멧은 5,000/6,000/7,000원. 의류 가격은 공식 표에 없습니다. 요금표 자체의 시즌 표기가 없어 현행 26/27 가격으로 반영한 점은 확인 필요합니다."
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
    status: "published",
    sources: [
      { name: "모나용평 리프트&렌탈요금", url: "https://www.yongpyong.co.kr/kor/skiNboard/utilizationFee/rentCharge.do" },
      { name: "NOL 26/27 X6+ 시즌패스 보도자료", url: "https://nol-universe.com/ko/newsroom/pressRelease/detail?prNo=2544" }
    ],
    lastCheckedAt: "2026-11-21",
    nextCheckAfter: "2026-12-15",
    note: "공식 페이지가 '26/27시즌 리프트 요금'(4·6·8시간, 대인·소인)을 게시해 4h·6h·full_day(8시간)를 등록했습니다. 2h·3h·야간권은 26/27 표에 없어 미등록입니다. 11월 22일 개장 당일 리프트 10,000원·8시간 장비 렌탈 10,000원 특가는 별도 프로모션으로 기록했습니다. 슬로프 1면 운영 특가는 정상가와 별도로 유지합니다.",
    announcedFacts: [
      { label: "26/27 시즌패스", value: "X6+ 통합권 참여 리조트" },
      { label: "개장 특가", value: "11/22(일) 하루 리프트권 10,000원 · 장비 8시간 10,000원" },
      { label: "1면 운영 시 특가", value: "4시간 30,000원 · 6시간 35,000원 · 8시간 40,000원 (11/23부터 2면 오픈 시 정상가)" }
    ]
  },
  {
    resortId: "yongpyong",
    targetSeason: UPCOMING_SEASON,
    category: "rental",
    status: "published",
    sources: [{ name: "모나용평 리프트&렌탈요금", url: "https://www.yongpyong.co.kr/kor/skiNboard/utilizationFee/rentCharge.do" }],
    lastCheckedAt: "2026-11-19",
    nextCheckAfter: "2026-12-15",
    note: "공식 페이지가 '26/27시즌 장비(세트)·의류 렌탈 요금'을 게시해 일반 장비(4시간 44,000원~8시간 54,000원)와 의류 한벌(주간 33,000원~주간+야간 50,000원)로 등록했습니다. 고급 장비·부분 렌탈·연일권은 대표값에 넣지 않았습니다."
  },
  {
    resortId: "yongpyong",
    targetSeason: UPCOMING_SEASON,
    category: "shuttle",
    status: "checked_unpublished",
    sources: [{ name: "대원관광 KD 교통시즌권", url: "https://skibus.purplebus.co.kr/" }],
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
      { name: "휘닉스 26/27 시즌패스 판매 안내", url: "https://phoenixhnr.co.kr/page/board/event/190000047134" },
      { name: "휘닉스 26/27 스키학교 운영 공고", url: "https://phoenixhnr.co.kr/page/customer/notice/14488" },
      { name: "휘닉스 개장 기념 리프트·장비 대여 특가", url: "https://phoenixhnr.co.kr/page/pyeongchang/board/event/150000047550" }
    ],
    lastCheckedAt: "2026-11-21",
    nextCheckAfter,
    note: "26/27 시즌패스와 7시간권 2매 부가 혜택은 확인했지만 일반 고객용 정상 일일 리프트 가격표는 아직 없습니다. 개장 행사(11/22~27) 7시간 리프트 30,000원·장비 대여 15,000원은 기간 한정 프로모션으로 기록했습니다. 시즌패스 가격·혜택은 일일 정상가로 변환하지 않았습니다.",
    announcedFacts: [
      { label: "개장 특가(11/22~27)", value: "리프트 7시간 30,000원 · 장비 대여 7시간 15,000원" },
      { label: "26/27 리프트 얼리버드(11/3~11/22 판매)", value: "스마트 패스 6H 64,400원 · 라이트 패스 4H 57,900원, 장비 렌탈 포함 시 77,400원 · 70,900원" },
      { label: "BASIC PASS", value: "1차 549,000원 · 2차 599,000원" },
      { label: "판매 기간", value: "1차 2026-08-27 ~ 09-30 · 2차 2026-10-01 ~ 11-30" },
      { label: "리프트 혜택", value: "7시간권 2매 포함" },
      { label: "운영 기간", value: "개장일 ~ 2027-03-14 예정" }
    ]
  },
  {
    resortId: "phoenix",
    targetSeason: UPCOMING_SEASON,
    category: "rental",
    status: "preliminary",
    sources: [
      { name: "휘닉스 26/27 시즌패스 슈퍼 얼리버드", url: "https://phoenixhnr.co.kr/page/pyeongchang/board/event/150000047000" },
      { name: "휘닉스 개장 기념 리프트·장비 대여 특가", url: "https://phoenixhnr.co.kr/page/pyeongchang/board/event/150000047550" }
    ],
    lastCheckedAt: "2026-11-21",
    nextCheckAfter,
    note: "일반 고객용 정상 장비·의류 일일 렌탈 가격은 미공개입니다. 다만 개장 행사 기간에만 장비 7시간 대여 15,000원이 공지되어 리프트와 함께 기간 한정 프로모션으로 기록했습니다.",
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
    sources: [{ name: "대원관광 KD 교통시즌권", url: "https://skibus.purplebus.co.kr/" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "대원관광 화면은 25/26 휘닉스 교통시즌권 275,000원과 기존 노선만 안내하며 26/27 판매 정보는 없습니다."
  },
  {
    resortId: "konjiam",
    targetSeason: UPCOMING_SEASON,
    category: "lift",
    status: "published",
    sources: [
      { name: "곤지암리조트 스키 요금 안내", url: "https://m.konjiamresort.co.kr/ski/skiInfo.dev" },
      { name: "곤지암리조트 공지사항", url: "https://reservation.konjiamresort.co.kr/view/customerNotice.do" },
      { name: "NOL 26/27 곤지암 시간권 판매", url: "https://leisure-web.yanolja.com/leisure/10365890" }
    ],
    lastCheckedAt: "2026-11-21",
    nextCheckAfter,
    note: "공식 요금 안내의 26/27 카드 할인 안내와 현재 정상가 표를 확인해 2·4·6시간권을 주중/주말별로 등록했습니다. 리프트 정상가는 2시간 69,000/83,000원, 4시간 81,000/96,000원, 6시간 87,000/105,000원입니다(주중/주말). 4·6시간은 25/26과 같고 2시간권이 새로 확인됐습니다.",
    announcedFacts: [
      { label: "26/27 시즌패스", value: "선착순 한정 판매" },
      { label: "누적 시간권", value: "20시간 330,000원 · 30시간 430,000원 · 40시간 490,000원" },
      { label: "이용 기준", value: "구매 총 시간에서 2·4·6시간 단위 차감" }
    ]
  },
  {
    resortId: "konjiam",
    targetSeason: UPCOMING_SEASON,
    category: "rental",
    status: "published",
    sources: [{ name: "곤지암리조트 공식 요금 안내", url: "https://m.konjiamresort.co.kr/ski/skiInfo.dev" }],
    lastCheckedAt: "2026-11-21",
    nextCheckAfter,
    note: "현재 공식 요금 안내에 풀세트 6시간 36,000/39,000원(주중/주말), 부분 플레이트·데크 21,000/26,000원, 부츠 19,000/23,000원, 의류 풀세트 27,000원(4시간 이하)·35,000원(초과), 헬멧 9,000/12,000원, 보호대 10,000원이 게시되어 있습니다. 렌탈 표 자체에 시즌 표기는 없어 현재 요금을 26/27 규칙으로 반영했으며, 별도 판매되는 장비와 의류의 합산을 공식 패키지로 표시하지 않았습니다."
  },
  {
    resortId: "konjiam",
    targetSeason: UPCOMING_SEASON,
    category: "shuttle",
    status: "checked_unpublished",
    sources: [{ name: "곤지암리조트 공식 대중교통 안내", url: "https://m.konjiamresort.co.kr/contact/Directions3.dev" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 교통 화면은 전철·광역버스·마을버스만 안내하고 기존 무료 셔틀 페이지는 삭제된 상태라 26/27 제휴 셔틀은 확인되지 않았습니다."
  },
  {
    resortId: "jisan",
    targetSeason: UPCOMING_SEASON,
    category: "lift",
    status: "preliminary",
    sources: [
      { name: "지산리조트 리프트·렌탈 종합요금", url: "https://www.jisanresort.co.kr/w/ski/use/rental.asp" },
      { name: "NOL 26/27 X6+ 시즌패스 보도자료", url: "https://nol-universe.com/ko/newsroom/pressRelease/detail?prNo=2544" }
    ],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 요금표는 25/26으로 표시됩니다. 26/27 X6+ 통합 시즌패스 판매는 확인했지만 일일 리프트 요금은 아직 없습니다. 2026-11-19 운영자 확인: 가격 페이지가 무한 로딩이 아니라 26/27 요금 '준비 중' 안내(alert)를 띄우는 상태입니다. 공지 후 재확인합니다.",
    announcedFacts: [
      { label: "26/27 시즌패스", value: "X6+ 통합권 참여 리조트" },
      { label: "1차 판매", value: "2026-09-09 ~ 09-27" }
    ]
  },
  {
    resortId: "jisan",
    targetSeason: UPCOMING_SEASON,
    category: "rental",
    status: "checked_unpublished",
    sources: [{ name: "지산리조트 리프트·렌탈 종합요금", url: "https://www.jisanresort.co.kr/w/ski/use/rental.asp" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 장비 렌탈 표가 25/26 시즌으로 표시되어 26/27 장비·의류 가격 규칙은 생성하지 않았습니다. 2026-11-19 운영자 확인: 가격 페이지가 무한 로딩이 아니라 26/27 요금 '준비 중' 안내(alert)를 띄우는 상태입니다. 공지 후 재확인합니다."
  },
  {
    resortId: "jisan",
    targetSeason: UPCOMING_SEASON,
    category: "shuttle",
    status: "checked_unpublished",
    sources: [
      { name: "지산리조트 스키 FAQ", url: "https://www.jisanresort.co.kr/m/member/customer.asp?schCate=ski" },
      { name: "지산 셔틀 예약처", url: "https://jisan.allthatlimo.net/" }
    ],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 FAQ와 예약처는 25/26 시청역·종합운동장역 유료 셔틀만 안내하며 26/27 운행 기간·요금·시간표는 없습니다."
  },
  {
    resortId: "elysian",
    targetSeason: UPCOMING_SEASON,
    category: "lift",
    status: "preliminary",
    sources: [
      { name: "엘리시안 강촌 스키 이용안내", url: "https://www.elysian.co.kr/about-gangchon/ski" },
      { name: "NOL 26/27 X6+ 시즌패스 보도자료", url: "https://nol-universe.com/ko/newsroom/pressRelease/detail?prNo=2544" }
    ],
    lastCheckedAt: "2026-11-19",
    nextCheckAfter,
    note: "공식 이용안내는 25/26 운영기간·요금 기준입니다. 26/27 X6+ 시즌패스는 판매 공지가 확인됐지만 SMART 일일 리프트 요금은 아직 없습니다. 2026-11-19 Chrome 확인: 이용요금 표의 소인 기준이 '2026년 초등학교 졸업예정자까지'인 25/26 표입니다.",
    announcedFacts: [
      { label: "26/27 시즌패스", value: "X6+ 통합권 참여 리조트" },
      { label: "1차 판매", value: "2026-09-09 ~ 09-27" }
    ]
  },
  {
    resortId: "elysian",
    targetSeason: UPCOMING_SEASON,
    category: "rental",
    status: "checked_unpublished",
    sources: [{ name: "엘리시안 강촌 스키 이용안내", url: "https://www.elysian.co.kr/about-gangchon/ski" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 이용약관은 장비·의류 렌탈권 운영만 확인해 주며 26/27 일반 렌탈 가격표는 게시되지 않았습니다."
  },
  {
    resortId: "elysian",
    targetSeason: UPCOMING_SEASON,
    category: "shuttle",
    status: "checked_unpublished",
    sources: [{ name: "엘리시안 강촌 공식 셔틀 예약", url: "https://www.elysian.co.kr/shuttle-bus-reservation" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 예약 경로에서 26/27 수도권·백양리역 셔틀 운행 기간과 시간표가 아직 확인되지 않았습니다."
  },
  {
    resortId: "wellihilli",
    targetSeason: UPCOMING_SEASON,
    category: "lift",
    status: "preliminary",
    sources: [
      { name: "웰리힐리파크 공지사항", url: "https://www.wellihillipark.com/" },
      { name: "NOL 26/27 X6+ 시즌패스 보도자료", url: "https://nol-universe.com/ko/newsroom/pressRelease/detail?prNo=2544" }
    ],
    lastCheckedAt: "2026-11-19",
    nextCheckAfter,
    note: "26/27 X6+ 시즌패스 및 리조트 회원용 시즌권 판매는 공지됐지만 일반 고객용 일일 리프트 가격은 아직 없습니다. 2026-11-19 Chrome 확인: 시즌권 페이지에는 26/27 횡성군민시즌권(290,000원~)과 회원시즌권만 있고 일일권 가격 경로는 찾지 못했습니다.",
    announcedFacts: [
      { label: "26/27 시즌패스", value: "X6+ 통합권 참여 리조트" },
      { label: "1차 판매", value: "2026-09-09 ~ 09-27" },
      { label: "리조트 단독 시즌권", value: "회원 대상 판매 공지 확인" }
    ]
  },
  {
    resortId: "wellihilli",
    targetSeason: UPCOMING_SEASON,
    category: "rental",
    status: "checked_unpublished",
    sources: [{ name: "웰리힐리파크 스노우파크 예약", url: "https://www.wellihillipark.com/home/reservation/snowpark/season" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 스노우파크 예약 화면에 26/27 장비·의류 일반 렌탈 가격표가 게시되지 않았습니다."
  },
  {
    resortId: "wellihilli",
    targetSeason: UPCOMING_SEASON,
    category: "shuttle",
    status: "checked_unpublished",
    sources: [
      { name: "웰리힐리파크 수도권 스키셔틀", url: "https://www.wellihillipark.com/home/guide/map/shuttle" },
      { name: "대원관광 KD 교통시즌권", url: "https://skibus.purplebus.co.kr/" }
    ],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 화면은 대원관광 유료 셔틀 운영사만 안내하고, 운영사 판매 화면은 25/26 시즌이어서 26/27 노선은 미발표입니다."
  },
  {
    resortId: "alpensia",
    targetSeason: UPCOMING_SEASON,
    category: "lift",
    status: "published",
    sources: [
      { name: "알펜시아 스키700 리프트 요금", url: "https://www.alpensia.com/ski/use-cost-lift.do" },
      { name: "알펜시아 공식 시즌권 안내", url: "https://m.alpensia.com/ski/use-season.do" },
      { name: "NOL 26/27 X6+ 시즌패스 보도자료", url: "https://nol-universe.com/ko/newsroom/pressRelease/detail?prNo=2544" }
    ],
    lastCheckedAt: "2026-11-19",
    nextCheckAfter: "2026-12-15",
    note: "공식 리프트 요금표가 '26/27 시즌'으로 게시되어 오전·오후권(4h), 야간권(night), 주간권(full_day), 후야권(7h)을 등록했습니다. 2h·3h·6h는 26/27 표에 없어 미등록입니다. 개장일은 '오픈일'로만 표기되어 시작일은 12월 1일로 두었습니다.",
    announcedFacts: [
      { label: "26/27 시즌패스", value: "X6+ 통합권 참여 리조트" },
      { label: "운영 일정", value: "오픈일 ~ 2027-03-07 · 야간 2026-12-19 ~ 2027-02-13" }
    ]
  },
  {
    resortId: "alpensia",
    targetSeason: UPCOMING_SEASON,
    category: "rental",
    status: "published",
    sources: [{ name: "알펜시아 스키700 렌탈 & 시설 이용 요금", url: "https://www.alpensia.com/ski/use-cost-rental.do" }],
    lastCheckedAt: "2026-11-19",
    nextCheckAfter: "2026-12-15",
    note: "공식 렌탈 표에 시즌 표기는 없지만 같은 페이지의 운영 일정이 26/27(2027-03-07 폐장)입니다. 스키·보드(반일 32,000원~당일 50,000원)와 의류 세트(반일 20,000원~당일 35,000원)로 등록했고 부분 렌탈·헬멧은 대표값에 넣지 않았습니다."
  },
  {
    resortId: "alpensia",
    targetSeason: UPCOMING_SEASON,
    category: "shuttle",
    status: "checked_unpublished",
    sources: [
      { name: "알펜시아 공식 대중교통 안내", url: "https://www.alpensia.com/guide/directions-public.do" },
      { name: "대원관광 KD 교통시즌권", url: "https://skibus.purplebus.co.kr/" }
    ],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 교통 안내와 대원관광 판매 화면에서 26/27 서울·진부역 셔틀의 운행 기간·시간표·요금을 확인할 수 없습니다."
  },
  {
    resortId: "oakvalley",
    targetSeason: UPCOMING_SEASON,
    category: "lift",
    status: "preliminary",
    sources: [{ name: "오크밸리 공지사항", url: "https://oakvalley.co.kr/customer-service/notice" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "26/27 스키·눈놀이동산 시즌권 1차 판매 공지는 확인했지만, 일반 방문용 일일 리프트권 가격표는 아직 없습니다.",
    announcedFacts: [
      { label: "시즌권", value: "26/27 1차 판매 공지 · 2026-09-09" },
      { label: "일일 리프트 요금", value: "미게시" }
    ]
  },
  {
    resortId: "oakvalley",
    targetSeason: UPCOMING_SEASON,
    category: "rental",
    status: "checked_unpublished",
    sources: [{ name: "오크밸리 고객 서비스 센터", url: "https://oakvalley.co.kr/customer-service/service" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 고객 서비스 화면은 렌탈샵 연락처만 제공하며 26/27 장비·의류 가격표는 공개하지 않았습니다."
  },
  {
    resortId: "oakvalley",
    targetSeason: UPCOMING_SEASON,
    category: "shuttle",
    status: "checked_unpublished",
    sources: [
      { name: "오크밸리 공식 25/26 고객 셔틀 공지", url: "https://oakvalley.co.kr/customer-service/notice/1432674" },
      { name: "오크밸리 교통 안내", url: "https://oakvalley.co.kr/overview/location" }
    ],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 고객 셔틀 자료는 25/26 시즌 기준이며 고객센터도 서울·경기 노선을 미기재해 26/27 운행표는 확인되지 않았습니다."
  },
  {
    resortId: "o2",
    targetSeason: UPCOMING_SEASON,
    category: "lift",
    status: "preliminary",
    sources: [
      { name: "오투리조트 스키 리프트 요금", url: "https://www.o2resort.com/GDE/totalPrice_skiLift.jsp" },
      { name: "무주 덕유산리조트 26/27 시즌권 안내", url: "https://www.mdysresort.com/ski/buy_season_pass04.asp" }
    ],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "오투 단독 리프트 요금표에는 시즌 표기가 없습니다. 무주·오투 통합 시즌권 판매는 확인했지만 26/27 일일권 가격으로 보지 않았습니다.",
    announcedFacts: [
      { label: "26/27 시즌패스", value: "무주·오투 통합권 I·II 판매" },
      { label: "이용 기간", value: "2026년 개장일 ~ 2027년 폐장일" }
    ]
  },
  {
    resortId: "o2",
    targetSeason: UPCOMING_SEASON,
    category: "rental",
    status: "checked_unpublished",
    sources: [
      { name: "오투리조트 스키 렌탈 요금", url: "https://www.o2resort.com/GDE/totalPrice_skiRental.jsp" },
      { name: "오투리조트 스키 공지", url: "https://www.o2resort.com/news/list.xhtml?division=0004&limit=10&page=3" }
    ],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 렌탈 표는 시즌 미표기 가격이며 26/27 장비 시승회 공지는 신제품 체험 행사로 일반 대여 가격이 아니어서 규칙을 생성하지 않았습니다."
  },
  {
    resortId: "o2",
    targetSeason: UPCOMING_SEASON,
    category: "shuttle",
    status: "checked_unpublished",
    sources: [{ name: "오투리조트 공식 교통·셔틀 안내", url: "https://o2resort.com/mobile/traffic/" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "태백역·콘도 연계 시간표는 공개돼 있으나 시즌 운영 기간이 없어 26/27 확정 셔틀로 전환하지 않았습니다."
  },
  {
    resortId: "muju",
    targetSeason: UPCOMING_SEASON,
    category: "lift",
    status: "preliminary",
    sources: [
      { name: "무주 덕유산리조트 스키 요금안내", url: "https://www.mdysresort.com/ski/charge.asp" },
      { name: "무주 덕유산리조트 시즌권", url: "https://www.mdysresort.com/ski/buy_season_pass04.asp" }
    ],
    lastCheckedAt: "2026-11-19",
    nextCheckAfter,
    note: "26/27 무주 통합 시즌권과 무주·오투 통합 시즌권 판매 및 2차 할인 가격표를 확인했습니다. 일일 리프트 요금은 26/27로 갱신되지 않았습니다. 2026-11-19 Chrome 확인: 요금 안내 이미지는 '26/27 시즌, 더 좋은 모습으로 찾아뵙겠습니다' 준비 안내입니다.",
    announcedFacts: [
      { label: "시즌패스", value: "무주 통합권 I·II 및 무주·오투 통합권 I·II" },
      { label: "이용 기간", value: "2026년 개장일 ~ 2027년 폐장일" },
      { label: "2차 할인", value: "공식 시즌권 가격표 게시" }
    ]
  },
  {
    resortId: "muju",
    targetSeason: UPCOMING_SEASON,
    category: "rental",
    status: "checked_unpublished",
    sources: [{ name: "무주 덕유산리조트 스키 요금안내", url: "https://www.mdysresort.com/ski/charge.asp" }],
    lastCheckedAt: "2026-11-19",
    nextCheckAfter,
    note: "공식 요금 화면에서 26/27 장비·의류 렌탈 가격과 유효 기간을 확인할 수 없습니다. 2026-11-19 Chrome 확인: 같은 요금 안내 이미지가 26/27 준비 안내입니다."
  },
  {
    resortId: "muju",
    targetSeason: UPCOMING_SEASON,
    category: "shuttle",
    status: "checked_unpublished",
    sources: [
      { name: "무주 덕유산리조트 공식 셔틀", url: "https://www.mdysresort.com/guide/shuttle_bus.asp" },
      { name: "무주레져투어 스키버스", url: "http://www.mujuro.co.kr/costbus/03_costbus_05.php" }
    ],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 단지 셔틀에는 26/27 기간이 없고 외부 운영사 화면도 25/26 시간표만 안내해 다음 시즌 일일 스키버스는 미발표입니다."
  },
  {
    resortId: "edenvalley",
    targetSeason: UPCOMING_SEASON,
    category: "lift",
    status: "checked_unpublished",
    sources: [
      { name: "에덴밸리 스키장 공식 공지", url: "https://www.edenvalley.co.kr/Inc_board/inc_list.asp?ConfigPID=1&Find=&GotoPage=25&Search=" },
      { name: "에덴밸리 25/26 시즌권 약관", url: "https://edenvalley.co.kr/images/Ski/2526season/2526%EC%8B%9C%EC%A6%8C%EA%B6%8C%EC%95%BD%EA%B4%80%28%EC%9D%BC%EB%B0%98%29.pdf" }
    ],
    lastCheckedAt: "2026-11-19",
    nextCheckAfter,
    note: "공식 공지는 25/26 시즌이 2026년 3월 1일 종료됐음을 안내하고 약관도 25/26 기준이어서 26/27 리프트 가격은 미발표입니다. 2026-11-19 Chrome 확인: 공지 게시판의 최신 글이 2026-02-23 폐장 안내이며 26/27 공지가 없습니다. 2025-09에 사전회생계획안 신청 안내 공지가 있어 운영 여부도 함께 확인이 필요합니다."
  },
  {
    resortId: "edenvalley",
    targetSeason: UPCOMING_SEASON,
    category: "rental",
    status: "checked_unpublished",
    sources: [{ name: "에덴밸리 스키장 공식 공지", url: "https://www.edenvalley.co.kr/Inc_board/inc_list.asp?ConfigPID=1&Find=&GotoPage=25&Search=" }],
    lastCheckedAt: "2026-11-19",
    nextCheckAfter,
    note: "공식 목록에는 25/26 리프트·렌탈 패키지만 남아 있고 26/27 장비·의류 일반 렌탈 가격표는 없습니다. 2026-11-19 Chrome 확인: 공지 게시판의 최신 글이 2026-02-23 폐장 안내이며 26/27 공지가 없습니다."
  },
  {
    resortId: "edenvalley",
    targetSeason: UPCOMING_SEASON,
    category: "shuttle",
    status: "checked_unpublished",
    sources: [{ name: "에덴밸리 공식 교통 안내", url: "https://www.edenvalley.co.kr/CS/View.asp?location=06" }],
    lastCheckedAt: "2026-11-19",
    nextCheckAfter,
    note: "공식 교통 화면에서 26/27 부산·양산 또는 대구 출발 스키 셔틀의 운행 기간·시간표·요금이 게시되지 않았습니다. 2026-11-19 Chrome 확인: 공지 게시판의 최신 글이 2026-02-23 폐장 안내이며 26/27 공지가 없습니다."
  }
];
