import type { DepartureLocation, RentalShop, SkiResort } from "@/lib/types";

const checkedAt = "2026-05-13";

export const resorts: SkiResort[] = [
  {
    id: "konjiam",
    name: "곤지암리조트",
    region: "경기 광주",
    address: "경기도 광주시 도척면 도척윗로 278",
    officialUrl: "https://www.konjiamresort.co.kr/",
    slopeStatusUrl: "https://www.konjiamresort.co.kr/",
    liftTicketUrl: "https://www.konjiamresort.co.kr/",
    rentalUrl: "https://www.konjiamresort.co.kr/",
    shuttleUrl: "https://www.konjiamresort.co.kr/",
    lodgingUrl: "https://www.konjiamresort.co.kr/",
    mapLinks: {
      naver: "https://map.naver.com/p/search/%EA%B3%A4%EC%A7%80%EC%95%94%EB%A6%AC%EC%A1%B0%ED%8A%B8",
      kakao: "https://map.kakao.com/link/search/%EA%B3%A4%EC%A7%80%EC%95%94%EB%A6%AC%EC%A1%B0%ED%8A%B8"
    },
    bookingLinks: [],
    nightSkiAvailable: true,
    beginnerScore: 88,
    familyScore: 82,
    accessScore: 98,
    priceLevel: 4,
    resortScaleScore: 70,
    transportScore: 70,
    rentalConvenienceScore: 86,
    tags: ["수도권", "당일치기", "초보"],
    operationStatus: "operating",
    lastCheckedAt: checkedAt
  },
  {
    id: "jisan",
    name: "지산 포레스트 리조트",
    region: "경기 이천",
    address: "경기도 이천시 마장면 지산로 267",
    officialUrl: "https://www.jisanresort.co.kr/",
    slopeStatusUrl: "https://www.jisanresort.co.kr/",
    liftTicketUrl: "https://www.jisanresort.co.kr/",
    rentalUrl: "https://www.jisanresort.co.kr/",
    mapLinks: {
      naver: "https://map.naver.com/p/search/%EC%A7%80%EC%82%B0%ED%8F%AC%EB%A0%88%EC%8A%A4%ED%8A%B8%EB%A6%AC%EC%A1%B0%ED%8A%B8",
      kakao: "https://map.kakao.com/link/search/%EC%A7%80%EC%82%B0%ED%8F%AC%EB%A0%88%EC%8A%A4%ED%8A%B8%EB%A6%AC%EC%A1%B0%ED%8A%B8"
    },
    bookingLinks: [],
    nightSkiAvailable: true,
    beginnerScore: 86,
    familyScore: 76,
    accessScore: 92,
    priceLevel: 2,
    resortScaleScore: 58,
    transportScore: 64,
    rentalConvenienceScore: 88,
    tags: ["수도권", "저예산", "초보"],
    operationStatus: "operating",
    lastCheckedAt: checkedAt
  },
  {
    id: "vivaldi",
    name: "비발디파크 스키월드",
    region: "강원 홍천",
    address: "강원도 홍천군 서면 한치골길 262",
    officialUrl: "https://www.sonohotelsresorts.com/complex_vp",
    slopeStatusUrl: "https://www.sonohotelsresorts.com/complex_vp",
    liftTicketUrl: "https://www.sonohotelsresorts.com/complex_vp",
    rentalUrl: "https://www.sonohotelsresorts.com/complex_vp",
    shuttleUrl: "https://www.sonohotelsresorts.com/complex_vp",
    lodgingUrl: "https://www.sonohotelsresorts.com/complex_vp",
    mapLinks: {
      naver: "https://map.naver.com/p/search/%EB%B9%84%EB%B0%9C%EB%94%94%ED%8C%8C%ED%81%AC",
      kakao: "https://map.kakao.com/link/search/%EB%B9%84%EB%B0%9C%EB%94%94%ED%8C%8C%ED%81%AC"
    },
    bookingLinks: [],
    nightSkiAvailable: true,
    beginnerScore: 90,
    familyScore: 90,
    accessScore: 78,
    priceLevel: 3,
    resortScaleScore: 84,
    transportScore: 90,
    rentalConvenienceScore: 92,
    tags: ["셔틀", "가족", "초보", "야간"],
    operationStatus: "operating",
    lastCheckedAt: checkedAt
  },
  {
    id: "elysian",
    name: "엘리시안 강촌",
    region: "강원 춘천",
    address: "강원도 춘천시 남산면 북한강변길 688",
    officialUrl: "https://www.elysian.co.kr/",
    slopeStatusUrl: "https://www.elysian.co.kr/",
    liftTicketUrl: "https://www.elysian.co.kr/",
    rentalUrl: "https://www.elysian.co.kr/",
    shuttleUrl: "https://www.elysian.co.kr/",
    lodgingUrl: "https://www.elysian.co.kr/",
    mapLinks: {
      naver: "https://map.naver.com/p/search/%EC%97%98%EB%A6%AC%EC%8B%9C%EC%95%88%EA%B0%95%EC%B4%8C",
      kakao: "https://map.kakao.com/link/search/%EC%97%98%EB%A6%AC%EC%8B%9C%EC%95%88%EA%B0%95%EC%B4%8C"
    },
    bookingLinks: [],
    nightSkiAvailable: true,
    beginnerScore: 92,
    familyScore: 82,
    accessScore: 84,
    priceLevel: 3,
    resortScaleScore: 68,
    transportScore: 96,
    rentalConvenienceScore: 84,
    tags: ["전철", "셔틀", "초보"],
    operationStatus: "operating",
    lastCheckedAt: checkedAt
  },
  {
    id: "phoenix",
    name: "휘닉스 스노우파크",
    region: "강원 평창",
    address: "강원도 평창군 봉평면 태기로 174",
    officialUrl: "https://phoenixhnr.co.kr/",
    slopeStatusUrl: "https://phoenixhnr.co.kr/",
    liftTicketUrl: "https://phoenixhnr.co.kr/",
    rentalUrl: "https://phoenixhnr.co.kr/",
    lodgingUrl: "https://phoenixhnr.co.kr/",
    mapLinks: {
      naver: "https://map.naver.com/p/search/%ED%9C%98%EB%8B%89%EC%8A%A4%ED%8F%89%EC%B0%BD",
      kakao: "https://map.kakao.com/link/search/%ED%9C%98%EB%8B%89%EC%8A%A4%ED%8F%89%EC%B0%BD"
    },
    bookingLinks: [],
    nightSkiAvailable: true,
    beginnerScore: 78,
    familyScore: 82,
    accessScore: 62,
    priceLevel: 4,
    resortScaleScore: 92,
    transportScore: 72,
    rentalConvenienceScore: 78,
    tags: ["대형", "1박", "보드"],
    operationStatus: "operating",
    lastCheckedAt: checkedAt
  },
  {
    id: "yongpyong",
    name: "모나 용평",
    region: "강원 평창",
    address: "강원도 평창군 대관령면 올림픽로 715",
    officialUrl: "https://www.yongpyong.co.kr/",
    slopeStatusUrl: "https://www.yongpyong.co.kr/",
    liftTicketUrl: "https://www.yongpyong.co.kr/",
    rentalUrl: "https://www.yongpyong.co.kr/",
    lodgingUrl: "https://www.yongpyong.co.kr/",
    mapLinks: {
      naver: "https://map.naver.com/p/search/%EB%AA%A8%EB%82%98%EC%9A%A9%ED%8F%89",
      kakao: "https://map.kakao.com/link/search/%EB%AA%A8%EB%82%98%EC%9A%A9%ED%8F%89"
    },
    bookingLinks: [],
    nightSkiAvailable: true,
    beginnerScore: 76,
    familyScore: 84,
    accessScore: 56,
    priceLevel: 4,
    resortScaleScore: 98,
    transportScore: 70,
    rentalConvenienceScore: 76,
    tags: ["대형", "1박", "설질"],
    operationStatus: "operating",
    lastCheckedAt: checkedAt
  },
  {
    id: "high1",
    name: "하이원리조트",
    region: "강원 정선",
    address: "강원도 정선군 고한읍 하이원길 424",
    officialUrl: "https://www.high1.com/",
    slopeStatusUrl: "https://www.high1.com/",
    liftTicketUrl: "https://www.high1.com/",
    rentalUrl: "https://www.high1.com/",
    lodgingUrl: "https://www.high1.com/",
    mapLinks: {
      naver: "https://map.naver.com/p/search/%ED%95%98%EC%9D%B4%EC%9B%90%EB%A6%AC%EC%A1%B0%ED%8A%B8",
      kakao: "https://map.kakao.com/link/search/%ED%95%98%EC%9D%B4%EC%9B%90%EB%A6%AC%EC%A1%B0%ED%8A%B8"
    },
    bookingLinks: [],
    nightSkiAvailable: true,
    beginnerScore: 80,
    familyScore: 86,
    accessScore: 42,
    priceLevel: 4,
    resortScaleScore: 96,
    transportScore: 62,
    rentalConvenienceScore: 74,
    tags: ["대형", "1박", "설질"],
    operationStatus: "operating",
    lastCheckedAt: checkedAt
  },
  {
    id: "wellihilli",
    name: "웰리힐리파크",
    region: "강원 횡성",
    address: "강원도 횡성군 둔내면 고원로 451",
    officialUrl: "https://www.wellihillipark.com/",
    slopeStatusUrl: "https://www.wellihillipark.com/",
    liftTicketUrl: "https://www.wellihillipark.com/",
    rentalUrl: "https://www.wellihillipark.com/",
    lodgingUrl: "https://www.wellihillipark.com/",
    mapLinks: {
      naver: "https://map.naver.com/p/search/%EC%9B%B0%EB%A6%AC%ED%9E%90%EB%A6%AC%ED%8C%8C%ED%81%AC",
      kakao: "https://map.kakao.com/link/search/%EC%9B%B0%EB%A6%AC%ED%9E%90%EB%A6%AC%ED%8C%8C%ED%81%AC"
    },
    bookingLinks: [],
    nightSkiAvailable: true,
    beginnerScore: 80,
    familyScore: 78,
    accessScore: 66,
    priceLevel: 3,
    resortScaleScore: 82,
    transportScore: 66,
    rentalConvenienceScore: 78,
    tags: ["중대형", "보드", "1박"],
    operationStatus: "operating",
    lastCheckedAt: checkedAt
  },
  {
    id: "oakvalley",
    name: "오크밸리",
    region: "강원 원주",
    address: "강원도 원주시 지정면 오크밸리1길 66",
    officialUrl: "https://www.oakvalley.co.kr/",
    slopeStatusUrl: "https://www.oakvalley.co.kr/",
    liftTicketUrl: "https://www.oakvalley.co.kr/",
    rentalUrl: "https://www.oakvalley.co.kr/",
    lodgingUrl: "https://www.oakvalley.co.kr/",
    mapLinks: {
      naver: "https://map.naver.com/p/search/%EC%98%A4%ED%81%AC%EB%B0%B8%EB%A6%AC",
      kakao: "https://map.kakao.com/link/search/%EC%98%A4%ED%81%AC%EB%B0%B8%EB%A6%AC"
    },
    bookingLinks: [],
    nightSkiAvailable: true,
    beginnerScore: 82,
    familyScore: 82,
    accessScore: 74,
    priceLevel: 3,
    resortScaleScore: 62,
    transportScore: 66,
    rentalConvenienceScore: 74,
    tags: ["가족", "원주", "초보"],
    operationStatus: "operating",
    lastCheckedAt: checkedAt
  },
  {
    id: "alpensia",
    name: "알펜시아 리조트",
    region: "강원 평창",
    address: "강원도 평창군 대관령면 솔봉로 325",
    officialUrl: "https://www.alpensia.com/",
    slopeStatusUrl: "https://www.alpensia.com/",
    liftTicketUrl: "https://www.alpensia.com/",
    rentalUrl: "https://www.alpensia.com/",
    lodgingUrl: "https://www.alpensia.com/",
    mapLinks: {
      naver: "https://map.naver.com/p/search/%EC%95%8C%ED%8E%9C%EC%8B%9C%EC%95%84%EB%A6%AC%EC%A1%B0%ED%8A%B8",
      kakao: "https://map.kakao.com/link/search/%EC%95%8C%ED%8E%9C%EC%8B%9C%EC%95%84%EB%A6%AC%EC%A1%B0%ED%8A%B8"
    },
    bookingLinks: [],
    nightSkiAvailable: true,
    beginnerScore: 84,
    familyScore: 88,
    accessScore: 54,
    priceLevel: 3,
    resortScaleScore: 64,
    transportScore: 60,
    rentalConvenienceScore: 70,
    tags: ["가족", "초보", "1박"],
    operationStatus: "operating",
    lastCheckedAt: checkedAt
  },
  {
    id: "o2",
    name: "오투리조트",
    region: "강원 태백",
    address: "강원도 태백시 서학로 861",
    officialUrl: "https://www.o2resort.com/",
    slopeStatusUrl: "https://www.o2resort.com/",
    liftTicketUrl: "https://www.o2resort.com/",
    rentalUrl: "https://www.o2resort.com/",
    lodgingUrl: "https://www.o2resort.com/",
    mapLinks: {
      naver: "https://map.naver.com/p/search/%EC%98%A4%ED%88%AC%EB%A6%AC%EC%A1%B0%ED%8A%B8",
      kakao: "https://map.kakao.com/link/search/%EC%98%A4%ED%88%AC%EB%A6%AC%EC%A1%B0%ED%8A%B8"
    },
    bookingLinks: [],
    nightSkiAvailable: true,
    beginnerScore: 74,
    familyScore: 72,
    accessScore: 34,
    priceLevel: 2,
    resortScaleScore: 78,
    transportScore: 44,
    rentalConvenienceScore: 62,
    tags: ["설질", "태백", "저예산"],
    operationStatus: "operating",
    lastCheckedAt: checkedAt
  },
  {
    id: "muju",
    name: "무주 덕유산 리조트",
    region: "전북 무주",
    address: "전북 무주군 설천면 만선로 185",
    officialUrl: "https://www.mdysresort.com/",
    slopeStatusUrl: "https://www.mdysresort.com/",
    liftTicketUrl: "https://www.mdysresort.com/",
    rentalUrl: "https://www.mdysresort.com/",
    lodgingUrl: "https://www.mdysresort.com/",
    mapLinks: {
      naver: "https://map.naver.com/p/search/%EB%AC%B4%EC%A3%BC%EB%8D%95%EC%9C%A0%EC%82%B0%EB%A6%AC%EC%A1%B0%ED%8A%B8",
      kakao: "https://map.kakao.com/link/search/%EB%AC%B4%EC%A3%BC%EB%8D%95%EC%9C%A0%EC%82%B0%EB%A6%AC%EC%A1%B0%ED%8A%B8"
    },
    bookingLinks: [],
    nightSkiAvailable: true,
    beginnerScore: 76,
    familyScore: 80,
    accessScore: 32,
    priceLevel: 3,
    resortScaleScore: 92,
    transportScore: 50,
    rentalConvenienceScore: 78,
    tags: ["남부권", "대형", "1박"],
    operationStatus: "operating",
    lastCheckedAt: checkedAt
  },
  {
    id: "edenvalley",
    name: "에덴밸리 리조트",
    region: "경남 양산",
    address: "경상남도 양산시 원동면 어실로 1206",
    officialUrl: "https://www.edenvalley.co.kr/",
    slopeStatusUrl: "https://www.edenvalley.co.kr/",
    liftTicketUrl: "https://www.edenvalley.co.kr/",
    rentalUrl: "https://www.edenvalley.co.kr/",
    lodgingUrl: "https://www.edenvalley.co.kr/",
    mapLinks: {
      naver: "https://map.naver.com/p/search/%EC%97%90%EB%8D%B4%EB%B0%B8%EB%A6%AC%EB%A6%AC%EC%A1%B0%ED%8A%B8",
      kakao: "https://map.kakao.com/link/search/%EC%97%90%EB%8D%B4%EB%B0%B8%EB%A6%AC%EB%A6%AC%EC%A1%B0%ED%8A%B8"
    },
    bookingLinks: [],
    nightSkiAvailable: true,
    beginnerScore: 78,
    familyScore: 78,
    accessScore: 20,
    priceLevel: 3,
    resortScaleScore: 58,
    transportScore: 46,
    rentalConvenienceScore: 70,
    tags: ["남부권", "부산근교"],
    operationStatus: "operating",
    lastCheckedAt: checkedAt
  }
];

export const rentalShops: RentalShop[] = [
  {
    id: "jisan-boong",
    resortId: "jisan",
    name: "붕어빵 렌탈샵",
    url: "https://jisanboong.com/price",
    mapLinks: {
      naver: "https://map.naver.com/p/search/%EC%A7%80%EC%82%B0%20%EB%B6%95%EC%96%B4%EB%B9%B5%20%EB%A0%8C%ED%83%88%EC%83%B5"
    },
    equipmentRentalAvailable: true,
    clothingRentalAvailable: true,
    pickupAvailable: true,
    deliveryAvailable: false,
    distanceMinutes: 5,
    recommendationTags: ["외부샵", "가격표확인", "픽업"],
    sourceUrl: "https://jisanboong.com/price",
    lastCheckedAt: checkedAt
  },
  {
    id: "vivaldi-thedream",
    resortId: "vivaldi",
    name: "더드림 렌탈 패키지",
    url: "https://www.waug.com/ko/themes/506/",
    mapLinks: {
      naver: "https://map.naver.com/p/search/%EB%B9%84%EB%B0%9C%EB%94%94%ED%8C%8C%ED%81%AC%20%EB%8D%94%EB%93%9C%EB%A6%BC%20%EB%A0%8C%ED%83%88"
    },
    equipmentRentalAvailable: true,
    clothingRentalAvailable: true,
    pickupAvailable: true,
    deliveryAvailable: false,
    distanceMinutes: 10,
    recommendationTags: ["외부샵", "패키지", "예약처"],
    sourceUrl: "https://www.waug.com/ko/themes/506/",
    lastCheckedAt: checkedAt
  },
  {
    id: "phoenix-snowlab",
    resortId: "phoenix",
    name: "스노우랩 휘닉스파크점",
    url: "https://www.millim.in/goods/view/SNOWL-0001",
    mapLinks: {
      naver: "https://map.naver.com/p/search/%EC%8A%A4%EB%85%B8%EC%9A%B0%EB%9E%A9%20%ED%9C%98%EB%8B%89%EC%8A%A4%ED%8C%8C%ED%81%AC"
    },
    equipmentRentalAvailable: true,
    clothingRentalAvailable: true,
    pickupAvailable: true,
    deliveryAvailable: false,
    distanceMinutes: 6,
    recommendationTags: ["외부샵", "예약처", "리조트인근"],
    sourceUrl: "https://www.millim.in/goods/view/SNOWL-0001",
    lastCheckedAt: checkedAt
  },
  {
    id: "yongpyong-drsnow",
    resortId: "yongpyong",
    name: "닥터스노우",
    url: "https://drsnow.kr/theme/IDEN_TN1/mobile/s02_01.php",
    mapLinks: {
      naver: "https://map.naver.com/p/search/%EC%9A%A9%ED%8F%89%20%EB%8B%A5%ED%84%B0%EC%8A%A4%EB%85%B8%EC%9A%B0"
    },
    equipmentRentalAvailable: true,
    clothingRentalAvailable: true,
    pickupAvailable: true,
    deliveryAvailable: false,
    distanceMinutes: 7,
    recommendationTags: ["외부샵", "가격표확인", "픽업"],
    sourceUrl: "https://drsnow.kr/theme/IDEN_TN1/mobile/s02_01.php",
    lastCheckedAt: checkedAt
  },
  {
    id: "high1-ski-no1",
    resortId: "high1",
    name: "하이원스키샵1호점",
    url: "https://www.hi-one.kr/sub/sub04_03.php",
    mapLinks: {
      naver: "https://map.naver.com/p/search/%ED%95%98%EC%9D%B4%EC%9B%90%EC%8A%A4%ED%82%A4%EC%83%B51%ED%98%B8%EC%A0%90"
    },
    equipmentRentalAvailable: true,
    clothingRentalAvailable: true,
    pickupAvailable: false,
    deliveryAvailable: false,
    liftTicketSalesAvailable: true,
    address: "강원특별자치도 정선군 고한읍 고한리 138-14",
    phone: "033-592-3334 / 033-591-8896",
    dataStatus: "verified_25_26",
    serviceNote: "25/26 장비·의류·보호구와 리프트 할인 가격표 확인. 픽업은 공개 페이지에서 확인되지 않아 미지원으로 기록.",
    distanceMinutes: 10,
    recommendationTags: ["외부샵", "가격표확인", "픽업"],
    sourceUrl: "https://www.hi-one.kr/",
    lastCheckedAt: "2026-07-15"
  },
  {
    id: "high1-myski",
    resortId: "high1",
    name: "하이원 마이스키",
    url: "https://high1myski.com/",
    mapLinks: { naver: "https://map.naver.com/p/search/%ED%95%98%EC%9D%B4%EC%9B%90%20%EB%A7%88%EC%9D%B4%EC%8A%A4%ED%82%A4" },
    equipmentRentalAvailable: true,
    clothingRentalAvailable: true,
    pickupAvailable: true,
    deliveryAvailable: false,
    liftTicketSalesAvailable: true,
    address: "강원특별자치도 정선군 고한읍 고한리 124-16",
    phone: "033-591-0175",
    dataStatus: "verified_25_26",
    serviceNote: "요청 시 즉시 픽업, 장비·의류·보호구 및 25/26 리프트 할인표 확인.",
    distanceMinutes: 10,
    recommendationTags: ["25/26확인", "픽업", "리프트할인"],
    sourceUrl: "https://high1myski.com/",
    lastCheckedAt: "2026-07-15"
  },
  {
    id: "high1-noonnara",
    resortId: "high1",
    name: "눈의나라",
    url: "https://noonnara.tistory.com/",
    mapLinks: { naver: "https://map.naver.com/p/search/%ED%95%98%EC%9D%B4%EC%9B%90%20%EB%88%88%EC%9D%98%EB%82%98%EB%9D%BC" },
    equipmentRentalAvailable: true,
    clothingRentalAvailable: true,
    pickupAvailable: true,
    deliveryAvailable: true,
    liftTicketSalesAvailable: true,
    phone: "033-591-1221 / 010-4926-7100",
    dataStatus: "historical_needs_recheck",
    serviceNote: "터미널·리조트·콘도 무료 픽업과 장비 배달 안내는 확인했으나 25/26 가격표는 공개 확인되지 않음.",
    distanceMinutes: 5,
    recommendationTags: ["픽업", "장비배달", "가격재확인"],
    sourceUrl: "https://noonnara.tistory.com/",
    lastCheckedAt: "2026-07-15"
  },
  ...[
    ["high1-repo4u", "레포투유", "https://leisure-web.yanolja.com/leisure/", "5,000원~"],
    ["high1-four-season", "포시즌 렌탈샵", "https://leisure-web.yanolja.com/leisure/", "5,000원~"],
    ["high1-high-and-high", "하이앤하이", "https://leisure-web.yanolja.com/leisure/", "12,000원~"],
    ["high1-seolleim", "설래임 렌탈샵", "https://leisure-web.yanolja.com/leisure/", "12,000원~"],
    ["high1-wolnam", "월남스키", "https://leisure-web.yanolja.com/leisure/", "12,000원~"],
    ["high1-sereno", "쎄레노", "https://leisure-web.yanolja.com/leisure/", "12,000원~"],
    ["high1-seven-ski", "세븐스키", "https://www.tripinfo.co.kr/info.html?content_id=506800&content_type_id=28", "가격 미확인"]
  ].map(([id, name, sourceUrl, priceNote]) => ({
    id,
    resortId: "high1",
    name,
    url: sourceUrl,
    mapLinks: { naver: `https://map.naver.com/p/search/${encodeURIComponent(`하이원 ${name}`)}` },
    equipmentRentalAvailable: true,
    clothingRentalAvailable: true,
    pickupAvailable: false,
    deliveryAvailable: false,
    liftTicketSalesAvailable: name === "세븐스키",
    dataStatus: "listed_25_26" as const,
    serviceNote: `25/26 예약/관광 플랫폼 등록 후보. 노출 시작가 ${priceNote}; 세부 품목·픽업·최종가는 업체 확인 필요.`,
    recommendationTags: ["25/26판매목록", "가격재확인"],
    sourceUrl,
    lastCheckedAt: "2026-07-15"
  })),
  {
    id: "alpensia-waug-rental",
    resortId: "alpensia",
    name: "알펜시아 예약처 렌탈 패키지",
    url: "https://www.waug.com/ko/themes/506/",
    mapLinks: {
      naver: "https://map.naver.com/p/search/%EC%95%8C%ED%8E%9C%EC%8B%9C%EC%95%84%20%EB%A0%8C%ED%83%88%EC%83%B5"
    },
    equipmentRentalAvailable: true,
    clothingRentalAvailable: false,
    pickupAvailable: false,
    deliveryAvailable: false,
    distanceMinutes: 0,
    recommendationTags: ["예약처", "장비렌탈", "리조트"],
    sourceUrl: "https://www.waug.com/ko/themes/506/",
    lastCheckedAt: checkedAt
  },
  {
    id: "o2-resort-package",
    resortId: "o2",
    name: "오투리조트 리프트·렌탈 패키지",
    url: "https://www.youthdaily.co.kr/mobile/article.html?no=204986",
    mapLinks: {
      naver: "https://map.naver.com/p/search/%EC%98%A4%ED%88%AC%EB%A6%AC%EC%A1%B0%ED%8A%B8%20%EB%A0%8C%ED%83%88"
    },
    equipmentRentalAvailable: true,
    clothingRentalAvailable: true,
    pickupAvailable: false,
    deliveryAvailable: false,
    distanceMinutes: 0,
    recommendationTags: ["리조트", "패키지", "보도자료"],
    sourceUrl: "https://www.youthdaily.co.kr/mobile/article.html?no=204986",
    lastCheckedAt: checkedAt
  },
  {
    id: "muju-baegam",
    resortId: "muju",
    name: "백암스키샵",
    url: "https://www.100am.co.kr/",
    mapLinks: {
      naver: "https://map.naver.com/p/search/%EB%AC%B4%EC%A3%BC%20%EB%B0%B1%EC%95%94%EC%8A%A4%ED%82%A4%EC%83%B5"
    },
    equipmentRentalAvailable: true,
    clothingRentalAvailable: true,
    pickupAvailable: true,
    deliveryAvailable: false,
    distanceMinutes: 8,
    recommendationTags: ["외부샵", "가격표확인", "픽업"],
    sourceUrl: "https://www.100am.co.kr/",
    lastCheckedAt: checkedAt
  },
  {
    id: "konjiam-official-rental",
    resortId: "konjiam",
    name: "곤지암리조트 공식 렌탈",
    url: "https://www.konjiamresort.co.kr/",
    equipmentRentalAvailable: true,
    clothingRentalAvailable: true,
    pickupAvailable: false,
    deliveryAvailable: false,
    distanceMinutes: 0,
    recommendationTags: ["공식", "리조트내"],
    sourceUrl: "https://www.konjiamresort.co.kr/",
    lastCheckedAt: checkedAt
  },
  {
    id: "high1-official-rental",
    resortId: "high1",
    name: "하이원리조트 공식 렌탈",
    url: "https://www.high1.com/",
    mapLinks: { naver: "https://map.naver.com/p/search/%ED%95%98%EC%9D%B4%EC%9B%90%EB%A6%AC%EC%A1%B0%ED%8A%B8%20%EB%A0%8C%ED%83%88%ED%95%98%EC%9A%B0%EC%8A%A4" },
    equipmentRentalAvailable: true,
    clothingRentalAvailable: true,
    pickupAvailable: false,
    deliveryAvailable: false,
    liftTicketSalesAvailable: true,
    dataStatus: "verified_25_26",
    serviceNote: "리조트 내 공식 렌탈. 정상 장비요금은 25/26 외부샵 가격표의 '스키장 내 정상요금'과 교차 확인했으며 공식 원문 재확인 필요.",
    distanceMinutes: 0,
    recommendationTags: ["공식", "리조트내", "25/26"],
    sourceUrl: "https://www.high1.com/",
    lastCheckedAt: "2026-07-15"
  },
  {
    id: "konjiam-goodgear",
    resortId: "konjiam",
    name: "장비좋은집",
    url: "https://gonjiam.co.kr/",
    mapLinks: {
      naver: "https://map.naver.com/p/search/%EA%B3%A4%EC%A7%80%EC%95%94%20%EC%9E%A5%EB%B9%84%EC%A2%8B%EC%9D%80%EC%A7%91"
    },
    equipmentRentalAvailable: true,
    clothingRentalAvailable: true,
    pickupAvailable: true,
    deliveryAvailable: false,
    distanceMinutes: 6,
    recommendationTags: ["외부샵", "가격표확인"],
    sourceUrl: "https://gonjiam.co.kr/",
    lastCheckedAt: checkedAt
  },
  ...resorts
    .filter((resort) => !["konjiam", "high1"].includes(resort.id))
    .map((resort) => ({
      id: `${resort.id}-official-rental`,
      resortId: resort.id,
      name: `${resort.name} 공식 렌탈`,
      url: resort.rentalUrl,
      mapLinks: resort.mapLinks,
      equipmentRentalAvailable: true,
      clothingRentalAvailable: true,
      pickupAvailable: false,
      deliveryAvailable: false,
      distanceMinutes: 0,
      recommendationTags: ["공식", "리조트내"],
      sourceUrl: resort.rentalUrl,
      lastCheckedAt: checkedAt
    })),
  {
    id: "elysian-worldski",
    resortId: "elysian",
    name: "월드스키",
    url: "https://www.gwski.co.kr/theme/basic/page.php?gr_id=01&num=03",
    mapLinks: {
      naver: "https://map.naver.com/p/search/%EC%97%98%EB%A6%AC%EC%8B%9C%EC%95%88%20%EC%9B%94%EB%93%9C%EC%8A%A4%ED%82%A4"
    },
    equipmentRentalAvailable: true,
    clothingRentalAvailable: true,
    pickupAvailable: true,
    deliveryAvailable: false,
    distanceMinutes: 8,
    recommendationTags: ["외부샵", "가격표확인"],
    sourceUrl: "https://www.gwski.co.kr/theme/basic/page.php?gr_id=01&num=03",
    lastCheckedAt: checkedAt
  },
  {
    id: "wellihilli-daegwallyeong-sports",
    resortId: "wellihilli",
    name: "대관령스포츠",
    url: "https://wellski.co.kr/m/payment.php?xch=payment",
    mapLinks: {
      naver: "https://map.naver.com/p/search/%EC%9B%B0%EB%A6%AC%ED%9E%90%EB%A6%AC%20%EB%8C%80%EA%B4%80%EB%A0%B9%EC%8A%A4%ED%8F%AC%EC%B8%A0"
    },
    equipmentRentalAvailable: true,
    clothingRentalAvailable: true,
    pickupAvailable: true,
    deliveryAvailable: true,
    distanceMinutes: 10,
    recommendationTags: ["외부샵", "가격표확인", "배송"],
    sourceUrl: "https://wellski.co.kr/m/payment.php?xch=payment",
    lastCheckedAt: checkedAt
  },
  {
    id: "oakvalley-firstclub",
    resortId: "oakvalley",
    name: "오크밸리 스키&보드 강습센터",
    url: "https://oak.thefirstclub.co.kr/dnb/user/userpage.php?lpage=page_7",
    mapLinks: {
      naver: "https://map.naver.com/p/search/%EC%98%A4%ED%81%AC%EB%B0%B8%EB%A6%AC%20%EB%A0%8C%ED%83%88%EC%83%B5"
    },
    equipmentRentalAvailable: true,
    clothingRentalAvailable: true,
    pickupAvailable: true,
    deliveryAvailable: false,
    distanceMinutes: 8,
    recommendationTags: ["외부샵", "가격표확인"],
    sourceUrl: "https://oak.thefirstclub.co.kr/dnb/user/userpage.php?lpage=page_7",
    lastCheckedAt: checkedAt
  },
  {
    id: "edenvalley-modooski",
    resortId: "edenvalley",
    name: "모두스키",
    url: "https://modooski.imweb.me/15",
    mapLinks: {
      naver: "https://map.naver.com/p/search/%EC%97%90%EB%8D%B4%EB%B0%B8%EB%A6%AC%20%EB%AA%A8%EB%91%90%EC%8A%A4%ED%82%A4"
    },
    equipmentRentalAvailable: true,
    clothingRentalAvailable: true,
    pickupAvailable: true,
    deliveryAvailable: false,
    distanceMinutes: 8,
    recommendationTags: ["외부샵", "가격표확인"],
    sourceUrl: "https://modooski.imweb.me/15",
    lastCheckedAt: checkedAt
  }
];

export const departureLocations: DepartureLocation[] = [
  {
    id: "seoul-gangnam",
    label: "서울 강남",
    region: "서울",
    distances: {
      konjiam: { minutes: 45, km: 42 },
      jisan: { minutes: 55, km: 55 },
      vivaldi: { minutes: 95, km: 88 },
      elysian: { minutes: 95, km: 86 },
      phoenix: { minutes: 150, km: 165 },
      yongpyong: { minutes: 165, km: 185 },
      high1: { minutes: 210, km: 240 },
      wellihilli: { minutes: 130, km: 135 },
      oakvalley: { minutes: 105, km: 105 },
      alpensia: { minutes: 165, km: 186 },
      o2: { minutes: 210, km: 238 },
      muju: { minutes: 190, km: 220 },
      edenvalley: { minutes: 300, km: 365 }
    }
  },
  {
    id: "seoul-cityhall",
    label: "서울 시청",
    region: "서울",
    distances: {
      konjiam: { minutes: 60, km: 50 },
      jisan: { minutes: 70, km: 65 },
      vivaldi: { minutes: 105, km: 95 },
      elysian: { minutes: 95, km: 82 },
      phoenix: { minutes: 160, km: 170 },
      yongpyong: { minutes: 175, km: 190 },
      high1: { minutes: 220, km: 245 },
      wellihilli: { minutes: 140, km: 142 },
      oakvalley: { minutes: 115, km: 112 },
      alpensia: { minutes: 175, km: 192 },
      o2: { minutes: 220, km: 244 },
      muju: { minutes: 200, km: 230 },
      edenvalley: { minutes: 310, km: 375 }
    }
  },
  {
    id: "suwon",
    label: "수원",
    region: "경기",
    distances: {
      konjiam: { minutes: 55, km: 48 },
      jisan: { minutes: 45, km: 44 },
      vivaldi: { minutes: 115, km: 110 },
      elysian: { minutes: 125, km: 115 },
      phoenix: { minutes: 160, km: 170 },
      yongpyong: { minutes: 175, km: 190 },
      high1: { minutes: 215, km: 245 },
      wellihilli: { minutes: 135, km: 142 },
      oakvalley: { minutes: 110, km: 110 },
      alpensia: { minutes: 175, km: 190 },
      o2: { minutes: 220, km: 250 },
      muju: { minutes: 165, km: 190 },
      edenvalley: { minutes: 280, km: 340 }
    }
  }
];

export function getResort(id: string) {
  return resorts.find((resort) => resort.id === id);
}

export function getRentalShopsForResort(resortId: string) {
  return rentalShops.filter((shop) => shop.resortId === resortId);
}
