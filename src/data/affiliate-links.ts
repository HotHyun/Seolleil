// 상품 URL마다 제휴 링크를 따로 발급해 주는 프로그램(쿠팡 파트너스, 여기어때 마케팅 파트너 등)용 매핑.
// 발급받은 링크를 `url`(앱에 이미 들어 있는 원본 주소)과 짝지어 추가하면 해당 링크만 교체된다.
// 쿼리 문자열과 해시는 비교에서 무시하고, 호스트·경로(끝 슬래시 무시)가 같으면 일치한다.
// 항목이 없으면 아무것도 바뀌지 않는다.
import type { AffiliateLinkOverride } from "@/lib/affiliate";

export const affiliateLinkOverrides: AffiliateLinkOverride[] = [
  // 예)
  // {
  //   provider: "coupang",
  //   category: "gear",
  //   url: "https://www.coupang.com/vp/products/1234567",
  //   affiliateUrl: "https://link.coupang.com/a/abcdef"
  // }
];
