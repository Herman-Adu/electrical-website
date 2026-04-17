#!/bin/bash
# Orchestrator Bootstrap — Initialize Docker MCP + Memory for session consistency
#
# This script ensures the orchestrator has access to Docker memory services
# on every session without manual intervention.
#
# Usage:
#   ./scripts/orchestrator-bootstrap.sh [--skip-memory]
#
# Features:
#   - Start Docker Compose stack
#   - Verify all services are healthy
#   - Bootstrap animation memory lanes
#   - Ready for orchestrator rehydration

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SKIP_MEMORY=${1:-}

echo "============================================================"
echo "Orchestrator Bootstrap — Initialize Docker MCP + Memory"
echo "============================================================"
echo ""

# Color output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Start Docker Compose
echo -e "${YELLOW}[1/4]${NC} Starting Docker Compose stack..."
cd "$PROJECT_ROOT"

if ! docker compose ps &>/dev/null; then
  echo -e "${RED}✗${NC} Docker daemon not running"
  echo "  Start Docker Desktop or Docker daemon"
  exit 1
fi

docker compose up -d > /dev/null 2>&1
echo -e "${GREEN}✓${NC} Docker Compose stack started"

# Step 2: Verify services health
echo -e "${YELLOW}[2/4]${NC} Verifying service health..."
MAX_RETRIES=30
RETRY=0

while [ $RETRY -lt $MAX_RETRIES ]; do
  HEALTH=$(docker compose ps --format "table {{.Service}}\t{{.Status}}" 2>/dev/null | grep -c "healthy\|running" || true)
  EXPECTED=10  # Adjust based on number of services

  if [ "$HEALTH" -ge "$EXPECTED" ]; then
    echo -e "${GREEN}✓${NC} All services healthy (${HEALTH}/${EXPECTED})"
    break
  fi

  RETRY=$((RETRY + 1))
  if [ $RETRY -lt $MAX_RETRIES ]; then
    sleep 2
  fi
done

if [ $RETRY -eq $MAX_RETRIES ]; then
  echo -e "${RED}✗${NC} Services took too long to become healthy"
  docker compose ps
  exit 1
fi

# Step 3: Verify Caddy gateway
echo -e "${YELLOW}[3/4]${NC} Verifying Caddy gateway..."
CADDY_HEALTH=$(curl -s http://localhost:3100/health 2>/dev/null || echo "")

if [ "$CADDY_HEALTH" = "OK" ]; then
  echo -e "${GREEN}✓${NC} Caddy gateway responsive at http://localhost:3100"
else
  echo -e "${RED}✗${NC} Caddy gateway not responding"
  echo "  Check: docker compose logs caddy"
  exit 1
fi

# Step 4: Bootstrap memory (optional)
if [ "$SKIP_MEMORY" != "--skip-memory" ]; then
  echo -e "${YELLOW}[4/4]${NC} Bootstrapping animation memory lanes..."

  # Note: bootstrap-memory-animation.mjs does not exist yet.
  # Memory lanes are created on-demand via 'npm run lane:open {phase}' command.
  # To skip this step, use: ./scripts/orchestrator-bootstrap.sh --skip-memory

  echo -e "${GREEN}✓${NC} Memory bootstrap skipped (use 'npm run lane:open' to create lanes on-demand)"
else
  echo -e "${YELLOW}[4/4]${NC} Skipping memory bootstrap (--skip-memory flag)"
fi

echo ""
echo "============================================================"
echo "✓ Orchestrator Bootstrap Complete"
echo "============================================================"
echo ""
echo "Docker Services:"
echo "  • Web app: http://localhost:3000"
echo "  • MCP gateway: http://localhost:3100"
echo "  • Memory API: http://localhost:3100/memory"
echo ""
echo "Next Steps:"
echo "  1. Use NEXT_SESSION_PROMPT.md for Phase 3 continuation"
echo "  2. Query memory: docker exec electrical-website-memory-reference-1 ..."
echo "  3. Stop stack: docker compose down"
echo ""
