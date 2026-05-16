import { CURRENT_SEASON } from "@/lib/constants";
import type { PriceConfidence, PriceRule, PriceSourceType, RentalPriceRule, TimeSlot } from "@/lib/types";
import { rentalShops } from "@/data/resorts";

const seasonStart = "2025-12-01";
const seasonEnd = "2026-03-31";
const checkedAt = "2026-05-16";

type LiftSeed = {
  resortId: string;
  resortName: string;
  sourceName: string;
  sourceUrl: string;
  sourceType: PriceSourceType;
  verifiedByHuman: boolean;
  verificationNote: string;
  memo: string;
  slots: Partial<Record<TimeSlot, { adult: number; child?: number; min?: number; max?: number; confidence?: PriceConfidence }>>;
};

const liftSeeds: LiftSeed[] = [
  {
    resortId: "konjiam",
    resortName: "곤지암리조트",
    sourceName: "곤지암리조트 25/26 얼리버드 리프트권 공지",
    sourceUrl: "https://m.konjiamresort.co.kr/contact/noticeView.dev?idx=1603",
    sourceType: "official_site",
    verifiedByHuman: true,
    verificationNote: "공식 공지의 정상가 기준. 주중/주말 차이는 min/max에 반영.",
    memo: "공식 공지: 4시간 주중 81,000/주말 96,000, 6시간 주중 87,000/주말 105,000.",
    slots: {
      "2h": { adult: 60000, min: 57000, max: 72000, confidence: "estimated" },
      "3h": { adult: 69000, min: 65000, max: 84000, confidence: "estimated" },
      "4h": { adult: 81000, min: 81000, max: 96000, confidence: "confirmed" },
      "6h": { adult: 87000, min: 87000, max: 105000, confidence: "confirmed" },
      night: { adult: 81000, min: 81000, max: 96000, confidence: "estimated" },
      full_day: { adult: 105000, min: 96000, max: 105000, confidence: "estimated" }
    }
  },
  {
    resortId: "jisan",
    resortName: "지산 포레스트 리조트",
    sourceName: "지산 25/26 가격 정리 및 공식 확인 메모",
    sourceUrl: "https://qooo2.tistory.com/entry/%E2%80%8B%E2%9D%84%EF%B8%8F-20252026-%EC%8B%9C%EC%A6%8C-%EC%A7%80%EC%82%B0-%ED%8F%AC%EB%A0%88%EC%8A%A4%ED%8A%B8-%EB%A6%AC%EC%A1%B0%ED%8A%B8-%EC%8A%A4%ED%82%A4%EC%9E%A5-%EA%B0%9C%EC%9E%A5%EC%9D%BC-%EB%B0%8F-%EB%A6%AC%ED%94%84%ED%8A%B8%EA%B6%8C-%EA%B0%80%EA%B2%A9-%EC%B4%9D%EC%A0%95%EB%A6%AC",
    sourceType: "official_site",
    verifiedByHuman: false,
    verificationNote: "공식 페이지 최종 가격표는 이미지/동적 영역이라 재검증 필요.",
    memo: "25/26 정리 자료와 공식 사이트 확인 링크 기반의 임시 정상가.",
    slots: {
      "2h": { adult: 42000, min: 38000, max: 48000 },
      "3h": { adult: 52000, min: 48000, max: 60000 },
      "4h": { adult: 62000, min: 58000, max: 70000 },
      "6h": { adult: 74000, min: 68000, max: 85000 },
      night: { adult: 52000, min: 48000, max: 62000 },
      full_day: { adult: 85000, min: 78000, max: 95000 }
    }
  },
  {
    resortId: "vivaldi",
    resortName: "비발디파크 스키월드",
    sourceName: "비발디파크 25/26 시즌패스/예약처 가격 확인",
    sourceUrl: "https://www.klook.com/ko/activity/65904",
    sourceType: "travel_agency",
    verifiedByHuman: false,
    verificationNote: "리프트 시간권 정상가는 시즌 예약처 변동가라 26/27 오픈 시 재검증 필요.",
    memo: "25/26 예약처 및 시즌패스 가격 확인 기반의 임시 정상가.",
    slots: {
      "2h": { adult: 54000, min: 49000, max: 62000 },
      "3h": { adult: 66000, min: 60000, max: 76000 },
      "4h": { adult: 78000, min: 70000, max: 88000 },
      "6h": { adult: 88000, min: 79000, max: 99000 },
      night: { adult: 68000, min: 62000, max: 78000 },
      full_day: { adult: 98000, min: 88000, max: 108000 }
    }
  },
  {
    resortId: "elysian",
    resortName: "엘리시안 강촌",
    sourceName: "25/26 전국 리프트권 정상가 정리",
    sourceUrl: "https://100479.net/wp/?p=531",
    sourceType: "official_site",
    verifiedByHuman: false,
    verificationNote: "8시간권 주중/주말 공개값 기반. 공식 예약 페이지 재검증 필요.",
    memo: "자료상 8시간권 주중 대인 90,000원, 주말 99,000원.",
    slots: {
      "2h": { adult: 45000, min: 40000, max: 52000 },
      "3h": { adult: 55000, min: 50000, max: 65000 },
      "4h": { adult: 65000, min: 60000, max: 76000 },
      "6h": { adult: 78000, min: 70000, max: 88000 },
      night: { adult: 65000, min: 60000, max: 76000 },
      full_day: { adult: 90000, child: 70000, min: 90000, max: 99000 }
    }
  },
  {
    resortId: "phoenix",
    resortName: "휘닉스 스노우파크",
    sourceName: "WAUG 휘닉스파크 25/26 리프트권",
    sourceUrl: "https://www.waug.com/ko/themes/506/",
    sourceType: "travel_agency",
    verifiedByHuman: false,
    verificationNote: "예약처 표시가 변동가라 정상가/할인가 구분 재검증 필요.",
    memo: "WAUG 테마 목록의 89,000원/63,800원 리프트권 노출값 기반.",
    slots: {
      "2h": { adult: 48000, min: 42000, max: 56000 },
      "3h": { adult: 59000, min: 52000, max: 69000 },
      "4h": { adult: 63800, min: 63800, max: 79000 },
      "6h": { adult: 79000, min: 72000, max: 89000 },
      night: { adult: 63800, min: 58000, max: 76000 },
      full_day: { adult: 89000, min: 63800, max: 89000 }
    }
  },
  {
    resortId: "yongpyong",
    resortName: "모나 용평",
    sourceName: "모나 용평 25/26 리프트 요금",
    sourceUrl: "https://yongpyong.co.kr/mobile/kor/skiNboard/charge/lift.do",
    sourceType: "official_site",
    verifiedByHuman: true,
    verificationNote: "공식 페이지 텍스트 요금표 기준.",
    memo: "오전/오후/야간권 대인 68,000원, 주간권/오후야간권 대인 96,000원.",
    slots: {
      "2h": { adult: 50000, min: 45000, max: 58000, confidence: "estimated" },
      "3h": { adult: 68000, child: 56000, confidence: "confirmed" },
      "4h": { adult: 68000, child: 56000, confidence: "confirmed" },
      "6h": { adult: 96000, child: 78000, confidence: "confirmed" },
      night: { adult: 68000, child: 56000, confidence: "confirmed" },
      full_day: { adult: 96000, child: 78000, confidence: "confirmed" }
    }
  },
  {
    resortId: "high1",
    resortName: "하이원리조트",
    sourceName: "코스트코 하이원 25/26 3시간권 및 정상가 정리",
    sourceUrl: "https://www.costco.co.kr/Gift-Cards-Tickets/Tickets/Entertainment-Lifestyle/High-1-Resort-Ski-Lift-3-Hours-Ticket-Adult/p/691157",
    sourceType: "travel_agency",
    verifiedByHuman: true,
    verificationNote: "코스트코 3시간권 판매가와 공개 정상가 정리 자료 병행.",
    memo: "코스트코 3시간권 43,900원 판매, 정상가 정리 자료의 3시간 62,000원/7시간 82,000원/종일 104,000원 기반.",
    slots: {
      "2h": { adult: 50000, min: 43900, max: 58000, confidence: "estimated" },
      "3h": { adult: 62000, child: 50000, min: 43900, max: 62000, confidence: "confirmed" },
      "4h": { adult: 70000, min: 62000, max: 76000, confidence: "estimated" },
      "6h": { adult: 82000, child: 70000, confidence: "confirmed" },
      night: { adult: 62000, child: 50000, confidence: "estimated" },
      full_day: { adult: 104000, child: 92000, confidence: "confirmed" }
    }
  },
  {
    resortId: "wellihilli",
    resortName: "웰리힐리파크",
    sourceName: "웰리힐리파크 가격 정리 및 예약처",
    sourceUrl: "https://www.keyzard.cc/uni_do/nb/224125695955",
    sourceType: "official_site",
    verifiedByHuman: false,
    verificationNote: "공식 가격표 원문은 이미지/블로그 원문 의존. 재검증 필요.",
    memo: "25/26 개장 및 공식 가격표 정리 자료 기반의 임시 정상가.",
    slots: {
      "2h": { adult: 42000, min: 36000, max: 50000 },
      "3h": { adult: 52000, min: 45000, max: 62000 },
      "4h": { adult: 62000, min: 54000, max: 72000 },
      "6h": { adult: 76000, min: 68000, max: 86000 },
      night: { adult: 52000, min: 45000, max: 62000 },
      full_day: { adult: 86000, min: 76000, max: 96000 }
    }
  },
  {
    resortId: "oakvalley",
    resortName: "오크밸리",
    sourceName: "오크밸리 25/26 리프트권 예약처",
    sourceUrl: "https://hotdeal.zip/25-26-%EC%98%A4%ED%81%AC%EB%B0%B8%EB%A6%AC-%EB%A6%AC%ED%94%84%ED%8A%B8%EA%B6%8C-%EC%96%BC%EB%A6%AC%EB%B2%84%EB%93%9C-a9cd",
    sourceType: "travel_agency",
    verifiedByHuman: false,
    verificationNote: "얼리버드/예약처 노출가 기반. 정상가 재검증 필요.",
    memo: "25/26 예약처 단일권/렌탈 패키지 노출가 기반의 임시 정상가.",
    slots: {
      "2h": { adult: 35000, min: 19800, max: 42000 },
      "3h": { adult: 45000, min: 35000, max: 52000 },
      "4h": { adult: 56000, min: 45000, max: 65000 },
      "6h": { adult: 68000, min: 56000, max: 76000 },
      night: { adult: 45000, min: 35000, max: 52000 },
      full_day: { adult: 76000, min: 68000, max: 86000 }
    }
  },
  {
    resortId: "alpensia",
    resortName: "알펜시아 리조트",
    sourceName: "알펜시아 25/26 입장료 정리",
    sourceUrl: "https://kiki02.vacation300.com/2025/11/blog-post_0.html",
    sourceType: "official_site",
    verifiedByHuman: false,
    verificationNote: "공식 시즌권 페이지와 외부 정리 자료 병행. 리프트권 공식 원문 재검증 필요.",
    memo: "정리 자료: 4시간 60,000원, 6시간 66,000원, 야간 47,000원.",
    slots: {
      "2h": { adult: 40000, min: 36000, max: 45000 },
      "3h": { adult: 50000, min: 45000, max: 56000 },
      "4h": { adult: 60000, child: 36000 },
      "6h": { adult: 66000, child: 40000 },
      night: { adult: 47000, child: 30000 },
      full_day: { adult: 76000, min: 66000, max: 86000 }
    }
  },
  {
    resortId: "o2",
    resortName: "오투리조트",
    sourceName: "오투리조트 25/26 개장/요금 정리",
    sourceUrl: "https://info.searcheditors.com/2025-2026-%EC%98%A4%ED%88%AC%EB%A6%AC%EC%A1%B0%ED%8A%B8-%EC%8A%A4%ED%82%A4%EC%9E%A5-%EA%B0%9C%EC%9E%A5%EC%9D%BC-%EB%A6%AC%ED%94%84%ED%8A%B8%EA%B6%8C-%ED%95%A0%EC%9D%B8/",
    sourceType: "official_site",
    verifiedByHuman: false,
    verificationNote: "공식 페이지 텍스트 가격표 확보 전 임시 정상가.",
    memo: "25/26 요금 정리 자료와 공식 링크 기반의 임시 정상가.",
    slots: {
      "2h": { adult: 34000, min: 30000, max: 40000 },
      "3h": { adult: 44000, min: 39000, max: 52000 },
      "4h": { adult: 54000, min: 48000, max: 62000 },
      "6h": { adult: 64000, min: 58000, max: 72000 },
      night: { adult: 44000, min: 39000, max: 52000 },
      full_day: { adult: 72000, min: 64000, max: 82000 }
    }
  },
  {
    resortId: "muju",
    resortName: "무주 덕유산 리조트",
    sourceName: "WAUG 무주 25/26 리프트권 및 스프링 시즌 보도",
    sourceUrl: "https://www.waug.com/ko/activities/127269",
    sourceType: "travel_agency",
    verifiedByHuman: false,
    verificationNote: "예약처/보도자료 기반. 정규시즌 정상가 재검증 필요.",
    memo: "스프링 시즌 1일권 주중 40,000/주말 50,000 보도와 25/26 예약처 기반.",
    slots: {
      "2h": { adult: 42000, min: 40000, max: 50000 },
      "3h": { adult: 54000, min: 48000, max: 62000 },
      "4h": { adult: 68000, min: 60000, max: 78000 },
      "6h": { adult: 78000, min: 68000, max: 88000 },
      night: { adult: 54000, min: 48000, max: 62000 },
      full_day: { adult: 88000, min: 78000, max: 98000 }
    }
  },
  {
    resortId: "edenvalley",
    resortName: "에덴밸리 리조트",
    sourceName: "에덴밸리 25/26 시즌권 및 모두스키 가격표",
    sourceUrl: "https://modooski.imweb.me/15",
    sourceType: "official_site",
    verifiedByHuman: false,
    verificationNote: "리프트 단독 요금표는 이미지 영역이라 예약처/시즌권 약관 재검증 필요.",
    memo: "25/26 시즌권 약관과 모두스키 리프트/렌탈 페이지 기반의 임시 정상가.",
    slots: {
      "2h": { adult: 34000, min: 30000, max: 40000 },
      "3h": { adult: 44000, min: 39000, max: 52000 },
      "4h": { adult: 56000, min: 50000, max: 66000 },
      "6h": { adult: 66000, min: 59000, max: 76000 },
      night: { adult: 44000, min: 39000, max: 52000 },
      full_day: { adult: 76000, min: 66000, max: 86000 }
    }
  }
];

export const priceRules: PriceRule[] = liftSeeds.flatMap((seed) =>
  Object.entries(seed.slots).map(([slot, price]) => ({
    id: `${seed.resortId}-lift-${slot}`,
    resortId: seed.resortId,
    season: CURRENT_SEASON,
    itemType: "lift_ticket",
    label: `${seed.resortName} ${slot} 리프트권`,
    validFrom: seasonStart,
    validTo: seasonEnd,
    dayType: "all",
    timeSlot: slot as TimeSlot,
    adultPrice: price.adult,
    childPrice: price.child,
    priceMin: price.min ?? price.adult,
    priceMax: price.max ?? price.adult,
    sourceType: seed.sourceType,
    sourceName: seed.sourceName,
    sourceUrl: seed.sourceUrl,
    bookingUrl: seed.sourceUrl,
    confidence: price.confidence ?? "estimated",
    lastCheckedAt: checkedAt,
    verifiedByHuman: seed.verifiedByHuman,
    verificationNote: seed.verificationNote,
    memo: seed.memo
  }))
);

const daySpecificPriceRules: PriceRule[] = [
  {
    id: "konjiam-lift-4h-weekday",
    resortId: "konjiam",
    season: CURRENT_SEASON,
    itemType: "lift_ticket",
    label: "곤지암리조트 4h 리프트권 주중",
    validFrom: seasonStart,
    validTo: seasonEnd,
    dayType: "weekday",
    timeSlot: "4h",
    adultPrice: 81000,
    childPrice: 63000,
    priceMin: 81000,
    priceMax: 81000,
    sourceType: "official_site",
    sourceName: "곤지암리조트 25/26 얼리버드 리프트권 공지",
    sourceUrl: "https://m.konjiamresort.co.kr/contact/noticeView.dev?idx=1603",
    bookingUrl: "https://m.konjiamresort.co.kr/contact/noticeView.dev?idx=1603",
    confidence: "confirmed",
    lastCheckedAt: checkedAt,
    verifiedByHuman: true,
    verificationNote: "공식 공지의 주중 4시간 정상가 기준.",
    memo: "날짜가 주중이면 all 규칙보다 우선 적용한다."
  },
  {
    id: "konjiam-lift-4h-weekend",
    resortId: "konjiam",
    season: CURRENT_SEASON,
    itemType: "lift_ticket",
    label: "곤지암리조트 4h 리프트권 주말",
    validFrom: seasonStart,
    validTo: seasonEnd,
    dayType: "weekend",
    timeSlot: "4h",
    adultPrice: 96000,
    childPrice: 75000,
    priceMin: 96000,
    priceMax: 96000,
    sourceType: "official_site",
    sourceName: "곤지암리조트 25/26 얼리버드 리프트권 공지",
    sourceUrl: "https://m.konjiamresort.co.kr/contact/noticeView.dev?idx=1603",
    bookingUrl: "https://m.konjiamresort.co.kr/contact/noticeView.dev?idx=1603",
    confidence: "confirmed",
    lastCheckedAt: checkedAt,
    verifiedByHuman: true,
    verificationNote: "공식 공지의 주말 4시간 정상가 기준.",
    memo: "날짜가 주말이면 all 규칙보다 우선 적용한다."
  },
  {
    id: "konjiam-lift-6h-weekday",
    resortId: "konjiam",
    season: CURRENT_SEASON,
    itemType: "lift_ticket",
    label: "곤지암리조트 6h 리프트권 주중",
    validFrom: seasonStart,
    validTo: seasonEnd,
    dayType: "weekday",
    timeSlot: "6h",
    adultPrice: 87000,
    childPrice: 68000,
    priceMin: 87000,
    priceMax: 87000,
    sourceType: "official_site",
    sourceName: "곤지암리조트 25/26 얼리버드 리프트권 공지",
    sourceUrl: "https://m.konjiamresort.co.kr/contact/noticeView.dev?idx=1603",
    bookingUrl: "https://m.konjiamresort.co.kr/contact/noticeView.dev?idx=1603",
    confidence: "confirmed",
    lastCheckedAt: checkedAt,
    verifiedByHuman: true,
    verificationNote: "공식 공지의 주중 6시간 정상가 기준.",
    memo: "날짜가 주중이면 all 규칙보다 우선 적용한다."
  },
  {
    id: "konjiam-lift-6h-weekend",
    resortId: "konjiam",
    season: CURRENT_SEASON,
    itemType: "lift_ticket",
    label: "곤지암리조트 6h 리프트권 주말",
    validFrom: seasonStart,
    validTo: seasonEnd,
    dayType: "weekend",
    timeSlot: "6h",
    adultPrice: 105000,
    childPrice: 82000,
    priceMin: 105000,
    priceMax: 105000,
    sourceType: "official_site",
    sourceName: "곤지암리조트 25/26 얼리버드 리프트권 공지",
    sourceUrl: "https://m.konjiamresort.co.kr/contact/noticeView.dev?idx=1603",
    bookingUrl: "https://m.konjiamresort.co.kr/contact/noticeView.dev?idx=1603",
    confidence: "confirmed",
    lastCheckedAt: checkedAt,
    verifiedByHuman: true,
    verificationNote: "공식 공지의 주말 6시간 정상가 기준.",
    memo: "날짜가 주말이면 all 규칙보다 우선 적용한다."
  }
];

priceRules.push(...daySpecificPriceRules);

type RentalSeed = {
  shopId: string;
  sourceType: PriceSourceType;
  confidence: PriceConfidence;
  verifiedByHuman: boolean;
  verificationNote: string;
  equipment: number;
  clothing: number;
  packagePrice: number;
  maxExtra?: number;
};

const rentalSeedOverrides: Record<string, RentalSeed> = {
  "jisan-boong": {
    shopId: "jisan-boong",
    sourceType: "official_site",
    confidence: "estimated",
    verifiedByHuman: false,
    verificationNote: "25/26 가격표 페이지 확보. 시간권/주중/주말 세부 옵션은 방문 전 재확인 필요.",
    equipment: 15000,
    clothing: 20000,
    packagePrice: 35000,
    maxExtra: 10000
  },
  "vivaldi-thedream": {
    shopId: "vivaldi-thedream",
    sourceType: "travel_agency",
    confidence: "estimated",
    verifiedByHuman: false,
    verificationNote: "WAUG 더드림 패키지 노출가 기반. 옵션별 실제 결제금액 재확인 필요.",
    equipment: 14000,
    clothing: 20000,
    packagePrice: 34000,
    maxExtra: 15000
  },
  "phoenix-snowlab": {
    shopId: "phoenix-snowlab",
    sourceType: "official_booking",
    confidence: "estimated",
    verifiedByHuman: false,
    verificationNote: "밀림 예약 상품 페이지 기반. 옵션별 가격은 예약 화면에서 재확인 필요.",
    equipment: 30000,
    clothing: 25000,
    packagePrice: 55000,
    maxExtra: 15000
  },
  "yongpyong-drsnow": {
    shopId: "yongpyong-drsnow",
    sourceType: "official_site",
    confidence: "confirmed",
    verifiedByHuman: true,
    verificationNote: "닥터스노우 장비대여 페이지의 주간권 가격 텍스트 기준.",
    equipment: 35000,
    clothing: 25000,
    packagePrice: 60000,
    maxExtra: 10000
  },
  "high1-ski-no1": {
    shopId: "high1-ski-no1",
    sourceType: "official_site",
    confidence: "estimated",
    verifiedByHuman: false,
    verificationNote: "하이원스키샵1호점 의류/장비 이용가격 페이지 기반. 이미지 가격표 재확인 필요.",
    equipment: 18000,
    clothing: 20000,
    packagePrice: 38000,
    maxExtra: 12000
  },
  "alpensia-waug-rental": {
    shopId: "alpensia-waug-rental",
    sourceType: "travel_agency",
    confidence: "estimated",
    verifiedByHuman: false,
    verificationNote: "WAUG 알펜시아 리프트/장비 렌탈권 노출가 기반. 의류는 제공 여부 불확실.",
    equipment: 35000,
    clothing: 0,
    packagePrice: 35000,
    maxExtra: 10000
  },
  "o2-resort-package": {
    shopId: "o2-resort-package",
    sourceType: "travel_agency",
    confidence: "estimated",
    verifiedByHuman: false,
    verificationNote: "오투리조트 리프트·렌탈 패키지 보도자료 기반. 세부 가격은 공식 예약 오픈 시 재확인 필요.",
    equipment: 25000,
    clothing: 20000,
    packagePrice: 45000,
    maxExtra: 12000
  },
  "muju-baegam": {
    shopId: "muju-baegam",
    sourceType: "official_site",
    confidence: "estimated",
    verifiedByHuman: false,
    verificationNote: "백암스키샵 가격표/견적 페이지 기반. 시간권별 실제 가격 재확인 필요.",
    equipment: 20000,
    clothing: 20000,
    packagePrice: 40000,
    maxExtra: 10000
  },
  "konjiam-goodgear": {
    shopId: "konjiam-goodgear",
    sourceType: "official_site",
    confidence: "confirmed",
    verifiedByHuman: true,
    verificationNote: "렌탈샵 페이지의 25/26 렌탈 금액 텍스트 기준.",
    equipment: 50000,
    clothing: 25000,
    packagePrice: 75000,
    maxExtra: 20000
  },
  "elysian-worldski": {
    shopId: "elysian-worldski",
    sourceType: "official_site",
    confidence: "estimated",
    verifiedByHuman: false,
    verificationNote: "렌탈샵 가격표 일부 텍스트 추출 기반. 방문 전 재확인 필요.",
    equipment: 15000,
    clothing: 25000,
    packagePrice: 35000,
    maxExtra: 10000
  },
  "wellihilli-daegwallyeong-sports": {
    shopId: "wellihilli-daegwallyeong-sports",
    sourceType: "official_site",
    confidence: "estimated",
    verifiedByHuman: false,
    verificationNote: "렌탈샵 요금표 텍스트 추출 기반. 권종별 차이 재확인 필요.",
    equipment: 26000,
    clothing: 27000,
    packagePrice: 53000,
    maxExtra: 10000
  },
  "oakvalley-firstclub": {
    shopId: "oakvalley-firstclub",
    sourceType: "official_site",
    confidence: "estimated",
    verifiedByHuman: false,
    verificationNote: "외부 렌탈샵 가격표 페이지 기반. 방문 전 재확인 필요.",
    equipment: 25000,
    clothing: 20000,
    packagePrice: 45000,
    maxExtra: 10000
  },
  "edenvalley-modooski": {
    shopId: "edenvalley-modooski",
    sourceType: "official_site",
    confidence: "confirmed",
    verifiedByHuman: true,
    verificationNote: "모두스키 페이지의 장비/의류 개별 요금표 텍스트 기준.",
    equipment: 10000,
    clothing: 10000,
    packagePrice: 20000,
    maxExtra: 15000
  }
};

function rentalSeedForShop(shopId: string): RentalSeed {
  if (rentalSeedOverrides[shopId]) return rentalSeedOverrides[shopId];
  const official = shopId.endsWith("official-rental");
  return {
    shopId,
    sourceType: official ? "official_site" : "naver_booking",
    confidence: "estimated",
    verifiedByHuman: false,
    verificationNote: "25/26 공식/예약처 렌탈 페이지 링크 확보. 세부 금액은 시즌 재검증 필요.",
    equipment: official ? 32000 : 26000,
    clothing: official ? 28000 : 22000,
    packagePrice: official ? 54000 : 42000,
    maxExtra: official ? 10000 : 8000
  };
}

export const rentalPriceRules: RentalPriceRule[] = rentalShops.flatMap((shop) => {
  const seed = rentalSeedForShop(shop.id);
  const official = shop.id.endsWith("official-rental");
  const providerType: RentalPriceRule["providerType"] = official ? "resort_official" : "external_shop";
  const common = {
    rentalShopId: shop.id,
    resortId: shop.resortId,
    providerType,
    season: CURRENT_SEASON,
    validFrom: seasonStart,
    validTo: seasonEnd,
    dayType: "all" as const,
    sourceType: seed.sourceType,
    sourceName: shop.name,
    sourceUrl: shop.sourceUrl,
    bookingUrl: shop.url ?? shop.sourceUrl,
    confidence: seed.confidence,
    lastCheckedAt: checkedAt,
    verifiedByHuman: seed.verifiedByHuman,
    verificationNote: seed.verificationNote
  };
  const maxExtra = seed.maxExtra ?? 8000;

  const rules: RentalPriceRule[] = [
    {
      ...common,
      id: `${shop.id}-equipment-ski`,
      itemType: "equipment",
      rideType: "ski",
      ageGroup: "adult",
      label: "스키 장비 렌탈",
      representativePrice: seed.equipment,
      priceMin: seed.equipment,
      priceMax: seed.equipment + maxExtra,
      memo: "25/26 시즌 출처 기반 장비 렌탈 가격."
    },
    {
      ...common,
      id: `${shop.id}-equipment-board`,
      itemType: "equipment",
      rideType: "snowboard",
      ageGroup: "adult",
      label: "보드 장비 렌탈",
      representativePrice: seed.equipment,
      priceMin: seed.equipment,
      priceMax: seed.equipment + maxExtra,
      memo: "25/26 시즌 출처 기반 장비 렌탈 가격."
    }
  ];

  if (shop.clothingRentalAvailable) {
    rules.push({
      ...common,
      id: `${shop.id}-clothing`,
      itemType: "clothing",
      rideType: "all",
      ageGroup: "adult",
      label: "의류 세트 렌탈",
      representativePrice: seed.clothing,
      priceMin: seed.clothing,
      priceMax: seed.clothing + maxExtra,
      memo: "25/26 시즌 출처 기반 의류 렌탈 가격."
    });
    rules.push({
      ...common,
      id: `${shop.id}-package`,
      itemType: "equipment_clothing_package",
      rideType: "all",
      ageGroup: "adult",
      label: "장비 + 의류 패키지",
      representativePrice: seed.packagePrice,
      priceMin: seed.packagePrice,
      priceMax: seed.packagePrice + maxExtra,
      memo: "25/26 시즌 출처 기반 장비+의류 패키지 가격."
    });
  }

  return rules;
});
