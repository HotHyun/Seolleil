import { describe, expect, it } from "vitest";
import { sentryBeforeSend } from "@/lib/sentry-config";

describe("Sentry privacy filter", () => {
  it("removes PII, query strings, request bodies, and secret-like context", () => {
    const event = sentryBeforeSend({
      type: undefined,
      user: { id: "user-1", email: "person@example.com", ip_address: "127.0.0.1" },
      request: {
        url: "https://ski.hothyun.com/share/raw-token?secret=value",
        cookies: { session: "secret" },
        data: { password: "secret" },
        headers: { authorization: "Bearer secret", accept: "text/html" }
      },
      extra: { action: "save", shareToken: "raw-token" }
    }, {});

    expect(event.user).toEqual({ id: "user-1" });
    expect(event.request?.url).toBe("https://ski.hothyun.com/share/[REDACTED]");
    expect(event.request?.cookies).toBeUndefined();
    expect(event.request?.data).toBeUndefined();
    expect(event.request?.headers).toEqual({ accept: "text/html" });
    expect(event.extra?.shareToken).toBe("[REDACTED]");
  });
});
