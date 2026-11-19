# Sentry 기반 유저 에러 대응 Flow

## 수집 경로

| 경로 | 무엇이 잡히나 | 식별자 |
|---|---|---|
| 브라우저 Sentry (`src/instrumentation-client.ts`) | 미처리 예외, 미처리 Promise 거부, 클릭·fetch breadcrumb | 이벤트 ID, 브라우저·OS |
| 서버 Sentry (`src/sentry.server.config.ts`, 경량: 트레이싱·자동 계측 끔) | 서버 렌더·서버 액션 예외, `onRequestError` | route(`/plan/page` 등) |
| 서버 액션 실패 (`reportAppError`) | 사용자에게 토스트로 보인 실패 | tag `error.code`, `error.incident_id` |
| Workers Logs | 같은 incident의 구조화 JSON | `incidentId` |

사용자에게 보이는 오류에는 `incidentId`(액션)나 `digest`(렌더 오류 화면)가 함께 나온다. 문의가 오면 그 값으로 Sentry와 Workers Logs를 찾는다.

## 분류와 우선순위

1. **P1 즉시**: 핵심 흐름 차단. 트립 생성·저장 실패(`saveTrip`, `createTrip*`), 로그인·세션 실패, `/plan`·`/recommendations`·`/trips/*`·`/share/*` 5xx. 발견 당일 수정·배포.
2. **P2 이번 주**: 특정 기능 실패(`SERVICE_UNAVAILABLE`, `NETWORK_ERROR`이 반복), 특정 브라우저에서만 재현되는 오류.
3. **P3 모아서**: 사용자 영향이 없는 노이즈(분석 요청 취소, 확장 프로그램·광고 차단기, 봇). 필터나 무시 규칙으로 정리한다.
4. 기대된 오류(`AUTH_REQUIRED`, `FORBIDDEN`, `INVALID_INPUT`, `NOT_FOUND`)는 사용자 안내 문구가 이미 있는지 확인만 하고 이슈로 키우지 않는다.

## 처리 순서

1. Sentry Issues에서 `is:unresolved`를 최근 순으로 본다. 신규·급증 이슈를 먼저 본다.
2. 이슈 상세에서 route, 브라우저·OS, breadcrumb(마지막 클릭·fetch), `error.code` 태그를 확인한다.
3. 재현 경로와 영향(사용자 수, 이벤트 수)으로 P1~P3를 정한다.
4. 수정은 가장 좁은 테스트와 함께 하고, 이슈에 원인·커밋을 남기고 Resolve한다. 재발하면 자동으로 다시 열린다.
5. 사용자에게 보이는 문구가 부족하면 `src/lib/app-error.ts` 카탈로그를 고친다. 인프라 정보나 시크릿은 노출하지 않는다.

## 정기 점검

- 하루 1회(성수기): 신규 이슈와 P1 후보 확인.
- 배포 직후: 신규 이슈 발생 여부, Cloudflare Workers 오류율·CPU 시간(p50/p99) 확인. 서버 Sentry를 켠 뒤 CPU가 늘면 다시 끈다(과거 OpenTelemetry 계측이 CPU 절반 이상을 써 1102 오류를 냈다).
- 주 1회: 상위 이슈 정리, 무시 규칙·알림 규칙 조정. 알림은 신규 이슈·급증에 이메일로 받는다.

## 개인정보

`sentryBeforeSend`가 이메일·IP, 쿠키, 요청 본문, 쿼리, 토큰 경로(`/share|trips/[REDACTED]`)를 제거한다. 새 컨텍스트를 붙일 때 토큰·개인 정보를 넣지 않는다.

## 2026-11-19 점검 결과 (unresolved 4건)

| 이슈 | 내용 | 원인 | 조치 |
|---|---|---|---|
| KOREAN-SKI-D/E (서버, 19건) | `/plan`, `/resorts/[id]` 렌더 중 "promise was created by a request that has since ended" | Firebase 액세스 토큰의 진행 중 Promise를 모듈 전역으로 공유해 Workers에서 다른 요청이 끝난 Promise를 기다림 | `src/lib/firebase.ts`에서 요청 단위 `cache`로 변경 |
| KOREAN-SKI-F (iOS Safari) | 홈 CTA 클릭 직후 `POST /` "Load failed" | 내부 이동 CTA가 보낸 분석 서버 액션이 페이지 이동과 겹쳐 취소됨. 서버는 `external_link_click`만 받아 어차피 무시 | `AnalyticsLink`가 외부 링크 클릭만 서버 액션을 호출하고 실패는 삼킴 |
| KOREAN-SKI-C | "Router action dispatched before initialization" (1건) | 하이드레이션 전에 이동이 시작된 Next 내부 오류로 추정 | 관찰. 재발이 늘면 P2로 올린다 |

배포 후 D/E/F가 더 쌓이지 않는지 확인하고 Resolve한다.
