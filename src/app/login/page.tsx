import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { signInWithGoogleAction } from "@/app/auth-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "로그인 | Korean Ski"
};

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  const query = await searchParams;
  const callbackUrlValue = Array.isArray(query.callbackUrl) ? query.callbackUrl[0] : query.callbackUrl;
  const callbackUrl = callbackUrlValue && callbackUrlValue.startsWith("/") ? callbackUrlValue : "/my-trips";

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
          <p className="text-sm leading-6 text-muted-foreground">
            Google 계정으로 로그인하면 만든 트립을 링크 없이 다시 열 수 있습니다. 비로그인으로도 트립 생성과 공유는 계속 가능합니다.
          </p>
          <form action={signInWithGoogleAction}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <Button type="submit" className="w-full">
              Google로 계속하기
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
