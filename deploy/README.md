# Continuous deployment (CD) of Web server on Raspberry Pi

Making changes to web-server running in docker-compose on Rasperry Pi frequently demands SSH-ing into Rasbperry, pulling the latest changes and rebuilding the Docker containers. This folder contains simple solution to do the mentioned things automatically.

## CD solution overview
1. Server on Raspberry (outside Docker container) exposed to the internet waits for information that there are new changes in the repo
2. Github hook is configured to call endpoint on Rasbperry server when new commit is pushed
3. Rasbperry Pi server starts the script that pulls the changes and rebuilds the containers

## Contents of /deploy folder
- **webhook-server.py** - server code that will, when triggered, start the deployment script
- **setup_webhook.sh** - runs webhook-server and makes is systemd process
- **deploy.sh** - pulls the latest changes of the repo and redeploys the web-server by running docker-compose, exposes the server on tailscale

## Setting up the webhook-server
To make web server automatically redeploy on RPi after latest changes in the repo follow these steps:
- **Prerequisite: Tailscale installed on Rasperry Pi**
1. SSH into RPi and move to **/home/repo/watering-system/deploy** folder
2. Set RPi user as env variable: `export USERNAME=<RPI_USERNAME>`
3. Make deploy.sh executable if it isn't already (it will be used to deploy new changes later): `sudo chmod +x deploy.sh`
4. Make setup_webhook.sh executable: `sudo chmod +x /home/repo/watering-system/deploy/setup_webhook.sh` and run it.
5. Enable tailscale funnel: `tailscale funnel`
6. The webhook server should now run on port 9000. Expose the server to the internet with tailscale: `sudo tailscale funnel --https 9000 -bg 127.0.0.1:9000`
7. Add GitHub Webhook that will ping the webhook server - go to GitHub repo → Settings → Webhooks → Add Webhook:
- Payload URL: **https://<your-pi>.ts.net:9000/**
- Content type: **application/json**
- Secret: leave blank
- Events: **Just push**
8. GitHub webhook will ping the exposed server and server will start deploy.sh script that will pull the latest changes and rebuild the docker containers

## Debugging
To see the logs of webhook server, run `journalctl -u webhook -f`
