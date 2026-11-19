import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PrivacyPage from "@/app/privacy/page";
import TermsPage from "@/app/terms/page";
import { legal } from "@/lib/legal";

describe("legal pages", () => {
  it("publishes the operator contact and effective date in the privacy policy", () => {
    const html = renderToStaticMarkup(createElement(PrivacyPage));
    expect(html).toContain(legal.contactEmail);
    expect(html).toContain(legal.operatorName);
    expect(html).toContain(legal.privacyEffectiveDate);
    for (const heading of ["수집하는 개인정보 항목과 방법", "보유 및 이용 기간", "이용자의 권리와 행사 방법", "개인정보 보호책임자와 문의처"]) {
      expect(html).toContain(heading);
    }
  });

  it("states the price disclaimer and reference price rule in the terms", () => {
    const html = renderToStaticMarkup(createElement(TermsPage));
    expect(html).toContain("실시간 견적이 아닙니다");
    expect(html).toContain("참고가");
    expect(html).toContain(legal.contactEmail);
    expect(html).toContain(legal.termsEffectiveDate);
  });
});
