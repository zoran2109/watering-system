# Arduino code

## TODO
- Explain 'pump options' and sensor code
- Additional option - code for Arduino that doesn't rely on Raspberry

## Folders
- **/pump** - code for Arduino connected to the pump and relay that awaits for instructions from Raspberry Pi
- **/sensors** - code for sensors

## How to export the code to microcontrollers
1. Install Arduino IDE
2. Load wanted file to Arduino IDE
3. If needed, assign variables that will be used and depend on your system setup
4. If needed, install missing libraries to Arduino IDE
5. Connect you device (Arfuino, NodeMCU) to computer via USB (the one that can be used for data transmission)
6. Export the code to your device from Arduino IDE

## Using ESP8266 Node MCU in Arduino IDE
To sucessfully export code to Node MCU, there are some prerequisites.

Follow instructions in the [Stack Overflow thread](https://stackoverflow.com/questions/50080260/arduino-ide-cant-find-esp8266wifi-h-file):
>When programming the NODEMCU card with the Arduino IDE, you need to customize it and you must have selected the correct card.
̣>Open Arduino IDE and go to files and click on the preference in the Arduino IDE.
>Add the following link to the Additional Manager URLS section: "http://arduino.esp8266.com/stable/package_esp8266com_index.json" and press the OK button.
>Then click Tools> Board Manager. Type "ESP8266" in the text box to search and install the ESP8266 software for Arduino IDE.
