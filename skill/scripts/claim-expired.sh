#!/bin/bash
# Claim funds from an expired escrow
set -e

API_URL="${ESCROW_API_URL:?Set ESCROW_API_URL}"
API_KEY="${ESCROW_API_KEY:?Set ESCROW_API_KEY}"

if [ $# -lt 1 ]; then
  echo "Usage: $0 <escrow_id>"
  exit 1
fi

ESCROW_ID="$1"

curl -s -X POST "${API_URL}/api/escrows/${ESCROW_ID}/claim-expired" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" | jq .
