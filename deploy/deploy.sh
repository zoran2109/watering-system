#!/bin/bash
set -e

cd /home/repo/watering-system/web-server || exit 1

echo "🔁 Pulling latest changes..."
sudo git pull origin main

echo "🔻 Disabling Tailscale (port 80)..."
sudo tailscale serve --https=80 off

echo "🔻 Stopping containers..."
docker compose down --remove-orphans

echo "🚀 Rebuilding and starting containers..."
docker compose up -d --build

echo "🚀 Re-enabling Tailscale..."
sudo tailscale serve -bg --https=80 127.0.0.1:80

echo "✅ Deployment completed successfully!"
