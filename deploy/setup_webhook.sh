#!/bin/bash

set -e
set -u

# Check for required env variables
: "${USERNAME:?USERNAME is not set}"

SERVICE_NAME=webhook
REPO_PATH=/home/repo/watering-system

# Copy systemd unit
cat <<EOF | sudo tee /etc/systemd/system/$SERVICE_NAME.service
[Unit]
Description=Webhook Auto Deploy
After=network.target

[Service]
ExecStart=/usr/bin/python3 $REPO_PATH/deploy/webhook.py
WorkingDirectory=$REPO_PATH/deploy
Restart=always
User=$USERNAME

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and start service
sudo systemctl daemon-reload
sudo systemctl enable $SERVICE_NAME
sudo systemctl start $SERVICE_NAME
sudo systemctl status $SERVICE_NAME
