# Korean Ski

국내 스키장 추천, 예상 비용 계산, 트립 체크리스트를 제공하는 모바일 우선 웹 앱입니다.

## Stack

- Next.js
- PostgreSQL
- Prisma
- Tailwind CSS
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

Services:

- App: `http://localhost:3000`
- PgAdmin: `http://localhost:5050`
- PostgreSQL: internal service `postgres:5432`

The app container runs `pnpm db:deploy` before `pnpm start`.

For Coolify, use this repository's `docker-compose.yml`. Set strong values for:

```txt
POSTGRES_PASSWORD
PGADMIN_DEFAULT_PASSWORD
NEXT_PUBLIC_UMAMI_WEBSITE_ID
NEXT_PUBLIC_UMAMI_SCRIPT_URL
```

If Umami is not ready yet, leave the Umami variables empty.

## Environment

Copy `.env.example` to `.env` for local non-Docker use.

Coolify can override these values:

```txt
DATABASE_URL
NEXT_PUBLIC_UMAMI_WEBSITE_ID
NEXT_PUBLIC_UMAMI_SCRIPT_URL
```

## Notes

- Ski resort and pricing data are static code data for MVP.
- Price values currently include MVP placeholder estimates and should be replaced with verified seasonal data.
- edit/share tokens are stored as hashes only.
- Read-only share links can be regenerated from the edit page.
