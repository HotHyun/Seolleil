# Test Strategy

## Layers

- `pnpm test:unit`: pure recommendation, pricing, checklist, parsing, and error classification.
- `pnpm test:integration`: multi-module behavior without a browser.
- `pnpm test:e2e`: local browser suite; it builds and starts the standalone app on port 3211.
- `pnpm test:e2e:production`: deployed regression against `https://ski.hothyun.com`.

Routine code validation is:

```bash
pnpm typecheck
pnpm data:validate
pnpm test
```

Do not use a local development server for OCI-agent UI verification. When `E2E_BASE_URL` is set, Playwright skips its local web server.

## Production Regression

`tests/e2e/production-regression.spec.ts` covers:

- health response and critical public routes;
- mobile overflow and ski-map visibility;
- an opt-in anonymous trip lifecycle;
- trip-internal rental filters, map/fallback visibility, rental product selection, and official/custom lodging cost capture;
- a 390px trip decision-workspace pass for horizontal overflow, key controls, and same-origin 5xx responses;
- custom trip-name and memo persistence with public-link memo privacy;
- persistent read-link validity after a checklist mutation;
- read-only capability boundaries;
- edit-link mutation, individual link revocation, and continued validity of unrelated links;
- cleanup of the generated trip in `finally`.

Run only after deployment is complete and the user explicitly asks for verification:

```bash
pnpm test:e2e:production
```

For a non-production deployment:

```bash
E2E_BASE_URL=https://preview.example.com \
E2E_ALLOW_PRODUCTION_WRITES=1 \
pnpm exec playwright test tests/e2e/production-regression.spec.ts
```

렌탈 위치 데이터나 Kakao 지도 연동을 배포한 뒤에는 전체 회귀에 이어 다음 재사용 스크립트로 SDK 로딩, 지도 타일, 정확한 Place ID 링크, 콘솔·페이지·5xx 오류를 확인한다.

```bash
PLAYWRIGHT_BROWSERS_PATH=/tmp/ms-playwright \
node scripts/playwright/generated/korean-ski-54f01a4f8c.js
```

The GitHub Actions `Production regression` workflow is manual, accepts the deployed URL and mutation opt-in, serializes runs, and retains failure traces/screenshots/videos for 14 days.

## Post-Deploy Agent Flow

1. Confirm the user authorized deployment and separately requested testing.
2. Run the production suite; do not start `pnpm dev`.
3. Perform targeted desktop/mobile checks for the deployed change, including console and failed network requests.
4. Exercise empty, validation, permission, and recoverable failure states where safe.
5. Remove generated records and report pass/fail evidence, untested email/OAuth boundaries, and recommended fixes.

Email delivery and third-party OAuth round trips remain manual unless the user explicitly supplies a safe test-account workflow.
