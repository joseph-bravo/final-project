#!/bin/sh

set -e

if [ -f "$PWD"/.env ]; then
# shellcheck source=/dev/null
  . "$PWD"/.env
fi

if [ -n "$DATABASE_URL" ]; then
  pg_dump -d "$DATABASE_URL" > database/savestate.sql

else
  echo 'no DATABASE_URL environment variable set' 1>&2
  exit 1
fi
