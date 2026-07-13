# AGENTS.md

## Product

Korean Ski is a mobile-first Korean web app for discovering resorts, comparing static seasonal prices, creating ski trips, and coordinating checklists. Anonymous trip creation remains supported. Accounts add a personal trip list and member invitations.

MVP excludes payment, booking fulfillment, live crawling, instructor matching, and live rental inventory.

## Current Stack

- Next.js App Router, React, TypeScript, Tailwind CSS, local shadcn-style components.
- Appwrite Databases, Auth, and Teams on self-hosted OCI infrastructure.
- Cloudflare Workers deployment through OpenNext.
- Umami for product analytics; Appwrite events for server-side product events.
- Vitest and Playwright.

There is no application Prisma/PostgreSQL runtime, PgAdmin workflow, Auth.js, or Coolify app deployment. Historical files must not be treated as current architecture.

## Source And Product Rules

- `src/app`: routes and server actions; `src/components`: UI; `src/lib`: business and infrastructure logic; `src/data`: static resort/pricing data.
- Product decisions belong in `docs/product`. Update the relevant document with behavior changes.
- Seasonal data is edited in code and redeployed; do not crawl. Preserve price sources and link to official operation status.
- Follow `docs/design.md`: mobile-first, Pretendard, dark-mode aware, dense and scannable operational screens, one sticky header, accessible shadcn-style controls, no nested-card clutter.

## Auth And Sharing

- Appwrite Auth supports Google OAuth and verified email/password accounts.
- Email/password users must verify email before authenticated product features are unlocked.
- Trips start private. Anonymous owners use a high-entropy edit capability URL; raw tokens are never stored.
- Owners may create multiple persistent `read` or `edit` share links. A trip/checklist change does not rotate them. Links can be revoked individually.
- Account owners may invite Appwrite users through Teams and change/remove their access. Email delivery is Appwrite's responsibility.
- Shared responses must not expose account data, internal events, token hashes, or raw tokens other than the capability in the current URL.

## Commands

Use `pnpm`.

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm data:validate
pnpm appwrite:schema
pnpm cf:deploy
```

- Routine validation is `pnpm typecheck` and `pnpm test`.
- Do not run `pnpm build` routinely. Do not start `pnpm dev` for OCI-agent UI verification.
- `pnpm appwrite:schema` changes Appwrite schema and requires the configured admin API key.
- `pnpm cf:deploy` deploys the application and requires explicit user authorization.

## Tests And Deployment Verification

- Add the narrowest useful unit, integration, or E2E test for meaningful changes.
- Local E2E builds the standalone app; only run when explicitly needed.
- Production regression: `pnpm test:e2e:production`. It targets `https://ski.hothyun.com`, creates one isolated anonymous trip, and deletes it in cleanup.
- Deployment and verification are separate approvals. Never deploy unless the user explicitly says to deploy.
- After an authorized deployment, only run production Playwright when the user asks to test/verify the deployment.
- When requested, run the production regression suite, then targeted desktop/mobile checks for the changed areas. Inspect console errors, failed requests, overflow, themes, loading/error states, and critical interactions. Clean up generated test data and report evidence and gaps.
- Do not infer permission to fix or redeploy from a verification-only request.

## Coding And Git

- Keep changes scoped, typed, and aligned with existing patterns. Avoid unrelated formatting churn.
- User-facing action failures use the typed error catalog/wrapper in `src/lib/app-error.ts` and actionable Sonner feedback. Never expose infrastructure details or secrets.
- Check `git status --short`; preserve user changes; never commit `.next`, `playwright-report`, or `test-results`.
- Commit focused completed work and push it to `origin/main`. Deployment still requires a separate explicit instruction.
