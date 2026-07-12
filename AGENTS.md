# AGENTS.md

## Project Summary

Korean Ski is a mobile-first web app for planning Korean ski trips. It provides:

- Korean ski resort directory.
- Rule-based resort recommendations.
- Date-aware static seasonal pricing.
- Trip itinerary and checklist tracking.
- Optional login and a personal trip list.
- Edit links for private trip management.
- Read-only share links for itinerary, checklist, and reservation status.

The MVP intentionally does not include in-app payment, real-time crawling, instructor matching, or live rental inventory.

## Stack

- Next.js App Router.
- React.
- TypeScript.
- PostgreSQL.
- Prisma.
- Tailwind CSS.
- shadcn-style local UI components.
- lucide-react icons.
- Vitest for unit/integration tests.
- Playwright for E2E tests.
- Docker Compose for deployment.
- Coolify on OCI Free Tier Ampere.

## Source Layout

- `src/app`: Next.js routes and pages.
- `src/components`: shared UI and analytics components.
- `src/data`: static resort, pricing, travel, and MVP dataset data.
- `src/lib`: core business logic such as recommendation, pricing, checklist, tokens, trip input parsing.
- `prisma`: schema and migrations.
- `tests/unit`: isolated business logic tests.
- `tests/integration`: feature-level flow tests without a browser.
- `tests/e2e`: Playwright browser tests.
- `docs/product`: living product planning documents.
- `docs/design.md`: UI design system and visual rules.
- `docs/testing.md`: test strategy and commands.
- `docker-compose.yml`: production/Coolify compose file.
- `docker-compose.test.yml`: local test PostgreSQL.

## Product Planning Rule

Planning decisions must be recorded in `docs/product`.

When product scope, recommendation logic, pricing policy, share behavior, checklist behavior, analytics, or deployment assumptions change:

1. Update the relevant document in `docs/product`.
2. If no suitable document exists, create one there.
3. Keep the implementation aligned with the updated document.

Current key product docs:

- `docs/product/mvp.md`
- `docs/product/decisions.md`
- `docs/product/recommendation.md`
- `docs/product/pricing.md`
- `docs/product/checklist.md`
- `docs/product/trip-flow.md`
- `docs/product/share-security.md`
- `docs/product/data-model.md`
- `docs/product/resort-dataset.md`
- `docs/product/analytics.md`
- `docs/product/ui-design.md`
- `docs/product/technical-plan.md`

## Data Policy

- MVP resort and pricing data are static code data.
- Seasonal price updates should be made by editing code data and redeploying.
- Do not add automatic crawling for MVP.
- Official operation/slope status should be linked out, not scraped.
- Price accuracy matters: when adding real seasonal data, preserve source URLs or notes near the data or in product docs.

## Auth And Sharing

- MVP has optional login.
- Initial auth provider is Google OAuth via Auth.js and the Prisma Adapter.
- Anonymous trip creation must remain possible.
- Logged-in users can access their trips from a personal trip list.
- Anonymous trips can be attached to a user account from the edit link flow.
- Trips are stored in PostgreSQL.
- Private edit access uses edit tokens.
- Public sharing uses read-only share links.
- Store token hashes, not raw tokens.
- Shared pages should expose only itinerary, checklist, and reservation/preparation state.

## Deployment Notes

Production target:

- App: `https://ski.hothyun.com`
- PgAdmin: `https://ski-admin.hothyun.com`
- Host: OCI Free Tier Ampere, ARM architecture.
- Runtime: Coolify with Docker Compose.

Important compose behavior:

- `docker-compose.yml` uses `expose`, not host `ports`, so Coolify can route traffic.
- App listens internally on port `3000`.
- PostgreSQL service name is `postgres`.
- App runs Prisma migration deploy before starting.
- PgAdmin is included for MVP DB inspection.

Required production environment variables:

```txt
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
PGADMIN_DEFAULT_EMAIL
PGADMIN_DEFAULT_PASSWORD
NEXT_PUBLIC_UMAMI_WEBSITE_ID
NEXT_PUBLIC_UMAMI_SCRIPT_URL
```

Umami variables may be empty until analytics is ready.

## Development Commands

Use `pnpm`.

```bash
pnpm install
pnpm typecheck
pnpm test
```

Useful scripts:

- `pnpm dev`: run local Next dev server.
- `pnpm build`: generate Prisma client and build Next. Do not run this as a routine validation step unless the user asks for build/deploy verification.
- `pnpm typecheck`: TypeScript check.
- `pnpm test`: all Vitest tests.
- `pnpm test:unit`: unit tests only.
- `pnpm test:integration`: integration tests only.
- `pnpm test:e2e`: Playwright E2E.
- `pnpm test:all`: typecheck, Vitest, and Playwright. Avoid this for routine checks because Playwright currently runs a production build.
- `pnpm db:generate`: Prisma generate.
- `pnpm db:migrate`: local Prisma migration.
- `pnpm db:deploy`: deploy migrations.

## Test Policy

Every meaningful behavior change should include the narrowest useful test.

Use these defaults:

- Core pure logic: unit test in `tests/unit`.
- Multi-step feature behavior without browser: integration test in `tests/integration`.
- User-visible routing/forms/responsive behavior: E2E test in `tests/e2e`.

Routine validation:

```bash
pnpm typecheck
pnpm test
```

Playwright currently builds and starts the standalone app on port `3211` by default. Run E2E only when explicitly needed or when a compatible already-running server is available.

### Deployment-Based UI Verification

- Agents run in the OCI environment and should not start `pnpm dev` or another local development server for routine UI verification.
- Code completion does not authorize deployment. Deploy only after the user explicitly instructs the agent to deploy.
- After an explicitly authorized deployment, run browser or Playwright checks against the deployed URL only when the user asks for verification.
- When deployment verification is requested, the agent should perform the checks directly instead of asking the user to run them. Check the requested desktop/mobile layouts, relevant themes and interactions, console errors, failed requests, and horizontal overflow as applicable.
- Clearly distinguish code-level validation completed before deployment from browser validation performed against the deployed environment.
- A request to verify a deployed site does not authorize additional code changes or redeployment. Report findings first unless the user also asks to fix and redeploy.

Before first E2E run on a new machine:

```bash
pnpm exec playwright install chromium
pnpm exec playwright install-deps chromium
```

For DB-backed test flows:

```bash
docker compose -f docker-compose.test.yml up -d
DATABASE_URL="postgresql://korean_ski:korean_ski_test@localhost:55432/korean_ski_test?schema=public" pnpm db:deploy
```

## UI Guidelines

- Mobile-first.
- Use the design system in `docs/design.md`.
- Keep one sticky top header; do not add a persistent sidebar for MVP.
- Dark mode is the default visual direction.
- The home page is also the landing page and should communicate the product value immediately.
- Avoid empty first screens on desktop.
- Keep operational screens dense, scannable, and practical.
- Prefer real controls over explanatory text.
- Use lucide icons for buttons/actions where appropriate.
- Keep cards for repeated items or framed tools; avoid nested cards.
- Check desktop and mobile layouts for text overflow.

## Coding Guidelines

- Keep changes scoped to the requested behavior.
- Prefer existing local patterns over introducing new abstractions.
- Keep business logic in `src/lib` when possible.
- Keep static datasets in `src/data`.
- Use typed constants and structured data instead of ad hoc strings.
- Avoid unrelated formatting churn.
- Do not commit generated artifacts such as `.next`, `playwright-report`, or `test-results`.

## Git Workflow

- Do not overwrite user changes.
- Check `git status --short` before committing.
- Commit focused changes with clear messages.
- Push to `origin/main` when the user asks to publish or when deployment fixes are complete.
- Do not deploy unless the user explicitly asks for deployment. Finishing a code change is not deployment approval.
- After completing a work item, commit and push the completed code changes, but leave deployment for a separate explicit user instruction.
