"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, unknown>) => void;
    };
  }
}

export function AnalyticsTrack({
  eventName,
  eventData
}: {
  eventName: string;
  eventData?: Record<string, unknown>;
}) {
  // 인라인 객체가 렌더마다 새로 만들어져도 같은 값이면 이벤트를 다시 보내지 않는다.
  const dataKey = JSON.stringify(eventData ?? null);
  useEffect(() => {
    window.umami?.track(eventName, dataKey === "null" ? undefined : (JSON.parse(dataKey) as Record<string, unknown>));
  }, [eventName, dataKey]);

  return null;
}

