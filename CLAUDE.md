# CLAUDE.md

이 파일은 Claude Code용 프로젝트 가이드입니다. 상세 규칙은 `AGENTS.md`(제품·인증·배포·테스트 규칙)가 기준이며, 두 파일이 다르면 `AGENTS.md`와 `docs/product/`를 따릅니다.

## 프로젝트 개요

**설레일 (Seolleil)** — 국내 스키장 탐색, 조건 기반 추천, 시즌 가격 비교, 스키 트립 체크리스트와 동행자 공유를 제공하는 모바일 우선 한국어 웹 앱. 저장소/패키지명은 `korean-ski`, 운영 주소는 `https://ski.hothyun.com`.

- 익명 트립 생성을 지원하고, 로그인하면 내 트립 목록과 멤버 초대가 추가됩니다.
- MVP 제외: 결제/예약 대행, 실시간 크롤링·재고, 강사 매칭, 커뮤니티.
- 가격은 코드에 둔 **정적 시즌 참고 데이터**이며 실시간 견적이 아닙니다. 운영/슬로프 현황은 공식 링크로만 안내합니다.

## 기술 스택

- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 3 + 로컬 shadcn 스타일 컴포넌트(Radix), Pretendard
- Firebase Auth(Google OAuth, 이메일/비밀번호) + Cloud Firestore (Worker의 service account가 REST로 접근)
- Cloudflare Workers 배포 (`@opennextjs/cloudflare`). Firebase Hosting/Functions 미사용
- Umami(웹 분석), Firestore `analytics_events`(서버 이벤트), 선택적 Sentry
- Vitest(unit/integration), Playwright(e2e), pnpm 9

> `prisma/`, `Dockerfile`, `docker-compose*.yml`, `ops/appwrite-backup/`은 과거 아키텍처 잔재입니다. 현재 런타임이 아니므로 참고하지 마세요.

## 명령어

```bash
pnpm install
pnpm typecheck        # 일상 검증
pnpm lint             # 에러 0건 유지 (CI에서도 실행)
pnpm test             # vitest (unit + integration)
pnpm data:validate    # 정적 데이터 검증 (CI에서도 실행)
pnpm data:report / data:links   # 데이터 리포트 / 공식 링크 점검
pnpm test:e2e         # 로컬 Playwright (필요할 때만)
pnpm cf:deploy        # 배포 — 사용자의 명시적 지시가 있을 때만
```

- `pnpm build`, `pnpm dev`는 일상적으로 실행하지 않습니다.
- production 회귀 테스트(`pnpm test:e2e:production`)는 사용자가 요청할 때만 실행합니다. 배포와 검증은 별개의 승인입니다.

## 디렉터리 구조

- `src/app` — 라우트와 서버 액션 (`actions.ts`가 트립/체크리스트/공유 액션의 중심, `auth-actions.ts`는 인증)
  - 주요 라우트: `/`, `/plan`, `/recommendations`, `/resorts[/id]`, `/trips/[editToken]`, `/share/[shareToken]`, `/my-trips`, `/invite/accept`, `/login`, `/admin/data-quality`, `/api/health`, `/api/auth/session`
- `src/components` — `trip/`(트립 작업공간), `auth/`, `ui/`
- `src/lib` — 비즈니스/인프라 로직: `pricing`, `recommendation`, `trip-store`(Firestore 저장), `firebase`(REST 어댑터), `trip-access`, `tokens`/`token-vault`(공유 토큰), `app-error`, `data-validation`
- `src/data` — 정적 데이터: 스키장(`resorts`), 가격(`prices`), 셔틀(`ski-shuttles/`), 렌탈/숙박, 시즌 조사(`season-research`)
- `docs/product` — 제품 결정 문서의 기준 위치. 동작을 바꾸면 관련 문서도 함께 수정
- `tests/{unit,integration,e2e}`, `scripts/`(데이터 검증·링크 점검·렌탈 위치 생성)

## 작업 규칙 (요약)

- 한국어 UI 문구, 모바일 우선, 다크 모드 대응, 조밀하고 훑기 쉬운 화면 (`docs/design.md`).
- 사용자에게 보이는 액션 실패는 `src/lib/app-error.ts`의 typed error와 Sonner 피드백을 사용하고, 인프라 정보·시크릿은 노출하지 않습니다.
- 클라이언트는 Firestore 문서를 직접 읽거나 쓰지 않습니다. `firestore.rules`는 전체 차단 상태를 유지하고 서버 어댑터만 사용합니다.
- raw edit/share/invite 토큰, 개인정보는 로그·분석 이벤트에 남기지 않습니다. 토큰은 해시로 저장하고 재복사용 값은 서버 키로 암호화합니다.
- 가격 데이터는 코드에서 수정 후 재배포합니다. 크롤링 금지, 출처·확인일·신뢰도(`confirmed|estimated|phone_confirmed|unavailable`)를 유지합니다.
- 변경은 범위를 좁게, 기존 패턴에 맞춰 작성하고 가장 좁은 테스트를 추가합니다.
- 이 프로젝트의 Next.js는 학습 데이터와 다를 수 있으므로 코드를 쓰기 전 `node_modules/next/dist/docs/`의 해당 가이드를 확인합니다.

## 시크릿 / 민감 파일

다음은 `.gitignore`에 포함되어 있으며 절대 커밋·출력·브라우저 노출 금지입니다: `.env`, `servicekey.json`(Firebase service account), `share-token-key.txt`(`FIREBASE_SHARE_TOKEN_KEY`). 환경 변수 목록은 `.env.example` 참고.

## Git

- 작업 전 `git status --short`로 사용자 변경사항을 확인하고 보존합니다.
- `.next`, `.open-next`, `playwright-report`, `test-results`는 커밋하지 않습니다.
- 배포는 별도의 명시적 지시가 있을 때만 합니다.
