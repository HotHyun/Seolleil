import * as Sentry from "@sentry/nextjs";
import { sentryBeforeSend, sentryEnabled } from "@/lib/sentry-config";

// Workers CPU 시간을 지키기 위해 오류 캡처만 남긴 경량 설정이다.
// 서버 트레이싱(OpenTelemetry)과 http/fetch 자동 계측이 CPU의 절반 이상을 써서 1102 오류를 냈기 때문에 끈다.
Sentry.init({
  dsn: process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: sentryEnabled,
  environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
  sendDefaultPii: false,
  beforeSend: sentryBeforeSend,
  skipOpenTelemetrySetup: true,
  defaultIntegrations: false,
  integrations: [],
  tracesSampleRate: 0
});
