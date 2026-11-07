# 기술·운영 계획

## 확정 구조

```text
Browser
  → Cloudflare Workers (OpenNext + Next.js)
  → Firebase Authentication (browser sign-in; verified ID token)
  → Cloudflare Worker server actions/API
  → Firestore REST API (service account through Google OAuth)
  → Umami tracking endpoint
```

Firebase Authentication은 Google과 이메일/비밀번호 로그인 및 인증 메일을 처리한다. Firestore는 트립, 체크리스트, 공유, membership, 서버 제품 이벤트를 보관한다. Worker는 Firebase Admin SDK 대신 Web Crypto와 Firestore REST API를 사용하며, service account JSON과 공유 토큰 암호화 키는 Cloudflare secret으로 관리한다. Firebase Hosting이나 Cloud Functions는 사용하지 않는다.

## 페이지 렌더링과 캐시

- 코드에 포함되어 배포 때만 바뀌는 공개 콘텐츠(`/`, `/resorts`, `/resorts/[id]`)는 정적으로 생성한다. 스키장 상세는 알려진 ID만 빌드 대상으로 둔다. 시즌 가격·운영 정보는 ISR 대신 데이터 검증 후 재배포한다.
- 여행 입력, 추천 결과, 로그인, 이메일 인증, 초대 수락처럼 URL 쿼리에 따라 달라지는 공개 화면은 정적 페이지 셸을 제공하고 쿼리값은 브라우저에서 읽는다. 페이지 셸은 인증 코드나 초대 토큰을 HTML 캐시에 넣지 않는다.
- `/my-trips`, `/my-trips/[tripId]`, `/trips/[editToken]`, `/share/[shareToken]`은 계정 세션 또는 capability 토큰에 따라 결과가 달라지므로 요청마다 서버에서 권한을 확인한다. 이 응답은 ISR/CDN 공유 캐시 대상이 아니다.
- 루트 레이아웃은 세션을 검증하지 않는다. 브라우저 Firebase 상태를 서버 세션 쿠키와 동기화하고, 인증이 필요한 페이지와 Server Action이 서버에서 세션 및 권한을 확인한다.
- `/admin/data-quality`는 우선순위 쿼리 필터를 서버에서 읽기 때문에 요청 시 렌더링으로 남는다. 관리자 트래픽은 적고 인증/토큰 응답과 무관하다.

## 배포

- production: `https://ski.hothyun.com`
- command: `pnpm cf:deploy`
- 컬렉션은 Firestore 첫 쓰기 때 생성되며 별도 스키마 migration 명령은 없다.
- 배포와 검증은 별도 사용자 승인으로 수행.
- 배포 후 요청을 받으면 `pnpm test:e2e:production`과 변경 영역의 수동 Playwright 점검을 실행.

## 운영 우선순위

1. Firebase service account key rotation, Firestore 백업/복구와 접근 로그 절차.
2. 공유 링크/Firebase membership 권한 회귀와 감사 가능한 이벤트.
3. 구조화 Workers 오류 로그와 incident ID; 이후 Sentry 호환 reporter 연결.
4. Umami 퍼널과 Firestore 제품 이벤트의 누락 점검.
5. 26/27 공식 시즌 데이터 공개 시 정적 데이터 교체와 링크 검사.

기존 OCI Appwrite 설치와 백업 파일은 Firebase 전환에서 수정하거나 삭제하지 않는다. 별도 점검 후 정리한다.

## 품질 게이트

- 코드: typecheck, Vitest, static data validation.
- UI: production regression, mobile/desktop overflow, console/network error, 접근성 smoke.
- 보안: 이메일 인증 gate, 토큰 해시 저장, read/edit 권한 분리, 폐기 링크 거부, secret redaction.
- 데이터: 가격 시즌/출처/신뢰도, 공식 링크 상태.
