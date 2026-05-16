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

Command:

```bash
pnpm test:e2e
```

Scope:

- Landing page.
- Plan form.
- Recommendation page.
- Responsive mobile rendering.

Playwright builds the app and starts the Next standalone server on port `3211`
by default. This keeps E2E behavior close to production and avoids
environment-dependent development server behavior.

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

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```
