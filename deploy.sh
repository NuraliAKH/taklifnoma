#!/usr/bin/env bash

set -Eeuo pipefail

PROJECT_DIR="/home/nurali/www/taklifnoma"
DEPLOY_LOG="$PROJECT_DIR/deploy.log"
LOCK_FILE="/tmp/taklifnoma-deploy.lock"

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo "A deploy is already running; skipping this request."
  exit 0
fi

exec >>"$DEPLOY_LOG" 2>&1

echo "--- Starting Deploy: $(date --iso-8601=seconds) ---"

cd "$PROJECT_DIR"
git pull --ff-only origin main

cd "$PROJECT_DIR/frontend"
npm ci
npm run build

cd "$PROJECT_DIR/backend"
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart taklifnoma-backend --update-env

echo "--- Deploy Complete: $(date --iso-8601=seconds) ---"
