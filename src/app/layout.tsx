import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { MountainSnow } from "lucide-react";
import { auth } from "@/auth";
import { AuthNav } from "@/components/auth/auth-nav";
import "@/app/globals.css";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://ski.hothyun.com"),
  title: "Korean Ski",
  description: "국내 스키장 추천과 스키 트립 준비 체크리스트"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const umamiScript = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
  const session = await auth();

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={pretendard.className}>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('korean-ski-theme');if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}"
          }}
        />
        {umamiId && umamiScript ? (
          <Script defer src={umamiScript} data-website-id={umamiId} strategy="afterInteractive" />
        ) : null}
        <header className="sticky top-0 z-30 border-b bg-card/85 backdrop-blur-xl">
          <div className="page-shell flex h-16 items-center justify-between gap-3">
            <a href="/" className="flex min-w-0 items-center gap-2 font-black text-foreground">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <MountainSnow className="h-5 w-5" />
              </span>
              <span className="hidden xs:inline sm:inline">Korean Ski</span>
            </a>
            <nav className="flex shrink-0 items-center gap-2 text-xs font-bold text-muted-foreground sm:gap-3 sm:text-sm">
              <a href="/resorts" className="rounded-md px-2 py-2 hover:bg-muted hover:text-foreground sm:px-0 sm:hover:bg-transparent">
                스키장
              </a>
              <a href="/plan" className="rounded-md px-2 py-2 hover:bg-muted hover:text-foreground sm:px-0 sm:hover:bg-transparent">
                트립 만들기
              </a>
              <AuthNav session={session} />
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
