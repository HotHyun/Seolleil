# Firebase 및 Cloudflare 설정

Firebase 프로젝트 `korean-ski`와 `asia-northeast3`(서울) Cloud Firestore를 사용한다. 프런트엔드와 서버 실행은 계속 Cloudflare Workers/OpenNext에서 한다. Firebase Hosting과 Cloud Functions는 사용하지 않는다.

## 이미 준비된 항목

- Firebase 프로젝트와 웹 앱: `korean-ski` / `Korean Ski Web`.
- 기본 Firestore 데이터베이스: Seoul (`asia-northeast3`), production mode.
- Firebase Authentication 이메일/비밀번호 Provider.
- Google 로그인 Provider: 활성화됨. 공개 프로젝트 이름은 `Korean Ski`이며, 사용자가 제공한 공개 지원 이메일을 저장했다.
- Authentication의 승인된 도메인에 `ski.hothyun.com`을 등록했다. `localhost`도 로컬 개발용으로 포함되어 있다.
- Firebase 웹 앱의 비공개가 아닌 client config는 `.env.example`과 `wrangler.jsonc`에 들어 있다. Firebase Web API key는 브라우저 앱용 식별 값이며 service account key와 다르다.

## Firebase Console에서 마무리할 설정

1. 앱을 배포한 뒤 Authentication → Templates에서 이메일 action URL을 `https://ski.hothyun.com/auth/action`으로 지정한다. 앱에는 Firebase의 `verifyEmail`과 `resetPassword` 코드를 처리하는 공통 action 화면이 있다.
2. Firestore Rules에는 현재 `firestore.rules`와 같은 전체 브라우저 read/write 거부 규칙이 적용되어 있다. 규칙을 바꿀 때도 Worker service account만 서버에서 Firestore REST API를 사용하도록 유지한다.

## Worker service account key

이 단계는 직접 진행한다. JSON key는 Firestore 전체 데이터에 접근할 수 있어 채팅이나 저장소에 전달하지 않는다.

1. Google Cloud Console의 IAM & Admin → Service Accounts에서 `korean-ski-worker` 같은 전용 service account를 만든다.
2. 프로젝트 역할은 `Cloud Datastore User` (`roles/datastore.user`)만 부여한다. `Editor`나 `Owner`는 부여하지 않는다.
3. 해당 account의 JSON key를 내려받아 암호화된 비밀 파일처럼 로컬에 보관한다. 파일을 저장소에 넣거나 공개 저장소/채팅에 붙이지 않는다.
4. Cloudflare Worker의 secret `FIREBASE_SERVICE_ACCOUNT_JSON`에 다운로드한 JSON 전체를 저장한다. 로컬 개발용 `.env`에도 필요하다면 붙일 수 있지만, `.env`는 git에 추가하지 않는다.
5. 공유 링크 주소를 다시 표시하기 위해 별도의 32바이트 키를 만든다. 예: `openssl rand -base64 32 | tr '+/' '-_' | tr -d '='`. 결과를 `FIREBASE_SHARE_TOKEN_KEY`로 로컬 `.env`와 Cloudflare Worker secret에 저장한다. 이 키를 잃으면 기존 저장 링크를 다시 복사할 수 없으므로 백업한다.

로컬에서 JSON 파일을 직접 읽어 미리보기 Worker에 전달하려면 `FIREBASE_SERVICE_ACCOUNT_JSON="$(cat /path/to/service-account.json)" pnpm cf:preview`처럼 실행할 수 있다. 파일 내용은 터미널이나 채팅에 출력하지 않는다.

Cloudflare 운영 배포에서는 `FIREBASE_SERVICE_ACCOUNT_JSON`과 `FIREBASE_SHARE_TOKEN_KEY`를 Firebase 코드와 같은 Worker 버전에 포함한다. 일반 `wrangler secret put`은 secret 하나를 등록할 때마다 현재 코드를 즉시 배포하므로 두 secret을 개별 등록하지 않는다. 배포 승인을 받은 뒤 `servicekey.json`과 `share-token-key.txt`에서 임시 secrets JSON 파일을 만들고, `pnpm cf:deploy --secrets-file <임시 파일 경로>`로 한 번에 올린 다음 임시 파일을 삭제한다. Wrangler는 이 파일에 없는 기존 secret을 유지한다. secret 값은 `wrangler.jsonc`나 `.env.example`에 기록하지 않는다.

## 환경 변수

`.env.example`은 현재 Firebase client config, project ID, collection names와 선택형 설정의 기준이다.

- 브라우저 설정: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`.
- 서버 공개 설정: `FIREBASE_PROJECT_ID`와 collection name 변수들.
- 필수 비밀: `FIREBASE_SERVICE_ACCOUNT_JSON`, `FIREBASE_SHARE_TOKEN_KEY`.
- 초대 이메일 선택 설정: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`. 미설정 시 앱은 7일 유효 초대 URL을 보여주며 소유자가 직접 전달한다.

비밀 환경 변수에 `NEXT_PUBLIC_` 접두사를 붙이지 않는다. `.env`는 `.gitignore` 대상이며 key JSON을 커밋하면 안 된다.

## 데이터와 전환 범위

신규 Firebase 데이터베이스는 빈 상태에서 시작한다. 사용자가 없다는 전제에 따라 기존 Appwrite 데이터를 옮기는 작업은 포함하지 않는다. 현재 코드의 BaaS 접근은 Firebase로 바뀌었지만 OCI의 Appwrite 설치, 데이터와 백업은 수정하거나 삭제하지 않았다. Cloudflare에 새 코드를 배포하기 전까지 production 사이트는 기존 버전을 계속 실행한다.
