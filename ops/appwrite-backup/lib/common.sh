#!/usr/bin/env bash

BACKUP_CONFIG_FILE="${APPWRITE_BACKUP_CONFIG:-/etc/appwrite-backup/appwrite-backup.conf}"

backup_die() {
  echo "ERROR: $*" >&2
  exit 1
}

backup_require_root() {
  [[ "${EUID}" -eq 0 ]] || backup_die 'Run this command as root (sudo).'
}

backup_require_command() {
  command -v "$1" >/dev/null 2>&1 || backup_die "Required command not found: $1"
}

backup_load_config() {
  [[ -r "$BACKUP_CONFIG_FILE" ]] || backup_die "Configuration is not readable: $BACKUP_CONFIG_FILE"

  # shellcheck source=/dev/null
  source "$BACKUP_CONFIG_FILE"

  : "${APPWRITE_COMPOSE_PROJECT:?Missing APPWRITE_COMPOSE_PROJECT}"
  : "${APPWRITE_COMPOSE_DIR:?Missing APPWRITE_COMPOSE_DIR}"

  APPWRITE_COMPOSE_FILE="${APPWRITE_COMPOSE_FILE:-$APPWRITE_COMPOSE_DIR/docker-compose.yml}"
  APPWRITE_DB_CONTAINER="${APPWRITE_DB_CONTAINER:-appwrite-mariadb-$APPWRITE_COMPOSE_PROJECT}"
  APPWRITE_API_CONTAINER="${APPWRITE_API_CONTAINER:-appwrite-$APPWRITE_COMPOSE_PROJECT}"
  APPWRITE_VOLUME_PREFIX="${APPWRITE_VOLUME_PREFIX:-$APPWRITE_COMPOSE_PROJECT}"
  APPWRITE_VOLUME_SUFFIXES="${APPWRITE_VOLUME_SUFFIXES:-functions imports sites uploads builds certificates config}"

  RESTIC_HOST="${RESTIC_HOST:-$(hostname -s)}"
  RESTIC_BIN="${RESTIC_BIN:-/usr/local/bin/restic}"
  RESTIC_ENV_FILE="${RESTIC_ENV_FILE:-/etc/appwrite-backup/restic.env}"

  BACKUP_STAGING_ROOT="${BACKUP_STAGING_ROOT:-/var/lib/appwrite-backup}"
  BACKUP_LOCK_FILE="${BACKUP_LOCK_FILE:-/run/lock/appwrite-backup.lock}"

  DB_SNAPSHOT_PATH="${DB_SNAPSHOT_PATH:-/appwrite/mariadb/all-databases.sql}"
  DB_SNAPSHOT_TAG="${DB_SNAPSHOT_TAG:-appwrite-db}"
  FULL_SNAPSHOT_TAG="${FULL_SNAPSHOT_TAG:-appwrite-full}"

  DB_KEEP_DAILY="${DB_KEEP_DAILY:-7}"
  DB_KEEP_WEEKLY="${DB_KEEP_WEEKLY:-4}"
  DB_KEEP_MONTHLY="${DB_KEEP_MONTHLY:-3}"
  FULL_KEEP_WEEKLY="${FULL_KEEP_WEEKLY:-4}"
  FULL_KEEP_MONTHLY="${FULL_KEEP_MONTHLY:-3}"
  DB_MAX_AGE_HOURS="${DB_MAX_AGE_HOURS:-30}"
  FULL_MAX_AGE_HOURS="${FULL_MAX_AGE_HOURS:-192}"

  [[ "$BACKUP_STAGING_ROOT" != '/' ]] || backup_die 'BACKUP_STAGING_ROOT cannot be /.'
  [[ -x "$RESTIC_BIN" ]] || backup_die "Restic executable not found: $RESTIC_BIN"

  for numeric_name in \
    DB_KEEP_DAILY \
    DB_KEEP_WEEKLY \
    DB_KEEP_MONTHLY \
    FULL_KEEP_WEEKLY \
    FULL_KEEP_MONTHLY \
    DB_MAX_AGE_HOURS \
    FULL_MAX_AGE_HOURS; do
    [[ "${!numeric_name}" =~ ^[0-9]+$ ]] || backup_die "$numeric_name must be a non-negative integer."
  done

  [[ "$APPWRITE_VOLUME_PREFIX" =~ ^[a-zA-Z0-9_.-]+$ ]] || backup_die 'APPWRITE_VOLUME_PREFIX contains unsupported characters.'
}

backup_load_restic_env() {
  [[ -r "$RESTIC_ENV_FILE" ]] || backup_die "Restic environment is not readable: $RESTIC_ENV_FILE"

  set -a
  # shellcheck source=/dev/null
  source "$RESTIC_ENV_FILE"
  set +a

  : "${RESTIC_REPOSITORY:?Missing RESTIC_REPOSITORY}"
  : "${RESTIC_PASSWORD_FILE:?Missing RESTIC_PASSWORD_FILE}"
  [[ -r "$RESTIC_PASSWORD_FILE" ]] || backup_die "Restic password file is not readable: $RESTIC_PASSWORD_FILE"
}

backup_acquire_lock() {
  backup_require_command flock
  exec {BACKUP_LOCK_FD}>"$BACKUP_LOCK_FILE"

  if ! flock -n "$BACKUP_LOCK_FD"; then
    echo 'Another Appwrite backup process is running.' >&2
    exit 75
  fi
}

backup_compose() {
  (
    cd "$APPWRITE_COMPOSE_DIR"
    docker compose \
      --project-name "$APPWRITE_COMPOSE_PROJECT" \
      --file "$APPWRITE_COMPOSE_FILE" \
      "$@"
  )
}

backup_container_running() {
  [[ "$(docker inspect --format '{{.State.Running}}' "$1" 2>/dev/null || true)" == 'true' ]]
}

backup_appwrite_health() {
  docker inspect \
    --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' \
    "$APPWRITE_API_CONTAINER" 2>/dev/null || true
}
