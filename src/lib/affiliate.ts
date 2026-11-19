// 외부 예약·구매 링크의 제휴 파라미터와 표기를 한 곳에서 관리한다.
// 제휴 승인 후 아래 `params`에 발급받은 값을 채우고 재배포하면 해당 사이트 링크에만 적용된다.
// params가 비어 있으면 링크를 바꾸지 않으며, 제휴 표기(rel="sponsored", 안내 문구)도 나타나지 않는다.
// 추천 순위와 가격 계산은 제휴 여부와 무관하다.

export type OutboundCategory = "lodging" | "rental" | "lift" | "shuttle" | "gear" | "other";

export type AffiliateProvider = {
  id: string;
  label: string;
  category: OutboundCategory;
  /** 도메인 끝부분 일치. 예: "yeogi.com"은 www.yeogi.com도 포함한다. */
  hostSuffixes: string[];
  /** 링크에 덧붙일 쿼리 파라미터(제휴 승인 후 입력). 비어 있으면 비활성. */
  params: Record<string, string>;
};

export const affiliateProviders: AffiliateProvider[] = [
  // 예) { aid: "발급받은-ID" }
  { id: "yeogi", label: "여기어때", category: "lodging", hostSuffixes: ["yeogi.com"], params: {} },
  { id: "nol", label: "NOL", category: "lodging", hostSuffixes: ["yanolja.com", "nol-universe.com"], params: {} },
  { id: "klook", label: "클룩", category: "lift", hostSuffixes: ["klook.com"], params: {} },
  { id: "waug", label: "와그", category: "lift", hostSuffixes: ["waug.com"], params: {} },
  { id: "coupang", label: "쿠팡", category: "gear", hostSuffixes: ["coupang.com"], params: {} }
];

export type ResolvedOutboundLink = {
  href: string;
  /** 제휴 파라미터를 적용했는지 */
  affiliate: boolean;
  provider?: string;
  category?: OutboundCategory;
  rel: string;
};

const baseRel = "noreferrer";

function matchProvider(hostname: string, providers: AffiliateProvider[]) {
  const host = hostname.toLowerCase();
  return providers.find((provider) => provider.hostSuffixes.some((suffix) => host === suffix || host.endsWith(`.${suffix}`)));
}

export function resolveOutboundLink(
  href: string | undefined,
  providers: AffiliateProvider[] = affiliateProviders
): ResolvedOutboundLink {
  const fallback: ResolvedOutboundLink = { href: href ?? "", affiliate: false, rel: baseRel };
  if (!href) return fallback;
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return fallback;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return fallback;

  const provider = matchProvider(url.hostname, providers);
  if (!provider) return fallback;

  const entries = Object.entries(provider.params).filter(([key, value]) => key && value);
  if (!entries.length) return { ...fallback, provider: provider.id, category: provider.category };

  for (const [key, value] of entries) url.searchParams.set(key, value);
  return {
    href: url.toString(),
    affiliate: true,
    provider: provider.id,
    category: provider.category,
    rel: `${baseRel} sponsored`
  };
}

/** 하나라도 제휴가 활성화되어 있는지. 안내 문구 노출 여부에 쓴다. */
export function hasActiveAffiliate(providers: AffiliateProvider[] = affiliateProviders) {
  return providers.some((provider) => Object.values(provider.params).some(Boolean));
}

export const affiliateDisclosure =
  "이 화면의 일부 외부 예약·구매 링크는 제휴 링크입니다. 이용자 추가 비용 없이 설레일이 판매처로부터 수수료를 받을 수 있으며, 추천 순서와 가격 계산에는 영향이 없습니다.";
