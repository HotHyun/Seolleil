import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearLegacyAppwriteCookies, FIREBASE_SESSION_COOKIE } from "@/lib/session";
import { verifyFirebaseIdToken } from "@/lib/firebase-auth-token";

// 쿠키를 바꾸는 요청은 같은 사이트에서 보낸 JSON 요청만 받는다(다른 사이트의 폼 전송으로 로그인·로그아웃되는 CSRF 방지).
function isSameOriginRequest(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite) return fetchSite === "same-origin";
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try { return origin === new URL(request.url).origin; } catch { return false; }
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request) || !(request.headers.get("content-type") ?? "").toLowerCase().includes("application/json")) {
    return NextResponse.json({ error: "Invalid request." }, { status: 403 });
  }
  let idToken = "";
  try {
    const body = await request.json() as { idToken?: unknown };
    idToken = typeof body.idToken === "string" ? body.idToken : "";
    if (!idToken || idToken.length > 16_384) return NextResponse.json({ error: "Invalid session token." }, { status: 400 });
    const claims = await verifyFirebaseIdToken(idToken);
    const maxAge = Math.max(0, Math.min(3600, Number(claims.exp ?? 0) - Math.floor(Date.now() / 1000)));
    if (maxAge === 0) return NextResponse.json({ error: "Expired session token." }, { status: 401 });

    const cookieStore = await cookies();
    const changed = cookieStore.get(FIREBASE_SESSION_COOKIE)?.value !== idToken;
    cookieStore.set(FIREBASE_SESSION_COOKIE, idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge
    });
    await clearLegacyAppwriteCookies();
    return NextResponse.json({ changed });
  } catch {
    return NextResponse.json({ error: "Unable to verify Firebase session." }, { status: 401 });
  }
}

export async function DELETE(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Invalid request." }, { status: 403 });
  const cookieStore = await cookies();
  const changed = Boolean(cookieStore.get(FIREBASE_SESSION_COOKIE));
  cookieStore.delete(FIREBASE_SESSION_COOKIE);
  await clearLegacyAppwriteCookies();
  return NextResponse.json({ changed });
}
