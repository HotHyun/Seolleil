"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { confirmPasswordReset, sendPasswordResetEmail, verifyPasswordResetCode } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { getFirebaseAuth } from "@/lib/firebase-client";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [configurationError, setConfigurationError] = useState(false);
  const [pending, setPending] = useState(false);
  return <>{sent ? null : <form className="space-y-3" onSubmit={async event => {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim().toLowerCase();
    try {
      await sendPasswordResetEmail(getFirebaseAuth(), email, {
        url: `${window.location.origin}/login?notice=${encodeURIComponent("비밀번호 재설정을 완료한 뒤 로그인해 주세요.")}`
      });
    } catch (error) {
      // Keep the same response whether or not an account exists.
      if (error instanceof Error && error.message.includes("Firebase 웹 앱 설정")) setConfigurationError(true);
    } finally {
      setSent(true);
      setPending(false);
    }
  }}><p className="text-sm text-muted-foreground">Firebase가 재설정 메일을 보냅니다.</p><Input name="email" type="email" aria-label="이메일" placeholder="이메일" required /><Button className="w-full" isLoading={pending} loadingText="메일 요청 중…">재설정 메일 보내기</Button></form>}{sent ? <p role={configurationError ? "alert" : "status"} className={`text-sm ${configurationError ? "text-destructive" : "text-muted-foreground"}`}>{configurationError ? "Firebase 환경 변수를 설정한 뒤 다시 시도해 주세요." : "해당 이메일 계정이 있다면 재설정 링크를 보냈습니다."}</p> : null}</>;
}

export function ResetPasswordForm({ code }: { code: string }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [valid, setValid] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!code) {
      setReady(true);
      return;
    }
    try {
      void verifyPasswordResetCode(getFirebaseAuth(), code).then(() => {
        setValid(true);
        setReady(true);
      }).catch(() => {
        setError("재설정 링크가 만료되었거나 유효하지 않습니다.");
        setReady(true);
      });
    } catch (caught) {
      setError(caught instanceof Error && caught.message.includes("Firebase 웹 앱 설정")
        ? "Firebase 환경 변수를 설정한 뒤 다시 시도해 주세요."
        : "재설정 링크가 만료되었거나 유효하지 않습니다.");
      setReady(true);
    }
  }, [code]);

  if (!ready) return <p className="text-sm text-muted-foreground">재설정 링크를 확인하고 있습니다…</p>;
  if (!valid) return <div className="space-y-3"><p role="alert" className="text-sm text-destructive">{error || "이 페이지는 비밀번호 재설정 메일에서 열어 주세요."}</p><a href="/forgot-password"><Button className="w-full">재설정 메일 다시 받기</Button></a></div>;

  return <form className="space-y-3" onSubmit={async event => {
    event.preventDefault();
    const password = String(new FormData(event.currentTarget).get("password") ?? "");
    if (password.length < 8) { setError("비밀번호는 8자 이상이어야 합니다."); return; }
    setPending(true);
    setError("");
    try {
      await confirmPasswordReset(getFirebaseAuth(), code, password);
      router.replace(`/login?notice=${encodeURIComponent("새 비밀번호를 설정했어요.")}`);
    } catch {
      setError("비밀번호를 변경하지 못했습니다. 재설정 메일을 다시 받아 주세요.");
    } finally {
      setPending(false);
    }
  }}><Input name="password" type="password" minLength={8} autoComplete="new-password" aria-label="새 비밀번호" placeholder="새 비밀번호 (8자 이상)" required />{error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}<Button className="w-full" isLoading={pending} loadingText="비밀번호 저장 중…">비밀번호 저장</Button></form>;
}
