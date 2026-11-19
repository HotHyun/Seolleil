"use client";

import * as React from "react";
import { recordExternalLinkClickAction } from "@/app/actions";
import { resolveOutboundLink } from "@/lib/affiliate";

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
  href,
  rel,
  ...props
}: AnalyticsLinkProps) {
  // 외부 링크만 제휴 파라미터 대상이다. 내부 경로(/plan 등)는 그대로 둔다.
  const outbound = href && /^https?:\/\//i.test(href) ? resolveOutboundLink(href) : null;
  const finalHref = outbound?.href ?? href;
  const finalRel = outbound?.affiliate ? [rel, "sponsored"].filter(Boolean).join(" ") : rel;
  const trackedData = outbound?.provider
    ? { ...eventData, provider: outbound.provider, category: outbound.category ?? "", affiliate: outbound.affiliate }
    : eventData;

  return (
    <a
      {...props}
      href={finalHref}
      rel={finalRel}
      data-affiliate={outbound?.affiliate ? "true" : undefined}
      onClick={(event) => {
        window.umami?.track(eventName, trackedData);
        const data = new FormData();
        data.set("eventName", eventName);
        data.set("href", String(href ?? ""));
        for (const [key, value] of Object.entries(trackedData ?? {})) {
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
