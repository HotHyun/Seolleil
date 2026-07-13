import { cookies } from "next/headers";
import { appwriteHeaders, getAppwriteConfig } from "@/lib/appwrite";

export const LEGACY_SESSION_COOKIE = "korean_ski_appwrite_session";

export type AppSession = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    emailVerified?: boolean;
  };
};

type AppwriteAccount = {
  $id: string;
  name?: string;
  email?: string;
  emailVerification?: boolean;
};

export async function getSession(): Promise<AppSession | null> {
  const sessionSecret = await getSessionSecret();
  if (!sessionSecret) return null;

  try {
    const account = await accountFetch<AppwriteAccount>("/account", sessionSecret);
    if (!isAccountEligibleForProduct(account)) return null;
    return {
      user: {
        id: account.$id,
        name: account.name ?? null,
        email: account.email ?? null,
        emailVerified: account.emailVerification ?? false
      }
    };
  } catch {
    return null;
  }
}

export function isAccountEligibleForProduct(account: { emailVerification?: boolean }) {
  return account.emailVerification === true;
}

export async function createEmailAccount(email: string, password: string, name: string) {
  return accountFetch<AppwriteAccount>("/account", undefined, {
    method: "POST",
    body: JSON.stringify({ userId: "unique()", email, password, name })
  });
}

export async function createEmailPasswordSession(email: string, password: string) {
  const config = getAppwriteConfig();
  const response = await fetch(`${config.endpoint}/account/sessions/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Appwrite-Project": config.projectId },
    body: JSON.stringify({ email, password }),
    cache: "no-store"
  });
  if (!response.ok) throw new Error(`Appwrite email session failed (${response.status})`);
  const session = await response.json() as { secret?: string; expire: string };
  const cookie = response.headers.get("set-cookie") ?? "";
  const match = cookie.match(new RegExp(`${sessionCookieName()}=([^;]+)`));
  const secret = session.secret || match?.[1];
  if (!secret) throw new Error("Appwrite did not return a session secret.");
  return { secret: decodeURIComponent(secret), expire: session.expire };
}

export async function createEmailVerification(sessionSecret: string, url: string) {
  return accountFetch<void>("/account/verification", sessionSecret, { method: "POST", body: JSON.stringify({ url }) });
}

export async function getAccountFromSession(sessionSecret: string) {
  return accountFetch<AppwriteAccount>("/account", sessionSecret);
}

export async function confirmEmailVerification(userId: string, secret: string) {
  return accountFetch<void>("/account/verification", undefined, { method: "PUT", body: JSON.stringify({ userId, secret }) });
}

export async function createPasswordRecovery(email: string, url: string) {
  return accountFetch<void>("/account/recovery", undefined, { method: "POST", body: JSON.stringify({ email, url }) });
}

export async function confirmPasswordRecovery(userId: string, secret: string, password: string) {
  return accountFetch<void>("/account/recovery", undefined, { method: "PUT", body: JSON.stringify({ userId, secret, password }) });
}

export function getOAuthUrl(provider: "google", success: string, failure: string) {
  const config = getAppwriteConfig();
  const url = new URL(`${config.endpoint}/account/tokens/oauth2/${provider}`);
  url.searchParams.set("project", config.projectId);
  url.searchParams.set("success", success);
  url.searchParams.set("failure", failure);
  return url.toString();
}

export async function createSessionFromToken(userId: string, secret: string) {
  return accountAdminFetch<{ secret: string; expire: string }>("/account/sessions/token", {
    method: "POST",
    body: JSON.stringify({ userId, secret })
  });
}

export async function deleteCurrentSession(sessionSecret: string) {
  await accountFetch<void>("/account/sessions/current", sessionSecret, { method: "DELETE" });
}

async function accountFetch<T>(path: string, sessionSecret?: string, init: RequestInit = {}) {
  const config = getAppwriteConfig();
  const response = await fetch(`${config.endpoint}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Appwrite-Project": config.projectId,
      ...(sessionSecret ? { "X-Appwrite-Session": sessionSecret } : {}),
      ...(init.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Appwrite account request failed (${response.status}) ${path}: ${body}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function appwriteSessionFetch<T>(path: string, sessionSecret: string, init: RequestInit = {}) {
  return accountFetch<T>(path, sessionSecret, init);
}

async function accountAdminFetch<T>(path: string, init: RequestInit = {}) {
  const config = getAppwriteConfig();
  const response = await fetch(`${config.endpoint}${path}`, {
    ...init,
    headers: {
      ...appwriteHeaders(config),
      ...(init.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Appwrite admin account request failed (${response.status}) ${path}: ${body}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function sessionCookieName() {
  return `a_session_${getAppwriteConfig().projectId}`;
}

export async function getSessionSecret() {
  const cookieStore = await cookies();
  return cookieStore.get(sessionCookieName())?.value ?? cookieStore.get(LEGACY_SESSION_COOKIE)?.value;
}
