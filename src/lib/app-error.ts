import * as Sentry from "@sentry/nextjs";

export const errorCatalog = {
  AUTH_REQUIRED: { message: "로그인이 필요합니다. 로그인 후 다시 시도해 주세요.", retryable: false },
  EMAIL_NOT_VERIFIED: { message: "이메일 인증을 완료한 뒤 다시 시도해 주세요.", retryable: false },
  FORBIDDEN: { message: "이 작업을 수행할 권한이 없습니다.", retryable: false },
  NOT_FOUND: { message: "요청한 정보를 찾을 수 없습니다. 화면을 새로고침해 주세요.", retryable: false },
  INVALID_INPUT: { message: "입력한 내용을 확인해 주세요.", retryable: false },
  CONFLICT: { message: "이미 처리됐거나 현재 상태와 충돌합니다. 화면을 새로고침해 주세요.", retryable: false },
  EMAIL_DELIVERY_FAILED: { message: "메일을 보내지 못했습니다. 잠시 후 다시 시도해 주세요.", retryable: true },
  NETWORK_ERROR: { message: "서버에 연결하지 못했습니다. 인터넷 연결을 확인하고 다시 시도해 주세요.", retryable: true },
  SERVICE_UNAVAILABLE: { message: "서비스가 잠시 불안정합니다. 잠시 후 다시 시도해 주세요.", retryable: true },
  UNKNOWN: { message: "예상하지 못한 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.", retryable: true }
} as const;

export type AppErrorCode = keyof typeof errorCatalog;
export type ActionResult<T = undefined> = { ok: true; message: string; data?: T } | { ok: false; code: AppErrorCode; message: string; retryable: boolean; incidentId: string };
export type ErrorContext = Record<string, unknown>;
export type ErrorReport = { incidentId: string; code: AppErrorCode; context: ErrorContext; error: unknown; timestamp: string };
export type ErrorReporter = { capture: (report: ErrorReport) => void | Promise<void> };

const consoleReporter: ErrorReporter = {
  capture(report) {
    const safeError = report.error instanceof Error
      ? { name: report.error.name, message: redactLogText(report.error.message), stack: redactLogText(report.error.stack ?? "") }
      : redactLogText(String(report.error));
    console.error(JSON.stringify({
      level: "error",
      ...report,
      error: safeError
    }));
  }
};

function redactLogText(value: string) {
  return value
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[REDACTED_EMAIL]")
    .replace(/(secret|token|key|password)(["'=:\s]+)[^\s,}"']+/gi, "$1$2[REDACTED]")
    .slice(0, 8_000);
}

export class AppError extends Error {
  constructor(public code: AppErrorCode, message?: string, public cause?: unknown) { super(message ?? errorCatalog[code].message); }
}

export function classifyError(error: unknown): AppErrorCode {
  if (error instanceof AppError) return error.code;
  const text = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  if (text.includes("401") || text.includes("session")) return "AUTH_REQUIRED";
  if (text.includes("403") || text.includes("permission") || text.includes("권한")) return "FORBIDDEN";
  if (text.includes("404") || text.includes("찾을 수 없")) return "NOT_FOUND";
  if (text.includes("409") || text.includes("already") || text.includes("이미")) return "CONFLICT";
  if (text.includes("invalid") || text.includes("입력") || text.includes("올바른")) return "INVALID_INPUT";
  if (text.includes("smtp") || text.includes("email delivery") || text.includes("메일을 보내")) return "EMAIL_DELIVERY_FAILED";
  if (text.includes("fetch") || text.includes("network") || text.includes("connect")) return "NETWORK_ERROR";
  if (/\b(500|502|503|504)\b/.test(text)) return "SERVICE_UNAVAILABLE";
  return "UNKNOWN";
}

export function reportAppError(error: unknown, context: ErrorContext, reporter: ErrorReporter = consoleReporter) {
  const code = classifyError(error);
  const incidentId = crypto.randomUUID();
  void reporter.capture({ incidentId, code, context, error, timestamp: new Date().toISOString() });
  if (process.env.NEXT_PUBLIC_SENTRY_DSN ?? process.env.SENTRY_DSN) {
    Sentry.withScope(scope => {
      scope.setTag("error.code", code);
      scope.setTag("error.incident_id", incidentId);
      scope.setContext("action", context);
      Sentry.captureException(error instanceof Error ? error : new Error(String(error)));
    });
  }
  return { code, incidentId };
}

export function actionFailure(error: unknown, context: ErrorContext): ActionResult {
  const { code, incidentId } = reportAppError(error, context);
  return { ok: false, code, message: error instanceof AppError ? error.message : errorCatalog[code].message, retryable: errorCatalog[code].retryable, incidentId };
}

export function actionSuccess<T = undefined>(message: string, data?: T): ActionResult<T> {
  return { ok: true, message, data };
}
