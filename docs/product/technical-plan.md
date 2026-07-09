# 기술 계획

## 확정 스택

- Framework: Next.js.
- Database: PostgreSQL.
- ORM: Prisma.
- Styling: Tailwind CSS.
- UI Components: shadcn/ui.
- Icons: lucide-react.
- Forms: react-hook-form + zod.
- Primary app deployment: Cloudflare Workers via OpenNext.
- Database hosting: PostgreSQL on OCI Free Tier Block Storage.
- Database access from Workers: Cloudflare Hyperdrive.
- Legacy/self-host deployment: Docker Compose on Coolify remains available for fallback.

## 배포 환경

초기 운영 서버 가정은 OCI Free Tier 축소에 맞춰 변경한다. OCI는 앱 서버가 아니라
공통 Linux 도구, PostgreSQL, PgAdmin, 백업 작업을 담당한다.

- 2 OCPU.
- 12 GB RAM.
- 200 GB Disk.
- ARM 아키텍처.

Next.js 앱은 Cloudflare Workers에 배포한다. Worker는 Hyperdrive binding을 통해
OCI PostgreSQL에 접근한다. Coolify/Docker Compose 배포는 롤백 또는 임시 자체
호스팅 경로로 유지한다.

운영 도메인:

- `https://ski.hothyun.com`
- PgAdmin: `https://ski-admin.hothyun.com`

## 기본 서비스 구성

```txt
Cloudflare Worker Next.js app
Cloudflare Hyperdrive
OCI PostgreSQL
Prisma migration from a trusted CLI/runtime
Static seasonal data in code
Optional auth
Umami self-host
PgAdmin
```

## 지도 구현 계획

초기 지도 UX는 외부 지도 SDK 없이 정적 좌표 데이터와 자체 지도형 UI로 제공한다.

- 스키장 좌표와 주변 숙박/렌탈 후보는 `src/data`의 static data로 관리한다.
- 지도 SDK 키가 없어도 `/resorts`와 `/resorts/[id]`가 동작해야 한다.
- 실제 길찾기, 영업시간, 리뷰, 최신 장소 정보는 네이버 지도/카카오맵 외부 링크로 보낸다.
- 외부 지도 SDK 연동 시 클라이언트 노출 가능한 공개 키만 `NEXT_PUBLIC_*` 환경변수로 사용한다.

지도 SDK 후보:

- Kakao Maps JavaScript API: `NEXT_PUBLIC_KAKAO_MAP_APP_KEY`
- NAVER Maps JavaScript API v3: `NEXT_PUBLIC_NAVER_MAP_NCP_KEY_ID`

승인/설정 필요 항목:

- Kakao Developers에서 애플리케이션 생성.
- Kakao Maps JavaScript 키 확인.
- Web 플랫폼 사이트 도메인에 `https://ski.hothyun.com`과 로컬 개발 도메인 등록.
- NAVER Cloud Platform Maps 애플리케이션 생성.
- Web Dynamic Map 사용 설정.
- 서비스 도메인에 `https://ski.hothyun.com`과 로컬 개발 도메인 등록.

## 운영 원칙

- 가격 데이터는 DB 관리자 화면이 아니라 코드의 static season data로 관리한다.
- 가격 변경 시 코드를 수정하고 재배포한다.
- 트립 데이터는 PostgreSQL에 저장한다.
- PostgreSQL은 OCI에서 운영하고, Cloudflare Workers는 Hyperdrive를 통해 접근한다.
- 로그인은 선택 사항으로 제공한다.
- MVP 인증 제공자는 Google OAuth부터 지원한다.
- Kakao OAuth와 이메일 매직링크는 추후 확장으로 둔다.
- 비로그인 트립 생성은 유지한다.
- 로그인 사용자는 내 트립 목록에서 본인 트립에 접근한다.
- edit token/share token 접근 방식은 로그인 도입 후에도 유지한다.
- 공유 링크는 읽기 전용으로 제한한다.
- Umami는 웹 분석용으로 사용한다.
- 제품 핵심 이벤트는 앱 PostgreSQL에도 저장한다.
- MVP 단계의 DB 이벤트 확인은 PgAdmin으로 처리한다.

## 인증 계획

- 1차: Google OAuth.
- 2차 후보: Kakao OAuth.
- 3차 후보: 이메일 매직링크.
- 구현: Auth.js + Prisma Adapter.
- 세션 저장: PostgreSQL database session.
- OAuth callback URL: `https://ski.hothyun.com/api/auth/callback/google`.
- 인증 구현은 Next.js, Auth.js, Prisma/PostgreSQL, Cloudflare Workers 연동이 쉬운 방식을 우선한다.
- 로그인은 필수 진입 조건이 아니며, 트립 복구와 내 트립 목록을 위한 선택 기능이다.
- 필수 환경변수:
  - `AUTH_URL`.
  - `AUTH_SECRET`.
  - `AUTH_GOOGLE_ID`.
  - `AUTH_GOOGLE_SECRET`.
  - `ADMIN_EMAILS`: `/admin` 접근을 허용할 Google 계정 이메일 목록.

## 추후 결정 필요

- Next.js App Router 사용 여부.
- PostgreSQL 백업 방식.
- edit token/share token 길이와 만료 정책.
- Cloudflare Workers 배포 자동화 방식.
- Hyperdrive query cache 사용 범위와 read-after-write 일관성 정책.
- Umami와 앱 DB의 백업/복구 정책.
