# 렌탈샵 위치 데이터 품질

마지막 생성: 2026-11-19  
원천: Kakao Maps JavaScript Places 장소 검색 결과  
정책: 높은 신뢰 자동 일치와 사람이 명칭을 재검토한 후보만 제품 좌표로 사용한다. 리조트 대표 좌표를 공식 렌탈 매장 좌표로 대체하지 않는다.

## 현황

- 전체 렌탈 데이터: 118곳
- 좌표·Kakao Place ID 반영: 93곳
- 추가 확인 필요: 30곳
- 불확실 후보: 7곳
- 검색 결과 없음: 23곳

장소 상세 링크는 검색어 URL 대신 Kakao Place ID 기반 `https://place.map.kakao.com/{id}` 형식으로 저장한다. 좌표와 ID는 Kakao 장소 검색 응답의 `x`, `y`, `id`를 사용한다.

## 추가 확인 대상

| 리조트 | 내부 업체명 | 상태 | Kakao 최상위 후보 |
| --- | --- | --- | --- |
| jisan | 로키스키 지산점 | unresolved | 검색 결과 없음 |
| jisan | 눈사람 렌탈샵 | unresolved | 검색 결과 없음 |
| jisan | 스노우랜드 | uncertain | 에버랜드 스노우버스터 (1) |
| o2 | 스노월드 스키샵 | unresolved | 검색 결과 없음 |
| yongpyong | 화이트스포츠 | unresolved | 검색 결과 없음 |
| yongpyong | 용평스키넷 | uncertain | 오대산레져 (2) |
| muju | 노리터 스키샵 | unresolved | 검색 결과 없음 |
| edenvalley | 슈퍼맨 스키샵 | uncertain | 위스키 (5) |
| jisan | 붕어빵 렌탈샵 | uncertain | 지산리조트 Snow24 렌탈샵 (5) |
| vivaldi | 더드림 렌탈 패키지 | unresolved | 검색 결과 없음 |
| high1 | 레포투유 스키캠프&강습센터 | uncertain | 강원랜드 스키장(밸리콘도) 전기차충전소 (2) |
| high1 | 포시즌 렌탈샵 | uncertain | 로또전당사 (8) |
| high1 | 설래임 렌탈샵 | unresolved | 검색 결과 없음 |
| alpensia | 알펜시아 예약처 렌탈 패키지 | unresolved | 검색 결과 없음 |
| o2 | 오투리조트 리프트·렌탈 패키지 | unresolved | 검색 결과 없음 |
| konjiam | 곤지암리조트 공식 렌탈 | unresolved | 검색 결과 없음 |
| high1 | 하이원리조트 공식 렌탈 | unresolved | 검색 결과 없음 |
| jisan | 지산 포레스트 리조트 공식 렌탈 | unresolved | 검색 결과 없음 |
| vivaldi | 비발디파크 스키월드 공식 렌탈 | unresolved | 검색 결과 없음 |
| elysian | 엘리시안 강촌 공식 렌탈 | unresolved | 검색 결과 없음 |
| phoenix | 휘닉스 스노우파크 공식 렌탈 | unresolved | 검색 결과 없음 |
| yongpyong | 모나 용평 공식 렌탈 | unresolved | 검색 결과 없음 |
| wellihilli | 웰리힐리파크 공식 렌탈 | unresolved | 검색 결과 없음 |
| oakvalley | 오크밸리 공식 렌탈 | unresolved | 검색 결과 없음 |
| alpensia | 알펜시아 리조트 공식 렌탈 | unresolved | 검색 결과 없음 |
| o2 | 오투리조트 공식 렌탈 | unresolved | 검색 결과 없음 |
| muju | 무주 덕유산 리조트 공식 렌탈 | unresolved | 검색 결과 없음 |
| edenvalley | 에덴밸리 리조트 공식 렌탈 | unresolved | 검색 결과 없음 |
| wellihilli | 대관령스포츠 | unresolved | 검색 결과 없음 |
| oakvalley | 오크밸리 스키&보드 강습센터 | uncertain | 강윤정프로샵 오크밸리점 (2) |

## 갱신 절차

1. `pnpm data:locations:audit`로 Kakao 후보 리포트를 갱신한다.
2. 이름, 전화번호, 주소, 리조트 반경을 대조한다.
3. 명백한 후보만 생성 스크립트의 승인 목록에 추가한다.
4. `pnpm data:locations`로 정적 위치 레코드와 이 문서를 다시 생성한다.
5. `pnpm data:validate`와 지도 회귀 테스트를 실행한다.

## 카카오 장소 탐색으로 추가한 업체 (2026-11-19)

- 도구: `pnpm data:discover [rental|lodging]`가 각 리조트 좌표 반경(렌탈 8km, 숙소 10km)에서 카카오 장소 검색(`스키,보드렌탈` 분류와 숙박 분류)을 실행해 `reports/nearby-places-*.json`을 만든다. `pnpm data:discovered`가 그 결과에서 신규 후보를 골라 `src/data/discovered-rental-shops.ts`, `src/data/discovered-lodgings.ts`를 생성한다.
- 선별 기준: 리조트에서 4km 이내, 렌탈샵은 리조트별 최대 6곳·숙소는 4곳, 전화번호가 있는 곳을 우선하고 거리순으로 고른다. 스쿨·튜닝·단지 내 시설, 기존 목록과 상호·전화번호가 같은 곳, 리조트 자체 숙소는 제외한다. 용평·알펜시아처럼 가까운 리조트는 상호와 알펜시아 단지(1.5km) 기준으로 나눈다.
- 신규 업체는 `listed_25_26`로 두고 가격 규칙을 만들지 않는다. 장비·의류 가격, 의류 대여 여부, 리프트 판매 여부는 확인하지 않았다(`clothingRentalAvailable: false`는 "미확인"의 보수적 기본값). 리조트까지의 시간은 직선거리 500m당 1분으로 추정한 값이다.
- 위치를 확인하지 못했던 기존 업체 중 상호·주소·전화번호가 같은 카카오 장소를 사람이 승인해 8곳을 연결했다(오크밸리 3곳, 하이원 3곳, 엘리시안 모비딕, 휘닉스 백야). 승인 목록은 `scripts/generate-rental-location-data.ts`의 `manualPlaces`에 있다.
- 링크 점검(2026-11-19): 출처 페이지가 삭제된 업체는 카카오 장소 링크나 업체 첫 화면으로 교체했고, 링크도 장소도 확인되지 않은 `설래임 렌탈샵`은 `historical_needs_recheck`로 바꿨다. 무주 리프트 가격 규칙의 출처(WAUG, 404)는 공식 요금 안내로 교체했다.
- 아직 카카오에서 확인되지 않은 기존 업체는 위 표에 남아 있다. 폐업 여부를 확정하지 않았으므로 삭제하지 않았다.
