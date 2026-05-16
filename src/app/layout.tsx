import type { Metadata } from "next";
import Script from "next/script";
import { MountainSnow } from "lucide-react";
import { auth } from "@/auth";
import { AuthNav } from "@/components/auth/auth-nav";
import "@/app/globals.css";

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
    <html lang="ko">
      <body>
        {umamiId && umamiScript ? (
          <Script defer src={umamiScript} data-website-id={umamiId} strategy="afterInteractive" />
        ) : null}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#211f2e]/82 backdrop-blur-xl">
          <div className="page-shell flex h-16 items-center justify-between">
            <a href="/" className="flex items-center gap-2 font-black text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-orange-400">
                <MountainSnow className="h-5 w-5" />
              </span>
              Korean Ski
            </a>
            <nav className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
              <a href="/resorts" className="hidden hover:text-foreground sm:inline">
                스키장
              </a>
              <a href="/plan" className="hidden hover:text-foreground sm:inline">
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
