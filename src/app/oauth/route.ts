import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { createSessionFromToken, SESSION_COOKIE } from "@/lib/session";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const secret = request.nextUrl.searchParams.get("secret");
  const callbackUrl = request.nextUrl.searchParams.get("callbackUrl") ?? "/my-trips";
  const safeCallbackUrl = callbackUrl.startsWith("/") ? callbackUrl : "/my-trips";

  if (!userId || !secret) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(safeCallbackUrl)}`, request.url));
  }

  const session = await createSessionFromToken(userId, secret);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    expires: new Date(session.expire)
  });

  return NextResponse.redirect(new URL(safeCallbackUrl, request.url));
}
