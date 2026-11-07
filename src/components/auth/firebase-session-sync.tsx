"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { onIdTokenChanged, type Auth, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase-client";

type FirebaseSessionContextValue = {
  user: User | null;
  ready: boolean;
  sessionReady: boolean;
  sessionError: boolean;
  isAuthenticated: boolean;
};

const FirebaseSessionContext = createContext<FirebaseSessionContextValue | null>(null);

export function FirebaseSessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState(false);
  const hasSeenUser = useRef(false);

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
    let syncQueue = Promise.resolve();
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
      syncQueue = syncQueue.then(async () => {
        try {
          const response = user
            ? await fetch("/api/auth/session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken: await user.getIdToken() })
              })
            : await fetch("/api/auth/session", { method: "DELETE" });
          if (!response.ok) throw new Error("Firebase session sync failed.");
          const result = await response.json() as { changed?: boolean };
          if (!active || currentGeneration !== generation) return;
          setSessionReady(true);
          if (result.changed) router.refresh();
        } catch {
          if (active && currentGeneration === generation) setSessionError(true);
        }
      });
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [router]);

  const value = useMemo(() => ({
    user,
    ready,
    sessionReady,
    sessionError,
    isAuthenticated: Boolean(user?.emailVerified && sessionReady)
  }), [user, ready, sessionReady, sessionError]);

  return <FirebaseSessionContext.Provider value={value}>{children}</FirebaseSessionContext.Provider>;
}

export function useFirebaseSession() {
  const value = useContext(FirebaseSessionContext);
  if (!value) throw new Error("useFirebaseSession must be used inside FirebaseSessionProvider.");
  return value;
}
