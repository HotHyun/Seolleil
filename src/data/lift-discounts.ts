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
  /** 페이지 제목에 쓰는 이름. 예: "장비·의류 렌탈" */
  label: string;
  /** 렌탈 표에 시즌 표기가 없는 등 시즌 연결에 판단이 들어간 경우의 안내 */
  seasonNote?: string;
  /** 할인 안내 아래 한 줄. 할인에서 빠지는 품목 설명 */
  discountNote?: string;
  /** 렌탈 할인 카드의 품목 이름 옆에 붙이는 기준. 예: "6시간 기준" */
  discountCardBasis?: string;
  /** 렌탈 할인 카드에 보여 줄 장비 품목 id. 없으면 할인 가능한 장비 전체 */
  discountCardItemIds?: string[];
  /** 1인 비용 예시 구성 */
  example?: { liftSlot: "2h" | "3h" | "4h" | "5h" | "6h" | "7h"; equipmentId: string; clothingId?: string; description: string };
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
  /** 할인 적용 결제금액을 이 단위로 반올림한다. 기본 1원 */
  roundTo?: number;
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
      label: "장비·의류 렌탈",
      seasonNote: "렌탈 표 자체에는 시즌 표기가 없어 현재 게시된 공식 요금을 26/27 요금으로 보여 줘요.",
      discountNote: "부분 렌탈(플레이트·데크, 부츠 단품)은 우대 할인을 받을 수 없어요.",
      example: { liftSlot: "4h", equipmentId: "equip-full", clothingId: "cloth-full", description: "4시간권 + 장비 풀세트 + 의류 풀세트(4시간 이하)를 한 번에 빌리는 경우예요. 의류는 할인 없이 계산했어요." },
      discountCardBasis: "6시간 기준",
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
  },
  {
    resortId: "vivaldi",
    season: "2026-2027",
    sourceName: "비발디파크 스키&보드 요금&할인",
    sourceUrl: "https://www.sonohotelsresorts.com/skiboard/discount",
    lastCheckedAt: "2026-11-26",
    roundTo: 10,
    discounts: [
      {
        id: "card",
        group: "anyone",
        title: "제휴카드",
        target: "신한·KB국민·NH농협·하나·우리·BC · 본인 및 동반 3인",
        rates: { lift: 30, rental: 30 },
        highlight: true,
        notes: ["결제 카드가 제휴카드일 때 적용돼요.", "카드 본인과 동반 3인까지 할인돼요."]
      },
      {
        id: "guest",
        group: "anyone",
        title: "비발디파크 객실 투숙객",
        target: "동반 4인 · 객실 예약 문자와 객실 키 확인",
        rates: { lift: 20, rental: 20 },
        highlight: true,
        notes: ["객실 예약 문자와 객실 키를 보여 주세요.", "투숙객 본인과 동반 4인까지 적용돼요."]
      },
      {
        id: "member-companion",
        group: "verified",
        title: "회원 동반(기명·무기명)",
        target: "회원 카드 소지자 동반 시 최대 3인",
        rates: { lift: 30, rental: 30 },
        notes: ["회원 카드를 가진 사람과 함께 갈 때 적용돼요."]
      },
      {
        id: "local",
        group: "verified",
        title: "지역주민",
        target: "본인 · 신분증 소지",
        rates: { lift: 30, rental: 30 },
        notes: ["대상 지역: 홍천, 춘천, 양평, 횡성, 가평, 인제, 제천, 단양, 원주, 하남, 구리, 남양주, 여주, 이천, 의정부"]
      },
      {
        id: "senior",
        group: "verified",
        title: "국가유공자·경로·장애인",
        target: "본인 · 관련 신분증 소지 · 경로는 만 65세 이상",
        rates: { lift: 40, rental: 40 },
        notes: ["관련 신분증이 필요해요."]
      },
      {
        id: "owner-named",
        group: "verified",
        title: "리조트 분양회원(기명)",
        target: "본인 · 회원카드 소지",
        rates: { lift: 50, rental: 50 },
        notes: ["회원권에 따라 혜택이 달라질 수 있어요."]
      },
      {
        id: "owner-unnamed",
        group: "verified",
        title: "리조트 분양회원(무기명)",
        target: "회원카드 또는 무기명 할인쿠폰 소지자",
        rates: { lift: 40, rental: 40 },
        notes: ["회원권에 따라 혜택이 달라질 수 있어요."]
      }
    ],
    rental: {
      label: "장비·헬멧 렌탈",
      seasonNote: "요금표 자체에 시즌 표기가 없어 현재 게시된 공식 요금을 26/27 요금으로 보여 줘요.",
      discountNote: "안전헬멧은 균일가라 할인을 받을 수 없어요.",
      discountCardItemIds: ["eq-6h-adult", "eq-7h-adult", "eq-8h-adult"],
      example: { liftSlot: "5h", equipmentId: "eq-6h-adult", description: "5시간권과 그에 맞는 장비 6시간(대인)을 빌리는 경우예요. 장비 대여 시간은 리프트권보다 1시간 길어요. 헬멧·의류는 포함하지 않았어요." },
      equipmentBasis: "대인·소인 구분, 리프트권 이용 시간보다 1시간 길게 대여",
      equipment: [
        { id: "eq-6h-adult", label: "6시간 · 대인", detail: "리프트 5시간권에 맞는 대여 시간", prices: [{ label: "주중", price: 34_000 }, { label: "주말", price: 43_000 }], discountable: true },
        { id: "eq-7h-adult", label: "7시간 · 대인", detail: "리프트 6시간권에 맞는 대여 시간", prices: [{ label: "주중", price: 36_000 }, { label: "주말", price: 45_000 }], discountable: true },
        { id: "eq-8h-adult", label: "8시간 · 대인", detail: "리프트 7시간권에 맞는 대여 시간", prices: [{ label: "주중", price: 38_000 }, { label: "주말", price: 47_000 }], discountable: true },
        { id: "eq-6h-child", label: "6시간 · 소인", detail: "4세~13세(초등학생)", prices: [{ label: "주중", price: 31_000 }, { label: "주말", price: 39_000 }], discountable: true },
        { id: "eq-7h-child", label: "7시간 · 소인", detail: "4세~13세(초등학생)", prices: [{ label: "주중", price: 32_000 }, { label: "주말", price: 40_000 }], discountable: true },
        { id: "eq-8h-child", label: "8시간 · 소인", detail: "4세~13세(초등학생)", prices: [{ label: "주중", price: 34_000 }, { label: "주말", price: 42_000 }], discountable: true }
      ],
      clothing: [],
      protective: [
        { id: "helmet-6h", label: "안전헬멧 6시간", detail: "대·소인 균일가, 주중·주말·휴일 동일", prices: [{ label: "요금", price: 5_000 }], discountable: false },
        { id: "helmet-7h", label: "안전헬멧 7시간", detail: "대·소인 균일가, 주중·주말·휴일 동일", prices: [{ label: "요금", price: 6_000 }], discountable: false },
        { id: "helmet-8h", label: "안전헬멧 8시간", detail: "대·소인 균일가, 주중·주말·휴일 동일", prices: [{ label: "요금", price: 7_000 }], discountable: false }
      ],
      howTo: [],
      location: [],
      notices: [
        "의류 렌탈 가격은 공식 요금표에 없어요.",
        "렌탈 할인도 리프트권 할인과 같은 조건이에요. 현장 결제만 해당하고, 중복되지 않고 가장 높은 할인율 하나가 적용돼요. 결제금액은 10원 단위로 반올림해요.",
        "렌탈 시간을 넘기면 30분당 5,000원의 반납 지연료가 붙고, 하루 최대 100,000원까지 부과돼요.",
        "장비를 반납하지 않거나 잃어버리면 배상해야 해요. 스키 플레이트(바인딩 포함) 200,000원, 스키 부츠 88,000원, 스키폴 8,000원, 보드 데크(바인딩 포함) 250,000원, 보드 부츠 79,000원, 안전헬멧 21,000원, 보관함·홀더 키 10,000원이에요."
      ]
    },
    extras: [
      { label: "신한카드", value: "마이신한 포인트 사용 가능" },
      { label: "KB국민카드", value: "포인트리 사용 가능" },
      { label: "현대카드", value: "M포인트 사용 가능", note: "정상가 기준 최대 40%까지 쓸 수 있어요." },
      { label: "AK상품권 · 국민관광상품권", value: "결제 가능" },
      { label: "단체 교환권(기업체 전용)", value: "구매 수량에 따라 최대 52%", note: "소노 레저 이용권. 단체(학생·기업) 현장 이용 문의 소노예약센터 1588-4888." }
    ],
    notices: [
      "주중은 월~금, 주말은 토·일·공휴일 요금이에요. 소인은 4세 이상 13세 이하(2014년 1월 1일~2023년 12월 31일 출생)예요.",
      "할인은 현장 결제와 정상요금에만 적용되고, 1일(9시~다음 날 3시) 1회 기준이에요.",
      "할인은 중복되지 않고, 받을 수 있는 가장 높은 할인율 하나가 적용돼요.",
      "할인율을 적용한 결제금액은 10원 단위로 반올림해요(예: 36,220원 → 36,200원).",
      "할인 혜택은 예고 없이 바뀌거나 끝날 수 있어요. 회원카드·신분증 등 필요한 것을 챙기세요.",
      "슬로프 정설시간(17:30~19:00)에는 슬로프를 쓸 수 없어요. 스키·보드 장비를 착용해야 입장할 수 있어요(썰매 반입 불가)."
    ]
  }
];

export function getResortLiftGuide(resortId: string) {
  return resortLiftGuides.find((guide) => guide.resortId === resortId);
}
