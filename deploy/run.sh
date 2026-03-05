#!/usr/bin/bash
set -uo pipefail

export PATH="/usr/bin:/bin:$PATH"

# -------------------------
# Config
# -------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
VENV_DIR="$PROJECT_ROOT/venv"
HOST="0.0.0.0"
PORT="8001"

STATE_DIR="${XDG_STATE_HOME:-$HOME/.local/state}/heatxmk"
mkdir -p "$STATE_DIR"

UVICORN_LOG="$STATE_DIR/uvicorn.log"
NGROK_LOG="$STATE_DIR/ngrok.log"
PIDFILE="$STATE_DIR/pids"
STATE_FILE="$STATE_DIR/heatxmk.env"

CONTACT_STATE_FILE="${XDG_STATE_HOME:-$HOME/.local/state}/contact/contact.env"

NGROK_BIN="/c/Users/Shreyas/AppData/Local/Microsoft/WindowsApps/ngrok.exe"

# -------------------------
# Resolve venv python explicitly (Windows-safe)
# -------------------------
if [[ -x "$VENV_DIR/Scripts/python.exe" ]]; then
  PYTHON_BIN="$VENV_DIR/Scripts/python.exe"
elif [[ -x "$VENV_DIR/bin/python" ]]; then
  PYTHON_BIN="$VENV_DIR/bin/python"
else
  echo "Could not find python in venv at:"
  echo "  $VENV_DIR/Scripts/python.exe"
  echo "  $VENV_DIR/bin/python"
  exit 1
fi

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }
is_alive() { kill -0 "$1" 2>/dev/null; }

child_pid_of() {
  local ppid="$1"
  ps -ef | awk -v ppid="$ppid" '$3==ppid {print $2; exit}'
}

# Write state atomically
write_state() {
  local tmp="${STATE_FILE}.tmp"
  {
    echo "PROJECT_ROOT=$PROJECT_ROOT"
    echo "PORT=$PORT"
    echo "UVICORN_WRAPPER_PID=$UVICORN_WRAPPER_PID"
    echo "NGROK_WRAPPER_PID=$NGROK_WRAPPER_PID"
    echo "UVICORN_PID=$UVICORN_PID"
    echo "NGROK_PID=$NGROK_PID"
    echo "UVICORN_LOG=$UVICORN_LOG"
    echo "NGROK_LOG=$NGROK_LOG"
  } > "$tmp"
  mv -f "$tmp" "$STATE_FILE"
}

# -------------------------
# CROSS-PROJECT CHECK
# -------------------------
if [[ -f "$CONTACT_STATE_FILE" ]]; then
  if ( source "$CONTACT_STATE_FILE" && [[ -n "${NGROK_PID:-}" ]] && kill -0 "$NGROK_PID" 2>/dev/null ); then
    echo "ERROR: Contact application is currently running and using ngrok."
    echo "Please stop Contact before running HeatxMK deployment."
    exit 1
  fi
fi

# If there is existing state, check if services are already running
if [[ -f "$STATE_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$STATE_FILE" || true

  if [[ -n "${UVICORN_PID:-}" && -n "${NGROK_PID:-}" ]] && is_alive "$UVICORN_PID" && is_alive "$NGROK_PID"; then
    log "Already running."
    log "  uvicorn PID: ${UVICORN_PID:-?} (wrapper: ${UVICORN_WRAPPER_PID:-?}) log=$UVICORN_LOG"
    log "  ngrok   PID: ${NGROK_PID:-?} (wrapper: ${NGROK_WRAPPER_PID:-?}) log=$NGROK_LOG"
    exit 0
  fi
fi

log "Starting HeatxMK services…"
log "Project: $PROJECT_ROOT"
log "Logs:    $STATE_DIR"
log "Python:  $PYTHON_BIN"
log "Ngrok:   $NGROK_BIN"

# Start uvicorn detached (wrapper PID)
(
  cd "$PROJECT_ROOT"
  nohup "$PYTHON_BIN" -m uvicorn main:app \
    --host "$HOST" \
    --port "$PORT" \
    --log-level info \
    --access-log \
    >>"$UVICORN_LOG" 2>&1
) </dev/null >/dev/null 2>&1 &
UVICORN_WRAPPER_PID=$!

# Start ngrok detached (wrapper PID)
(
  cd "$PROJECT_ROOT"
  nohup "$NGROK_BIN" http "$PORT" \
    --log="$NGROK_LOG" --log-format=logfmt --log-level=info \
    >/dev/null 2>&1
) </dev/null >/dev/null 2>&1 &
NGROK_WRAPPER_PID=$!

# Give the process table a moment to settle, then resolve "real" child PIDs
sleep 1
UVICORN_PID="$(child_pid_of "$UVICORN_WRAPPER_PID" || true)"
NGROK_PID="$(child_pid_of "$NGROK_WRAPPER_PID" || true)"

# If child PID lookup failed, fall back to wrapper PID (still useful)
UVICORN_PID="${UVICORN_PID:-$UVICORN_WRAPPER_PID}"
NGROK_PID="${NGROK_PID:-$NGROK_WRAPPER_PID}"

# Write state and legacy pidfile atomically
write_state

TMP_PIDFILE="${PIDFILE}.tmp"
printf "%s\n%s\n" "$UVICORN_PID" "$NGROK_PID" > "$TMP_PIDFILE"
mv -f "$TMP_PIDFILE" "$PIDFILE"

log "Started."
log "  uvicorn PID: $UVICORN_PID (wrapper: $UVICORN_WRAPPER_PID)"
log "  ngrok   PID: $NGROK_PID (wrapper: $NGROK_WRAPPER_PID)"
log "State: $STATE_FILE"
log "Run ./check.sh to verify status."
exit 0
