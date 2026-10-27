# 확정된 제품·기술 의사결정

## 제품과 범위

- Korean Ski는 모바일 우선 한국어 웹 제품이며 Pretendard와 `docs/design.md`를 따른다.
- 국내 운영 스키장 디렉토리, 설명 가능한 룰 기반 추천, 날짜 기반 정적 가격, 트립과 체크리스트가 핵심이다.
- 자체 결제/예약, 실시간 crawling·재고, 강사 매칭, 커뮤니티는 MVP에서 제외한다.
- 공식 운영/슬로프 현황은 링크로 안내한다.

## 가격과 데이터

- 시즌 가격은 코드의 정적 데이터로 관리하고 검증 후 재배포한다.
- 26/27 공식 데이터 전에는 25/26 자료임을 사용자에게 명확히 표시한다.
- 가격은 출처, 시즌/적용 조건과 `confirmed|estimated|phone_confirmed|unavailable` 신뢰도를 갖는다.
- 예상 비용은 리프트, 장비/의류 렌탈, 사용자 입력 숙박비, 지원되는 교통 비용을 항목별로 보여준다.
- 공식 링크 상태 검사는 자동화하되 콘텐츠를 scraping해 운영 데이터로 사용하지 않는다.

## 인증

- 로그인은 선택 사항이고 익명 트립 생성을 유지한다.
- Firebase Authentication은 Google OAuth와 이메일/비밀번호 인증을 제공한다.
- 이메일/비밀번호 계정은 이메일 인증 완료 전 제품 계정 기능을 사용할 수 없다.
- 익명 트립은 edit capability URL에서 로그인 계정에 연결할 수 있다.

## 트립과 체크리스트

- 트립은 스키장 선택 시 비공개로 생성한다. 사용자 마감일은 받지 않는다.
- 현재 트립/준비 상태가 화면의 주 위계이며 수정, 복제, 공유, 삭제는 관리 메뉴에 둔다.
- 체크리스트 상태/메모는 background 저장 후 화면의 details, scroll, dialog 상태를 유지하고 Sonner로 결과를 알린다.
- 기본 항목은 `not_needed`로 제외할 수 있고 커스텀 항목은 추가/편집/삭제할 수 있다.

## 공유와 협업

- 익명 소유자는 edit token, 계정 소유자는 Firebase UID 기반 소유권으로 관리한다.
- 소유자는 여러 `read`/`edit` 링크를 만들 수 있다. 트립 변경이나 새 링크 생성은 기존 링크를 무효화하지 않는다.
- raw 공유 토큰은 저장하지 않는다. 해시로 권한을 확인하며 재복사용 복사본은 서버 키로 암호화한다.
- 계정 초대와 `viewer`/`editor` 권한은 Firestore membership 문서로 관리한다. 초대 메일은 선택형 Resend 연동으로 보내며, 설정하지 않은 경우 소유자가 7일짜리 초대 링크를 복사해 전달한다.
- 링크 공유와 사용자 초대는 하나의 공유 관리 UI에서 제공한다.
- 공유 화면은 트립/체크 상태만 목적에 맞게 노출하고 계정 정보, 내부 이벤트, token hash는 숨긴다.
- 보기 링크와 계정 viewer는 저장된 결정 결과만 표시하는 읽기 전용 화면을 사용하며, 편집 컨트롤과 관리 메뉴를 렌더링하지 않는다.

## 기술과 운영

- Next.js/OpenNext 애플리케이션은 계속 Cloudflare Workers에 배포한다.
- Firebase Authentication은 계정을 관리하고 Cloud Firestore는 앱 데이터를 저장한다. Firestore 접근은 Worker가 service account로 수행한다.
- Umami는 웹/퍼널 분석, Firestore `analytics_events`는 서버 제품 이벤트, Workers Logs는 오류 진단에 사용한다.
- `/admin` 기능 확장 대신 Firebase Console, Umami와 `/admin/data-quality`를 운영 도구로 사용한다.
- 오류는 typed code, 안전한 한국어 안내, retry 여부와 incident ID로 표준화한다. 외부 오류 수집기는 reporter 경계로 나중에 연결한다.

## 배포와 검증

- production은 `https://ski.hothyun.com`이다.
- 코드 완료는 배포 승인이 아니다. 사용자 지시 뒤 `pnpm cf:deploy`한다.
- 배포 완료는 실사용 테스트 승인도 아니다. 사용자가 요청하면 production Playwright와 변경 영역 집중 점검을 실행한다.
- CI production regression은 수동 실행하며 테스트 트립을 격리 생성하고 반드시 정리한다.
