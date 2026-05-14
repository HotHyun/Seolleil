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
  useEffect(() => {
    window.umami?.track(eventName, eventData);
  }, [eventName, eventData]);

  return null;
}

