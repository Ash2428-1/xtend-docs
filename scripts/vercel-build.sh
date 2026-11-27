#!/usr/bin/env bash
# Vercel build for xtend-docs: apply DB migrations (when a database is configured), then build the app.
set -euo pipefail

if [ -n "${NEXT_PRIVATE_DIRECT_DATABASE_URL:-}" ]; then
  echo "[vercel-build] Applying database migrations"
  npx prisma migrate deploy --schema packages/prisma/schema.prisma
else
  echo "[vercel-build] No database configured, skipping migrations"
fi

# Uploads from Windows (vercel CLI) lose the executable bit.
chmod +x apps/remix/.bin/*.sh

npx turbo run build --filter=@documenso/remix --force
