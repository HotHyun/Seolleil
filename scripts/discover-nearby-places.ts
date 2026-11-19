// 카카오 장소 검색(스키장 반경)으로 렌탈샵·숙소 후보를 찾아 기존 목록과 대조한다. 결과 검토 후 pnpm data:discovered로 데이터 파일을 만든다.
import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
import { rentalShops, resorts } from "../src/data/resorts";
import { getResortMapPoint } from "../src/data/resort-map";

type Place = { id: string; place_name: string; category_name: string; address_name: string; road_address_name: string; phone: string; x: string; y: string; place_url: string; distance: string };
const norm = (v?: string) => (v ?? "").toLowerCase().replace(/[^0-9a-z가-힣]/g, "").replace(/렌탈샵|렌탈|스키샵|점$/g, "");
const digits = (v?: string) => (v ?? "").replace(/\D/g, "");

const knownIds = new Set(rentalShops.map(s => s.kakaoPlaceId).filter(Boolean));
const queries = ["스키 렌탈", "스노보드 렌탈", "스키복 렌탈", "스키샵", "스키 보드 장비대여"];
// 사용: pnpm data:discover [rental|lodging]  → reports/nearby-places-<mode>.json
const mode = process.argv[2] === "lodging" ? "lodging" : "rental";
const lodgingQueries = ["펜션", "호텔", "콘도", "리조트", "게스트하우스"];
const radius = mode === "rental" ? 8000 : 10000;

async function main() {
const browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const page = await browser.newPage();
await page.goto("https://seolleil.com/resorts", { waitUntil: "networkidle", timeout: 90000 });
await page.waitForFunction(() => Boolean(window.kakao?.maps.services?.Places), undefined, { timeout: 30000 });

type Row = { id: string; name: string; category: string; address: string; phone: string; distance: number; url: string; x: string; y: string; known: boolean };
const out: Record<string, Row[]> = {};
for (const resort of resorts) {
  const center = getResortMapPoint(resort.id);
  if (!center) continue;
  const seen = new Map<string, Place>();
  for (const q of mode === "rental" ? queries : lodgingQueries) {
    for (const pageNo of [1, 2]) {
      const items = await page.evaluate(({ q, center, radius, pageNo }) => new Promise<Place[]>((resolve) => {
        const service = new window.kakao!.maps.services.Places() as unknown as { keywordSearch: (query: string, callback: (items: Place[], status: string) => void, options?: { x: number; y: number; radius: number; sort: string; page: number }) => void };
        service.keywordSearch(q, (items, status) => resolve(status === window.kakao!.maps.services.Status.OK ? items : []), { x: center.lng, y: center.lat, radius, sort: "distance", page: pageNo });
      }), { q, center, radius, pageNo });
      for (const p of items) if (!seen.has(p.id)) seen.set(p.id, p);
    }
  }
  const mine = rentalShops.filter(s => s.resortId === resort.id);
  const rows = [...seen.values()].map(p => {
    const known = knownIds.has(p.id) || mine.some(s => (digits(s.phone) && digits(s.phone) === digits(p.phone)) || (norm(s.name) && (norm(p.place_name).includes(norm(s.name)) || norm(s.name).includes(norm(p.place_name)))));
    return { id: p.id, name: p.place_name, category: p.category_name, address: p.road_address_name || p.address_name, phone: p.phone, distance: Number(p.distance), url: p.place_url, x: p.x, y: p.y, known };
  }).filter(r => mode === "rental" ? /렌탈|대여|스키|보드|스노/.test(r.category + r.name) : /숙박|펜션|호텔|콘도|리조트|게스트|모텔/.test(r.category)).sort((a, b) => a.distance - b.distance);
  out[resort.id] = rows;
}
await browser.close();
await writeFile(`reports/nearby-places-${mode}.json`, JSON.stringify(out, null, 1) + "\n");
for (const [id, rows] of Object.entries(out)) console.log(id, "total", rows.length, "new", rows.filter((r) => !r.known).length);

}
main().catch(e => { console.error(e); process.exitCode = 1; });
