# Appwrite Collections

Korean Ski uses Appwrite Databases as the application persistence layer.

## Environment

Required server variables:

```txt
APPWRITE_ENDPOINT=https://appwrite.hothyun.com/v1
APPWRITE_PROJECT_ID=<project-id>
APPWRITE_API_KEY=<server-api-key>
APPWRITE_DATABASE_ID=korean_ski
APPWRITE_MIGRATIONS_COLLECTION_ID=schema_migrations
APPWRITE_TRIPS_COLLECTION_ID=trips
APPWRITE_TRIP_TASKS_COLLECTION_ID=trip_tasks
APPWRITE_ANALYTICS_EVENTS_COLLECTION_ID=analytics_events
```

Required public variables:

```txt
NEXT_PUBLIC_SITE_URL=https://ski.hothyun.com
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://appwrite.hothyun.com/v1
```

`APPWRITE_API_KEY` must only be configured as a server/Worker secret. Do not expose it to browser code.

The runtime Worker key needs `sessions.write` to complete Appwrite OAuth token
login on the server, plus `documents.read`, `documents.write`, and
`documents.delete` for application data access. Schema setup keys additionally
need database, collection, attribute, and index read/write scopes.

## Database

Create database:

```txt
korean_ski
```

## Migrations

Schema changes are tracked by dated files under `scripts/appwrite/migrations`.

Run migrations with:

```bash
pnpm appwrite:schema
```

The script loads `.env` automatically, creates the `schema_migrations` collection, and records applied migration IDs.

To add a migration:

1. Create `scripts/appwrite/migrations/YYYYMMDDNNNN_short_name.ts`.
2. Export a `Migration` object with an id matching the filename.
3. Add it to `scripts/appwrite/migrations.ts`.
4. Keep migrations idempotent where possible because Appwrite attributes/indexes may need retries while becoming available.

## `trips`

String attributes:

- `userId`, optional, size 255.
- `editTokenHash`, required, size 128.
- `shareTokenHash`, required, size 128.
- `resortId`, required, size 128.
- `resortNameSnapshot`, required, size 255.
- `selectedRecommendation`, optional, size 65535.
- `season`, required, size 64.
- `departureLocation`, required, size 128.
- `skillLevel`, required, size 32.
- `rideType`, required, size 32.
- `transportType`, required, size 32.
- `shuttleRouteId`, optional, size 128.
- `shuttleStopId`, optional, size 128.
- `tripDuration`, required, size 32.
- `liftTicketTimeSlot`, required, size 32.
- `selectedRentalShopId`, optional, size 128.
- `selectedRentalOptionId`, optional, size 128.
- `selectedLiftTicketOptionId`, optional, size 128. 렌탈샵 할인 리프트권 선택을 장비·의류 렌탈 선택과 독립적으로 저장한다.
- `skiPlanData`, optional, size 32768. 버전이 있는 JSON으로 스키 날짜별 시간권·렌탈샵·장비·의류·패키지·보호장비·할인 리프트권, 체크인 날짜별 숙박 밤, 가는 길·돌아오는 길 교통 구간을 저장한다. v2부터 `days`, `lodgingNights`, `transportLegs`를 사용하며 기존 단일 선택 필드는 첫 날짜/가는 길의 호환 snapshot으로 유지한다.
- `status`, required, size 32.

Datetime attributes:

- `visitDate`, required.
- `endDate`, optional. 미설정 기존 문서는 `visitDate`와 같은 날짜로 해석한다.
- `archivedAt`, optional.
- `expiresAt`, optional.

Integer attributes:

- `peopleCount`, required.
- `budgetMin`, optional.
- `budgetMax`, optional.
- `lodgingCostInput`, optional.

Boolean attributes:

- `ownsEquipment`, required.
- `ownsClothing`, required.
- `needRental`, required.
- `needClothing`, required.

Indexes:

- key index on `editTokenHash`.
- key index on `shareTokenHash`.
- key index on `userId`.
- key index on `resortId`.
- key index on `visitDate`.

## `trip_tasks`

String attributes:

- `tripId`, required, size 255.
- `category`, required, size 64.
- `title`, required, size 255.
- `status`, required, size 32.
- `memo`, optional, size 4096.
- `externalUrl`, optional, size 2048.

Boolean attributes:

- `isDefault`, required.

Integer attributes:

- `sortOrder`, required.

Datetime attributes:

- `dueDate`, optional.

Indexes:

- key index on `tripId`.
- key index on `category`.
- key index on `sortOrder`.

## `analytics_events`

String attributes:

- `tripId`, optional, size 255.
- `eventName`, required, size 128.
- `properties`, optional, size 65535.

Indexes:

- key index on `tripId`.
- key index on `eventName`.

## Permissions

The current Worker uses a server API key and application-level edit/share token checks.

- Keep collection permissions restrictive.
- Do not grant broad anonymous write access to collections.
- `editTokenHash` and `shareTokenHash` store hashes only.
- Raw edit/share tokens only appear in URLs and are never persisted.

## Auth

Enable Google OAuth in Appwrite Console:

- Auth > Settings > OAuth2 Providers > Google.
- Add `https://ski.hothyun.com` and local development hostnames to the Korean Ski project web platforms.
- The app redirects to `/oauth` after Appwrite OAuth and stores the Appwrite session secret in the Appwrite SSR cookie name `a_session_<PROJECT_ID>`.
