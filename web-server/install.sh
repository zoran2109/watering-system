#!/bin/bash

set -e
set -u

# Check for required env variables
: "${STATIC_IP:?STATIC_IP is not set}"
: "${ROUTER_IP:?ROUTER_IP is not set}"
: "${DNS_SERVER:?DNS_SERVER is not set}"

INTERFACE="wlan0"  # Change to eth0 if using Ethernet

echo "==> Setting static IP to $STATIC_IP on $INTERFACE..."

sudo tee /etc/dhcpcd.conf > /dev/null <<EOF
interface $INTERFACE
static ip_address=${STATIC_IP}/24
static routers=${ROUTER_IP}
static domain_name_servers=${DNS_SERVER}
EOF

echo "==> Installing Docker..."
curl -fsSL https://get.docker.com | sh

echo "==> Adding user '$USER' to docker group..."
sudo usermod -aG docker "$USER"

echo "==> Installing Docker Compose plugin..."
sudo apt-get update
sudo apt-get install -y docker-compose-plugin

echo "==> Starting Docker Compose from current directory: $(pwd)"
docker-compose up -d

echo "✅ Setup complete. Reboot recommended for static IP and Docker group to take effect."
