# SEO 설정

## 색인 범위

- 색인: `/`, `/resorts`, `/resorts/[id]`, `/privacy`, `/terms`.
- 비색인: `/trips`, `/share`, `/invite`, `/my-trips`, `/login`, `/forgot-password`, `/verify-email`, `/auth`, `/admin`, `/api`, `/plan`, `/recommendations`.
- 경로 목록의 단일 출처는 `src/lib/seo-paths.ts`(`privatePathPrefixes`)이며 `robots.txt`(Disallow)와 `next.config.ts`의 `X-Robots-Tag: noindex`가 함께 사용한다. 공유·편집·초대 토큰 URL이 검색에 노출되지 않게 하는 것이 목적이다.

## 구성

- `src/app/robots.ts`, `src/app/sitemap.ts`(스키장 상세는 `resorts` 데이터에서 자동 생성, lastmod는 시즌 조사 최신 확인일).
- 루트 `layout.tsx`: 기본 title/description, Open Graph, Twitter, canonical. 페이지별로 title/description/canonical/OG를 덮어쓴다(`/resorts`, `/resorts/[id]`, 약관·방침).
- JSON-LD: 홈 `WebSite`+`Organization`, 스키장 상세 `SkiResort`+`BreadcrumbList`(`jsonLd()`가 `<`를 이스케이프).
- 공유 이미지: `public/og-image.png`(1200x630), 아이콘: `src/app/icon.svg`, `src/app/apple-icon.png`.

## 사람이 해야 하는 것

- Google Search Console, 네이버 서치어드바이저에 `seolleil.com` 등록과 `https://seolleil.com/sitemap.xml` 제출.
- 카카오톡 공유 미리보기는 카카오 공유 디버거로 캐시를 갱신한다.
