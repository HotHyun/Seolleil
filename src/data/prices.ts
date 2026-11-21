import { CURRENT_SEASON, UPCOMING_SEASON } from "@/lib/constants";
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
    sourceName: "지산리조트 25/26 종합요금안내",
    sourceUrl: "https://www.jisanresort.co.kr/m/ski/use/rental.asp",
    sourceType: "official_site",
    verifiedByHuman: true,
    verificationNote: "공식 25/26 리프트 정상가 표 기준. 대인·소인 통합.",
    memo: "주중/주말 정상가 범위를 min/max에 기록.",
    slots: {
      "2h": { adult: 65000, min: 65000, max: 82000, confidence: "confirmed" },
      "3h": { adult: 69000, min: 69000, max: 87000, confidence: "confirmed" },
      "4h": { adult: 75000, min: 75000, max: 92000, confidence: "confirmed" },
      "6h": { adult: 79000, min: 79000, max: 97000, confidence: "confirmed" },
      night: { adult: 65000, min: 39000, max: 79000, confidence: "confirmed" },
      full_day: { adult: 97000, min: 79000, max: 97000, confidence: "estimated" }
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
    sourceName: "엘리시안 강촌 25/26 공식 이용요금",
    sourceUrl: "https://www.elysian.co.kr/about-gangchon/ski",
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
    sourceName: "하이원스키샵1호점 25/26 하이원 정상요금표",
    sourceUrl: "https://www.hi-one.kr/sub/sub04_04.php",
    sourceType: "official_site",
    verifiedByHuman: true,
    verificationNote: "25/26 외부 렌탈샵 가격표에 병기된 하이원 스키장 정상요금. 공식 사이트 원문은 재확인 필요.",
    memo: "정상가: 3시간 62,000/50,000원, 4시간 68,000/56,000원, 5시간 74,000/62,000원, 7시간 82,000/70,000원, 종일 104,000/92,000원.",
    slots: {
      "2h": { adult: 50000, min: 43900, max: 58000, confidence: "estimated" },
      "3h": { adult: 62000, child: 50000, min: 43900, max: 62000, confidence: "confirmed" },
      "4h": { adult: 68000, child: 56000, confidence: "confirmed" },
      "5h": { adult: 74000, child: 62000, confidence: "confirmed" },
      "6h": { adult: 82000, child: 70000, confidence: "estimated" },
      "7h": { adult: 82000, child: 70000, confidence: "confirmed" },
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
    sourceName: "무주 덕유산리조트 스키 요금 안내",
    sourceUrl: "https://www.mdysresort.com/ski/charge.asp",
    sourceType: "official_site",
    verifiedByHuman: false,
    verificationNote: "금액은 25/26 예약처·보도자료 기반 추정값이다. 기존 출처(WAUG 상품 페이지)가 삭제되어(2026-11-19 404) 공식 요금 안내로 출처를 교체했으며, 요금표가 이미지라 정규시즌 정상가는 재검증이 필요하다.",
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
  "jisan-official-rental": { shopId: "jisan-official-rental", sourceType: "official_site", confidence: "confirmed", verifiedByHuman: true, verificationNote: "지산 공식 25/26 4시간 장비와 의류 정상가 기준.", equipment: 31000, clothing: 25000, packagePrice: 56000, maxExtra: 5000 },
  "yongpyong-official-rental": { shopId: "yongpyong-official-rental", sourceType: "official_site", confidence: "confirmed", verifiedByHuman: true, verificationNote: "모나 용평 공식 25/26 반일 장비와 의류 요금 기준.", equipment: 40000, clothing: 20000, packagePrice: 60000, maxExtra: 8000 },
  "konjiam-brothers": { shopId: "konjiam-brothers", sourceType: "official_booking", confidence: "confirmed", verifiedByHuman: true, verificationNote: "25/26 NOL 옵션 가격 기준. 4시간 일반 스키와 신상 의류 가격.", equipment: 20000, clothing: 20000, packagePrice: 40000, maxExtra: 10000 },
  "konjiam-skibucks": { shopId: "konjiam-skibucks", sourceType: "official_site", confidence: "confirmed", verifiedByHuman: true, verificationNote: "업체 25/26 렌탈 요금표의 4시간 일반 장비와 고급 의류 세트 기준.", equipment: 20000, clothing: 20000, packagePrice: 40000, maxExtra: 30000 },
  "konjiam-ganjiboarder": { shopId: "konjiam-ganjiboarder", sourceType: "official_site", confidence: "confirmed", verifiedByHuman: true, verificationNote: "업체 25/26 리프트+장비 패키지에서 장비 렌탈분 20,000원 기준. 의류 가격은 별도 문의 대상.", equipment: 20000, clothing: 0, packagePrice: 20000, maxExtra: 15000 },
  "jisan-yg-leports": { shopId: "jisan-yg-leports", sourceType: "official_site", confidence: "confirmed", verifiedByHuman: true, verificationNote: "업체 25/26 가격표의 장비·의류 시작가 및 리프트 결합 패키지 기준.", equipment: 10000, clothing: 10000, packagePrice: 20000, maxExtra: 10000 },
  "jisan-boss": { shopId: "jisan-boss", sourceType: "official_site", confidence: "confirmed", verifiedByHuman: true, verificationNote: "업체 25/26 가격표의 4시간 일반 장비·일반 의류 가격 기준. 특수 장비와 프리미엄 의류는 추가금 범위로 반영.", equipment: 10000, clothing: 10000, packagePrice: 20000, maxExtra: 20000 },
  "vivaldi-vision": { shopId: "vivaldi-vision", sourceType: "official_booking", confidence: "confirmed", verifiedByHuman: true, verificationNote: "25/26 NOL 고급장비·고급의류 4시간권 기준.", equipment: 15000, clothing: 15000, packagePrice: 30000, maxExtra: 10000 },
  "vivaldi-jamesboard": { shopId: "vivaldi-jamesboard", sourceType: "official_site", confidence: "confirmed", verifiedByHuman: true, verificationNote: "업체 현재 가격표의 일반 장비·의류 1일 시작가와 풀세트 가격 기준.", equipment: 25000, clothing: 15000, packagePrice: 40000, maxExtra: 15000 },
  "phoenix-torres": { shopId: "phoenix-torres", sourceType: "official_booking", confidence: "confirmed", verifiedByHuman: true, verificationNote: "25/26 NOL 4시간 고급의류+고급장비 패스권 기준.", equipment: 29800, clothing: 29800, packagePrice: 29800, maxExtra: 10000 },
  "yongpyong-beaver": { shopId: "yongpyong-beaver", sourceType: "official_booking", confidence: "confirmed", verifiedByHuman: true, verificationNote: "25/26 NOL 일반 장비 1타임 가격 기준. 의류는 공개 판매 페이지의 취급 확인값.", equipment: 15000, clothing: 15000, packagePrice: 30000, maxExtra: 10000 },
  "yongpyong-white-sports": { shopId: "yongpyong-white-sports", sourceType: "official_site", confidence: "confirmed", verifiedByHuman: true, verificationNote: "업체 판매 페이지의 용평 일반 장비·일반 의류 1타임 가격 기준.", equipment: 15000, clothing: 15000, packagePrice: 30000, maxExtra: 20000 },
  "yongpyong-point-ski": { shopId: "yongpyong-point-ski", sourceType: "official_booking", confidence: "confirmed", verifiedByHuman: true, verificationNote: "25/26 NOL 일반 장비와 일반 장비+의류 1타임 가격 기준.", equipment: 15000, clothing: 20000, packagePrice: 35000, maxExtra: 10000 },
  "alpensia-point-ski": { shopId: "alpensia-point-ski", sourceType: "official_booking", confidence: "confirmed", verifiedByHuman: true, verificationNote: "25/26 NOL 일반장비 단품 및 일반장비+일반의류 1타임 가격 기준.", equipment: 15000, clothing: 20000, packagePrice: 35000, maxExtra: 10000 },
  "alpensia-ski911": { shopId: "alpensia-ski911", sourceType: "official_booking", confidence: "confirmed", verifiedByHuman: true, verificationNote: "25/26 NOL 일반 장비·일반 의류 1타임 가격 기준. 상급 장비와 브랜드 의류는 추가금 범위로 반영.", equipment: 15000, clothing: 15000, packagePrice: 30000, maxExtra: 25000 },
  "alpensia-discovery": { shopId: "alpensia-discovery", sourceType: "official_booking", confidence: "confirmed", verifiedByHuman: true, verificationNote: "25/26 ZAPSNOW 용평·알펜시아 디스커버리 일반 스키 주간·오후야간 판매가 기준. 의류 가격은 확인되지 않아 제외.", equipment: 20000, clothing: 0, packagePrice: 20000, maxExtra: 5000 },
  "alpensia-beaver": { shopId: "alpensia-beaver", sourceType: "official_booking", confidence: "confirmed", verifiedByHuman: true, verificationNote: "25/26 NOL 일반 장비 1타임 가격과 알펜시아 픽업 안내 기준.", equipment: 15000, clothing: 15000, packagePrice: 30000, maxExtra: 10000 },
  "oakvalley-advance": { shopId: "oakvalley-advance", sourceType: "official_booking", confidence: "confirmed", verifiedByHuman: true, verificationNote: "25/26 전진스키 장비 렌탈 판매 상품의 검색 노출 최저가 기준. 의류는 취급 여부가 확인되지 않아 제외.", equipment: 14250, clothing: 0, packagePrice: 14250, maxExtra: 10750 },
  "muju-arirang": { shopId: "muju-arirang", sourceType: "official_booking", confidence: "confirmed", verifiedByHuman: true, verificationNote: "25/26 NOL 고급장비·고급의류 단품 가격 기준.", equipment: 15000, clothing: 15000, packagePrice: 30000, maxExtra: 15000 },
  "muju-snowpark": { shopId: "muju-snowpark", sourceType: "official_site", confidence: "confirmed", verifiedByHuman: true, verificationNote: "업체 25/26 가격표의 일반 장비·프리미엄 의류 가격 기준.", equipment: 20000, clothing: 20000, packagePrice: 40000, maxExtra: 10000 },
  "muju-hyundai": { shopId: "muju-hyundai", sourceType: "official_booking", confidence: "confirmed", verifiedByHuman: true, verificationNote: "25/26 NOL 고급 장비·고급 의류와 결합 가격 기준.", equipment: 20000, clothing: 20000, packagePrice: 40000, maxExtra: 20000 },
  "muju-skilife": { shopId: "muju-skilife", sourceType: "official_site", confidence: "confirmed", verifiedByHuman: true, verificationNote: "업체 현재 공개 페이지의 주중/주말 장비·의류 및 풀세트 가격 기준.", equipment: 15000, clothing: 15000, packagePrice: 40000, maxExtra: 10000 },
  "jisan-boong": {
    shopId: "jisan-boong",
    sourceType: "official_site",
    confidence: "confirmed",
    verifiedByHuman: true,
    verificationNote: "업체 25/26 가격표의 장비·스탠다드 의류 단품 가격 기준.",
    equipment: 10000,
    clothing: 10000,
    packagePrice: 20000,
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
  "phoenix-junski": {
    shopId: "phoenix-junski",
    sourceType: "official_booking",
    confidence: "confirmed",
    verifiedByHuman: true,
    verificationNote: "25/26 판매 상품의 1타임 장비·의류·결합 옵션 노출가 기준.",
    equipment: 14160,
    clothing: 23660,
    packagePrice: 33160,
    maxExtra: 9500
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
    confidence: "confirmed",
    verifiedByHuman: true,
    verificationNote: "25/26 장비·의류 가격표 텍스트 기준. 대표가는 3/4시간 일반 장비와 성인 고급 의류 조합.",
    equipment: 12000,
    clothing: 22000,
    packagePrice: 34000,
    maxExtra: 10000
  },
  "high1-myski": {
    shopId: "high1-myski",
    sourceType: "official_site",
    confidence: "confirmed",
    verifiedByHuman: true,
    verificationNote: "업체 25/26 페이지의 장비·의류·리프트 할인표와 픽업 안내 기준.",
    equipment: 12000,
    clothing: 15000,
    packagePrice: 27000,
    maxExtra: 10000
  },
  "high1-four-season": {
    shopId: "high1-four-season",
    sourceType: "official_booking",
    confidence: "confirmed",
    verifiedByHuman: true,
    verificationNote: "25/26 NOL 판매 페이지의 주중·주말 공통 장비와 의류 옵션 가격 기준.",
    equipment: 12000,
    clothing: 12000,
    packagePrice: 24000,
    maxExtra: 10000
  },
  "high1-official-rental": {
    shopId: "high1-official-rental",
    sourceType: "official_booking",
    confidence: "estimated",
    verifiedByHuman: false,
    verificationNote: "25/26 외부샵 가격표에 병기된 스키장 내 정상 장비요금. 하이원 공식 원문 재확인 필요.",
    equipment: 27000,
    clothing: 0,
    packagePrice: 27000,
    maxExtra: 27000
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
    confidence: "confirmed",
    verifiedByHuman: true,
    verificationNote: "업체 25/26 페이지의 고급 장비·의류 시작가 기준.",
    equipment: 15000,
    clothing: 15000,
    packagePrice: 30000,
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
  const official = shop.id.endsWith("official-rental");
  if (!official && shop.dataStatus && shop.dataStatus !== "verified_25_26") return [];
  const seed = rentalSeedForShop(shop.id);
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

  if (shop.clothingRentalAvailable && seed.clothing > 0) {
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

const high1DetailedRentalRules: RentalPriceRule[] = [
  ...["high1-ski-no1", "high1-myski"].flatMap((shopId) => {
    const shop = rentalShops.find((item) => item.id === shopId)!;
    const base = { rentalShopId: shopId, resortId: "high1", providerType: "external_shop" as const, season: CURRENT_SEASON, validFrom: seasonStart, validTo: seasonEnd, dayType: "all" as const, sourceType: "official_site" as const, sourceName: shop.name, sourceUrl: shopId === "high1-ski-no1" ? "https://www.hi-one.kr/sub/sub04_02.php" : shop.sourceUrl, bookingUrl: shop.url, confidence: "confirmed" as const, lastCheckedAt: "2026-07-15", verifiedByHuman: true };
    const clothing = shopId === "high1-ski-no1" ? 22000 : 15000;
    return [
      { ...base, id: `${shopId}-equipment-5h`, itemType: "equipment" as const, timeSlot: "5h" as const, rideType: "all" as const, ageGroup: "all" as const, label: "일반 스키·보드 장비 5/7시간", representativePrice: 17000, priceMin: 17000, priceMax: 17000, verificationNote: "업체 25/26 공개 가격표 확인.", memo: "5시간과 7시간 일반 장비 동일가." },
      { ...base, id: `${shopId}-equipment-full-day`, itemType: "equipment" as const, timeSlot: "full_day" as const, rideType: "all" as const, ageGroup: "all" as const, label: "일반 스키·보드 장비 종일", representativePrice: 22000, priceMin: 22000, priceMax: 22000, verificationNote: "업체 25/26 공개 가격표 확인." },
      { ...base, id: `${shopId}-clothing-grade`, itemType: "clothing" as const, rideType: "all" as const, ageGroup: "adult" as const, label: shopId === "high1-ski-no1" ? "성인 고급 의류" : "고급 의류", representativePrice: clothing, priceMin: clothing, priceMax: clothing, verificationNote: "업체 25/26 공개 가격표 확인." },
      { ...base, id: `${shopId}-goggles`, itemType: "goggles" as const, rideType: "all" as const, ageGroup: "all" as const, label: "고글", representativePrice: 5000, priceMin: 5000, priceMax: 5000, verificationNote: "업체 25/26 공개 가격표 확인." },
      { ...base, id: `${shopId}-helmet`, itemType: "helmet" as const, rideType: "all" as const, ageGroup: "all" as const, label: "일반 헬멧", representativePrice: 5000, priceMin: 5000, priceMax: 5000, verificationNote: "업체 25/26 공개 가격표 확인." },
      { ...base, id: `${shopId}-visor-helmet`, itemType: "helmet" as const, rideType: "all" as const, ageGroup: "all" as const, label: "바이저 헬멧", representativePrice: 15000, priceMin: 15000, priceMax: 15000, verificationNote: "업체 25/26 공개 가격표 확인." },
      { ...base, id: `${shopId}-protective-gear`, itemType: "protective_gear" as const, rideType: "all" as const, ageGroup: "all" as const, label: "보호대", representativePrice: 5000, priceMin: 5000, priceMax: 5000, verificationNote: "업체 25/26 공개 가격표 확인." }
    ];
  }),
  ...(["3h", "4h", "5h", "7h", "full_day"] as const).flatMap((timeSlot, index) => {
    const official = [62000, 68000, 74000, 82000, 104000][index];
    const shopPrices = { "high1-ski-no1": [44000, 48000, 52000, 58000, 73000], "high1-myski": [40000, 44000, 48000, 53000, 68000] } as const;
    return Object.entries(shopPrices).map(([shopId, prices]) => ({ rentalShopId: shopId, resortId: "high1", providerType: "external_shop" as const, season: CURRENT_SEASON, itemType: "lift_ticket" as const, timeSlot, rideType: "all" as const, ageGroup: "adult" as const, label: `성수기 리프트 ${timeSlot} 성인`, validFrom: "2025-12-20", validTo: "2026-02-22", dayType: "peak" as const, representativePrice: prices[index], priceMin: prices[index], priceMax: official, sourceType: "official_site" as const, sourceName: rentalShops.find((item) => item.id === shopId)?.name, sourceUrl: shopId === "high1-ski-no1" ? "https://www.hi-one.kr/sub/sub04_04.php" : "https://high1myski.com/", bookingUrl: rentalShops.find((item) => item.id === shopId)?.url, confidence: "confirmed" as const, lastCheckedAt: "2026-07-15", verifiedByHuman: true, verificationNote: "업체 25/26 성수기 공개 할인표의 성인 리프트 단독 구매가.", memo: `하이원 정상가 ${official.toLocaleString()}원 대비 업체 공개 할인 판매가.`, id: `${shopId}-lift-peak-${timeSlot}` }));
  })
];

rentalPriceRules.push(...high1DetailedRentalRules);

// 26/27 시즌: 공식 페이지에 26/27 가격이 게시된 리조트만 등록한다. 게시된 요금표에 없는 시간권은 판매하지 않는 것으로 보고 규칙을 만들지 않는다(25/26 값을 이어 쓰지 않는다). 25/26 규칙과 같은 라벨·구분을 써서 전환 보드가 대체 관계를 인식한다.
const upcomingCheckedAt = "2026-11-19";

type UpcomingLiftSeed = {
  resortId: string;
  resortName: string;
  sourceName: string;
  sourceUrl: string;
  validFrom: string;
  validTo: string;
  lastCheckedAt?: string;
  verificationNote: string;
  slots: Array<{
    slot: TimeSlot;
    adult: number;
    /** 공지에 소인 가격이 없으면 생략한다. */
    child?: number;
    /** 주중/주말 구분이 있는 가격만 지정한다. 기본은 all. */
    dayType?: "weekday" | "weekend";
    /** 25/26 규칙과 구분이 달라지는 항목이 대체 관계를 잃지 않게 25/26 키를 직접 지정한다. */
    replacementKey?: string;
    memo: string;
  }>;
};

type UpcomingOfficialRentalSeed = {
  resortId: string;
  sourceName: string;
  sourceUrl: string;
  validFrom: string;
  validTo: string;
  verificationNote: string;
  memo: string;
  equipment: { price: number; max: number };
  clothing: { price: number; max: number };
};

const upcomingDayTypeSuffix = { weekday: " 주중", weekend: " 주말" } as const;

function upcomingLiftRules(seed: UpcomingLiftSeed): PriceRule[] {
  return seed.slots.map(({ slot, adult, child, dayType, replacementKey, memo }) => ({
    id: `${seed.resortId}-lift-${slot}${dayType ? `-${dayType}` : ""}-26-27`,
    replacementKey,
    resortId: seed.resortId,
    season: UPCOMING_SEASON,
    itemType: "lift_ticket" as const,
    label: `${seed.resortName} ${slot} 리프트권${dayType ? upcomingDayTypeSuffix[dayType] : ""}`,
    validFrom: seed.validFrom,
    validTo: seed.validTo,
    dayType: dayType ?? ("all" as const),
    timeSlot: slot,
    adultPrice: adult,
    childPrice: child,
    priceMin: adult,
    priceMax: adult,
    sourceType: "official_site" as const,
    sourceName: seed.sourceName,
    sourceUrl: seed.sourceUrl,
    bookingUrl: seed.sourceUrl,
    confidence: "confirmed" as const,
    lastCheckedAt: seed.lastCheckedAt ?? upcomingCheckedAt,
    verifiedByHuman: true,
    verificationNote: seed.verificationNote,
    memo
  }));
}

function upcomingOfficialRentalRules(seed: UpcomingOfficialRentalSeed): RentalPriceRule[] {
  const shopId = `${seed.resortId}-official-rental`;
  const common = {
    rentalShopId: shopId,
    resortId: seed.resortId,
    providerType: "resort_official" as const,
    season: UPCOMING_SEASON,
    validFrom: seed.validFrom,
    validTo: seed.validTo,
    dayType: "all" as const,
    ageGroup: "adult" as const,
    sourceType: "official_site" as const,
    sourceName: seed.sourceName,
    sourceUrl: seed.sourceUrl,
    bookingUrl: seed.sourceUrl,
    confidence: "confirmed" as const,
    lastCheckedAt: upcomingCheckedAt,
    verifiedByHuman: true,
    verificationNote: seed.verificationNote,
    memo: seed.memo
  };
  const equipment = { representativePrice: seed.equipment.price, priceMin: seed.equipment.price, priceMax: seed.equipment.max };
  return [
    { ...common, ...equipment, id: `${shopId}-equipment-ski-26-27`, itemType: "equipment", rideType: "ski", label: "스키 장비 렌탈" },
    { ...common, ...equipment, id: `${shopId}-equipment-board-26-27`, itemType: "equipment", rideType: "snowboard", label: "보드 장비 렌탈" },
    {
      ...common,
      id: `${shopId}-clothing-26-27`,
      itemType: "clothing",
      rideType: "all",
      label: "의류 세트 렌탈",
      representativePrice: seed.clothing.price,
      priceMin: seed.clothing.price,
      priceMax: seed.clothing.max
    },
    {
      ...common,
      id: `${shopId}-package-26-27`,
      itemType: "equipment_clothing_package",
      rideType: "all",
      label: "장비 + 의류 패키지",
      representativePrice: seed.equipment.price + seed.clothing.price,
      priceMin: seed.equipment.price + seed.clothing.price,
      priceMax: seed.equipment.max + seed.clothing.max
    }
  ];
}

const upcomingLiftSeeds: UpcomingLiftSeed[] = [
  {
    resortId: "vivaldi",
    resortName: "비발디파크 스키월드",
    sourceName: "비발디파크 스키월드 공식 요금&할인 안내",
    sourceUrl: "https://www.sonohotelsresorts.com/skiboard/discount",
    validFrom: "2026-11-01",
    validTo: "2027-03-31",
    lastCheckedAt: "2026-11-21",
    verificationNote: "공식 요금&할인 페이지의 현재 리프트 요금을 반영했다. 페이지 자체에는 26/27 시즌 표기가 없어, 현행 26/27 시즌의 공식 가격으로 등록하되 유효 시작일은 개장일 미공지 상태를 고려해 2026-11-01로 두었다. 시즌 운영 종료일도 미공지라 2027-03-31을 앱 시즌 경계로 사용한다. 공식 주말가는 공휴일도 포함하지만 앱은 평일 공휴일을 주말로 자동 분류하지 않는다.",
    slots: [
      { slot: "5h", dayType: "weekday", adult: 75000, child: 68000, memo: "주중(월~금) 대인 75,000원·소인 68,000원. 소인은 2014~2023년 출생자 기준. 장비 대여는 약관상 리프트권보다 1시간 더 부여된다." },
      { slot: "5h", dayType: "weekend", adult: 91000, child: 82000, memo: "주말·공휴일 대인 91,000원·소인 82,000원. 소인은 2014~2023년 출생자 기준. 장비 대여는 약관상 리프트권보다 1시간 더 부여된다." },
      { slot: "6h", dayType: "weekday", adult: 79000, child: 71000, memo: "주중(월~금) 대인 79,000원·소인 71,000원. 소인은 2014~2023년 출생자 기준. 장비 대여는 약관상 리프트권보다 1시간 더 부여된다.", replacementKey: "vivaldi|lift_ticket|6h|all|비발디파크 스키월드 6h 리프트권" },
      { slot: "6h", dayType: "weekend", adult: 95000, child: 86000, memo: "주말·공휴일 대인 95,000원·소인 86,000원. 소인은 2014~2023년 출생자 기준. 장비 대여는 약관상 리프트권보다 1시간 더 부여된다.", replacementKey: "vivaldi|lift_ticket|6h|all|비발디파크 스키월드 6h 리프트권" },
      { slot: "7h", dayType: "weekday", adult: 83000, child: 75000, memo: "주중(월~금) 대인 83,000원·소인 75,000원. 소인은 2014~2023년 출생자 기준. 장비 대여는 약관상 리프트권보다 1시간 더 부여된다." },
      { slot: "7h", dayType: "weekend", adult: 99000, child: 89000, memo: "주말·공휴일 대인 99,000원·소인 89,000원. 소인은 2014~2023년 출생자 기준. 장비 대여는 약관상 리프트권보다 1시간 더 부여된다." }
    ]
  },
  {
    resortId: "high1",
    resortName: "하이원리조트",
    sourceName: "하이원 스키 이용요금(26/27 시즌)",
    sourceUrl: "https://www.high1.com/ski/contents.do",
    validFrom: "2026-11-24",
    validTo: "2027-03-31",
    verificationNote: "공식 스키 이용요금 페이지의 리프트권(시간권) 표 기준(2026-11-20 확인). 표에 없는 2시간·5시간·6시간·야간권은 판매하지 않는 것으로 본다. 주중·주말 구분과 소인 가격은 표시되지 않는다.",
    slots: [
      { slot: "3h", adult: 66000, memo: "공식 3시간권. 게이트 최초 통과 시점부터 적용, 정설시간(16~18시) 이용 불가." },
      { slot: "4h", adult: 73000, memo: "공식 4시간권." },
      { slot: "7h", adult: 88000, memo: "공식 7시간권." },
      { slot: "full_day", adult: 111000, memo: "공식 종일권." }
    ]
  },
  {
    resortId: "konjiam",
    resortName: "곤지암리조트",
    sourceName: "곤지암리조트 26/27 얼리버드 리프트권 판매 공지(2026-10-30)",
    sourceUrl: "https://m.konjiamresort.co.kr/contact/notice.dev",
    // 개장은 '12월 중'으로만 공지됐다. 개장일이 확정되기 전 날짜도 가격이 비지 않도록 시즌 초부터 둔다.
    validFrom: "2026-11-01",
    validTo: "2027-03-31",
    lastCheckedAt: "2026-11-21",
    verificationNote: "공식 공지의 26/27 리프트권 정상가(주중·주말 2·4·6시간) 기준. 공지에 없는 3시간·야간·종일권은 판매하지 않는 것으로 본다. 소인 가격은 공지에 없다.",
    slots: [
      { slot: "2h", dayType: "weekday", adult: 69000, replacementKey: "konjiam|lift_ticket|2h|all|곤지암리조트 2h 리프트권", memo: "공식 공지 주중 2시간 정상가. 얼리버드(NOL 한정)는 정상가에 반영하지 않고 할인 안내로 따로 보여 준다." },
      { slot: "2h", dayType: "weekend", adult: 83000, replacementKey: "konjiam|lift_ticket|2h|all|곤지암리조트 2h 리프트권", memo: "공식 공지 주말 2시간 정상가." },
      { slot: "4h", dayType: "weekday", adult: 81000, memo: "공식 공지 주중 4시간 정상가(25/26과 동일)." },
      { slot: "4h", dayType: "weekend", adult: 96000, memo: "공식 공지 주말 4시간 정상가(25/26과 동일)." },
      { slot: "6h", dayType: "weekday", adult: 87000, memo: "공식 공지 주중 6시간 정상가(25/26과 동일)." },
      { slot: "6h", dayType: "weekend", adult: 105000, memo: "공식 공지 주말 6시간 정상가(25/26과 동일)." }
    ]
  },
  {
    resortId: "yongpyong",
    resortName: "모나 용평",
    sourceName: "모나용평 26/27시즌 리프트 요금",
    sourceUrl: "https://www.yongpyong.co.kr/kor/skiNboard/utilizationFee/rentCharge.do",
    validFrom: "2026-11-22",
    validTo: "2027-03-31",
    lastCheckedAt: "2026-11-21",
    verificationNote: "공식 페이지의 '26/27시즌 리프트 요금' 표(대인·소인) 기준. 8시간권은 종일(full_day)로 매핑.",
    slots: [
      { slot: "4h", adult: 79000, child: 69000, memo: "공식 4시간권. 개장 특가(11/22 하루 10,000원)와 슬로프 1면 운영 시 특가(4시간 30,000원)는 정상가가 아니어서 반영하지 않았다." },
      { slot: "6h", adult: 89000, child: 79000, memo: "공식 6시간권. 슬로프 1면 운영 시 특가(6시간 35,000원)는 반영하지 않았다." },
      { slot: "full_day", adult: 99000, child: 89000, memo: "공식 8시간권. 슬로프 1면 운영 시 특가(8시간 40,000원)는 반영하지 않았다." }
    ]
  },
  {
    resortId: "alpensia",
    resortName: "알펜시아 리조트",
    sourceName: "알펜시아 스키700 26/27 시즌 리프트 요금",
    sourceUrl: "https://www.alpensia.com/ski/use-cost-lift.do",
    validFrom: "2026-12-01",
    validTo: "2027-03-07",
    verificationNote: "공식 페이지의 '26/27 시즌' 리프트 요금 표(대인·소인) 기준. 개장일은 '오픈일'로만 표기되어 시작일은 12월 1일로 두었다.",
    slots: [
      { slot: "4h", adult: 59000, child: 48000, memo: "오전권(09:00~13:00)·오후권(13:00~17:00) 4시간, 가격 동일." },
      { slot: "night", adult: 46000, child: 35000, memo: "야간권 18:30~21:30(3시간). 야간 운영은 2026-12-19~2027-02-13." },
      { slot: "full_day", adult: 76000, child: 57000, memo: "주간권 09:00~17:00(8시간). 주간 운영은 오픈일~12-18, 2027-02-14~03-07." },
      { slot: "7h", adult: 76000, child: 57000, memo: "후야권 13:00~21:30(7시간)." }
    ]
  }
];

priceRules.push(...upcomingLiftSeeds.flatMap(upcomingLiftRules));

const vivaldiUpcomingRentalCommon = {
  rentalShopId: "vivaldi-official-rental",
  resortId: "vivaldi",
  providerType: "resort_official" as const,
  season: UPCOMING_SEASON,
  validFrom: "2026-11-01",
  validTo: "2027-03-31",
  sourceType: "official_site" as const,
  sourceName: "비발디파크 스키월드 공식 요금&할인 안내",
  sourceUrl: "https://www.sonohotelsresorts.com/skiboard/discount",
  bookingUrl: "https://www.sonohotelsresorts.com/skiboard/discount",
  confidence: "confirmed" as const,
  lastCheckedAt: "2026-11-21",
  verifiedByHuman: true,
  verificationNote: "공식 현재 요금표 기준. 페이지에는 26/27 표기가 없고, 공식 이용약관은 장비 대여 시간이 리프트권보다 1시간 길다고 명시한다. 의류 렌탈 가격은 표에 없다. 공식 주말가는 공휴일도 포함하지만 앱은 평일 공휴일을 주말로 자동 분류하지 않는다."
};

const vivaldiRentalSlots = [
  { liftSlot: "5h" as const, rentalHours: 6, weekday: 34000, weekend: 43000, childWeekday: 31000, childWeekend: 39000 },
  { liftSlot: "6h" as const, rentalHours: 7, weekday: 36000, weekend: 45000, childWeekday: 32000, childWeekend: 40000 },
  { liftSlot: "7h" as const, rentalHours: 8, weekday: 38000, weekend: 47000, childWeekday: 34000, childWeekend: 42000 }
];
const vivaldiUpcomingRentalRules: RentalPriceRule[] = [
  ...vivaldiRentalSlots.flatMap(slot => (["weekday", "weekend"] as const).flatMap(dayType => (["ski", "snowboard"] as const).map(rideType => {
    const price = slot[dayType];
    const childPrice = dayType === "weekday" ? slot.childWeekday : slot.childWeekend;
    return {
      ...vivaldiUpcomingRentalCommon,
      id: `vivaldi-official-rental-equipment-${rideType}-${slot.liftSlot}-${dayType}-26-27`,
      itemType: "equipment" as const,
      rideType,
      ageGroup: "adult" as const,
      timeSlot: slot.liftSlot,
      dayType,
      label: `${rideType === "ski" ? "스키" : "보드"} 장비 렌탈 ${slot.rentalHours}시간`,
      representativePrice: price,
      priceMin: price,
      priceMax: price,
      memo: `리프트 ${slot.liftSlot} 이용에 대응하는 ${slot.rentalHours}시간 대여. 대인 ${price.toLocaleString()}원, 소인 ${childPrice.toLocaleString()}원. 헬멧은 별도.`
    };
  }))),
  ...vivaldiRentalSlots.map(slot => {
    const price = slot.rentalHours === 6 ? 5000 : slot.rentalHours === 7 ? 6000 : 7000;
    return {
      ...vivaldiUpcomingRentalCommon,
      id: `vivaldi-official-rental-helmet-${slot.liftSlot}-26-27`,
      itemType: "helmet" as const,
      rideType: "all" as const,
      ageGroup: "all" as const,
      timeSlot: slot.liftSlot,
      dayType: "all" as const,
      label: `안전헬멧 렌탈 ${slot.rentalHours}시간`,
      representativePrice: price,
      priceMin: price,
      priceMax: price,
      memo: `리프트 ${slot.liftSlot} 이용에 대응하는 ${slot.rentalHours}시간 헬멧 대여. 대·소인 균일가.`
    };
  })
];

const konjiamUpcomingRentalCommon = {
  rentalShopId: "konjiam-official-rental",
  resortId: "konjiam",
  providerType: "resort_official" as const,
  season: UPCOMING_SEASON,
  validFrom: "2026-11-01",
  validTo: "2027-03-31",
  sourceType: "official_site" as const,
  sourceName: "곤지암리조트 공식 요금 안내",
  sourceUrl: "https://m.konjiamresort.co.kr/ski/skiInfo.dev",
  bookingUrl: "https://m.konjiamresort.co.kr/ski/skiInfo.dev",
  confidence: "confirmed" as const,
  lastCheckedAt: "2026-11-21",
  verifiedByHuman: true,
  verificationNote: "공식 최신 요금 안내 페이지 기준. 리프트 표에는 26/27 카드 할인 안내가 있지만 렌탈 표 자체에는 시즌명이 없어 26/27 현재 요금으로 반영했다. 부분 장비 렌탈은 풀세트 가격과 구분했다."
};
const konjiamUpcomingRentalRates = [
  { dayType: "weekday" as const, price: 36000 },
  { dayType: "weekend" as const, price: 39000 }
];
const konjiamUpcomingRentalRules: RentalPriceRule[] = [
  ...konjiamUpcomingRentalRates.flatMap(rate => (["ski", "snowboard"] as const).map(rideType => ({
    ...konjiamUpcomingRentalCommon,
    id: `konjiam-official-rental-equipment-${rideType}-${rate.dayType}-26-27`,
    itemType: "equipment" as const,
    rideType,
    ageGroup: "adult" as const,
    timeSlot: "all" as const,
    dayType: rate.dayType,
    label: `${rideType === "ski" ? "스키" : "보드"} 장비 풀세트 렌탈 (6시간)`,
    representativePrice: rate.price,
    priceMin: rate.price,
    priceMax: rate.price,
    memo: `6시간 풀세트 대여 대인 요금. 주중 36,000원·주말 39,000원. 부분 렌탈은 플레이트/데크 주중 21,000원·주말 26,000원, 부츠 주중 19,000원·주말 23,000원으로 별도 판매.`
  }))),
  ...([
    { timeSlot: "2h", price: 27000, hoursLabel: "4시간 이하" },
    { timeSlot: "4h", price: 27000, hoursLabel: "4시간 이하" },
    { timeSlot: "6h", price: 35000, hoursLabel: "4시간 초과" }
  ] as const).map(({ timeSlot, price, hoursLabel }) => ({
    ...konjiamUpcomingRentalCommon,
    id: `konjiam-official-rental-clothing-${timeSlot}-26-27`,
    itemType: "clothing" as const,
    rideType: "all" as const,
    ageGroup: "adult" as const,
    timeSlot,
    dayType: "all" as const,
    label: `의류 풀세트 렌탈 (${hoursLabel})`,
    representativePrice: price,
    priceMin: price,
    priceMax: price,
    memo: `공식 의류 풀세트 대인 요금 ${price.toLocaleString()}원. 현장 접수만 가능.`
  })),
  ...konjiamUpcomingRentalRates.flatMap(rate => ([
    { timeSlot: "2h", clothingPrice: 27000 },
    { timeSlot: "4h", clothingPrice: 27000 },
    { timeSlot: "6h", clothingPrice: 35000 }
  ] as const).map(({ timeSlot, clothingPrice }) => {
    const price = rate.price + clothingPrice;
    return {
      ...konjiamUpcomingRentalCommon,
      id: `konjiam-official-rental-separate-sum-${timeSlot}-${rate.dayType}-26-27`,
      itemType: "equipment_clothing_package" as const,
      rideType: "all" as const,
      ageGroup: "adult" as const,
      timeSlot,
      dayType: rate.dayType,
      label: `장비·의류 별도 대여 합산 (${timeSlot})`,
      representativePrice: price,
      priceMin: price,
      priceMax: price,
      memo: `공식 묶음상품이 아니다. 6시간 장비 풀세트 ${rate.price.toLocaleString()}원과 ${timeSlot === "6h" ? "4시간 초과" : "4시간 이하"} 의류 ${clothingPrice.toLocaleString()}원을 각각 대여할 때의 합계 ${price.toLocaleString()}원.`
    };
  })),
  ...([
    { timeSlot: "2h", price: 9000, hoursLabel: "4시간 이하" },
    { timeSlot: "4h", price: 9000, hoursLabel: "4시간 이하" },
    { timeSlot: "6h", price: 12000, hoursLabel: "4시간 초과" }
  ] as const).map(({ timeSlot, price, hoursLabel }) => ({
    ...konjiamUpcomingRentalCommon,
    id: `konjiam-official-rental-helmet-${timeSlot}-26-27`,
    itemType: "helmet" as const,
    rideType: "all" as const,
    ageGroup: "all" as const,
    timeSlot,
    dayType: "all" as const,
    label: `헬멧 렌탈 (${hoursLabel})`,
    representativePrice: price,
    priceMin: price,
    priceMax: price,
    memo: "공식 보호장구 요금표 기준. 보호대 렌탈은 10,000원."
  })),
  {
    ...konjiamUpcomingRentalCommon,
    id: "konjiam-official-rental-protective-gear-26-27",
    itemType: "protective_gear" as const,
    rideType: "all" as const,
    ageGroup: "all" as const,
    timeSlot: "all" as const,
    dayType: "all" as const,
    label: "보호대 렌탈",
    representativePrice: 10000,
    priceMin: 10000,
    priceMax: 10000,
    memo: "공식 보호장구 요금표 기준."
  }
];

rentalPriceRules.push(
  ...vivaldiUpcomingRentalRules,
  ...konjiamUpcomingRentalRules,
  ...upcomingOfficialRentalRules({
    resortId: "yongpyong",
    sourceName: "모나용평 26/27시즌 장비·의류 렌탈 요금",
    sourceUrl: "https://www.yongpyong.co.kr/kor/skiNboard/utilizationFee/rentCharge.do",
    validFrom: "2026-11-22",
    validTo: "2027-03-31",
    verificationNote: "공식 페이지의 '26/27시즌 장비(세트) 렌탈 요금'과 의류 렌탈 표 기준. 대표값은 일반 장비 4시간 대인과 의류 한벌 주간.",
    memo: "일반 장비 대인 4시간 44,000원~8시간 54,000원(소인 39,000~49,000원), 의류 한벌 주간 33,000원~주간+야간 50,000원. 고급 장비·부분 렌탈·연일권은 대표값에 넣지 않았다.",
    equipment: { price: 44000, max: 54000 },
    clothing: { price: 33000, max: 50000 }
  }),
  ...upcomingOfficialRentalRules({
    resortId: "alpensia",
    sourceName: "알펜시아 스키700 렌탈 & 시설 이용 요금",
    sourceUrl: "https://www.alpensia.com/ski/use-cost-rental.do",
    validFrom: "2026-12-01",
    validTo: "2027-03-07",
    verificationNote: "공식 렌탈 표에 시즌 표기는 없지만 같은 페이지의 운영 일정이 26/27(2027-03-07 폐장)이다. 대표값은 오전·오후·야간 반일권(대인).",
    memo: "스키·보드 반일 32,000원~당일권 50,000원(소인 26,000~40,000원), 의류 세트 반일 20,000원~당일 35,000원(대·소인 동일). 부분 렌탈과 헬멧은 대표값에 넣지 않았다.",
    equipment: { price: 32000, max: 50000 },
    clothing: { price: 20000, max: 35000 }
  })
);

// 26/27 규칙이 아직 없는 리조트·렌탈샵의 25/26 규칙은 26/27 방문일에 참고가로 쓸 수 있다고 표시한다.
// 26/27 규칙이 등록되면 위 목록이 바뀌어 해당 항목의 폴백이 자동으로 꺼진다. (src/lib/season-fallback.ts)
const upcomingLiftResortIds = new Set(priceRules.filter(rule => rule.season === UPCOMING_SEASON && rule.itemType === "lift_ticket").map(rule => rule.resortId));
const upcomingRentalShopIds = new Set(rentalPriceRules.filter(rule => rule.season === UPCOMING_SEASON && rule.rentalShopId).map(rule => rule.rentalShopId));
const upcomingRentalResortIdsWithoutShop = new Set(rentalPriceRules.filter(rule => rule.season === UPCOMING_SEASON && !rule.rentalShopId).map(rule => rule.resortId));

for (const rule of priceRules) {
  if (rule.season === CURRENT_SEASON && rule.itemType === "lift_ticket") rule.upcomingFallback = !upcomingLiftResortIds.has(rule.resortId);
}
for (const rule of rentalPriceRules) {
  if (rule.season !== CURRENT_SEASON) continue;
  rule.upcomingFallback = rule.rentalShopId ? !upcomingRentalShopIds.has(rule.rentalShopId) : !upcomingRentalResortIdsWithoutShop.has(rule.resortId);
}
