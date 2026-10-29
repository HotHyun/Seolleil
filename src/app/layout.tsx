import type { Metadata } from "next";
import { Suspense } from "react";
import localFont from "next/font/local";
import Script from "next/script";
import { MountainSnow } from "lucide-react";
import { AuthNav } from "@/components/auth/auth-nav";
import { FirebaseSessionSync } from "@/components/auth/firebase-session-sync";
import { Toaster, ToastFromUrl } from "@/components/ui/sonner";
import { getSession } from "@/lib/session";
import "@/app/globals.css";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://ski.hothyun.com"),
  title: "설레일",
  description: "국내 스키장 추천과 스키 트립 준비 체크리스트",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true
    }
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const umamiScript = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
  const session = await getSession();

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={pretendard.className}>
        <FirebaseSessionSync />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('korean-ski-theme');if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}"
          }}
        />
        {umamiId && umamiScript ? (
          <Script defer src={umamiScript} data-website-id={umamiId} strategy="afterInteractive" />
        ) : null}
        <a href="#main-content" className="skip-link">본문으로 바로가기</a>
        <header className="sticky top-0 z-30 border-b bg-card/90 backdrop-blur-xl">
          <div className="page-shell flex h-16 items-center justify-between gap-3">
            <a href="/" aria-label="설레일" className="flex shrink-0 items-center gap-2 font-black tracking-[-.02em] text-foreground sm:gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
                <MountainSnow className="h-5 w-5" />
              </span>
              <span className="whitespace-nowrap text-xs sm:text-sm">
                설레일
              </span>
            </a>
            <nav className="flex shrink-0 items-center gap-1 text-xs font-bold text-muted-foreground sm:gap-3 sm:text-sm">
              <a href="/resorts" className="whitespace-nowrap rounded-md px-1.5 py-2 hover:bg-muted hover:text-foreground sm:px-0 sm:hover:bg-transparent">
                스키장
              </a>
              <a href="/plan" aria-label="여행 시작" className="whitespace-nowrap rounded-lg bg-primary px-2.5 py-2 text-primary-foreground transition hover:brightness-110 sm:px-4">
                <span className="sm:hidden">시작</span>
                <span className="hidden sm:inline">여행 시작</span>
              </a>
              <AuthNav session={session} />
            </nav>
          </div>
        </header>
        {children}
        <Suspense><ToastFromUrl /></Suspense>
        <Toaster />
      </body>
    </html>
  );
}
