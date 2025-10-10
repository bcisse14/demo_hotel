#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-8000}"

echo "[entrypoint] Waiting for database to be ready..."
for i in {1..30}; do
  if php bin/console doctrine:query:sql "SELECT 1" >/dev/null 2>&1; then
    echo "[entrypoint] Database is available."
    break
  fi
  echo "[entrypoint] DB not ready yet, retry $i/30..."
  sleep 2
done

echo "[entrypoint] Installing PHP dependencies (no-dev, no-scripts)..."
composer install --no-dev --no-scripts --prefer-dist --no-interaction --optimize-autoloader || true

echo "[entrypoint] Running Doctrine migrations..."
php bin/console doctrine:migrations:migrate --no-interaction || true

echo "[entrypoint] Seeding application data (if needed)..."
php bin/console app:ensure-seed || true

echo "[entrypoint] Clearing and warming up cache..."
php bin/console cache:clear --no-warmup || true
php bin/console cache:warmup || true

echo "[entrypoint] Starting PHP server on 0.0.0.0:${PORT}"
exec php -S 0.0.0.0:"${PORT}" -t public public/index.php
