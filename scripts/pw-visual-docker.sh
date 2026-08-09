#!/usr/bin/env bash
# Update visual baselines inside the Playwright Linux image (same as CI).
# Usage: npm run test:visual:update
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PW_VERSION="$(node -p "require('@playwright/test/package.json').version")"
IMAGE="mcr.microsoft.com/playwright:v${PW_VERSION}-jammy"

echo "image: $IMAGE"

docker run --rm --ipc=host \
  -v "$ROOT:/work" \
  -v modreq-pw-nm:/work/node_modules \
  -v modreq-pw-nm-webapp:/work/apps/webapp/node_modules \
  -v modreq-pw-nm-extapp:/work/apps/extapp/node_modules \
  -v modreq-pw-nm-imgapp:/work/apps/imgapp/node_modules \
  -v modreq-pw-nm-vidapp:/work/apps/vidapp/node_modules \
  -v modreq-pw-nm-wuiapp:/work/apps/wuiapp/node_modules \
  -v modreq-pw-nm-ui:/work/packages/ui/node_modules \
  -v modreq-pw-nm-eslint:/work/packages/eslint-config/node_modules \
  -w /work \
  -e CI=true \
  -e PLAYWRIGHT_BROWSERS_PATH=/ms-playwright \
  "$IMAGE" \
  bash -lc '
    set -euo pipefail
    npm ci
    npm run test:visual --workspace=webapp -- --update-snapshots
    npm run test:visual --workspace=extapp -- --update-snapshots
  '
