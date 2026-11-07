"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, sendEmailVerification, applyActionCode } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useFirebaseSession } from "@/components/auth/firebase-session-sync";
import { getFirebaseAuth } from "@/lib/firebase-client";

export function FirebaseVerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { syncSession } = useFirebaseSession();
  const [status, setStatus] = useState<"loading" | "verified" | "signed_out" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    let callbackValue = searchParams.get("callbackUrl") ?? "/my-trips";
    const continueUrl = searchParams.get("continueUrl");
    if (continueUrl) {
      try {
        const continued = new URL(continueUrl);
        callbackValue = continued.searchParams.get("callbackUrl") ?? `${continued.pathname}${continued.search}${continued.hash}`;
      } catch {
        callbackValue = "/my-trips";
      }
    }
    const callbackUrl = callbackValue.startsWith("/") && !callbackValue.startsWith("//") ? callbackValue : "/my-trips";
    let auth;
    try { auth = getFirebaseAuth(); }
    catch { setStatus("error"); setMessage("Firebase 환경 변수를 먼저 설정해 주세요."); return; }
    const oobCode = searchParams.get("oobCode");
    let handlingActionCode = false;

    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (oobCode) {
        if (handlingActionCode) return;
        handlingActionCode = true;
        try {
          await applyActionCode(auth, oobCode);
          await user?.reload();
          if (!active) return;
          if (user) {
            await syncSession(user, true);
            setStatus("verified");
            router.replace(`${callbackUrl}${callbackUrl.includes("?") ? "&" : "?"}notice=${encodeURIComponent("이메일 인증이 완료됐어요.")}`);
          } else {
            setStatus("signed_out");
          }
        } catch {
          if (active) { setStatus("error"); setMessage("인증 링크가 만료되었거나 이미 사용되었습니다."); }
        }
        return;
      }
      if (user) {
        try {
          await user.reload();
          if (user.emailVerified) {
            await syncSession(user, true);
            if (!active) return;
            setStatus("verified");
            router.replace(`${callbackUrl}${callbackUrl.includes("?") ? "&" : "?"}notice=${encodeURIComponent("이메일 인증이 완료됐어요.")}`);
          } else if (active) setStatus("loading");
        } catch {
          if (active) { setStatus("error"); setMessage("인증 상태를 확인하지 못했습니다."); }
        }
      } else if (active) {
        setStatus("signed_out");
      }
    });
    return () => { active = false; unsubscribe(); };
  }, [router, searchParams, syncSession]);

  return <div className="space-y-4">
    <p className="text-sm text-muted-foreground">{status === "loading" ? "이메일 인증 상태를 확인하고 있습니다…" : status === "verified" ? "이메일 인증이 완료됐습니다." : status === "signed_out" ? "이메일 인증은 처리됐습니다. 계정으로 로그인해 주세요." : message}</p>
    {status === "signed_out" || status === "error" ? <a href="/login"><Button className="w-full">로그인으로 이동</Button></a> : null}
  </div>;
}

export function ResendFirebaseVerification({ callbackUrl }: { callbackUrl: string }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  return <div className="space-y-2">
    <Button variant="secondary" className="w-full" disabled={pending} onClick={async () => {
      setPending(true);
      setMessage("");
      try {
        const auth = getFirebaseAuth();
        const user = auth.currentUser;
        if (!user) { setMessage("다시 로그인한 뒤 인증 메일을 요청해 주세요."); return; }
        await sendEmailVerification(user, { url: `${window.location.origin}/verify-email?callbackUrl=${encodeURIComponent(callbackUrl)}` });
        setMessage("인증 메일을 다시 보냈어요.");
      } catch {
        setMessage("인증 메일을 다시 보내지 못했습니다. 잠시 후 다시 시도해 주세요.");
      } finally {
        setPending(false);
      }
    }}>{pending ? "메일 보내는 중…" : "인증 메일 다시 보내기"}</Button>
    {message ? <p role="status" className="text-center text-sm text-muted-foreground">{message}</p> : null}
  </div>;
}
