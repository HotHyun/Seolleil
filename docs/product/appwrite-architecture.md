# Appwrite 아키텍처 계획

## 목표

Korean Ski는 PostgreSQL 직접 연결, Hyperdrive, Auth.js/Prisma Adapter 중심 구조에서
OCI self-hosted Appwrite BaaS 중심 구조로 단계적으로 전환한다. 같은 OCI Appwrite
인스턴스를 여러 개인 서비스의 공통 Auth, Database, Storage, Permissions 기반으로
사용할 수 있게 만드는 것이 목표다.

## 목표 구조

```txt
Cloudflare Pages/Workers/Next.js client and server logic
  -> HTTPS
  -> appwrite.hothyun.com
  -> Cloudflare Tunnel or Cloudflare proxied HTTPS
  -> OCI self-hosted Appwrite
  -> Appwrite internal DB/Storage/Auth
```

## 중단하는 방향

- Cloudflare Hyperdrive로 OCI PostgreSQL에 직접 연결하지 않는다.
- Cloudflare Worker에서 PostgreSQL TCP connection을 만들지 않는다.
- Korean Ski용 PostgreSQL `5432`를 public internet에 열지 않는다.
- Hyperdrive private database 생성을 위해 만든 임시 PostgreSQL tunnel, DNS, Access
  자산은 Appwrite 노출에 재사용하지 않는다면 정리한다.

## Appwrite 역할

- Auth: Google OAuth, 이메일·비밀번호, 이메일 인증과 사용자 세션.
- Teams: 트립별 이메일 초대와 viewer/editor 역할.
- Databases: 트립, 체크리스트, 이벤트 collection.
- Permissions: 사용자 소유 트립, 익명 edit token 접근, read-only share link 정책.
- Storage: 향후 사용자 파일이나 운영 첨부물이 필요할 때 사용.
- Console: 운영자가 collection, auth provider, project 설정을 관리.

## Collection 초안

### `trips`

현재 트립 저장소로 사용한다.

- Appwrite document id: 기존 `Trip.id`와 호환 가능한 string id.
- owner user id: 로그인 사용자의 Appwrite user id.
- `editTokenHash`: private edit link 검증용. raw token 저장 금지.
- `shareTokenHash`: public read-only share link 검증용. raw token 저장 금지.
- resort, visit date, people count, skill level, ride type, transport type, rental,
  lodging, status, archive/expiry fields.
- Appwrite permissions는 로그인 사용자 소유권을 표현하고, token hash는 링크 기반
  접근을 검증하는 application-level secret으로 유지한다.

### `trip_tasks`

현재 체크리스트 저장소로 사용한다.

- `tripId`.
- category, label, status, due date, sort order.
- user-added flag.
- private memo는 share response에서 제외한다.

### `analytics_events`

현재 제품 이벤트 저장소로 사용한다.

- event name.
- anonymous/session/user/trip correlation ids.
- metadata.
- created timestamp.
- 개인정보와 edit/share raw token은 저장하지 않는다.

### `trip_share_links`

- `tripId`, SHA-256 `tokenHash`, `read|edit` 권한, 생성자, 폐기 시각을 저장한다.
- 여러 링크를 유지하므로 새 링크 발급이나 트립 변경이 기존 링크를 무효화하지 않는다.

## Auth 전환 설계

- Auth.js Google OAuth는 Appwrite Auth Google OAuth로 대체했다.
- SSR OAuth는 Appwrite `createOAuth2Token` flow를 사용한다.
- OAuth callback은 `userId`와 `secret`으로 Appwrite session을 만들고 httpOnly cookie에 session secret을 저장한다.
- 로그인은 선택 사항으로 유지한다.
- 익명 사용자는 트립을 만들 수 있어야 한다.
- 익명 트립은 edit link로 접근한 뒤 로그인 계정에 attach할 수 있어야 한다.
- logged-in user trip list는 Appwrite user id 기준으로 조회한다.
- 이메일 가입은 Appwrite Account API와 verification URL을 사용한다.
- 계정 초대는 Appwrite Teams membership invite와 내장 메일 전송을 사용한다.
- Auth.js용 Prisma 모델인 `User`, `Account`, `Session`, `VerificationToken`,
  `Authenticator`는 Appwrite Auth 전환 완료 후 제거한다.

## Share/Edit 보안

- edit/share URL에는 raw token이 들어갈 수 있지만 저장소에는 hash만 저장한다.
- edit token은 소유자 관리 기능에만 사용한다.
- share token은 itinerary, checklist status, reservation/preparation state만 읽는다.
- 공유 응답은 개인 메모, 내부 이벤트, 사용자 식별 정보, raw token을 노출하지 않는다.
- Appwrite document permissions만으로 public share link를 구현하지 않고, 서버 로직에서
  token hash 검증과 response shaping을 함께 수행한다.

## 운영 계획

- Appwrite는 OCI에서 Docker Compose/Coolify 또는 직접 Docker Compose로 운영한다.
- 2 OCPU/12 GB RAM 환경에서 컨테이너 수와 메모리 사용량을 확인한 뒤 리소스 제한을 둔다.
- Appwrite data, database, storage, cache, certificates는 명확한 host path 또는 volume에
  분리한다.
- `appwrite.hothyun.com`은 Cloudflare Tunnel 또는 Cloudflare proxied HTTPS로 노출한다.
- API endpoint는 브라우저와 Cloudflare 서버 로직에서 접근 가능해야 하므로 Cloudflare
  Access로 전체 보호하지 않는다.
- Console 보호가 필요하면 Console 전용 경로나 별도 hostname에 Access 정책을 적용하는
  방안을 검토한다.
- Cloudflare Tunnel token이 대화나 로그에 노출되었다면 rotate/recreate한다.

## 단계별 구현

1. Hyperdrive/OpenNext 실험 변경을 제거한다.
2. Appwrite project, endpoint, Google OAuth provider, base collections를 만든다.
3. 앱에 Appwrite SDK/env를 추가한다.
4. Auth.js 기반 로그인 UI/API를 Appwrite Auth 흐름으로 대체한다.
5. Appwrite Auth로 Google OAuth와 session handling을 전환한다.
6. 로그인 사용자의 내 트립 목록과 anonymous attach-to-account flow를 복구한다.
7. 기존 PostgreSQL 데이터가 필요하면 Appwrite documents로 이전하는 one-off script를 작성한다.
8. 남은 Prisma/Auth.js/PostgreSQL 문서와 운영 절차를 제거한다.

## 정리 대상

Cloudflare 삭제 또는 변경 후보:

- PostgreSQL용 Hyperdrive configuration.
- Hyperdrive가 자동 생성한 Access service token/application/policy.
- `korean-ski-db.hothyun.com` public hostname/DNS.
- PostgreSQL private DB용 tunnel 또는 해당 route.
- 노출된 Tunnel token rotate/recreate.

OCI 삭제 후보:

- `/opt/postgres-stack`.
- `/srv/postgres/data`.
- `/srv/postgres/certs`.
- `/srv/pgadmin/data`.
- `/srv/backups/postgres`.
- Docker containers: `postgres-main`, `pgadmin-main`, `cloudflared-postgres`.
- Docker network: `postgres-net`.

위 항목은 데이터와 외부 자산 삭제를 포함하므로 별도 사용자 확인 후 수동 명령으로만 처리한다.
