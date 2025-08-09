#!/bin/bash
set -e

cd /home/repo/watering-system/web-server || exit 1

# Backup current resolv.conf
# Write a temporary resolv.conf with fallback DNS - Tailscale's may fail
sudo cp /etc/resolv.conf /tmp/resolv.conf.backup
echo "nameserver 1.1.1.1" | sudo tee /etc/resolv.conf > /dev/null
echo "nameserver 8.8.8.8" | sudo tee -a /etc/resolv.conf > /dev/null

echo "🔁 Pulling latest changes..."
sudo git pull origin main

# Restore original resolv.conf
sudo mv /tmp/resolv.conf.backup /etc/resolv.conf

echo "🔻 Disabling Tailscale (port 80)..."
sudo tailscale serve --https=80 off

echo "🔻 Stopping containers..."
docker compose down --remove-orphans

echo "🚀 Rebuilding and starting containers..."
docker compose up -d --build

echo "🚀 Re-enabling Tailscale..."
sudo tailscale serve -bg --https=80 127.0.0.1:80

echo "✅ Deployment completed successfully!"
