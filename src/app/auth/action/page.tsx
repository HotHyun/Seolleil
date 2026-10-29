import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FirebaseVerifyEmail } from "@/components/auth/firebase-email-verification";
import { ResetPasswordForm } from "@/components/auth/firebase-password-recovery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "계정 인증 | 설레일",
  robots: { index: false, follow: false }
};

export default async function FirebaseAuthActionPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const value = (key: string) => {
    const item = query[key];
    return Array.isArray(item) ? item[0] ?? "" : item ?? "";
  };
  const mode = value("mode");
  const code = value("oobCode");

  if (mode !== "resetPassword" && mode !== "verifyEmail") notFound();

  return (
    <main className="page-shell grid min-h-[70vh] place-items-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle>{mode === "resetPassword" ? "비밀번호 재설정" : "이메일 인증"}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {mode === "resetPassword"
            ? <ResetPasswordForm code={code} />
            : <Suspense fallback={<p className="text-sm text-muted-foreground">인증 상태를 확인하고 있습니다…</p>}><FirebaseVerifyEmail /></Suspense>}
          <a href="/login"><Button variant="ghost" className="w-full">로그인으로 이동</Button></a>
        </CardContent>
      </Card>
    </main>
  );
}
