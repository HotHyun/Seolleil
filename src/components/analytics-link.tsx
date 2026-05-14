"use client";

import * as React from "react";

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, unknown>) => void;
    };
  }
}

type AnalyticsLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName: string;
  eventData?: Record<string, unknown>;
};

export function AnalyticsLink({
  eventName,
  eventData,
  onClick,
  ...props
}: AnalyticsLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        window.umami?.track(eventName, eventData);
        onClick?.(event);
      }}
    />
  );
}

