"use server";

import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { confirmEmailVerification, confirmPasswordRecovery, createEmailAccount, createEmailPasswordSession, createEmailVerification, createPasswordRecovery, deleteCurrentSession, getAccountFromSession, getOAuthUrl, getSessionSecret, LEGACY_SESSION_COOKIE, sessionCookieName } from "@/lib/session";
import { acceptTripInvitation } from "@/lib/trip-collaboration";
import { getSession } from "@/lib/session";

function safeCallback(value: FormDataEntryValue | null) {
  const callback = String(value ?? "/my-trips");
  return callback.startsWith("/") && !callback.startsWith("//") ? callback : "/my-trips";
}

async function setSessionCookie(secret: string, expire: string) {
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName(), secret, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires: new Date(expire) });
}

export async function signInWithGoogleAction(formData: FormData) {
  const callbackUrl = String(formData.get("callbackUrl") ?? "/plan");
  const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const safeCallbackUrl = callbackUrl.startsWith("/") ? callbackUrl : "/my-trips";
  const success = `${origin}/oauth?callbackUrl=${encodeURIComponent(safeCallbackUrl)}`;
  const failure = `${origin}/login?callbackUrl=${encodeURIComponent(safeCallbackUrl)}`;
  redirect(getOAuthUrl("google", success, failure));
}

export async function signUpWithEmailAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const callbackUrl = safeCallback(formData.get("callbackUrl"));
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8 || !name) redirect(`/login?mode=signup&error=${encodeURIComponent("이름, 올바른 이메일, 8자 이상의 비밀번호를 입력해 주세요.")}&callbackUrl=${encodeURIComponent(callbackUrl)}`);
  try {
    await createEmailAccount(email, password, name);
    const session = await createEmailPasswordSession(email, password);
    await setSessionCookie(session.secret, session.expire);
    const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    await createEmailVerification(session.secret, `${origin}/verify-email?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  } catch {
    redirect(`/login?mode=signup&error=${encodeURIComponent("가입할 수 없습니다. 이미 사용 중인 이메일인지 확인해 주세요.")}&callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  redirect(`/verify-email/sent?callbackUrl=${encodeURIComponent(callbackUrl)}`);
}

export async function signInWithEmailAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const callbackUrl = safeCallback(formData.get("callbackUrl"));
  let needsVerification = false;
  try {
    const session = await createEmailPasswordSession(email, password);
    await setSessionCookie(session.secret, session.expire);
    const account = await getAccountFromSession(session.secret);
    needsVerification = !account.emailVerification;
    if (needsVerification) {
      const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
      await createEmailVerification(session.secret, `${origin}/verify-email?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }
  } catch {
    redirect(`/login?error=${encodeURIComponent("이메일 또는 비밀번호를 확인해 주세요.")}&callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  if (needsVerification) redirect(`/verify-email/sent?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  redirect(callbackUrl);
}

export async function verifyEmailAction(formData: FormData) {
  const userId = String(formData.get("userId") ?? "");
  const secret = String(formData.get("secret") ?? "");
  const callbackUrl = safeCallback(formData.get("callbackUrl"));
  if (!userId || !secret) redirect(`/login?error=${encodeURIComponent("유효하지 않은 인증 링크입니다.")}`);
  try { await confirmEmailVerification(userId, secret); } catch { redirect(`/login?error=${encodeURIComponent("인증 링크가 만료되었거나 이미 사용되었습니다.")}`); }
  redirect(`${callbackUrl}${callbackUrl.includes("?") ? "&" : "?"}notice=${encodeURIComponent("이메일 인증이 완료됐어요.")}`);
}

export async function acceptTripInvitationAction(formData: FormData) {
  const teamId = String(formData.get("teamId") ?? "");
  const membershipId = String(formData.get("membershipId") ?? "");
  const userId = String(formData.get("userId") ?? "");
  const secret = String(formData.get("secret") ?? "");
  const tripId = String(formData.get("tripId") ?? "");
  const session = await getSession();
  const sessionSecret = await getSessionSecret();
  if (!session?.user || !sessionSecret) {
    const params = new URLSearchParams({ teamId, membershipId, userId, secret, tripId });
    redirect(`/login?callbackUrl=${encodeURIComponent(`/invite/accept?${params}`)}`);
  }
  if (session.user.id !== userId) redirect(`/invite/accept?error=${encodeURIComponent("초대받은 이메일 계정으로 로그인해 주세요.")}`);
  try { await acceptTripInvitation({ sessionSecret, teamId, membershipId, userId, secret }); }
  catch { redirect(`/invite/accept?error=${encodeURIComponent("초대 링크가 만료되었거나 이미 처리되었습니다.")}`); }
  redirect(`/my-trips/${tripId}?notice=${encodeURIComponent("트립 초대를 수락했어요.")}`);
}

export async function requestPasswordRecoveryAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  try { await createPasswordRecovery(email, `${origin}/reset-password`); } catch { /* 동일한 응답으로 계정 존재 여부를 숨긴다. */ }
  redirect(`/forgot-password?sent=1`);
}

export async function resetPasswordAction(formData: FormData) {
  const userId = String(formData.get("userId") ?? "");
  const secret = String(formData.get("secret") ?? "");
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) redirect(`/reset-password?error=${encodeURIComponent("비밀번호는 8자 이상이어야 합니다.")}`);
  try { await confirmPasswordRecovery(userId, secret, password); }
  catch { redirect(`/reset-password?error=${encodeURIComponent("재설정 링크가 만료되었거나 유효하지 않습니다.")}`); }
  redirect(`/login?notice=${encodeURIComponent("새 비밀번호를 설정했어요.")}`);
}

export async function signOutAction() {
  const cookieStore = await cookies();
  const sessionSecret = await getSessionSecret();
  if (sessionSecret) {
    await deleteCurrentSession(sessionSecret).catch(() => undefined);
  }
  cookieStore.delete(sessionCookieName());
  cookieStore.delete(LEGACY_SESSION_COOKIE);
  redirect("/");
}

export async function requireAuthRedirect() {
  redirect("/login");
}
