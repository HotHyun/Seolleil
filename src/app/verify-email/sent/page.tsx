import type { Metadata } from "next";
import { Suspense } from "react";
import { MailCheck } from "lucide-react";
import { VerificationSentContent } from "@/components/auth/verification-sent-content";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "인증 메일 | 설레일",
  robots: { index: false, follow: false }
};

export default function VerificationSentPage() {
  return (
    <Suspense fallback={<VerificationSentFallback />}>
      <VerificationSentContent />
    </Suspense>
  );
}

function VerificationSentFallback() {
  return (
    <main className="page-shell grid min-h-[76vh] place-items-center py-8 sm:py-14" aria-busy="true">
      <Card className="relative w-full max-w-xl overflow-hidden border-primary/20">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-primary to-emerald-400" />
        <CardContent className="p-6 sm:p-9">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary"><MailCheck className="h-7 w-7" /></div>
          <p className="text-sm font-black tracking-wide text-primary">가입 마지막 단계</p>
          <h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">이메일을 확인하면<br />트립 준비가 시작돼요.</h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">보낸 인증 링크를 열고 이메일 인증을 완료해 주세요. 인증 전에는 내 트립, 초대, 협업 기능을 사용할 수 없습니다.</p>
          <p className="mt-5 text-xs leading-5 text-muted-foreground">메일이 보이지 않으면 스팸함을 확인해 주세요. 링크는 다른 사람에게 전달하지 마세요.</p>
        </CardContent>
      </Card>
    </main>
  );
}
