# 운영 확인

별도 제품 관리자 대시보드를 확장하지 않는다.

- Umami: 페이지뷰, 유입, 퍼널, CTA, 트립 생성·체크리스트 사용률.
- Firebase Console: Firestore trips/tasks/share links/memberships와 서버 제품 이벤트.
- Cloudflare Workers Logs: 구조화 오류 code, incident ID, 발생 action과 infrastructure 상태.
- `/admin/data-quality`: 배포 전 static 가격·링크·리조트 데이터 품질 점검.

운영자가 원문 edit/share token, session token, service account key를 조회하거나 이벤트로 저장하는 흐름은 만들지 않는다. 사용자 오류 문의는 incident ID로 Workers 로그를 찾는다.

향후 Sentry를 연결할 때는 `src/lib/app-error.ts`의 reporter 경계를 사용하고, Firebase/Umami를 예외 추적 저장소로 대체하지 않는다.

## 기존 Appwrite 백업

Firebase 전환은 OCI의 기존 Appwrite 설치와 백업 파일을 변경하거나 삭제하지 않는다. OCI Appwrite의 백업·복구 절차는 [`ops/appwrite-backup/README.md`](../../ops/appwrite-backup/README.md)에 남겨두며, 기존 리소스 정리는 별도 결정으로 진행한다. 비밀 자격 증명과 Restic 저장소 암호는 레포에 저장하지 않는다.
