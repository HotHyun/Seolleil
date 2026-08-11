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
  },
  {
    resortId: "konjiam",
    targetSeason: UPCOMING_SEASON,
    category: "lift",
    status: "checked_unpublished",
    sources: [{ name: "곤지암리조트 25/26 얼리버드 리프트권", url: "https://m.konjiamresort.co.kr/contact/noticeView.dev?idx=1603" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 판매 공지는 25/26 시즌 4·6시간권만 안내하며 26/27 일일 리프트권 또는 시즌권 가격은 게시되지 않았습니다."
  },
  {
    resortId: "konjiam",
    targetSeason: UPCOMING_SEASON,
    category: "rental",
    status: "checked_unpublished",
    sources: [
      { name: "곤지암리조트 25/26 리프트·렌탈 패키지", url: "https://m.konjiamresort.co.kr/contact/noticeView.dev?idx=1603" },
      { name: "곤지암리조트 리프트·장비 렌탈 예약 가이드", url: "https://reservation.konjiamresort.co.kr/view/buySkiPassGuide.do" }
    ],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "예약 가이드는 장비 렌탈 절차만, 판매 공지는 25/26 패키지만 안내해 26/27 일반 장비·의류 가격으로 등록할 수 없습니다."
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
    status: "checked_unpublished",
    sources: [{ name: "지산리조트 리프트·렌탈 종합요금", url: "https://www.jisanresort.co.kr/w/ski/use/rental.asp" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 표는 명시적으로 25/26 시즌 2·3·4·6시간 리프트 요금이며 26/27 가격표는 아직 없습니다."
  },
  {
    resortId: "jisan",
    targetSeason: UPCOMING_SEASON,
    category: "rental",
    status: "checked_unpublished",
    sources: [{ name: "지산리조트 리프트·렌탈 종합요금", url: "https://www.jisanresort.co.kr/w/ski/use/rental.asp" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 장비 렌탈 표가 25/26 시즌으로 표시되어 26/27 장비·의류 가격 규칙은 생성하지 않았습니다."
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
    status: "checked_unpublished",
    sources: [{ name: "엘리시안 강촌 스키 이용안내", url: "https://www.elysian.co.kr/about-gangchon/ski" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 화면의 운영 기간과 성수기 구간이 2025년 12월~2026년 3월로 남아 있어 26/27 SMART 리프트 요금은 미발표 상태입니다."
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
    status: "checked_unpublished",
    sources: [{ name: "웰리힐리파크 스노우파크", url: "https://www.wellihillipark.com/snowpark" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 사이트는 여름 운영과 스노우파크 휴장을 안내하고 있으며 26/27 일일 리프트권 또는 시즌권 가격은 공개하지 않았습니다."
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
      { name: "대원관광 KD 교통시즌권", url: "https://skibus.purplebus.co.kr/Shop/YpSeason25/" }
    ],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 화면은 대원관광 유료 셔틀 운영사만 안내하고, 운영사 판매 화면은 25/26 시즌이어서 26/27 노선은 미발표입니다."
  },
  {
    resortId: "alpensia",
    targetSeason: UPCOMING_SEASON,
    category: "lift",
    status: "preliminary",
    sources: [{ name: "알펜시아 공식 시즌권 안내", url: "https://m.alpensia.com/ski/use-season.do" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 시즌권 데이터에 26/27 시즌 준비중 상태가 표시됐지만 판매 가격과 일일 리프트권 가격은 아직 없습니다.",
    announcedFacts: [
      { label: "시즌권 상태", value: "26/27 시즌 준비중" },
      { label: "판매 가격", value: "미게시" }
    ]
  },
  {
    resortId: "alpensia",
    targetSeason: UPCOMING_SEASON,
    category: "rental",
    status: "checked_unpublished",
    sources: [{ name: "알펜시아 스키700 종합이용요금", url: "https://www.alpensia.com/guide/total-use-cost-ski.do" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 렌탈 표의 가격 칸은 비어 있고 운영 기간도 2026년 3월 2일까지인 기존 시즌이어서 26/27 장비·의류 가격은 미발표입니다."
  },
  {
    resortId: "alpensia",
    targetSeason: UPCOMING_SEASON,
    category: "shuttle",
    status: "checked_unpublished",
    sources: [
      { name: "알펜시아 공식 대중교통 안내", url: "https://www.alpensia.com/guide/directions-public.do" },
      { name: "대원관광 KD 교통시즌권", url: "https://skibus.purplebus.co.kr/Shop/YpSeason25/" }
    ],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 교통 안내와 대원관광 판매 화면에서 26/27 서울·진부역 셔틀의 운행 기간·시간표·요금을 확인할 수 없습니다."
  },
  {
    resortId: "oakvalley",
    targetSeason: UPCOMING_SEASON,
    category: "lift",
    status: "checked_unpublished",
    sources: [{ name: "오크밸리 공식 공지", url: "https://oakvalley.co.kr/customer-service/notice" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 공지 목록에 26/27 시즌권 또는 일일 리프트권 판매 공지가 없습니다."
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
    status: "checked_unpublished",
    sources: [{ name: "오투리조트 스키 리프트 요금", url: "https://www.o2resort.com/GDE/totalPrice_skiLift.jsp" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 리프트 요금표에 시즌 유효 기간이 없고 26/27 표기도 없어 다음 시즌 가격으로 등록하지 않았습니다."
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
    status: "checked_unpublished",
    sources: [
      { name: "무주 덕유산리조트 스키 요금안내", url: "https://www.mdysresort.com/ski/charge.asp" },
      { name: "무주 덕유산리조트 시즌권", url: "https://www.mdysresort.com/ski/buy_season_pass04.asp" }
    ],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 시즌권 화면은 25/26 판매요금과 2026년 폐장일까지의 이용 기간만 표시하며 26/27 일일권·시즌권은 미발표입니다."
  },
  {
    resortId: "muju",
    targetSeason: UPCOMING_SEASON,
    category: "rental",
    status: "checked_unpublished",
    sources: [{ name: "무주 덕유산리조트 스키 요금안내", url: "https://www.mdysresort.com/ski/charge.asp" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 요금 화면에서 26/27 장비·의류 렌탈 가격과 유효 기간을 확인할 수 없습니다."
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
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 공지는 25/26 시즌이 2026년 3월 1일 종료됐음을 안내하고 약관도 25/26 기준이어서 26/27 리프트 가격은 미발표입니다."
  },
  {
    resortId: "edenvalley",
    targetSeason: UPCOMING_SEASON,
    category: "rental",
    status: "checked_unpublished",
    sources: [{ name: "에덴밸리 스키장 공식 공지", url: "https://www.edenvalley.co.kr/Inc_board/inc_list.asp?ConfigPID=1&Find=&GotoPage=25&Search=" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 목록에는 25/26 리프트·렌탈 패키지만 남아 있고 26/27 장비·의류 일반 렌탈 가격표는 없습니다."
  },
  {
    resortId: "edenvalley",
    targetSeason: UPCOMING_SEASON,
    category: "shuttle",
    status: "checked_unpublished",
    sources: [{ name: "에덴밸리 공식 교통 안내", url: "https://www.edenvalley.co.kr/CS/View.asp?location=06" }],
    lastCheckedAt: checkedAt,
    nextCheckAfter,
    note: "공식 교통 화면에서 26/27 부산·양산 또는 대구 출발 스키 셔틀의 운행 기간·시간표·요금이 게시되지 않았습니다."
  }
];
