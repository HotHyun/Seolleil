# 배포 후 QA 체크리스트

사용자가 배포 후 검증을 요청한 경우에만 실행한다.

```bash
pnpm test:e2e:production
```

## 자동 회귀

- `/api/health`, 홈, 계획, 스키장, 로그인 공개 경로.
- 모바일 가로 overflow와 Ski Map 가시성.
- 고립된 익명 트립 생성과 정리.
- read 링크 발급 후 커스텀 항목 변경에도 링크가 유지됨.
- read 링크에 편집 컨트롤이 노출되지 않음.

## 변경 영역 실사용 점검

- Desktop/mobile, light/dark theme, keyboard focus와 터치 target.
- 브라우저 console error, failed request, 느린 응답과 중복 submit.
- 체크리스트 저장 뒤 details/scroll/dialog 상태 유지와 Sonner 성공 피드백.
- 오류 시 원인에 맞는 한국어 안내, 다음 행동, incident ID와 retry 가능 여부.
- 공유: private default, read/edit 링크, 개별 폐기, 멤버 초대/권한 변경/제거.
- 폐기/잘못된 token은 404 또는 권한 거부되고 내부 정보가 노출되지 않음.

이메일 도착과 Google OAuth 왕복은 사용자가 직접 검증한다. 자동 테스트가 만든 트립은 성공/실패와 관계없이 삭제하고, 남은 데이터가 있으면 명시적으로 보고한다.
