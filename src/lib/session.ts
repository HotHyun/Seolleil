import { cookies } from "next/headers";
import { appwriteHeaders, getAppwriteConfig } from "@/lib/appwrite";

export const LEGACY_SESSION_COOKIE = "korean_ski_appwrite_session";

export type AppSession = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
};

type AppwriteAccount = {
  $id: string;
  name?: string;
  email?: string;
};

export async function getSession(): Promise<AppSession | null> {
  const sessionSecret = await getSessionSecret();
  if (!sessionSecret) return null;

  try {
    const account = await accountFetch<AppwriteAccount>("/account", sessionSecret);
    return {
      user: {
        id: account.$id,
        name: account.name ?? null,
        email: account.email ?? null
      }
    };
  } catch {
    return null;
  }
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
