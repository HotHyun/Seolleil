import { describe, expect, it, vi } from "vitest";
import { AppError, actionFailure, classifyError, reportAppError } from "@/lib/app-error";

describe("application error handling", () => {
  it("preserves explicit product error codes", () => {
    expect(classifyError(new AppError("EMAIL_NOT_VERIFIED"))).toBe("EMAIL_NOT_VERIFIED");
  });

  it("classifies common infrastructure failures", () => {
    expect(classifyError(new Error("fetch failed: network connect"))).toBe("NETWORK_ERROR");
    expect(classifyError(new Error("Appwrite 503"))).toBe("SERVICE_UNAVAILABLE");
    expect(classifyError(new Error("SMTP email failed"))).toBe("EMAIL_DELIVERY_FAILED");
    expect(classifyError(new Error("올바른 이메일을 입력해 주세요."))).toBe("INVALID_INPUT");
  });

  it("returns safe guidance and a traceable incident id", () => {
    const result = actionFailure(new Error("Appwrite 503 internal details"), { action: "saveTrip" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("SERVICE_UNAVAILABLE");
      expect(result.message).not.toContain("internal details");
      expect(result.incidentId).toMatch(/[0-9a-f-]{36}/);
    }
  });

  it("supports swapping in a Sentry-compatible reporter", () => {
    const capture = vi.fn();
    const result = reportAppError(new AppError("FORBIDDEN"), { action: "share" }, { capture });
    expect(result.code).toBe("FORBIDDEN");
    expect(capture).toHaveBeenCalledWith(expect.objectContaining({ code: "FORBIDDEN", context: { action: "share" } }));
  });
});
