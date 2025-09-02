# Parts

## Parts used for watering system prototype
Here I'm listing all the parts that I used to make the watering system. Of course, depending on your plans this list will vary.

### Electronic parts and pump
- Raspberry Pi 3B+ - it will be used to host the web server
- NodeMCU ESP8266 board - it will control the pump and communicate with web server
- 12V DC brushless submersible water pump (connects to 8mm ID hose)
- 5V relay module
- jumper wires (to connect the parts)
- crocodile clips (for prototyping, instead of soldering)
- 12V DC power supply - I used 3A but for this setup it's not necessary - needs for powering of the pump
- 5V USB power supply - to power NodeMCU
- USB-B cable (powers Arduino/NodeMCU, used to connect them with computer to export the code)
- plastic box (regular plastic box should probably do fine for this setup with only 12V)

### Hoses and splitters
Length of the hoses as well as number of hose connectors depend on the size of the terrace garden. You probably need about 10 meters of both the main line and smaller diamater hoses if you want to water 10-20 plants.

- 10mm or 11mm OD / 8mm ID hose for main line
- 6mm OD / 4mm ID hose for plants
- pneumatic hose connectors (10mm for the main valve, splits to 3x 6mm) - main 10/11mm hose will run through those connectors and 6mm hoses will split to plants
- a bucket :)

## Additional considerations
1. Pump choices - I used the submersible pump for this project because it was 'lying around', but other ones can also be used. I didn't investigate this enough to elaborate on it. This is worth checking because you may find something that suits your project better.
2. Controlling the pump - Likewise, I used relay because I had it and it was simple to connect, but there is also option to use MOSFET. In this setup you maybe wouldn't need to power NodeMcu and pump separately (I used 5V supply for NodeMCU/relay and 12V for pump)
3. I didn't quite make the 'finished product'. To finish it is should have probably make wires connecting to the submersible pump longer so the pump can go into the water souce - solder the wires, isolate them. And also NodeMCU and relay should be protected, so it's probably good to find higher quality enclosure (IP65/IP66 enclosure)

## Possible projects
1. For someone looking for simplicity - watering system can be made by omitting Raspberry Pi completely. In this scenario Arduino itself would control the pump, watering would be done in predefined interval and between waterings the system would go to sleep. This is maybe the most economic solution. It also can be improved by adding some buttons and LED display to set the timer.
2. If you don't need to pump the water, e.g. if you have a water pipe, solution in this repository can be almost completely reused - instead of pump Arduino/NodeMCU would control the solenoid valve.
