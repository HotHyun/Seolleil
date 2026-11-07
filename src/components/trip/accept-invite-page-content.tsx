"use client";

import { useSearchParams } from "next/navigation";
import { acceptTripInvitationAction } from "@/app/auth-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AcceptInvitePageContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const token = searchParams.get("token") ?? "";

  return (
    <main className="page-shell grid min-h-[70vh] place-items-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle>트립 초대</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {error
            ? <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
            : <p className="text-sm text-muted-foreground">초대받은 이메일 계정으로 로그인한 뒤 수락하면 내 트립 목록에서 함께 확인할 수 있습니다.</p>}
          <form action={acceptTripInvitationAction}>
            <input type="hidden" name="token" value={token} />
            <Button className="w-full" disabled={!token}>초대 수락</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
