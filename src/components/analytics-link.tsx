"use client";

import * as React from "react";
import { recordExternalLinkClickAction } from "@/app/actions";

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
        const data = new FormData();
        data.set("eventName", eventName);
        data.set("href", String(props.href ?? ""));
        for (const [key, value] of Object.entries(eventData ?? {})) {
          if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
            data.set(key, String(value));
          }
        }
        React.startTransition(() => {
          void recordExternalLinkClickAction(data);
        });
        onClick?.(event);
      }}
    />
  );
}
