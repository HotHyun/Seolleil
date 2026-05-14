# 성과 측정/분석 정책

## 기본 방향

MVP에서는 Umami와 자체 DB 이벤트를 함께 사용한다.

- Umami: 페이지뷰, 유입 경로, 기기, 브라우저, 기본 클릭 이벤트 확인.
- 자체 DB 이벤트: 트립 생성, 스키장 선택, 체크리스트 변경, 외부 링크 클릭 등 제품 핵심 지표 확인.
- PgAdmin: MVP 단계에서 PostgreSQL 이벤트 데이터를 직접 조회하는 운영 도구.

별도 내부 관리자 대시보드는 MVP에서 만들지 않는다.

## 도구

### Umami

- self-host로 운영한다.
- Coolify에서 별도 서비스로 배포한다.
- Korean Ski 앱에는 Umami tracking script를 삽입한다.
- Umami DB는 앱 DB와 분리된 별도 PostgreSQL DB로 운영하는 것을 기본으로 한다.

### PostgreSQL 이벤트 테이블

제품 핵심 이벤트는 앱 DB에 저장한다.

이유:

- 핵심 성공 지표를 정확히 계산하기 위해.
- Umami 이벤트만으로는 트립/체크리스트 상태 변화를 안정적으로 분석하기 어렵기 때문에.
- 추후 내부 대시보드나 리포트를 만들 때 기반 데이터로 사용할 수 있기 때문에.

### PgAdmin

- MVP 단계에서는 PgAdmin으로 DB 이벤트를 직접 확인한다.
- 별도 분석 관리자 화면은 만들지 않는다.

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
- `resort_selected`
- `task_status_changed`
- `trip_deleted`
- `external_link_clicked`
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
- editToken/shareToken 원문을 이벤트에 저장하지 않는다.
- 출발지는 상세 주소가 아니라 분석 가능한 범위의 지역 값으로만 저장한다.
- 공유 링크와 편집 링크 페이지는 검색엔진 색인을 차단한다.

## MVP 핵심 지표

가장 중요한 지표:

- 트립을 만든 사용자가 체크리스트 상태를 실제로 업데이트하는가.

확인 방법:

- `trip_created` 이후 같은 `tripId`에서 `task_status_changed`가 발생했는지 확인한다.

보조 지표:

- 트립 생성 완료율.
- 추천 결과에서 스키장 선택률.
- 체크리스트 항목 완료율.
- 외부 예약 링크 클릭률.
- 공유 링크 복사율.
- 공유 페이지 조회율.
- 재방문율.
