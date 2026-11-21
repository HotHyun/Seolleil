import { AnalyticsLink } from "@/components/analytics-link";
import { HeroQuickForm } from "@/components/ui/hero-quick-form";
import { TripResultPreviewCard, type SampleRow } from "@/components/ui/trip-result-preview-card";

export function CinematicHero({ rows, label }: { rows: SampleRow[]; label: string }) {
  return (
    <section className="relative border-b bg-background lg:mb-24 lg:border-b-0">
      <link rel="preload" as="image" media="(max-width: 1023px)" imageSrcSet="/images/ski-hero-mobile-480.webp 480w, /images/ski-hero-mobile-720.webp 720w, /images/ski-hero-mobile-960.webp 960w" imageSizes="100vw" fetchPriority="high" />
      <link rel="preload" as="image" media="(min-width: 1024px)" imageSrcSet="/images/ski-hero-828.webp 828w, /images/ski-hero-1440.webp 1440w, /images/ski-hero-2400.webp 2400w" imageSizes="62vw" fetchPriority="high" />
      {/* 사진은 어둡게 덮지 않고, 왼쪽 가장자리만 페이지 배경으로 녹인다. 모바일은 화면에 보이는 비율로 미리 잘라 둔 작은 WebP(약 34KB)를, 데스크톱은 기존 큰 이미지를 받는다. */}
      <div className="relative h-56 overflow-hidden sm:h-72 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[62%]">
        <picture>
          <source
            media="(min-width: 1024px)"
            srcSet="/images/ski-hero-828.webp 828w, /images/ski-hero-1440.webp 1440w, /images/ski-hero-2400.webp 2400w"
            sizes="62vw"
          />
          <img
            src="/images/ski-hero-mobile-720.webp"
            srcSet="/images/ski-hero-mobile-480.webp 480w, /images/ski-hero-mobile-720.webp 720w, /images/ski-hero-mobile-960.webp 960w"
            sizes="100vw"
            alt="눈 덮인 산을 내려오는 스키어"
            width={720}
            height={391}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-[30%_center] dark:brightness-75 lg:[mask-image:linear-gradient(to_right,transparent_8%,#000_42%)]"
          />
        </picture>
      </div>

      <div className="page-shell relative flex flex-col py-8 lg:min-h-[min(680px,calc(100svh-4rem))] lg:justify-center lg:py-16">
        <div className="max-w-[520px]">
          <h1 className="hero-reveal break-keep text-balance text-4xl font-semibold leading-[1.2] sm:text-5xl">
            국내 스키장 추천,<br />이동 시간과 총비용으로<br />가격 비교해요
          </h1>
          <p className="hero-reveal hero-delay-1 mt-4 break-keep text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            날짜와 출발지를 고르면 당일치기·1박2일 스키 여행의 리프트·렌탈·교통비 예상 총액을 보여 드려요.
          </p>
          <HeroQuickForm />
          <p className="hero-reveal hero-delay-3 mt-4 text-sm text-muted-foreground">
            인원·장비 같은 조건을 직접 정하려면{" "}
            <AnalyticsLink href="/plan" eventName="home_primary_cta_click" className="font-medium text-primary underline-offset-4 hover:underline">조건 직접 입력</AnalyticsLink>
          </p>
        </div>

        <div className="hero-reveal hero-delay-2 mt-8 w-full max-w-md lg:absolute lg:bottom-0 lg:right-0 lg:mt-0 lg:w-[380px] lg:translate-y-24">
          <TripResultPreviewCard rows={rows} label={label} />
        </div>
      </div>
    </section>
  );
}
