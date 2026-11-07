import type { Metadata } from "next";
import { Suspense } from "react";
import { AcceptInvitePageContent } from "@/components/trip/accept-invite-page-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "트립 초대 | 설레일",
  robots: { index: false, follow: false }
};

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<AcceptInviteFallback />}>
      <AcceptInvitePageContent />
    </Suspense>
  );
}

function AcceptInviteFallback() {
  return (
    <main className="page-shell grid min-h-[70vh] place-items-center py-10" aria-busy="true">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle>트립 초대</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">초대 링크를 확인하고 있습니다.</p>
          <Button className="w-full" disabled>초대 수락</Button>
        </CardContent>
      </Card>
    </main>
  );
}
