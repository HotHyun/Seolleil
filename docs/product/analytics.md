# 성과 측정/분석 정책

## 기본 방향

MVP에서는 Umami와 Firestore 제품 이벤트를 함께 사용한다.

- Umami: 페이지뷰, 유입 경로, 기기, 브라우저, 기본 클릭 이벤트 확인.
- Umami custom events: 트립 폼 전환, 트립 생성, 체크리스트 사용, 외부 링크 클릭 등 퍼널과 사용률 확인.
- Firestore `analytics_events`: 트립 단위 상태 변화와 비민감 서버 제품 이벤트 확인.
- 서버 오류는 Cloudflare Workers Logs에서 진단한다. 별도 `/admin` 집계 대시보드는 운영하지 않는다.

## 도구

### Umami

- self-host로 운영한다.
- 앱과 독립된 self-hosted 서비스로 운영한다.
- Korean Ski 앱에는 Umami tracking script를 삽입한다.
- Umami 저장소와 Firestore 제품 데이터는 운영·백업 경계를 분리한다.

### Firestore 이벤트

제품 핵심 이벤트는 앱 DB에 저장한다. 트립·체크리스트 상태 변화를 Umami 이벤트만으로 복원하기 어려워 내부 리포트 기반을 별도로 보관한다.

### 운영 화면

- 퍼널과 사용률은 Umami에서 확인한다.
- 트립 단위 이벤트는 Firebase Console에서 확인한다.
- 서버 오류는 Cloudflare Workers Logs에서 확인한다. Sentry는 선택형 예외 수집기로만 추가한다.

## 추적할 Umami 이벤트

- `home_cta_click`
- `trip_form_start`
- `trip_form_submit`
- `recommendation_view`
- `resort_detail_view`
- `share_link_copy`
- `external_link_click`

## 저장할 자체 DB 이벤트

- `trip_created`
- `trip_details_updated`
- `trip_status_changed`
- `trip_attached_to_account`
- `share_link_created`
- `share_link_revoked`
- `trip_member_invited`
- `task_status_changed`
- `trip_deleted`
- `external_link_click`
- `share_page_viewed`

## 이벤트 데이터 모델

```ts
type AnalyticsEvent = {
  id: string;
  tripId?: string;
  eventName: string;
  properties?: Json;
  createdAt: string;
};
```

## 개인정보/보안 원칙

- 이벤트에는 개인정보를 저장하지 않는다.
- editToken/shareToken/invitation token 원문을 이벤트에 저장하지 않는다.
- 출발지는 상세 주소가 아니라 분석 가능한 범위의 지역 값으로만 저장한다.
- 공유 링크와 편집 링크 페이지는 검색엔진 색인을 차단한다.

## MVP 핵심 지표

가장 중요한 지표는 트립을 만든 사용자가 체크리스트 상태를 실제로 업데이트하는지다. `trip_created` 이후 같은 `tripId`에서 `task_status_changed`가 발생했는지로 확인한다.

보조 지표는 트립 생성 완료율, 추천 결과에서 스키장 선택률, 체크리스트 항목 완료율, 외부 예약 링크 클릭률, 공유 링크 복사율, 공유 페이지 조회율과 재방문율이다.
