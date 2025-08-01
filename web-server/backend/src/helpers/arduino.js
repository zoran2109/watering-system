import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

const port = new SerialPort({
  path: '/dev/ttyUSB0', // Update if needed
  baudRate: 9600,
  autoOpen: false,
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// Open port once
port.open((err) => {
  if (err) {
    console.error('❌ Failed to open port:', err.message);
  } else {
    console.log('✅ Serial port open');
  }
});

// Optional: Listen to data from Arduino
parser.on('data', (line) => {
  console.log(`📥 Arduino says: ${line}`);
});

// Exported function to write
export const sendToArduino = (commandStr) => {
  return new Promise((resolve, reject) => {
    if (!port.isOpen) {
      return reject(new Error('Serial port not open'));
    }

    console.log(`➡️ Sending: ${commandStr}`);
    port.write(commandStr + '\n', (err) => {
      if (err) {
        return reject(err);
      }
      port.drain(resolve); // ensure data is fully flushed
    });
  });
};
