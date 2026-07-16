# 렌탈샵 위치 데이터 품질

마지막 생성: 2026-07-16  
원천: Kakao Maps JavaScript Places 장소 검색 결과  
정책: 높은 신뢰 자동 일치와 사람이 명칭을 재검토한 후보만 제품 좌표로 사용한다. 리조트 대표 좌표를 공식 렌탈 매장 좌표로 대체하지 않는다.

## 현황

- 전체 렌탈 데이터: 118곳
- 좌표·Kakao Place ID 반영: 85곳
- 추가 확인 필요: 33곳
- 불확실 후보: 7곳
- 검색 결과 없음: 26곳

장소 상세 링크는 검색어 URL 대신 Kakao Place ID 기반 `https://place.map.kakao.com/{id}` 형식으로 저장한다. 좌표와 ID는 Kakao 장소 검색 응답의 `x`, `y`, `id`를 사용한다.

## 추가 확인 대상

| 리조트 | 내부 업체명 | 상태 | Kakao 최상위 후보 |
| --- | --- | --- | --- |
| jisan | 로키스키 지산점 | unresolved | 검색 결과 없음 |
| jisan | 눈사람 렌탈샵 | unresolved | 검색 결과 없음 |
| jisan | 스노우랜드 | uncertain | 에버랜드 스노우버스터 (1) |
| oakvalley | SNB 스키보드 렌탈샵 | unresolved | 검색 결과 없음 |
| oakvalley | 강윤정프로 렌탈샵 | unresolved | 검색 결과 없음 |
| oakvalley | 스키타는야옹이 | unresolved | 검색 결과 없음 |
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
