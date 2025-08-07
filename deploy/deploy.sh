#!/bin/bash
set -e

cd /home/repo/watering-system/web-server

echo "🔁 Pulling latest changes..."
git pull origin main

echo "🔻 Stopping containers..."
docker compose down

echo "🚀 Rebuilding and starting containers..."
docker compose up -d --build
