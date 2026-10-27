"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onIdTokenChanged, type Auth } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase-client";

export function FirebaseSessionSync() {
  const router = useRouter();

  useEffect(() => {
    let auth: Auth;
    try {
      auth = getFirebaseAuth();
    } catch {
      return;
    }

    let active = true;
    const unsubscribe = onIdTokenChanged(auth, async user => {
      try {
        const response = user
          ? await fetch("/api/auth/session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken: await user.getIdToken() })
            })
          : await fetch("/api/auth/session", { method: "DELETE" });
        if (!response.ok || !active) return;
        const result = await response.json() as { changed?: boolean };
        if (result.changed) router.refresh();
      } catch {
        // Auth state remains available in Firebase; the next token refresh retries the SSR cookie sync.
      }
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [router]);

  return null;
}
