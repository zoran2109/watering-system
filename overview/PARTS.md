# Parts

## Parts used for watering system prototype

### Electronic parts and pump
- Raspberry Pi 3B+
- NodeMCU ESP8266 board
- 12V DC brushless submersible water pump (connects 8mm ID hose)
- 5V relay module
- several jumper wires
- few crocodile clips
- 12V DC power supply - I used 3A but for this setup it's not necessary
- 5V USB power supply
- USB-B cable
- plastic box (regular plastic box should probably do fine for this setup with only 12V)

### Hoses and splitters
Length of the hoses as well as number of hose connectors depend on the size of the terrace garden.

- 10mm or 11mm OD / 8mm ID hose for main line
- 6mm OD / 4mm ID hose for plants
- pneumatic hose connectors (10mm for the main valve, splits to 3x 6mm) - main 10/11mm hose will run through those connectors and 6mm hoses will split to plants
- a bucket :)

## Additional considerations - TODO
- pump choices - submersible, centrifugal?
- controlling the pump - relay vs mosfet?
- choosing the casing - IP65/IP66 enclosure?

## Possible projects - TODO
- making this without Rpi - Arudino-only with timer settings, sleeps until watering?
- controlling the system with 'proper', standard hoses

