import { readFile, writeFile } from "node:fs/promises";

type Candidate = {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
  place_url: string;
  score: number;
  reasons: string[];
};

type AuditItem = {
  shopId: string;
  resortId: string;
  shopName: string;
  confidence: "verified" | "review" | "uncertain" | "unresolved";
  best?: Candidate;
};

const manuallyAccepted = new Set([
  "oakvalley-maru",
  "vivaldi-smile",
  "vivaldi-boardyoon",
  "muju-baegam"
]);

// 2026-11-19 카카오 장소 탐색(scripts/discover-nearby-places.ts)으로 상호·위치가 기존 업체와 같다고 판단해 사람이 승인한 장소.
const manualPlaces = {
  "oakvalley-snb": { id: "1959930025", name: "오크밸리 SNB 렌탈샵", address: "강원특별자치도 원주시 지정면 구재로 265", x: 127.80136911657952, y: 37.40681230362487 },
  "oakvalley-cat-ski": { id: "18463405", name: "오크밸리 야옹이 렌탈샵", address: "강원특별자치도 원주시 지정면 구재로 52", x: 127.78879085832705, y: 37.39264669487246 },
  "oakvalley-kang-pro": { id: "15526558", name: "강윤정프로샵 오크밸리점", address: "강원특별자치도 원주시 지정면 구재로 216", x: 127.799003760765, y: 37.4031720651246 },
  "high1-high-and-high": { id: "11824386", name: "하이앤하이", address: "강원특별자치도 정선군 고한읍 고한로 35", x: 128.8434270853722, y: 37.208066988321136 },
  "high1-wolnam": { id: "12624780", name: "월남스키", address: "강원특별자치도 정선군 고한읍 고한로 40", x: 128.843448268319, y: 37.2076414223009 },
  "high1-sereno": { id: "336790624", name: "쎄레노스키샵", address: "강원특별자치도 정선군 고한읍 고한로 39", x: 128.843721911559, y: 37.2077777062753 },
  "elysian-mobydic": { id: "2071071494", name: "엘리시안강촌 모비딕 스키강습렌탈샵", address: "강원특별자치도 춘천시 남산면 서백길 37", x: 127.54808112497338, y: 37.84307076207251 },
  "phoenix-baekya": { id: "22017290", name: "휘닉스파크 렌탈샵 백야", address: "강원특별자치도 평창군 봉평면 태기로 523", x: 128.35343298471693, y: 37.56392297730669 }
} as const;

async function main() {
const report = JSON.parse(await readFile("reports/rental-location-candidates.json", "utf8")) as { generatedAt: string; results: AuditItem[] };
const accepted = report.results.filter((item) => item.best && (["verified", "review"].includes(item.confidence) || manuallyAccepted.has(item.shopId)));
const acceptedIds = new Set([...accepted.map((item) => item.shopId), ...Object.keys(manualPlaces)]);
const unresolved = report.results.filter((item) => !acceptedIds.has(item.shopId));

const manualRecords = Object.fromEntries(Object.entries(manualPlaces).map(([shopId, place]) => [shopId, {
  latitude: place.y,
  longitude: place.x,
  kakaoPlaceId: place.id,
  kakaoMapUrl: `https://place.map.kakao.com/${place.id}`,
  address: place.address,
  locationSource: "place_search",
  locationCheckedAt: "2026-11-19"
}]));
const records = Object.fromEntries([...accepted.map((item) => [item.shopId, {
  latitude: Number(item.best!.y),
  longitude: Number(item.best!.x),
  kakaoPlaceId: item.best!.id,
  kakaoMapUrl: `https://place.map.kakao.com/${item.best!.id}`,
  address: item.best!.road_address_name || item.best!.address_name,
  locationSource: "place_search",
  locationCheckedAt: "2026-07-16"
}]), ...Object.entries(manualRecords)]);

const dataSource = `import type { RentalShop } from "@/lib/types";\n\nexport type RentalLocationRecord = Pick<RentalShop, "latitude" | "longitude" | "kakaoPlaceId" | "locationSource" | "locationCheckedAt"> & {\n  kakaoMapUrl: string;\n  address: string;\n};\n\n// Generated from Kakao Places candidates. Re-run pnpm data:locations after reviewing reports/rental-location-candidates.json.\nexport const rentalLocationRecords = ${JSON.stringify(records, null, 2)} as const satisfies Record<string, RentalLocationRecord>;\n`;

const grouped = unresolved.reduce<Partial<Record<AuditItem["confidence"], AuditItem[]>>>((groups, item) => {
  (groups[item.confidence] ??= []).push(item);
  return groups;
}, {});
const rows = unresolved.map((item) => `| ${item.resortId} | ${item.shopName} | ${item.confidence} | ${item.best ? `${item.best.place_name} (${item.best.score})` : "검색 결과 없음"} |`).join("\n");
const qualityDoc = `# 렌탈샵 위치 데이터 품질\n\n마지막 생성: 2026-11-19  \n원천: Kakao Maps JavaScript Places 장소 검색 결과  \n정책: 높은 신뢰 자동 일치와 사람이 명칭을 재검토한 후보만 제품 좌표로 사용한다. 리조트 대표 좌표를 공식 렌탈 매장 좌표로 대체하지 않는다.\n\n## 현황\n\n- 전체 렌탈 데이터: ${report.results.length}곳\n- 좌표·Kakao Place ID 반영: ${accepted.length + Object.keys(manualPlaces).length}곳\n- 추가 확인 필요: ${unresolved.length}곳\n- 불확실 후보: ${(grouped.uncertain ?? []).length}곳\n- 검색 결과 없음: ${(grouped.unresolved ?? []).length}곳\n\n장소 상세 링크는 검색어 URL 대신 Kakao Place ID 기반 \`https://place.map.kakao.com/{id}\` 형식으로 저장한다. 좌표와 ID는 Kakao 장소 검색 응답의 \`x\`, \`y\`, \`id\`를 사용한다.\n\n## 추가 확인 대상\n\n| 리조트 | 내부 업체명 | 상태 | Kakao 최상위 후보 |\n| --- | --- | --- | --- |\n${rows}\n\n## 갱신 절차\n\n1. \`pnpm data:locations:audit\`로 Kakao 후보 리포트를 갱신한다.\n2. 이름, 전화번호, 주소, 리조트 반경을 대조한다.\n3. 명백한 후보만 생성 스크립트의 승인 목록에 추가한다.\n4. \`pnpm data:locations\`로 정적 위치 레코드와 이 문서를 다시 생성한다.\n5. \`pnpm data:validate\`와 지도 회귀 테스트를 실행한다.\n`;

await Promise.all([
  writeFile("src/data/rental-locations.ts", dataSource, "utf8"),
  writeFile("docs/product/rental-location-quality.md", qualityDoc, "utf8")
]);
console.log(`location records: ${accepted.length + Object.keys(manualPlaces).length}, unresolved: ${unresolved.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
