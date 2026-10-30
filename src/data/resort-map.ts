import type { RentalShop, SkiResort } from "@/lib/types";
import { resortCoordinates } from "@/data/resort-coordinates";

const checkedAt = "2026-05-17";

export type GeoPoint = {
  lat: number;
  lng: number;
};

export type ResortMapPoint = GeoPoint & {
  resortId: string;
  sourceName: string;
  sourceUrl: string;
  lastCheckedAt: string;
};

export type NearbyLodging = {
  id: string;
  resortId: string;
  name: string;
  category: "resort_hotel" | "condo" | "nearby_stay";
  bookingPlatform?: "NOL" | "여기어때";
  url?: string;
  mapLinks?: {
    naver?: string;
    kakao?: string;
  };
  distanceMinutes?: number;
  latitude?: number;
  longitude?: number;
  kakaoPlaceId?: string;
  locationSource?: "verified_coordinates" | "address_geocoding" | "place_search";
  locationCheckedAt?: string;
  sourceUrl?: string;
  lastCheckedAt: string;
};

const externalLodgingCandidates: Array<Pick<NearbyLodging, "id" | "resortId" | "name" | "url" | "bookingPlatform" | "distanceMinutes">> = [
  // 곤지암
  { id: "konjiam-the-k-plus", resortId: "konjiam", name: "곤지암 더케이플러스펜션", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/88964", distanceMinutes: 3 },
  { id: "konjiam-largo", resortId: "konjiam", name: "경기 라르고펜션", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/86218", distanceMinutes: 3 },
  { id: "konjiam-k401", resortId: "konjiam", name: "광주 K401 독채 펜션", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/13544", distanceMinutes: 5 },
  { id: "konjiam-alpine", resortId: "konjiam", name: "광주 알파인펜션", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/86885", distanceMinutes: 3 },
  { id: "konjiam-rodem-tree", resortId: "konjiam", name: "곤지암 로뎀나무펜션", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/88564", distanceMinutes: 4 },

  // 지산 포레스트
  { id: "jisan-eden-paradise-hotel", resortId: "jisan", name: "에덴 파라다이스호텔 이천", bookingPlatform: "NOL", url: "https://place-site.yanolja.com/places/3009498/302852", distanceMinutes: 15 },

  // 비발디파크
  { id: "vivaldi-sky-pension", resortId: "vivaldi", name: "홍천 sky비발디펜션", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/65580", distanceMinutes: 8 },
  { id: "vivaldi-heidi-korea", resortId: "vivaldi", name: "홍천 하이디코리아 펜션", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/75555", distanceMinutes: 10 },
  { id: "vivaldi-bogeumjari", resortId: "vivaldi", name: "홍천 보금자리펜션", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/71368", distanceMinutes: 10 },

  // 엘리시안 강촌
  { id: "elysian-beautiful-home", resortId: "elysian", name: "강촌 아름다운집 애견동반펜션", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/73060", distanceMinutes: 4 },
  { id: "elysian-music-pension", resortId: "elysian", name: "강촌 뮤직펜션", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/76522", distanceMinutes: 14 },
  { id: "elysian-neutinamu-village", resortId: "elysian", name: "강촌 느티나무마을 펜션", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/70149", distanceMinutes: 10 },
  { id: "elysian-chocolate-world", resortId: "elysian", name: "강촌 초콜릿월드 펜션", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/72288", distanceMinutes: 16 },

  // 휘닉스 스노우파크
  { id: "phoenix-white-cabin", resortId: "phoenix", name: "평창 화이트캐빈펜션", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/71013", distanceMinutes: 1 },
  { id: "phoenix-maia-pension", resortId: "phoenix", name: "평창 마이아 펜션", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/58288", distanceMinutes: 7 },
  { id: "phoenix-jujoo-pension", resortId: "phoenix", name: "평창 주주펜션", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/61081", distanceMinutes: 5 },
  { id: "phoenix-eastern-park", resortId: "phoenix", name: "평창 이스턴파크", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/87495", distanceMinutes: 5 },
  { id: "phoenix-underhill", resortId: "phoenix", name: "평창 언더힐펜션", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/86366", distanceMinutes: 5 },
  { id: "phoenix-snowflower", resortId: "phoenix", name: "평창 눈꽃새펜션", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/60810", distanceMinutes: 5 },
  { id: "phoenix-hugelheim", resortId: "phoenix", name: "평창 휘겔하임펜션", bookingPlatform: "NOL", url: "https://place-site.yanolja.com/places/3006186/94747" },

  // 모나 용평
  { id: "yongpyong-am-hotel", resortId: "yongpyong", name: "평창 AM 호텔", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/49441", distanceMinutes: 15 },
  { id: "yongpyong-ramada-pyeongchang", resortId: "yongpyong", name: "라마다 호텔 & 스위트 평창", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/54760", distanceMinutes: 13 },

  // 하이원
  { id: "high1-miami-jeongseon", resortId: "high1", name: "마이애미 정선호텔", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/75862", distanceMinutes: 5 },
  { id: "high1-js-grand-palace", resortId: "high1", name: "정선 JS 그랜드 팰리스 호텔", bookingPlatform: "NOL", url: "https://place-site.yanolja.com/places/10059248/725027/880383", distanceMinutes: 3 },
  { id: "high1-fun-happy-pension", resortId: "high1", name: "정선 펀앤해피펜션", bookingPlatform: "NOL", url: "https://place-site.yanolja.com/places/10045205/471197" },

  // 웰리힐리파크
  { id: "wellihilli-forest-lovers-star", resortId: "wellihilli", name: "횡성 숲속의연인별 펜션&글램핑", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/84576", distanceMinutes: 5 },
  { id: "wellihilli-hello412", resortId: "wellihilli", name: "횡성 헬로우412 펜션", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/84735", distanceMinutes: 5 },
  { id: "wellihilli-forest-love-star", resortId: "wellihilli", name: "횡성 숲속의사랑별펜션", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/87250", distanceMinutes: 5 },
  { id: "wellihilli-malbong-terrace", resortId: "wellihilli", name: "횡성 말봉테라스펜션앤풀빌라", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/90507", distanceMinutes: 5 },
  { id: "wellihilli-rose-of-sharon", resortId: "wellihilli", name: "횡성 로즈오브샤론펜션", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/76189", distanceMinutes: 4 },
  { id: "wellihilli-magic-castle", resortId: "wellihilli", name: "횡성 마법의성 풀빌라", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/85746", distanceMinutes: 5 },
  { id: "wellihilli-casa408", resortId: "wellihilli", name: "횡성 까사 408", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/70828", distanceMinutes: 6 },

  // 오크밸리
  { id: "oakvalley-munmak-oak-county", resortId: "oakvalley", name: "원주 문막오크카운티펜션", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/63686", distanceMinutes: 2 },
  { id: "oakvalley-oak-valley-pension", resortId: "oakvalley", name: "원주 오크밸리펜션", bookingPlatform: "NOL", url: "https://place-site.yanolja.com/places/3010581/128354", distanceMinutes: 12 },

  // 알펜시아
  { id: "alpensia-am-hotel", resortId: "alpensia", name: "평창 AM 호텔", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/49441", distanceMinutes: 10 },

  // 오투리조트
  { id: "o2-taebaek-hotel", resortId: "o2", name: "태백호텔", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/72010" },
  { id: "o2-taebaek-the-palace", resortId: "o2", name: "태백 더팰리스 호텔", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/87834", distanceMinutes: 15 },

  // 무주 덕유산리조트
  { id: "muju-little-prince", resortId: "muju", name: "무주 리틀프린스 풀빌라펜션", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/73805", distanceMinutes: 7 },
  { id: "muju-travel-bag", resortId: "muju", name: "무주 여행가방펜션", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/58976", distanceMinutes: 12 },
  { id: "muju-guibin", resortId: "muju", name: "무주 귀빈", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/69710", distanceMinutes: 10 },
  { id: "muju-heukjip-pungyeong", resortId: "muju", name: "무주 흙집풍경펜션", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/73802", distanceMinutes: 15 },
  { id: "muju-opera-pension", resortId: "muju", name: "무주 오페라펜션 풀빌라", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/85807", distanceMinutes: 11 },

  // 에덴밸리
  { id: "edenvalley-miru-pension", resortId: "edenvalley", name: "양산 배내골 미루 펜션", bookingPlatform: "여기어때", url: "https://www.yeogi.com/domestic-accommodations/60489", distanceMinutes: 16 },
  { id: "edenvalley-evergreen-pension", resortId: "edenvalley", name: "양산 배내골 에버그린펜션", bookingPlatform: "NOL", url: "https://place-site.yanolja.com/places/3012610/147135" },
  { id: "edenvalley-happy-home", resortId: "edenvalley", name: "양산 배내골 행복한집펜션", bookingPlatform: "NOL", url: "https://place-site.yanolja.com/places/10045562/475658" },
];

export type NearbyMapItem = {
  id: string;
  resortId: string;
  type: "rental" | "lodging";
  name: string;
  meta: string;
  href?: string;
  siteUrl?: string;
  tags?: string[];
  pickupAvailable?: boolean;
  clothingRentalAvailable?: boolean;
  liftTicketSalesAvailable?: boolean;
  dataStatus?: RentalShop["dataStatus"];
  address?: string;
  latitude?: number;
  longitude?: number;
  kakaoPlaceId?: string;
};

export const resortMapPoints: ResortMapPoint[] = [
  { resortId: "konjiam", ...resortCoordinates.konjiam, sourceName: "곤지암리조트 주소 기준", sourceUrl: "https://www.konjiamresort.co.kr/", lastCheckedAt: checkedAt },
  { resortId: "jisan", ...resortCoordinates.jisan, sourceName: "지산 포레스트 리조트 주소 기준", sourceUrl: "https://www.jisanresort.co.kr/", lastCheckedAt: checkedAt },
  { resortId: "vivaldi", ...resortCoordinates.vivaldi, sourceName: "비발디파크 주소 기준", sourceUrl: "https://www.sonohotelsresorts.com/complex_vp", lastCheckedAt: checkedAt },
  { resortId: "elysian", ...resortCoordinates.elysian, sourceName: "엘리시안 강촌 주소 기준", sourceUrl: "https://www.elysian.co.kr/", lastCheckedAt: checkedAt },
  { resortId: "phoenix", ...resortCoordinates.phoenix, sourceName: "휘닉스 스노우파크 주소 기준", sourceUrl: "https://phoenixhnr.co.kr/", lastCheckedAt: checkedAt },
  { resortId: "yongpyong", ...resortCoordinates.yongpyong, sourceName: "모나 용평 주소 기준", sourceUrl: "https://www.yongpyong.co.kr/", lastCheckedAt: checkedAt },
  { resortId: "high1", ...resortCoordinates.high1, sourceName: "하이원리조트 주소 기준", sourceUrl: "https://www.high1.com/", lastCheckedAt: checkedAt },
  { resortId: "wellihilli", ...resortCoordinates.wellihilli, sourceName: "웰리힐리파크 주소 기준", sourceUrl: "https://www.wellihillipark.com/", lastCheckedAt: checkedAt },
  { resortId: "oakvalley", ...resortCoordinates.oakvalley, sourceName: "오크밸리 주소 기준", sourceUrl: "https://www.oakvalley.co.kr/", lastCheckedAt: checkedAt },
  { resortId: "alpensia", ...resortCoordinates.alpensia, sourceName: "알펜시아 리조트 주소 기준", sourceUrl: "https://www.alpensia.com/", lastCheckedAt: checkedAt },
  { resortId: "o2", ...resortCoordinates.o2, sourceName: "오투리조트 주소 기준", sourceUrl: "https://www.o2resort.com/", lastCheckedAt: checkedAt },
  { resortId: "muju", ...resortCoordinates.muju, sourceName: "무주 덕유산 리조트 주소 기준", sourceUrl: "https://www.mdysresort.com/", lastCheckedAt: checkedAt },
  { resortId: "edenvalley", ...resortCoordinates.edenvalley, sourceName: "에덴밸리 리조트 주소 기준", sourceUrl: "https://www.edenvalley.co.kr/", lastCheckedAt: checkedAt }
];

export const nearbyLodgings: NearbyLodging[] = [
  ...[
    ["konjiam", "konjiam-ew-village", "곤지암리조트 EW 빌리지", "condo", "https://reservation.konjiamresort.co.kr/"],
    ["jisan", "jisan-maple-condo", "지산리조트 메이플콘도", "condo", "https://www.jisanresort.co.kr/w/reservation/condo/condo.asp"],
    ["jisan", "jisan-maple-hotel", "지산리조트 메이플호텔", "resort_hotel", "https://www.jisanresort.co.kr/"],
    ["vivaldi", "vivaldi-sonobell", "소노벨 비발디파크", "resort_hotel", "https://www.sonohotelsresorts.com/main/reservationinfo"],
    ["vivaldi", "vivaldi-sonocam", "소노캄 비발디파크", "resort_hotel", "https://www.sonohotelsresorts.com/main/reservationinfo"],
    ["vivaldi", "vivaldi-sonofelice", "소노펠리체 비발디파크", "condo", "https://www.sonohotelsresorts.com/complex_vp"],
    ["elysian", "elysian-gangchon-condo", "엘리시안 강촌 콘도", "condo", "https://www.elysian.co.kr/"],
    ["phoenix", "phoenix-pyeongchang-hotel", "휘닉스 호텔 평창", "resort_hotel", "https://phoenixhnr.co.kr/page/reservation/pyeongchang/room?step=1"],
    ["phoenix", "phoenix-pyeongchang-condo", "휘닉스 평창 콘도", "condo", "https://phoenixhnr.co.kr/page/reservation/pyeongchang/room?step=1"],
    ["phoenix", "phoenix-sky-condo", "휘닉스 스카이콘도", "condo", "https://phoenixhnr.co.kr/page/reservation/pyeongchang/room?step=1"],
    ["yongpyong", "yongpyong-dragon-valley-hotel", "모나 용평 드래곤밸리호텔", "resort_hotel", "https://www.yongpyong.co.kr/kor/guide/package/list.do"],
    ["yongpyong", "yongpyong-tower-condo", "모나 용평 타워콘도", "condo", "https://www.yongpyong.co.kr/kor/guide/package/list.do"],
    ["yongpyong", "yongpyong-greenpia-condo", "모나 용평 그린피아콘도", "condo", "https://www.yongpyong.co.kr/kor/guide/package/list.do"],
    ["yongpyong", "yongpyong-villa-condo", "모나 용평 빌라콘도", "condo", "https://www.yongpyong.co.kr/kor/guide/package/list.do"],
    ["yongpyong", "yongpyong-berdehill", "모나 용평 베르데힐콘도", "condo", "https://www.yongpyong.co.kr/kor/guide/package/list.do"],
    ["wellihilli", "wellihilli-condo", "웰리힐리파크 콘도", "condo", "https://www.wellihillipark.com/?seq=67"],
    ["oakvalley", "oakvalley-golf-village", "오크밸리 골프빌리지", "condo", "https://app.oakvalley.co.kr/mobileapp/index.do"],
    ["oakvalley", "oakvalley-south-condo", "오크밸리 사우스콘도", "condo", "https://app.oakvalley.co.kr/mobileapp/index.do"],
    ["alpensia", "alpensia-intercontinental", "인터컨티넨탈 알펜시아 평창 리조트", "resort_hotel", "https://www.alpensia.com/reservation/index.do"],
    ["alpensia", "alpensia-holidayinn-resort", "홀리데이 인 리조트 알펜시아 평창", "resort_hotel", "https://www.alpensia.com/reservation/index.do"],
    ["alpensia", "alpensia-holidayinn-suites", "홀리데이 인&스위트 알펜시아 평창", "condo", "https://www.alpensia.com/reservation/index.do"],
    ["o2", "o2-tower-condo", "오투리조트 타워콘도", "condo", "https://o2resort.com/LDG/totalfeeGuide_condo.jsp"],
    ["muju", "muju-hotel-tirol", "무주 덕유산리조트 호텔티롤", "resort_hotel", "https://www.mdysresort.com/accom/hotel_reserve.asp"],
    ["muju", "muju-family-hotel", "무주 덕유산리조트 가족호텔", "condo", "https://www.mdysresort.com/accom/hotel_reserve.asp"],
    ["edenvalley", "edenvalley-condo", "에덴밸리리조트 콘도", "condo", "https://golf.edenvalley.co.kr/Course/gallery.asp"]
  ].map(([resortId, id, name, category, url]) => ({
    id,
    resortId,
    name,
    category: category as NearbyLodging["category"],
    url,
    mapLinks: { naver: `https://map.naver.com/p/search/${encodeURIComponent(name)}` },
    sourceUrl: url,
    distanceMinutes: 0,
    lastCheckedAt: "2026-10-30"
  })),
  ...[
    ["high1-grand-hotel", "하이원 그랜드호텔", "resort_hotel"],
    ["high1-palace-hotel", "하이원 팰리스호텔", "resort_hotel"],
    ["high1-mountain-condo", "하이원 마운틴콘도", "condo"],
    ["high1-hill-condo", "하이원 힐콘도", "condo"],
    ["high1-valley-condo", "하이원 밸리콘도", "condo"]
  ].map(([id, name, category]) => ({
    id,
    resortId: "high1",
    name,
    category: category as NearbyLodging["category"],
    url: "https://reserve.high1.com/res/hb/HBIR100003.do",
    mapLinks: { naver: `https://map.naver.com/p/search/${encodeURIComponent(name)}` },
    distanceMinutes: 0,
    sourceUrl: "https://reserve.high1.com/res/hb/HBIR100003.do",
    lastCheckedAt: "2026-10-30"
  })),
  ...externalLodgingCandidates.map((lodging): NearbyLodging => ({
    ...lodging,
    category: "nearby_stay",
    mapLinks: { naver: `https://map.naver.com/p/search/${encodeURIComponent(lodging.name)}` },
    sourceUrl: lodging.url,
    lastCheckedAt: "2026-10-30"
  }))
];

const koreaBounds = {
  minLat: 33.0,
  maxLat: 38.7,
  minLng: 124.6,
  maxLng: 131.2
};

export function getResortMapPoint(resortId: string) {
  return resortMapPoints.find((point) => point.resortId === resortId);
}

export function getNearbyLodgingsForResort(resortId: string) {
  return nearbyLodgings.filter((lodging) => lodging.resortId === resortId);
}

export function getMapPosition(point: GeoPoint) {
  const x = ((point.lng - koreaBounds.minLng) / (koreaBounds.maxLng - koreaBounds.minLng)) * 100;
  const y = (1 - (point.lat - koreaBounds.minLat) / (koreaBounds.maxLat - koreaBounds.minLat)) * 100;
  return {
    left: `${Math.min(96, Math.max(4, x))}%`,
    top: `${Math.min(96, Math.max(4, y))}%`
  };
}

export function getResortMapRows(resorts: SkiResort[]) {
  return resorts.map((resort) => ({
    resort,
    point: getResortMapPoint(resort.id),
    lodgingCount: getNearbyLodgingsForResort(resort.id).length
  }));
}

export function getNearbySummary(resortId: string, rentalShops: RentalShop[]) {
  return {
    rentalCount: rentalShops.filter((shop) => shop.resortId === resortId).length,
    lodgingCount: getNearbyLodgingsForResort(resortId).length
  };
}

export function getNearbyMapItems(resortId: string, rentalShops: RentalShop[]) {
  const point = getResortMapPoint(resortId);
  if (!point) return [];

  const rentals: NearbyMapItem[] = rentalShops
    .filter((shop) => shop.resortId === resortId)
    .map((shop) => {
      return {
        id: shop.id,
        resortId,
        type: "rental",
        name: shop.name,
        meta: `${shop.id.endsWith("official-rental") ? "공식 렌탈" : "렌탈샵"}${shop.distanceMinutes !== undefined ? ` · 약 ${shop.distanceMinutes}분` : ""}`,
        href: shop.mapLinks?.kakao ?? shop.mapLinks?.naver ?? shop.url,
        siteUrl: shop.url,
        tags: shop.recommendationTags,
        pickupAvailable: shop.pickupAvailable,
        clothingRentalAvailable: shop.clothingRentalAvailable,
        liftTicketSalesAvailable: shop.liftTicketSalesAvailable,
        dataStatus: shop.dataStatus,
        address: shop.address,
        latitude: shop.latitude,
        longitude: shop.longitude,
        kakaoPlaceId: shop.kakaoPlaceId
      };
    });

  const lodgings: NearbyMapItem[] = getNearbyLodgingsForResort(resortId).map((lodging) => {
    return {
      id: lodging.id,
      resortId,
      type: "lodging",
      name: lodging.name,
      meta: lodging.category === "nearby_stay"
        ? `주변 숙소${lodging.distanceMinutes !== undefined ? ` · 약 ${lodging.distanceMinutes}분` : ""}`
        : lodging.distanceMinutes === 0 ? "공식/리조트 숙박" : lodging.distanceMinutes !== undefined ? `약 ${lodging.distanceMinutes}분` : "숙박",
      href: lodging.mapLinks?.kakao ?? lodging.mapLinks?.naver ?? lodging.url,
      siteUrl: lodging.url,
      latitude: lodging.latitude,
      longitude: lodging.longitude,
      kakaoPlaceId: lodging.kakaoPlaceId
    };
  });

  return [...rentals, ...lodgings];
}
