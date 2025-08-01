# Terrace watering system

TBD - This project and README are currently incomplete.

## High-level solution
1. Arduino controls relay and water pump.
2. Few ESP8266s will be used to power sensors that will read soil moisture.
3. Raspberry Pi will host small web server with watering dashboard that will show moisture data and allow watering control that can either be automatic or manual.
4. Arduino will be connected to Raspberry Pi's USB port and it will wait for watering instructions.
5. Sensors will send moisture data to Raspberry Pi via REST API calls on local network.

## Folder structure
- arduino - code for sensors and pump with instructions
- schemas - diagrams for arduino controlled pump and sensors and sketches for hose setup for watering with instructions
- web-server - web-server consisting of Node.js + Express + SQLite backend and Vite + Vanilla JS + React frontend. Has instructions to configure headless Raspberry Pi with dockerized server
- overview - shows my implementation of the whole watering system with list of parts used, additional considerations and so on

## How to start
You can either use this as an inspiration or base for your project or you can follow these steps:
1. Form a list to buy parts according to your needs (overview)
2. Upload arduino code to microcontrollers
3. Follow schematics and assemble you watering system with sensors
4. Set Raspberry Pi as remote server that controls the whole flow
