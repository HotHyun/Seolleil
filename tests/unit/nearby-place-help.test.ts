import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { kakaoMapSearchUrl, missingPlaceMailto, NearbyPlaceHelp } from "@/components/nearby-place-help";
import { legal } from "@/lib/legal";

describe("nearby place help", () => {
  it("builds a Kakao map search link for the resort and place kind", () => {
    expect(kakaoMapSearchUrl("곤지암리조트", "rental")).toBe(`https://map.kakao.com/link/search/${encodeURIComponent("곤지암리조트 스키 렌탈")}`);
    expect(kakaoMapSearchUrl("모나 용평", "lodging")).toBe(`https://map.kakao.com/link/search/${encodeURIComponent("모나 용평 숙소")}`);
  });

  it("builds a report mail to the operator without storing anything on the server", () => {
    const url = missingPlaceMailto("곤지암리조트", "rental");
    expect(url.startsWith(`mailto:${legal.contactEmail}?subject=`)).toBe(true);
    expect(decodeURIComponent(url)).toContain("[설레일 제보] 곤지암리조트 렌탈샵 추가 요청");
    expect(decodeURIComponent(url)).toContain("리조트: 곤지암리조트");
  });

  it("renders both actions with the resort name", () => {
    const html = renderToStaticMarkup(createElement(NearbyPlaceHelp, { resortName: "곤지암리조트", kind: "rental" }));
    expect(html).toContain("카카오맵에서 곤지암리조트 주변 스키 렌탈 더 찾기");
    expect(html).toContain("없는 렌탈샵 알려주기");
    expect(html).toContain("찾는 렌탈샵이 목록에 없나요?");
    expect(renderToStaticMarkup(createElement(NearbyPlaceHelp, { resortName: "곤지암리조트", kind: "lodging" }))).toContain("찾는 숙소가 목록에 없나요?");
    expect(html).toContain("가격까지 확인된 곳부터 목록에 추가해요");
  });
});
