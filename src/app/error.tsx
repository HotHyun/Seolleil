"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); Sentry.captureException(error); }, [error]);
  const reference = error.digest?.slice(0, 10);
  return (
    <main className="page-shell py-12">
      <Card>
        <CardContent className="flex min-h-72 flex-col items-center justify-center gap-4 text-center">
          <span className="rounded-full bg-destructive/10 p-3 text-destructive"><AlertTriangle className="h-6 w-6" /></span>
          <div>
            <p className="text-sm font-semibold text-destructive">화면 오류</p>
            <h1 className="mt-2 text-3xl font-black">화면을 불러오지 못했습니다.</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              입력한 내용은 그대로 두고 먼저 다시 시도해 주세요. 계속 실패하면 홈으로 이동한 뒤 같은 작업을 다시 시작해 주세요.
            </p>
            {reference ? <p className="mt-2 text-xs text-muted-foreground">문의 시 오류 참조 번호 {reference}를 알려주세요.</p> : null}
          </div>
          <div className="flex flex-wrap justify-center gap-2"><Button type="button" onClick={() => reset()}><RotateCcw className="h-4 w-4" /> 다시 시도</Button><Link href="/" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-black transition hover:-translate-y-0.5 hover:bg-muted"><Home className="h-4 w-4" /> 홈으로</Link></div>
        </CardContent>
      </Card>
    </main>
  );
}
