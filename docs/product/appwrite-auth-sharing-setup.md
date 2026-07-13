# Appwrite 인증·공유 설정 가이드

## 환경 변수

```txt
NEXT_PUBLIC_SITE_URL=https://ski.hothyun.com
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://appwrite.hothyun.com/v1
APPWRITE_ENDPOINT=https://appwrite.hothyun.com/v1
APPWRITE_PROJECT_ID=...
APPWRITE_API_KEY=... # 반드시 secret
APPWRITE_DATABASE_ID=korean_ski
APPWRITE_TRIPS_COLLECTION_ID=trips
APPWRITE_TRIP_TASKS_COLLECTION_ID=trip_tasks
APPWRITE_ANALYTICS_EVENTS_COLLECTION_ID=analytics_events
APPWRITE_TRIP_SHARE_LINKS_COLLECTION_ID=trip_share_links
```

API key에는 Databases read/write, Users read/write, Teams read/write 범위가 필요하다. `NEXT_PUBLIC_*`에는 API key를 넣지 않는다.

## Console 설정

1. Project → Platforms에서 Web 앱 `ski.hothyun.com`을 등록한다. preview hostname은 별도로 정확히 등록한다.
2. Auth → Settings에서 Email/Password와 Google OAuth를 활성화한다.
3. 비밀번호 최소 8자, common/compromised password와 personal data 차단을 권장한다.
4. Auth 이메일 인증 및 Teams invitation 템플릿을 한국어로 설정한다.
   초대로 자동 생성된 계정은 `/forgot-password`에서 Appwrite recovery 메일을 받아 첫 비밀번호를 설정한다.
5. Messaging → Providers → Email → SMTP에 Gmail SMTP를 설정한다.

```txt
Host: smtp.gmail.com
Port: 587
Encryption: STARTTLS
Username: 발신 Gmail 주소
Password: 2단계 인증 후 발급한 Google 앱 비밀번호
```

개인 Gmail은 한도와 스팸 정책 때문에 소규모 검증용으로만 권장한다. 운영 규모가 커지면 전용 도메인의 transactional provider로 이전한다.

## 스키마 적용

배포 전에 운영 권한으로 아래 명령을 한 번 실행한다. 앱 배포는 수행하지 않는다.

```bash
pnpm appwrite:schema
```

Console에서 `trips.teamId`, `trip_share_links` collection 및 `tripId/tokenHash` index를 확인한다.

## 검증 순서

1. 이메일 가입 → 인증 메일 → `/verify-email` → 로그인.
2. 새 트립이 공유 링크 없이 비공개인지 확인.
3. 읽기/편집 링크를 만들고 트립 변경 후에도 기존 링크가 열리는지 확인.
4. 읽기 링크 mutation 거부, 편집 링크 체크리스트 변경 확인.
5. 기존/미가입 이메일에 viewer/editor 초대를 보내 수락 후 권한 확인.
6. Auth verification, Teams membership, Messaging delivery log 확인.
