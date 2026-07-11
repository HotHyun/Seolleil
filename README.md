# Korean Ski

국내 스키장 추천, 예상 비용 계산, 트립 체크리스트를 제공하는 모바일 우선 웹 앱입니다.

## Stack

- Next.js
- Appwrite Databases
- Tailwind CSS
- Cloudflare Workers via OpenNext
- Self-hosted Appwrite on OCI
- Docker Compose

## Local

```bash
pnpm install
pnpm db:generate
pnpm typecheck
pnpm build
```

## Docker Compose

```bash
docker compose up -d --build
```

Services in Docker Compose:

- App container exposes port `3000`.
- PgAdmin container exposes port `80`.
- PostgreSQL: internal service `postgres:5432`

The app container runs `pnpm db:deploy` before `pnpm start`.

For Coolify, use this repository's `docker-compose.yml`. Coolify should route to
the exposed app port instead of binding host port `3000` directly.

Set strong values for:

```txt
NEXT_PUBLIC_SITE_URL=https://ski.hothyun.com
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://appwrite.hothyun.com/v1
APPWRITE_ENDPOINT=https://appwrite.hothyun.com/v1
APPWRITE_PROJECT_ID
APPWRITE_API_KEY
APPWRITE_DATABASE_ID=korean_ski
APPWRITE_MIGRATIONS_COLLECTION_ID=schema_migrations
APPWRITE_TRIPS_COLLECTION_ID=trips
APPWRITE_TRIP_TASKS_COLLECTION_ID=trip_tasks
APPWRITE_ANALYTICS_EVENTS_COLLECTION_ID=analytics_events
NEXT_PUBLIC_UMAMI_WEBSITE_ID
NEXT_PUBLIC_UMAMI_SCRIPT_URL
```

If Umami is not ready yet, leave the Umami variables empty.

## Environment

Copy `.env.example` to `.env` for local non-Docker use.

Coolify can override these values:

```txt
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_APPWRITE_ENDPOINT
APPWRITE_ENDPOINT
APPWRITE_PROJECT_ID
APPWRITE_API_KEY
APPWRITE_DATABASE_ID
APPWRITE_TRIPS_COLLECTION_ID
APPWRITE_TRIP_TASKS_COLLECTION_ID
APPWRITE_ANALYTICS_EVENTS_COLLECTION_ID
NEXT_PUBLIC_UMAMI_WEBSITE_ID
NEXT_PUBLIC_UMAMI_SCRIPT_URL
```

## Appwrite Direction

The Cloudflare Hyperdrive experiment has been stopped. The target architecture
is:

```txt
Cloudflare Pages/Workers/Next.js
  -> HTTPS
  -> appwrite.hothyun.com
  -> Cloudflare Tunnel or proxied HTTPS
  -> OCI self-hosted Appwrite
```

The app stores trips, checklist tasks, share links, and analytics events in
Appwrite Databases through server-side Appwrite REST calls. Account login uses
Appwrite Auth Google OAuth with an httpOnly session cookie.

Before deploying to Cloudflare Workers:

```bash
pnpm wrangler secret put APPWRITE_API_KEY
```

Set `APPWRITE_PROJECT_ID` in `wrangler.jsonc` to the real Appwrite project ID.

Create or update the Appwrite database schema with:

```bash
APPWRITE_ENDPOINT="https://appwrite.hothyun.com/v1" \
APPWRITE_PROJECT_ID="<project-id>" \
APPWRITE_API_KEY="<api-key>" \
APPWRITE_DATABASE_ID="korean_ski" \
pnpm appwrite:schema
```

Or create a local `.env` from `.env.example`, fill in the Appwrite values, and run:

```bash
pnpm appwrite:schema
```

The schema command runs dated Appwrite migrations from `scripts/appwrite/migrations` and records applied IDs in the `schema_migrations` collection.

Do not expose PostgreSQL `5432` publicly for this app, and do not add
Cloudflare Hyperdrive bindings back to the app unless the product docs are
explicitly changed first.

## Notes

- Ski resort and pricing data are static code data for MVP.
- Price values currently include MVP placeholder estimates and should be replaced with verified seasonal data.
- edit/share tokens are stored as hashes only.
- Read-only share links can be regenerated from the edit page.
- Appwrite migration planning is documented in `docs/product/appwrite-architecture.md`.
- Appwrite collection setup is documented in `docs/product/appwrite-collections.md`.
