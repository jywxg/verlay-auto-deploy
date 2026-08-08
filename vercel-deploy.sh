把 vercel-deploy.sh 修改成：

#!/bin/bash

deploy_verlay() {
    local VERCEL_TOKEN="$1"
    local COUNTRY="${2:-JP}"
    local DOMAIN="$3"

    echo "=== verlay 一键部署 ==="
    echo "部署区域: $COUNTRY"
    echo "域名: ${DOMAIN:-自动使用 Vercel 域名}"

    WORKDIR="/tmp/verlay"

    rm -rf "$WORKDIR"

    git clone --depth 1 https://github.com/vevc/verlay.git "$WORKDIR"

    cp "$(dirname "$0")/apply-region.js" "$WORKDIR/apply-region.js"

    cd "$WORKDIR" || exit 1

    node apply-region.js "$COUNTRY"

    echo "=== 第一次部署 ==="

    vercel deploy \
        --prod \
        --yes \
        --token "$VERCEL_TOKEN" \
        2>&1 | tee /tmp/verlay-deploy.log

    PROJECT_URL=$(grep -oE 'https://[a-zA-Z0-9.-]+\.vercel\.app' \
        /tmp/verlay-deploy.log | tail -1)

    if [ -z "$PROJECT_URL" ]; then
        echo "无法获取 Vercel 项目地址"
        exit 1
    fi

    UUID=$(node -e "console.log(require('crypto').randomUUID())")

    echo "UUID: $UUID"
    echo "Project: $PROJECT_URL"

    vercel link \
        --yes \
        --token "$VERCEL_TOKEN" \
        2>/dev/null || true

    echo "$UUID" | \
        vercel env add UUID production \
        --token "$VERCEL_TOKEN" 2>/dev/null || true

    echo "${DOMAIN:-$PROJECT_URL}" | \
        vercel env add DOMAIN production \
        --token "$VERCEL_TOKEN" 2>/dev/null || true

    echo "=== 第二次部署 ==="

    vercel deploy \
        --prod \
        --yes \
        --token "$VERCEL_TOKEN"

    echo
    echo "=============================="
    echo "部署完成"
    echo "=============================="
    echo "订阅地址:"
    echo "https://${DOMAIN:-$PROJECT_URL}/$UUID"
}

deploy_verlay "$@"
