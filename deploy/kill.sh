#!/usr/bin/bash
set -uo pipefail
export PATH="/usr/bin:/bin:$PATH"

STATE_DIR="${XDG_STATE_HOME:-$HOME/.local/state}/heatxmk"
STATE_FILE="$STATE_DIR/heatxmk.env"
STOPPED_MARK="$STATE_DIR/last_stopped.txt"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }
is_alive() { kill -0 "$1" 2>/dev/null; }

taskkill_tree() {
  local pid="$1"
  /c/Windows/System32/taskkill.exe //PID "$pid" //T //F >/dev/null 2>&1 || true
}

kill_one_tree() {
  local pid="$1"
  local name="$2"

  if [[ -z "${pid:-}" ]]; then
    log "$name: no pid"
    return 0
  fi

  if ! is_alive "$pid"; then
    log "$name: already down (pid=$pid)"
    return 0
  fi

  log "$name: stopping (pid=$pid)…"
  kill "$pid" 2>/dev/null || true

  for _ in 1 2 3; do
    if ! is_alive "$pid"; then
      log "$name: stopped."
      return 0
    fi
    sleep 1
  done

  log "$name: still alive; killing process tree (taskkill /T /F)…"
  taskkill_tree "$pid"
  sleep 1

  if is_alive "$pid"; then
    log "$name: WARNING still alive after taskkill (pid=$pid)"
    return 1
  fi

  log "$name: killed."
  return 0
}

if [[ ! -f "$STATE_FILE" ]]; then
  log "No state file found ($STATE_FILE). Trying scan-based kill…"

  UV_PIDS="$(ps -ef | awk '/python/ && /-m/ && /uvicorn/ && /main:app/ {print $1}')"
  NG_PIDS="$(ps -ef | awk '/ngrok/ && /http/ && /8001/ {print $1}')"

  for p in $NG_PIDS; do taskkill_tree "$p"; done
  for p in $UV_PIDS; do taskkill_tree "$p"; done

  log "Done."
  exit 0
fi

# shellcheck disable=SC1090
source "$STATE_FILE" || true

rc=0
kill_one_tree "${NGROK_PID:-}" "ngrok" || rc=1
kill_one_tree "${UVICORN_PID:-}" "uvicorn" || rc=1

kill_one_tree "${NGROK_WRAPPER_PID:-}" "ngrok-wrapper" || true
kill_one_tree "${UVICORN_WRAPPER_PID:-}" "uvicorn-wrapper" || true

date '+%Y-%m-%d %H:%M:%S' > "$STOPPED_MARK" 2>/dev/null || true
log "Stopped. (State retained at $STATE_FILE; last stop at $STOPPED_MARK)"
exit "$rc"
