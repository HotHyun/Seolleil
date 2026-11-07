"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { useFirebaseSession } from "@/components/auth/firebase-session-sync";
import { getFirebaseAuth } from "@/lib/firebase-client";

export function FirebaseAuthForms({ mode, callbackUrl, initialError }: { mode: "login" | "signup"; callbackUrl: string; initialError?: string }) {
  const router = useRouter();
  const { syncSession } = useFirebaseSession();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(initialError ?? "");

  async function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "").trim();
    try {
      const auth = getFirebaseAuth();
      const credential = mode === "signup"
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);
      if (mode === "signup") {
        await updateProfile(credential.user, { displayName: name });
        await sendEmailVerification(credential.user, { url: `${window.location.origin}/verify-email?callbackUrl=${encodeURIComponent(callbackUrl)}` });
      } else if (!credential.user.emailVerified) {
        await sendEmailVerification(credential.user, { url: `${window.location.origin}/verify-email?callbackUrl=${encodeURIComponent(callbackUrl)}` });
      }
      await syncSession(credential.user);
      if (mode === "signup" || !credential.user.emailVerified) {
        router.push(`/verify-email/sent?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      } else {
        router.push(callbackUrl);
      }
    } catch (caught) {
      setError(authMessage(caught));
    } finally {
      setPending(false);
    }
  }

  async function handleGoogleSignIn() {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const credential = await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
      await syncSession(credential.user);
      router.push(callbackUrl);
    } catch (caught) {
      setError(authMessage(caught));
    } finally {
      setPending(false);
    }
  }

  return <div className="space-y-5">
    <Button type="button" className="w-full" isLoading={pending} loadingText="로그인 중…" onClick={handleGoogleSignIn}>Google로 계속하기</Button>
    <div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />또는<span className="h-px flex-1 bg-border" /></div>
    <form onSubmit={handleEmailSubmit} className="space-y-3">
      {mode === "signup" ? <Input name="name" autoComplete="name" placeholder="이름" aria-label="이름" required /> : null}
      <Input name="email" type="email" autoComplete="email" placeholder="이메일" aria-label="이메일" required />
      <Input name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={8} placeholder="비밀번호 (8자 이상)" aria-label="비밀번호" required />
      {error ? <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm font-semibold text-destructive">{error}</p> : null}
      <Button type="submit" variant="secondary" className="w-full" isLoading={pending} loadingText={mode === "signup" ? "가입 처리 중…" : "로그인 중…"}>{mode === "signup" ? "이메일로 가입하기" : "이메일로 로그인"}</Button>
    </form>
    <a className="block text-center text-sm font-semibold text-primary" href={`/login?mode=${mode === "signup" ? "login" : "signup"}&callbackUrl=${encodeURIComponent(callbackUrl)}`}>
      {mode === "signup" ? "이미 계정이 있나요? 로그인" : "처음이신가요? 이메일로 가입"}
    </a>
    {mode === "login" ? <a className="block text-center text-sm text-muted-foreground" href="/forgot-password">비밀번호를 잊으셨나요?</a> : null}
  </div>;
}

function authMessage(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  if (code === "auth/unauthorized-domain") return "Firebase Authentication에 현재 도메인을 허용해 주세요.";
  if (code === "auth/popup-closed-by-user") return "Google 로그인이 취소되었습니다.";
  if (code === "auth/email-already-in-use") return "이미 사용 중인 이메일입니다. 로그인해 주세요.";
  if (code === "auth/weak-password") return "비밀번호는 8자 이상으로 설정해 주세요.";
  if (code.startsWith("auth/invalid-credential") || code === "auth/user-not-found" || code === "auth/wrong-password") return "이메일 또는 비밀번호를 확인해 주세요.";
  if (error instanceof Error && error.message.includes("Firebase 웹 앱 설정")) return "Firebase 환경 변수를 설정한 뒤 다시 시도해 주세요.";
  return "인증을 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.";
}
