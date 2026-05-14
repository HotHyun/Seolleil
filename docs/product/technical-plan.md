# 기술 계획

## 확정 스택

- Framework: Next.js.
- Database: PostgreSQL.
- ORM: Prisma.
- Styling: Tailwind CSS.
- UI Components: shadcn/ui.
- Icons: lucide-react.
- Forms: react-hook-form + zod.
- Deployment: Docker Compose.
- Hosting: Coolify.
- Target server: OCI Free Tier Ampere.

## 배포 환경

초기 운영 서버:

- 4 OCPU.
- 24 GB RAM.
- 200 GB Disk.
- ARM 아키텍처.

Coolify에서 Docker Compose 기반으로 앱과 PostgreSQL을 운영한다.

운영 도메인:

- `https://ski.hothyun.com`
- PgAdmin: `https://ski-admin.hothyun.com`

## 기본 서비스 구성

```txt
Next.js app
PostgreSQL
Prisma migration
Static seasonal data in code
Umami self-host
PgAdmin
```

## 운영 원칙

- 가격 데이터는 DB 관리자 화면이 아니라 코드의 static season data로 관리한다.
- 가격 변경 시 코드를 수정하고 재배포한다.
- 트립 데이터는 PostgreSQL에 저장한다.
- 로그인 없이 edit token/share token으로 접근을 제어한다.
- 공유 링크는 읽기 전용으로 제한한다.
- Umami는 웹 분석용으로 사용한다.
- 제품 핵심 이벤트는 앱 PostgreSQL에도 저장한다.
- MVP 단계의 DB 이벤트 확인은 PgAdmin으로 처리한다.

## 추후 결정 필요

- Next.js App Router 사용 여부.
- PostgreSQL 백업 방식.
- edit token/share token 길이와 만료 정책.
- Docker Compose 서비스 구성.
- Umami와 앱 DB의 백업/복구 정책.
