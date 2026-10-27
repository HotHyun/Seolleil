# 데이터 모델

## 저장 위치

- `src/data`: 스키장, 이동, 시즌 가격과 출처 등 재배포 가능한 정적 기준 데이터.
- Firebase Authentication: 계정, Google 및 이메일/비밀번호 인증, 이메일 인증 상태.
- Cloud Firestore: 트립, 체크리스트, 공유 링크, 초대와 제품 이벤트.
- `src/lib/firebase.ts`: Cloudflare Workers에서 Firestore REST API를 사용하는 서버 어댑터.

Firestore는 스키마 없이 필요한 컬렉션과 문서를 첫 쓰기 때 만든다. 현재 컬렉션 이름은 `FIREBASE_*_COLLECTION` 환경 변수로 지정한다.

## 핵심 관계

```text
Firebase user 1 ── * trip (owner userId, nullable for anonymous)
trip 1 ── * trip_task
trip 1 ── * trip_share_link
trip 0..1 ── 1 trip_team ── * trip_membership
trip 1 ── * analytics_event
```

## Trips

트립은 이름, 리조트/시즌/방문일/인원/교통/장비 조건, 가격 계산 입력, 상태와 선택 결과 snapshot을 가진다. 익명 트립은 `userId=null`이고 `editTokenHash`로 관리한다. 계정 트립은 소유자 Firebase UID인 `userId`를 가진다. `teamId`는 계정 초대가 처음 생성될 때 연결한다.

이전 레코드 호환 필드와 일정 데이터(`skiPlanData`, `budgetData`)는 기존 제품 정책을 따른다. 렌탈 선택과 할인 리프트권 선택은 각각 저장한다. `src/lib/trip-store.ts`에서 Firestore 문서를 제품 모델로 변환한다.

## Tasks

트립별 기본/커스텀 항목, category, title, status, memo, 정렬 순서와 외부 링크를 저장한다. 상태는 `not_needed`, `needs_check`, `planned`, `reserved`, `paid`, `prepared`다. 문서는 `tripId`로 트립과 연결한다.

## Share Links

`trip_share_links` 문서는 `tripId`, SHA-256 `tokenHash`, AES-GCM으로 암호화한 재복사 토큰 `tokenCiphertext`, `read|edit` permission, 생성자와 폐기 시각을 가진다. 해시로 링크를 확인하고 원문 토큰은 소유자 관리 화면에서만 복호화한다. 암호화 키는 `FIREBASE_SHARE_TOKEN_KEY` Worker secret이다.

## Teams and Memberships

Firestore의 `trip_teams`와 `trip_memberships` 문서가 트립 협업 기능을 담당한다. membership에는 Firebase UID, 초대 이메일, 역할, 수락 상태와 초대 만료 시각을 저장한다. 초대 URL 원문은 저장하지 않고 SHA-256 해시만 보관하며, 초대 링크는 7일 후 만료된다.

## Events

`analytics_events`에는 `tripId`, event name, 비민감 properties와 생성 시각만 저장한다. 개인정보, 세션 토큰, edit/share/invitation 원문 토큰, 오류 stack은 금지한다. 오류는 Cloudflare Workers Logs 또는 선택형 Sentry로 확인한다.
