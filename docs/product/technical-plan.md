# 기술·운영 계획

## 확정 구조

```text
Client
  → Cloudflare Workers (OpenNext + Next.js)
  → Appwrite HTTPS API (self-hosted OCI)
  → Umami tracking endpoint
```

Appwrite가 Database, Auth, Teams와 메일 템플릿/SMTP 연결을 담당한다. 앱은 server-side API key와 사용자 session secret을 목적에 맞게 분리한다. 브라우저에 admin API key나 session secret을 노출하지 않는다.

## 배포

- production: `https://ski.hothyun.com`
- command: `pnpm cf:deploy`
- schema: `pnpm appwrite:schema`를 애플리케이션 배포 전에 명시적으로 적용.
- 배포와 검증은 별도 사용자 승인으로 수행.
- 배포 후 요청을 받으면 `pnpm test:e2e:production`과 변경 영역의 수동 Playwright 점검을 실행.

## 운영 우선순위

1. Appwrite 데이터/스토리지의 백업·복구 리허설과 버전 업그레이드 절차.
2. 공유 링크/Teams 권한 회귀 테스트와 감사 가능한 이벤트.
3. 구조화 Workers 오류 로그와 incident ID; 이후 Sentry 호환 reporter 연결.
4. Umami 퍼널과 Appwrite 제품 이벤트의 누락 점검.
5. 26/27 공식 시즌 데이터 공개 시 정적 데이터 교체와 링크 검사.

## 품질 게이트

- 코드: typecheck, Vitest, static data validation.
- UI: production regression, mobile/desktop overflow, console/network error, 접근성 smoke.
- 보안: 이메일 인증 gate, token hash 저장, read/edit 권한 분리, 폐기 링크 거부, 비밀값 redaction.
- 데이터: 가격 시즌/출처/신뢰도, 공식 링크 상태.
