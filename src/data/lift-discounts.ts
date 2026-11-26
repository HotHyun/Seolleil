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
  /** 주말(토·일·공휴일) 할인율이 주중과 다를 때. 위의 값은 주중이다. */
  weekend?: { lift?: number; rental?: number };
};

export type LiftDiscount = {
  id: string;
  /** 누구나 받을 수 있는 할인인지, 증빙·현장 구매가 필요한 할인인지 */
  group: "anyone" | "verified";
  title: string;
  /** 대상 한 줄 */
  target: string;
  rates: DiscountRates;
  /** 가이드에 periods가 있을 때 두 번째 기간의 할인율. rates는 첫 번째 기간이다. */
  altRates?: DiscountRates;
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
  /** 할인 가능 여부 문구를 바꾸고 싶을 때. 예: "할인 적용 여부는 공식 안내에 없어요" */
  discountLabel?: string;
};

export type RentalGuide = {
  /** 렌탈 요금 출처가 리프트 요금 출처와 다를 때 */
  source?: { name: string; url: string };
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
  example?: {
    liftSlot: "2h" | "3h" | "4h" | "5h" | "6h" | "7h";
    equipmentId: string;
    clothingId?: string;
    /** 요일 구분 열이 쓰는 장비 요금 라벨. 기본은 주중·주말 */
    equipmentPriceLabels?: { weekday?: string; weekend?: string; all?: string };
    /** 의류 요금 라벨. 기본은 첫 번째 요금 */
    clothingPriceLabel?: string;
    description: string;
  };
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
  /** 할인율이 기간(시즌)별로 다를 때 두 기간의 이름. discount.rates는 첫째, altRates는 둘째 기간 */
  periods?: [{ label: string; range: string }, { label: string; range: string }];
  /** 정상가 표의 시간권 이름을 바꾼다. 예: 8시간권을 종일 슬롯에 넣은 경우 */
  slotLabels?: Partial<Record<string, string>>;
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
  },
  {
    resortId: "elysian",
    season: "2026-2027",
    sourceName: "엘리시안 강촌 스키 이용요금",
    sourceUrl: "https://www.elysian.co.kr/about-gangchon/ski",
    lastCheckedAt: "2026-11-26",
    // 공식 페이지는 리프트 정상가 표만 게시한다. '기간별 우대율 안내'를 가리키지만 해당 표가 페이지에 없고 렌탈 요금도 없어 할인율·렌탈 가격은 등록하지 않는다.
    discounts: [],
    extras: [
      {
        label: "공식 판매대행 홈티켓 카드 전용 패키지",
        value: "리프트 + 장비 + 의류 70,000원 → 42,000원~(12/5~12/18), 49,000원~(12/19~2/28)",
        note: "NH채움카드(BC 제외)·신한카드·우리카드 전용이에요. 상품 구성(시간권)과 시즌은 판매처 상품 안내에서 확인하세요."
      }
    ],
    notices: [
      "표의 가격은 할인 적용 전 정상가예요. 공식 페이지는 '기간별 우대율 안내'를 가리키지만 현재 할인율 표가 게시돼 있지 않아 할인가는 싣지 못했어요.",
      "주중은 월~금, 주말은 토·일·공휴일이에요. 소인은 2014년 이후 출생한 초등학생 이하(2027년 초등학교 졸업예정자 포함)이고 나이를 증명하는 서류가 필요해요. 36개월 미만은 리프트를 탈 수 없어요.",
      "시간권은 게이트를 처음 통과한 시점부터 계산하고 정설시간(17:00~18:30)은 포함되지 않아요. 당일 운영시간 안에서는 자유롭게 드나들 수 있지만 다음 날로 넘길 수 없어요.",
      "발권 후 취소·교환·재발급은 장당 2,000원의 수수료가 있고, 게이트를 통과한 뒤에는 환불·교환이 안 돼요.",
      "시간권은 스키·보드를 착용하고 올라가는(상행) 용도예요. 장비 없이 상행·하행을 하려면 1회권을 따로 사야 해요.",
      "운영 기간은 2026년 11월 28일부터 3월 폐장일까지예요. 장비·의류 렌탈 요금은 공식 페이지에 없어요(스키·보드·스키복 대여실, 플레이트·부츠·폴 부분 대여 가능 · 문의 033-260-2000)."
    ]
  },
  {
    resortId: "yongpyong",
    season: "2026-2027",
    sourceName: "모나용평 리프트&렌탈요금",
    sourceUrl: "https://www.yongpyong.co.kr/kor/skiNboard/utilizationFee/rentCharge.do",
    lastCheckedAt: "2026-11-26",
    // 정상가 표의 8시간권은 데이터에서 종일 슬롯으로 등록돼 있다.
    slotLabels: { full_day: "8시간권" },
    periods: [
      { label: "하이시즌", range: "오픈일~12/4, 3/2~폐장일" },
      { label: "피크시즌", range: "12/5~3/1" }
    ],
    discounts: [
      {
        id: "card",
        group: "anyone",
        title: "제휴카드",
        target: "신한·하나·농협카드 · 본인 포함 4인",
        rates: { lift: 35, rental: 35 },
        altRates: { lift: 20, rental: 25 },
        highlight: true,
        notes: ["본인 포함 동반 3인까지 적용돼요. 체크카드와 신용카드가 같아요.", "카드사 사정에 따라 바뀔 수 있어요."]
      },
      {
        id: "guest",
        group: "anyone",
        title: "투숙객",
        target: "객실 투숙 정원",
        rates: { lift: 35, rental: 40 },
        altRates: { lift: 20, rental: 25 },
        highlight: true,
        notes: ["객실 투숙객 정원만큼 적용돼요."]
      },
      {
        id: "gangwon",
        group: "verified",
        title: "강원도민",
        target: "본인 · 증빙 제시",
        rates: { lift: 40, rental: 40 },
        altRates: { lift: 25, rental: 30 },
        notes: []
      },
      {
        id: "disabled",
        group: "verified",
        title: "장애우대",
        target: "본인 · 증빙 제시",
        rates: { lift: 40, rental: 40 },
        altRates: { lift: 25, rental: 30 },
        notes: []
      },
      {
        id: "member-companion",
        group: "verified",
        title: "회원 동반",
        target: "회원카드 제시 · 동반 3인",
        rates: { lift: 45, rental: 45 },
        altRates: { lift: 30, rental: 35 },
        notes: ["회원 본인이 현장에 함께 있어야 해요."]
      },
      {
        id: "member",
        group: "verified",
        title: "골프·콘도 회원",
        target: "본인 · 회원카드 제시",
        rates: { lift: 60, rental: 50 },
        altRates: { lift: 40, rental: 50 },
        notes: ["본인 명의 카드를 가진 회원 본인만 1일 1회예요."]
      }
    ],
    rental: {
      label: "장비·의류 렌탈",
      discountNote: "공식 할인 안내는 리프트·렌탈로만 나뉘어 있어요. 일반 세트 외에 고급·부분 렌탈과 의류에도 적용되는지는 안내에 없어요.",
      discountCardItemIds: ["eq-set-4h", "eq-set-6h", "eq-set-8h"],
      example: {
        liftSlot: "4h",
        equipmentId: "eq-set-4h",
        clothingId: "cloth-day",
        clothingPriceLabel: "한벌",
        equipmentPriceLabels: { all: "대인" },
        description: "4시간권 + 일반 스키·보드 세트 4시간(대인) + 의류 한벌 주간을 한 번에 빌리는 경우예요. 의류는 할인 없이 계산했어요."
      },
      equipmentBasis: "이용 시간 +1시간 제공",
      equipment: [
        { id: "eq-set-4h", label: "일반 스키·보드 세트 4시간", detail: "스키 플레이트+부츠 / 보드 데크+부츠", prices: [{ label: "대인", price: 44_000 }, { label: "소인", price: 39_000 }], discountable: true },
        { id: "eq-set-6h", label: "일반 스키·보드 세트 6시간", prices: [{ label: "대인", price: 49_000 }, { label: "소인", price: 44_000 }], discountable: true },
        { id: "eq-set-8h", label: "일반 스키·보드 세트 8시간", prices: [{ label: "대인", price: 54_000 }, { label: "소인", price: 49_000 }], discountable: true },
        { id: "eq-set-20h", label: "일반 스키·보드 세트 연일권(20시간)", prices: [{ label: "대인", price: 108_000 }, { label: "소인", price: 98_000 }], discountable: false, discountLabel: "할인 적용 여부는 공식 안내에 없어요" },
        { id: "eq-pro-4h", label: "고급 스키 세트 4시간", prices: [{ label: "대인", price: 67_000 }, { label: "소인", price: 60_000 }], discountable: false, discountLabel: "할인 적용 여부는 공식 안내에 없어요" },
        { id: "eq-pro-6h", label: "고급 스키 세트 6시간", prices: [{ label: "대인", price: 70_000 }, { label: "소인", price: 63_000 }], discountable: false, discountLabel: "할인 적용 여부는 공식 안내에 없어요" },
        { id: "eq-pro-8h", label: "고급 스키 세트 8시간", prices: [{ label: "대인", price: 73_000 }, { label: "소인", price: 66_000 }], discountable: false, discountLabel: "할인 적용 여부는 공식 안내에 없어요" },
        { id: "eq-pro-20h", label: "고급 스키 세트 연일권(20시간)", prices: [{ label: "대인", price: 146_000 }, { label: "소인", price: 132_000 }], discountable: false, discountLabel: "할인 적용 여부는 공식 안내에 없어요" },
        { id: "part-plate", label: "스키 플레이트 · 보드 데크 8시간", detail: "부분 렌탈", prices: [{ label: "대인", price: 34_000 }, { label: "소인", price: 31_000 }], discountable: false, discountLabel: "할인 적용 여부는 공식 안내에 없어요" },
        { id: "part-boots", label: "스키·보드 부츠 8시간", detail: "부분 렌탈", prices: [{ label: "대인", price: 29_000 }, { label: "소인", price: 26_000 }], discountable: false, discountLabel: "할인 적용 여부는 공식 안내에 없어요" },
        { id: "part-poles", label: "폴 8시간", detail: "부분 렌탈", prices: [{ label: "대인", price: 16_000 }, { label: "소인", price: 14_000 }], discountable: false, discountLabel: "할인 적용 여부는 공식 안내에 없어요" },
        { id: "part-pro-plate", label: "고급 스키 플레이트 8시간", detail: "고급 부분 렌탈", prices: [{ label: "대인", price: 43_000 }, { label: "소인", price: 40_000 }], discountable: false, discountLabel: "할인 적용 여부는 공식 안내에 없어요" },
        { id: "part-pro-boots", label: "고급 스키 부츠 8시간", detail: "고급 부분 렌탈", prices: [{ label: "대인", price: 31_000 }, { label: "소인", price: 28_000 }], discountable: false, discountLabel: "할인 적용 여부는 공식 안내에 없어요" },
        { id: "part-pro-poles", label: "고급 스키 폴 8시간", detail: "고급 부분 렌탈", prices: [{ label: "대인", price: 21_000 }, { label: "소인", price: 18_000 }], discountable: false, discountLabel: "할인 적용 여부는 공식 안내에 없어요" }
      ],
      clothing: [
        { id: "cloth-day", label: "주간 08:30~16:30", prices: [{ label: "한벌", price: 33_000 }, { label: "반벌", price: 22_000 }], discountable: false, discountLabel: "한벌은 자켓+바지, 반벌은 자켓 또는 바지예요" },
        { id: "cloth-day-night", label: "주간+야간 08:30~22:00", prices: [{ label: "한벌", price: 50_000 }, { label: "반벌", price: 38_000 }], discountable: false },
        { id: "cloth-half", label: "오전·오후·야간·오후+야간", detail: "오전 08:30~12:30 · 오후 12:30~16:30 · 야간 18:00~22:00 · 오후+야간 12:30~22:00", prices: [{ label: "한벌", price: 22_000 }, { label: "반벌", price: 17_000 }], discountable: false },
        { id: "cloth-2d", label: "2일권", prices: [{ label: "한벌", price: 77_000 }, { label: "반벌", price: 50_000 }], discountable: false },
        { id: "cloth-3d", label: "3일권", prices: [{ label: "한벌", price: 83_000 }, { label: "반벌", price: 55_000 }], discountable: false },
        { id: "cloth-4d", label: "4일권", prices: [{ label: "한벌", price: 99_000 }, { label: "반벌", price: 65_000 }], discountable: false }
      ],
      protective: [],
      howTo: [],
      location: [
        { label: "스키·보드 렌탈", value: "033-330-7375~6" },
        { label: "의류 렌탈", value: "033-330-7368" },
        { label: "렌탈 발권 시간", value: "08:00~21:00" }
      ],
      notices: [
        "장비 렌탈은 구입한 시간에 1시간이 더해져요(4시간권 → 5시간 이용). 장비는 운영 종료 시간에 반납해야 해요.",
        "정설시간(16:30~18:00)과 겹치면 이용 시간이 1시간 30분 자동 연장돼요. 18시 이후에는 이용 여부와 관계없이 시간이 차감돼요.",
        "렌탈 사이즈: 스키 플레이트 80~170cm, 스키 부츠 160~320mm, 보드 데크 80~160cm, 보드 부츠 170~315mm.",
        "의류 렌탈은 리프트 운영이 끝난 뒤 20분이 지나면 추가 요금이 붙어요.",
        "백컨트리 장비 렌탈(풀세트 반일 40,000원~)은 별도 요금표가 있어요. 용평백컨트리투어 앤 교육센터 033-330-7582."
      ]
    },
    extras: [
      { label: "슬로프 1면 운영 시 특가", value: "일반 4시간 30,000원 · 6시간 35,000원 · 8시간 40,000원", note: "객실·골프회원은 20,000원·25,000원·30,000원이에요. 11/23부터 슬로프 2면이 열리면 정상가가 적용돼요." }
    ],
    notices: [
      "소인은 초등학생 이하에게 적용돼요. 요금에는 부가세가 포함돼 있고 주중·주말 구분이 없어요.",
      "할인율은 하이시즌(오픈일~12/4, 3/2~폐장일)과 피크시즌(12/5~3/1)이 달라요. 표의 할인가는 공식 할인율로 계산한 참고값이에요.",
      "모든 할인은 중복되지 않고, 실물 증빙을 구입 전에 보여 줘야 해요(사진·캡처·사본 불가). 구입한 티켓은 사용 여부와 관계없이 환불·교환이 안 돼요.",
      "운영시간은 08:30~22:00이고 정설시간(16:30~18:00)에는 이용할 수 없어요. 시간은 게이트 최초 통과 시점부터 계산돼요.",
      "티켓은 발권 당일에만 쓸 수 있고, 발권 후 30분 이내 미사용 실물 티켓만 환불·교환돼요. 문의 스키장 상황실 033-330-8252~3."
    ]
  },
  {
    resortId: "high1",
    season: "2026-2027",
    sourceName: "하이원리조트 스키 이용요금",
    sourceUrl: "https://www.high1.com/ski/contents.do?key=750",
    lastCheckedAt: "2026-11-26",
    discounts: [
      {
        id: "card",
        group: "anyone",
        title: "제휴카드",
        target: "신한·NH농협·하나·BC카드 · 4인",
        rates: { lift: 30, rental: 30 },
        highlight: true,
        notes: ["신한·NH농협·하나카드는 자사가 발급한 카드만 해당돼요.", "하이원 직영 영업장에서만 적용돼요. 주중·주말 할인율이 같아요."]
      },
      {
        id: "local",
        group: "verified",
        title: "지역주민(7개 시군)",
        target: "정선·태백·영월·삼척·문경·보령·화순 주민 · 본인 · 리조트 카드 발급자",
        rates: { lift: 50, rental: 50 },
        notes: ["주중 기준이에요. 주말에는 리프트 35%, 렌탈 40%예요.", "6개월 이상 거주한 기간이 적힌 주민등록등본과 신분증이 필요하고, 소인은 등본과 보호자 신분증이 필요해요."]
      },
      {
        id: "honor",
        group: "verified",
        title: "국가유공자·장애인·경로우대",
        target: "본인 포함 2인(경로우대는 본인) · 증빙 제시",
        rates: { lift: 50, rental: 50 },
        notes: ["국가유공자증, 복지카드, 신분증, 경로증으로 확인해요."]
      },
      {
        id: "public",
        group: "verified",
        title: "군인·경찰·소방공무원·문화누리카드",
        target: "4인 · 공무원증 등 제시(군인은 직업군인)",
        rates: { lift: 40, rental: 40 },
        notes: ["비수기·준성수기 기준이에요. 성수기에는 리프트·렌탈 모두 30%예요."]
      }
    ],
    rental: {
      label: "장비 렌탈",
      seasonNote: "렌탈 표 자체에는 시즌 표기가 없어 현재 게시된 공식 요금을 26/27 요금으로 보여 줘요.",
      discountNote: "부분품 대여는 할인을 받을 수 없어요.",
      discountCardItemIds: ["eq-4h", "eq-7h", "eq-day"],
      example: {
        liftSlot: "4h",
        equipmentId: "eq-4h",
        equipmentPriceLabels: { all: "요금" },
        description: "4시간권과 스키 또는 보드 장비 4시간을 빌리는 경우예요. 헬멧은 무료이고 의류 렌탈 가격은 공식 페이지에 없어요."
      },
      equipmentBasis: "스키·보드 같은 요금",
      equipment: [
        { id: "eq-4h", label: "스키·보드 4시간", prices: [{ label: "요금", price: 28_000 }], discountable: true },
        { id: "eq-7h", label: "스키·보드 7시간", prices: [{ label: "요금", price: 38_000 }], discountable: true },
        { id: "eq-day", label: "스키·보드 종일권", prices: [{ label: "요금", price: 54_000 }], discountable: true },
        { id: "part-plate", label: "스키 플레이트", detail: "부분품 대여", prices: [{ label: "종일", price: 30_000 }, { label: "7시간", price: 20_000 }, { label: "4시간", price: 18_000 }], discountable: false },
        { id: "part-boots", label: "스키 부츠", detail: "부분품 대여", prices: [{ label: "종일", price: 24_000 }, { label: "7시간", price: 16_000 }, { label: "4시간", price: 14_000 }], discountable: false },
        { id: "part-poles", label: "폴", detail: "부분품 대여", prices: [{ label: "종일", price: 7_000 }, { label: "7시간", price: 5_000 }, { label: "4시간", price: 4_000 }], discountable: false },
        { id: "part-deck", label: "보드 데크", detail: "부분품 대여", prices: [{ label: "종일", price: 30_000 }, { label: "7시간", price: 20_000 }, { label: "4시간", price: 18_000 }], discountable: false },
        { id: "part-bboots", label: "보드 부츠", detail: "부분품 대여", prices: [{ label: "종일", price: 24_000 }, { label: "7시간", price: 16_000 }, { label: "4시간", price: 14_000 }], discountable: false }
      ],
      clothing: [],
      protective: [],
      howTo: [],
      location: [
        { label: "장비 렌탈소", value: "밸리 스키하우스 1층 · 마운틴 스키하우스 1층" },
        { label: "스키 보관소 문의", value: "밸리 033-590-7821 · 마운틴 033-590-7921" }
      ],
      notices: [
        "안전 헬멧은 이용객 모두 무료로 빌려요.",
        "의류 렌탈 가격은 공식 요금 페이지에 없어요."
      ]
    },
    extras: [
      { label: "스키패스(시즌권) 정상가", value: "대인 600,000원 · 소인 500,000원", note: "석탄산업전환지역(정선·태백·영월·삼척·문경·보령·화순) 주민은 대인(남) 200,000원, 대인(여) 170,000원, 소인 150,000원이에요." },
      { label: "스노우월드 입장권", value: "40,000원", note: "대·소인 공통, 10:00~16:00(발권 마감 14:30)이에요. 마운틴 케이블카가 쉬는 날은 열지 않아요." },
      { label: "운탄고도 케이블카 · 크리스탈 케이블카", value: "20,000원/16,000원 · 22,000원/16,000원", note: "대인/소인 요금이에요. 소인은 3~13세예요." }
    ],
    notices: [
      "리프트 표의 열 제목은 대인/소인이지만 공식 페이지에는 시간권마다 가격 하나만 게시돼 있어요. 소인은 5~13세이고 5세 미만에게는 리프트권을 팔지 않아요.",
      "시간권은 게이트 최초 통과 시점부터 계산돼요. 정설시간(16~18시)에는 이용할 수 없고, 이용 중 겹치면 2시간 연장되지만 18시 이후에는 자동 차감돼요.",
      "표의 할인가는 공식 할인율로 계산한 참고값이에요. 성수기·비수기 구분과 시즌 날짜는 공식 할인 안내를 확인하세요.",
      "26/27 시즌 눈썰매장은 운영하지 않아요."
    ]
  },
  {
    resortId: "wellihilli",
    season: "2026-2027",
    sourceName: "웰리힐리파크 스노우파크 운영시간·이용요금",
    sourceUrl: "https://www.wellihillipark.com/home/guide/pay/snowpark",
    lastCheckedAt: "2026-11-26",
    periods: [
      { label: "일반 기간", range: "~12/24, 2/10~3/1" },
      { label: "성수기", range: "12/25~2/9" }
    ],
    discounts: [
      {
        id: "online",
        group: "anyone",
        title: "온라인 스마트 예약",
        target: "홈페이지·모바일 예약 · 로그인(회원가입) 필수",
        rates: { lift: 45, rental: 45, weekend: { lift: 40, rental: 40 } },
        altRates: { lift: 40, rental: 40, weekend: { lift: 35, rental: 35 } },
        highlight: true,
        notes: ["예약 내역은 마이페이지 → 리프트권 구매내역에서 확인해요."]
      },
      {
        id: "card",
        group: "anyone",
        title: "제휴카드",
        target: "신한·하나·농협·비씨카드 개인 신용·체크카드 · 본인 포함 4인",
        rates: { lift: 40, rental: 40, weekend: { lift: 35, rental: 35 } },
        altRates: { lift: 30, rental: 30, weekend: { lift: 30, rental: 30 } },
        highlight: true,
        notes: ["기프트·법인·선불카드는 제외예요. 1일 1회, 실물카드로 결제하고 보여 줘야 해요.", "정상가를 결제할 때만 할인돼요."]
      },
      {
        id: "guest",
        group: "anyone",
        title: "투숙객",
        target: "체크인 때 받는 할인쿠폰 제시",
        rates: { lift: 40, rental: 40, weekend: { lift: 30, rental: 30 } },
        altRates: { lift: 35, rental: 35, weekend: { lift: 30, rental: 30 } },
        highlight: true,
        notes: ["체크인할 때 받는 할인쿠폰을 보여 주세요."]
      },
      {
        id: "gold",
        group: "anyone",
        title: "Gold Friend(구 We+회원)",
        target: "모바일 쿠폰(바코드) 제시",
        rates: { lift: 50, rental: 50 },
        altRates: { lift: 50, rental: 50 },
        notes: []
      },
      {
        id: "senior",
        group: "verified",
        title: "경로·장애·국가유공자",
        target: "경로우대증 등 증빙 제시",
        rates: { lift: 45, rental: 45, weekend: { lift: 40, rental: 40 } },
        altRates: { lift: 40, rental: 40, weekend: { lift: 40, rental: 40 } },
        notes: []
      },
      {
        id: "uniform",
        group: "verified",
        title: "군인·경찰·소방 / 동계올림픽 서포터즈",
        target: "공무원 신분증 또는 동사모 회원증 제시",
        rates: { lift: 40, rental: 40, weekend: { lift: 35, rental: 35 } },
        altRates: { lift: 30, rental: 30, weekend: { lift: 30, rental: 30 } },
        notes: []
      },
      {
        id: "local",
        group: "verified",
        title: "지역대학 / 지역주민·관계계열사",
        target: "해당 증빙, 신분증 및 우대카드 제시",
        rates: { lift: 40, rental: 40, weekend: { lift: 35, rental: 35 } },
        altRates: { lift: 30, rental: 30, weekend: { lift: 30, rental: 30 } },
        notes: []
      },
      {
        id: "partner",
        group: "verified",
        title: "제휴사",
        target: "신분증 및 우대카드 제시",
        rates: { lift: 45, rental: 45, weekend: { lift: 40, rental: 40 } },
        altRates: { lift: 40, rental: 40, weekend: { lift: 40, rental: 40 } },
        notes: []
      },
      {
        id: "easy-card",
        group: "verified",
        title: "선불카드(신안이지카드)",
        target: "신안이지카드로 결제할 때",
        rates: { lift: 45, rental: 45, weekend: { lift: 40, rental: 40 } },
        altRates: { lift: 45, rental: 45, weekend: { lift: 40, rental: 40 } },
        notes: []
      },
      {
        id: "condo-member",
        group: "verified",
        title: "콘도회원",
        target: "회원카드(모바일카드) 또는 법인 할인권 제시",
        rates: { lift: 60, rental: 60 },
        altRates: { lift: 60, rental: 60 },
        notes: ["일반 개인 60%·특별 기명 70%는 전 기간이고, 일반 법인(무기명)은 일반 기간 50%·성수기 40%, 특별 법인(무기명)은 일반 기간 60%·성수기 50%예요.", "공식 표는 리프트와 렌탈 할인율을 따로 나누지 않았어요."]
      },
      {
        id: "golf-member",
        group: "verified",
        title: "골프회원(웰리힐리CC·신안계열사)",
        target: "회원카드 제시",
        rates: { lift: 50, rental: 50 },
        altRates: { lift: 40, rental: 50 },
        notes: ["스노우파크 SN클럽·S매니아·(구)스키어스 회원은 렌탈 60%예요."]
      },
      {
        id: "lesson",
        group: "verified",
        title: "스키학교 강습생",
        target: "강습 구매자",
        rates: { lift: 50, rental: 50 },
        altRates: { lift: 50, rental: 50 },
        notes: []
      }
    ],
    rental: {
      label: "장비·의류 렌탈",
      seasonNote: "표에 시즌 표기가 없고 페이지에 '26/27 겨울시즌 준비중'이라고 적혀 있어요. 개장 전 게시 요금을 26/27 요금으로 보여 주고, 개장 때 바뀌면 갱신해요.",
      discountNote: "의류와 장비 부분품 렌탈은 할인 대상이 아니에요.",
      discountCardItemIds: ["eq-4h", "eq-7h", "eq-night"],
      example: {
        liftSlot: "4h",
        equipmentId: "eq-4h",
        clothingId: "cloth-4h",
        clothingPriceLabel: "일반",
        equipmentPriceLabels: { all: "요금" },
        description: "4시간권 + 장비 풀세트 4시간 + 의류 세트(일반)를 한 번에 빌리는 경우예요. 의류는 할인 없이 계산했어요."
      },
      equipmentBasis: "발권 시간부터 적용(서비스 30분 포함)",
      equipment: [
        { id: "eq-4h", label: "장비 풀세트 4시간", detail: "스키 또는 보드, 4H", prices: [{ label: "요금", price: 35_000 }], discountable: true },
        { id: "eq-7h", label: "장비 풀세트 7시간", detail: "7H", prices: [{ label: "요금", price: 40_000 }], discountable: true },
        { id: "eq-night", label: "장비 풀세트 야간권", detail: "3.5H", prices: [{ label: "요금", price: 30_000 }], discountable: true },
        { id: "eq-night-late", label: "장비 풀세트 야간심야권", detail: "5.5H", prices: [{ label: "요금", price: 30_000 }], discountable: false, discountLabel: "할인 적용 여부는 공식 안내에 없어요" },
        { id: "eq-2d", label: "장비 풀세트 2일권", detail: "09:00~익일 주간", prices: [{ label: "요금", price: 67_000 }], discountable: false, discountLabel: "이미 할인된 요금이라 할인 대상에서 제외돼요" },
        { id: "part-plate", label: "플레이트(스키)", detail: "부분 렌탈", prices: [{ label: "4시간", price: 23_000 }, { label: "7시간", price: 27_000 }, { label: "야간", price: 23_000 }], discountable: false },
        { id: "part-boots", label: "부츠", detail: "부분 렌탈", prices: [{ label: "4시간", price: 20_000 }, { label: "7시간", price: 23_000 }, { label: "야간", price: 20_000 }], discountable: false },
        { id: "part-poles", label: "스키폴", detail: "부분 렌탈", prices: [{ label: "요금", price: 10_000 }], discountable: false }
      ],
      clothing: [
        { id: "cloth-4h", label: "의류 세트 4시간", detail: "상의+하의", prices: [{ label: "회원", price: 22_000 }, { label: "일반", price: 25_000 }], discountable: false },
        { id: "cloth-7h", label: "의류 세트 7시간", detail: "상의+하의", prices: [{ label: "회원", price: 25_000 }, { label: "일반", price: 30_000 }], discountable: false },
        { id: "cloth-2d", label: "의류 세트 2일권", detail: "09:00~익일 주간", prices: [{ label: "회원", price: 38_000 }, { label: "일반", price: 45_000 }], discountable: false },
        { id: "cloth-part", label: "상의 또는 하의", detail: "부분 렌탈", prices: [{ label: "4시간", price: 15_000 }, { label: "7시간", price: 20_000 }, { label: "2일권", price: 27_000 }], discountable: false }
      ],
      protective: [
        { id: "helmet", label: "헬멧 일반", detail: "의류렌탈(직영)", prices: [{ label: "반일", price: 7_000 }, { label: "주간", price: 10_000 }], discountable: false },
        { id: "helmet-premium", label: "헬멧 프리미엄", detail: "UPDOWN(용품샵)", prices: [{ label: "반일", price: 10_000 }, { label: "주간", price: 13_000 }], discountable: false },
        { id: "shield", label: "헬멧 쉴드", prices: [{ label: "반일", price: 15_000 }, { label: "주간", price: 20_000 }], discountable: false },
        { id: "gloves", label: "장갑·고글", detail: "UPDOWN(용품샵)", prices: [{ label: "반일", price: 10_000 }, { label: "주간", price: 13_000 }], discountable: false },
        { id: "pads", label: "보호대(엉덩이+무릎 세트)", detail: "UPDOWN(용품샵)", prices: [{ label: "반일", price: 10_000 }, { label: "주간", price: 13_000 }], discountable: false }
      ],
      howTo: [
        "매표소에서 발권하고 결제해요.",
        "대여점을 방문해 장비를 받아요. 신분증을 맡겨요."
      ],
      location: [
        { label: "렌탈 이용 순서", value: "매표소 → 발권·결제 → 대여점" },
        { label: "최소 사이즈(스키)", value: "플레이트 92cm · 부츠 165mm" },
        { label: "최소 사이즈(보드)", value: "데크 110cm · 부츠 225mm" },
        { label: "의류 최대 사이즈", value: "상의 120(4XL) · 하의 120(4XL/38in)" }
      ],
      notices: [
        "렌탈은 신분증을 맡겨야 빌릴 수 있어요.",
        "헬멧·장갑·고글·보호대는 일부 용품샵(UPDOWN)에서 빌려요."
      ]
    },
    extras: [
      { label: "개장 당일 특가(정액)", value: "리프트 4시간·야간 10,000원 · 7시간 20,000원 · 장비 10,000원", note: "회원·일반 같은 요금이에요. 슬로프 3면이 열리기 전에는 이 정액 특가가 할인율 대신 적용돼요." },
      { label: "회원가입 쿠폰(누구나, 1일 1회)", value: "스노우파크 리프트·장비 35~45% · 식음업장 5%", note: "마이페이지 > 내쿠폰에서 확인하고 계산 전에 보여 주세요." },
      { label: "1회권", value: "리프트 20,000원", note: "1회 이용권이에요. 이미 할인된 요금이라 우대 할인이 안 돼요." }
    ],
    notices: [
      "공식 요금표에 시즌 표기가 없고 페이지에 '26/27 겨울시즌 준비중'이라는 문구가 있어요. 개장 전 게시 요금을 26/27 요금으로 보여 주며 개장 때 바뀔 수 있어요.",
      "대인·소인 요금이 같아요. 요금에는 부가세가 포함돼 있고 리프트권 보증금 1,000원이 따로 있어요(환급기에서 환불).",
      "발권한 티켓은 당일만 쓸 수 있고 분실하면 재발행이 안 돼요. 시간은 발권 시간부터 계산하고 서비스 30분이 더해져요. 정설시간(16:30~18:30)은 이용 시간에서 빠져요.",
      "할인은 현장 매표소에서 정상가를 결제할 때만 되고, 증빙을 발권 전에 보여 줘야 해요(발권 후 할인 불가). 모든 할인은 중복되지 않아요.",
      "1회권·2일권·개장 특가·이벤트 특가·패키지·세트권처럼 이미 할인된 요금과 의류, 장비 부분품 렌탈은 할인에서 빠져요.",
      "할인 적용 기간은 슬로프 3면이 열린 뒤부터예요. 개장일은 확정되면 공지사항에 올라와요.",
      "주중은 월~금, 주말은 토·일·공휴일이에요. 할인율은 예고 없이 바뀔 수 있어요."
    ]
  },
  {
    resortId: "oakvalley",
    season: "2026-2027",
    sourceName: "오크밸리 스키 요금안내",
    sourceUrl: "https://oakvalley.co.kr/ski/introduction/charge-info",
    lastCheckedAt: "2026-11-26",
    slotLabels: { "4h": "오전·오후권(4시간)", night: "야간권", full_day: "주간권(8시간)" },
    periods: [
      { label: "일반 기간", range: "특별할인 기간 외" },
      { label: "특별할인", range: "12/11~12/18, 2/15~2/21" }
    ],
    discounts: [
      {
        id: "card",
        group: "anyone",
        title: "제휴카드(NH농협·신한)",
        target: "NH농협카드 · 신한카드 · 리프트·렌탈 공통",
        rates: { lift: 40, rental: 40, weekend: { lift: 30, rental: 30 } },
        altRates: { lift: 60, rental: 60, weekend: { lift: 40, rental: 40 } },
        highlight: true,
        notes: ["신한카드로 월요일에 방문하면 리프트가 45%예요(주중만).", "특별할인 기간에는 NH농협·신한카드가 주중 60%, 주말·공휴일 40%예요."]
      },
      {
        id: "toss",
        group: "anyone",
        title: "토스 페이스 페이",
        target: "리프트·렌탈 공통",
        rates: { lift: 40, rental: 40, weekend: { lift: 30, rental: 30 } },
        notes: ["화요일에 방문하면 리프트가 45%예요(주중만)."]
      },
      {
        id: "guest",
        group: "anyone",
        title: "오크밸리 객실 투숙객",
        target: "예약 확인증 지참 · 객실 1실당 1일 4매",
        rates: { lift: 50, rental: 50, weekend: { lift: 40, rental: 40 } },
        highlight: true,
        notes: ["예약 확인증을 가져가세요. 객실 1실당 하루 4매까지 발급돼요."]
      },
      {
        id: "local",
        group: "verified",
        title: "지역주민",
        target: "원주 시민·거주민(학교·기업), 횡성·충주·제천·여주·양평 · 본인",
        rates: { lift: 40, rental: 40, weekend: { lift: 30, rental: 30 } },
        notes: ["현 거주지를 확인할 수 있는 신분증이나 증명서가 필요해요."]
      },
      {
        id: "honor",
        group: "verified",
        title: "국가유공자·군인·경찰·소방관",
        target: "본인 · 신분증 또는 증명서",
        rates: { lift: 40, rental: 40, weekend: { lift: 30, rental: 30 } },
        notes: []
      },
      {
        id: "member-a",
        group: "verified",
        title: "오크밸리 회원 A type",
        target: "기명·무기명 Full·1/5·1/10(50) 구좌, 골프 정회원, 골프 주중(PKG)회원",
        rates: { lift: 70, rental: 70, weekend: { lift: 50, rental: 50 } },
        notes: ["회원증과 확인증을 가져가세요. 회원 본인 카드 1매당 하루 1매예요."]
      },
      {
        id: "member-b",
        group: "verified",
        title: "오크밸리 회원 B type",
        target: "기명·무기명 1/10(30) 구좌, 골프 주중회원",
        rates: { lift: 60, rental: 60, weekend: { lift: 40, rental: 40 } },
        notes: ["회원증과 확인증을 가져가세요. 회원 본인 카드 1매당 하루 1매예요."]
      }
    ],
    rental: {
      label: "장비 렌탈",
      seasonNote: "공식 요금안내의 '26/27시즌' 정상요금 표예요.",
      discountNote: "공식 표는 장비 렌탈 할인율을 리프트와 같게 적었어요.",
      example: {
        liftSlot: "4h",
        equipmentId: "eq-4h",
        equipmentPriceLabels: { all: "요금" },
        description: "오전 또는 오후 4시간권과 단일 장비 렌탈 4시간을 함께 빌리는 경우예요. 의류 렌탈 가격은 공식 페이지에 없어요."
      },
      equipmentBasis: "대인 요금(소인 요금은 표에 없음)",
      equipment: [
        { id: "eq-4h", label: "단일 오전·오후 4시간", detail: "오전 09:00~13:00 · 오후 13:30~17:00", prices: [{ label: "요금", price: 28_000 }], discountable: true },
        { id: "eq-night", label: "단일 야간", detail: "주중 18:30~22:00(3.5시간) · 주말 18:30~23:00(5시간)", prices: [{ label: "요금", price: 28_000 }], discountable: true },
        { id: "eq-day", label: "복합 주간 8시간", detail: "09:00~17:00", prices: [{ label: "요금", price: 35_000 }], discountable: true },
        { id: "eq-late", label: "복합 오야", detail: "주중 13:00~22:00(7.5시간) · 주말 13:00~23:00(9시간)", prices: [{ label: "요금", price: 35_000 }], discountable: true }
      ],
      clothing: [],
      protective: [],
      howTo: [],
      location: [],
      notices: [
        "운영 시간은 영업장 사정에 따라 바뀔 수 있어요. 날짜별 세부 시간은 오픈 슬로프 실시간 현황을 확인하세요.",
        "의류 렌탈 가격은 공식 요금안내에 없어요."
      ]
    },
    extras: [
      { label: "오야 복합 리프트(13:00~22:00 주중 / 23:00 주말)", value: "80,000원", note: "주중 7.5시간, 주말 9시간이에요. 장비는 35,000원이에요." }
    ],
    notices: [
      "표의 리프트 요금은 단일 오전·오후·야간 66,000원, 복합 주간·오야 80,000원이고 소인 요금은 표에 없어요.",
      "모든 할인의 적용 기간은 2026년 12월 11일부터 폐장일까지예요.",
      "야간 운영은 2026년 12월 11일부터 폐장일까지예요(2/15~2/18, 2/21 제외). 안전상 리프트권을 가진 사람만 게이트에 들어갈 수 있어요.",
      "주중은 월~금, 주말은 토·일·공휴일이에요. 할인가는 공식 할인율로 계산한 참고값이에요."
    ]
  },
  {
    resortId: "alpensia",
    season: "2026-2027",
    sourceName: "알펜시아 스키700 리프트 요금",
    sourceUrl: "https://www.alpensia.com/ski/use-cost-lift.do",
    lastCheckedAt: "2026-11-26",
    slotLabels: { "4h": "오전·오후권(4시간)", "7h": "후야권(7시간)", night: "야간권(3시간)", full_day: "주간권(8시간)" },
    periods: [
      { label: "비수기", range: "기간은 공식 안내에 없어요" },
      { label: "성수기", range: "기간은 공식 안내에 없어요" }
    ],
    discounts: [
      {
        id: "card",
        group: "anyone",
        title: "신한카드·우리카드",
        target: "본인 포함 4인",
        rates: { lift: 40, rental: 40, weekend: { lift: 30, rental: 30 } },
        altRates: { lift: 30, rental: 30 },
        highlight: true,
        notes: ["비수기에는 주중 40%, 주말·공휴일 30%이고 성수기에는 30%예요."]
      },
      {
        id: "guest",
        group: "anyone",
        title: "투숙객",
        target: "객실 투숙쿠폰·객실 키 확인 · 투숙객 전원",
        rates: { lift: 30, rental: 30 },
        highlight: true,
        notes: ["객실 투숙쿠폰과 객실 키를 보여 주세요."]
      },
      {
        id: "shinhan-women",
        group: "anyone",
        title: "신한카드 여성 고객",
        target: "본인 1인 · 주중 야간권(공휴일 제외)",
        rates: { lift: 50 },
        notes: ["주중 야간권에만 적용돼요. 렌탈 할인은 없어요."]
      },
      {
        id: "senior",
        group: "verified",
        title: "경로우대·국가유공자·장애인",
        target: "경로우대 65세 이상(본인) · 국가유공자(본인) · 장애인(본인 포함 2인)",
        rates: { lift: 40, rental: 40 },
        notes: ["신분증, 국가유공자증, 복지카드로 확인해요."]
      },
      {
        id: "daegwallyeong",
        group: "verified",
        title: "대관령면 주민",
        target: "본인 · 신분증 및 확인서",
        rates: { lift: 40, rental: 40 },
        altRates: { lift: 35, rental: 35 },
        notes: []
      },
      {
        id: "pyeongchang",
        group: "verified",
        title: "평창군민",
        target: "본인 · 신분증 및 확인서",
        rates: { lift: 40, rental: 40 },
        altRates: { lift: 30, rental: 30 },
        notes: []
      },
      {
        id: "gangwon",
        group: "verified",
        title: "강원특별자치도민·명예도민·출향도민",
        target: "도민 본인 · 명예도민은 본인 포함 동반 2인 · 증명서 확인",
        rates: { lift: 25, rental: 25 },
        altRates: { lift: 20, rental: 20 },
        notes: []
      },
      {
        id: "member",
        group: "verified",
        title: "분양회원",
        target: "회원카드 리딩 · 본인",
        rates: { lift: 50, rental: 50 },
        altRates: { lift: 50, rental: 50 },
        notes: ["회원 혜택에 따라 50% 또는 100%예요."]
      }
    ],
    rental: {
      label: "장비·의류 렌탈",
      source: { name: "알펜시아 스키700 렌탈 & 시설 이용 요금", url: "https://www.alpensia.com/ski/use-cost-rental.do" },
      seasonNote: "렌탈 표에는 시즌 표기가 없지만 같은 페이지의 운영 일정이 26/27(3월 7일 폐장)이에요.",
      discountNote: "장비 부분품, 의류, 헬멧은 할인이 적용되지 않아요.",
      discountCardItemIds: ["eq-half", "eq-day", "eq-full"],
      example: {
        liftSlot: "4h",
        equipmentId: "eq-half",
        clothingId: "cloth-set",
        clothingPriceLabel: "반일",
        equipmentPriceLabels: { all: "대인" },
        description: "오전 또는 오후 4시간권과 스키·보드 렌탈 반일, 의류 set 반일을 함께 빌리는 경우예요. 의류는 할인 없이 계산했어요."
      },
      equipmentBasis: "스키·보드 같은 요금, 대인·소인 구분",
      equipment: [
        { id: "eq-half", label: "오전·오후·야간권", detail: "오전 09:00~13:00 · 오후 13:00~17:00 · 야간 18:30~21:30", prices: [{ label: "대인", price: 32_000 }, { label: "소인", price: 26_000 }], discountable: true },
        { id: "eq-day", label: "주간권·후야권", detail: "주간 09:00~17:00(8시간) · 후야 13:00~17:00, 18:30~21:30(7시간)", prices: [{ label: "대인", price: 40_000 }, { label: "소인", price: 31_000 }], discountable: true },
        { id: "eq-full", label: "당일권", detail: "09:00~17:00, 18:30~21:30(11시간)", prices: [{ label: "대인", price: 50_000 }, { label: "소인", price: 40_000 }], discountable: true },
        { id: "part-half", label: "장비 부분품 반일권", detail: "대·소인 같은 요금", prices: [{ label: "요금", price: 10_000 }], discountable: false },
        { id: "part-day", label: "장비 부분품 주간권·후야권", prices: [{ label: "요금", price: 15_000 }], discountable: false },
        { id: "part-full", label: "장비 부분품 당일권", prices: [{ label: "요금", price: 22_000 }], discountable: false }
      ],
      clothing: [
        { id: "cloth-set", label: "의류 set(상+하)", detail: "대·소인 같은 요금", prices: [{ label: "반일", price: 20_000 }, { label: "주간·후야", price: 30_000 }, { label: "당일", price: 35_000 }], discountable: false },
        { id: "cloth-part", label: "의류 부분(상 또는 하)", prices: [{ label: "반일", price: 15_000 }, { label: "주간·후야", price: 20_000 }, { label: "당일", price: 25_000 }], discountable: false }
      ],
      protective: [
        { id: "helmet", label: "헬멧", detail: "당일권 · 대·소인 구분 없음", prices: [{ label: "요금", price: 5_000 }], discountable: false }
      ],
      howTo: [],
      location: [],
      notices: [
        "슬로프 정설시간은 17:00~18:30이에요.",
        "주간 운영은 오픈일~12월 18일, 2월 14일~3월 7일이고 야간 운영은 12월 19일~2월 13일이에요."
      ]
    },
    extras: [
      { label: "당일권 렌탈", value: "스키·보드 50,000원 · 의류 set 35,000원", note: "09:00~17:00, 18:30~21:30(11시간)이에요. 리프트 시간권 칸에는 맞지 않아 표에는 넣지 않았어요." }
    ],
    notices: [
      "공식 리프트 요금표는 '26/27 시즌'으로 게시돼 있고 대인·소인 가격이 있어요. 1회권은 판매하지 않아요.",
      "신한·우리카드와 지역주민 할인의 비수기·성수기 날짜는 공식 안내에 없어요. 방문 전 확인하세요.",
      "주간 운영은 오픈일~12월 18일, 2월 14일~3월 7일이고 야간 운영은 12월 19일~2월 13일이에요. 슬로프 정설시간은 17:00~18:30이에요.",
      "표의 할인가는 공식 할인율로 계산한 참고값이에요."
    ]
  }
];

export function getResortLiftGuide(resortId: string) {
  return resortLiftGuides.find((guide) => guide.resortId === resortId);
}
