"use server";

import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { deleteCurrentSession, getOAuthUrl, SESSION_COOKIE } from "@/lib/session";

export async function signInWithGoogleAction(formData: FormData) {
  const callbackUrl = String(formData.get("callbackUrl") ?? "/plan");
  const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const safeCallbackUrl = callbackUrl.startsWith("/") ? callbackUrl : "/my-trips";
  const success = `${origin}/oauth?callbackUrl=${encodeURIComponent(safeCallbackUrl)}`;
  const failure = `${origin}/login?callbackUrl=${encodeURIComponent(safeCallbackUrl)}`;
  redirect(getOAuthUrl("google", success, failure));
}

export async function signOutAction() {
  const cookieStore = await cookies();
  const sessionSecret = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionSecret) {
    await deleteCurrentSession(sessionSecret).catch(() => undefined);
  }
  cookieStore.delete(SESSION_COOKIE);
  redirect("/");
}

export async function requireAuthRedirect() {
  redirect("/login");
}
