"use client";

import { useSearchParams } from "next/navigation";
import { FirebaseVerifyEmail } from "@/components/auth/firebase-email-verification";
import { ResetPasswordForm } from "@/components/auth/firebase-password-recovery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FirebaseAuthActionContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const code = searchParams.get("oobCode") ?? "";
  const supportedMode = mode === "resetPassword" || mode === "verifyEmail";

  return (
    <main className="page-shell grid min-h-[70vh] place-items-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{mode === "resetPassword" ? "비밀번호 재설정" : "이메일 인증"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!supportedMode
            ? <p role="alert" className="text-sm text-destructive">지원하지 않는 인증 링크입니다. 새 링크를 요청해 주세요.</p>
            : mode === "resetPassword"
              ? <ResetPasswordForm code={code} />
              : <FirebaseVerifyEmail />}
          <a href="/login"><Button variant="ghost" className="w-full">로그인으로 이동</Button></a>
        </CardContent>
      </Card>
    </main>
  );
}
