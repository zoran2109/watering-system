# Automatic deployment (CD) of Web server on Raspberry Pi

To make web server automatically redeploy on RPi after latest changes in the repo follow these steps:
- Prerequisite: Tailscale installed on Rasperry Pi
1. SSH into RPi and move to /home/repo/watering-system/deploy folder
2. Set RPi user as env variable: **export USERNAME=<RPI_USERNAME>**
3. Make deploy.sh executable (it will be used to deploy new changes later): **sudo chmod +x deploy.sh**
4. Make setup_webhook.sh executable: **sudo chmod +x /home/repo/watering-system/deploy/setup_webhook.sh** and run it.
5. The webhook server should now run on port 9000. Expose with tailscale: **sudo tailscale funnel -bg 127.0.0.1:9000**
6. Add GitHub Webhook that will ping the webhook server
- Go to GitHub repo → Settings → Webhooks → Add Webhook:
- Payload URL: https://<your-pi>.ts.net:9000/
- Content type: application/json
- Secret: leave blank
- Events: Just push
7. GitHub webhook will ping the exposed server and server will start deploy.sh script that will pull the latest changes and rebuild the docker containers
