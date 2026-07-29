#!/bin/bash
# vercel-deploy.sh - verlay 一键部署

deploy_verlay() {
  local VERCEL_TOKEN="$1"
  local COUNTRY="${2:-JP}"
  local DOMAIN="$3"

  echo "=== verlay 部署到 Vercel ==="
  echo "国家: $COUNTRY"

  cd /tmp || exit 1
  rm -rf verlay
  git clone --depth 1 https://github.com/vevc/verlay.git
  cd verlay || exit 1

  node apply-region.js "$COUNTRY"

  vercel deploy --prod --yes --token "$VERCEL_TOKEN" 2>&1 | tee /tmp/verlay-deploy.log
  PROJECT_URL=$(grep -oE 'https://[a-zA-Z0-9.-]+\.vercel\.app' /tmp/verlay-deploy.log | tail -1)

  UUID=$(node -e "console.log(require('crypto').randomUUID())")

  vercel link --yes --token "$VERCEL_TOKEN" 2>/dev/null || true

  echo "$UUID" | vercel env add UUID production --token "$VERCEL_TOKEN" 2>/dev/null || true
  echo "${DOMAIN:-$PROJECT_URL}" | vercel env add DOMAIN production --token "$VERCEL_TOKEN" 2>/dev/null || true

  vercel deploy --prod --yes --token "$VERCEL_TOKEN" > /dev/null 2>&1

  echo "=== 部署完成 ==="
  echo "订阅链接: https://${DOMAIN:-$PROJECT_URL}/$UUID"
}

deploy_verlay "$@"