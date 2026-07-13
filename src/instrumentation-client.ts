import * as Sentry from "@sentry/nextjs";
import { sentryBeforeSend } from "@/lib/sentry-config";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
  sendDefaultPii: false,
  beforeSend: sentryBeforeSend,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
