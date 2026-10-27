import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FirebaseAuthForms } from "@/components/auth/firebase-auth-forms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const callbackUrl = callbackUrlValue && callbackUrlValue.startsWith("/") && !callbackUrlValue.startsWith("//") ? callbackUrlValue : "/my-trips";
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
          {notice ? <p className="rounded-md bg-primary/10 p-3 text-sm font-semibold text-primary">{notice}</p> : null}
          <FirebaseAuthForms mode={mode} callbackUrl={callbackUrl} initialError={error} />
        </CardContent>
      </Card>
    </main>
  );
}
