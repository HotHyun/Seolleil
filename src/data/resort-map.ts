import type { RentalShop, SkiResort } from "@/lib/types";

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
  category: "resort_hotel" | "condo" | "nearby_hotel";
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
  { resortId: "konjiam", lat: 37.3373, lng: 127.2966, sourceName: "곤지암리조트 주소 기준", sourceUrl: "https://www.konjiamresort.co.kr/", lastCheckedAt: checkedAt },
  { resortId: "jisan", lat: 37.2177, lng: 127.3435, sourceName: "지산 포레스트 리조트 주소 기준", sourceUrl: "https://www.jisanresort.co.kr/", lastCheckedAt: checkedAt },
  { resortId: "vivaldi", lat: 37.6457, lng: 127.6842, sourceName: "비발디파크 주소 기준", sourceUrl: "https://www.sonohotelsresorts.com/complex_vp", lastCheckedAt: checkedAt },
  { resortId: "elysian", lat: 37.8302, lng: 127.5891, sourceName: "엘리시안 강촌 주소 기준", sourceUrl: "https://www.elysian.co.kr/", lastCheckedAt: checkedAt },
  { resortId: "phoenix", lat: 37.5826, lng: 128.3227, sourceName: "휘닉스 스노우파크 주소 기준", sourceUrl: "https://phoenixhnr.co.kr/", lastCheckedAt: checkedAt },
  { resortId: "yongpyong", lat: 37.6453, lng: 128.6819, sourceName: "모나 용평 주소 기준", sourceUrl: "https://www.yongpyong.co.kr/", lastCheckedAt: checkedAt },
  { resortId: "high1", lat: 37.2092, lng: 128.8225, sourceName: "하이원리조트 주소 기준", sourceUrl: "https://www.high1.com/", lastCheckedAt: checkedAt },
  { resortId: "wellihilli", lat: 37.4915, lng: 128.2509, sourceName: "웰리힐리파크 주소 기준", sourceUrl: "https://www.wellihillipark.com/", lastCheckedAt: checkedAt },
  { resortId: "oakvalley", lat: 37.4308, lng: 127.8156, sourceName: "오크밸리 주소 기준", sourceUrl: "https://www.oakvalley.co.kr/", lastCheckedAt: checkedAt },
  { resortId: "alpensia", lat: 37.6584, lng: 128.6723, sourceName: "알펜시아 리조트 주소 기준", sourceUrl: "https://www.alpensia.com/", lastCheckedAt: checkedAt },
  { resortId: "o2", lat: 37.1775, lng: 128.9867, sourceName: "오투리조트 주소 기준", sourceUrl: "https://www.o2resort.com/", lastCheckedAt: checkedAt },
  { resortId: "muju", lat: 35.8904, lng: 127.7381, sourceName: "무주 덕유산 리조트 주소 기준", sourceUrl: "https://www.mdysresort.com/", lastCheckedAt: checkedAt },
  { resortId: "edenvalley", lat: 35.4298, lng: 129.0197, sourceName: "에덴밸리 리조트 주소 기준", sourceUrl: "https://www.edenvalley.co.kr/", lastCheckedAt: checkedAt }
];

export const nearbyLodgings: NearbyLodging[] = [
  ...[
    ["konjiam", "konjiam-ew-village", "곤지암리조트 EW 빌리지", "condo", "https://www.konjiamresort.co.kr/"],
    ["jisan", "jisan-maple-condo", "지산리조트 메이플콘도", "condo", "https://www.jisanresort.co.kr/"],
    ["jisan", "jisan-maple-hotel", "지산리조트 메이플호텔", "resort_hotel", "https://www.jisanresort.co.kr/"],
    ["vivaldi", "vivaldi-sonobell", "소노벨 비발디파크", "resort_hotel", "https://www.sonohotelsresorts.com/complex_vp"],
    ["vivaldi", "vivaldi-sonocam", "소노캄 비발디파크", "resort_hotel", "https://www.sonohotelsresorts.com/complex_vp"],
    ["vivaldi", "vivaldi-sonofelice", "소노펠리체 비발디파크", "condo", "https://www.sonohotelsresorts.com/complex_vp"],
    ["elysian", "elysian-gangchon-condo", "엘리시안 강촌 콘도", "condo", "https://www.elysian.co.kr/"],
    ["phoenix", "phoenix-pyeongchang-hotel", "휘닉스 호텔 평창", "resort_hotel", "https://phoenixhnr.co.kr/"],
    ["phoenix", "phoenix-pyeongchang-condo", "휘닉스 평창 콘도", "condo", "https://phoenixhnr.co.kr/"],
    ["phoenix", "phoenix-sky-condo", "휘닉스 스카이콘도", "condo", "https://phoenixhnr.co.kr/"],
    ["yongpyong", "yongpyong-dragon-valley-hotel", "모나 용평 드래곤밸리호텔", "resort_hotel", "https://www.yongpyong.co.kr/"],
    ["yongpyong", "yongpyong-tower-condo", "모나 용평 타워콘도", "condo", "https://www.yongpyong.co.kr/"],
    ["yongpyong", "yongpyong-greenpia-condo", "모나 용평 그린피아콘도", "condo", "https://www.yongpyong.co.kr/"],
    ["yongpyong", "yongpyong-villa-condo", "모나 용평 빌라콘도", "condo", "https://www.yongpyong.co.kr/"],
    ["yongpyong", "yongpyong-berdehill", "모나 용평 베르데힐콘도", "condo", "https://www.yongpyong.co.kr/"],
    ["wellihilli", "wellihilli-condo", "웰리힐리파크 콘도", "condo", "https://www.wellihillipark.com/"],
    ["oakvalley", "oakvalley-golf-village", "오크밸리 골프빌리지", "condo", "https://www.oakvalley.co.kr/"],
    ["oakvalley", "oakvalley-south-condo", "오크밸리 사우스콘도", "condo", "https://www.oakvalley.co.kr/"],
    ["alpensia", "alpensia-intercontinental", "인터컨티넨탈 알펜시아 평창 리조트", "resort_hotel", "https://www.alpensia.com/"],
    ["alpensia", "alpensia-holidayinn-resort", "홀리데이 인 리조트 알펜시아 평창", "resort_hotel", "https://www.alpensia.com/"],
    ["alpensia", "alpensia-holidayinn-suites", "홀리데이 인&스위트 알펜시아 평창", "condo", "https://www.alpensia.com/"],
    ["o2", "o2-tower-condo", "오투리조트 타워콘도", "condo", "https://www.o2resort.com/"],
    ["muju", "muju-hotel-tirol", "무주 덕유산리조트 호텔티롤", "resort_hotel", "https://www.mdysresort.com/"],
    ["muju", "muju-family-hotel", "무주 덕유산리조트 가족호텔", "condo", "https://www.mdysresort.com/"],
    ["edenvalley", "edenvalley-condo", "에덴밸리리조트 콘도", "condo", "https://www.edenvalley.co.kr/"]
  ].map(([resortId, id, name, category, url]) => ({
    id,
    resortId,
    name,
    category: category as NearbyLodging["category"],
    url,
    mapLinks: { naver: `https://map.naver.com/p/search/${encodeURIComponent(name)}` },
    sourceUrl: url,
    distanceMinutes: 0,
    lastCheckedAt: "2026-07-15"
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
    url: "https://www.high1.com/",
    mapLinks: { naver: `https://map.naver.com/p/search/${encodeURIComponent(name)}` },
    distanceMinutes: 0,
    sourceUrl: "https://www.high1.com/",
    lastCheckedAt: "2026-07-15"
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
      meta: lodging.distanceMinutes === 0 ? "공식/리조트 숙박" : `약 ${lodging.distanceMinutes}분`,
      href: lodging.mapLinks?.kakao ?? lodging.mapLinks?.naver ?? lodging.url,
      siteUrl: lodging.url,
      latitude: lodging.latitude,
      longitude: lodging.longitude,
      kakaoPlaceId: lodging.kakaoPlaceId
    };
  });

  return [...rentals, ...lodgings];
}
