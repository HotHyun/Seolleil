import type { Metadata } from "next";
import Script from "next/script";
import { Home, ListChecks, MountainSnow, Search, Settings } from "lucide-react";
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
        <div className="app-frame">
          <aside className="hidden border-r border-white/10 bg-[#171522]/90 px-5 py-7 lg:block">
            <a href="/" className="flex items-center gap-3 text-lg font-black text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-orange-400">
                <MountainSnow className="h-5 w-5" />
              </span>
              Korean Ski
            </a>
            <nav className="mt-9 space-y-2 text-sm font-bold text-muted-foreground">
              <SideLink href="/" icon={<Home />} label="홈" active />
              <SideLink href="/plan" icon={<Search />} label="트립 만들기" />
              <SideLink href="/resorts" icon={<MountainSnow />} label="스키장" />
              <SideLink href="/my-trips" icon={<ListChecks />} label="내 트립" />
              <SideLink href="/login" icon={<Settings />} label="로그인" />
            </nav>
          </aside>
          <div className="min-w-0">
            <header className="sticky top-0 z-30 border-b border-white/10 bg-[#211f2e]/80 backdrop-blur lg:static lg:bg-transparent">
              <div className="page-shell flex h-16 items-center justify-between">
                <a href="/" className="flex items-center gap-2 font-black text-white lg:hidden">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-orange-400">
                    <MountainSnow className="h-5 w-5" />
                  </span>
                  Korean Ski
                </a>
                <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-muted-foreground lg:flex">
                  <Search className="h-4 w-4" />
                  2026 시즌 스키 트립 플래너
                </div>
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
          </div>
        </div>
      </body>
    </html>
  );
}

function SideLink({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <a
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-3 transition ${
        active ? "bg-orange-500 text-white shadow-lg shadow-orange-950/30" : "hover:bg-white/7 hover:text-white"
      }`}
    >
      <span className="[&_svg]:h-4 [&_svg]:w-4">{icon}</span>
      {label}
    </a>
  );
}
