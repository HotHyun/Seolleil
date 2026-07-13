# Korean Ski

한국 스키장 탐색, 조건 기반 추천, 시즌 가격 비교, 트립 체크리스트와 동행자 공유를 제공하는 모바일 우선 웹 앱입니다.

## Architecture

```text
Browser → Cloudflare Workers / Next.js → HTTPS → self-hosted Appwrite on OCI
                                    ↘ Umami
```

- Appwrite Databases: trips, tasks, persistent share links, product events.
- Appwrite Auth: Google OAuth and verified email/password.
- Appwrite Teams: account invitations and read/edit membership.
- Static code data: resorts, seasonal prices, travel and rental information.

## Setup

```bash
pnpm install
cp .env.example .env
pnpm typecheck
pnpm test
pnpm appwrite:schema
```

See `docs/product/appwrite-auth-sharing-setup.md` for Appwrite Console and environment setup. The schema runner uses migrations in `scripts/appwrite/migrations`.

## Deploy And Verify

```bash
pnpm cf:deploy
pnpm test:e2e:production
```

Deployment and production verification are intentionally separate operations. The production test creates and cleans up an isolated anonymous trip. CI can run the same suite from the manually dispatched `Production regression` workflow.

## Product Constraints

- Prices are static seasonal reference data, not live inventory or booking quotes.
- Official operation and slope status are linked, not scraped.
- Trips are private by default. Share links have persistent read/edit permissions and can be revoked individually.
- Raw edit/share tokens and personal information must not be logged or stored in analytics.
