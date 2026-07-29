#!/bin/sh
set -e

echo "Waiting for database to be ready..."
MAX_RETRIES=30
RETRY_INTERVAL=2
count=0

until npx prisma migrate deploy 2>/dev/null; do
  count=$((count + 1))
  if [ $count -ge $MAX_RETRIES ]; then
    echo "Failed to connect to database after $MAX_RETRIES attempts"
    exit 1
  fi
  echo "Database not ready yet (attempt $count/$MAX_RETRIES)..."
  sleep $RETRY_INTERVAL
done

echo "Migrations applied successfully."

echo "Seeding database..."
npx prisma db seed 2>/dev/null && echo "Seed completed." || echo "Seed skipped or already applied."

exec node dist/index.js
