# 성과 측정/분석 정책

## 기본 방향

MVP에서는 Umami와 Appwrite 이벤트를 함께 사용한다.

- Umami: 페이지뷰, 유입 경로, 기기, 브라우저, 기본 클릭 이벤트 확인.
- Umami custom events: 트립 폼 전환, 트립 생성, 체크리스트 사용, 외부 링크 클릭 등 퍼널과 사용률 확인.
- Appwrite analytics events: 트립 단위 상태 변화, 보안상 민감하지 않은 서버 이벤트, 오류 진단용 이벤트 확인.
- 별도 `/admin` 제품 대시보드는 운영하지 않고 Umami와 Appwrite Console을 운영 화면으로 사용한다.

## 도구

### Umami

- self-host로 운영한다.
- Coolify에서 별도 서비스로 배포한다.
- Korean Ski 앱에는 Umami tracking script를 삽입한다.
- Umami DB는 앱 DB와 분리된 별도 PostgreSQL DB로 운영하는 것을 기본으로 한다.

### Appwrite 이벤트 컬렉션

제품 핵심 이벤트는 앱 DB에 저장한다.

이유:

- 핵심 성공 지표를 정확히 계산하기 위해.
- Umami 이벤트만으로는 트립/체크리스트 상태 변화를 안정적으로 분석하기 어렵기 때문에.
- 추후 내부 대시보드나 리포트를 만들 때 기반 데이터로 사용할 수 있기 때문에.

### 운영 화면

- 퍼널과 사용률은 Umami에서 확인한다.
- 트립 단위 이벤트와 서버 진단은 Appwrite Console에서 확인한다.
- Umami만으로 서버 예외를 자동 수집할 수 없으므로 서버 오류는 별도 Appwrite 오류 이벤트 또는 Cloudflare Workers Logs로 확인한다.

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
- `share_link_regenerated`
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
