# Appwrite 운영 아키텍처

## 역할

- Databases: trips, tasks, share links, analytics events, migration ledger.
- Auth: Google OAuth, email/password, email verification, password recovery, sessions.
- Teams: 트립 멤버 초대, 수락, viewer/editor 역할 변경과 제거.
- Messaging/SMTP: Appwrite 인증 및 초대 메일.

Cloudflare Worker는 admin API key를 사용한 서버 데이터 작업과 httpOnly cookie의 사용자 session secret 작업을 구분한다. 공개 share/edit URL은 서버에서 SHA-256 hash로 조회하고 권한에 맞춰 응답을 제한한다.

## 인증

- Google OAuth callback과 이메일/password 세션 모두 Appwrite session을 httpOnly, secure cookie로 유지한다.
- email/password 가입 직후 인증 메일 브릿지로 이동한다.
- `emailVerification=false`인 계정은 내 트립, 초대 등 로그인 사용자 기능을 사용할 수 없다.
- verification/recovery URL은 production origin allowlist와 HTTPS를 사용한다.

## 공유와 협업

- 생성 직후 트립은 비공개다.
- 익명 소유자는 edit capability URL로 관리하고, 계정 소유자는 session과 ownership으로 관리한다.
- `trip_share_links`에는 독립적인 read/edit 링크가 여러 개 존재할 수 있다.
- 링크는 트립 수정이나 새 링크 발급 뒤에도 유지되고 개별 폐기할 수 있다.
- Teams 멤버는 초대 수락 후 계정 단위 접근을 얻으며 소유자가 권한 변경/제거한다.

## 환경과 스키마

환경 변수와 Console 단계는 `appwrite-auth-sharing-setup.md`, collections/attributes/index는 `appwrite-collections.md`를 따른다. 스키마 변경은 날짜 기반 migration과 `schema_migrations` ledger로 반복 실행 가능해야 한다.

## 운영 보안

- Appwrite API key, SMTP credential, session secret, raw capability token은 로그/analytics 금지.
- API key scope는 schema automation과 runtime을 분리하고 최소 권한으로 유지한다.
- Appwrite endpoint와 Console은 TLS를 사용하고, Console 운영자 접근은 별도로 제한한다.
- 백업은 Appwrite 데이터베이스, storage, configuration을 함께 다루며 복구 리허설로 검증한다.
