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
        <CardContent className="p-6 sm:p-9">
          <MailCheck aria-hidden="true" className="mb-6 h-8 w-8 text-primary" strokeWidth={1.5} />
          <p className="text-sm text-muted-foreground">가입 마지막 단계</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">이메일을 확인하면<br />트립 준비가 시작돼요</h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">보낸 인증 링크를 열고 이메일 인증을 완료해 주세요. 인증 전에는 내 트립, 초대, 협업 기능을 사용할 수 없습니다.</p>
          <p className="mt-5 text-xs leading-5 text-muted-foreground">메일이 보이지 않으면 스팸함을 확인해 주세요. 링크는 다른 사람에게 전달하지 마세요.</p>
        </CardContent>
      </Card>
    </main>
  );
}
