#!/usr/bin/env bash
# Post-deploy smoke check script
# Usage: DEPLOY_DOMAIN=example.com ./scripts/smoke-check.sh

set -euo pipefail

DEPLOY_DOMAIN="${DEPLOY_DOMAIN:-}"
if [ -z "$DEPLOY_DOMAIN" ]; then
  echo "Error: DEPLOY_DOMAIN is required"
  echo "Usage: DEPLOY_DOMAIN=example.com ./scripts/smoke-check.sh"
  exit 1
fi

BASE="https://$DEPLOY_DOMAIN"
FAILED=0
RESULTS=()

check() {
  local name="$1"
  local path="$2"
  local expected="$3"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE$path" || true)
  if [ "$code" = "$expected" ]; then
    RESULTS+=("{ \"name\": \"$name\", \"path\": \"$path\", \"status\": \"pass\", \"code\": $code }")
    echo "✓ $name ($path) → $code"
  else
    RESULTS+=("{ \"name\": \"$name\", \"path\": \"$path\", \"status\": \"fail\", \"expected\": $expected, \"actual\": $code }")
    echo "✗ $name ($path) → $code (expected $expected)"
    FAILED=1
  fi
}

check_redirect() {
  local name="$1"
  local path="$2"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE$path" || true)
  if [ "$code" = "302" ] || [ "$code" = "307" ]; then
    RESULTS+=("{ \"name\": \"$name\", \"path\": \"$path\", \"status\": \"pass\", \"code\": $code }")
    echo "✓ $name ($path) → $code (redirect)"
  else
    RESULTS+=("{ \"name\": \"$name\", \"path\": \"$path\", \"status\": \"fail\", \"expected\": \"302 or 307\", \"actual\": $code }")
    echo "✗ $name ($path) → $code (expected 302 or 307)"
    FAILED=1
  fi
}

check_json() {
  local name="$1"
  local path="$2"
  local expected_key="$3"
  local expected_value="$4"
  local response
  local actual_value
  response=$(curl -s "$BASE$path" || true)
  actual_value=$(echo "$response" | grep -o "\"$expected_key\":\"[^\"]*\"" | cut -d'"' -f4 || true)
  if [ "$actual_value" = "$expected_value" ]; then
    RESULTS+=("{ \"name\": \"$name\", \"path\": \"$path\", \"status\": \"pass\", \"code\": 200 }")
    echo "✓ $name ($path) → $expected_key=$expected_value"
  else
    RESULTS+=("{ \"name\": \"$name\", \"path\": \"$path\", \"status\": \"fail\", \"expected\": \"$expected_value\", \"actual\": \"$actual_value\" }")
    echo "✗ $name ($path) → $expected_key=$actual_value (expected $expected_value)"
    FAILED=1
  fi
}

echo "Smoke checking $BASE..."
echo ""

check "Homepage" "/" "200"
check "Work page" "/work" "200"
check "Engineering System" "/engineering-system" "200"
check "Build Log" "/build-log" "200"
check "About" "/about" "200"
check "Work With Me" "/work-with-me" "200"
check_redirect "Admin guard" "/admin"
check "Invalid room" "/room/invalid-token" "404"
check_json "Health check" "/api/health" "status" "healthy"

echo ""

cat <<EOF
{
  "domain": "$DEPLOY_DOMAIN",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "passed": $([ $FAILED -eq 0 ] && echo "true" || echo "false"),
  "checks": [
$(printf '%s,\n' "${RESULTS[@]}" | sed '$ s/,$//')
  ]
}
EOF

exit $FAILED
