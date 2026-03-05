#!/usr/bin/bash
set -uo pipefail
export PATH="/usr/bin:/bin:$PATH"

STATE_DIR="${XDG_STATE_HOME:-$HOME/.local/state}/heatxmk"
STATE_FILE="$STATE_DIR/heatxmk.env"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }
is_alive() { kill -0 "$1" 2>/dev/null; }

descendants_of() {
  local root="$1"
  local frontier="$root"
  local seen=" $root "
  local out=""

  while [[ -n "$frontier" ]]; do
    local next=""
    for p in $frontier; do
      local kids
      kids="$(ps -ef | awk -v ppid="$p" '$3==ppid {print $2}')"
      for k in $kids; do
        if [[ "$seen" != *" $k "* ]]; then
          out+="$k"$'
'
          seen+=" $k "
          next+=" $k"
        fi
      done
    done
    frontier="$next"
  done

  printf "%s" "$out"
}

uv_up="DOWN"
ng_up="DOWN"
uvw_up="n/a"
ngw_up="n/a"

if [[ -f "$STATE_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$STATE_FILE" || true

  [[ -n "${UVICORN_PID:-}" ]] && is_alive "$UVICORN_PID" && uv_up="UP"
  [[ -n "${NGROK_PID:-}" ]] && is_alive "$NGROK_PID" && ng_up="UP"

  if [[ -n "${UVICORN_WRAPPER_PID:-}" ]]; then
    uvw_up="DOWN"; is_alive "$UVICORN_WRAPPER_PID" && uvw_up="UP"
  fi
  if [[ -n "${NGROK_WRAPPER_PID:-}" ]]; then
    ngw_up="DOWN"; is_alive "$NGROK_WRAPPER_PID" && ngw_up="UP"
  fi

  log "HeatxMK status (from state):"
  echo "  uvicorn: $uv_up  pid=${UVICORN_PID:-<none>} wrapper=${UVICORN_WRAPPER_PID:-<none>} (wrapper $uvw_up)"
  echo "  ngrok:   $ng_up  pid=${NGROK_PID:-<none>} wrapper=${NGROK_WRAPPER_PID:-<none>} (wrapper $ngw_up)"
else
  log "No state file at $STATE_FILE"
fi

uv_scan=""
ng_scan=""

if [[ -n "${UVICORN_WRAPPER_PID:-}" ]]; then
  uv_scan="$(descendants_of "$UVICORN_WRAPPER_PID" | tr '
' ' ' | sed 's/ *$//')"
fi
if [[ -n "${NGROK_WRAPPER_PID:-}" ]]; then
  ng_scan="$(descendants_of "$NGROK_WRAPPER_PID" | tr '
' ' ' | sed 's/ *$//')"
fi

echo
log "Process scan (descendants of wrappers):"
echo "  uvicorn pids: ${uv_scan:-<none found>}"
echo "  ngrok   pids: ${ng_scan:-<none found>}"

uv_present=0; ng_present=0
[[ -n "${uv_scan:-}" ]] && uv_present=1
[[ -n "${ng_scan:-}" ]] && ng_present=1

if [[ $uv_present -eq 1 && $ng_present -eq 1 ]]; then exit 0; fi
if [[ $uv_present -eq 0 && $ng_present -eq 0 ]]; then exit 1; fi
exit 2
