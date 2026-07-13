import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { signInWithEmailAction, signInWithGoogleAction, signUpWithEmailAction } from "@/app/auth-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/field";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "로그인 | Korean Ski"
};

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const session = await getSession();
  const callbackUrlValue = Array.isArray(query.callbackUrl) ? query.callbackUrl[0] : query.callbackUrl;
  const callbackUrl = callbackUrlValue && callbackUrlValue.startsWith("/") ? callbackUrlValue : "/my-trips";
  const mode = (Array.isArray(query.mode) ? query.mode[0] : query.mode) === "signup" ? "signup" : "login";
  const error = Array.isArray(query.error) ? query.error[0] : query.error;
  const notice = Array.isArray(query.notice) ? query.notice[0] : query.notice;

  if (session?.user) {
    redirect(callbackUrl);
  }

  return (
    <main className="page-shell grid min-h-[70vh] place-items-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-black">내 트립 저장하기</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm leading-6 text-muted-foreground">Google 계정 또는 이메일로 로그인하면 트립을 안전하게 저장하고 동행자를 초대할 수 있습니다.</p>
          {error ? <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm font-semibold text-destructive">{error}</p> : null}
          {notice ? <p className="rounded-md bg-primary/10 p-3 text-sm font-semibold text-primary">{notice}</p> : null}
          <form action={signInWithGoogleAction}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <Button type="submit" className="w-full">
              Google로 계속하기
            </Button>
          </form>
          <div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />또는<span className="h-px flex-1 bg-border" /></div>
          <form action={mode === "signup" ? signUpWithEmailAction : signInWithEmailAction} className="space-y-3">
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            {mode === "signup" ? <Input name="name" autoComplete="name" placeholder="이름" aria-label="이름" required /> : null}
            <Input name="email" type="email" autoComplete="email" placeholder="이메일" aria-label="이메일" required />
            <Input name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={8} placeholder="비밀번호 (8자 이상)" aria-label="비밀번호" required />
            <Button type="submit" variant="secondary" className="w-full">{mode === "signup" ? "이메일로 가입하기" : "이메일로 로그인"}</Button>
          </form>
          <a className="block text-center text-sm font-semibold text-primary" href={`/login?mode=${mode === "signup" ? "login" : "signup"}&callbackUrl=${encodeURIComponent(callbackUrl)}`}>
            {mode === "signup" ? "이미 계정이 있나요? 로그인" : "처음이신가요? 이메일로 가입"}
          </a>
          {mode === "login" ? <a className="block text-center text-sm text-muted-foreground" href="/forgot-password">비밀번호를 잊었거나 초대로 생성된 계정인가요?</a> : null}
        </CardContent>
      </Card>
    </main>
  );
}
