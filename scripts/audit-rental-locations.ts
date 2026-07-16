import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
import { rentalShops, resorts } from "../src/data/resorts";
import { getResortMapPoint } from "../src/data/resort-map";

type KakaoPlace = {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  phone: string;
  x: string;
  y: string;
  place_url: string;
  distance: string;
};

type Candidate = KakaoPlace & { score: number; reasons: string[] };
type AuditResult = {
  shopId: string;
  resortId: string;
  shopName: string;
  currentAddress?: string;
  currentPhone?: string;
  confidence: "verified" | "review" | "uncertain" | "unresolved";
  best?: Candidate;
  candidates: Candidate[];
};

const outputPath = process.argv.includes("--write")
  ? "reports/rental-location-candidates.json"
  : null;

function normalize(value: string | undefined) {
  return (value ?? "").toLowerCase().replace(/[^0-9a-z가-힣]/g, "").replace(/렌탈샵|렌탈|스키샵/g, "");
}

function digits(value: string | undefined) {
  return (value ?? "").replace(/\D/g, "");
}

function scoreCandidate(shop: (typeof rentalShops)[number], place: KakaoPlace): Candidate {
  const reasons: string[] = [];
  let score = 0;
  const shopName = normalize(shop.name);
  const placeName = normalize(place.place_name);
  if (shopName && placeName && shopName === placeName) { score += 8; reasons.push("exact_name"); }
  else if (shopName && placeName && (shopName.includes(placeName) || placeName.includes(shopName))) { score += 5; reasons.push("partial_name"); }
  const shopPhone = digits(shop.phone);
  const placePhone = digits(place.phone);
  if (shopPhone && placePhone && (shopPhone.includes(placePhone) || placePhone.includes(shopPhone))) { score += 6; reasons.push("phone"); }
  const shopAddress = normalize(shop.address);
  const placeAddress = normalize(`${place.road_address_name} ${place.address_name}`);
  if (shopAddress && placeAddress && (shopAddress.includes(placeAddress) || placeAddress.includes(shopAddress))) { score += 6; reasons.push("address"); }
  else if (shopAddress && placeAddress && shopAddress.slice(-8) && placeAddress.includes(shopAddress.slice(-8))) { score += 3; reasons.push("address_tail"); }
  const distance = Number(place.distance);
  if (Number.isFinite(distance) && distance <= 5_000) { score += 2; reasons.push("within_5km"); }
  else if (Number.isFinite(distance) && distance <= 20_000) { score += 1; reasons.push("within_20km"); }
  return { ...place, score, reasons };
}

async function main() {
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const page = await browser.newPage();
  await page.goto("https://ski.hothyun.com/resorts", { waitUntil: "networkidle", timeout: 90_000 });
  await page.waitForFunction(() => Boolean(window.kakao?.maps.services?.Places), undefined, { timeout: 30_000 });

  const results: AuditResult[] = [];
  for (const shop of rentalShops) {
    const resort = resorts.find((item) => item.id === shop.resortId);
    const center = getResortMapPoint(shop.resortId);
    const queries = [shop.name, `${resort?.name ?? ""} ${shop.name}`, shop.address, shop.phone].filter((value): value is string => Boolean(value));
    let places: KakaoPlace[] = [];
    for (const query of queries) {
      places = await page.evaluate(({ query, center }) => new Promise<KakaoPlace[]>((resolve) => {
        const service = new window.kakao!.maps.services.Places() as unknown as { keywordSearch: (query: string, callback: (items: KakaoPlace[], status: string) => void, options?: { x: number; y: number; radius: number; sort: string }) => void };
        service.keywordSearch(query, (items, status) => resolve(status === window.kakao!.maps.services.Status.OK ? items.slice(0, 8) : []), center ? { x: center.lng, y: center.lat, radius: 20_000, sort: "distance" } : undefined);
      }), { query, center });
      if (places.length) break;
    }
    const candidates = places.map((place) => scoreCandidate(shop, place)).sort((a, b) => b.score - a.score || Number(a.distance) - Number(b.distance));
    const best = candidates[0];
    const next = candidates[1];
    const confidence = !best ? "unresolved" : best.score >= 10 && (!next || best.score - next.score >= 3) ? "verified" : best.score >= 7 && (!next || best.score > next.score) ? "review" : "uncertain";
    results.push({
      shopId: shop.id,
      resortId: shop.resortId,
      shopName: shop.name,
      currentAddress: shop.address,
      currentPhone: shop.phone,
      confidence,
      best,
      candidates: candidates.slice(0, 3)
    });
  }
  await browser.close();
  const report = {
    generatedAt: new Date().toISOString(),
    source: "Kakao Maps JavaScript Places keyword search via ski.hothyun.com",
    counts: Object.fromEntries(["verified", "review", "uncertain", "unresolved"].map((key) => [key, results.filter((item) => item.confidence === key).length])),
    results
  };
  if (outputPath) {
    await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    console.log(`${outputPath}: ${JSON.stringify(report.counts)}`);
  } else {
    console.log(JSON.stringify(report, null, 2));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
