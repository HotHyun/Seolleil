# 오류 처리와 사용자 복구 UX

## 목표

오류를 기술 메시지로 노출하지 않고 사용자가 다음 행동을 결정할 수 있게 한다. 동시에 운영 로그가 같은 실패를 추적할 수 있어야 한다.

## 표준 구조

`src/lib/app-error.ts`가 오류 코드, 안전한 한국어 안내, 재시도 가능 여부, incident ID와 reporter 경계를 관리한다. 서버 액션은 `ActionResult`를 반환하고 클라이언트는 `showActionResult`로 Sonner 피드백을 표시한다.

현재 코드: `AUTH_REQUIRED`, `EMAIL_NOT_VERIFIED`, `FORBIDDEN`, `NOT_FOUND`, `INVALID_INPUT`, `CONFLICT`, `EMAIL_DELIVERY_FAILED`, `NETWORK_ERROR`, `SERVICE_UNAVAILABLE`, `UNKNOWN`.

새 오류를 추가할 때:

1. 카탈로그에 안정적인 제품 코드를 추가한다.
2. 사용자가 할 수 있는 다음 행동을 메시지에 쓴다.
3. 재시도가 실제로 의미 있을 때만 `retryable`을 켠다.
4. 서버 액션의 `actionFailure` context에는 액션명과 비민감 식별자만 넣는다.
5. 토큰, 세션 secret, 이메일, 요청 본문, Appwrite API key는 기록하지 않는다.
6. 분류와 안전한 메시지를 단위 테스트한다.

## 발생 지점

- 입력/검증: 잘못된 값은 `INVALID_INPUT`과 수정 안내.
- 인증/이메일 인증: `AUTH_REQUIRED` 또는 `EMAIL_NOT_VERIFIED`와 해당 화면 이동 안내.
- 공유 권한/폐기 링크: `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`를 구분.
- Appwrite/네트워크: 연결 실패와 5xx를 재시도 가능한 오류로 분류.
- 메일 초대: 발송 실패는 `EMAIL_DELIVERY_FAILED`; 사용자의 초대 입력을 유지한다.
- 렌더링: App Router error boundary에서 재시도와 홈 이동, digest 참조 번호를 제공한다.

## 관측성 연결점

기본 reporter는 구조화 JSON을 표준 오류 로그에 남긴다. Sentry를 도입할 때 `ErrorReporter.capture` 구현만 교체해 code, incidentId, action context를 tag/context로 보내고 원본 예외를 capture한다. 제품 이벤트 컬렉션에는 예외 stack을 저장하지 않는다.
