import type { Metadata } from "next";
import { Suspense } from "react";
import { FirebaseAuthActionContent } from "@/components/auth/firebase-auth-action-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "계정 인증 | 설레일",
  robots: { index: false, follow: false }
};

export default function FirebaseAuthActionPage() {
  return (
    <Suspense fallback={<FirebaseAuthActionFallback />}>
      <FirebaseAuthActionContent />
    </Suspense>
  );
}

function FirebaseAuthActionFallback() {
  return (
    <main className="page-shell grid min-h-[70vh] place-items-center py-10" aria-busy="true">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle>계정 인증</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">인증 링크를 확인하고 있습니다…</p>
          <a href="/login"><Button variant="ghost" className="w-full">로그인으로 이동</Button></a>
        </CardContent>
      </Card>
    </main>
  );
}
