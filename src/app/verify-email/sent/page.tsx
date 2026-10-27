import { Check, MailCheck, MountainSnow } from "lucide-react";
import { ResendFirebaseVerification } from "@/components/auth/firebase-email-verification";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function VerificationSentPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const value = (key: string) => { const item = query[key]; return Array.isArray(item) ? item[0] ?? "" : item ?? ""; };
  const callbackUrl = value("callbackUrl") || "/my-trips";
  return (
    <main className="page-shell grid min-h-[76vh] place-items-center py-8 sm:py-14">
      <Card className="relative w-full max-w-xl overflow-hidden border-primary/20">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-primary to-emerald-400" />
        <CardContent className="p-6 sm:p-9">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary"><MailCheck className="h-7 w-7" /></div>
          <p className="text-sm font-black tracking-wide text-primary">가입 마지막 단계</p>
          <h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">이메일을 확인하면<br />트립 준비가 시작돼요.</h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">보낸 인증 링크를 열고 이메일 인증을 완료해 주세요. 인증 전에는 내 트립, 초대, 협업 기능을 사용할 수 없습니다.</p>
          {value("resent") ? <p className="mt-4 rounded-lg bg-emerald-500/10 p-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">인증 메일을 다시 보냈어요.</p> : null}
          {value("error") ? <p role="alert" className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm font-semibold text-destructive">{value("error")}</p> : null}
          <ol className="mt-7 grid gap-3 sm:grid-cols-3">
            <Step icon={<Check />} number="1" title="가입 정보 저장" active={false} />
            <Step icon={<MailCheck />} number="2" title="이메일 인증" active />
            <Step icon={<MountainSnow />} number="3" title="트립 시작" active={false} />
          </ol>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <ResendFirebaseVerification callbackUrl={callbackUrl} />
            <a href="/login"><Button variant="ghost" className="w-full">다른 계정으로 로그인</Button></a>
          </div>
          <p className="mt-5 text-xs leading-5 text-muted-foreground">메일이 보이지 않으면 스팸함을 확인해 주세요. 링크는 다른 사람에게 전달하지 마세요.</p>
        </CardContent>
      </Card>
    </main>
  );
}

function Step({ icon, number, title, active }: { icon: React.ReactNode; number: string; title: string; active: boolean }) {
  return <li className={`flex items-center gap-3 rounded-xl border p-3 ${active ? "border-primary/40 bg-primary/10" : "bg-muted/50"}`}><span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black [&_svg]:h-4 [&_svg]:w-4 ${active ? "bg-primary text-primary-foreground" : "bg-background"}`}>{active ? icon : number}</span><span className="text-sm font-bold">{title}</span></li>;
}
