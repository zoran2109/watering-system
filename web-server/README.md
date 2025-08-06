# Watering system web server

This repo contains web application that functions as dashboard for simple watering system.

In this file I'll shortly explain the content in the repo and steps needed to host this application on Raspberry Pi.
Although running the app on Raspberry was intended usage, you can run the application anywhere by running install.sh script.

## Content of the repo
The **frontend and backend folders** contain the application code. To see details about them, please check their README files:
1. Frontend README explains how the simple dashboard UI was made and how it works
2. Backend README explains the endpoint structure, how it communicates with UI, sensors and Arduino controlling the pump

In addition to web application code, there is **docker-compose file** that can be used to run the whole application with Docker with minimal setup.
To use it directly you must have docker and docker-compose installed on your system.

Also, there is **install.sh script** that will install prerequisites for running the web app on the system and start the server.

## Hosting web server on Rasperry Pi
This part will cover:
    - Installing headless Raspberry Pi OS and cloning this repository
    - Installing necessary dependencies and starting a web server on LAN
    - Optional - exposing the URL for the web app with Tailscale so the app can be accessed outside of LAN
    - Optional - setting GitHub actions so the app is redeployed when new commits are pushed to the repo

### Installing Raspberry Pi OS
1. Install the Rasperry Pi Imager on your system and plug the micro SSD card (that you'll use with your Raspberry Pi) to your computer.
2. In the Imager:
    - Set your Rasbperry Pi model
    - Choose Raspberry OS Lite as the operating system. Since I'm using RPi 3B, I've found that legacy 64-bit version works best in my case
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
    - Clone this repository with: **git clone https://github.com/zoran2109/watering-system.git**

### Start web server on Raspberry Pi
1. If you're not already, open terminal, SSH into your RPi from your computer the following way: **ssh your_username@your_local_ip_address** and enter password
2. Navigate to /home/repo/watering/web-server folder. In this folder there should be install.sh script.
3. Make the script executable: **sudo chmod +x ./install.sh**
4. Run the following to set the static IP, install the project's dependencies and running dockerized web-server:
export STATIC_IP=<WANTED_STATIC_IP>
export ROUTER_IP=<YOUR_ROUTER_IP>
export DNS_SERVER=<YOUR_DNS_SERVER>
./install.sh
Building docker compose file on RPicould last for a while.
5. Reboot the RPi with **sudo reboot** command for static IP to be set.
6. Your server's frontend should be accessible on "http://localhost:80" in the RPi and on "http://<RPI_STATIC_IP_ADDRESS" on LAN.

### Setting Tailscale for remote access to web server (OPTIONAL)
TODO

### Setting GitHub actions for Continuous Integration (OPTIONAL)
TODO

