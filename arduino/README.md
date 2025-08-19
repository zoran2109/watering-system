# Arduino code

## TODO
- Add diagrams for electronic assembly that will complement the code + code for nodemcu/wifi/mqtt
1. pump on uno diagram
2. pump with nodemcu (with wifi connection + mqtt) + diagram (similar to uno)
3. sensor with batteries diagram + notes why this isn't optimal

## Folders
- pump - code for Arduino connected to pump and relay that is controlled from Raspberry Pi
- sensors - code for sensors

## How to export the code to microcontrollers
1. Install Arduino IDE
2. Load wanted file to Arduino IDE
3. Assign variables that will be used and depend on your system setup, if needed
4. Connect you device to computer via USB (if possible, the one used for data transmission)
5. Export the code to your device by clicking appropriate button

## Using ESP8266 Node MCU in Arduino IDE
To sucessfully export code to Node MCU, follow instructions in this thread:
https://stackoverflow.com/questions/50080260/arduino-ide-cant-find-esp8266wifi-h-file

"When programming the NODEMCU card with the Arduino IDE, you need to customize it and you must have selected the correct card.
Open Arduino IDE and go to files and click on the preference in the Arduino IDE.
Add the following link to the Additional Manager URLS section: "http://arduino.esp8266.com/stable/package_esp8266com_index.json" and press the OK button.
Then click Tools> Board Manager. Type "ESP8266" in the text box to search and install the ESP8266 software for Arduino IDE.
