"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FirebaseAuthForms } from "@/components/auth/firebase-auth-forms";
import { safeCallbackPath } from "@/lib/safe-redirect";
import { useFirebaseSession } from "@/components/auth/firebase-session-sync";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, sessionError } = useFirebaseSession();
  const callbackUrlValue = searchParams.get("callbackUrl");
  const callbackUrl = safeCallbackPath(callbackUrlValue);
  const mode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const error = searchParams.get("error") ?? undefined;
  const notice = searchParams.get("notice");

  useEffect(() => {
    if (isAuthenticated) router.replace(callbackUrl);
  }, [callbackUrl, isAuthenticated, router]);

  if (isAuthenticated) {
    return <main className="page-shell py-10" aria-live="polite">내 트립으로 이동하고 있어요.</main>;
  }

  return (
    <main className="page-shell grid min-h-[70vh] place-items-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">내 트립 저장하기</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm leading-6 text-muted-foreground">Google 계정 또는 이메일로 로그인하면 트립을 안전하게 저장하고 동행자를 초대할 수 있습니다.</p>
          {notice ? <p className="rounded-lg border bg-muted/50 p-3 text-sm">{notice}</p> : null}
          {user?.emailVerified && sessionError ? <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm font-semibold text-destructive">로그인 상태를 저장하지 못했습니다. 다시 로그인해 주세요.</p> : null}
          <FirebaseAuthForms mode={mode} callbackUrl={callbackUrl} initialError={error} />
          <p className="text-xs leading-5 text-muted-foreground">로그인하거나 가입하면 <Link href="/terms" className="font-semibold underline underline-offset-2">이용약관</Link>과 <Link href="/privacy" className="font-semibold underline underline-offset-2">개인정보처리방침</Link>에 동의한 것으로 봅니다.</p>
        </CardContent>
      </Card>
    </main>
  );
}
