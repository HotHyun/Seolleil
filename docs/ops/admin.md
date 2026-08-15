# 운영 확인

별도 제품 관리자 대시보드를 확장하지 않는다.

- Umami: 페이지뷰, 유입, 퍼널, CTA, 트립 생성·체크리스트 사용률.
- Appwrite Console: trips/tasks/share links/Teams membership과 서버 제품 이벤트.
- Cloudflare Workers Logs: 구조화 오류 code, incident ID, 발생 action과 infrastructure 상태.
- `/admin/data-quality`: 배포 전 static 가격·링크·리조트 데이터 품질 점검.

운영자가 원문 edit/share token, session secret, API key를 조회하거나 이벤트로 저장하는 흐름은 만들지 않는다. 사용자 오류 문의는 incident ID로 Workers 로그를 찾는다.

향후 Sentry를 연결할 때는 `src/lib/app-error.ts`의 reporter 경계를 사용하고, Appwrite/Umami를 예외 추적 저장소로 대체하지 않는다.

## Appwrite 백업

OCI 호스트의 Appwrite 백업 정책, 설치 파일, 상태·초기화·복원 점검 절차는 [`ops/appwrite-backup/README.md`](../../ops/appwrite-backup/README.md)를 기준으로 관리한다. 비밀 자격 증명과 Restic 저장소 암호는 레포에 저장하지 않는다.
