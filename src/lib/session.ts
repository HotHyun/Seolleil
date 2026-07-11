import { cookies } from "next/headers";
import { getAppwriteConfig } from "@/lib/appwrite";

export const SESSION_COOKIE = "korean_ski_appwrite_session";

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
  const sessionSecret = (await cookies()).get(SESSION_COOKIE)?.value;
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
  return accountFetch<{ secret: string; expire: string }>("/account/sessions/token", undefined, {
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
