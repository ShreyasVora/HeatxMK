#!/usr/bin/bash
set -uo pipefail

export PATH="/usr/bin:/bin:$PATH"

STATE_DIR="${XDG_STATE_HOME:-$HOME/.local/state}/heatxmk"

UVICORN_LOG="$STATE_DIR/uvicorn.log"
NGROK_LOG="$STATE_DIR/ngrok.log"
tail -n 30 $NGROK_LOG $UVICORN_LOG
