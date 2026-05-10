#!/bin/sh
set -eu

if [ -n "${DATABASE_URL:-}" ]; then
  npx prisma db push --accept-data-loss >/tmp/prisma-db-push.log 2>&1 || {
    cat /tmp/prisma-db-push.log
    exit 1
  }
fi

exec node server.js
