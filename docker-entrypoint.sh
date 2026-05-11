#!/bin/sh
set -eu

if [ -n "${DATABASE_URL:-}" ]; then
  node node_modules/prisma/build/index.js db push --accept-data-loss --config=./prisma.config.ts >/tmp/prisma-db-push.log 2>&1 || {
    cat /tmp/prisma-db-push.log
    exit 1
  }

  npm run db:bootstrap >/tmp/prisma-bootstrap.log 2>&1 || {
    cat /tmp/prisma-bootstrap.log
    exit 1
  }
fi

exec node server.js
