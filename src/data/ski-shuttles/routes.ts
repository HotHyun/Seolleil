import type { SkiShuttleRoute } from "@/lib/types";

const checkedAt = "2026-07-17";
const high1CheckedAt = "2026-08-10";
const phoenixOakCheckedAt = "2026-08-10";
const high1 = "high1";
const phoenix = "phoenix";
const jisan = "jisan";
const wellihilli = "wellihilli";
const o2 = "o2";
const oakvalley = "oakvalley";
const elysian = "elysian";
const edenvalley = "edenvalley";
const alpensia = "alpensia";
const vivaldi = "vivaldi";
const yongpyong = "yongpyong";

export const skiShuttleRoutes2526: SkiShuttleRoute[] = [
  route("kd-sadang", "서울", "사당·강남선", "대원관광", "02-2201-7710", "매일 운행 중심 · 종합운동장 합류", "https://skibus.purplebus.co.kr/Shop/YpSeason25/", "하이원 교통시즌권 30만원", [["서울","사당역","05:35"],["서울","양재역","05:50"],["서울","도곡역","05:52"],["서울","대치역","05:55"],["서울","종합운동장","06:20"]], kdHigh1Return()),
  route("kd-myeongdong", "서울", "명동·강남선", "대원관광", "02-2201-7710", "매일 운행 중심 · 종합운동장 합류", "https://skibus.purplebus.co.kr/Shop/YpSeason25/", "하이원 교통시즌권 30만원", [["서울","명동역","05:25"],["서울","동대문","05:35"],["서울","강남역","05:47"],["서울","종합운동장","06:20"]], kdHigh1Return()),
  route("kd-sinchon", "서울", "홍대·신촌선", "대원관광", "02-2201-7710", "성수기 매일, 비수기 주말 중심", "https://skibus.purplebus.co.kr/Shop/YpSeason25/", undefined, [["서울","홍대입구","05:25"],["서울","신촌역","05:30"],["서울","광흥창역","05:35"],["서울","마포역","05:40"],["서울","종합운동장","06:20"]], kdHigh1Return()),
  route("kd-nowon", "서울", "노원·광나루선", "대원관광", "02-2201-7710", "성수기 매일, 비수기 주말 중심", "https://skibus.purplebus.co.kr/Shop/YpSeason25/", undefined, [["서울","노원역","05:15"],["서울","석계역","05:25"],["서울","군자역","05:40"],["서울","광나루역","05:45"],["서울","종합운동장","06:20"]], kdHigh1Return()),
  route("kd-mokdong", "서울", "강서·목동선", "대원관광", "02-2201-7710", "성수기 매일, 비수기 주말 중심", "https://skibus.purplebus.co.kr/Shop/YpSeason25/", undefined, [["서울","강서","05:15"],["서울","목동역","05:25"],["서울","여의도","05:40"],["서울","종합운동장","06:20"]], kdHigh1Return()),
  route("kd-sillim", "서울", "구디·신림선", "대원관광", "02-2201-7710", "주말 중심 · 종합운동장 합류", "https://skibus.purplebus.co.kr/Shop/YpSeason25/", undefined, [["서울","구로디지털단지역","05:25"],["서울","신림역","05:35"],["서울","서울대입구역","05:40"],["서울","이수역","05:50"],["서울","종합운동장","06:20"]], kdHigh1Return()),
  route("kd-cheongnyangni", "서울", "성신여대·청량리선", "대원관광", "02-2201-7710", "토요일 중심 · 종합운동장 합류", "https://skibus.purplebus.co.kr/Shop/YpSeason25/", undefined, [["서울","성신여대입구역","05:20"],["서울","길음역","05:25"],["서울","청량리역","05:40"],["서울","회기역","05:45"],["서울","종합운동장","06:20"]], kdHigh1Return()),
  route("kd-bundang", "경기", "수지·분당선", "대원관광", "02-2201-7710", "주말 중심 · 서현 합류", "https://skibus.purplebus.co.kr/Shop/YpSeason25/", undefined, [["용인","수지","06:05"],["용인","죽전","06:10"],["성남","미금역","06:15"],["성남","정자역","06:20"],["성남","서현역","06:40"]], kdHigh1Return()),
  route("kd-anyang", "경기", "산본·안양선", "대원관광", "02-2201-7710", "주말 중심 · 서현 합류", "https://skibus.purplebus.co.kr/Shop/YpSeason25/", undefined, [["군포","산본역","05:40"],["안양","범계역","05:50"],["안양","평촌역","06:00"],["안양","인덕원역","06:10"],["성남","서현역","06:40"]], kdHigh1Return()),
  route("kd-suwon", "경기", "수원·영통선", "대원관광", "02-2201-7710", "매일 운행 중심 · 영통 합류", "https://skibus.purplebus.co.kr/Shop/YpSeason25/", undefined, [["수원","성균관대역","06:10"],["수원","화서역","06:15"],["수원","수원역","06:20"],["수원","영통","06:40"]], kdHigh1Return()),
  route("kd-ilsan", "경기", "일산선", "대원관광", "02-2201-7710", "주말 중심 · 송내 합류", "https://skibus.purplebus.co.kr/Shop/YpSeason25/", undefined, [["고양","대화역","05:20"],["고양","주엽역","05:25"],["고양","정발산역","05:30"],["고양","백석역","05:35"],["부천","송내역","06:10"]], kdHigh1Return()),
  route("kd-incheon", "인천", "인천·부평선", "대원관광", "02-2201-7710", "주말 중심 · 송내 합류", "https://skibus.purplebus.co.kr/Shop/YpSeason25/", undefined, [["인천","인천터미널","05:15"],["인천","간석오거리","05:25"],["인천","부평역","05:40"],["부천","송내역","06:10"]], kdHigh1Return()),
  route("osung-daegu-1", "대구·경북", "경산·대구 1코스", "오성고속관광", undefined, "평일·주말 운행", "https://osungtour.co.kr/hione/traffic2.asp", "일반 편도 3.8만원 · 왕복 4.5만원", [["경산","임당역 1번 출구","04:25"],["경산","정평역 1번 출구","04:30"],["경산","신매역 1번 출구","04:35"],["대구","만촌역 1번 출구","04:45"],["대구","하나은행 대구범어금융센터","04:50"],["대구","대구은행역 1번 출구","04:55"],["대구","현대백화점 앞","05:00"],["대구","내당 홈플러스 앞","05:10"],["대구","성서 홈플러스 앞","05:20"],["대구","칠곡IC 신전뮤지엄","05:30"]], osungReturn()),
  route("osung-daegu-2", "대구·경북", "대구 동부 2코스", "오성고속관광", undefined, "주말 운행", "https://osungtour.co.kr/hione/traffic2.asp", "일반 편도 3.8만원 · 왕복 4.5만원", [["대구","반야월 이마트","04:30"],["대구","신기역 1번 출구","04:35"],["대구","율하역 5번 출구","04:40"],["대구","동구청 앞","04:55"],["대구","영진전문대 복현소방서 앞","05:00"],["대구","경대북문 스타벅스 앞","05:05"],["대구","칠성 이마트 건너편","05:15"],["대구","칠곡IC 신전뮤지엄","05:30"]], osungReturn()),
  route("osung-daegu-3", "대구·경북", "대구 남부 3코스", "오성고속관광", undefined, "주말 운행", "https://osungtour.co.kr/hione/traffic2.asp", "일반 편도 3.8만원 · 왕복 4.5만원", [["대구","범물역 3번 출구","05:00"],["대구","상인역 7번 출구","05:10"],["대구","월성네거리 월성2주공 버스정류장","05:15"],["대구","칠곡IC 신전뮤지엄","05:30"]], osungReturn()),
  route("eunsung-busan", "부산·경남", "부산·서마산선", "부산은성관광", "051-809-8888", "45인승 의무운행기간 · 우등리무진 별도", "https://www.es365.co.kr/good/tour_list.html?b_uid_s=111&m_uid_s=258&s_uid_s=248", "부산 일반 6만원부터 · 리무진 8만원부터", [["부산","동래역 3번 출구","04:00"],["창원","서마산IC","04:40"]], { departureName: "하이원 예약 화면 지정 승차지", stopOrder: "same_stops", note: "왕복 또는 하이원→부산·경남 편도를 선택할 수 있으며 귀가 시간은 예약일별로 재확인" }),
  route("daewon-honam", "호남·대전", "광주·전주·대전선", "대원여행사", "062-526-7000", "토·일·공휴일 · 최소 12명", "https://www.daewontour.com/fit/14684", "편도 5만~7만원 · 왕복 8만~12만원", [["광주","염주체육관 주차장","03:30",70000,120000],["광주","문화예술회관 정문 육교 밑","03:40",70000,120000],["전주","전주 월드컵경기장 제3주차장","04:40",60000,100000],["대전","대전 월드컵경기장 제4주차장","05:30",50000,80000]], { departureName: "하이원 하늘주차장", departureTime: "16:30", stopOrder: "reverse", note: "16:00부터 버스 대기 · 광주 염주체육관 21:30 도착 예정" }),
  unconfirmed("garam-pohang-1", "경북", "포항·영덕·울진 1코스", "가람관광여행사", "https://www.garamtour.kr/garam/high1/route_map/", [["포항","문덕 농협사거리","04:20"],["포항","해병대서문사거리","04:24"],["포항","이마트 건너편 남구보건소 맞은편","04:28"],["포항","포스코육교 앞 동촌생활관","04:30"],["포항","연일삼도 한솔타운 3차","04:34"],["포항","패밀리온천 앞","04:36"],["포항","경북운전학원 버스정류장","04:40"],["포항","종합운동장 경비실 앞","04:45"],["포항","상공회의소 앞","04:50"],["포항","양학육교 버스정류장","04:54"],["포항","쌍용아파트 건너 사격장 앞","04:57"],["포항","우현사거리 하이마트","05:00"],["포항","창포사거리 버스정류장","05:03"],["포항","아이파크아파트 버스정류장","05:04"],["포항","부산프라자 건너편","05:05"],["포항","두산위브 건너 현대오일뱅크","05:08"],["포항","포항온천 앞","05:13"],["포항","LH아파트 101동 앞","05:15"],["포항","흥해초등학교","05:20"],["영덕","오십천 휴게소","05:40"],["울진","울진의료원 입구 연호교차로","06:20"]], garamReturn()),
  unconfirmed("garam-gyeongju-2", "경북", "경주·포항 2코스", "가람관광여행사", "https://www.garamtour.kr/garam/high1/route_map/", [["경주","황성공원 시계탑","04:30"],["경주","근화여고 앞 육교","04:32"],["경주","강동지하도 밑 버스정류장","04:50"],["포항","지곡인재개발원","05:00"],["포항","롯데마트 건너편","05:05"],["포항","이동대구은행","05:10"],["포항","흥해초등학교","05:20"]], garamReturn()),
  unconfirmed("garam-ulsan-3", "울산", "울산 3코스", "가람관광여행사", "https://www.garamtour.kr/garam/high1/route_map/", [["울산","동구청 앞","03:45"],["울산","동천체육관 큰대로변","04:00"],["울산","태화로터리 다리 밑","04:10"],["울산","신복로터리 고속도로 입구","04:20"],["포항","흥해초등학교","05:20"]], garamReturn()),
  unconfirmed("eunsung-gyeongnam", "경남", "마산·창원·김해 노선", "부산은성관광", "https://www.es365.co.kr/good/tour_list.html?b_uid_s=111&m_uid_s=258", [["창원","마산·창원권"],["김해","김해권"]], { departureName: "하이원 예약 화면 지정 승차지", stopOrder: "same_stops", note: "하이원→경남 편도 선택 가능 · 귀가 시간과 정확한 하차지는 예약 화면에서 재확인" }),
  phoenixRoute("phoenix-kd-sadang", "서울", "사당·강남선", "성수기·비수기·3월 3일부터 매일", [["서울","사당역","05:55"],["서울","양재역","06:10"],["서울","도곡역","06:12"],["서울","대치역","06:15"],["서울","종합운동장","06:40"]]),
  phoenixRoute("phoenix-kd-myeongdong", "서울", "명동·강남선", "성수기·비수기 매일 · 3월 3일부터 운행 없음", [["서울","명동역","05:45"],["서울","동대문","05:55"],["서울","강남역","06:07"],["서울","종합운동장","06:40"]]),
  phoenixRoute("phoenix-kd-sinchon", "서울", "홍대·신촌선", "성수기·비수기 매일 · 3월 3일부터 토·일", [["서울","홍대입구","05:40"],["서울","신촌역","05:45"],["서울","광흥창역","05:50"],["서울","마포역","05:55"],["서울","종합운동장","06:40"]]),
  phoenixRoute("phoenix-kd-nowon", "서울", "노원·광나루선", "성수기 매일 · 비수기 토·일", [["서울","노원역","05:35"],["서울","석계역","05:45"],["서울","군자역","06:00"],["서울","광나루역","06:05"],["서울","종합운동장","06:40"]]),
  phoenixRoute("phoenix-kd-mokdong", "서울", "강서·목동선", "성수기 매일 · 비수기 토·일", [["서울","강서","05:35"],["서울","목동역","05:45"],["서울","여의도","06:00"],["서울","종합운동장","06:40"]]),
  phoenixRoute("phoenix-kd-sillim", "서울", "구디·신림선", "성수기 토·일", [["서울","구로디지털단지역","05:45"],["서울","신림역","05:55"],["서울","서울대입구역","06:00"],["서울","이수역","06:10"],["서울","종합운동장","06:40"]]),
  phoenixRoute("phoenix-kd-cheongnyangni", "서울", "성신여대·청량리선", "성수기 토요일", [["서울","성신여대입구역","05:40"],["서울","길음역","05:45"],["서울","청량리역","06:00"],["서울","회기역","06:05"],["서울","종합운동장","06:40"]]),
  phoenixRoute("phoenix-kd-bundang", "경기", "수지·분당선", "성수기 매일 · 비수기 토·일", [["용인","수지","06:05"],["용인","죽전","06:10"],["성남","미금역","06:15"],["성남","정자역","06:20"],["성남","서현역","06:40"]]),
  phoenixRoute("phoenix-kd-anyang", "경기", "산본·안양선", "성수기 매일 · 비수기 토·일", [["군포","산본역","05:40"],["안양","범계역","05:50"],["안양","평촌역","06:00"],["안양","인덕원역","06:10"],["성남","서현역","06:40"]]),
  phoenixRoute("phoenix-kd-suwon", "경기", "수원·영통선", "성수기 매일 · 비수기 토·일", [["수원","성균관대역","06:10"],["수원","화서역","06:15"],["수원","수원역","06:20"],["수원","영통","06:40"]]),
  phoenixRoute("phoenix-kd-ilsan", "경기", "일산선", "성수기 매일 · 비수기 토·일", [["고양","대화역","05:20"],["고양","주엽역","05:25"],["고양","정발산역","05:30"],["고양","백석역","05:35"],["부천","송내역","06:10"]]),
  phoenixRoute("phoenix-kd-incheon", "인천", "인천·부평선", "성수기 매일 · 비수기 토·일", [["인천","인천터미널","05:15"],["인천","간석오거리","05:25"],["인천","부평역","05:40"],["부천","송내역","06:10"]]),
  phoenixRoute("phoenix-kd-afternoon", "서울", "오후 종합운동장선", "성수기 월~토 · 비수기 이후 운행 없음", [["서울","종합운동장","14:30"]]),
  phoenixRoute("phoenix-kd-night", "서울", "야간 종합운동장선", "성수기 금요일 · 웰리힐리 또는 휘닉스 경유", [["서울","종합운동장","20:00"]]),
  ...phoenixReturnRoutes(),
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
  wellihilliRoute("wellihilli-kd-incheon", "인천", "인천·부평선", "경기권 주말 운행 · 송내 합류", [["인천","인천터미널","05:15"],["인천","간석오거리","05:25"],["인천","부평역","05:40"],["부천","송내역","06:10"]]),
  o2Route(),
  ...oakvalleyRoutes(),
  elysianRoute(),
  edenvalleyRoute(),
  ...kdPyeongchangRoutes(alpensia, "알펜시아 스키700"),
  ...vivaldiRoutes(),
  ...kdPyeongchangRoutes(yongpyong, "모나용평 드래곤프라자")
];

type StopInput = [city: string, name: string, departureTime?: string, oneWayFareAdult?: number, roundTripFareAdult?: number];
function route(id: string, region: string, name: string, operator: string, operatorPhone: string | undefined, operationNote: string, url: string, priceLabel: string | undefined, stops: StopInput[], returnService?: SkiShuttleRoute["returnService"]): SkiShuttleRoute {
  const details = high1RouteDetails(id);
  return { id, resortId: high1, season: "25/26", operator, operatorPhone, region, name, operationNote, arrivalName: "하이원 밸리하우스", returnTime: returnService?.departureTime, returnService, priceLabel, ...details, bookingUrl: url, sourceUrl: url, stops: stops.map(([city, stopName, departureTime, oneWayFareAdult, roundTripFareAdult], index) => ({ id: `${id}-${index + 1}`, city, name: stopName, departureTime, oneWayFareAdult, roundTripFareAdult })), dataStatus: "confirmed_25_26", lastCheckedAt: high1CheckedAt };
}
function unconfirmed(id: string, region: string, name: string, operator: string, url: string, stops: StopInput[], returnService?: SkiShuttleRoute["returnService"]): SkiShuttleRoute {
  return { id, resortId: high1, season: "25/26", operator, region, name, operationNote: "25/26 운행 확인 · 귀가 시간은 운영사에 재확인", arrivalName: "하이원", returnService, fare: { type: "unknown", note: "운영사에 편도·왕복 요금 문의" }, service: { bookingRequirement: "귀가 시간·운행일·예약 조건 재확인" }, bookingUrl: url, sourceUrl: url, stops: stops.map(([city, stopName, departureTime], index) => ({ id: `${id}-${index + 1}`, city, name: stopName, departureTime })), dataStatus: "route_only_25_26", lastCheckedAt: high1CheckedAt };
}

function kdHigh1Return(): NonNullable<SkiShuttleRoute["returnService"]> {
  return { departureName: "하이원 예약 화면 지정 승차지", stopOrder: "same_stops", note: "귀가일·승차 위치·출발 시간은 대원관광 예약 화면에서 재확인" };
}

function osungReturn(): NonNullable<SkiShuttleRoute["returnService"]> {
  return { departureName: "하이원 밸리 스키하우스 주차장", departureTime: "16:30", stopOrder: "reverse", note: "귀가행은 가는 노선의 역순 · 인원에 따라 합류·환승 가능" };
}

function garamReturn(): NonNullable<SkiShuttleRoute["returnService"]> {
  return { departureName: "하이원 예약 화면 지정 승차지", stopOrder: "same_stops", note: "25/26 왕복 교통패스 노선 · 귀가 시간과 하차 순서는 운영사에 재확인" };
}
function phoenixRoute(id: string, region: string, name: string, operationNote: string, stops: StopInput[]): SkiShuttleRoute {
  const url = "https://skibus.purplebus.co.kr/Shop/YpSeason25/";
  return { id, resortId: phoenix, season: "25/26", operator: "대원관광", operatorPhone: "02-2201-7710", region, name, operationNote, arrivalName: "휘닉스 스노우파크", directions: ["outbound"], priceLabel: "휘닉스 교통시즌권 27.5만원", fare: { type: "season_pass", seasonPassAdult: 275000 }, service: phoenixService(operationNote), bookingUrl: url, sourceUrl: url, stops: stops.map(([city, stopName, departureTime], index) => ({ id: `${id}-${index + 1}`, city, name: stopName, departureTime })), dataStatus: "confirmed_25_26", lastCheckedAt: phoenixOakCheckedAt };
}
function phoenixReturnRoutes(): SkiShuttleRoute[] {
  const specs: [id: string, region: string, name: string, departureTime: string, days: string, stops: [city: string, name: string][]][] = [
    ["phoenix-return-1000-jamsil", "서울", "10시 잠실선", "10:00", "성수기 매일", [["서울","잠실역"],["서울","종합운동장역"]]],
    ["phoenix-return-1300-central", "서울", "13시 도심선", "13:00", "성수기·비수기·3월 4일부터 매일", [["서울","잠실역"],["서울","종합운동장역"],["서울","강남역"],["서울","명동역"],["서울","신촌역"]]],
    ["phoenix-return-1300-sadang", "서울", "13시 사당선", "13:00", "성수기 일요일", [["서울","잠실역"],["서울","종합운동장역"],["서울","사당역"]]],
    ["phoenix-return-1500-jamsil", "서울", "15시 잠실선", "15:00", "성수기 토·일", [["서울","잠실역"],["서울","종합운동장역"]]],
    ["phoenix-return-1700-central", "서울", "17시 도심선", "17:00", "성수기·비수기 매일", [["서울","잠실역"],["서울","종합운동장역"],["서울","강남역"],["서울","신촌역"]]],
    ["phoenix-return-1700-nowon", "서울", "17시 노원선", "17:00", "성수기 매일 · 비수기 토·일", [["서울","잠실역"],["서울","종합운동장역"],["서울","석계역"],["서울","노원역"]]],
    ["phoenix-return-1700-mokdong", "서울", "17시 사당·목동선", "17:00", "성수기 매일 · 비수기 토·일", [["서울","잠실역"],["서울","종합운동장역"],["서울","사당역"],["서울","목동역"]]],
    ["phoenix-return-1700-guro", "서울", "17시 신림·구디선", "17:00", "성수기·비수기 토·일", [["서울","잠실역"],["서울","종합운동장역"],["서울","신림역"],["서울","구로디지털단지역"]]],
    ["phoenix-return-1700-west-gyeonggi", "경기", "17시 서부 경기선", "17:00", "성수기 매일 · 비수기 토·일", [["성남","서현역"],["부천","송내역"],["고양","백석역"]]],
    ["phoenix-return-1700-south-gyeonggi", "경기", "17시 남부 경기선", "17:00", "성수기 매일 · 비수기 토·일", [["안양","범계역"],["수원","영통"]]],
    ["phoenix-return-2130-jamsil", "서울", "21시 30분 잠실선", "21:30", "성수기 토·일", [["서울","잠실역"],["서울","종합운동장역"]]]
  ];
  const url = "https://skibus.purplebus.co.kr/Shop/YpSeason25/";
  return specs.map(([id, region, name, departureTime, days, stops]) => ({
    id,
    resortId: phoenix,
    season: "25/26",
    operator: "대원관광",
    operatorPhone: "02-2201-7710",
    region,
    name,
    operationNote: `${days} · 25/26 귀가편`,
    arrivalName: "휘닉스 스노우파크",
    directions: ["return"],
    returnTime: departureTime,
    returnService: {
      departureName: "휘닉스파크 예약 화면 지정 승차지",
      departureTime,
      stopOrder: "same_stops",
      note: `${days} · 구정 연휴(2026-02-13~02-19)는 단축 운행 별도 공지`
    },
    priceLabel: "휘닉스 교통시즌권 27.5만원",
    fare: { type: "season_pass", seasonPassAdult: 275000 },
    service: phoenixService(days),
    bookingUrl: url,
    sourceUrl: url,
    stops: stops.map(([city, stopName], index) => ({ id: `${id}-${index + 1}`, city, name: stopName })),
    dataStatus: "confirmed_25_26",
    lastCheckedAt: phoenixOakCheckedAt
  }));
}
function jisanRoute(id: string, name: string, stopName: string): SkiShuttleRoute {
  return { id, resortId: jisan, season: "25/26", operator: "투어윈도우글로벌", operatorPhone: "02-2039-7728", region: "서울", name, operationNote: "25/26 시즌 · 사전 예약 필수", arrivalName: "지산리조트 제1주차장", returnTime: "12:00 / 18:00 선택", priceLabel: "편도 2만원 · 왕복 3.8만원", fare: { type: "single_ride", oneWayAdult: 20000, roundTripAdult: 38000 }, service: { days: "운영일 캘린더 기준", bookingRequirement: "사전 예약 필수" }, bookingUrl: "https://jisan.allthatlimo.net/", sourceUrl: "https://www.jisanresort.co.kr/m/member/customer.asp?schCate=ski", stops: [{ id: `${id}-1`, city: "서울", name: stopName, departureTime: "07:30 / 13:30" }], dataStatus: "confirmed_25_26", lastCheckedAt: checkedAt };
}
function wellihilliRoute(id: string, region: string, name: string, operationNote: string, stops: StopInput[]): SkiShuttleRoute {
  const url = "https://skibus.purplebus.co.kr/Shop/YpSeason25/";
  return { id, resortId: wellihilli, season: "25/26", operator: "대원관광", operatorPhone: "02-2201-7710", region, name, operationNote, arrivalName: "웰리힐리파크 서관 앞 버스주차장", priceLabel: "웰리힐리 교통시즌권 25만원", fare: { type: "season_pass", seasonPassAdult: 250000 }, service: kdService(), bookingUrl: url, sourceUrl: url, stops: stops.map(([city, stopName, departureTime], index) => ({ id: `${id}-${index + 1}`, city, name: stopName, departureTime })), dataStatus: "confirmed_25_26", lastCheckedAt: checkedAt };
}
function o2Route(): SkiShuttleRoute {
  const url = "https://www.o2resort.com/mobile/traffic";
  return { id: "o2-taebaek-station", resortId: o2, season: "25/26", operator: "오투리조트", region: "강원 태백", name: "태백역 연계선", operationNote: "공식 동계 구내셔틀 · 야간편은 야간 스키 운영일만 운행", arrivalName: "오투리조트 스키하우스", returnTime: "12:45 / 21:50", fare: { type: "free", roundTripAdult: 0 }, service: { days: "동계 운영일 · 야간편은 야간 스키 운영일", bookingRequirement: "공식 운행표 재확인" }, bookingUrl: url, sourceUrl: url, stops: [{ id: "o2-taebaek-station-1", city: "태백", name: "태백역 앞 시티투어 버스정류장", departureTime: "09:00 / 12:55" }], dataStatus: "confirmed_25_26", lastCheckedAt: checkedAt };
}
function oakvalleyRoutes(): SkiShuttleRoute[] {
  const bookingUrl = "https://oakvalley.co.kr/overview/location";
  const sourceUrl = "https://oakvalley.co.kr/customer-service/notice/1432674";
  const outboundSpecs: [id: string, name: string, times: string[]][] = [
    ["oakvalley-wonju-weekend", "오전 원주 고객 셔틀", ["08:00", "08:10", "08:20"]],
    ["oakvalley-wonju-weekend-afternoon", "오후 원주 고객 셔틀", ["15:50", "16:00", "16:10"]]
  ];
  const stopSpecs: [city: string, name: string][] = [["원주","원주역"],["원주","원주종합버스터미널"],["원주","만종역"]];
  const common = {
    resortId: oakvalley,
    season: "25/26",
    operator: "오크밸리",
    operatorPhone: "033-763-1005",
    region: "강원 원주",
    arrivalName: "오크밸리 스키장",
    priceLabel: "25/26 주말 무료 고객 셔틀",
    fare: { type: "free", roundTripAdult: 0 } as const,
    service: { period: "~ 2026-02-22", days: "토·일", bookingRequirement: "탑승 전 공식 공지에서 운행 여부 재확인" },
    bookingUrl,
    sourceUrl,
    dataStatus: "confirmed_25_26" as const,
    lastCheckedAt: phoenixOakCheckedAt
  };
  const outboundRoutes: SkiShuttleRoute[] = outboundSpecs.map(([id, name, times]) => ({
    ...common,
    id,
    name,
    operationNote: `토·일 무료 운행 · 원주역 ${times[0]} 출발`,
    directions: ["outbound"],
    stops: stopSpecs.map(([city, stopName], index) => ({ id: `${id}-${index + 1}`, city, name: stopName, departureTime: times[index] }))
  }));
  const returnRoutes: SkiShuttleRoute[] = [["oakvalley-return-morning", "오전 귀가 셔틀", "10:45"], ["oakvalley-return-evening", "오후 귀가 셔틀", "17:35"]].map(([id, name, departureTime]) => ({
    ...common,
    id,
    name,
    operationNote: `토·일 무료 운행 · 오크밸리 ${departureTime} 출발`,
    directions: ["return"],
    returnTime: departureTime,
    returnService: { departureName: "오크밸리 스키장 고객 셔틀 승차장", departureTime, stopOrder: "reverse", note: "토·일 운행 · 만종역, 원주종합버스터미널, 원주역 순 하차" },
    stops: stopSpecs.map(([city, stopName], index) => ({ id: `${id}-${index + 1}`, city, name: stopName }))
  }));
  return [...outboundRoutes, ...returnRoutes];
}
function elysianRoute(): SkiShuttleRoute {
  const bookingUrl = "https://www.elysian.co.kr/shuttle-bus-reservation";
  const sourceUrl = "https://www.elysian.co.kr/about-gangchon/way-to-come";
  return { id: "elysian-baegyangri", resortId: elysian, season: "25/26", operator: "엘리시안 강촌", operatorPhone: "033-260-2345", region: "강원 춘천", name: "백양리역 무료 순환선", operationNote: "25/26 주말·공휴일 약 20분 간격 · 정확한 시간 재확인", arrivalName: "엘리시안 강촌 리조트", priceLabel: "무료 내부 순환셔틀", fare: { type: "free", roundTripAdult: 0 }, service: { days: "주말·공휴일", bookingRequirement: "탑승 전 운영 시간 재확인" }, bookingUrl, sourceUrl, stops: [{ id: "elysian-baegyangri-1", city: "춘천", name: "백양리역 앞 셔틀 승강장" }], dataStatus: "route_only_25_26", lastCheckedAt: checkedAt };
}
function edenvalleyRoute(): SkiShuttleRoute {
  const url = "https://www.kkday.com/ko/product/29058";
  return { id: "edenvalley-daegu-tour", resortId: edenvalley, season: "25/26", operator: "KKday 제휴 현지 운영사", region: "대구", name: "대구 도심 왕복 스키투어 셔틀", operationNote: "겨울 한정 제휴 상품 · 25/26 판매 종료, 다음 시즌 일정 재확인", arrivalName: "에덴밸리 스키리조트", returnTime: "대구 약 19:30", priceLabel: "왕복 교통만 선택 가능 · 현재 매진", fare: { type: "tour_package", note: "교통 단독 옵션 가격은 판매 원문 재확인" }, service: { days: "겨울 한정", bookingRequirement: "현재 판매 종료 · 다음 시즌 재확인" }, bookingUrl: url, sourceUrl: url, stops: [["대구","반월당역 21번 출구","08:30"],["대구","동대구역 3번 출구","09:00"]].map(([city, name, departureTime], index) => ({ id: `edenvalley-daegu-tour-${index + 1}`, city, name, departureTime })), dataStatus: "route_only_25_26", lastCheckedAt: checkedAt };
}
function kdPyeongchangRoutes(resortId: string, arrivalName: string): SkiShuttleRoute[] {
  const url = "https://skibus.purplebus.co.kr/Shop/YpSeason25/";
  const specs: [string, string, string, string, StopInput[]][] = [
    ["sadang","서울","사당·강남선","매일 운행 중심 · 종합운동장 합류",[["서울","사당역","05:35"],["서울","양재역","05:50"],["서울","도곡역","05:52"],["서울","대치역","05:55"],["서울","종합운동장","06:20"]]],
    ["myeongdong","서울","명동·강남선","매일 운행 중심 · 종합운동장 합류",[["서울","명동역","05:25"],["서울","동대문","05:35"],["서울","강남역","05:47"],["서울","종합운동장","06:20"]]],
    ["sinchon","서울","홍대·신촌선","성수기 매일, 비수기 주말 중심",[["서울","홍대입구","05:25"],["서울","신촌역","05:30"],["서울","광흥창역","05:35"],["서울","마포역","05:40"],["서울","종합운동장","06:20"]]],
    ["nowon","서울","노원·광나루선","성수기 매일, 비수기 주말 중심",[["서울","노원역","05:15"],["서울","석계역","05:25"],["서울","군자역","05:40"],["서울","광나루역","05:45"],["서울","종합운동장","06:20"]]],
    ["mokdong","서울","강서·목동선","성수기 매일, 비수기 주말 중심",[["서울","강서","05:15"],["서울","목동역","05:25"],["서울","여의도","05:40"],["서울","종합운동장","06:20"]]],
    ["sillim","서울","구디·신림선","주말 중심 · 종합운동장 합류",[["서울","구로디지털단지역","05:25"],["서울","신림역","05:35"],["서울","서울대입구역","05:40"],["서울","이수역","05:50"],["서울","종합운동장","06:20"]]],
    ["cheongnyangni","서울","성신여대·청량리선","토요일 중심 · 종합운동장 합류",[["서울","성신여대입구역","05:20"],["서울","길음역","05:25"],["서울","청량리역","05:40"],["서울","회기역","05:45"],["서울","종합운동장","06:20"]]],
    ["bundang","경기","수지·분당선","주말 중심 · 서현 합류",[["용인","수지","06:05"],["용인","죽전","06:10"],["성남","미금역","06:15"],["성남","정자역","06:20"],["성남","서현역","06:40"]]],
    ["anyang","경기","산본·안양선","주말 중심 · 서현 합류",[["군포","산본역","05:40"],["안양","범계역","05:50"],["안양","평촌역","06:00"],["안양","인덕원역","06:10"],["성남","서현역","06:40"]]],
    ["suwon","경기","수원·영통선","매일 운행 중심 · 영통 합류",[["수원","성균관대역","06:10"],["수원","화서역","06:15"],["수원","수원역","06:20"],["수원","영통","06:40"]]],
    ["ilsan","경기","일산선","주말 중심 · 송내 합류",[["고양","대화역","05:20"],["고양","주엽역","05:25"],["고양","정발산역","05:30"],["고양","백석역","05:35"],["부천","송내역","06:10"]]],
    ["incheon","인천","인천·부평선","주말 중심 · 송내 합류",[["인천","인천터미널","05:15"],["인천","간석오거리","05:25"],["인천","부평역","05:40"],["부천","송내역","06:10"]]]
  ];
  return specs.map(([suffix, region, name, operationNote, stops]) => ({ id: `${resortId}-kd-${suffix}`, resortId, season: "25/26", operator: "대원관광", operatorPhone: "02-2201-7710", region, name, operationNote, arrivalName, priceLabel: "용평·알펜시아 교통시즌권 29만원", fare: { type: "season_pass", seasonPassAdult: 290000 }, service: kdService(), bookingUrl: url, sourceUrl: url, stops: stops.map(([city, stopName, departureTime], index) => ({ id: `${resortId}-kd-${suffix}-${index + 1}`, city, name: stopName, departureTime })), dataStatus: "confirmed_25_26", lastCheckedAt: checkedAt }));
}
function vivaldiRoutes(): SkiShuttleRoute[] {
  const bookingUrl = "https://vivabus.net/";
  const sourceUrl = "https://www.sonohotelsresorts.com/skiboard/info";
  return [
    { id: "vivaldi-hongdae", resortId: vivaldi, season: "25/26", operator: "대명투어", operatorPhone: "031-765-7965", region: "서울", name: "홍대·동대문·건대선", operationNote: "25/26 시즌 2025-12-05~2026-03-02 · 사전 예약", arrivalName: "비발디파크", fare: { type: "unknown", note: "날짜·출발지별 예약 화면에서 확인" }, service: { period: "2025-12-05 ~ 2026-03-02", bookingRequirement: "사전 예약" }, bookingUrl, sourceUrl, stops: ["홍대입구역","동대문역사문화공원역","건대입구역"].map((name, index) => ({ id: `vivaldi-hongdae-${index + 1}`, city: "서울", name })), dataStatus: "route_only_25_26", lastCheckedAt: checkedAt },
    { id: "vivaldi-jamsil", resortId: vivaldi, season: "25/26", operator: "대명투어", operatorPhone: "031-765-7965", region: "서울", name: "종합운동장 직행선", operationNote: "25/26 시즌 2025-12-05~2026-03-02 · 사전 예약", arrivalName: "비발디파크", fare: { type: "unknown", note: "날짜별 예약 화면에서 확인" }, service: { period: "2025-12-05 ~ 2026-03-02", bookingRequirement: "사전 예약" }, bookingUrl, sourceUrl, stops: [{ id: "vivaldi-jamsil-1", city: "서울", name: "종합운동장역" }], dataStatus: "route_only_25_26", lastCheckedAt: checkedAt }
  ];
}

function kdService(): NonNullable<SkiShuttleRoute["service"]> {
  return { period: "스키장 개장 주말 ~ 2026-03-02", days: "노선별 매일 또는 주말", bookingRequirement: "대원관광 홈페이지 사전 예약 · 전화 예약 불가" };
}

function phoenixService(days: string): NonNullable<SkiShuttleRoute["service"]> {
  return { period: "2025-12-01 ~ 2026-03-02 · 일부 노선 3월 이후", days, bookingRequirement: "대원관광 홈페이지 사전 예약 · 구정 연휴 단축 운행 별도 공지 · 전화 예약 불가" };
}

function high1RouteDetails(id: string): Pick<SkiShuttleRoute, "fare" | "service"> {
  if (id.startsWith("kd-")) return { fare: { type: "season_pass", seasonPassAdult: 300000 }, service: kdService() };
  if (id.startsWith("osung-")) return { fare: { type: "single_ride", oneWayAdult: 38000, roundTripAdult: 45000, note: "45석 일반버스 성인 기준" }, service: { period: "2025-12-24 ~ 2026-02-28 지정 운행일", days: id.endsWith("-1") ? "평일·주말" : "주말", reservationDeadline: "출발 1일 전 15:00 · 휴일 12:00", bookingRequirement: "15시 이후 잔여석 전화 예약", minimumPassengers: 10 } };
  if (id === "eunsung-busan") return { fare: { type: "single_ride", note: "45인승 6만원부터 · 우등리무진 8만원부터 · 왕복/편도 옵션별 예약 화면 확인" }, service: { days: "의무운행일", bookingRequirement: "운영사 사전 예약 · 왕복 또는 편도 선택" } };
  if (id === "daewon-honam") return { fare: { type: "tour_package", oneWayAdult: 50000, roundTripAdult: 80000, note: "대전 출발 기준 최저가 · 전주·광주는 선택한 하차지별 요금 적용" }, service: { days: "토·일·공휴일", reservationDeadline: "출발 3일 전 15:00", minimumPassengers: 12, bookingRequirement: "최소 인원 미달 시 취소·전액 환불" } };
  return { fare: { type: "unknown" }, service: { bookingRequirement: "운영사에 세부 조건 재확인" } };
}
