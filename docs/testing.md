# Test Strategy

Korean Ski uses three test layers.

## Unit Tests

Command:

```bash
pnpm test:unit
```

Scope:

- Recommendation ranking rules.
- Pricing calculations.
- Checklist generation and completion logic.
- Trip input parsing.

## Integration Tests

Command:

```bash
pnpm test:integration
```

Scope:

- Feature-level flows that combine static data, recommendation, pricing, and checklist generation.
- No browser required.

## E2E Tests

Local command:

```bash
pnpm test:e2e
```

Remote deployment command:

```bash
E2E_BASE_URL=https://ski.hothyun.com pnpm test:e2e:remote
```

Scope:

- Landing page.
- Plan form.
- Recommendation page.
- Responsive mobile rendering.
- Trip creation, edit-link landing, and read-only share page.
- Public-page accessibility smoke checks and horizontal overflow checks.

Playwright currently builds the app and starts the Next standalone server on port `3211`
by default. Because this is resource-intensive, do not run E2E as part of the
routine validation loop unless browser coverage is specifically needed.

When `E2E_BASE_URL` or `PLAYWRIGHT_BASE_URL` is set, Playwright does not run the
local web server and does not trigger `pnpm build`. Use this mode for Coolify
deploy verification.

Install browsers before first E2E run:

```bash
pnpm exec playwright install chromium
```

## DB-Backed Tests

For DB-backed flows, start the test database:

```bash
docker compose -f docker-compose.test.yml up -d
DATABASE_URL="postgresql://korean_ski:korean_ski_test@localhost:55432/korean_ski_test?schema=public" pnpm db:deploy
```

Then run the target tests.

## Full Local Check

Routine validation:

```bash
pnpm typecheck
pnpm data:validate
pnpm data:report
pnpm test
```

Build and E2E checks are reserved for deploy verification or browser-specific changes.

`pnpm data:links`는 외부 네트워크를 사용하므로 routine validation에는 포함하지 않고, 가격/렌탈 링크를 대량 수정했을 때 수동으로 실행한다.

## Automated Coverage Map

- `tests/e2e/landing.spec.ts`: first viewport, primary CTAs, mobile landing, login entry point.
- `tests/e2e/recommendations.spec.ts`: plan entry and recommendation result rendering.
- `tests/e2e/core-flow.spec.ts`: recommendation-to-trip creation and read-only share link.
- `tests/e2e/mobile-layout.spec.ts`: home, plan, recommendations, resort list/detail, and login viewport checks.
- `tests/e2e/accessibility.spec.ts`: one `main` landmark per page, unnamed interactive-control checks, and overflow smoke checks.
