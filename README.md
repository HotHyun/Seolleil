# Korean Ski

한국 스키장 탐색, 조건 기반 추천, 시즌 가격 비교, 트립 체크리스트와 동행자 공유를 제공하는 모바일 우선 웹 앱입니다.

## Architecture

```text
Browser → Cloudflare Workers / Next.js → Firebase Auth + Cloud Firestore
                                    ↘ Umami
```

- Firebase Authentication: Google OAuth와 이메일/비밀번호 인증.
- Cloud Firestore: 트립, 체크리스트, 공유 링크, 계정 멤버십, 제품 이벤트.
- Cloudflare Workers/OpenNext: 앱 서버 액션과 Firestore REST 접근.
- Static code data: resorts, seasonal prices, travel and rental information.

## Setup

```bash
pnpm install
cp .env.example .env
```

Firebase 프로젝트, Authentication, IAM, Cloudflare secret 준비는 [`docs/product/firebase-setup.md`](docs/product/firebase-setup.md)를 따릅니다. Firestore 컬렉션은 첫 쓰기 때 자동 생성됩니다.

Sentry is optional and remains disabled until `NEXT_PUBLIC_SENTRY_DSN`/`SENTRY_DSN` are configured. Source-map upload additionally requires `SENTRY_ORG`, `SENTRY_PROJECT`, and secret `SENTRY_AUTH_TOKEN`; see `docs/product/error-handling.md`.

## Deploy And Verify

`pnpm cf:deploy`와 production 검증은 각각 별도 지시가 필요합니다. production 테스트는 격리된 익명 트립을 만들고 cleanup합니다.

## Product Constraints

- Prices are static seasonal reference data, not live inventory or booking quotes.
- Official operation and slope status are linked, not scraped.
- Trips are private by default. Share links have persistent read/edit permissions and can be revoked individually.
- Raw edit/share/invitation tokens and personal information must not be logged or stored in analytics.
