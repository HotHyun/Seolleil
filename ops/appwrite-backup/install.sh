#!/usr/bin/env bash

set -Eeuo pipefail
umask 022

readonly SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly CONFIG_DIR='/etc/appwrite-backup'
readonly LIB_DIR='/usr/local/lib/appwrite-backup'
readonly BIN_DIR='/usr/local/sbin'
readonly SYSTEMD_DIR='/etc/systemd/system'

readonly -a TIMERS=(
  'appwrite-db-backup.timer'
  'appwrite-full-backup.timer'
  'appwrite-backup-maintenance.timer'
)

enable_timers=0
run_check=0

usage() {
  cat <<'USAGE'
Usage: sudo ./install.sh [--enable-timers] [--check]

  --enable-timers  Enable and start all three backup timers after installation.
  --check          Run appwrite-backup-status after installation.

Existing /etc/appwrite-backup/restic.env and restic-password files are never
created, printed, or overwritten by this installer.
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --enable-timers)
      enable_timers=1
      ;;
    --check)
      run_check=1
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
  shift
done

[[ "$EUID" -eq 0 ]] || { echo 'Run this installer with sudo.' >&2; exit 1; }

for required_path in \
  "$SOURCE_DIR/config/appwrite-backup.conf.example" \
  "$SOURCE_DIR/lib/common.sh" \
  "$SOURCE_DIR/scripts/appwrite-db-backup" \
  "$SOURCE_DIR/scripts/appwrite-full-backup" \
  "$SOURCE_DIR/scripts/appwrite-backup-maintenance" \
  "$SOURCE_DIR/scripts/appwrite-backup-status" \
  "$SOURCE_DIR/scripts/appwrite-backup-initialize" \
  "$SOURCE_DIR/scripts/appwrite-backup-restore-check"; do
  [[ -f "$required_path" ]] || { echo "Missing package file: $required_path" >&2; exit 1; }
done

active_timers=()

for timer in "${TIMERS[@]}"; do
  if systemctl is-active --quiet "$timer" 2>/dev/null; then
    active_timers+=("$timer")
    systemctl stop "$timer"
  fi
done

restart_previous_timers() {
  exit_code=$?
  trap - EXIT INT TERM

  for timer in "${active_timers[@]}"; do
    systemctl start "$timer" >/dev/null 2>&1 || true
  done

  exit "$exit_code"
}

trap restart_previous_timers EXIT INT TERM

install -d -o root -g root -m 0700 "$CONFIG_DIR"
install -d -o root -g root -m 0755 "$LIB_DIR"
install -d -o root -g root -m 0700 /var/lib/appwrite-backup

if [[ ! -e "$CONFIG_DIR/appwrite-backup.conf" ]]; then
  install -o root -g root -m 0600 \
    "$SOURCE_DIR/config/appwrite-backup.conf.example" \
    "$CONFIG_DIR/appwrite-backup.conf"
  echo "Installed new configuration: $CONFIG_DIR/appwrite-backup.conf"
else
  echo "Preserved existing configuration: $CONFIG_DIR/appwrite-backup.conf"
fi

install -o root -g root -m 0644 "$SOURCE_DIR/lib/common.sh" "$LIB_DIR/common.sh"

for script in \
  appwrite-db-backup \
  appwrite-full-backup \
  appwrite-backup-maintenance \
  appwrite-backup-status \
  appwrite-backup-initialize \
  appwrite-backup-restore-check; do
  install -o root -g root -m 0750 "$SOURCE_DIR/scripts/$script" "$BIN_DIR/$script"
done

for unit_path in "$SOURCE_DIR"/systemd/*; do
  install -o root -g root -m 0644 "$unit_path" "$SYSTEMD_DIR/$(basename "$unit_path")"
done

systemctl daemon-reload

if [[ "$enable_timers" == '1' ]]; then
  systemctl enable --now "${TIMERS[@]}"
else
  for timer in "${active_timers[@]}"; do
    systemctl start "$timer"
  done
fi

trap - EXIT INT TERM

echo 'Appwrite backup package installed.'

if [[ ! -r "$CONFIG_DIR/restic.env" || ! -r "$CONFIG_DIR/restic-password" ]]; then
  echo "NOTICE: configure $CONFIG_DIR/restic.env and restic-password before initialization."
fi

if [[ "$run_check" == '1' ]]; then
  "$BIN_DIR/appwrite-backup-status"
fi
