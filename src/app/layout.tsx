import type { Metadata } from "next";
import { Suspense } from "react";
import localFont from "next/font/local";
import Link from "next/link";
import Script from "next/script";
import { MountainSnow } from "lucide-react";
import { AuthNav } from "@/components/auth/auth-nav";
import { WebVitals } from "@/components/web-vitals";
import { SiteFooter } from "@/components/site-footer";
import { FirebaseSessionProvider } from "@/components/auth/firebase-session-sync";
import { Toaster, ToastFromUrl } from "@/components/ui/sonner";
import { ogImagePath, siteDescription, siteName, siteTitle, siteUrl } from "@/lib/seo";
import "@/app/globals.css";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: "swap",
  // 글꼴(약 350KB)을 최우선으로 미리 받으면 느린 모바일에서 히어로 이미지·CSS와 대역폭을 다툰다. 텍스트는 swap으로 먼저 그린다.
  preload: false,
  weight: "400 900",
  variable: "--font-pretendard"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  applicationName: siteName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName,
    url: "/",
    title: siteTitle,
    description: siteDescription,
    images: [{ url: ogImagePath, width: 1200, height: 630, alt: "설레일 - 국내 스키장 추천·가격 비교·스키 여행 계획" }]
  },
  twitter: { card: "summary_large_image", title: siteTitle, description: siteDescription, images: [ogImagePath] },
  robots: { index: true, follow: true },
  verification: { other: { "naver-site-verification": "226e96c60075fd4395b39489ee7eef19dede0807" } }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const umamiScript = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={pretendard.className}>
        <FirebaseSessionProvider>
          <script
            dangerouslySetInnerHTML={{
              __html:
                "try{var t=localStorage.getItem('korean-ski-theme');if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}"
            }}
          />
          {umamiId && umamiScript ? (
            <>
              <script
                dangerouslySetInnerHTML={{
                  __html:
                    "window.umamiBeforeSend=function(t,p){try{var m=function(u){if(!u)return u;var s=String(u).split('?')[0].split('#')[0];return s.replace(/^(https?:\\/\\/[^/]+)?\\/(share|trips)\\/[^/]+/,'$1/$2/[REDACTED]').replace(/^(https?:\\/\\/[^/]+)?\\/(verify-email|reset-password|invite\\/accept|auth\\/action).*/,'$1/$2')};p.url=m(p.url);p.referrer=m(p.referrer)}catch(e){}return p};"
                }}
              />
              <Script
                defer
                src={umamiScript}
                data-website-id={umamiId}
                data-before-send="umamiBeforeSend"
                strategy="afterInteractive"
              />
            </>
          ) : null}
          <WebVitals />
          <a href="#main-content" className="skip-link">본문으로 바로가기</a>
          <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
            <div className="page-shell flex h-16 items-center justify-between gap-3">
              <Link href="/" aria-label="설레일" className="flex shrink-0 items-center gap-2 text-foreground">
                <MountainSnow aria-hidden="true" className="h-5 w-5 text-primary" strokeWidth={1.75} />
                <span className="whitespace-nowrap text-base font-semibold">
                  설레일
                </span>
              </Link>
              <nav className="flex shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground sm:gap-3">
                <Link href="/resorts" className="inline-flex min-h-11 items-center whitespace-nowrap rounded-md px-2 transition-colors hover:text-foreground sm:px-0">
                  스키장
                </Link>
                <Link href="/plan" aria-label="여행 시작" className="inline-flex min-h-11 items-center whitespace-nowrap rounded-lg bg-primary px-3 text-primary-foreground transition-colors hover:bg-primary/90 sm:px-4">
                  <span className="sm:hidden">시작</span>
                  <span className="hidden sm:inline">여행 시작</span>
                </Link>
                <AuthNav />
              </nav>
            </div>
          </header>
          {children}
          <SiteFooter />
          <Suspense><ToastFromUrl /></Suspense>
          <Toaster />
        </FirebaseSessionProvider>
      </body>
    </html>
  );
}
