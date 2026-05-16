import { priceRules, rentalPriceRules } from "../src/data/prices";
import { rentalShops, resorts } from "../src/data/resorts";

type LinkTarget = {
  scope: string;
  id: string;
  url: string;
};

const timeoutMs = 8000;
const fatalStatuses = new Set([404, 410]);

function collectLinks() {
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

  return links;
}

function uniqLinksByUrl() {
  const grouped = new Map<string, { url: string; references: LinkTarget[] }>();
  for (const link of collectLinks()) {
    const current = grouped.get(link.url) ?? { url: link.url, references: [] };
    current.references.push(link);
    grouped.set(link.url, current);
  }
  return [...grouped.values()];
}

async function check(link: { url: string; references: LinkTarget[] }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let response = await fetch(link.url, { method: "HEAD", redirect: "follow", signal: controller.signal });
    if (response.status === 405 || response.status === 403) {
      response = await fetch(link.url, { method: "GET", redirect: "follow", signal: controller.signal });
    }
    return {
      ...link,
      ok: response.status >= 200 && response.status < 400,
      fatal: fatalStatuses.has(response.status),
      status: response.status
    };
  } catch (error) {
    return {
      ...link,
      ok: false,
      fatal: false,
      status: "error",
      error: error instanceof Error ? error.message : String(error)
    };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const rawLinks = collectLinks();
  const links = uniqLinksByUrl();
  const results = [];

  for (const link of links) {
    results.push(await check(link));
  }

  const failed = results.filter((result) => !result.ok);
  const fatal = failed.filter((result) => result.fatal);
  const warnings = failed.filter((result) => !result.fatal);
  console.log(`Checked ${links.length} unique URLs from ${rawLinks.length} references.`);
  console.log(`Failed unique URLs: ${failed.length} (${fatal.length} fatal, ${warnings.length} warning).`);

  if (fatal.length > 0) {
    console.log("");
    console.log("Fatal broken links:");
    for (const result of fatal) {
      console.log(formatResult(result));
    }
  }

  if (warnings.length > 0) {
    console.log("");
    console.log("Warning links, often caused by bot blocking, timeout, or temporary server responses:");
    for (const result of warnings) {
      console.log(formatResult(result));
    }
  }

  if (fatal.length > 0) process.exit(1);
}

function formatResult(result: Awaited<ReturnType<typeof check>>) {
  const sample = result.references.slice(0, 4).map((ref) => `${ref.scope}:${ref.id}`).join(", ");
  const suffix = result.references.length > 4 ? `, +${result.references.length - 4} more` : "";
  return `- ${result.status} ${result.url} (${result.references.length} refs: ${sample}${suffix})`;
}

void main();
