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

트립은 사용자 지정 `tripName`, 리조트/시즌/방문일/인원/교통/장비 조건, 가격 계산 입력, 상태와 선택 결과 snapshot을 가진다. 기존 `tripMemo` 필드는 이전 레코드 호환을 위해 스키마에 남기지만 제품에서 입력·표시·복제하지 않는다. `lodgingName`, `lodgingUrl`, `lodgingCostInput`, `transportType`, `shuttleRouteId`, `shuttleStopId`는 기존 문서와 목록 조회 호환을 위한 대표 snapshot이고, 실제 다중 날짜 선택은 `skiPlanData`가 기준이다. `splitCount`는 단순 균등 정산 인원이다. `budgetData` JSON snapshot은 항목별 사용자 확정 금액과 최대 30개의 추가 비용을 저장한다. 확정 금액은 static 예상 가격보다 우선한다. 기존 레코드처럼 이름이 없으면 `리조트명 트립`으로 표시한다. 익명 트립은 `userId=null`이고 `editTokenHash`로 관리한다. 계정 트립은 소유자 `userId`를 가진다. `teamId`는 첫 계정 초대 시 연결한다.

장비·의류 렌탈 선택(`selectedRentalOptionId`)과 렌탈샵 할인 리프트권 선택(`selectedLiftTicketOptionId`)은 독립적으로 저장한다. 할인권을 선택하면 연결된 시간권과 가격을 예상 비용에 반영하며, 공식권으로 바꾸어도 장비·의류 선택은 유지한다.

`skiPlanData` v2는 세 가지 일정 축을 함께 저장한다. `days`는 실제 스키를 타는 날짜별 시간·렌탈·리프트 선택, `lodgingNights`는 도착일부터 출발일 전날까지의 체크인 날짜별 숙소·URL·1박 금액, `transportLegs`는 도착일의 `outbound`와 출발일의 `return` 이동수단·셔틀 노선·탑승지다. 일정 기간이 변경되면 같은 날짜의 선택은 유지하고 범위 밖 선택은 제거한다. v1 또는 단일 snapshot 문서는 읽을 때 v2 형태로 정규화한다.

## Tasks

트립별 기본/커스텀 항목, category, title, status, memo, 정렬 순서와 외부 링크를 저장한다. 마감일은 사용자 모델에서 사용하지 않는다. 상태는 `not_needed`, `needs_check`, `planned`, `reserved`, `paid`, `prepared`다.

## Share Links

각 문서는 `tripId`, 조회용 SHA-256 `tokenHash`, 관리 화면 재복사용 `tokenValue`, `read|edit` permission, 생성자와 폐기 시각을 가진다. 여러 링크가 공존하며 트립 변경과 새 링크 생성은 기존 링크를 무효화하지 않는다. 폐기는 해당 링크 하나에만 적용된다. `tokenValue`는 소유자와 수락 완료된 계정 팀 멤버에게만 노출하며 이벤트·로그에는 기록하지 않는다. 이전 hash-only 문서는 주소를 복구하지 못한다.

## Events

`tripId`, event name, 비민감 properties와 생성 시각만 저장한다. 개인 정보, 세션 secret, edit/share raw token, 오류 stack은 금지한다. 오류 예외와 stack은 Workers 로그 또는 향후 전용 관측 도구에 보낸다.
