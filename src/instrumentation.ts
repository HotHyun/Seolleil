import * as Sentry from "@sentry/nextjs";

// 서버 오류만 수집하는 경량 Sentry(src/sentry.server.config.ts). 켠 뒤 Workers CPU 시간 p50·오류율을 확인한다.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") await import("./sentry.server.config");
}

export const onRequestError = Sentry.captureRequestError;
