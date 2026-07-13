import { verifyEmailAction } from "@/app/auth-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const value = (key: string) => { const item = query[key]; return Array.isArray(item) ? item[0] ?? "" : item ?? ""; };
  return <main className="page-shell grid min-h-[70vh] place-items-center py-10"><Card className="w-full max-w-md"><CardHeader><CardTitle>이메일 인증</CardTitle></CardHeader><CardContent className="space-y-4"><p className="text-sm text-muted-foreground">아래 버튼을 눌러 이메일 주소 인증을 완료하세요. 인증 링크의 일회용 정보는 저장하거나 다른 사람에게 공유하지 마세요.</p><form action={verifyEmailAction}><input type="hidden" name="userId" value={value("userId")} /><input type="hidden" name="secret" value={value("secret")} /><input type="hidden" name="callbackUrl" value={value("callbackUrl") || "/my-trips"} /><Button className="w-full">이메일 인증 완료</Button></form></CardContent></Card></main>;
}
