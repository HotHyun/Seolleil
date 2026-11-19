"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "firebase/auth";

type FirebaseSessionContextValue = {
  user: User | null;
  ready: boolean;
  sessionReady: boolean;
  sessionError: boolean;
  isAuthenticated: boolean;
  syncSession: (user: User | null, forceRefresh?: boolean) => Promise<{ changed: boolean }>;
};

const FirebaseSessionContext = createContext<FirebaseSessionContextValue | null>(null);

// 로그인·인증 흐름이 있는 화면. 여기서는 SDK를 바로 불러온다.
const AUTH_ROUTE_PREFIXES = ["/login", "/oauth", "/verify-email", "/reset-password", "/forgot-password", "/auth", "/invite"];

// Firebase Auth는 로그인 정보를 IndexedDB(firebaseLocalStorageDb)에 저장한다. 그 DB가 없으면 로그인한 적 없는 방문자다.
async function mayHavePersistedAuth() {
  try {
    if (typeof indexedDB === "undefined" || typeof indexedDB.databases !== "function") return true;
    const databases = await indexedDB.databases();
    return databases.some(database => database.name === "firebaseLocalStorageDb");
  } catch {
    return true;
  }
}

export function FirebaseSessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authWanted, setAuthWanted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState(false);
  const hasSeenUser = useRef(false);
  const lastSyncedToken = useRef<string | null | undefined>(undefined);
  const syncQueue = useRef(Promise.resolve());
  const pendingSyncs = useRef(new Map<string, Promise<{ changed: boolean }>>());

  const syncSession = useCallback(async (nextUser: User | null, forceRefresh = false) => {
    const idToken = nextUser ? await nextUser.getIdToken(forceRefresh) : null;
    const key = idToken ?? "__signed_out__";
    const pending = pendingSyncs.current.get(key);
    if (pending) return pending;
    if (lastSyncedToken.current === idToken) return { changed: false };

    const request = syncQueue.current.then(async () => {
      if (lastSyncedToken.current === idToken) return { changed: false };

      const response = idToken
        ? await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken })
          })
        : await fetch("/api/auth/session", { method: "DELETE" });
      if (!response.ok) throw new Error("Firebase session sync failed.");
      const result = await response.json() as { changed?: boolean };
      lastSyncedToken.current = idToken;
      return { changed: Boolean(result.changed) };
    });

    pendingSyncs.current.set(key, request);
    syncQueue.current = request.then(() => undefined, () => undefined);
    try {
      return await request;
    } finally {
      if (pendingSyncs.current.get(key) === request) pendingSyncs.current.delete(key);
    }
  }, []);

  useEffect(() => {
    if (AUTH_ROUTE_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 인증 화면에 들어오면 SDK 로딩을 켠다
      setAuthWanted(true);
    }
  }, [pathname]);

  useEffect(() => {
    // 로그인한 적 없는 익명 방문자는 Firebase SDK(약 130KB+iframe)를 첫 화면에서 불러오지 않는다.
    let cancelled = false;
    void mayHavePersistedAuth().then(persisted => {
      if (cancelled) return;
      if (persisted) {
        setAuthWanted(true);
      } else {
        setReady(true);
        setSessionReady(true);
      }
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!authWanted) return;
    let active = true;
    let generation = 0;
    let unsubscribe: (() => void) | undefined;

    // Firebase SDK는 하이드레이션 이후에 따로 불러와 모든 페이지의 첫 번들에서 뺀다.
    void (async () => {
      let modules: [typeof import("firebase/auth"), typeof import("@/lib/firebase-client")];
      try {
        modules = await Promise.all([import("firebase/auth"), import("@/lib/firebase-client")]);
      } catch {
        if (!active) return;
        setReady(true);
        setSessionReady(true);
        return;
      }
      if (!active) return;
      const [{ onIdTokenChanged }, { getFirebaseAuth }] = modules;
      let auth: ReturnType<typeof getFirebaseAuth>;
      try {
        auth = getFirebaseAuth();
      } catch {
        setReady(true);
        setSessionReady(true);
        return;
      }

      unsubscribe = onIdTokenChanged(auth, async user => {
        if (!active) return;
        const currentGeneration = ++generation;
        setUser(user);
        setReady(true);
        setSessionError(false);

        if (user) {
          hasSeenUser.current = true;
        } else if (!hasSeenUser.current) {
          // Anonymous public visits do not need a server session request.
          setSessionReady(true);
          return;
        } else {
          hasSeenUser.current = false;
        }

        setSessionReady(false);
        try {
          const result = await syncSession(user);
          if (!active || currentGeneration !== generation) return;
          setSessionReady(true);
          if (result.changed && !user) router.refresh();
        } catch {
          if (active && currentGeneration === generation) setSessionError(true);
        }
      });
    })();

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [authWanted, router, syncSession]);

  const value = useMemo(() => ({
    user,
    ready,
    sessionReady,
    sessionError,
    isAuthenticated: Boolean(user?.emailVerified && sessionReady),
    syncSession
  }), [user, ready, sessionReady, sessionError, syncSession]);

  return <FirebaseSessionContext.Provider value={value}>{children}</FirebaseSessionContext.Provider>;
}

export function useFirebaseSession() {
  const value = useContext(FirebaseSessionContext);
  if (!value) throw new Error("useFirebaseSession must be used inside FirebaseSessionProvider.");
  return value;
}
