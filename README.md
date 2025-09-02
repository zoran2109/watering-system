# Terrace watering system

This repository contains code and instructions for creating a small automated watering system controlled by Raspberry Pi and Arduino/NodeMCU ESP8266. It's a hobby project that I started with some donated stuff (Raspberry Pi 3B, Arduino, pump, relay, etc. - thanks to donors!) and what I had at my disposal at a time somewhat directed the whole project. The idea was to host the web server on Rasbperry Pi that will be controller of the watering system. In this setup, pump for watering would be controlled from Arduino that would wait for instructions from Raspberry Pi. Also, I wanted to build this solution from ground up, not relying on existing ones with aim of learning something in the process.

## Content
1. [High-level solution](#1-high-level-solution)
2. [Tech stack](#2-tech-stack)
3. [Repository overview](#2-repository-overview)
4. [Getting started](#3-getting-started)

## 1. High-level solution
1. Arduino/NodeMCU ESP8266 controls water pump through relay.
2. Raspberry Pi hosts web server with UI/watering dashboard that shows logs and allows control of watering, either automatically or manually.
3. Communication between Arduino/NodeMCU ESP8266 and Raspberry Pi is done via serial port, by hosting servers over LAN or by publishing events on MQTT broker.

## 2. Repository overview
### Folder structure
- [**/arduino**](arduino) - Code for sensors and pumps with instructions how to set them up on Arduino/ESP8266
- [**/web-server**](web-server) - Fullstack JS web server with dashboard UI used for overview and control of watering. Has instructions and scripts to configure headless Raspberry Pi with dockerized server
- [**/deploy**](deploy) - Contains small server code, scripts and instructions to set-up automated redeployment of web-server after new commit is pushed
- [**/schemas**](schemas) - Diagrams for arduino controlled pump and sensors and sketches for hose setup for watering with instructions
- [**/overview**](overview) - Shows my implementation of the whole watering system with list of parts used, additional considerations, etc.

### Tech stack
1. Arduino - pump and sensor code written in C++ in Arduino IDE
2. Deployment
    - Python server listening for GitHub webhook call
    - Docker compose
3. Web server
    - Frontend
        - Vite + React + Vanilla JS
        - TailwindCSS
    - Backend
        - Node.js + Express + Vanilla JS
        - MQTT for events
        - SQLite

## 3. Getting started
This project has materials that can be used as an inspiration or base for a new project but it also documents how to set up the whole watering system from scratch.

To begin, here's suggested order:
1. [Form a list of needed parts](overview/PARTS.md) according to your needs
2. Choose and upload [arduino code for pump](arduino/pump) (e.g. [code](arduino/pump/mqtt-pump.cpp) for NodeMCU that will communicate via MQTT)
3. Follow [schemas](schemas) and assemble your watering system
4. [Set a remote server](web-server/README.md) to control the whole flow
