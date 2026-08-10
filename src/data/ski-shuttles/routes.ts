import type { SkiShuttleRoute } from "@/lib/types";

const checkedAt = "2026-07-17";
const high1CheckedAt = "2026-08-10";
const phoenixOakCheckedAt = "2026-08-10";
const yongpyongVivaldiCheckedAt = "2026-08-10";
const wellihilliAlpensiaCheckedAt = "2026-08-10";
const elysianJisanCheckedAt = "2026-08-10";
const o2EdenCheckedAt = "2026-08-10";
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
  ...jisanRoutes(),
  ...wellihilliRoutes(),
  ...o2Routes(),
  ...oakvalleyRoutes(),
  ...elysianRoutes(),
  ...edenvalleyRoutes(),
  ...alpensiaRoutes(),
  ...vivaldiRoutes(),
  ...yongpyongRoutes()
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
function jisanRoutes(): SkiShuttleRoute[] {
  const bookingUrl = "https://jisan.allthatlimo.net/";
  const sourceUrl = "https://www.jisanresort.co.kr/m/member/customer.asp?schCate=ski";
  const common = {
    resortId: jisan,
    season: "25/26",
    operator: "투어윈도우글로벌",
    operatorPhone: "02-2039-7728",
    region: "서울",
    arrivalName: "지산리조트 제1주차장",
    priceLabel: "편도 2만원 · 왕복 3.8만원",
    fare: { type: "single_ride", oneWayAdult: 20000, roundTripAdult: 38000 } as const,
    service: { period: "25/26 스키 시즌", days: "예약 캘린더 운영일", bookingRequirement: "온라인 또는 전화 사전 예약" },
    bookingUrl,
    sourceUrl,
    dataStatus: "confirmed_25_26" as const,
    lastCheckedAt: elysianJisanCheckedAt
  };
  const stops: [suffix: string, routeName: string, stopName: string][] = [
    ["cityhall", "서울시청선", "시청역 2번 출구"],
    ["jamsil", "종합운동장선", "종합운동장역 1번 출구"]
  ];
  const outbound = stops.flatMap(([suffix, routeName, stopName]) => [["0730", "07:30"], ["1330", "13:30"]].map(([timeSuffix, departureTime]): SkiShuttleRoute => {
    const id = timeSuffix === "0730" ? `jisan-${suffix}` : `jisan-${suffix}-${timeSuffix}`;
    return { ...common, id, name: `${departureTime} ${routeName}`, operationNote: `${departureTime} 출발 · 지산리조트 제1주차장행`, directions: ["outbound"], stops: [{ id: `${id}-1`, city: "서울", name: stopName, departureTime }] };
  }));
  const returning = stops.flatMap(([suffix, routeName, stopName]) => [["1200", "12:00"], ["1800", "18:00"]].map(([timeSuffix, departureTime]): SkiShuttleRoute => {
    const id = `jisan-return-${suffix}-${timeSuffix}`;
    return { ...common, id, name: `${departureTime} ${routeName} 귀가편`, operationNote: `지산리조트 ${departureTime} 출발`, directions: ["return"], returnTime: departureTime, returnService: { departureName: "지산리조트 제1주차장 셔틀 승차장", departureTime, stopOrder: "same_stops", note: `${stopName}행 · 예약일 운행 여부 재확인` }, stops: [{ id: `${id}-1`, city: "서울", name: stopName }] };
  }));
  return [...outbound, ...returning];
}
function wellihilliRoutes(): SkiShuttleRoute[] {
  const url = "https://skibus.purplebus.co.kr/Shop/YpSeason25/";
  const outboundSpecs: [id: string, region: string, name: string, days: string, stops: StopInput[]][] = [
    ["wellihilli-kd-sadang", "서울", "사당·강남선", "성수기·비수기·3월 3일부터 매일", [["서울","사당역","05:55"],["서울","양재역","06:10"],["서울","도곡역","06:12"],["서울","대치역","06:15"],["서울","종합운동장","06:40"]]],
    ["wellihilli-kd-sinchon", "서울", "홍대·신촌선", "성수기·비수기 매일 · 3월 3일부터 토·일", [["서울","홍대입구","05:40"],["서울","신촌역","05:45"],["서울","광흥창역","05:50"],["서울","마포역","05:55"],["서울","종합운동장","06:40"]]],
    ["wellihilli-kd-myeongdong", "서울", "명동·강남선", "성수기·비수기 매일", [["서울","명동역","05:45"],["서울","동대문","05:55"],["서울","강남역","06:07"],["서울","종합운동장","06:40"]]],
    ["wellihilli-kd-nowon", "서울", "노원·광나루선", "성수기 매일 · 비수기 토·일", [["서울","노원역","05:35"],["서울","석계역","05:45"],["서울","군자역","06:00"],["서울","광나루역","06:05"],["서울","종합운동장","06:40"]]],
    ["wellihilli-kd-mokdong", "서울", "강서·목동선", "성수기 매일 · 비수기 토·일", [["서울","강서","05:35"],["서울","목동역","05:45"],["서울","여의도","06:00"],["서울","종합운동장","06:40"]]],
    ["wellihilli-kd-sillim", "서울", "구디·신림선", "성수기 토·일", [["서울","구로디지털단지역","05:45"],["서울","신림역","05:55"],["서울","서울대입구역","06:00"],["서울","이수역","06:10"],["서울","종합운동장","06:40"]]],
    ["wellihilli-kd-cheongnyangni", "서울", "성신여대·청량리선", "성수기 토요일", [["서울","성신여대입구역","05:40"],["서울","길음역","05:45"],["서울","청량리역","06:00"],["서울","회기역","06:05"],["서울","종합운동장","06:40"]]],
    ["wellihilli-kd-bundang", "경기", "수지·분당선", "성수기·비수기 토·일", [["용인","수지","06:05"],["용인","죽전","06:10"],["성남","미금역","06:15"],["성남","정자역","06:20"],["성남","서현역","06:40"]]],
    ["wellihilli-kd-anyang", "경기", "산본·안양선", "성수기·비수기 토·일", [["군포","산본역","05:40"],["안양","범계역","05:50"],["안양","평촌역","06:00"],["안양","인덕원역","06:10"],["성남","서현역","06:40"]]],
    ["wellihilli-kd-ilsan", "경기", "일산선", "성수기·비수기 토·일", [["고양","대화역","05:20"],["고양","주엽역","05:25"],["고양","정발산역","05:30"],["고양","백석역","05:35"],["부천","송내역","06:10"]]],
    ["wellihilli-kd-incheon", "인천", "인천·부평선", "성수기·비수기 토·일", [["인천","인천터미널","05:15"],["인천","간석오거리","05:25"],["인천","부평역","05:40"],["부천","송내역","06:10"]]],
    ["wellihilli-kd-sadang-morning", "서울", "오전 사당·강남선", "성수기·비수기·3월 3일부터 매일", [["서울","사당역","09:00"],["서울","양재역","09:20"],["서울","도곡역","09:25"],["서울","대치역","09:30"],["서울","종합운동장","10:00"]]],
    ["wellihilli-kd-sinchon-morning", "서울", "오전 홍대·신촌선", "성수기·비수기 매일", [["서울","홍대입구","08:50"],["서울","신촌역","08:55"],["서울","광흥창역","09:00"],["서울","마포역","09:10"],["서울","종합운동장","10:00"]]],
    ["wellihilli-kd-myeongdong-morning", "서울", "오전 명동·강남선", "성수기·비수기 매일", [["서울","명동역","08:45"],["서울","동대문","08:55"],["서울","강남역","09:25"],["서울","종합운동장","10:00"]]],
    ["wellihilli-kd-nowon-morning", "서울", "오전 노원·광나루선", "성수기 토·일", [["서울","노원역","08:55"],["서울","석계역","09:05"],["서울","군자역","09:25"],["서울","광나루역","09:30"],["서울","종합운동장","10:00"]]],
    ["wellihilli-kd-night", "서울", "야간 종합운동장선", "성수기 금요일", [["서울","종합운동장","20:00"]]]
  ];
  const common = {
    resortId: wellihilli,
    season: "25/26",
    operator: "대원관광",
    operatorPhone: "02-2201-7710",
    arrivalName: "웰리힐리파크 서관 앞 버스주차장",
    priceLabel: "웰리힐리 교통시즌권 25만원",
    fare: { type: "season_pass", seasonPassAdult: 250000 } as const,
    bookingUrl: url,
    sourceUrl: url,
    dataStatus: "confirmed_25_26" as const,
    lastCheckedAt: wellihilliAlpensiaCheckedAt
  };
  const outbound = outboundSpecs.map(([id, region, name, days, stops]): SkiShuttleRoute => ({
    ...common,
    id,
    region,
    name,
    operationNote: days,
    directions: ["outbound"],
    service: wellihilliService(days),
    stops: stops.map(([city, stopName, departureTime], index) => ({ id: `${id}-${index + 1}`, city, name: stopName, departureTime }))
  }));
  const returnSpecs: [id: string, region: string, name: string, departureTime: string, days: string, stops: [city: string, name: string][]][] = [
    ["wellihilli-return-1100-jamsil", "서울", "11시 잠실선", "11:00", "성수기 매일 · 용평 경유", [["서울","잠실역"],["서울","종합운동장역"]]],
    ["wellihilli-return-1300-central", "서울", "13시 도심선", "13:00", "성수기·비수기·3월 3일부터 매일", [["서울","잠실역"],["서울","종합운동장역"],["서울","명동역"],["서울","신촌역"]]],
    ["wellihilli-return-1700-central", "서울", "17시 도심선", "17:00", "성수기 매일 · 비수기 토·일", [["서울","잠실역"],["서울","종합운동장역"],["서울","명동역"],["서울","신촌역"]]],
    ["wellihilli-return-1700-gyeonggi", "경기", "17시 경기선", "17:00", "성수기·비수기 토·일", [["성남","서현역"],["부천","송내역"]]]
  ];
  const returning = returnSpecs.map(([id, region, name, departureTime, days, stops]): SkiShuttleRoute => ({
    ...common,
    id,
    region,
    name,
    operationNote: `${days} · 25/26 귀가편`,
    directions: ["return"],
    returnTime: departureTime,
    returnService: { departureName: "웰리힐리파크 서관 앞 버스주차장", departureTime, stopOrder: "same_stops", note: `${days} · 구정 연휴(2026-02-13~02-19)는 단축 운행 별도 공지` },
    service: wellihilliService(days),
    stops: stops.map(([city, stopName], index) => ({ id: `${id}-${index + 1}`, city, name: stopName }))
  }));
  return [...outbound, ...returning];
}
function o2Routes(): SkiShuttleRoute[] {
  const url = "https://www.o2resort.com/mobile/traffic/";
  const common = {
    resortId: o2,
    season: "25/26",
    operator: "오투리조트",
    operatorPhone: "033-580-7000",
    region: "강원 태백",
    arrivalName: "오투리조트 스키하우스",
    priceLabel: "무료 구내셔틀",
    fare: { type: "free", roundTripAdult: 0 } as const,
    bookingUrl: url,
    sourceUrl: url,
    dataStatus: "confirmed_25_26" as const,
    lastCheckedAt: o2EdenCheckedAt
  };
  const outboundService = { days: "동계 운영일", bookingRequirement: "교통·기상에 따라 약 5분 변동 가능 · 출발 5분 전 대기" };
  const outboundSpecs: [id: string, name: string, departureTime: string][] = [
    ["o2-taebaek-station", "09시 태백역 연계선", "09:00"],
    ["o2-taebaek-station-1255", "12시 55분 태백역 연계선", "12:55"]
  ];
  const outbound = outboundSpecs.map(([id, name, departureTime]): SkiShuttleRoute => ({
    ...common,
    id,
    name,
    operationNote: `태백역 ${departureTime} 출발 · 공식 동계 구내셔틀`,
    directions: ["outbound"],
    service: outboundService,
    stops: [{ id: `${id}-1`, city: "태백", name: "태백역 앞 시티투어 버스정류장", departureTime }]
  }));
  const returnSpecs: [id: string, name: string, departureTime: string, days: string][] = [
    ["o2-return-taebaek-1245", "12시 45분 태백역 귀가편", "12:45", "동계 운영일"],
    ["o2-return-taebaek-2150", "21시 50분 태백역 귀가편", "21:50", "야간 스키 운영일만"]
  ];
  const returning = returnSpecs.map(([id, name, departureTime, days]): SkiShuttleRoute => ({
    ...common,
    id,
    name,
    operationNote: `스키하우스 ${departureTime} 출발 · ${days}`,
    directions: ["return"],
    returnTime: departureTime,
    returnService: { departureName: "오투리조트 스키하우스 정문 도로변", departureTime, stopOrder: "same_stops", note: `${days} · 교통·기상에 따라 약 5분 변동 가능` },
    service: { days, bookingRequirement: departureTime === "21:50" ? "출발 5분 전 대기 · 당일 야간 스키 운영 여부 확인" : "교통·기상에 따라 약 5분 변동 가능 · 출발 5분 전 대기" },
    stops: [{ id: `${id}-1`, city: "태백", name: "태백역 앞 시티투어 버스정류장" }]
  }));
  return [...outbound, ...returning];
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
function elysianRoutes(): SkiShuttleRoute[] {
  const url = "https://www.elysian.co.kr/shuttle-bus-reservation";
  const metroSpecs: [suffix: string, region: string, name: string, period: string, days: string, returnTime: string, stops: StopInput[]][] = [
    ["offpeak-dawn-gangnam", "서울", "비수기 새벽 강남선", "2025-12-13~12-31 · 2026-02-28~03-01", "주말·공휴일", "17:30", [["서울","영등포역","06:30"],["서울","신림역","06:50"],["서울","사당역","07:05"],["서울","강남역","07:20"],["서울","잠실역","07:45"],["서울","천호역","07:55"]]],
    ["offpeak-dawn-gangbuk", "서울·경기", "비수기 새벽 강북선", "2025-12-13~12-31 · 2026-02-28~03-01", "주말·공휴일", "17:30", [["서울","신촌역","06:55"],["서울","서울역","07:05"],["서울","동대문역","07:15"],["서울","청량리역","07:25"],["서울","상봉역","07:40"],["구리","구리역","07:55"]]],
    ["peak-dawn-gangnam1", "서울·경기", "성수기 새벽 강남1선", "2026-01-01~02-22", "주말·공휴일", "17:30", [["광명","철산역","06:30"],["서울","신림역","06:50"],["서울","서울대입구역","06:57"],["서울","사당역","07:05"],["서울","양재역","07:15"],["서울","강남역","07:20"],["서울","신사역","07:25"]]],
    ["peak-dawn-gangnam2", "서울", "성수기 새벽 강남2선", "2026-01-01~02-22", "주말·공휴일", "17:30", [["서울","신반포","06:55"],["서울","압구정로데오역","07:05"],["서울","청담역","07:10"],["서울","학여울역","07:25"],["서울","송파역","07:35"],["서울","잠실역","07:45"],["서울","천호역","07:55"]]],
    ["peak-dawn-sinchon", "서울", "성수기 새벽 신촌선", "2026-01-01~02-22", "주말·공휴일", "17:30", [["서울","공덕역","06:50"],["서울","신촌역","06:55"],["서울","서울역","07:05"],["서울","동대문역","07:15"],["서울","청량리역","07:25"],["서울","건대입구역","07:45"]]],
    ["peak-dawn-balsan", "서울", "성수기 새벽 발산역선", "2026-01-01~02-22", "주말·공휴일", "17:30", [["서울","발산역","06:35"],["서울","화곡역","06:41"],["서울","목동역","06:53"],["서울","신도림역","07:05"],["서울","영등포역","07:10"],["서울","여의도역","07:15"],["서울","흑석역","07:30"]]],
    ["peak-dawn-hapjeong", "서울·경기", "성수기 새벽 합정역선", "2026-01-01~02-22", "주말·공휴일", "17:30", [["서울","합정역","06:50"],["서울","홍대입구역","06:55"],["서울","디지털미디어시티역","07:05"],["서울","응암역","07:15"],["서울","연신내역","07:25"],["서울","구파발역","07:35"],["고양","삼송역","07:40"]]],
    ["peak-dawn-uijeongbu", "서울·경기", "성수기 새벽 의정부선", "2026-01-01~02-22", "주말·공휴일", "17:30", [["의정부","의정부역","06:30"],["의정부","회룡역","06:35"],["서울","노원역","06:55"],["서울","수유역","07:07"],["서울","미아사거리역","07:15"],["서울","태릉입구역","07:35"],["서울","상봉역","07:50"],["구리","구리역","08:05"]]],
    ["peak-dawn-west-gyeonggi", "인천·경기", "성수기 새벽 부천·김포·일산선", "2026-01-01~02-22", "주말·공휴일", "17:30", [["인천","부평역","06:30"],["부천","상동역","06:45"],["김포","고촌역","07:05"],["고양","마두역","07:20"],["고양","일산자이 4단지","07:35"]]],
    ["peak-morning-gangnam", "서울", "성수기 오전 강남선", "2026-01-01~02-22", "주말·공휴일", "13:30", [["서울","영등포역","09:40"],["서울","사당역","10:15"],["서울","잠실역","10:50"]]],
    ["peak-morning-gangbuk", "서울·경기", "성수기 오전 강북선", "2026-01-01~02-22", "주말·공휴일", "13:30", [["서울","신촌역","09:50"],["서울","동대문역","10:10"],["서울","상봉역","10:35"],["구리","구리역","10:50"]]]
  ];
  const common = {
    resortId: elysian,
    season: "25/26",
    operator: "엘리시안 강촌",
    operatorPhone: "033-260-2345",
    arrivalName: "엘리시안 강촌 스키하우스",
    priceLabel: "무료 셔틀",
    fare: { type: "free", roundTripAdult: 0 } as const,
    bookingUrl: url,
    sourceUrl: url,
    dataStatus: "confirmed_25_26" as const,
    lastCheckedAt: elysianJisanCheckedAt
  };
  const metropolitan = metroSpecs.flatMap(([suffix, region, name, period, days, returnTime, stops]): SkiShuttleRoute[] => {
    const outboundId = `elysian-metro-${suffix}`;
    const returnId = `elysian-return-${suffix}`;
    const service = { period, days, bookingRequirement: "비예약제 · 노선별 1대 · 만차 시 탑승 불가 · 2026-02-17 전 노선 미운행" };
    return [
      { ...common, id: outboundId, region, name, operationNote: `${period} ${days} · 수도권 무료 셔틀`, directions: ["outbound"], service, stops: stops.map(([city, stopName, departureTime], index) => ({ id: `${outboundId}-${index + 1}`, city, name: stopName, departureTime })) },
      { ...common, id: returnId, region, name: `${returnTime} ${name} 귀가편`, operationNote: `리조트 ${returnTime} 출발 · 가는 편 탑승객이 없으면 귀가편 미운행`, directions: ["return"], returnTime, returnService: { departureName: "스키하우스 뒤편 안내센터 앞", departureTime: returnTime, stopOrder: "reverse", note: `${name} 역순 하차 · 가는 편 탑승객이 없으면 귀가편 미운행` }, service, stops: stops.map(([city, stopName], index) => ({ id: `${returnId}-${index + 1}`, city, name: stopName })) }
    ];
  });
  const stationService = { period: "2025-12-12~2026-02-22", days: "25/26 동계 운영일", bookingRequirement: "백양리역·콘도·스키하우스·챌린지하우스 순환 · 운영 상황에 따라 변경 가능" };
  const stationRoutes: SkiShuttleRoute[] = [
    { ...common, id: "elysian-baegyangri", region: "강원 춘천", name: "백양리역 무료 순환선", operationNote: "백양리역 07:40부터 약 20분 간격", directions: ["outbound"], service: stationService, stops: [{ id: "elysian-baegyangri-1", city: "춘천", name: "백양리역 앞 셔틀 승강장", departureTime: "07:40부터 약 20분 간격" }] },
    { ...common, id: "elysian-return-baegyangri", region: "강원 춘천", name: "백양리역 무료 귀가 순환선", operationNote: "스키하우스·챌린지하우스에서 백양리역 순환", directions: ["return"], returnTime: "07:45부터 약 20분 간격", returnService: { departureName: "스키하우스·챌린지하우스 셔틀 승강장", departureTime: "07:45부터 약 20분 간격", stopOrder: "same_stops", note: "백양리역행 · 시즌 구간과 당일 운영표 재확인" }, service: stationService, stops: [{ id: "elysian-return-baegyangri-1", city: "춘천", name: "백양리역 앞 셔틀 승강장" }] }
  ];
  return [...metropolitan, ...stationRoutes];
}
function edenvalleyRoutes(): SkiShuttleRoute[] {
  const officialUrl = "https://www.edenvalley.co.kr/CS/View.asp?location=06";
  const officialCommon = {
    resortId: edenvalley,
    season: "25/26",
    operator: "에덴밸리 공식 안내",
    region: "부산·경남",
    arrivalName: "에덴밸리리조트",
    priceLabel: "시간·요금 운영사 재확인",
    fare: { type: "unknown", note: "공식 교통 페이지에 요금이 게시되지 않음" } as const,
    service: { bookingRequirement: "공식 페이지의 시간표 칸이 비어 있어 운행일·시간·요금을 리조트에 확인" },
    bookingUrl: officialUrl,
    sourceUrl: officialUrl,
    dataStatus: "route_only_25_26" as const,
    lastCheckedAt: o2EdenCheckedAt
  };
  const officialRoutes: SkiShuttleRoute[] = [
    {
      ...officialCommon,
      id: "edenvalley-nopo-yangsan",
      name: "노포·양산 정기 상행선",
      operationNote: "공식 경유지는 확인 · 25/26 운행 시간 미게시",
      directions: ["outbound"],
      stops: ["노포역", "양산역", "새양산병원", "영광복국", "삼성파크빌"].map((name, index) => ({ id: `edenvalley-nopo-yangsan-${index + 1}`, city: index === 0 ? "부산" : "양산", name }))
    },
    {
      ...officialCommon,
      id: "edenvalley-return-nopo-yangsan",
      name: "노포·양산 정기 하행선",
      operationNote: "공식 하차지는 확인 · 25/26 운행 시간 미게시",
      directions: ["return"],
      returnService: { departureName: "에덴밸리리조트 정기버스 승차장", stopOrder: "same_stops", note: "25/26 리조트 출발 시간 미게시 · 운영사 재확인" },
      stops: ["삼성파크빌", "영광복국", "운동장", "양산역", "노포역"].map((name, index) => ({ id: `edenvalley-return-nopo-yangsan-${index + 1}`, city: index === 4 ? "부산" : "양산", name }))
    }
  ];

  const tourUrl = "https://www.kkday.com/ko/product/29058";
  const tourCommon = {
    resortId: edenvalley,
    season: "25/26",
    operator: "KKday 제휴 현지 운영사",
    region: "대구·부산",
    arrivalName: "에덴밸리 스키리조트",
    priceLabel: "왕복 교통만 선택 가능 · 현재 매진",
    fare: { type: "tour_package", note: "교통 단독 옵션 가격은 판매 원문 재확인" } as const,
    service: { days: "겨울 한정", bookingRequirement: "현재 판매 종료 · 다음 시즌 일정·가격 재확인" },
    bookingUrl: tourUrl,
    sourceUrl: tourUrl,
    dataStatus: "route_only_25_26" as const,
    lastCheckedAt: o2EdenCheckedAt
  };
  const tourRoutes: SkiShuttleRoute[] = [
    {
      ...tourCommon,
      id: "edenvalley-daegu-tour",
      name: "대구 출발 겨울 스키투어",
      operationNote: "반월당 08:30 · 동대구역 09:00 · 약 11시간 일정",
      directions: ["outbound"],
      stops: [["반월당역 21번 출구", "08:30"], ["동대구역 3번 출구", "09:00"]].map(([name, departureTime], index) => ({ id: `edenvalley-daegu-tour-${index + 1}`, city: "대구", name, departureTime }))
    },
    {
      ...tourCommon,
      id: "edenvalley-daegu-tour-return",
      name: "대구·부산 귀환 스키투어",
      operationNote: "대구 또는 부산 귀환 선택 · 리조트 출발 시각은 바우처 확인",
      directions: ["return"],
      returnTime: "대구 약 19:30 · 부산 약 19:20 도착",
      returnService: { departureName: "에덴밸리 스키리조트 운영사 지정 승차지", stopOrder: "same_stops", note: "약 11시간 일정 · 리조트 출발 시각과 정확한 하차지는 바우처 확인" },
      stops: [
        { id: "edenvalley-daegu-tour-return-1", city: "대구", name: "대구 지정 하차지", arrivalTime: "약 19:30" },
        { id: "edenvalley-daegu-tour-return-2", city: "부산", name: "부산 지정 하차지", arrivalTime: "약 19:20" }
      ]
    }
  ];
  return [...officialRoutes, ...tourRoutes];
}
function alpensiaRoutes(): SkiShuttleRoute[] {
  const sourceUrl = "https://www.alpensia.com/guide/directions-public.do";
  const directBookingUrl = "https://skibus.purplebus.co.kr/Ap/";
  const directCommon = {
    resortId: alpensia,
    season: "25/26",
    operator: "경기대원고속관광",
    operatorPhone: "02-2201-7710",
    region: "서울",
    arrivalName: "알펜시아 웰컴센터 앞",
    priceLabel: "알펜시아 정기노선 왕복 3.4만원",
    fare: { type: "single_ride", roundTripAdult: 34000, note: "온라인 왕복 구매가 · 편도 이용 불가" } as const,
    service: { days: "공식 예약 화면 운행일", reservationDeadline: "가는 편 전일 17:00 · 오는 편 출발 4시간 전", bookingRequirement: "모바일 사전 예약 필수 · 편도 및 미예약 현장 이용 불가" },
    bookingUrl: directBookingUrl,
    sourceUrl,
    dataStatus: "confirmed_25_26" as const,
    lastCheckedAt: wellihilliAlpensiaCheckedAt
  };
  const directRoutes: SkiShuttleRoute[] = [
    {
      ...directCommon,
      id: "alpensia-kd-myeongdong",
      name: "명동·종합운동장 정기노선",
      operationNote: "명동 09:30 · 종합운동장 10:00",
      directions: ["outbound"],
      stops: [["명동역 1번 출구 한전 앞", "09:30"], ["종합운동장역 7번 출구 대로변", "10:00"]].map(([name, departureTime], index) => ({ id: `alpensia-kd-myeongdong-${index + 1}`, city: "서울", name, departureTime }))
    },
    {
      ...directCommon,
      id: "alpensia-kd-return-1310",
      name: "13시 10분 서울 귀가 정기노선",
      operationNote: "알펜시아 웰컴센터 13:10 출발 · 하차 순서 재확인",
      directions: ["return"],
      returnTime: "13:10",
      returnService: { departureName: "알펜시아 웰컴센터 정문 앞", departureTime: "13:10", stopOrder: "same_stops", note: "명동·종합운동장 하차 순서는 예약 화면에서 재확인" },
      stops: [["서울","명동역"],["서울","종합운동장역"]].map(([city, name], index) => ({ id: `alpensia-kd-return-1310-${index + 1}`, city, name }))
    }
  ];
  const stationCommon = {
    resortId: alpensia,
    season: "25/26",
    operator: "알펜시아 리조트",
    operatorPhone: "033-339-0000",
    region: "강원 평창",
    arrivalName: "알펜시아 웰컴센터 앞",
    priceLabel: "KTX 진부역 무료 셔틀",
    fare: { type: "free", roundTripAdult: 0 } as const,
    service: { period: "별도 안내일까지", days: "공식 운행일", bookingRequirement: "알펜시아 이용객 전용 · 예약 문자 확인 · 단체 이용 불가 · 선착순 좌석" },
    bookingUrl: sourceUrl,
    sourceUrl,
    dataStatus: "confirmed_25_26" as const,
    lastCheckedAt: wellihilliAlpensiaCheckedAt
  };
  const stationOutbound = [["alpensia-jinbu-1100", "11시 진부역선", "11:00"], ["alpensia-jinbu-1410", "14시 10분 진부역선", "14:10"]].map(([id, name, departureTime]): SkiShuttleRoute => ({
    ...stationCommon,
    id,
    name,
    operationNote: `진부(오대산)역 ${departureTime} 출발`,
    directions: ["outbound"],
    stops: [{ id: `${id}-1`, city: "평창", name: "KTX 진부(오대산)역", departureTime }]
  }));
  const stationReturn = [["alpensia-return-jinbu-1030", "10시 30분 진부역 귀가선", "10:30"], ["alpensia-return-jinbu-1340", "13시 40분 진부역 귀가선", "13:40"]].map(([id, name, departureTime]): SkiShuttleRoute => ({
    ...stationCommon,
    id,
    name,
    operationNote: `알펜시아 웰컴센터 ${departureTime} 출발`,
    directions: ["return"],
    returnTime: departureTime,
    returnService: { departureName: "알펜시아 웰컴센터 앞", departureTime, stopOrder: "same_stops", note: "KTX 진부(오대산)역행 무료 셔틀 · 도로·열차 상황에 따라 변경 가능" },
    stops: [{ id: `${id}-1`, city: "평창", name: "KTX 진부(오대산)역" }]
  }));
  return [...directRoutes, ...stationOutbound, ...stationReturn];
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
function yongpyongRoutes(): SkiShuttleRoute[] {
  const url = "https://skibus.purplebus.co.kr/Shop/YpSeason25/";
  const daysById: Record<string, string> = {
    "yongpyong-kd-sadang": "성수기·비수기·3월 3일부터 매일",
    "yongpyong-kd-sinchon": "성수기·비수기 매일 · 3월 3일부터 토·일",
    "yongpyong-kd-myeongdong": "성수기·비수기·3월 3일부터 매일",
    "yongpyong-kd-nowon": "성수기 매일 · 비수기 토·일",
    "yongpyong-kd-mokdong": "성수기 매일 · 비수기 토·일",
    "yongpyong-kd-sillim": "성수기 토·일",
    "yongpyong-kd-cheongnyangni": "성수기 토요일",
    "yongpyong-kd-bundang": "성수기 매일 · 비수기 토·일",
    "yongpyong-kd-anyang": "성수기 매일 · 비수기 토·일",
    "yongpyong-kd-ilsan": "성수기 매일 · 비수기 토·일",
    "yongpyong-kd-incheon": "성수기 매일 · 비수기 토·일",
    "yongpyong-kd-suwon": "성수기 매일 · 비수기 토·일"
  };
  const earlyRoutes = kdPyeongchangRoutes(yongpyong, "모나용평 드래곤프라자").map((route): SkiShuttleRoute => ({
    ...route,
    directions: ["outbound"],
    operationNote: daysById[route.id],
    priceLabel: "용평 교통시즌권 29만원",
    service: yongpyongService(daysById[route.id]),
    lastCheckedAt: yongpyongVivaldiCheckedAt
  }));
  const extraOutboundSpecs: [id: string, name: string, days: string, stops: StopInput[]][] = [
    ["yongpyong-kd-sadang-morning", "오전 사당·강남선", "성수기·비수기 매일", [["서울","사당역","09:00"],["서울","양재역","09:20"],["서울","도곡역","09:25"],["서울","대치역","09:30"],["서울","종합운동장","10:00"]]],
    ["yongpyong-kd-sinchon-morning", "오전 홍대·신촌선", "성수기·비수기 매일", [["서울","홍대입구","08:50"],["서울","신촌역","08:55"],["서울","광흥창역","09:00"],["서울","마포역","09:10"],["서울","종합운동장","10:00"]]],
    ["yongpyong-kd-myeongdong-morning", "오전 명동·강남선", "성수기·비수기·3월 3일부터 매일", [["서울","명동역","08:45"],["서울","동대문","08:55"],["서울","강남역","09:25"],["서울","종합운동장","10:00"]]],
    ["yongpyong-kd-nowon-morning", "오전 노원·광나루선", "성수기 토·일", [["서울","노원역","08:55"],["서울","석계역","09:05"],["서울","군자역","09:25"],["서울","광나루역","09:30"],["서울","종합운동장","10:00"]]],
    ["yongpyong-kd-afternoon", "오후 종합운동장선", "성수기 월~토 · 휘닉스 경유", [["서울","종합운동장","14:30"]]],
    ["yongpyong-kd-night", "야간 종합운동장선", "성수기 금요일 · 웰리힐리 또는 휘닉스 경유", [["서울","종합운동장","20:00"]]]
  ];
  const extraOutbound = extraOutboundSpecs.map(([id, name, days, stops]): SkiShuttleRoute => ({
    id, resortId: yongpyong, season: "25/26", operator: "대원관광", operatorPhone: "02-2201-7710", region: "서울", name, operationNote: days, arrivalName: "모나용평 드래곤프라자", directions: ["outbound"], priceLabel: "용평 교통시즌권 29만원", fare: { type: "season_pass", seasonPassAdult: 290000 }, service: yongpyongService(days), bookingUrl: url, sourceUrl: url, stops: stops.map(([city, stopName, departureTime], index) => ({ id: `${id}-${index + 1}`, city, name: stopName, departureTime })), dataStatus: "confirmed_25_26", lastCheckedAt: yongpyongVivaldiCheckedAt
  }));
  const returnSpecs: [id: string, region: string, name: string, departureTime: string, days: string, stops: [city: string, name: string][]][] = [
    ["yongpyong-return-1000-jamsil", "서울", "10시 잠실선", "10:00", "성수기 매일", [["서울","잠실역"],["서울","종합운동장역"]]],
    ["yongpyong-return-1300-central", "서울", "13시 도심선", "13:00", "성수기·비수기·3월 3일부터 매일", [["서울","잠실역"],["서울","종합운동장역"],["서울","명동역"],["서울","신촌역"]]],
    ["yongpyong-return-1300-sadang", "서울", "13시 사당선", "13:00", "성수기·비수기 토·일", [["서울","잠실역"],["서울","사당역"]]],
    ["yongpyong-return-1420-jamsil", "서울", "14시 20분 잠실선", "14:20", "성수기 토·일 · 웰리힐리 또는 휘닉스 경유", [["서울","잠실역"],["서울","종합운동장역"]]],
    ["yongpyong-return-1700-central", "서울", "17시 도심선", "17:00", "성수기·비수기·3월 3일부터 매일", [["서울","잠실역"],["서울","종합운동장역"],["서울","명동역"],["서울","신촌역"]]],
    ["yongpyong-return-1700-nowon", "서울", "17시 노원선", "17:00", "성수기 매일 · 비수기 토·일", [["서울","잠실역"],["서울","종합운동장역"],["서울","노원역"]]],
    ["yongpyong-return-1700-mokdong", "서울", "17시 사당·목동선", "17:00", "성수기 매일 · 비수기 토·일", [["서울","잠실역"],["서울","종합운동장역"],["서울","사당역"],["서울","목동역"]]],
    ["yongpyong-return-1700-sillim", "서울", "17시 신림선", "17:00", "성수기 토·일", [["서울","잠실역"],["서울","종합운동장역"],["서울","신림역"]]],
    ["yongpyong-return-1700-west-gyeonggi", "경기", "17시 서현·범계·송내선", "17:00", "성수기 매일 · 비수기 토·일", [["성남","서현역"],["안양","범계역"],["부천","송내역"]]],
    ["yongpyong-return-1700-south-gyeonggi", "경기", "17시 영통·백석선", "17:00", "성수기 매일 · 비수기 토·일", [["수원","영통"],["고양","백석역"]]]
  ];
  const returnRoutes = returnSpecs.map(([id, region, name, departureTime, days, stops]): SkiShuttleRoute => ({
    id, resortId: yongpyong, season: "25/26", operator: "대원관광", operatorPhone: "02-2201-7710", region, name, operationNote: `${days} · 25/26 귀가편`, arrivalName: "모나용평 드래곤프라자", directions: ["return"], returnTime: departureTime, returnService: { departureName: "모나용평 예약 화면 지정 승차지", departureTime, stopOrder: "same_stops", note: `${days} · 구정 연휴(2026-02-13~02-19)는 단축 운행 별도 공지` }, priceLabel: "용평 교통시즌권 29만원", fare: { type: "season_pass", seasonPassAdult: 290000 }, service: yongpyongService(days), bookingUrl: url, sourceUrl: url, stops: stops.map(([city, stopName], index) => ({ id: `${id}-${index + 1}`, city, name: stopName })), dataStatus: "confirmed_25_26", lastCheckedAt: yongpyongVivaldiCheckedAt
  }));
  return [...earlyRoutes, ...extraOutbound, ...returnRoutes];
}
function vivaldiRoutes(): SkiShuttleRoute[] {
  const domesticBookingUrl = "https://www.busline.co.kr/page/vivaldipark";
  const domesticSourceUrl = "https://vivaldipark.rideus.net/vivaldipark/page/1";
  const domesticOutboundSpecs: [id: string, name: string, schedule: string, stops: StopInput[]][] = [
    ["vivaldi-domestic-sinchon-early", "새벽 신촌·건대선", "새벽 노선", [["서울","신촌역","06:10"],["서울","광화문","06:30"],["서울","동대문역사문화공원역","06:40"],["서울","왕십리역","06:50"],["서울","건대입구역","07:05"]]],
    ["vivaldi-domestic-mokdong-early", "새벽 목동·여의도선", "새벽 노선", [["서울","목동역","06:10"],["서울","대림역","06:25"],["서울","영등포역","06:35"],["서울","여의도역","06:45"]]],
    ["vivaldi-domestic-sadang-early", "새벽 서울대·압구정선", "새벽 노선", [["서울","서울대입구역","06:10"],["서울","사당역","06:30"],["서울","반포","06:45"],["서울","압구정","06:55"]]],
    ["vivaldi-domestic-sinchon-morning", "오전 신촌·건대선", "오전 노선", [["서울","신촌역","08:00"],["서울","광화문","08:30"],["서울","동대문역사문화공원역","08:50"],["서울","건대입구역","09:20"]]],
    ["vivaldi-domestic-sinchon-late-morning", "오전 신촌·광나루선", "오전 노선", [["서울","신촌역","09:20"],["서울","광화문","09:40"],["서울","군자역","10:10"],["서울","광나루역","10:20"]]],
    ["vivaldi-domestic-nowon-morning", "오전 노원·구리선", "오전 노선", [["서울","노원역","07:50"],["서울","태릉입구역","08:20"],["구리","구리","08:50"]]],
    ["vivaldi-domestic-jamsil-afternoon", "오후 종합운동장선", "야간 스키 운영일 오후 노선", [["서울","종합운동장역","15:00"]]],
    ["vivaldi-domestic-sinchon-afternoon", "오후 신촌선", "야간 스키 운영일 오후 노선", [["서울","신촌역","16:30"]]],
    ["vivaldi-domestic-sadang-afternoon", "오후 사당선", "야간 스키 운영일 오후 노선", [["서울","사당역","15:30"]]],
    ["vivaldi-domestic-nowon-afternoon", "오후 노원선", "야간 스키 운영일 오후 노선", [["서울","노원역","15:30"]]],
    ["vivaldi-domestic-sinchon-night", "야간 신촌·광화문선", "야간 스키 운영일", [["서울","신촌역","19:00"],["서울","광화문","19:30"]]],
    ["vivaldi-domestic-mokdong-night", "야간 목동선", "야간 스키 운영일", [["서울","목동역","19:30"]]],
    ["vivaldi-domestic-nowon-night", "야간 노원선", "야간 스키 운영일", [["서울","노원역","19:30"]]],
    ["vivaldi-domestic-sinchon-overnight", "밤샘 신촌·광화문선", "밤샘 스키 운영일", [["서울","신촌역","21:00"],["서울","광화문","21:30"]]],
    ["vivaldi-domestic-dongdaemun-overnight", "밤샘 동대문·건대선", "밤샘 스키 운영일", [["서울","동대문역사문화공원역","21:00"],["서울","건대입구역","21:30"]]],
    ["vivaldi-domestic-mokdong-overnight", "밤샘 목동·여의도선", "밤샘 스키 운영일", [["서울","목동역","20:40"],["서울","여의도역","21:10"]]]
  ];
  const domesticOutbound = domesticOutboundSpecs.map(([id, name, schedule, stops]): SkiShuttleRoute => ({
    id, resortId: vivaldi, season: "25/26", operator: "라이더스(그레이스트래블)", operatorPhone: "033-439-7695", region: "서울", name, operationNote: `25/26 ${schedule} · 예약 인원이 없으면 미운행`, arrivalName: "비발디파크", directions: ["outbound"], fare: { type: "unknown", note: "국내 노선 요금은 예약 화면에서 확인" }, service: vivaldiDomesticService(schedule), bookingUrl: domesticBookingUrl, sourceUrl: domesticSourceUrl, stops: stops.map(([city, stopName, departureTime], index) => ({ id: `${id}-${index + 1}`, city, name: stopName, departureTime })), dataStatus: "confirmed_25_26", lastCheckedAt: yongpyongVivaldiCheckedAt
  }));
  const domesticReturnSpecs: [id: string, name: string, departureTime: string, schedule: string, stops: [city: string, name: string][]][] = [
    ["vivaldi-domestic-return-0830-jamsil", "08시 30분 종합운동장행", "08:30", "오전 귀가편", [["서울","종합운동장역"]]],
    ["vivaldi-domestic-return-1300-jamsil", "13시 종합운동장행", "13:00", "오후 귀가편", [["서울","종합운동장역"]]],
    ["vivaldi-domestic-return-1300-sinchon", "13시 신촌행", "13:00", "오후 귀가편", [["서울","신촌역"]]],
    ["vivaldi-domestic-return-1300-sadang", "13시 사당행", "13:00", "오후 귀가편", [["서울","사당역"]]],
    ["vivaldi-domestic-return-1300-nowon", "13시 노원행", "13:00", "오후 귀가편", [["서울","노원역"]]],
    ["vivaldi-domestic-return-1730-jamsil", "17시 30분 종합운동장행", "17:30", "저녁 귀가편", [["서울","종합운동장역"]]],
    ["vivaldi-domestic-return-1730-sinchon", "17시 30분 신촌행", "17:30", "저녁 귀가편", [["서울","신촌역"]]],
    ["vivaldi-domestic-return-1730-sadang", "17시 30분 사당행", "17:30", "저녁 귀가편", [["서울","사당역"]]],
    ["vivaldi-domestic-return-1730-nowon", "17시 30분 노원행", "17:30", "저녁 귀가편", [["서울","노원역"]]],
    ["vivaldi-domestic-return-2230-sinchon", "22시 30분 신촌행", "22:30", "야간 스키 운영일", [["서울","신촌역"]]],
    ["vivaldi-domestic-return-2230-jamsil", "22시 30분 잠실행", "22:30", "야간 스키 운영일", [["서울","잠실역"]]],
    ["vivaldi-domestic-return-0530-sinchon", "05시 30분 신촌행", "05:30", "밤샘 스키 운영일", [["서울","신촌역"]]],
    ["vivaldi-domestic-return-0530-jamsil", "05시 30분 잠실행", "05:30", "밤샘 스키 운영일", [["서울","잠실역"]]],
    ["vivaldi-domestic-return-0100", "01시 잠실행", "01:00", "심야 스키 운영일", [["서울","잠실역"]]],
    ["vivaldi-domestic-return-0300", "03시 잠실행", "03:00", "심야 스키 운영일", [["서울","잠실역"]]]
  ];
  const domesticReturn = domesticReturnSpecs.map(([id, name, departureTime, schedule, stops]): SkiShuttleRoute => ({
    id, resortId: vivaldi, season: "25/26", operator: "라이더스(그레이스트래블)", operatorPhone: "033-439-7695", region: "서울", name, operationNote: `25/26 ${schedule} · 예약 인원이 없으면 미운행`, arrivalName: "비발디파크", directions: ["return"], returnTime: departureTime, returnService: { departureName: "비발디파크 버스주차장", departureTime, stopOrder: "same_stops", note: `${schedule} · 실제 하차 노선은 예약 화면에서 재확인` }, fare: { type: "unknown", note: "국내 노선 요금은 예약 화면에서 확인" }, service: vivaldiDomesticService(schedule), bookingUrl: domesticBookingUrl, sourceUrl: domesticSourceUrl, stops: stops.map(([city, stopName], index) => ({ id: `${id}-${index + 1}`, city, name: stopName })), dataStatus: "confirmed_25_26", lastCheckedAt: yongpyongVivaldiCheckedAt
  }));

  const foreignBookingUrl = "https://vivabus.net/";
  const foreignSourceUrl = "https://vivabus.net/en/vivabus/page/vivaldi-timetable";
  const foreignOutboundSpecs: [id: string, name: string, period: string, stops: StopInput[]][] = [
    ["vivaldi-hongdae", "외국인 전용 06시 30분 홍대선", "2025-12-05 ~ 2026-03-02", [["서울","홍대입구역","06:30"],["서울","동대문역사문화공원역","07:00"],["서울","건대입구역","07:20"]]],
    ["vivaldi-foreign-hongdae-0900", "외국인 전용 09시 홍대선", "2025-12-06 ~ 2026-02-15", [["서울","홍대입구역","09:00"],["서울","건대입구역","10:00"]]],
    ["vivaldi-jamsil", "외국인 전용 07시 20분 종합운동장선", "2025-12-05 ~ 2026-03-02", [["서울","종합운동장역","07:20"]]],
    ["vivaldi-foreign-jamsil-1030", "외국인 전용 10시 30분 종합운동장선", "2025-12-06 ~ 2026-02-15", [["서울","종합운동장역","10:30"]]]
  ];
  const foreignOutbound = foreignOutboundSpecs.map(([id, name, period, stops]): SkiShuttleRoute => ({
    id, resortId: vivaldi, season: "25/26", operator: "대명투어", operatorPhone: "031-765-7965", region: "서울", name, operationNote: `${period} · 외국인 전용 유료 셔틀`, arrivalName: "비발디파크", directions: ["outbound"], priceLabel: "외국인 전용 편도 1만원 · 왕복 2만원", fare: { type: "single_ride", oneWayAdult: 10000, roundTripAdult: 20000, note: "외국인 전용 서비스 수수료 포함" }, service: vivaldiForeignService(period), bookingUrl: foreignBookingUrl, sourceUrl: foreignSourceUrl, stops: stops.map(([city, stopName, departureTime], index) => ({ id: `${id}-${index + 1}`, city, name: stopName, departureTime })), dataStatus: "confirmed_25_26", lastCheckedAt: yongpyongVivaldiCheckedAt
  }));
  const foreignReturnSpecs: [id: string, name: string, departureTime: string, period: string, stops: [city: string, name: string][]][] = [
    ["vivaldi-foreign-return-1300-jamsil", "외국인 전용 13시 종합운동장행", "13:00", "2025-12-05 ~ 2026-03-02", [["서울","종합운동장역"]]],
    ["vivaldi-foreign-return-1300-hongdae", "외국인 전용 13시 홍대행", "13:00", "2025-12-25 ~ 2026-02-15", [["서울","홍대입구역"]]],
    ["vivaldi-foreign-return-1700-jamsil", "외국인 전용 17시 종합운동장행", "17:00", "2025-12-05 ~ 2026-03-02", [["서울","종합운동장역"]]],
    ["vivaldi-foreign-return-1700-hongdae", "외국인 전용 17시 홍대행", "17:00", "2025-12-05 ~ 2026-03-02", [["서울","건대입구역"],["서울","동대문역사문화공원역"],["서울","홍대입구역"]]]
  ];
  const foreignReturn = foreignReturnSpecs.map(([id, name, departureTime, period, stops]): SkiShuttleRoute => ({
    id, resortId: vivaldi, season: "25/26", operator: "대명투어", operatorPhone: "031-765-7965", region: "서울", name, operationNote: `${period} · 외국인 전용 유료 셔틀`, arrivalName: "비발디파크", directions: ["return"], returnTime: departureTime, returnService: { departureName: "비발디파크 외국인 셔틀 승차장", departureTime, stopOrder: "same_stops", note: `${period} · 하차 위치는 교통 상황에 따라 변경 가능` }, priceLabel: "외국인 전용 편도 1만원 · 왕복 2만원", fare: { type: "single_ride", oneWayAdult: 10000, roundTripAdult: 20000, note: "외국인 전용 서비스 수수료 포함" }, service: vivaldiForeignService(period), bookingUrl: foreignBookingUrl, sourceUrl: foreignSourceUrl, stops: stops.map(([city, stopName], index) => ({ id: `${id}-${index + 1}`, city, name: stopName })), dataStatus: "confirmed_25_26", lastCheckedAt: yongpyongVivaldiCheckedAt
  }));
  return [...domesticOutbound, ...domesticReturn, ...foreignOutbound, ...foreignReturn];
}

function kdService(): NonNullable<SkiShuttleRoute["service"]> {
  return { period: "스키장 개장 주말 ~ 2026-03-02", days: "노선별 매일 또는 주말", bookingRequirement: "대원관광 홈페이지 사전 예약 · 전화 예약 불가" };
}

function wellihilliService(days: string): NonNullable<SkiShuttleRoute["service"]> {
  return { period: "2025-12-01 ~ 2026-03-02 · 일부 노선 3월 이후", days, bookingRequirement: "대원관광 홈페이지 사전 예약 · 구정 연휴 단축 운행 별도 공지 · 전화 예약 불가" };
}

function phoenixService(days: string): NonNullable<SkiShuttleRoute["service"]> {
  return { period: "2025-12-01 ~ 2026-03-02 · 일부 노선 3월 이후", days, bookingRequirement: "대원관광 홈페이지 사전 예약 · 구정 연휴 단축 운행 별도 공지 · 전화 예약 불가" };
}

function yongpyongService(days: string): NonNullable<SkiShuttleRoute["service"]> {
  return { period: "2025-12-01 ~ 2026-03-02 · 일부 노선 3월 이후", days, bookingRequirement: "대원관광 홈페이지 사전 예약 · 구정 연휴 단축 운행 별도 공지 · 전화 예약 불가" };
}

function vivaldiDomesticService(days: string): NonNullable<SkiShuttleRoute["service"]> {
  return { period: "25/26 동계 스키 시즌", days, reservationDeadline: "이용 전일 16:30", bookingRequirement: "선착순 사전 예약 · 예약자가 없는 탑승지는 미운행 · 야간/밤샘편은 해당 스키 운영일만 운행" };
}

function vivaldiForeignService(period: string): NonNullable<SkiShuttleRoute["service"]> {
  return { period, days: "예약 캘린더 기준", bookingRequirement: "외국인 전용 유료 셔틀 · 사전 예약 · 취소는 탑승 전일 16:00 이전" };
}

function high1RouteDetails(id: string): Pick<SkiShuttleRoute, "fare" | "service"> {
  if (id.startsWith("kd-")) return { fare: { type: "season_pass", seasonPassAdult: 300000 }, service: kdService() };
  if (id.startsWith("osung-")) return { fare: { type: "single_ride", oneWayAdult: 38000, roundTripAdult: 45000, note: "45석 일반버스 성인 기준" }, service: { period: "2025-12-24 ~ 2026-02-28 지정 운행일", days: id.endsWith("-1") ? "평일·주말" : "주말", reservationDeadline: "출발 1일 전 15:00 · 휴일 12:00", bookingRequirement: "15시 이후 잔여석 전화 예약", minimumPassengers: 10 } };
  if (id === "eunsung-busan") return { fare: { type: "single_ride", note: "45인승 6만원부터 · 우등리무진 8만원부터 · 왕복/편도 옵션별 예약 화면 확인" }, service: { days: "의무운행일", bookingRequirement: "운영사 사전 예약 · 왕복 또는 편도 선택" } };
  if (id === "daewon-honam") return { fare: { type: "tour_package", oneWayAdult: 50000, roundTripAdult: 80000, note: "대전 출발 기준 최저가 · 전주·광주는 선택한 하차지별 요금 적용" }, service: { days: "토·일·공휴일", reservationDeadline: "출발 3일 전 15:00", minimumPassengers: 12, bookingRequirement: "최소 인원 미달 시 취소·전액 환불" } };
  return { fare: { type: "unknown" }, service: { bookingRequirement: "운영사에 세부 조건 재확인" } };
}
