"use client";

import { useEffect, useLayoutEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useLayoutEffect(() => {
    try {
      document.documentElement.classList.toggle("dark", localStorage.getItem("korean-ski-theme") === "dark");
    } catch {}
  }, []);
  useEffect(() => { Sentry.captureException(error); }, [error]);
  return <html lang="ko" suppressHydrationWarning><body className="grid min-h-screen place-items-center bg-background p-6 text-foreground"><script dangerouslySetInnerHTML={{ __html: "try{document.documentElement.classList.toggle('dark',localStorage.getItem('korean-ski-theme')==='dark')}catch(e){}" }} /><main className="max-w-md text-center"><p className="text-sm font-bold text-destructive">치명적인 화면 오류</p><h1 className="mt-2 text-3xl font-black">서비스를 불러오지 못했습니다.</h1><p className="mt-3 text-sm text-muted-foreground">잠시 후 다시 시도해 주세요. 계속 실패하면 오류 번호 {error.digest?.slice(0, 10) ?? "확인 불가"}를 알려주세요.</p><button type="button" onClick={reset} className="mt-6 h-11 rounded-xl bg-primary px-5 font-black text-primary-foreground">다시 시도</button></main></body></html>;
}
