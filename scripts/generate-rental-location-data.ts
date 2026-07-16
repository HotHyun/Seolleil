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

async function main() {
const report = JSON.parse(await readFile("reports/rental-location-candidates.json", "utf8")) as { generatedAt: string; results: AuditItem[] };
const accepted = report.results.filter((item) => item.best && (["verified", "review"].includes(item.confidence) || manuallyAccepted.has(item.shopId)));
const acceptedIds = new Set(accepted.map((item) => item.shopId));
const unresolved = report.results.filter((item) => !acceptedIds.has(item.shopId));

const records = Object.fromEntries(accepted.map((item) => [item.shopId, {
  latitude: Number(item.best!.y),
  longitude: Number(item.best!.x),
  kakaoPlaceId: item.best!.id,
  kakaoMapUrl: `https://place.map.kakao.com/${item.best!.id}`,
  address: item.best!.road_address_name || item.best!.address_name,
  locationSource: "place_search",
  locationCheckedAt: "2026-07-16"
}]));

const dataSource = `import type { RentalShop } from "@/lib/types";\n\nexport type RentalLocationRecord = Pick<RentalShop, "latitude" | "longitude" | "kakaoPlaceId" | "locationSource" | "locationCheckedAt"> & {\n  kakaoMapUrl: string;\n  address: string;\n};\n\n// Generated from Kakao Places candidates. Re-run pnpm data:locations after reviewing reports/rental-location-candidates.json.\nexport const rentalLocationRecords = ${JSON.stringify(records, null, 2)} as const satisfies Record<string, RentalLocationRecord>;\n`;

const grouped = unresolved.reduce<Partial<Record<AuditItem["confidence"], AuditItem[]>>>((groups, item) => {
  (groups[item.confidence] ??= []).push(item);
  return groups;
}, {});
const rows = unresolved.map((item) => `| ${item.resortId} | ${item.shopName} | ${item.confidence} | ${item.best ? `${item.best.place_name} (${item.best.score})` : "검색 결과 없음"} |`).join("\n");
const qualityDoc = `# 렌탈샵 위치 데이터 품질\n\n마지막 생성: 2026-07-16  \n원천: Kakao Maps JavaScript Places 장소 검색 결과  \n정책: 높은 신뢰 자동 일치와 사람이 명칭을 재검토한 후보만 제품 좌표로 사용한다. 리조트 대표 좌표를 공식 렌탈 매장 좌표로 대체하지 않는다.\n\n## 현황\n\n- 전체 렌탈 데이터: ${report.results.length}곳\n- 좌표·Kakao Place ID 반영: ${accepted.length}곳\n- 추가 확인 필요: ${unresolved.length}곳\n- 불확실 후보: ${(grouped.uncertain ?? []).length}곳\n- 검색 결과 없음: ${(grouped.unresolved ?? []).length}곳\n\n장소 상세 링크는 검색어 URL 대신 Kakao Place ID 기반 \`https://place.map.kakao.com/{id}\` 형식으로 저장한다. 좌표와 ID는 Kakao 장소 검색 응답의 \`x\`, \`y\`, \`id\`를 사용한다.\n\n## 추가 확인 대상\n\n| 리조트 | 내부 업체명 | 상태 | Kakao 최상위 후보 |\n| --- | --- | --- | --- |\n${rows}\n\n## 갱신 절차\n\n1. \`pnpm data:locations:audit\`로 Kakao 후보 리포트를 갱신한다.\n2. 이름, 전화번호, 주소, 리조트 반경을 대조한다.\n3. 명백한 후보만 생성 스크립트의 승인 목록에 추가한다.\n4. \`pnpm data:locations\`로 정적 위치 레코드와 이 문서를 다시 생성한다.\n5. \`pnpm data:validate\`와 지도 회귀 테스트를 실행한다.\n`;

await Promise.all([
  writeFile("src/data/rental-locations.ts", dataSource, "utf8"),
  writeFile("docs/product/rental-location-quality.md", qualityDoc, "utf8")
]);
console.log(`location records: ${accepted.length}, unresolved: ${unresolved.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
