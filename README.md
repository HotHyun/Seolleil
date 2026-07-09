# Korean Ski

국내 스키장 추천, 예상 비용 계산, 트립 체크리스트를 제공하는 모바일 우선 웹 앱입니다.

## Stack

- Next.js
- PostgreSQL
- Prisma
- Tailwind CSS
- Cloudflare Workers
- Cloudflare Hyperdrive
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
POSTGRES_PASSWORD
PGADMIN_DEFAULT_PASSWORD
PGADMIN_PUBLIC_URL=https://ski-admin.hothyun.com
NEXT_PUBLIC_SITE_URL=https://ski.hothyun.com
AUTH_URL=https://ski.hothyun.com
AUTH_SECRET
AUTH_GOOGLE_ID
AUTH_GOOGLE_SECRET
NEXT_PUBLIC_UMAMI_WEBSITE_ID
NEXT_PUBLIC_UMAMI_SCRIPT_URL
```

If Umami is not ready yet, leave the Umami variables empty.

For Google OAuth, configure this authorized redirect URI in Google Cloud:

```txt
https://ski.hothyun.com/api/auth/callback/google
```

Generate `AUTH_SECRET` with:

```bash
openssl rand -base64 32
```

## Environment

Copy `.env.example` to `.env` for local non-Docker use.

Coolify can override these values:

```txt
DATABASE_URL
PGADMIN_PUBLIC_URL
NEXT_PUBLIC_SITE_URL
AUTH_URL
AUTH_SECRET
AUTH_GOOGLE_ID
AUTH_GOOGLE_SECRET
NEXT_PUBLIC_UMAMI_WEBSITE_ID
NEXT_PUBLIC_UMAMI_SCRIPT_URL
```

## Cloudflare Workers

The app can run as a Next.js Worker through OpenNext while PostgreSQL stays on
OCI and is reached through Cloudflare Hyperdrive.

```bash
pnpm install
pnpm db:generate
pnpm cf:build
pnpm cf:preview
```

Create the Hyperdrive configuration after the OCI PostgreSQL endpoint is
reachable from Cloudflare:

```bash
pnpm wrangler login
pnpm wrangler hyperdrive create korean-ski-postgres \
  --connection-string="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public"
```

Copy the returned Hyperdrive `id` into `wrangler.jsonc` under the `HYPERDRIVE`
binding. For local Worker preview against a local database, avoid committing the
connection string and export it before `pnpm cf:preview`:

```bash
export CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE="postgresql://korean_ski:change-me@localhost:5432/korean_ski?schema=public"
export WRANGLER_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE="$CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE"
```

Production secrets still need to be set in Cloudflare:

```bash
pnpm wrangler secret put AUTH_SECRET
pnpm wrangler secret put AUTH_GOOGLE_ID
pnpm wrangler secret put AUTH_GOOGLE_SECRET
pnpm wrangler secret put ADMIN_EMAILS
```

Deploy with:

```bash
pnpm cf:deploy
```

## Notes

- Ski resort and pricing data are static code data for MVP.
- Price values currently include MVP placeholder estimates and should be replaced with verified seasonal data.
- edit/share tokens are stored as hashes only.
- Read-only share links can be regenerated from the edit page.
- OCI can keep running PostgreSQL and PgAdmin even when the Next.js app moves to
  Cloudflare Workers.
