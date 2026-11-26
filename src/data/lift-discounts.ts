// 스키장 공식 요금 페이지의 우대(할인)율 안내. 정상가(prices.ts)와 따로 두며 예상 총액에는 반영하지 않는다.
// 할인율만 공식 값이고, 할인가는 화면에서 정상가에 곱해 계산한 참고값이다(공식 표에 할인가가 있으면 그 값과 같아야 한다).
// 쿠폰·카드사 즉시할인처럼 자주 바뀌는 혜택은 넣지 않는다.

export type DiscountRates = {
  /** 리프트권 할인율(%) */
  lift?: number;
  /** 장비 렌탈 할인율(%) */
  rental?: number;
  /** 강습 할인율(%) */
  lesson?: number;
  /** 눈썰매장 할인율(%) */
  sled?: number;
};

export type LiftDiscount = {
  id: string;
  /** 누구나 받을 수 있는 할인인지, 증빙·현장 구매가 필요한 할인인지 */
  group: "anyone" | "verified";
  title: string;
  /** 대상 한 줄 */
  target: string;
  rates: DiscountRates;
  /** 강습 할인에 붙는 조건. 예: "5:1 한정" */
  lessonNote?: string;
  /** 주중(월~목)에만 적용되면 true. 가격표에서 주말 칸을 비운다. */
  weekdayOnly?: boolean;
  /** 가격표 카드로 크게 보여 줄 할인 */
  highlight?: boolean;
  /** 조건 안내 */
  notes: string[];
};

export type RentalGuideItem = {
  id: string;
  label: string;
  detail?: string;
  prices: { label: string; price: number }[];
  /** 우대 할인을 받을 수 있는 품목인지. 공식 우대표에 없는 품목은 false로 둔다. */
  discountable: boolean;
};

export type RentalGuide = {
  equipment: RentalGuideItem[];
  clothing: RentalGuideItem[];
  protective: RentalGuideItem[];
  /** 장비 렌탈 가격 기준 안내. 예: "6시간 기준" */
  equipmentBasis: string;
  howTo: string[];
  location: { label: string; value: string }[];
  notices: string[];
};

export type ResortLiftGuide = {
  resortId: string;
  season: string;
  rental?: RentalGuide;
  discounts: LiftDiscount[];
  /** 정상가 표 밖에서 따로 파는 상품 */
  extras: { label: string; value: string; note?: string }[];
  /** 가격표 아래에 붙는 공통 유의사항 */
  notices: string[];
  sourceName: string;
  sourceUrl: string;
  lastCheckedAt: string;
};

export const resortLiftGuides: ResortLiftGuide[] = [
  {
    resortId: "konjiam",
    season: "2026-2027",
    sourceName: "곤지암리조트 공식 요금 안내",
    sourceUrl: "https://m.konjiamresort.co.kr/ski/skiInfo.dev",
    lastCheckedAt: "2026-11-26",
    discounts: [
      {
        id: "night",
        group: "anyone",
        title: "심야",
        target: "온라인 회원 · 1일 1회",
        rates: { lift: 35 },
        weekdayOnly: true,
        highlight: true,
        notes: ["월~목(공휴일 제외) 19시·20시 이용 시작 예매에 한해 적용돼요.", "금요일·주말·공휴일은 제외예요."]
      },
      {
        id: "card",
        group: "anyone",
        title: "제휴카드",
        target: "신한·우리·하나카드",
        rates: { lift: 25, rental: 25, lesson: 10 },
        lessonNote: "5:1 한정",
        highlight: true,
        notes: ["26/27 시즌 카드 할인은 신한·하나·우리카드에만 적용돼요.", "카드 종류와 상관없이 할인되지만 일부 클린(법인) 카드는 결제가 제한돼요."]
      },
      {
        id: "guest",
        group: "anyone",
        title: "투숙객",
        target: "실 투숙자 본인 · 객실 정원 내",
        rates: { lift: 30, rental: 30, lesson: 10 },
        lessonNote: "5:1 한정",
        highlight: true,
        notes: ["실 투숙 등록자만 온라인에서 적용할 수 있어요.", "현장에서 살 때는 객실 예약번호를 보여 주세요."]
      },
      {
        id: "lesson",
        group: "anyone",
        title: "강습 이용 고객",
        target: "본인 · 1일 1회",
        rates: { lift: 50, rental: 50 },
        notes: ["강습을 듣는 본인에게만 적용돼요."]
      },
      {
        id: "gwangju",
        group: "verified",
        title: "광주시민",
        target: "경기도 광주시 주소지 · 본인 등록 · 1일 1회",
        rates: { lift: 30, rental: 10, lesson: 10, sled: 20 },
        lessonNote: "5:1 한정",
        notes: ["다른 할인과 중복할 수 없어요.", "현장 구매만 가능해요."]
      },
      {
        id: "neighbor",
        group: "verified",
        title: "인근 주민",
        target: "도웅리·궁평리 주소지",
        rates: { lift: 50, rental: 50, lesson: 10, sled: 50 },
        lessonNote: "5:1 한정",
        notes: ["현장 구매만 가능해요."]
      },
      {
        id: "senior",
        group: "verified",
        title: "경로·장애·국가유공자",
        target: "본인 · 1일 1회 · 경로는 만 65세 이상",
        rates: { lift: 50, rental: 50, lesson: 50, sled: 50 },
        lessonNote: "5:1 한정",
        notes: ["현장 구매만 가능해요."]
      }
    ],
    rental: {
      equipmentBasis: "6시간 기준",
      equipment: [
        { id: "equip-full", label: "풀세트", detail: "스키 플레이트 + 스키 부츠 / 보드 데크 + 보드 부츠", prices: [{ label: "주중", price: 36_000 }, { label: "주말", price: 39_000 }], discountable: true },
        { id: "equip-plate", label: "스키 플레이트 · 보드 데크", detail: "단품(부분 렌탈)", prices: [{ label: "주중", price: 21_000 }, { label: "주말", price: 26_000 }], discountable: false },
        { id: "equip-boots", label: "스키 부츠 · 보드 부츠", detail: "단품(부분 렌탈)", prices: [{ label: "주중", price: 19_000 }, { label: "주말", price: 23_000 }], discountable: false }
      ],
      clothing: [
        { id: "cloth-full", label: "풀세트", detail: "상의 + 하의", prices: [{ label: "4시간 이하", price: 27_000 }, { label: "4시간 초과", price: 35_000 }], discountable: false },
        { id: "cloth-part", label: "부분(상의 또는 하의)", prices: [{ label: "4시간 이하", price: 21_000 }, { label: "4시간 초과", price: 26_000 }], discountable: false }
      ],
      protective: [
        { id: "helmet", label: "헬멧", prices: [{ label: "4시간 이하", price: 9_000 }, { label: "4시간 초과", price: 12_000 }], discountable: false },
        { id: "pad", label: "보호대", prices: [{ label: "1회", price: 10_000 }], discountable: false }
      ],
      howTo: [
        "스키하우스 1층에서 QR코드를 스캔하거나 모바일 앱으로 신청서를 내요.",
        "부츠·헬멧을 착용한 뒤 2층으로 에스컬레이터를 타고 이동해요.",
        "슬로프 베이스에 들어가기 전, 장비 지급 데스크에서 장비를 받아요."
      ],
      location: [
        { label: "부츠 렌탈", value: "스키하우스 1층" },
        { label: "부츠 외 장비", value: "스키하우스 2층 슬로프 베이스 야외 장비대여소" },
        { label: "의류 렌탈", value: "스키하우스 1층 · 슬로프 오픈 30분 전 ~ 마감 30분 후" },
        { label: "의류 문의", value: "031-8026-5647" }
      ],
      notices: [
        "의류 렌탈은 현장 접수만 가능해요(온라인 예약 불가). 대여소 앞에 탈의실이 있어요.",
        "공식 우대(할인)표에는 장비 렌탈만 있고 의류·보호장구는 없어, 의류와 보호장구는 할인 없이 계산했어요."
      ]
    },
    extras: [
      { label: "모바일 시간 추가 1시간", value: "주중 9,000원 · 주말 12,000원" },
      { label: "모바일 시간 추가 2시간", value: "주중 14,000원 · 주말 18,000원", note: "모바일로 2·4·6시간 리프트권을 쓴 뒤에만 추가할 수 있어요." }
    ],
    notices: [
      "부분 렌탈(플레이트·데크, 부츠 단품)은 우대 할인을 받을 수 없어요.",
      "지역 주민 우대는 2023년 10월 31일 이전 전입자만 받을 수 있고, 최근 6개월 이내 발급한 주민등록등본과 신분증이 필요해요. 이용자 모두 곤지암리조트 홈페이지에 미리 가입해야 해요.",
      "연회원은 회원사별로 우대가 달라요(투숙 시 리프트·렌탈 50%).",
      "할인 중복 적용 여부는 공식 안내에 없는 경우가 많아요. 구매 전 현장이나 공식 안내에서 확인하세요."
    ]
  }
];

export function getResortLiftGuide(resortId: string) {
  return resortLiftGuides.find((guide) => guide.resortId === resortId);
}
