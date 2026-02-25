#!/usr/bin/env bash
# =============================================================================
# Dinheirologia Content Agent — Cron Runner
#
# Activates the Python virtual environment, runs the content agent pipeline,
# and logs output with timestamps.
#
# CRON SETUP (every 12 hours, at 07:00 and 19:00 local time):
#   0 7,19 * * * /Users/macbookjoaohomem/Documents/VSCode_Projects/dinheirologia/agent/run_agent.sh >> /Users/macbookjoaohomem/Documents/VSCode_Projects/dinheirologia/agent/logs/cron.log 2>&1
#
# To add to crontab:
#   crontab -e
#   (paste the line above)
#
# MANUAL RUN:
#   ./run_agent.sh
#   ./run_agent.sh --manual-only
#   ./run_agent.sh --rss-only
#   ./run_agent.sh --dry-run
#   ./run_agent.sh --init
# =============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
AGENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="${AGENT_DIR}/.venv"
PYTHON="${VENV_DIR}/bin/python"
LOG_DIR="${AGENT_DIR}/logs"
LOG_FILE="${LOG_DIR}/agent_$(date +%Y%m%d_%H%M%S).log"
ENV_FILE="${AGENT_DIR}/.env"

# ---------------------------------------------------------------------------
# Ensure log directory exists
# ---------------------------------------------------------------------------
mkdir -p "${LOG_DIR}"

# ---------------------------------------------------------------------------
# Logging helper
# ---------------------------------------------------------------------------
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

# ---------------------------------------------------------------------------
# Check .env exists
# ---------------------------------------------------------------------------
if [[ ! -f "${ENV_FILE}" ]]; then
    log "ERROR: .env file not found at ${ENV_FILE}"
    log "Copy .env.example to .env and fill in your API keys."
    exit 1
fi

# ---------------------------------------------------------------------------
# Set up virtual environment if it doesn't exist
# ---------------------------------------------------------------------------
if [[ ! -d "${VENV_DIR}" ]]; then
    log "Creating virtual environment at ${VENV_DIR}..."
    python3 -m venv "${VENV_DIR}"
    log "Virtual environment created."
fi

# ---------------------------------------------------------------------------
# Activate virtual environment
# ---------------------------------------------------------------------------
# shellcheck disable=SC1091
source "${VENV_DIR}/bin/activate"

# ---------------------------------------------------------------------------
# Install / upgrade dependencies
# ---------------------------------------------------------------------------
log "Checking dependencies..."
pip install --quiet --upgrade pip
pip install --quiet -r "${AGENT_DIR}/requirements.txt"
log "Dependencies OK."

# ---------------------------------------------------------------------------
# Run the agent (pass any CLI args through)
# ---------------------------------------------------------------------------
log "Starting Dinheirologia content agent..."
log "Args: ${*:-none}"
log "Output dir: $(grep CONTENT_OUTPUT_DIR "${ENV_FILE}" | cut -d= -f2 || echo '(not set)')"

cd "${AGENT_DIR}"

# Tee output to both stdout and the timestamped log file
"${PYTHON}" main.py "$@" 2>&1 | tee -a "${LOG_FILE}"
EXIT_CODE="${PIPESTATUS[0]}"

log "Agent finished with exit code ${EXIT_CODE}."

# ---------------------------------------------------------------------------
# Git commit and push (triggers Vercel auto-deploy)
# ---------------------------------------------------------------------------
if [[ "${EXIT_CODE}" -eq 0 ]]; then
    REPO_DIR="$(dirname "${AGENT_DIR}")"
    cd "${REPO_DIR}"

    # Check if there are new/changed article files
    CHANGED=$(git status --porcelain -- site/src/content/artigos/ 2>/dev/null | wc -l | tr -d ' ')
    if [[ "${CHANGED}" -gt 0 ]]; then
        log "Found ${CHANGED} new/changed article files. Committing and pushing..."
        git add site/src/content/artigos/
        git commit -m "content: agent published ${CHANGED} article(s) $(date +%Y-%m-%d_%H:%M)"
        git push origin main
        log "Push complete. Vercel will auto-deploy."
    else
        log "No new articles to commit."
    fi
fi

# ---------------------------------------------------------------------------
# Log rotation: keep only the last 30 log files
# ---------------------------------------------------------------------------
ls -t "${LOG_DIR}"/agent_*.log 2>/dev/null | tail -n +31 | xargs rm -f 2>/dev/null || true

exit "${EXIT_CODE}"
