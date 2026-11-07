"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useFirebaseSession } from "@/components/auth/firebase-session-sync";
import { getFirebaseAuth } from "@/lib/firebase-client";

export function FirebaseSignOutButton() {
  const router = useRouter();
  const { syncSession } = useFirebaseSession();
  return <button type="button" className="relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-none transition hover:bg-muted focus:bg-muted" onClick={async () => {
    try {
      await signOut(getFirebaseAuth());
    } catch {
      // Clear the server session even if local Firebase sign-out cannot complete.
    }
    try {
      await syncSession(null);
    } finally {
      router.push("/");
    }
  }}><LogOut className="h-4 w-4" /> 로그아웃</button>;
}
