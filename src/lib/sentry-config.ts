import type { ErrorEvent, EventHint } from "@sentry/nextjs";

const sensitiveKey = /authorization|cookie|secret|token|password|api[-_]?key/i;

export function sentryBeforeSend(event: ErrorEvent, _hint: EventHint) {
  if (event.user) {
    event.user = event.user.id ? { id: event.user.id } : undefined;
  }
  if (event.request) {
    event.request.cookies = undefined;
    event.request.data = undefined;
    if (event.request.headers) {
      event.request.headers = Object.fromEntries(
        Object.entries(event.request.headers).filter(([key]) => !sensitiveKey.test(key))
      );
    }
    if (event.request.url) {
      try {
        const url = new URL(event.request.url);
        url.search = "";
        url.pathname = url.pathname
          .replace(/^\/(share|trips)\/[^/]+/, "/$1/[REDACTED]")
          .replace(/^\/(verify-email|reset-password|invite\/accept).*/, "/$1");
        event.request.url = url.toString();
      } catch { event.request.url = undefined; }
    }
  }
  event.extra = redactRecord(event.extra);
  event.contexts = redactRecord(event.contexts);
  return event;
}

function redactRecord<T extends Record<string, unknown> | undefined>(record: T): T {
  if (!record) return record;
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key, sensitiveKey.test(key) ? "[REDACTED]" : value])
  ) as T;
}

export const sentryEnabled = Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN ?? process.env.SENTRY_DSN);
