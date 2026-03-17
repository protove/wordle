#!/usr/bin/env sh
set -e

APP_JAR="${APP_JAR:-}"

# APP_JAR 자동 탐색: /app/*.jar → 없으면 /workspace/build/libs/*.jar
if [ -z "$APP_JAR" ]; then
  if ls /app/*.jar >/dev/null 2>&1; then
    APP_JAR="$(ls /app/*.jar | head -n1)"
  elif ls /workspace/build/libs/*.jar >/dev/null 2>&1; then
    APP_JAR="$(ls /workspace/build/libs/*.jar | head -n1)"
  else
    echo "[entrypoint] ERROR: cannot locate application JAR. Set APP_JAR or ensure the JAR is at /app/*.jar or /workspace/build/libs/*.jar"
    exit 1
  fi
fi

echo "[entrypoint] Starting Wordle Backend"
echo "[entrypoint] Using APP_JAR=$APP_JAR"
exec java -jar "$APP_JAR"