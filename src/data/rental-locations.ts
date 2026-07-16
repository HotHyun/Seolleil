import type { RentalShop } from "@/lib/types";

export type RentalLocationRecord = Pick<RentalShop, "latitude" | "longitude" | "kakaoPlaceId" | "locationSource" | "locationCheckedAt"> & {
  kakaoMapUrl: string;
  address: string;
};

// Generated from Kakao Places candidates. Re-run pnpm data:locations after reviewing reports/rental-location-candidates.json.
export const rentalLocationRecords = {
  "konjiam-brothers": {
    "latitude": 37.3345021838233,
    "longitude": 127.314296879445,
    "kakaoPlaceId": "296556681",
    "kakaoMapUrl": "https://place.map.kakao.com/296556681",
    "address": "경기 광주시 도척면 도척윗로 258",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "konjiam-skibucks": {
    "latitude": 37.3336272830001,
    "longitude": 127.31191458215,
    "kakaoPlaceId": "1482887869",
    "kakaoMapUrl": "https://place.map.kakao.com/1482887869",
    "address": "경기 광주시 도척면 도척윗로 283",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "konjiam-ganjiboarder": {
    "latitude": 37.338015668382674,
    "longitude": 127.3055535516756,
    "kakaoPlaceId": "15736488",
    "kakaoMapUrl": "https://place.map.kakao.com/15736488",
    "address": "경기 광주시 도척면 독고개길 318",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "konjiam-coconut": {
    "latitude": 37.3394350154282,
    "longitude": 127.304416151354,
    "kakaoPlaceId": "329260199",
    "kakaoMapUrl": "https://place.map.kakao.com/329260199",
    "address": "경기 광주시 도척면 독고개길302번길 2",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "konjiam-wski": {
    "latitude": 37.3385269389713,
    "longitude": 127.323374103421,
    "kakaoPlaceId": "12747448",
    "kakaoMapUrl": "https://place.map.kakao.com/12747448",
    "address": "경기 광주시 도척면 도척윗로 166",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "konjiam-youthski": {
    "latitude": 37.33483613446207,
    "longitude": 127.31543683744057,
    "kakaoPlaceId": "974030056",
    "kakaoMapUrl": "https://place.map.kakao.com/974030056",
    "address": "경기 광주시 도척면 도척윗로 248",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "konjiam-iwon": {
    "latitude": 37.34057527012618,
    "longitude": 127.32947112406318,
    "kakaoPlaceId": "11701454",
    "kakaoMapUrl": "https://place.map.kakao.com/11701454",
    "address": "경기 광주시 도척면 도척윗로 102",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "konjiam-vski": {
    "latitude": 37.336241642019,
    "longitude": 127.318164492539,
    "kakaoPlaceId": "22810510",
    "kakaoMapUrl": "https://place.map.kakao.com/22810510",
    "address": "경기 광주시 도척면 도척윗로 218",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "konjiam-joy": {
    "latitude": 37.3349967216579,
    "longitude": 127.316035567993,
    "kakaoPlaceId": "1417303275",
    "kakaoMapUrl": "https://place.map.kakao.com/1417303275",
    "address": "경기 광주시 도척면 도척윗로 242",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "jisan-yg-leports": {
    "latitude": 37.2153877730958,
    "longitude": 127.353620510291,
    "kakaoPlaceId": "1615247451",
    "kakaoMapUrl": "https://place.map.kakao.com/1615247451",
    "address": "경기 이천시 마장면 지산로 210",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "jisan-boss": {
    "latitude": 37.2159613090761,
    "longitude": 127.35103868255153,
    "kakaoPlaceId": "484393835",
    "kakaoMapUrl": "https://place.map.kakao.com/484393835",
    "address": "경기 이천시 마장면 지산로 234",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "jisan-boardbox": {
    "latitude": 37.2160702473592,
    "longitude": 127.350764287537,
    "kakaoPlaceId": "15619605",
    "kakaoMapUrl": "https://place.map.kakao.com/15619605",
    "address": "경기 이천시 마장면 지산로 236",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "jisan-camp": {
    "latitude": 37.21642333260071,
    "longitude": 127.34836391787947,
    "kakaoPlaceId": "14560262",
    "kakaoMapUrl": "https://place.map.kakao.com/14560262",
    "address": "경기 이천시 마장면 지산로 257-7",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "jisan-rshop": {
    "latitude": 37.2139679626755,
    "longitude": 127.360713760683,
    "kakaoPlaceId": "18533118",
    "kakaoMapUrl": "https://place.map.kakao.com/18533118",
    "address": "경기 이천시 마장면 지산로 138",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "jisan-youthski": {
    "latitude": 37.213843347264,
    "longitude": 127.360210701594,
    "kakaoPlaceId": "755818684",
    "kakaoMapUrl": "https://place.map.kakao.com/755818684",
    "address": "경기 이천시 마장면 지산로 142",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "jisan-season-company": {
    "latitude": 37.2155754948554,
    "longitude": 127.35230886136513,
    "kakaoPlaceId": "1664228177",
    "kakaoMapUrl": "https://place.map.kakao.com/1664228177",
    "address": "경기 이천시 마장면 지산로 222",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "vivaldi-vision": {
    "latitude": 37.61477276221917,
    "longitude": 127.67373087058475,
    "kakaoPlaceId": "552972150",
    "kakaoMapUrl": "https://place.map.kakao.com/552972150",
    "address": "강원특별자치도 홍천군 서면 한서로 2166",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "elysian-leisure-friend": {
    "latitude": 37.8417713299175,
    "longitude": 127.551612674602,
    "kakaoPlaceId": "671515395",
    "kakaoMapUrl": "https://place.map.kakao.com/671515395",
    "address": "강원특별자치도 춘천시 남산면 서백길 72",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "elysian-star": {
    "latitude": 37.8125934784353,
    "longitude": 127.634269398437,
    "kakaoPlaceId": "1964597946",
    "kakaoMapUrl": "https://place.map.kakao.com/1964597946",
    "address": "강원특별자치도 춘천시 남산면 강촌로 72",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "elysian-vision": {
    "latitude": 37.8277879459529,
    "longitude": 127.611602660985,
    "kakaoPlaceId": "957018522",
    "kakaoMapUrl": "https://place.map.kakao.com/957018522",
    "address": "강원특별자치도 춘천시 남산면 북한강변길 906",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "elysian-canada": {
    "latitude": 37.8116986887429,
    "longitude": 127.635634703457,
    "kakaoPlaceId": "949047",
    "kakaoMapUrl": "https://place.map.kakao.com/949047",
    "address": "강원특별자치도 춘천시 남산면 강촌로 87",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "elysian-mc-snow": {
    "latitude": 37.8315914051247,
    "longitude": 127.5573868881,
    "kakaoPlaceId": "811562507",
    "kakaoMapUrl": "https://place.map.kakao.com/811562507",
    "address": "강원특별자치도 춘천시 남산면 서백길 200",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "elysian-winter-and-ski": {
    "latitude": 37.840645233995055,
    "longitude": 127.55178719399488,
    "kakaoPlaceId": "672714706",
    "kakaoMapUrl": "https://place.map.kakao.com/672714706",
    "address": "강원특별자치도 춘천시 남산면 서백길 86-4",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "elysian-mobydic": {
    "latitude": 37.84307076207251,
    "longitude": 127.54808112497338,
    "kakaoPlaceId": "2071071494",
    "kakaoMapUrl": "https://place.map.kakao.com/2071071494",
    "address": "강원특별자치도 춘천시 남산면 서백길 37",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "oakvalley-advance": {
    "latitude": 37.4063893757685,
    "longitude": 127.801820913004,
    "kakaoPlaceId": "12633226",
    "kakaoMapUrl": "https://place.map.kakao.com/12633226",
    "address": "강원특별자치도 원주시 지정면 구재로 264",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "oakvalley-ski1004": {
    "latitude": 37.398799816890204,
    "longitude": 127.79186166374359,
    "kakaoPlaceId": "11494407",
    "kakaoMapUrl": "https://place.map.kakao.com/11494407",
    "address": "강원특별자치도 원주시 지정면 구재로 132",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "oakvalley-mongski": {
    "latitude": 37.4079371257252,
    "longitude": 127.802641599551,
    "kakaoPlaceId": "12777214",
    "kakaoMapUrl": "https://place.map.kakao.com/12777214",
    "address": "강원특별자치도 원주시 지정면 구재로 282",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "oakvalley-better-ski": {
    "latitude": 37.4102858830808,
    "longitude": 127.805179834544,
    "kakaoPlaceId": "661518273",
    "kakaoMapUrl": "https://place.map.kakao.com/661518273",
    "address": "강원특별자치도 원주시 지정면 오크밸리2길 15",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "oakvalley-maru": {
    "latitude": 37.410269789394604,
    "longitude": 127.8051615900163,
    "kakaoPlaceId": "1323627821",
    "kakaoMapUrl": "https://place.map.kakao.com/1323627821",
    "address": "강원특별자치도 원주시 지정면 오크밸리2길 15",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "wellihilli-w-ski": {
    "latitude": 37.5056135153243,
    "longitude": 128.227958295098,
    "kakaoPlaceId": "21291997",
    "kakaoMapUrl": "https://place.map.kakao.com/21291997",
    "address": "강원특별자치도 횡성군 둔내면 고원로 265",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "wellihilli-ski911": {
    "latitude": 37.511326953993,
    "longitude": 128.2243512738,
    "kakaoPlaceId": "25892368",
    "kakaoMapUrl": "https://place.map.kakao.com/25892368",
    "address": "강원특별자치도 횡성군 둔내면 고원로 162",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "wellihilli-dreamworld": {
    "latitude": 37.4981900195352,
    "longitude": 128.238968307358,
    "kakaoPlaceId": "15454720",
    "kakaoMapUrl": "https://place.map.kakao.com/15454720",
    "address": "강원특별자치도 횡성군 둔내면 고원로 397",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "wellihilli-rocky": {
    "latitude": 37.4987002984205,
    "longitude": 128.238420382096,
    "kakaoPlaceId": "11780935",
    "kakaoMapUrl": "https://place.map.kakao.com/11780935",
    "address": "강원특별자치도 횡성군 둔내면 고원로 389",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "wellihilli-worldski": {
    "latitude": 37.5101207188767,
    "longitude": 128.219025001753,
    "kakaoPlaceId": "11543318",
    "kakaoMapUrl": "https://place.map.kakao.com/11543318",
    "address": "강원특별자치도 횡성군 둔내면 고원로 112",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "wellihilli-friends": {
    "latitude": 37.49848922773386,
    "longitude": 128.23801432946334,
    "kakaoPlaceId": "8546740",
    "kakaoMapUrl": "https://place.map.kakao.com/8546740",
    "address": "강원특별자치도 횡성군 둔내면 고원로 390",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "wellihilli-baekya": {
    "latitude": 37.49674790917071,
    "longitude": 128.2405694064513,
    "kakaoPlaceId": "1781185973",
    "kakaoMapUrl": "https://place.map.kakao.com/1781185973",
    "address": "강원특별자치도 횡성군 둔내면 고원로412번길 1-8",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "vivaldi-jamesboard": {
    "latitude": 37.6950858655795,
    "longitude": 127.70289345106167,
    "kakaoPlaceId": "18489600",
    "kakaoMapUrl": "https://place.map.kakao.com/18489600",
    "address": "강원특별자치도 홍천군 서면 한치골길 972",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "vivaldi-tomato": {
    "latitude": 37.6649454757832,
    "longitude": 127.694312833819,
    "kakaoPlaceId": "27447339",
    "kakaoMapUrl": "https://place.map.kakao.com/27447339",
    "address": "강원특별자치도 홍천군 서면 한치골길 602",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "vivaldi-smile": {
    "latitude": 37.69840576182738,
    "longitude": 127.70064569352081,
    "kakaoPlaceId": "218851364",
    "kakaoMapUrl": "https://place.map.kakao.com/218851364",
    "address": "강원특별자치도 홍천군 서면 한치골길 1023",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "vivaldi-jjijjippong": {
    "latitude": 37.6142642096885,
    "longitude": 127.675062755084,
    "kakaoPlaceId": "837471402",
    "kakaoMapUrl": "https://place.map.kakao.com/837471402",
    "address": "강원특별자치도 홍천군 서면 한서로 2177",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "vivaldi-boardyoon": {
    "latitude": 37.69814861942648,
    "longitude": 127.70237357073371,
    "kakaoPlaceId": "1482650162",
    "kakaoMapUrl": "https://place.map.kakao.com/1482650162",
    "address": "강원특별자치도 홍천군 서면 한치골길 1004",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "phoenix-torres": {
    "latitude": 37.57347904105491,
    "longitude": 128.34231837768053,
    "kakaoPlaceId": "647438602",
    "kakaoMapUrl": "https://place.map.kakao.com/647438602",
    "address": "강원특별자치도 평창군 봉평면 태기로 353",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "phoenix-snowland": {
    "latitude": 37.58459265559814,
    "longitude": 128.32704559794004,
    "kakaoPlaceId": "9844234",
    "kakaoMapUrl": "https://place.map.kakao.com/9844234",
    "address": "강원특별자치도 평창군 봉평면 태기로 155",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "phoenix-snowlab": {
    "latitude": 37.5782438921484,
    "longitude": 128.338128368188,
    "kakaoPlaceId": "193327540",
    "kakaoMapUrl": "https://place.map.kakao.com/193327540",
    "address": "강원특별자치도 평창군 봉평면 태기로 283-2",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "phoenix-feelgood": {
    "latitude": 37.5850786531207,
    "longitude": 128.325888160107,
    "kakaoPlaceId": "788331827",
    "kakaoMapUrl": "https://place.map.kakao.com/788331827",
    "address": "강원특별자치도 평창군 봉평면 태기로 141",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "phoenix-kkookine": {
    "latitude": 37.5785091219702,
    "longitude": 128.337699558537,
    "kakaoPlaceId": "434003423",
    "kakaoMapUrl": "https://place.map.kakao.com/434003423",
    "address": "강원특별자치도 평창군 봉평면 태기로 279",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "phoenix-junski": {
    "latitude": 37.5846090062282,
    "longitude": 128.327113814035,
    "kakaoPlaceId": "14850879",
    "kakaoMapUrl": "https://place.map.kakao.com/14850879",
    "address": "강원특별자치도 평창군 봉평면 태기로 155",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "phoenix-jetski": {
    "latitude": 37.5849591807344,
    "longitude": 128.32641812859,
    "kakaoPlaceId": "14711098",
    "kakaoMapUrl": "https://place.map.kakao.com/14711098",
    "address": "강원특별자치도 평창군 봉평면 태기로 151",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "phoenix-baekya": {
    "latitude": 37.56392297730669,
    "longitude": 128.35343298471693,
    "kakaoPlaceId": "22017290",
    "kakaoMapUrl": "https://place.map.kakao.com/22017290",
    "address": "강원특별자치도 평창군 봉평면 태기로 523",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "yongpyong-beaver": {
    "latitude": 37.6640598059589,
    "longitude": 128.663850507224,
    "kakaoPlaceId": "788980690",
    "kakaoMapUrl": "https://place.map.kakao.com/788980690",
    "address": "강원특별자치도 평창군 대관령면 솔봉로 278-14",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "alpensia-point-ski": {
    "latitude": 37.677756203929235,
    "longitude": 128.69995574830742,
    "kakaoPlaceId": "14558342",
    "kakaoMapUrl": "https://place.map.kakao.com/14558342",
    "address": "강원특별자치도 평창군 대관령면 올림픽로 12",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "alpensia-ski911": {
    "latitude": 37.6778618823469,
    "longitude": 128.699936624474,
    "kakaoPlaceId": "22247815",
    "kakaoMapUrl": "https://place.map.kakao.com/22247815",
    "address": "강원특별자치도 평창군 대관령면 올림픽로 10",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "alpensia-discovery": {
    "latitude": 37.67686273123023,
    "longitude": 128.70000449693688,
    "kakaoPlaceId": "1351485555",
    "kakaoMapUrl": "https://place.map.kakao.com/1351485555",
    "address": "강원특별자치도 평창군 대관령면 올림픽로 22",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "alpensia-kind-ski": {
    "latitude": 37.667638470023626,
    "longitude": 128.66395308277927,
    "kakaoPlaceId": "213056230",
    "kakaoMapUrl": "https://place.map.kakao.com/213056230",
    "address": "강원특별자치도 평창군 대관령면 솔봉로 236-3",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "alpensia-tatata": {
    "latitude": 37.66199027878831,
    "longitude": 128.69824298914082,
    "kakaoPlaceId": "942477183",
    "kakaoMapUrl": "https://place.map.kakao.com/942477183",
    "address": "강원특별자치도 평창군 대관령면 삼현동1길 10-4",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "alpensia-beaver": {
    "latitude": 37.6640598059589,
    "longitude": 128.663850507224,
    "kakaoPlaceId": "788980690",
    "kakaoMapUrl": "https://place.map.kakao.com/788980690",
    "address": "강원특별자치도 평창군 대관령면 솔봉로 278-14",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "alpensia-ski-zone": {
    "latitude": 37.6658644821877,
    "longitude": 128.70987146939132,
    "kakaoPlaceId": "16480044",
    "kakaoMapUrl": "https://place.map.kakao.com/16480044",
    "address": "강원특별자치도 평창군 대관령면 올림픽로 193",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "alpensia-korea-leisure": {
    "latitude": 37.6651562622929,
    "longitude": 128.705152153865,
    "kakaoPlaceId": "1128014100",
    "kakaoMapUrl": "https://place.map.kakao.com/1128014100",
    "address": "강원특별자치도 평창군 대관령면 올림픽로 234",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "yongpyong-tatata": {
    "latitude": 37.66199027878831,
    "longitude": 128.69824298914082,
    "kakaoPlaceId": "942477183",
    "kakaoMapUrl": "https://place.map.kakao.com/942477183",
    "address": "강원특별자치도 평창군 대관령면 삼현동1길 10-4",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "yongpyong-ski-zone": {
    "latitude": 37.6658644821877,
    "longitude": 128.70987146939132,
    "kakaoPlaceId": "16480044",
    "kakaoMapUrl": "https://place.map.kakao.com/16480044",
    "address": "강원특별자치도 평창군 대관령면 올림픽로 193",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "yongpyong-korea-leisure": {
    "latitude": 37.6651562622929,
    "longitude": 128.705152153865,
    "kakaoPlaceId": "1128014100",
    "kakaoMapUrl": "https://place.map.kakao.com/1128014100",
    "address": "강원특별자치도 평창군 대관령면 올림픽로 234",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "yongpyong-rainbow": {
    "latitude": 37.66493825847477,
    "longitude": 128.704029765405,
    "kakaoPlaceId": "12538218",
    "kakaoMapUrl": "https://place.map.kakao.com/12538218",
    "address": "강원특별자치도 평창군 대관령면 올림픽로 246",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "yongpyong-point-ski": {
    "latitude": 37.677756203929235,
    "longitude": 128.69995574830742,
    "kakaoPlaceId": "14558342",
    "kakaoMapUrl": "https://place.map.kakao.com/14558342",
    "address": "강원특별자치도 평창군 대관령면 올림픽로 12",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "muju-arirang": {
    "latitude": 35.910593752322846,
    "longitude": 127.75919241578028,
    "kakaoPlaceId": "12646235",
    "kakaoMapUrl": "https://place.map.kakao.com/12646235",
    "address": "전북특별자치도 무주군 설천면 만선로 3",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "muju-snowpark": {
    "latitude": 35.904726761586545,
    "longitude": 127.75548196236979,
    "kakaoPlaceId": "1222477174",
    "kakaoMapUrl": "https://place.map.kakao.com/1222477174",
    "address": "전북특별자치도 무주군 설천면 만선1로 60",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "muju-hyundai": {
    "latitude": 35.9108211143774,
    "longitude": 127.757153988201,
    "kakaoPlaceId": "11575189",
    "kakaoMapUrl": "https://place.map.kakao.com/11575189",
    "address": "전북특별자치도 무주군 설천면 만선로 22",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "muju-skilife": {
    "latitude": 35.9100729817637,
    "longitude": 127.755742160504,
    "kakaoPlaceId": "10542376",
    "kakaoMapUrl": "https://place.map.kakao.com/10542376",
    "address": "전북특별자치도 무주군 설천면 만선로 36-2",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "muju-skiworld": {
    "latitude": 35.9059181820422,
    "longitude": 127.755338202259,
    "kakaoPlaceId": "591839720",
    "kakaoMapUrl": "https://place.map.kakao.com/591839720",
    "address": "전북특별자치도 무주군 설천면 만선로 82",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "muju-mentor": {
    "latitude": 35.90974943427584,
    "longitude": 127.75574351474957,
    "kakaoPlaceId": "26397062",
    "kakaoMapUrl": "https://place.map.kakao.com/26397062",
    "address": "전북특별자치도 무주군 설천면 만선로 38",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "muju-silkroad": {
    "latitude": 35.90793976678459,
    "longitude": 127.75560223440625,
    "kakaoPlaceId": "7875736",
    "kakaoMapUrl": "https://place.map.kakao.com/7875736",
    "address": "전북특별자치도 무주군 설천면 만선로 57",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "edenvalley-jjeombbang": {
    "latitude": 35.407582571161406,
    "longitude": 129.00327873860684,
    "kakaoPlaceId": "11686928",
    "kakaoMapUrl": "https://place.map.kakao.com/11686928",
    "address": "경남 양산시 어실로 608",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "yongpyong-drsnow": {
    "latitude": 37.6737568881043,
    "longitude": 128.700477648787,
    "kakaoPlaceId": "11597372",
    "kakaoMapUrl": "https://place.map.kakao.com/11597372",
    "address": "강원특별자치도 평창군 대관령면 올림픽로 56",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "high1-ski-no1": {
    "latitude": 37.2081623853477,
    "longitude": 128.842449466005,
    "kakaoPlaceId": "693521035",
    "kakaoMapUrl": "https://place.map.kakao.com/693521035",
    "address": "강원특별자치도 정선군 고한읍 고한로 28-5",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "high1-myski": {
    "latitude": 37.2079482246436,
    "longitude": 128.843185406068,
    "kakaoPlaceId": "2094359759",
    "kakaoMapUrl": "https://place.map.kakao.com/2094359759",
    "address": "강원특별자치도 정선군 고한읍 고한로 36-2",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "high1-noonnara": {
    "latitude": 37.22324859731984,
    "longitude": 128.81525321489224,
    "kakaoPlaceId": "21692745",
    "kakaoMapUrl": "https://place.map.kakao.com/21692745",
    "address": "강원특별자치도 정선군 사북읍 하이원길 36",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "high1-donggang-explorer": {
    "latitude": 37.2135211700525,
    "longitude": 128.834494157952,
    "kakaoPlaceId": "26203817",
    "kakaoMapUrl": "https://place.map.kakao.com/26203817",
    "address": "강원특별자치도 정선군 고한읍 강원남로 6071",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "high1-winter-world": {
    "latitude": 37.2054725277254,
    "longitude": 128.847576425733,
    "kakaoPlaceId": "23488077",
    "kakaoMapUrl": "https://place.map.kakao.com/23488077",
    "address": "강원특별자치도 정선군 고한읍 고한로 83",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "high1-high-and-high": {
    "latitude": 37.208066988321136,
    "longitude": 128.8434270853722,
    "kakaoPlaceId": "11824386",
    "kakaoMapUrl": "https://place.map.kakao.com/11824386",
    "address": "강원특별자치도 정선군 고한읍 고한로 35",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "high1-wolnam": {
    "latitude": 37.2076414223009,
    "longitude": 128.843448268319,
    "kakaoPlaceId": "12624780",
    "kakaoMapUrl": "https://place.map.kakao.com/12624780",
    "address": "강원특별자치도 정선군 고한읍 고한로 40",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "high1-sereno": {
    "latitude": 37.2077777062753,
    "longitude": 128.843721911559,
    "kakaoPlaceId": "336790624",
    "kakaoMapUrl": "https://place.map.kakao.com/336790624",
    "address": "강원특별자치도 정선군 고한읍 고한로 39",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "high1-seven-ski": {
    "latitude": 37.20957255162565,
    "longitude": 128.84133484505944,
    "kakaoPlaceId": "12648693",
    "kakaoMapUrl": "https://place.map.kakao.com/12648693",
    "address": "강원특별자치도 정선군 고한읍 고한로 8",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "muju-baegam": {
    "latitude": 35.9103678623616,
    "longitude": 127.755999761484,
    "kakaoPlaceId": "704070562",
    "kakaoMapUrl": "https://place.map.kakao.com/704070562",
    "address": "전북특별자치도 무주군 설천면 만선로 32",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "konjiam-goodgear": {
    "latitude": 37.3389998072838,
    "longitude": 127.305469517556,
    "kakaoPlaceId": "12068891",
    "kakaoMapUrl": "https://place.map.kakao.com/12068891",
    "address": "경기 광주시 도척면 독고개길 307",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "elysian-worldski": {
    "latitude": 37.8414661533122,
    "longitude": 127.552137541253,
    "kakaoPlaceId": "14721153",
    "kakaoMapUrl": "https://place.map.kakao.com/14721153",
    "address": "강원특별자치도 춘천시 남산면 서백길 75",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  },
  "edenvalley-modooski": {
    "latitude": 35.394673198913,
    "longitude": 129.009926673998,
    "kakaoPlaceId": "928540398",
    "kakaoMapUrl": "https://place.map.kakao.com/928540398",
    "address": "경남 양산시 어실로 440",
    "locationSource": "place_search",
    "locationCheckedAt": "2026-07-16"
  }
} as const satisfies Record<string, RentalLocationRecord>;
