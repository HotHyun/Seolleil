# 데이터 모델

## 저장 위치

- `src/data`: 스키장, 이동, 25/26 가격과 출처 등 재배포 가능한 정적 기준 데이터.
- Appwrite Auth: 계정, OAuth/email-password 인증, 이메일 인증 상태와 세션.
- Appwrite Teams: 트립별 계정 멤버십과 `viewer`/`editor` 역할.
- Appwrite Databases: `trips`, `trip_tasks`, `trip_share_links`, `analytics_events`, `schema_migrations`.

실제 attribute와 index는 `scripts/appwrite/migrations`가 기준이며 `pnpm appwrite:schema`으로 적용한다.

## 핵심 관계

```text
Appwrite user 1 ── * trip (owner userId, nullable for anonymous)
trip 1 ── * trip_task
trip 1 ── * trip_share_link
trip 0..1 ── 1 Appwrite team ── * membership
trip 1 ── * analytics_event
```

## Trips

트립은 사용자 지정 `tripName`, 팀 내부용 `tripMemo`, 리조트/시즌/방문일/인원/교통/장비 조건, 가격 계산 입력, 상태와 선택 결과 snapshot을 가진다. `lodgingName`, `lodgingUrl`은 가격을 수집하지 않는 숙소 기록이고, `splitCount`는 단순 균등 정산 인원이다. `budgetData` JSON snapshot은 항목별 사용자 확정 금액과 최대 30개의 추가 비용을 저장한다. 확정 금액은 static 예상 가격보다 우선한다. 기존 레코드처럼 이름이 없으면 `리조트명 트립`으로 표시한다. 익명 트립은 `userId=null`이고 `editTokenHash`로 관리한다. 계정 트립은 소유자 `userId`를 가진다. `teamId`는 첫 계정 초대 시 연결한다.

## Tasks

트립별 기본/커스텀 항목, category, title, status, memo, 정렬 순서와 외부 링크를 저장한다. 마감일은 사용자 모델에서 사용하지 않는다. 상태는 `not_needed`, `needs_check`, `planned`, `reserved`, `paid`, `prepared`다.

## Share Links

각 문서는 `tripId`, SHA-256 `tokenHash`, `read|edit` permission, 생성자와 폐기 시각을 가진다. 여러 링크가 공존하며 트립 변경과 새 링크 생성은 기존 링크를 무효화하지 않는다. 폐기는 해당 링크 하나에만 적용된다. 원문 token은 생성 응답/URL 외에 저장하거나 다시 노출하지 않는다.

## Events

`tripId`, event name, 비민감 properties와 생성 시각만 저장한다. 개인 정보, 세션 secret, edit/share raw token, 오류 stack은 금지한다. 오류 예외와 stack은 Workers 로그 또는 향후 전용 관측 도구에 보낸다.
