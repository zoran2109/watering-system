# Watering system web server

The /web-server folder contains web application that functions as a dashboard for simple watering system.

This readme explains the content of the /web-server folder and steps needed to host the web application on Raspberry Pi.
Although running the app on Raspberry was intended usage, you can run the application anywhere by running install.sh script.

## Content of /web-server
- **/frontend** - UI for dashboard written in React + Vite, for more info check [Frontend README](frontend/README.md)
- **/backend** - backend for dashboard app that controls watering written in Node.js + Express, for more info check [Backend README](backend/README.md)
- **/mosquitto** - folder that contains config for mosquitto MQTT broker
- **docker-compose.yml** - can be used to run the whole application in Docker containers with minimal setup. To use the docker-compose directly you must have docker and docker-compose installed on your system
- **install.sh** - script that installs prerequisites for running the web application on the system and afterwards it starts the server

## Hosting web server on Rasperry Pi
This part covers:
    - Installing headless Raspberry Pi OS and cloning /watering-system repository
    - Installing necessary dependencies and starting a web application on LAN
    - Optional - exposing the URL for the web app with Tailscale so the app can be accessed outside of LAN
    - Optional - setting GitHub actions so the app is redeployed when new commits are pushed to the repo

### Installing Raspberry Pi OS
1. Install the Rasperry Pi Imager on your system and plug the micro SSD card (that you'll use with your Raspberry Pi) to your computer.
2. In the Imager:
    - Set your Rasbperry Pi model
    - Choose Raspberry OS Lite as the operating system. In case of using RPi 3B, I've found that legacy 64-bit version works best
    - Select micro SSD card as storage
3. Before installing, in the settings set your WiFi settings, RaspberryPi username and password and your hostname. Also, enable SSH to be able to access the RPi remotely.
4. When the installation finishes, remove micro SSD and put it in the RPi and turn on the RPi.
5. Cnnecting to your RPi via SSH and clone this repo
When you turn on RPi for the first time, you should wait few minutes for OS to boot. If everthing succeeds, first step is to find RPi's local IP address. Since this tutorial isn't OS-agnostic I'll provide one way for doing it on Ubuntu (in the world of AI tools finding out the way is one prompt away):
    - Open the terminal
    - Scan network with: **nmap -sn 192.168.1.0/24** - but use your subnet that can be found with **ip route** command
    - Identify which IP is your RPi's
    - SSH into your RPi the following way: **ssh your_username@your_local_ip_address** and enter password
    - If everything works, prompt with hostname of your newly set RPi will show in terminal
    - Create /home/repo folder with **sudo mkdir /home/repo**
    - Navigate to /home/repo folder
    - Install git with: **sudo apt install git**
    - Clone this repository with: **sudo git clone https://github.com/zoran2109/watering-system.git**

### Start web server on Raspberry Pi
1. If you're not already, open terminal, SSH into your RPi from your computer the following way: **ssh your_username@your_local_ip_address** and enter password
2. Navigate to /home/repo/watering/web-server folder. In this folder there should be install.sh script.
3. Make the script executable: **sudo chmod +x ./install.sh**
4. Run the following to set the static IP, install the project's dependencies and running dockerized web-server:
- **export STATIC_IP=<WANTED_STATIC_IP>**
- **export ROUTER_IP=<YOUR_ROUTER_IP>**
- **export DNS_SERVER=<YOUR_DNS_SERVER>**
- **./install.sh**
Building docker compose file on RPi could last for a while.
5. Reboot the RPi with **sudo reboot** command for static IP to be set.
6. Server's frontend should be accessible on "http://localhost:80" in the RPi and on "http://<RPI_STATIC_IP_ADDRESS" over LAN.

### Setting Tailscale for remote access to web server (OPTIONAL)
To set remote access with Tailscale follow these steps:
1. Run **sudo apt update && sudo apt upgrade -y**
2. Install tailscale with **curl -fsSL https://tailscale.com/install.sh | sh**
3. When tailscale is installed, run **sudo tailscale up** to authenticate to tailscale
4. Tailscale will give a link that needs to be opened to authenticate
5. After succesful authentication, add devices (machines) to tailscale that you want to give access to the server:
- this requires installing tailscale on additional devices and authenticating with the same username - alternative is to this tailnet approach is exposing the server to the whole internet with [tailscale funnel](https://tailscale.com/kb/1223/funnel)
6. Run the following command to expose the server (assuming the docker-compose is up) to other devices in the tailnet: **sudo tailscale serve -bg --https=80 127.0.0.1:80**
7. Use the provided url to access the app remotely

### Setting GitHub Actions to automate deployment (OPTIONAL)
If you want automated redeployment of the web server when changes are pushed to the repo:
- check [/deploy README](../deploy/README.md) and follow the steps
