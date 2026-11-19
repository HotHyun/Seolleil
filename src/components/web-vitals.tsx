"use client";

import { useReportWebVitals } from "next/web-vitals";

// 실제 방문자 기기에서 측정한 핵심 속도 지표(LCP·INP·CLS 등)를 Umami 이벤트로 보낸다. 개인정보·토큰은 포함하지 않는다.
export function WebVitals() {
  useReportWebVitals(metric => {
    if (!["LCP", "INP", "CLS", "FCP", "TTFB"].includes(metric.name)) return;
    window.umami?.track("web_vital", {
      name: metric.name,
      value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
      rating: metric.rating
    });
  });
  return null;
}
