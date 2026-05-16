import { priceRules, rentalPriceRules } from "../src/data/prices";
import { rentalShops, resorts } from "../src/data/resorts";

type LinkTarget = {
  scope: string;
  id: string;
  url: string;
};

const timeoutMs = 8000;

function uniqLinks() {
  const links: LinkTarget[] = [];
  for (const resort of resorts) {
    links.push({ scope: "resort.official", id: resort.id, url: resort.officialUrl });
    links.push({ scope: "resort.slope", id: resort.id, url: resort.slopeStatusUrl });
    links.push({ scope: "resort.lift", id: resort.id, url: resort.liftTicketUrl });
    if (resort.rentalUrl) links.push({ scope: "resort.rental", id: resort.id, url: resort.rentalUrl });
    if (resort.mapLinks.naver) links.push({ scope: "resort.map", id: resort.id, url: resort.mapLinks.naver });
    if (resort.mapLinks.kakao) links.push({ scope: "resort.map", id: resort.id, url: resort.mapLinks.kakao });
  }
  for (const shop of rentalShops) {
    if (shop.url) links.push({ scope: "rental_shop", id: shop.id, url: shop.url });
    if (shop.sourceUrl) links.push({ scope: "rental_shop.source", id: shop.id, url: shop.sourceUrl });
  }
  for (const rule of priceRules) {
    if (rule.sourceUrl) links.push({ scope: "price_rule", id: rule.id, url: rule.sourceUrl });
  }
  for (const rule of rentalPriceRules) {
    if (rule.sourceUrl) links.push({ scope: "rental_price_rule", id: rule.id, url: rule.sourceUrl });
  }

  const seen = new Set<string>();
  return links.filter((link) => {
    const key = `${link.scope}:${link.id}:${link.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function check(link: LinkTarget) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let response = await fetch(link.url, { method: "HEAD", redirect: "follow", signal: controller.signal });
    if (response.status === 405 || response.status === 403) {
      response = await fetch(link.url, { method: "GET", redirect: "follow", signal: controller.signal });
    }
    return { ...link, ok: response.status >= 200 && response.status < 400, status: response.status };
  } catch (error) {
    return { ...link, ok: false, status: "error", error: error instanceof Error ? error.message : String(error) };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const links = uniqLinks();
  const results = [];

  for (const link of links) {
    results.push(await check(link));
  }

  const failed = results.filter((result) => !result.ok);
  console.log(`Checked ${results.length} links. Failed: ${failed.length}`);

  for (const result of failed) {
    console.log(`- [${result.scope}] ${result.id}: ${result.status} ${result.url}`);
  }

  if (failed.length > 0) process.exit(1);
}

void main();
