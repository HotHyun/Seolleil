import "server-only";

import { cookies } from "next/headers";
import { verifyFirebaseIdToken, type FirebaseIdTokenClaims } from "@/lib/firebase-auth-token";

export const FIREBASE_SESSION_COOKIE = "korean_ski_firebase_session";
const LEGACY_APPWRITE_COOKIE = "korean_ski_appwrite_session";

export type AppSession = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    emailVerified?: boolean;
  };
};

export function isAccountEligibleForProduct(account: { email_verified?: boolean }) {
  return account.email_verified === true;
}

export async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(FIREBASE_SESSION_COOKIE)?.value ?? null;
}

export async function getSession() {
  const token = await getSessionToken();
  if (!token) return null;
  try {
    const claims: FirebaseIdTokenClaims = await verifyFirebaseIdToken(token);
    if (!isAccountEligibleForProduct(claims)) return null;
    return {
      user: {
        id: claims.sub,
        name: claims.name ?? null,
        email: claims.email ?? null,
        emailVerified: claims.email_verified === true
      }
    } satisfies AppSession;
  } catch {
    return null;
  }
}

export async function clearLegacyAppwriteCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(LEGACY_APPWRITE_COOKIE);
  cookieStore.delete("a_session_6a51f3aa001a21fd4dbb");
}
