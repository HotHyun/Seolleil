// reports/nearby-places-*.json(pnpm data:discover)에서 신규 렌탈샵·숙소를 골라 src/data/discovered-*.ts를 만든다. 리조트별 상한과 거리(4km) 기준은 아래 상수를 따른다.
// 위치가 확인되지 않은 기존 업체와 같다고 사람이 승인한 장소는 manualPlaces에 두고 scripts/generate-rental-location-data.ts에도 같은 값을 적는다.
import { readFileSync, writeFileSync } from "node:fs";
import { rentalShops as allRentalShops, resorts } from "../src/data/resorts";
import { nearbyLodgings as allNearbyLodgings } from "../src/data/resort-map";

// 이전에 이 스크립트가 만든 항목(-kk-)은 기존 목록에서 제외해 다시 실행해도 같은 결과가 나오게 한다.
const rentalShops = allRentalShops.filter((shop) => !shop.id.includes("-kk-"));
const nearbyLodgings = allNearbyLodgings.filter((lodging) => !lodging.id.includes("-kk-"));

type Row = { id: string; name: string; category: string; address: string; phone: string; distance: number; url: string; x: string; y: string };
const rentalD = JSON.parse(readFileSync("reports/nearby-places-rental.json", "utf8")) as Record<string, Row[]>;
const lodgingD = JSON.parse(readFileSync("reports/nearby-places-lodging.json", "utf8")) as Record<string, Row[]>;
const norm = (v?: string) => (v ?? "").toLowerCase().replace(/[^0-9a-z가-힣]/g, "");
const digits = (v?: string) => (v ?? "").replace(/\D/g, "");
const TODAY = "2026-11-19";
const CAP_RENTAL = 6, CAP_LODGING = 4, MAX_M = 4000;
const manualPlaces: Record<string, string> = { "oakvalley-snb": "오크밸리 SNB 렌탈샵", "oakvalley-cat-ski": "오크밸리 야옹이 렌탈샵", "oakvalley-kang-pro": "강윤정프로샵 오크밸리점", "high1-high-and-high": "하이앤하이", "high1-wolnam": "월남스키", "high1-sereno": "쎄레노스키샵", "elysian-mobydic": "엘리시안강촌 모비딕 스키강습렌탈샵", "phoenix-baekya": "휘닉스파크 렌탈샵 백야" };

const existingIds = new Set<string>(rentalShops.map(s => s.kakaoPlaceId).filter(Boolean) as string[]);
const manual: Record<string, Row> = {};
for (const [shopId, placeName] of Object.entries(manualPlaces)) {
  const resort = rentalShops.find(s => s.id === shopId)!.resortId;
  const row = rentalD[resort].find(r => r.name === placeName);
  if (!row) throw new Error("manual place not found " + placeName);
  manual[shopId] = row; existingIds.add(row.id);
}

// ---- rental
const best = new Map<string, { resort: string; row: Row }>();
for (const [resort, rows] of Object.entries(rentalD)) for (const row of rows) {
  if (!row.category.includes("스키,보드렌탈")) continue;
  const prev = best.get(row.id);
  if (!prev || row.distance < prev.row.distance) best.set(row.id, { resort, row });
}
// 상호에 리조트명이 있으면 가장 가까운 리조트 대신 그 리조트로 배정한다(용평·알펜시아처럼 가까운 리조트 구분).
const hints: Array<[RegExp, string]> = [[/용평/, "yongpyong"], [/알펜시아/, "alpensia"]];
for (const [id, entry] of [...best.entries()]) {
  const hint = hints.find(([re]) => re.test(entry.row.name));
  if (!hint) continue;
  const alt = rentalD[hint[1]]?.find(r => r.id === id);
  if (alt) best.set(id, { resort: hint[1], row: alt });
}
// 알펜시아 단지(솔봉로)에서 1.5km 넘게 떨어진 올림픽로 일대 업체는 용평 쪽 상권이므로 용평으로 배정한다.
for (const [id, entry] of [...best.entries()]) {
  if (entry.resort === "alpensia" && entry.row.distance > 1500 && !entry.row.name.includes("알펜시아")) {
    const alt = rentalD.yongpyong?.find(r => r.id === id);
    if (alt) best.set(id, { resort: "yongpyong", row: alt });
  }
}
const junk = /스쿨|강습센터|튜닝|스키하우스|스키캠프|스노우나인/;
const existingRentalNames = new Map<string, Set<string>>();
for (const s of rentalShops) (existingRentalNames.get(s.resortId) ?? existingRentalNames.set(s.resortId, new Set()).get(s.resortId)!).add(norm(s.name));
const existingPhones = new Set(rentalShops.map(s => digits(s.phone)).filter(Boolean));
// 이미 목록에 있는 업체로 판정된 카카오 장소(같은 상호·전화번호)의 전화번호는 중복으로 본다.
const knownRows = Object.values(rentalD).flat().filter(r => existingIds.has(r.id));
for (const r of knownRows) if (digits(r.phone)) existingPhones.add(digits(r.phone));
const roadTail = (address: string) => address.split(" ").slice(-2).join(" ");
const nameCount = new Map<string, number>();
for (const s of rentalShops) nameCount.set(norm(s.name), (nameCount.get(norm(s.name)) ?? 0) + 1);
const rentalOut: string[] = []; const rentalCounts: Record<string, number> = {};
for (const resort of resorts) {
  const picks = [...best.values()].filter(b => b.resort === resort.id && b.row.distance <= MAX_M && !existingIds.has(b.row.id) && !(junk.test(b.row.name) && !b.row.name.includes("렌탈")) && !(digits(b.row.phone) && existingPhones.has(digits(b.row.phone))))
    .sort((a, b) => Number(!a.row.phone) - Number(!b.row.phone) || a.row.distance - b.row.distance).slice(0, CAP_RENTAL);
  picks.sort((a, b) => a.row.distance - b.row.distance);
  rentalCounts[resort.id] = picks.length;
  const seenPhones = new Set<string>();
  const finalPicks = picks.filter(({ row }) => { const d = digits(row.phone); if (!d) return true; if (seenPhones.has(d)) return false; seenPhones.add(d); return true; });
  rentalCounts[resort.id] = finalPicks.length;
  const pickNames = new Map<string, number>();
  for (const { row } of finalPicks) pickNames.set(norm(row.name), (pickNames.get(norm(row.name)) ?? 0) + 1);
  for (const { row } of finalPicks) {
    const generic = norm(row.name).replace(/렌탈샵|렌탈/g, "").length < 2 || (nameCount.get(norm(row.name)) ?? 0) > 0 || (pickNames.get(norm(row.name)) ?? 0) > 1 || /^(곤지암|지산|무주|오크밸리)?렌탈샵$/.test(row.name.replace(/\s/g, ""));
    const displayName = generic ? `${row.name} (${roadTail(row.address)})` : row.name;
    const minutes = Math.max(1, Math.round(row.distance / 500));
    rentalOut.push(`  {
    id: "${resort.id}-kk-${row.id}",
    resortId: "${resort.id}",
    name: ${JSON.stringify(displayName)},
    mapLinks: { kakao: "https://place.map.kakao.com/${row.id}" },
    equipmentRentalAvailable: true,
    clothingRentalAvailable: false,
    pickupAvailable: false,
    deliveryAvailable: false,
    liftTicketSalesAvailable: false,
    address: ${JSON.stringify(row.address)},${row.phone ? `\n    phone: ${JSON.stringify(row.phone)},` : ""}
    latitude: ${Number(row.y)},
    longitude: ${Number(row.x)},
    kakaoPlaceId: "${row.id}",
    locationSource: "place_search",
    locationCheckedAt: "${TODAY}",
    dataStatus: "listed_25_26",
    serviceNote: "카카오 장소 검색에서 스키·보드 렌탈로 등록된 업체입니다. 26/27 가격과 의류 대여 여부는 업체에 확인하세요.",
    distanceMinutes: ${minutes},
    recommendationTags: ["카카오확인", "가격미확인"],
    sourceUrl: "https://place.map.kakao.com/${row.id}",
    lastCheckedAt: "${TODAY}"
  }`);
  }
}
writeFileSync("src/data/discovered-rental-shops.ts", `import type { RentalShop } from "@/lib/types";

// 카카오 장소 검색(스키,보드렌탈 분류)으로 리조트 반경 4km 안에서 찾은 업체 중 기존 목록에 없는 곳이다.
// 장비·의류 가격과 의류 대여 여부는 확인하지 않아 가격 규칙 없이 위치·연락처만 제공한다.
// 새로 찾으려면 pnpm data:discover를 실행하고 결과를 검토해 이 파일을 갱신한다. (${TODAY} 생성)
export const discoveredRentalShops: RentalShop[] = [\n${rentalOut.join(",\n")}\n];\n`);


// ---- lodging
const notStay = /가든|스키|렌탈|식당|카페|농원|캠핑|올라운드/;
const ownBrand = /곤지암리조트|지산|비발디|소노|엘리시안|휘닉스|용평|하이원|웰리힐리|오크밸리|알펜시아|오투|덕유산|에덴밸리|리조트|홀리데이인|인터컨티넨탈/;
const existingLodgingNames = nearbyLodgings.map(l => norm(l.name));
const lodgingBest = new Map<string, { resort: string; row: Row }>();
for (const [resort, rows] of Object.entries(lodgingD)) for (const row of rows) {
  if (!/펜션|호텔|게스트하우스|콘도/.test(row.category) || /숙박부속/.test(row.category)) continue;
  const prev = lodgingBest.get(row.id);
  if (!prev || row.distance < prev.row.distance) lodgingBest.set(row.id, { resort, row });
}
const lodgingOut: string[] = []; const lodgingCounts: Record<string, number> = {};
for (const resort of resorts) {
  const picks = [...lodgingBest.values()].filter(b => b.resort === resort.id && b.row.distance <= MAX_M && !ownBrand.test(b.row.name) && !notStay.test(b.row.name)
      && !existingLodgingNames.some(n => n.length >= 3 && (n.includes(norm(b.row.name)) || norm(b.row.name).includes(n))))
    .sort((a, b) => Number(!a.row.phone) - Number(!b.row.phone) || a.row.distance - b.row.distance).slice(0, CAP_LODGING)
    .sort((a, b) => a.row.distance - b.row.distance);
  lodgingCounts[resort.id] = picks.length;
  for (const { row } of picks) {
    lodgingOut.push(`  {
    id: "${resort.id}-kk-${row.id}",
    resortId: "${resort.id}",
    name: ${JSON.stringify(row.name)},
    category: "nearby_stay",
    mapLinks: { kakao: "https://place.map.kakao.com/${row.id}" },
    distanceMinutes: ${Math.max(1, Math.round(row.distance / 500))},
    latitude: ${Number(row.y)},
    longitude: ${Number(row.x)},
    kakaoPlaceId: "${row.id}",
    locationSource: "place_search",
    locationCheckedAt: "${TODAY}",
    sourceUrl: "https://place.map.kakao.com/${row.id}",
    lastCheckedAt: "${TODAY}"
  }`);
  }
}
writeFileSync("src/data/discovered-lodgings.ts", `import type { NearbyLodging } from "@/data/resort-map";

// 카카오 장소 검색에서 리조트 반경 4km 안의 펜션·호텔·게스트하우스 중 기존 목록에 없는 곳이다. (${TODAY} 생성)
// 예약 링크와 요금은 확인하지 않아 위치·상세 링크만 제공하며, 예약 가능 여부는 업체나 예약 플랫폼에서 확인해야 한다.
export const discoveredLodgings: NearbyLodging[] = [\n${lodgingOut.join(",\n")}\n];\n`);
console.log("rental", JSON.stringify(rentalCounts), "total", rentalOut.length);
console.log("lodging", JSON.stringify(lodgingCounts), "total", lodgingOut.length);
