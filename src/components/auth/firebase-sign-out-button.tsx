"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useFirebaseSession } from "@/components/auth/firebase-session-sync";

export function FirebaseSignOutButton() {
  const router = useRouter();
  const { syncSession } = useFirebaseSession();
  return <button type="button" className="relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-none transition hover:bg-muted focus:bg-muted" onClick={async () => {
    try {
      // 로그아웃을 누를 때만 Firebase SDK를 불러와 첫 화면 번들에서 뺀다.
      const [{ signOut }, { getFirebaseAuth }] = await Promise.all([import("firebase/auth"), import("@/lib/firebase-client")]);
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
