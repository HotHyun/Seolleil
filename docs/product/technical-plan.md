# 기술 계획

## 확정 스택

- Framework: Next.js.
- Current persistence: Appwrite Databases for trips, checklist tasks, and analytics events.
- Target BaaS: self-hosted Appwrite on OCI.
- Target auth: Appwrite Auth with Google OAuth.
- Styling: Tailwind CSS.
- UI Components: shadcn/ui-style local components.
- Icons: lucide-react.
- Forms: react-hook-form + zod.
- Legacy/self-host deployment: Docker Compose on Coolify remains available during migration.

## 배포 환경

운영 방향은 Cloudflare에서 앱을 제공하고 OCI에서 공통 BaaS를 운영하는 구조로 전환한다.
OCI는 직접 공개 PostgreSQL이 아니라 Appwrite의 내부 데이터베이스, 스토리지, Auth,
Console을 운영한다.

- 2 OCPU.
- 12 GB RAM.
- Boot volume or explicitly mounted data paths for Appwrite data and storage.
- ARM architecture.

Target domains:

- App: `https://ski.hothyun.com`
- Appwrite API/Console: `https://appwrite.hothyun.com`

## 기본 서비스 구성

```txt
Cloudflare Pages/Workers/Next.js app
HTTPS Appwrite SDK/API calls
Cloudflare Tunnel or Cloudflare proxied HTTPS
OCI self-hosted Appwrite
Appwrite internal database/storage/auth services
Static seasonal data in code
Umami self-host or replacement analytics path
```

Cloudflare Hyperdrive and direct Worker-to-PostgreSQL TCP connections are no
longer part of the target architecture. PostgreSQL port `5432` should not be
opened to the public internet for Korean Ski.

## 지도 구현 계획

초기 지도 UX는 외부 지도 SDK 없이 정적 좌표 데이터와 자체 지도형 UI로 제공한다.

- 스키장 좌표와 주변 숙박/렌탈 후보는 `src/data`의 static data로 관리한다.
- 지도 SDK 키가 없어도 `/resorts`와 `/resorts/[id]`가 동작해야 한다.
- 실제 길찾기, 영업시간, 리뷰, 최신 장소 정보는 네이버 지도/카카오맵 외부 링크로 보낸다.
- 외부 지도 SDK 연동 시 클라이언트 노출 가능한 공개 키만 `NEXT_PUBLIC_*` 환경변수로 사용한다.

지도 SDK 후보:

- Kakao Maps JavaScript API: `NEXT_PUBLIC_KAKAO_MAP_APP_KEY`
- NAVER Maps JavaScript API v3: `NEXT_PUBLIC_NAVER_MAP_NCP_KEY_ID`

## 운영 원칙

- 가격 데이터는 Appwrite 관리 화면이 아니라 코드의 static season data로 관리한다.
- 가격 변경 시 코드를 수정하고 재배포한다.
- 단기적으로 기존 Prisma/PostgreSQL 구현은 유지한다.
- 신규 백엔드 전환은 Appwrite Auth, Databases, Storage, Permissions로 단계적으로 진행한다.
- Cloudflare Workers/Pages 런타임에서 DB TCP 연결을 만들지 않는다.
- Appwrite API endpoint는 브라우저와 Cloudflare 서버 로직에서 접근 가능한 HTTPS로 제공한다.
- Appwrite 노출은 가능하면 Cloudflare Tunnel로 처리해 OCI ingress를 최소화한다.
- 로그인은 선택 사항으로 제공한다.
- MVP 인증 제공자는 Google OAuth부터 지원한다.
- 비로그인 트립 생성은 유지한다.
- 로그인 사용자는 내 트립 목록에서 본인 트립에 접근한다.
- edit token/share token 접근 방식은 Appwrite 전환 후에도 raw token 저장 금지 원칙을 유지한다.
- 공유 링크는 읽기 전용으로 제한한다.
- 제품 핵심 이벤트는 Appwrite `analytics_events` collection으로 이전한다.

## 인증 계획

- Current implementation: Appwrite Auth with Google OAuth provider and an httpOnly session cookie.
- OAuth callback and provider configuration are managed in Appwrite Console.
- 로그인은 필수 진입 조건이 아니며, 트립 복구와 내 트립 목록을 위한 선택 기능이다.
- 익명 트립은 edit link 접근 후 로그인 계정에 연결할 수 있어야 한다.
- 관리자 접근은 Appwrite Auth 사용자와 별도 권한 정책으로 재설계한다.

## 마이그레이션 순서

1. Hyperdrive/OpenNext 실험 변경을 제거하고 Appwrite 전환 브랜치를 만든다.
2. Appwrite 운영 아키텍처와 collection/permission 설계를 문서화한다.
3. `Trip`, `TripTask`, `AnalyticsEvent` CRUD를 Appwrite collections로 전환한다.
4. Cloudflare Workers/OpenNext 빌드를 Appwrite HTTPS API 기준으로 복구한다.
5. 로그인 기반 내 트립 목록과 attach-to-account flow를 Appwrite user id 기준으로 복구한다.
6. 통합 테스트와 E2E 테스트를 Appwrite 동작 기준으로 갱신한다.
7. Appwrite 운영 대시보드 집계를 Appwrite query 기반으로 재구현한다.

## 추후 결정 필요

- Appwrite를 Coolify로 운영할지 직접 Docker Compose로 운영할지.
- Appwrite data/storage 경로와 백업/복구 방식.
- Appwrite Console을 Cloudflare Access로 보호할 범위.
- API endpoint와 Console endpoint를 같은 도메인으로 둘지 분리할지.
- edit token/share token을 hash 기반 collection field로 유지할지, Appwrite permissions와 혼합할지.
- 기존 PostgreSQL 데이터의 Appwrite migration script 작성 범위.
