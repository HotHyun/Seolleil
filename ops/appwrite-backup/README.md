# Appwrite 백업 운영 패키지

Korean Ski의 Coolify Appwrite 리소스를 OCI 호스트에서 Backblaze B2로 백업하는 운영 패키지다. 애플리케이션 컨테이너 내부가 아니라 Docker를 실행하는 OCI 호스트에 설치한다.

## 초기 운영 정책

| 작업 | 실행 시각 | 보존 | Appwrite 중단 |
| --- | --- | --- | --- |
| MariaDB 논리 백업 | 매일 18:30 UTC, 최대 5분 지연 | 일 7, 주 4, 월 3 | 없음 |
| 전체 백업 | 매주 일요일 19:00 UTC, 최대 10분 지연 | 주 4, 월 3 | 로컬 스냅샷을 만드는 동안 잠시 중단 |
| 정리 및 무결성 검사 | 매월 3일 19:30 UTC, 최대 10분 지연 | 위 정책 적용 후 prune/check | 없음 |

한국 시간으로는 각각 매일 03:30, 매주 월요일 04:00, 매월 4일 04:30 전후다. `Persistent=true`이므로 서버가 꺼져 예정 실행을 놓치면 다음 부팅 후 실행된다.

매일 백업은 `mariadb-dump --single-transaction`으로 원본 SQL을 만들고 Restic 압축·중복 제거를 사용한다. 매주 전체 백업은 다음을 포함한다.

- 같은 시점의 MariaDB 논리 덤프
- `uploads`, `functions`, `sites`, `builds`, `imports`, `config`, `certificates` Docker 볼륨
- Coolify Appwrite 리소스 디렉터리의 `docker-compose.yml`, `.env` 및 관련 설정

MariaDB 원본 볼륨, Redis, cache는 백업하지 않는다. DB는 논리 덤프로 복원하고 Redis/cache는 재생성한다. `_APP_OPENSSL_KEY_V1`을 포함한 Appwrite `.env`는 암호화된 전체 백업에 포함된다.

## OCI 표준 경로

레포의 이 디렉터리를 OCI 호스트의 다음 위치에 보관한다.

```text
/opt/korean-ski-ops/appwrite-backup
```

설치기는 파일을 다음 경로로 배치한다.

```text
/etc/appwrite-backup/
├── appwrite-backup.conf       # 비밀이 아닌 Coolify/Appwrite 식별 정보
├── restic.env                 # B2 자격 증명, 저장소 주소 (0600)
└── restic-password            # Restic 저장소 암호 (0600)

/usr/local/lib/appwrite-backup/common.sh

/usr/local/sbin/
├── appwrite-db-backup
├── appwrite-full-backup
├── appwrite-backup-maintenance
├── appwrite-backup-status
├── appwrite-backup-initialize
└── appwrite-backup-restore-check

/etc/systemd/system/
├── appwrite-db-backup.service
├── appwrite-db-backup.timer
├── appwrite-full-backup.service
├── appwrite-full-backup.timer
├── appwrite-backup-maintenance.service
└── appwrite-backup-maintenance.timer

/var/lib/appwrite-backup/      # root 전용 임시 스테이징; 작업 종료 시 내용 정리
```

`restic.env`와 `restic-password`는 레포에 넣지 않는다. Restic 암호는 반드시 OCI 밖의 비밀번호 관리자에도 보관한다.

## 레포 파일을 OCI 호스트로 가져오기

OCI 호스트에 별도 Git checkout이 있으면 레포 루트에서 다음처럼 복사한다.

```bash
sudo install -d -o root -g root -m 0755 /opt/korean-ski-ops
sudo cp -a ops/appwrite-backup /opt/korean-ski-ops/
sudo chown -R root:root /opt/korean-ski-ops/appwrite-backup
```

현재처럼 레포가 `code-server-cog48gwwc8gg4os48s8kg8cg` 컨테이너에만 있다면 OCI 호스트 터미널에서 다음처럼 복사한다.

```bash
sudo install -d -o root -g root -m 0755 /opt/korean-ski-ops/appwrite-backup

sudo docker cp \
  code-server-cog48gwwc8gg4os48s8kg8cg:/config/workspace/korean-ski/ops/appwrite-backup/. \
  /opt/korean-ski-ops/appwrite-backup/

sudo chown -R root:root /opt/korean-ski-ops/appwrite-backup
```

## 기존 서버에 패키지 적용

이미 `/etc/appwrite-backup/restic.env`, Restic 암호와 저장소가 준비된 현재 서버에서는 다음을 실행한다.

```bash
cd /opt/korean-ski-ops/appwrite-backup
sudo ./install.sh --check
```

설치기는 활성 타이머를 잠시 멈췄다가 다시 시작하며 다음 파일은 덮어쓰지 않는다.

- `/etc/appwrite-backup/appwrite-backup.conf`가 이미 존재하는 경우
- `/etc/appwrite-backup/restic.env`
- `/etc/appwrite-backup/restic-password`

현재 서버에는 `appwrite-backup.conf`가 처음 생성될 수 있다. 다음 값이 실제 Coolify 리소스와 일치하는지 확인한다.

```bash
sudoedit /etc/appwrite-backup/appwrite-backup.conf
```

기본 템플릿은 현재 리소스 ID `eocccws40gogcockggcgw88k`와 Compose 경로 `/data/coolify/services/eocccws40gogcockggcgw88k`를 사용한다.

## 새 서버 또는 재구축 초기화

필수 도구는 Docker Compose, Restic 0.19.1 이상, `tar`, `flock`이다. 먼저 설치만 수행한다.

```bash
cd /opt/korean-ski-ops/appwrite-backup
sudo ./install.sh
```

설정 템플릿을 검토하고 비밀 파일을 직접 만든다.

```bash
sudoedit /etc/appwrite-backup/appwrite-backup.conf
sudoedit /etc/appwrite-backup/restic.env
sudoedit /etc/appwrite-backup/restic-password

sudo chown root:root /etc/appwrite-backup/*.conf /etc/appwrite-backup/restic.env /etc/appwrite-backup/restic-password
sudo chmod 0600 /etc/appwrite-backup/*.conf /etc/appwrite-backup/restic.env /etc/appwrite-backup/restic-password
```

기존 B2 Restic 저장소에 연결하는 경우 저장소를 다시 초기화하지 않는다.

```bash
sudo appwrite-backup-initialize --enable-timers
```

완전히 새로운 빈 버킷에 최초 저장소를 만드는 경우에만 다음 플래그를 사용한다.

```bash
sudo appwrite-backup-initialize \
  --initialize-repository \
  --enable-timers
```

이미 초기화된 저장소에 `restic init`을 반복하지 않는다.

새 저장소는 아직 스냅샷이 없으므로 최초 백업과 상태 확인을 한 번 실행한다. 전체 백업 동안 Appwrite가 잠시 중단된다.

```bash
sudo systemctl start appwrite-db-backup.service
sudo systemctl start appwrite-full-backup.service
sudo appwrite-backup-status
```

## 일상 점검

타이머, 필수 컨테이너, 실패 유닛, 최신 DB/전체 스냅샷을 한 번에 확인한다.

```bash
sudo appwrite-backup-status
```

상태 스크립트는 비밀 파일 권한, Restic 버전, 타이머 활성화, Appwrite/MariaDB 실행 상태와 함께 DB 백업이 30시간, 전체 백업이 192시간보다 오래되지 않았는지도 검사한다. 임계값은 `/etc/appwrite-backup/appwrite-backup.conf`에서 바꿀 수 있다.

Restic 저장소 메타데이터 검사까지 포함하려면 다음을 사용한다.

```bash
sudo appwrite-backup-status --check-repository
```

개별 로그는 다음과 같이 확인한다.

```bash
sudo journalctl -u appwrite-db-backup.service -n 100 --no-pager
sudo journalctl -u appwrite-full-backup.service -n 150 --no-pager
sudo journalctl -u appwrite-backup-maintenance.service -n 150 --no-pager
```

수동 실행은 다음과 같다. 전체 백업은 Appwrite를 잠시 중단한다.

```bash
sudo systemctl start appwrite-db-backup.service
sudo systemctl start appwrite-full-backup.service
sudo appwrite-backup-maintenance --dry-run
```

## 복원 스모크 테스트

최신 DB 덤프의 완료 마커를 검사하고 최신 전체 백업을 격리된 임시 디렉터리에 내려받아 SQL과 tar 파일을 검증한다. 실행 중인 Appwrite에는 데이터를 쓰지 않는다.

```bash
sudo appwrite-backup-restore-check
```

이 검사는 실제 MariaDB 복구를 대신하지 않는다. 실제 복구 훈련은 동일 Appwrite 버전의 새 설치에만 수행한다. 운영 중인 Appwrite 위에 덤프나 볼륨을 덮어쓰지 않는다.

## 장애 대응

먼저 전체 상태와 실패 로그를 확인한다.

```bash
sudo appwrite-backup-status
sudo systemctl --failed
sudo journalctl -xeu appwrite-db-backup.service --no-pager
sudo journalctl -xeu appwrite-full-backup.service --no-pager
sudo journalctl -xeu appwrite-backup-maintenance.service --no-pager
```

문제 수정 후 실패 상태를 초기화하고 필요한 작업만 다시 실행한다.

```bash
sudo systemctl reset-failed appwrite-db-backup.service
sudo systemctl start appwrite-db-backup.service
```

종료 코드 `75`는 다른 백업 또는 prune 작업이 잠금을 잡고 있다는 의미다. 실행 중인 프로세스를 강제 종료하기 전에 다음을 확인한다.

```bash
sudo lsof /run/lock/appwrite-backup.lock
sudo systemctl list-jobs
```

전체 백업 실패 후 Appwrite가 올라오지 않았다면 Coolify Compose 경로에서 상태를 확인하고 시작한다.

```bash
cd /data/coolify/services/eocccws40gogcockggcgw88k
sudo docker compose \
  --project-name eocccws40gogcockggcgw88k \
  --file docker-compose.yml \
  ps

sudo docker compose \
  --project-name eocccws40gogcockggcgw88k \
  --file docker-compose.yml \
  start
```

B2 인증 오류에서는 키를 채팅이나 로그에 출력하지 말고 `/etc/appwrite-backup/restic.env`의 파일 권한과 Backblaze application key 상태를 확인한다.

## 업데이트

레포의 패키지를 OCI 표준 경로에 다시 복사한 후 설치기를 재실행한다.

```bash
cd /opt/korean-ski-ops/appwrite-backup
sudo ./install.sh --check
```

활성화된 타이머 상태는 보존된다. 설치 이후 다음 세 타이머가 모두 `enabled`, `active`인지 확인한다.

```bash
sudo systemctl list-timers \
  appwrite-db-backup.timer \
  appwrite-full-backup.timer \
  appwrite-backup-maintenance.timer \
  --all \
  --no-pager
```

## 정책을 강화할 시점

하루치 변경을 잃는 것이 허용되지 않거나 일일 트립 변경량이 수백 건으로 늘면 DB 주기를 12시간, 6시간 또는 4시간으로 조정한다. MariaDB가 수 GB 이상이거나 논리 덤프가 10분 이상 걸리면 전체 덤프 반복 대신 `mariabackup`과 binlog/PITR 전략을 검토한다.
