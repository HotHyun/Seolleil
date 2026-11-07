"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { onIdTokenChanged, type Auth, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase-client";

type FirebaseSessionContextValue = {
  user: User | null;
  ready: boolean;
  sessionReady: boolean;
  sessionError: boolean;
  isAuthenticated: boolean;
  syncSession: (user: User | null, forceRefresh?: boolean) => Promise<{ changed: boolean }>;
};

const FirebaseSessionContext = createContext<FirebaseSessionContextValue | null>(null);

export function FirebaseSessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
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
    let auth: Auth;
    try {
      auth = getFirebaseAuth();
    } catch {
      setReady(true);
      setSessionReady(true);
      return;
    }

    let active = true;
    let generation = 0;
    const unsubscribe = onIdTokenChanged(auth, async user => {
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
    return () => {
      active = false;
      unsubscribe();
    };
  }, [router, syncSession]);

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
