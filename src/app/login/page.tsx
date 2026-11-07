import type { Metadata } from "next";
import { Suspense } from "react";
import { FirebaseAuthForms } from "@/components/auth/firebase-auth-forms";
import { LoginPageContent } from "@/components/auth/login-page-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "로그인 | 설레일"
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageFallback() {
  return (
    <main className="page-shell grid min-h-[70vh] place-items-center py-10" aria-busy="true">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle className="text-3xl font-black">내 트립 저장하기</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm leading-6 text-muted-foreground">Google 계정 또는 이메일로 로그인하면 트립을 안전하게 저장하고 동행자를 초대할 수 있습니다.</p>
          <FirebaseAuthForms mode="login" callbackUrl="/my-trips" />
        </CardContent>
      </Card>
    </main>
  );
}
