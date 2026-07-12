import { NextResponse, type NextRequest } from "next/server";
import { createSessionFromToken, LEGACY_SESSION_COOKIE, sessionCookieName } from "@/lib/session";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const secret = request.nextUrl.searchParams.get("secret");
  const callbackUrl = request.nextUrl.searchParams.get("callbackUrl") ?? "/my-trips";
  const safeCallbackUrl = callbackUrl.startsWith("/") ? callbackUrl : "/my-trips";

  if (!userId || !secret) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(safeCallbackUrl)}`, request.url));
  }

  const session = await createSessionFromToken(userId, secret);
  const response = NextResponse.redirect(new URL(safeCallbackUrl, request.url));
  response.cookies.set(sessionCookieName(), session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    expires: new Date(session.expire)
  });
  response.cookies.delete(LEGACY_SESSION_COOKIE);

  return response;
}
