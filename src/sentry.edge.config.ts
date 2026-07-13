import * as Sentry from "@sentry/nextjs";
import { sentryBeforeSend, sentryEnabled } from "@/lib/sentry-config";

Sentry.init({
  dsn: process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: sentryEnabled,
  environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
  sendDefaultPii: false,
  beforeSend: sentryBeforeSend,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 0
});
