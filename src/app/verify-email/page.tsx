import { Suspense } from "react";
import { FirebaseVerifyEmail } from "@/components/auth/firebase-email-verification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyEmailPage() {
  return <main className="page-shell grid min-h-[70vh] place-items-center py-10"><Card className="w-full max-w-md"><CardHeader><CardTitle>이메일 인증</CardTitle></CardHeader><CardContent className="space-y-4"><p className="text-sm text-muted-foreground">인증 링크를 열면 이메일 인증이 완료됩니다.</p><Suspense fallback={<p className="text-sm text-muted-foreground">인증 상태를 확인하고 있습니다…</p>}><FirebaseVerifyEmail /></Suspense></CardContent></Card></main>;
}
