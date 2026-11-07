export type OfficialLodgingOffer = {
  title: string;
  priceSummary: string;
  period?: string;
  note?: string;
  url: string;
};

export type OfficialLodgingSalesSnapshot = {
  resortId: string;
  checkedAt: string;
  statusLabel: string;
  statusSummary: string;
  winterPriceStatus: "published" | "partial" | "not_published";
  reservationUrl: string;
  offers: OfficialLodgingOffer[];
};

// 2026-10-30 조사 기록을 옮긴 정적 스냅샷입니다. 예약 가능 객실은 날짜와 회원 조건에 따라 바뀝니다.
export const officialLodgingSales: OfficialLodgingSalesSnapshot[] = [
  {
    resortId: "konjiam",
    checkedAt: "2026-10-30",
    statusLabel: "날짜별 예약 조회",
    statusSummary: "공식 객실 예약 시스템이 운영 중입니다. 2027년 2~4월 예약 오픈 안내가 게시되어 있으며, 날짜별 잔여 객실은 예약 화면에서 확인해야 합니다.",
    winterPriceStatus: "partial",
    reservationUrl: "https://reservation.konjiamresort.co.kr/",
    offers: [{
      title: "24시간 STAY 룸온리",
      priceSummary: "140,000~310,000원/박",
      period: "월~목 비수기 시작가",
      note: "프라임 3인 14만원, 디럭스 5인 17만원, 노블 6인 22만원, 로얄 7인 31만원부터. 실제 요금은 날짜와 객실 재고에 따라 달라집니다.",
      url: "https://m.konjiamresort.co.kr/condo/package.dev?idx=PK26000052"
    }]
  },
  {
    resortId: "jisan",
    checkedAt: "2026-10-30",
    statusLabel: "예약 시점 확인",
    statusSummary: "공식 콘도 예약 달력에서 날짜별 잔여 객실을 조회할 수 있습니다. 26/27 겨울 별도 추첨·일괄 판매 공지는 확인되지 않았으며 회원 유형에 따라 접수 시점이 다릅니다.",
    winterPriceStatus: "not_published",
    reservationUrl: "https://www.jisanresort.co.kr/w/reservation/condo/condo.asp",
    offers: []
  },
  {
    resortId: "vivaldi",
    checkedAt: "2026-10-30",
    statusLabel: "회원 예약 오픈",
    statusSummary: "26/27 겨울 성수기 회원 추첨 결과 발표와 객실 오픈은 10월 27일 진행되었습니다. 특정 날짜의 잔여 객실과 자격 조건은 공식 예약 화면에서 확인해야 합니다.",
    winterPriceStatus: "partial",
    reservationUrl: "https://www.sonohotelsresorts.com/main/reservationinfo",
    offers: [{
      title: "소노캄 30시간 로맨틱 스테이",
      priceSummary: "160,000원/박부터",
      period: "투숙 2026-08-23~12-17 · 판매 2026-08-07~12-16",
      note: "객실, 와인 1병, 액티비티 이용권 2매 포함 상품입니다. 날짜별 최종 금액은 예약 화면에서 확인하세요.",
      url: "https://www.sonohotelsresorts.com/reserve/newAndHot/dtl?salesNo=291086"
    }]
  },
  {
    resortId: "elysian",
    checkedAt: "2026-10-30",
    statusLabel: "날짜별 예약 조회",
    statusSummary: "객실 현황·예약과 룸 패키지 판매 경로가 운영 중입니다. 26/27 겨울 별도 오픈 일정은 확인되지 않아 날짜별 객실 현황에서 판매 여부를 확인해야 합니다.",
    winterPriceStatus: "not_published",
    reservationUrl: "https://www.elysian.co.kr/",
    offers: []
  },
  {
    resortId: "phoenix",
    checkedAt: "2026-10-30",
    statusLabel: "객실 상품 판매 중",
    statusSummary: "공식 객실 예약 달력에서 잔여 객실을 조회할 수 있습니다. 확인한 상품은 2026년 11~12월까지 이용 가능하며, 26/27 겨울 전용 패키지 오픈일은 별도로 확인되지 않았습니다.",
    winterPriceStatus: "partial",
    reservationUrl: "https://phoenixhnr.co.kr/page/reservation/pyeongchang/room?step=1",
    offers: [
      {
        title: "ROOM ONLY 스마트 초이스",
        priceSummary: "129,000원/박부터",
        period: "투숙 2026-08-01~12-17",
        note: "콘도 객실 상품이며 조식 2인을 선택할 수 있습니다. 날짜와 객실 유형에 따라 금액이 달라집니다.",
        url: "https://phoenixhnr.co.kr/page/pyeongchang/board/package"
      },
      {
        title: "휘닉스 세일 페스타 콘도",
        priceSummary: "158,000원/박부터",
        period: "투숙 2026-09-14~11-22",
        note: "객실 1~2박, 조식 1회와 블루캐니언 1회가 포함된 패키지입니다.",
        url: "https://phoenixhnr.co.kr/page/pyeongchang/board/package"
      }
    ]
  },
  {
    resortId: "yongpyong",
    checkedAt: "2026-10-30",
    statusLabel: "회원 추첨 · 쿠폰 판매 예정",
    statusSummary: "26/27 겨울 성수기 콘도 회원 추첨 공지가 게시되었습니다. 시즌패스 객실 쿠폰은 11월 1일 판매 시작, 겨울 피크 예약은 11월 2일부터 잔여 객실에 한해 진행됩니다.",
    winterPriceStatus: "published",
    reservationUrl: "https://www.yongpyong.co.kr/kor/guide/package/read.do?packageCate1=YP&packageId=MHP2701",
    offers: [
      {
        title: "조식은못참지 패키지",
        priceSummary: "148,000원/박부터",
        period: "투숙 2026-08-24~12-03",
        note: "객실 1박과 조식 뷔페 구성입니다.",
        url: "https://www.yongpyong.co.kr/kor/guide/package/list.do"
      },
      {
        title: "26/27 X6+ 시즌패스 구매자 객실 쿠폰",
        priceSummary: "100,000원부터 · 겨울 피크 150,000~400,000원/박",
        period: "이용 2026-11-01~2027-06-30",
        note: "시즌패스 구매자 전용이며 체크인 때 실물 시즌패스를 제시해야 합니다. 겨울 피크(12/12~2/28)는 객실·요일별 요금이 다릅니다.",
        url: "https://www.yongpyong.co.kr/kor/guide/package/read.do?packageCate1=YP&packageId=MHP2701"
      }
    ]
  },
  {
    resortId: "wellihilli",
    checkedAt: "2026-10-30",
    statusLabel: "회원 추첨 안내",
    statusSummary: "26/27 시즌 콘도회원 객실 추첨 공지가 게시되었습니다. 공개 페이지에서 세부 일정과 비회원 잔여 객실 판매일은 확인되지 않았습니다.",
    winterPriceStatus: "not_published",
    reservationUrl: "https://www.wellihillipark.com/?seq=67",
    offers: []
  },
  {
    resortId: "oakvalley",
    checkedAt: "2026-10-30",
    statusLabel: "날짜별 예약 조회",
    statusSummary: "공식 객실·리조트 예약 메뉴가 운영 중입니다. 26/27 겨울 성수기 객실 오픈일은 공개 자료에서 확인되지 않아 숙박일별 예약 화면을 확인해야 합니다.",
    winterPriceStatus: "partial",
    reservationUrl: "https://app.oakvalley.co.kr/mobileapp/index.do",
    offers: [{
      title: "키즈 플레이 패키지",
      priceSummary: "31평 노블 168,800원~/캐릭터룸 203,800원~ (회원) · 비회원 181,800원~/237,800원~",
      period: "투숙 2026-09-04~12-17",
      note: "밸리 빌리지 1박, 액티비티 이용권과 조식 2인 구성입니다. 금·토 요금과 회원 자격에 따라 달라집니다.",
      url: "https://oakvalley.co.kr/specialoffer/1248633"
    }]
  },
  {
    resortId: "alpensia",
    checkedAt: "2026-10-30",
    statusLabel: "회원 잔여 객실 판매",
    statusSummary: "2026 겨울 성수기 분양회원 추첨 결과가 10월 28일 발표되었고, 미당첨·잔여 이용일 대상 선착순 예약이 10월 29일 시작되었습니다. 일반 투숙객 예약은 별도 경로입니다.",
    winterPriceStatus: "not_published",
    reservationUrl: "https://www.alpensia.com/reservation/index.do",
    offers: [{
      title: "NOVEMBER FLASH DEAL",
      priceSummary: "전화 문의",
      period: "2026년 11월 · 2박/54시간 스테이",
      note: "객실 2박 상품이며 공식 안내에 가격이 공개되지 않았습니다.",
      url: "https://www.alpensia.com/Event-Package/PackageDtl.do?packageSeq=1464"
    }]
  },
  {
    resortId: "o2",
    checkedAt: "2026-10-30",
    statusLabel: "겨울 판매 일정 미확인",
    statusSummary: "공식 객실 예약 경로는 운영 중이나 26/27 겨울 판매 오픈일과 객실별 잔여량은 공개 자료에서 확인되지 않았습니다.",
    winterPriceStatus: "not_published",
    reservationUrl: "https://o2resort.com/LDG/totalfeeGuide_condo.jsp",
    offers: [{
      title: "객실 이용요금표",
      priceSummary: "일반 135,000~200,000원/주중 · 150,000~230,000원/주말",
      period: "적용 2026-08-18~11-30",
      note: "인터넷회원·태백시민 요금은 자격에 따라 더 낮을 수 있습니다. 이 표는 겨울 요금이 아닙니다.",
      url: "https://o2resort.com/LDG/totalfeeGuide_condo.jsp"
    }]
  },
  {
    resortId: "muju",
    checkedAt: "2026-10-30",
    statusLabel: "날짜별 예약 조회",
    statusSummary: "객실 예약과 잔여 객실 현황을 날짜별로 제공하며 온라인 예약은 로그인해야 합니다. 26/27 겨울 별도 판매 개시일 공지는 확인되지 않았습니다.",
    winterPriceStatus: "not_published",
    reservationUrl: "https://www.mdysresort.com/accom/hotel_reserve.asp",
    offers: [{
      title: "호텔티롤 객실 요금표",
      priceSummary: "주중 160,000~440,000원 · 주말 220,000~480,000원/박",
      period: "추계 적용 2026-08-21~11-30",
      note: "객실 유형별 요금입니다. 12월 이후 겨울 요금은 이 표와 다를 수 있습니다.",
      url: "https://www.mdysresort.com/accom/tirol_hotel.asp"
    }]
  },
  {
    resortId: "edenvalley",
    checkedAt: "2026-10-30",
    statusLabel: "전화 예약 확인",
    statusSummary: "26/27 겨울 판매 일정은 확인되지 않았습니다. 공식 안내에 따라 객실 예약실에 투숙일과 객실 요금을 문의해야 합니다.",
    winterPriceStatus: "not_published",
    reservationUrl: "https://www.edenvalley.co.kr/Reservation/Reser_Reservation.asp",
    offers: []
  },
  {
    resortId: "high1",
    checkedAt: "2026-10-30",
    statusLabel: "날짜별 예약 조회",
    statusSummary: "호텔·콘도 통합 예약 시스템에서 투숙일을 선택해 예약할 수 있습니다. 26/27 겨울 성수기 별도 오픈 공지와 공개 고정 요금은 확인되지 않았습니다.",
    winterPriceStatus: "not_published",
    reservationUrl: "https://reserve.high1.com/res/hb/HBIR100003.do",
    offers: []
  }
];

export function getOfficialLodgingSalesForResort(resortId: string) {
  return officialLodgingSales.find((snapshot) => snapshot.resortId === resortId);
}
