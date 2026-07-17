import type { SkiShuttleRoute } from "@/lib/types";

const checkedAt = "2026-07-17";
const high1 = "high1";
const phoenix = "phoenix";
const jisan = "jisan";
const wellihilli = "wellihilli";

export const skiShuttleRoutes2526: SkiShuttleRoute[] = [
  route("kd-sadang", "서울", "사당·강남선", "대원관광", "02-2201-7710", "매일 운행 중심 · 종합운동장 합류", "https://skibus.purplebus.co.kr/Shop/YpSeason25/", "하이원 교통시즌권 30만원", [["서울","사당역","05:35"],["서울","양재역","05:50"],["서울","도곡역","05:52"],["서울","대치역","05:55"],["서울","종합운동장","06:20"]]),
  route("kd-myeongdong", "서울", "명동·강남선", "대원관광", "02-2201-7710", "매일 운행 중심 · 종합운동장 합류", "https://skibus.purplebus.co.kr/Shop/YpSeason25/", "하이원 교통시즌권 30만원", [["서울","명동역","05:25"],["서울","동대문","05:35"],["서울","강남역","05:47"],["서울","종합운동장","06:20"]]),
  route("kd-sinchon", "서울", "홍대·신촌선", "대원관광", "02-2201-7710", "성수기 매일, 비수기 주말 중심", "https://skibus.purplebus.co.kr/Shop/YpSeason25/", undefined, [["서울","홍대입구","05:25"],["서울","신촌역","05:30"],["서울","광흥창역","05:35"],["서울","마포역","05:40"],["서울","종합운동장","06:20"]]),
  route("kd-nowon", "서울", "노원·광나루선", "대원관광", "02-2201-7710", "성수기 매일, 비수기 주말 중심", "https://skibus.purplebus.co.kr/Shop/YpSeason25/", undefined, [["서울","노원역","05:15"],["서울","석계역","05:25"],["서울","군자역","05:40"],["서울","광나루역","05:45"],["서울","종합운동장","06:20"]]),
  route("kd-mokdong", "서울", "강서·목동선", "대원관광", "02-2201-7710", "성수기 매일, 비수기 주말 중심", "https://skibus.purplebus.co.kr/Shop/YpSeason25/", undefined, [["서울","강서","05:15"],["서울","목동역","05:25"],["서울","여의도","05:40"],["서울","종합운동장","06:20"]]),
  route("kd-sillim", "서울", "구디·신림선", "대원관광", "02-2201-7710", "주말 중심 · 종합운동장 합류", "https://skibus.purplebus.co.kr/Shop/YpSeason25/", undefined, [["서울","구로디지털단지역","05:25"],["서울","신림역","05:35"],["서울","서울대입구역","05:40"],["서울","이수역","05:50"],["서울","종합운동장","06:20"]]),
  route("kd-cheongnyangni", "서울", "성신여대·청량리선", "대원관광", "02-2201-7710", "토요일 중심 · 종합운동장 합류", "https://skibus.purplebus.co.kr/Shop/YpSeason25/", undefined, [["서울","성신여대입구역","05:20"],["서울","길음역","05:25"],["서울","청량리역","05:40"],["서울","회기역","05:45"],["서울","종합운동장","06:20"]]),
  route("kd-bundang", "경기", "수지·분당선", "대원관광", "02-2201-7710", "주말 중심 · 서현 합류", "https://skibus.purplebus.co.kr/Shop/YpSeason25/", undefined, [["용인","수지","06:05"],["용인","죽전","06:10"],["성남","미금역","06:15"],["성남","정자역","06:20"],["성남","서현역","06:40"]]),
  route("kd-anyang", "경기", "산본·안양선", "대원관광", "02-2201-7710", "주말 중심 · 서현 합류", "https://skibus.purplebus.co.kr/Shop/YpSeason25/", undefined, [["군포","산본역","05:40"],["안양","범계역","05:50"],["안양","평촌역","06:00"],["안양","인덕원역","06:10"],["성남","서현역","06:40"]]),
  route("kd-suwon", "경기", "수원·영통선", "대원관광", "02-2201-7710", "매일 운행 중심 · 영통 합류", "https://skibus.purplebus.co.kr/Shop/YpSeason25/", undefined, [["수원","성균관대역","06:10"],["수원","화서역","06:15"],["수원","수원역","06:20"],["수원","영통","06:40"]]),
  route("kd-ilsan", "경기", "일산선", "대원관광", "02-2201-7710", "주말 중심 · 송내 합류", "https://skibus.purplebus.co.kr/Shop/YpSeason25/", undefined, [["고양","대화역","05:20"],["고양","주엽역","05:25"],["고양","정발산역","05:30"],["고양","백석역","05:35"],["부천","송내역","06:10"]]),
  route("kd-incheon", "인천", "인천·부평선", "대원관광", "02-2201-7710", "주말 중심 · 송내 합류", "https://skibus.purplebus.co.kr/Shop/YpSeason25/", undefined, [["인천","인천터미널","05:15"],["인천","간석오거리","05:25"],["인천","부평역","05:40"],["부천","송내역","06:10"]]),
  route("osung-daegu-1", "대구·경북", "경산·대구 1코스", "오성고속관광", undefined, "평일·주말 운행", "https://osungtour.co.kr/hione/traffic2.asp", "일반 왕복 4.5만원 · 리무진 5.5만원", [["경산","임당역","04:25"],["경산","정평역","04:30"],["경산","신매역","04:35"],["대구","만촌역","04:45"],["대구","범어","04:50"],["대구","대구은행역","04:55"],["대구","현대백화점","05:00"],["대구","내당 홈플러스","05:10"],["대구","성서 홈플러스","05:20"],["대구","칠곡IC","05:30"]], "16:30"),
  route("osung-daegu-2", "대구·경북", "대구 동부 2코스", "오성고속관광", undefined, "주말 운행", "https://osungtour.co.kr/hione/traffic2.asp", "일반 왕복 4.5만원 · 리무진 5.5만원", [["대구","반야월 이마트","04:30"],["대구","신기역","04:35"],["대구","율하역","04:40"],["대구","현대백화점","05:00"],["대구","내당 홈플러스","05:10"],["대구","성서 홈플러스","05:20"],["대구","칠곡IC","05:30"]], "16:30"),
  route("eunsung-busan", "부산·경남", "부산·서마산선", "부산은성관광", "051-809-8888", "45인승 의무운행기간 · 우등리무진 별도", "https://www.es365.co.kr/good/tour_list.html?b_uid_s=111&m_uid_s=258", "부산 일반 6만원부터 · 리무진 8만원부터", [["부산","동래역 3번 출구","04:00"],["창원","서마산IC","04:40"]]),
  route("daewon-honam", "호남·대전", "광주·전주·대전선", "대원여행사", "062-526-7000", "토·일·공휴일 · 최소 12명", "https://www.daewontour.com/fit/14684", "12만원부터", [["광주","염주체육관","03:30"],["광주","문화예술회관","03:40"],["전주","전주 월드컵경기장","04:40"],["대전","대전 월드컵경기장","05:30"]], "16:30"),
  unconfirmed("garam-east", "경북·울산", "포항·경주·울산 노선", "가람관광여행사", "https://www.garamtour.kr/garam/high1/", [["포항","포항 시내권"],["경주","경주 시내·IC권"],["울산","울산 시내권"]]),
  unconfirmed("eunsung-gyeongnam", "경남", "마산·창원·김해 노선", "부산은성관광", "https://www.es365.co.kr/good/tour_list.html?b_uid_s=111&m_uid_s=258", [["창원","마산·창원권"],["김해","김해권"]]),
  phoenixRoute("phoenix-kd-sadang", "서울", "사당·강남선", "매일 운행 중심 · 종합운동장 합류", [["서울","사당역","05:35"],["서울","양재역","05:50"],["서울","도곡역","05:52"],["서울","대치역","05:55"],["서울","종합운동장","06:20"]]),
  phoenixRoute("phoenix-kd-myeongdong", "서울", "명동·강남선", "매일 운행 중심 · 종합운동장 합류", [["서울","명동역","05:25"],["서울","동대문","05:35"],["서울","강남역","05:47"],["서울","종합운동장","06:20"]]),
  phoenixRoute("phoenix-kd-sinchon", "서울", "홍대·신촌선", "성수기 매일, 비수기 주말 중심", [["서울","홍대입구","05:25"],["서울","신촌역","05:30"],["서울","광흥창역","05:35"],["서울","마포역","05:40"],["서울","종합운동장","06:20"]]),
  phoenixRoute("phoenix-kd-nowon", "서울", "노원·광나루선", "성수기 매일, 비수기 주말 중심", [["서울","노원역","05:15"],["서울","석계역","05:25"],["서울","군자역","05:40"],["서울","광나루역","05:45"],["서울","종합운동장","06:20"]]),
  phoenixRoute("phoenix-kd-mokdong", "서울", "강서·목동선", "성수기 매일, 비수기 주말 중심", [["서울","강서","05:15"],["서울","목동역","05:25"],["서울","여의도","05:40"],["서울","종합운동장","06:20"]]),
  phoenixRoute("phoenix-kd-sillim", "서울", "구디·신림선", "주말 중심 · 종합운동장 합류", [["서울","구로디지털단지역","05:25"],["서울","신림역","05:35"],["서울","서울대입구역","05:40"],["서울","이수역","05:50"],["서울","종합운동장","06:20"]]),
  phoenixRoute("phoenix-kd-cheongnyangni", "서울", "성신여대·청량리선", "토요일 중심 · 종합운동장 합류", [["서울","성신여대입구역","05:20"],["서울","길음역","05:25"],["서울","청량리역","05:40"],["서울","회기역","05:45"],["서울","종합운동장","06:20"]]),
  phoenixRoute("phoenix-kd-bundang", "경기", "수지·분당선", "주말 중심 · 서현 합류", [["용인","수지","06:05"],["용인","죽전","06:10"],["성남","미금역","06:15"],["성남","정자역","06:20"],["성남","서현역","06:40"]]),
  phoenixRoute("phoenix-kd-anyang", "경기", "산본·안양선", "주말 중심 · 서현 합류", [["군포","산본역","05:40"],["안양","범계역","05:50"],["안양","평촌역","06:00"],["안양","인덕원역","06:10"],["성남","서현역","06:40"]]),
  phoenixRoute("phoenix-kd-suwon", "경기", "수원·영통선", "매일 운행 중심 · 영통 합류", [["수원","성균관대역","06:10"],["수원","화서역","06:15"],["수원","수원역","06:20"],["수원","영통","06:40"]]),
  phoenixRoute("phoenix-kd-ilsan", "경기", "일산선", "주말 중심 · 송내 합류", [["고양","대화역","05:20"],["고양","주엽역","05:25"],["고양","정발산역","05:30"],["고양","백석역","05:35"],["부천","송내역","06:10"]]),
  phoenixRoute("phoenix-kd-incheon", "인천", "인천·부평선", "주말 중심 · 송내 합류", [["인천","인천터미널","05:15"],["인천","간석오거리","05:25"],["인천","부평역","05:40"],["부천","송내역","06:10"]]),
  jisanRoute("jisan-cityhall", "서울시청선", "시청역 2번 출구"),
  jisanRoute("jisan-jamsil", "잠실선", "종합운동장역 1번 출구"),
  wellihilliRoute("wellihilli-kd-sadang", "서울", "사당·강남선", "매일 운행 중심 · 종합운동장 합류", [["서울","사당역","05:35"],["서울","양재역","05:50"],["서울","도곡역","05:52"],["서울","대치역","05:55"],["서울","종합운동장","06:20"]]),
  wellihilliRoute("wellihilli-kd-myeongdong", "서울", "명동·강남선", "매일 운행 중심 · 종합운동장 합류", [["서울","명동역","05:25"],["서울","동대문","05:35"],["서울","강남역","05:47"],["서울","종합운동장","06:20"]]),
  wellihilliRoute("wellihilli-kd-sinchon", "서울", "홍대·신촌선", "성수기 매일, 비수기 주말 중심", [["서울","홍대입구","05:25"],["서울","신촌역","05:30"],["서울","광흥창역","05:35"],["서울","마포역","05:40"],["서울","종합운동장","06:20"]]),
  wellihilliRoute("wellihilli-kd-nowon", "서울", "노원·광나루선", "성수기 매일, 비수기 주말 중심", [["서울","노원역","05:15"],["서울","석계역","05:25"],["서울","군자역","05:40"],["서울","광나루역","05:45"],["서울","종합운동장","06:20"]]),
  wellihilliRoute("wellihilli-kd-mokdong", "서울", "강서·목동선", "성수기 매일, 비수기 주말 중심", [["서울","강서","05:15"],["서울","목동역","05:25"],["서울","여의도","05:40"],["서울","종합운동장","06:20"]]),
  wellihilliRoute("wellihilli-kd-sillim", "서울", "구디·신림선", "주말 중심 · 종합운동장 합류", [["서울","구로디지털단지역","05:25"],["서울","신림역","05:35"],["서울","서울대입구역","05:40"],["서울","이수역","05:50"],["서울","종합운동장","06:20"]]),
  wellihilliRoute("wellihilli-kd-cheongnyangni", "서울", "성신여대·청량리선", "토요일 중심 · 종합운동장 합류", [["서울","성신여대입구역","05:20"],["서울","길음역","05:25"],["서울","청량리역","05:40"],["서울","회기역","05:45"],["서울","종합운동장","06:20"]]),
  wellihilliRoute("wellihilli-kd-bundang", "경기", "수지·분당선", "경기권 주말 운행 · 서현 합류", [["용인","수지","06:05"],["용인","죽전","06:10"],["성남","미금역","06:15"],["성남","정자역","06:20"],["성남","서현역","06:40"]]),
  wellihilliRoute("wellihilli-kd-anyang", "경기", "산본·안양선", "경기권 주말 운행 · 서현 합류", [["군포","산본역","05:40"],["안양","범계역","05:50"],["안양","평촌역","06:00"],["안양","인덕원역","06:10"],["성남","서현역","06:40"]]),
  wellihilliRoute("wellihilli-kd-suwon", "경기", "수원·영통선", "경기권 주말 운행 · 영통 합류", [["수원","성균관대역","06:10"],["수원","화서역","06:15"],["수원","수원역","06:20"],["수원","영통","06:40"]]),
  wellihilliRoute("wellihilli-kd-ilsan", "경기", "일산선", "경기권 주말 운행 · 송내 합류", [["고양","대화역","05:20"],["고양","주엽역","05:25"],["고양","정발산역","05:30"],["고양","백석역","05:35"],["부천","송내역","06:10"]]),
  wellihilliRoute("wellihilli-kd-incheon", "인천", "인천·부평선", "경기권 주말 운행 · 송내 합류", [["인천","인천터미널","05:15"],["인천","간석오거리","05:25"],["인천","부평역","05:40"],["부천","송내역","06:10"]])
];

type StopInput = [city: string, name: string, departureTime?: string];
function route(id: string, region: string, name: string, operator: string, operatorPhone: string | undefined, operationNote: string, url: string, priceLabel: string | undefined, stops: StopInput[], returnTime?: string): SkiShuttleRoute {
  return { id, resortId: high1, season: "25/26", operator, operatorPhone, region, name, operationNote, arrivalName: "하이원 밸리하우스", returnTime, priceLabel, bookingUrl: url, sourceUrl: url, stops: stops.map(([city, stopName, departureTime], index) => ({ id: `${id}-${index + 1}`, city, name: stopName, departureTime })), dataStatus: "confirmed_25_26", lastCheckedAt: checkedAt };
}
function unconfirmed(id: string, region: string, name: string, operator: string, url: string, stops: StopInput[]): SkiShuttleRoute {
  return { id, resortId: high1, season: "25/26", operator, region, name, operationNote: "25/26 운행 확인 · 세부 시간은 운영사에 재확인", arrivalName: "하이원", bookingUrl: url, sourceUrl: url, stops: stops.map(([city, stopName], index) => ({ id: `${id}-${index + 1}`, city, name: stopName })), dataStatus: "route_only_25_26", lastCheckedAt: checkedAt };
}
function phoenixRoute(id: string, region: string, name: string, operationNote: string, stops: StopInput[]): SkiShuttleRoute {
  const url = "https://skibus.purplebus.co.kr/Shop/YpSeason25/";
  return { id, resortId: phoenix, season: "25/26", operator: "대원관광", operatorPhone: "02-2201-7710", region, name, operationNote, arrivalName: "휘닉스 스노우파크", priceLabel: "휘닉스 교통시즌권 27.5만원", bookingUrl: url, sourceUrl: url, stops: stops.map(([city, stopName, departureTime], index) => ({ id: `${id}-${index + 1}`, city, name: stopName, departureTime })), dataStatus: "confirmed_25_26", lastCheckedAt: checkedAt };
}
function jisanRoute(id: string, name: string, stopName: string): SkiShuttleRoute {
  return { id, resortId: jisan, season: "25/26", operator: "투어윈도우글로벌", operatorPhone: "02-2039-7728", region: "서울", name, operationNote: "25/26 시즌 · 사전 예약 필수", arrivalName: "지산리조트 제1주차장", returnTime: "12:00 / 18:00 선택", priceLabel: "편도 2만원 · 왕복 3.8만원", bookingUrl: "https://jisan.allthatlimo.net/", sourceUrl: "https://www.jisanresort.co.kr/m/member/customer.asp?schCate=ski", stops: [{ id: `${id}-1`, city: "서울", name: stopName, departureTime: "07:30 / 13:30" }], dataStatus: "confirmed_25_26", lastCheckedAt: checkedAt };
}
function wellihilliRoute(id: string, region: string, name: string, operationNote: string, stops: StopInput[]): SkiShuttleRoute {
  const url = "https://skibus.purplebus.co.kr/Shop/YpSeason25/";
  return { id, resortId: wellihilli, season: "25/26", operator: "대원관광", operatorPhone: "02-2201-7710", region, name, operationNote, arrivalName: "웰리힐리파크 서관 앞 버스주차장", priceLabel: "웰리힐리 교통시즌권 25만원", bookingUrl: url, sourceUrl: url, stops: stops.map(([city, stopName, departureTime], index) => ({ id: `${id}-${index + 1}`, city, name: stopName, departureTime })), dataStatus: "confirmed_25_26", lastCheckedAt: checkedAt };
}

export function getSkiShuttleRoutes(resortId: string) { return skiShuttleRoutes2526.filter(route => route.resortId === resortId); }
export function getShuttleRegions(routes: SkiShuttleRoute[]) { return [...new Set(routes.map(route => route.region))]; }
export function searchShuttleRoutes(routes: SkiShuttleRoute[], query: string, region = "all") {
  const normalized = query.trim().toLocaleLowerCase("ko-KR");
  return routes.filter(route => (region === "all" || route.region === region) && (!normalized || [route.name, route.operator, route.region, ...route.stops.flatMap(stop => [stop.city, stop.name])].some(value => value.toLocaleLowerCase("ko-KR").includes(normalized))));
}
